# IFT3225 — Phase 1 : Infrastructure de collecte

API Express connectée à MongoDB Atlas pour collecter, authentifier, persister et consulter des données d'ambiance sonore en quasi temps réel.

**Lieu de collecte :** `bibliotheque-udem`

---

## Prérequis

- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur
- **MongoDB Atlas** — un cluster gratuit suffit (M0)
- **Phyphox** — application mobile pour la collecte sonore (iOS / Android)
- **Postman** — pour tester les endpoints manuellement

---

## Installation

```bash
npm install
```

Copier le fichier d'environnement et remplir les valeurs :

```bash
cp .env.example .env
```

Insérer les données de démonstration :

```bash
npm run seed
```

Démarrer le serveur :

```bash
npm run dev   # développement (nodemon)
npm start     # production
```

Le serveur tourne par défaut sur `http://localhost:3000`.

---

## Variables d'environnement

| Variable      | Description                          | Exemple                                      |
| ------------- | ------------------------------------ | -------------------------------------------- |
| `PORT`        | Port du serveur                      | `3000`                                       |
| `MONGODB_URI` | URI de connexion MongoDB Atlas       | `mongodb+srv://user:pass@cluster/ift3225...` |

---

## Authentification

Les endpoints d'écriture sont protégés par une clé API transmise dans l'en-tête HTTP :

```
x-api-key: <votre_clé_api>
```

La clé API est générée automatiquement lors de la création d'un appareil (`POST /api/devices`). Le script `npm run seed` affiche une clé de test dans la console.

| Situation       | Code HTTP |
| --------------- | --------: |
| Clé API absente |     `401` |
| Clé API invalide |    `403` |
| Clé API valide  | Autorisé  |

---

## Endpoints

### Appareils

| Méthode | Endpoint        | Auth | Description                         |
| ------- | --------------- | ---- | ----------------------------------- |
| `POST`  | `/api/devices`  | Non  | Créer un appareil et obtenir une clé API |
| `GET`   | `/api/devices`  | Non  | Lister tous les appareils (sans clé API) |

#### POST /api/devices

```json
{
  "name": "iPhone de collecte",
  "location": "bibliotheque-udem"
}
```

Réponse `201` :

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "iPhone de collecte",
    "location": "bibliotheque-udem",
    "apiKey": "abc123..."
  }
}
```

---

### Mesures sonores

| Méthode | Endpoint              | Auth | Description                         |
| ------- | --------------------- | ---- | ----------------------------------- |
| `POST`  | `/api/measurements`   | Oui  | Enregistrer une mesure sonore       |
| `GET`   | `/api/measurements`   | Non  | Consulter les mesures (avec filtres) |

#### POST /api/measurements

En-tête requis : `x-api-key: <clé>`

```json
{
  "type": "sound_level",
  "value": 55.4,
  "unit": "dB",
  "location": "bibliotheque-udem",
  "timestamp": "2026-05-27T09:30:00.000Z"
}
```

#### GET /api/measurements

Paramètres de filtre optionnels :

| Paramètre  | Type     | Description                    |
| ---------- | -------- | ------------------------------ |
| `location` | string   | Filtrer par lieu               |
| `type`     | string   | Filtrer par type (`sound_level`) |
| `from`     | ISO 8601 | Date de début                  |
| `to`       | ISO 8601 | Date de fin                    |
| `limit`    | int      | Nombre max de résultats (≤ 500) |

Exemple :

```
GET /api/measurements?location=bibliotheque-udem&limit=50
```

---

### Observations environnementales

| Méthode | Endpoint             | Auth | Description                              |
| ------- | -------------------- | ---- | ---------------------------------------- |
| `POST`  | `/api/observations`  | Oui  | Enregistrer une observation              |
| `GET`   | `/api/observations`  | Non  | Consulter les observations (avec filtres) |

#### POST /api/observations

En-tête requis : `x-api-key: <clé>`

```json
{
  "location": "bibliotheque-udem",
  "proximity": "near",
  "vibe": "busy",
  "notes": "Plusieurs personnes discutent proche du téléphone.",
  "timestamp": "2026-05-27T12:00:00.000Z"
}
```

Valeurs acceptées pour `proximity` : `near`, `medium`, `far`

Valeurs acceptées pour `vibe` : `calm`, `normal`, `busy`, `noisy`

#### GET /api/observations

Paramètres de filtre optionnels :

| Paramètre   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `location`  | string   | Filtrer par lieu                     |
| `proximity` | string   | Filtrer par proximité                |
| `vibe`      | string   | Filtrer par vibe                     |
| `from`      | ISO 8601 | Date de début                        |
| `to`        | ISO 8601 | Date de fin                          |
| `limit`     | int      | Nombre max de résultats (≤ 500)      |

---

### Ambiance sémantique

Ces endpoints agrègent mesures et observations pour répondre à des questions concrètes. Aucune authentification requise.

| Méthode | Endpoint                                  | Description                                 |
| ------- | ----------------------------------------- | ------------------------------------------- |
| `GET`   | `/api/ambiance/:location/summary`         | Résumé de l'ambiance des 30 dernières minutes |
| `GET`   | `/api/ambiance/:location/history`         | Évolution sonore par tranches de 10 minutes |
| `GET`   | `/api/ambiance/:location/quiet-hours`     | Les 3 périodes les plus calmes du lieu      |

#### GET /api/ambiance/:location/summary

```
GET /api/ambiance/bibliotheque-udem/summary
```

Réponse `200` :

```json
{
  "success": true,
  "data": {
    "location": "bibliotheque-udem",
    "averageSoundLevel": 48.1,
    "unit": "dB",
    "vibe": "normal",
    "proximity": "medium",
    "classification": "normal",
    "window": "last_30_minutes"
  }
}
```

#### GET /api/ambiance/:location/history

Paramètre optionnel `last` : durée à analyser (ex. `30m`, `3h`). Défaut : `3h`.

```
GET /api/ambiance/bibliotheque-udem/history?last=3h
```

Réponse `200` :

```json
{
  "success": true,
  "data": {
    "location": "bibliotheque-udem",
    "last": "3h",
    "interval": "10min",
    "points": [
      {
        "time": "2026-05-27T09:30:00.000Z",
        "averageSoundLevel": 42.5,
        "classification": "calm"
      }
    ]
  }
}
```

#### GET /api/ambiance/:location/quiet-hours

```
GET /api/ambiance/bibliotheque-udem/quiet-hours
```

Réponse `200` :

```json
{
  "success": true,
  "data": {
    "location": "bibliotheque-udem",
    "quietHours": [
      {
        "period": "09:00-10:00",
        "averageSoundLevel": 42.5,
        "classification": "calm"
      }
    ]
  }
}
```

---

## Format des réponses

### Succès

```json
{
  "success": true,
  "data": {}
}
```

### Erreur

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ location est obligatoire."
  }
}
```

### Codes HTTP

| Code  | Signification             |
| ----: | ------------------------- |
| `200` | Requête réussie           |
| `201` | Ressource créée           |
| `400` | Données invalides         |
| `401` | Clé API absente           |
| `403` | Clé API invalide          |
| `404` | Ressource introuvable     |
| `500` | Erreur interne du serveur |

---

## Structure du projet

```
src/
  index.js                  # Point d'entrée
  app.js                    # Configuration Express
  config/db.js              # Connexion MongoDB
  models/                   # Schémas Mongoose
  controllers/              # Logique métier
  routes/                   # Définition des endpoints
  middlewares/              # Auth, validation, erreurs
  utils/generateApiKey.js   # Générateur de clé API
scripts/
  seed.js                   # Données de démonstration
  bridge.js                 # Collecte Phyphox → API
docs/
  protocole.md              # Protocole API (Tâche 2)
  collecte-plan.md          # Plan de collecte (Tâche 1)
manual_observations.csv     # Observations manuelles de secours
```

---

## Collecte des données (bridge Phyphox)

Le script `scripts/bridge.js` achemine les mesures sonores du téléphone vers l'API. Il interroge l'API REST de Phyphox à intervalle régulier et envoie chaque valeur via `POST /api/measurements`.

**Côté téléphone :**

1. Ouvrir l'expérience « Intensité sonore » dans Phyphox
2. Menu (⋮) → « Activer l'accès distant »
3. Noter l'adresse affichée (ex. `http://192.168.1.42:8080`) — le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi
4. Démarrer la mesure (▶)

**Côté ordinateur :**

Renseigner `PHYPHOX_URL` et `API_KEY` dans `.env` (voir `.env.example`), puis :

```bash
npm run bridge
```

Le buffer lu par défaut est `dB`. Si aucune valeur n'est reçue, vérifier le nom exact du buffer en ouvrant `http://<ip-telephone>:80/config` dans un navigateur et ajuster `PHYPHOX_BUFFER`.

**Fallback manuel :** si la collecte automatique échoue, saisir les observations dans `manual_observations.csv`, qui peut ensuite être importé via le script seed ou rejoué manuellement.

---

## Tests avec Postman

1. Lancer le serveur (`npm run dev`) et peupler la base (`npm run seed`)
2. La console affiche une clé API de test — la copier
3. Dans Postman, créer une collection et tester dans l'ordre suivant :

**Créer un appareil :**
```
POST http://localhost:3000/api/devices
Body (JSON) : { "name": "iPhone de collecte", "location": "bibliotheque-udem" }
→ Réponse 201 + apiKey dans la réponse
```

**Envoyer une mesure (avec clé API) :**
```
POST http://localhost:3000/api/measurements
Header : x-api-key: <clé copiée>
Body (JSON) : { "type": "sound_level", "value": 55.4, "unit": "dB", "location": "bibliotheque-udem", "timestamp": "2026-05-27T09:30:00.000Z" }
→ Réponse 201
```

**Tester l'authentification :**
```
POST http://localhost:3000/api/measurements  (sans en-tête x-api-key)
→ Réponse 401

POST http://localhost:3000/api/measurements  (x-api-key: cle-invalide)
→ Réponse 403
```

**Consulter l'ambiance :**
```
GET http://localhost:3000/api/ambiance/bibliotheque-udem/summary
GET http://localhost:3000/api/ambiance/bibliotheque-udem/history?last=3h
GET http://localhost:3000/api/ambiance/bibliotheque-udem/quiet-hours
→ Réponse 200 avec données agrégées
```

---

## Données de démonstration

Le script seed insère :

- 2 appareils (matin et midi) sur `bibliotheque-udem`
- 8 mesures sonores réparties sur 3 sessions
- 9 observations environnementales issues du fichier CSV

Les clés API générées sont affichées dans la console après `npm run seed`.
