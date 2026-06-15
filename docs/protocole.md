# Tâche 2 — Conception du protocole API

## 1. Objectif du protocole

Ce protocole définit les règles de communication entre les clients HTTP, le serveur Express et la base de données MongoDB Atlas.
L’API permet de recevoir, authentifier, persister et consulter des données d’ambiance collectées dans un lieu réel.

Le lieu choisi pour la phase 1 est :

```text
bibliotheque-udem
```

Le système reçoit deux types de données :

* des mesures sonores collectées avec phyphox;
* des observations environnementales saisies avec une méthode mixte.

---

## 2. Ressources principales

| Ressource      | Rôle                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `devices`      | Représente les téléphones ou appareils autorisés à envoyer des données                     |
| `measurements` | Représente les mesures sonores collectées avec phyphox                                     |
| `observations` | Représente les données environnementales : proximité humaine, vibe, notes                  |
| `ambiance`     | Vue dérivée qui agrège les mesures et observations pour produire des résultats sémantiques |

La ressource `ambiance` ne stocke pas directement de données. Elle calcule ses réponses à partir des collections `measurements` et `observations`.

---
### important :
Les Clés secrets ne sont pas inclus dans le dépôt GitHub. 
Pour exécuter le projet, créer un fichier .env à partir de .env.example et remplir les variables nécessaires.

Une clé API peut être générée avec POST /api/devices.

## 3. Conventions générales

### Préfixe des endpoints

Tous les endpoints commencent par :

```text
/api
```

### Format des dates

Les dates utilisent le format ISO 8601.

Exemple :

```text
2026-05-27T09:30:00.000Z
```

Le champ `timestamp` représente le moment de la mesure ou de l’observation.
Le serveur ajoute aussi un champ `receivedAt` pour représenter le moment où la donnée est reçue.

### Format des réponses réussies

```json
{
  "success": true,
  "data": {}
}
```

### Format des erreurs

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ location est obligatoire."
  }
}
```

### Codes HTTP utilisés

|  Code | Signification             |
| ----: | ------------------------- |
| `200` | Requête réussie           |
| `201` | Ressource créée           |
| `400` | Données invalides         |
| `401` | Clé API absente           |
| `403` | Clé API invalide          |
| `404` | Ressource introuvable     |
| `500` | Erreur interne du serveur |

---

## 4. Endpoints de gestion des appareils

### Créer un appareil

```http
POST /api/devices
```

Corps attendu :

```json
{
  "name": "iPhone de collecte",
  "location": "bibliotheque-udem"
}
```

Réponse `201 Created` :

```json
{
  "success": true,
  "data": {
    "id": "device_id",
    "name": "iPhone de collecte",
    "location": "bibliotheque-udem",
    "apiKey": "generated_api_key"
  }
}
```

Remarque : en phase 1, cet endpoint n’est pas protégé. Cette limite sera identifiée dans le rapport.

### Lister les appareils

```http
GET /api/devices
```

Réponse `200 OK` :

```json
{
  "success": true,
  "data": [
    {
      "id": "device_id",
      "name": "iPhone de collecte",
      "location": "bibliotheque-udem"
    }
  ]
}
```

---

## 5. Endpoints de collecte

### Ajouter une mesure sonore

```http
POST /api/measurements
```

Endpoint protégé par `x-api-key`.

Corps attendu :

```json
{
  "type": "sound_level",
  "value": 55.4,
  "unit": "dB",
  "location": "bibliotheque-udem",
  "timestamp": "2026-05-27T09:30:00.000Z"
}
```

Réponse `201 Created` :

```json
{
  "success": true,
  "data": {
    "id": "measurement_id",
    "type": "sound_level",
    "value": 55.4,
    "unit": "dB",
    "location": "bibliotheque-udem",
    "timestamp": "2026-05-27T09:30:00.000Z",
    "receivedAt": "2026-05-27T09:30:02.000Z"
  }
}
```

### Ajouter une observation environnementale

```http
POST /api/observations
```

Endpoint protégé par `x-api-key`.

Corps attendu :

```json
{
  "location": "bibliotheque-udem",
  "proximity": "near",
  "vibe": "busy",
  "notes": "Plusieurs personnes discutent proche du téléphone.",
  "timestamp": "2026-05-27T12:00:00.000Z"
}
```

Valeurs acceptées pour `proximity` :

```text
near, medium, far
```

Valeurs acceptées pour `vibe` :

```text
calm, normal, busy, noisy
```

Réponse `201 Created` :

```json
{
  "success": true,
  "data": {
    "id": "observation_id",
    "location": "bibliotheque-udem",
    "proximity": "near",
    "vibe": "busy",
    "notes": "Plusieurs personnes discutent proche du téléphone.",
    "timestamp": "2026-05-27T12:00:00.000Z",
    "receivedAt": "2026-05-27T12:00:02.000Z"
  }
}
```

---

## 6. Endpoints de consultation

### Consulter les mesures

```http
GET /api/measurements
```

Filtres possibles :

```text
location
type
from
to
limit
```

Exemple :

```http
GET /api/measurements?location=bibliotheque-udem&type=sound_level&limit=50
```

### Consulter les observations

```http
GET /api/observations
```

Filtres possibles :

```text
location
proximity
vibe
from
to
limit
```

Exemple :

```http
GET /api/observations?location=bibliotheque-udem&vibe=calm
```

---

## 7. Endpoints sémantiques `/ambiance`

Les endpoints `/ambiance` ne retournent pas seulement des données brutes. Ils répondent à des questions concrètes sur l’ambiance du lieu.

### Résumé actuel de l’ambiance

```http
GET /api/ambiance/:location/summary
```

Exemple :

```http
GET /api/ambiance/bibliotheque-udem/summary
```

Retourne :

* la moyenne sonore récente;
* la dernière vibe observée;
* la proximité humaine récente;
* une classification globale de l’ambiance.

Réponse exemple :

```json
{
  "success": true,
  "data": {
    "location": "bibliotheque-udem",
    "averageSoundLevel": 58.4,
    "unit": "dB",
    "vibe": "normal",
    "proximity": "medium",
    "classification": "normal",
    "window": "last_30_minutes"
  }
}
```

### Historique de l’ambiance

```http
GET /api/ambiance/:location/history?last=3h
```

Exemple :

```http
GET /api/ambiance/bibliotheque-udem/history?last=3h
```

Retourne l’évolution du niveau sonore par tranches de temps.

Réponse exemple :

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
        "averageSoundLevel": 45.2,
        "classification": "calm"
      }
    ]
  }
}
```

### Heures calmes

```http
GET /api/ambiance/:location/quiet-hours
```

Exemple :

```http
GET /api/ambiance/bibliotheque-udem/quiet-hours
```

Retourne les périodes où le lieu est généralement plus calme.

Réponse exemple :

```json
{
  "success": true,
  "data": {
    "location": "bibliotheque-udem",
    "quietHours": [
      {
        "period": "09:30-09:50",
        "averageSoundLevel": 42.1,
        "classification": "calm"
      }
    ]
  }
}
```

---

## 8. Authentification

Les endpoints d’écriture sont protégés par une clé API transmise dans l’en-tête HTTP :

```http
x-api-key: generated_api_key
```

Endpoints protégés :

```text
POST /api/measurements
POST /api/observations
```

Comportement attendu :

| Situation        |              Code |
| ---------------- | ----------------: |
| Clé API absente  |             `401` |
| Clé API invalide |             `403` |
| Clé API valide   | Requête autorisée |

Les endpoints d’écriture POST /api/measurements et POST /api/observations sont protégés par une clé API transmise dans l’en-tête x-api-key.

Trois cas ont été testés avec Postman :
- absence de x-api-key : réponse 401 Unauthorized;
- clé API invalide : réponse 403 Forbidden;
- clé API valide : réponse 201 Created.

Cela confirme que le middleware d’authentification bloque les requêtes non autorisées et accepte uniquement les devices enregistrés.

En phase 1, `POST /api/devices` n’est pas protégé. Cette faille permettrait à n’importe quel client de créer un appareil et d’obtenir une clé API. Une solution future serait de protéger cet endpoint avec une clé administrateur ou un compte d’administration.

---

## 9. Logique d’agrégation

Les endpoints sémantiques utilisent les mesures sonores et les observations environnementales pour calculer une classification.

Classification proposée :

| Niveau sonore moyen | Classification |
| ------------------: | -------------- |
|      moins de 45 dB | `calm`         |
|          45 à 60 dB | `normal`       |
|          60 à 75 dB | `busy`         |
|       plus de 75 dB | `noisy`        |

La classification finale peut aussi tenir compte de la dernière observation humaine disponible, notamment la valeur `vibe`.

---

## 10. Gestion des lieux

La création des lieux sera implicite.
Un lieu est reconnu lorsqu’il apparaît dans une mesure, une observation ou un appareil.

Exemple :

```text
bibliotheque-udem
```

Ce choix simplifie la phase 1, car il évite de créer une ressource supplémentaire `/locations`.

---

## 11. Limites et évolutions possibles

Les mesures phyphox peuvent ne pas être parfaitement étalonnées. L'expérience « Intensité sonore » de phyphox exprime le niveau sonore en dB SPL, dont le point de référence est 20 µPa (seuil de l'audition humaine). Sur cette échelle, les valeurs valides sont positives (0 dB = seuil d'audition, conversation normale ≈ 60–70 dB). Une valeur négative indiquerait un niveau sous le seuil de l'audition, ce qui est physiquement improbable dans un lieu réel et traduit plutôt un défaut d'étalonnage du microphone. De telles valeurs sont donc considérées comme invalides : le modèle `measurements` rejette les valeurs négatives. Les mesures retenues sont utilisées comme indicateurs comparatifs du niveau sonore ambiant entre différentes périodes.

La collecte environnementale contient une partie manuelle, donc elle peut être subjective.

L’endpoint `POST /api/devices` non protégé est une vulnérabilité connue de la phase 1. Une amélioration future serait d’exiger une clé administrateur pour créer un appareil.

La gestion des lieux pourrait aussi être améliorée avec une ressource dédiée `/api/locations`.
