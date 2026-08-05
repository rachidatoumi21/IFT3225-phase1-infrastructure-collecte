# IFT3225 — Ambiance API — 

Projet réalisé dans le cadre du cours **IFT3225 — Technologies de l’Internet**.

Cette application permet de collecter, persister et exposer des données d’ambiance sonore associées à différents lieux. La phase 2 ajoute une application cliente React qui consomme l’API, visualise les lieux sur une carte, affiche un portrait d’ambiance lisible, et protège les actions d’écriture par authentification.

Les lectures de l’ambiance sont publiques. Les écritures, comme la soumission d’une observation, nécessitent une authentification.

---

## 1. Description du projet

Ambiance API est une application web qui collecte et expose des données d’ambiance sonore pour différents lieux. La phase 2 ajoute un client React permettant de visualiser ces données sur une carte, de consulter le portrait détaillé d’un lieu, de soumettre des observations authentifiées et de gérer un espace compte.

Le client React consomme l’API Express de la phase 1. Les lectures sont publiques, tandis que les écritures et les actions personnalisées nécessitent une authentification.

---

## 2. Prérequis

Avant de lancer le projet, il faut avoir installé :

- Node.js ;
- npm ;
- Git ;
- un navigateur web ;
- MongoDB Atlas ou une base MongoDB accessible ;
- Postman pour tester les endpoints protégés.

Le backend Express de la phase 1 doit être fonctionnel, car le client React consomme les endpoints de cette API.

---

## 3. Technologies utilisées

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- dotenv
- cors

### Frontend

- React
- Vite
- React Router
- Leaflet
- React Leaflet
- Recharts
- CSS personnalisé

---

## 4. Structure du projet

```text
ift3225-ambiance-api/
│
├── src/
│   ├── app.js
│   ├── index.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── scripts/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── Endopoints_phase2/
├── .env.example
├── package.json
└── README.md
```

---

## 5. Configuration des variables d’environnement

Le projet utilise des variables d’environnement pour configurer le backend, la base de données, phyphox, la clé API et l’authentification JWT.

Les fichiers `.env` contiennent des informations sensibles. Ils ne doivent pas être publiés sur GitHub.

---

## 6. Fichier `.env.example` du backend

Créer un fichier `.env.example` à la racine du projet avec le contenu suivant :

```env
PORT=3000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME
API_BASE_URL=http://localhost:3000/api
API_KEY=your_api_key_here
PHYPOX_URL=http://your_phyphox_ip:8080
PHYPOX_BUFFER=dB
COLLECTION_LOCATION=maison-test
BRIDGE_INTERVAL_MS=5000
BRIDGE_DURATION_MINUTES=5
JWT_SECRET=your_jwt_secret_here
```

Pour utiliser le projet localement, copier ce fichier vers `.env` :

```bash
copy .env.example .env
```

Puis remplir les vraies valeurs dans `.env`.

---

## 7. Fichier `client/.env.example`

Créer un fichier `.env.example` dans le dossier `client` avec le contenu suivant :

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Pour utiliser le client React localement, copier ce fichier vers `client/.env` :

```bash
cd client
copy .env.example .env
```

---

## 8. Installation du backend

À la racine du projet :

```bash
npm install
```

---

## 9. Lancement du backend

À la racine du projet :

```bash
npm run dev
```

L’API est disponible à l’adresse :

```text
http://localhost:3000/api
```

---

## 10. Installation du client React

Aller dans le dossier `client` :

```bash
cd client
npm install
```

---

## 11. Lancement du client React

Dans le dossier `client` :

```bash
npm run dev
```

L’application React est disponible à l’adresse :

```text
http://localhost:5173
```

---

## 12. Données collectées pour la phase 2

La phase 2 utilise de nouvelles mesures réparties sur trois lieux différents :

```text
maison-test
mcdonald
bibliotheque-udem
```

Chaque lieu possède :

- un nom ;
- un slug ;
- une description ;
- une adresse ou indication générale ;
- une latitude ;
- une longitude ;
- des mesures sonores associées.

Ces données alimentent la carte, les badges d’ambiance, les graphiques d’historique et les créneaux calmes.

---

## 13. Application cliente publique

La partie publique de l’application React permet de consulter l’ambiance sans authentification.

Elle contient :

- une carte interactive ;
- des marqueurs positionnés avec les coordonnées des lieux ;
- un badge de classification sur les lieux ;
- un accès au portrait détaillé d’un lieu ;
- une page détail avec classification, historique et créneaux calmes ;
- une gestion explicite des états de chargement, d’erreur et de données vides.

Les appels à l’API sont isolés dans une couche client située dans :

```text
client/src/api/
```

Cette organisation permet de séparer la consommation de l’API de l’interface React.

---

## 14. Vue carte

La vue carte affiche les lieux collectés à partir de leurs coordonnées géographiques.

Chaque marqueur représente un lieu et affiche la classification courante renvoyée par l’API.

Un clic sur un lieu permet d’accéder à son portrait d’ambiance détaillé.

La carte reste lisible même lorsqu’un lieu n’a pas de mesure récente. Dans ce cas, l’ambiance peut être indiquée comme inconnue, mais le lieu reste visible.

---

## 15. Vue détaillée d’un lieu

La page détail d’un lieu affiche :

- le nom du lieu ;
- l’adresse ou indication générale ;
- le badge de classification fourni par l’API ;
- la moyenne sonore récente ;
- l’état de fraîcheur des données ;
- les échelles de classification exposées par l’API ;
- le graphe d’historique ;
- les créneaux calmes ;
- un résumé interprété par l’API ;
- un bouton pour ajouter ou retirer le lieu des favoris ;
- un formulaire de soumission d’observation pour les utilisateurs connectés.

---

## 16. Classification d’ambiance

La classification est calculée côté serveur. Le client React affiche uniquement les informations retournées par l’API.

Les niveaux utilisés sont :

```text
calm      → Calme
moderate  → Modéré
active    → Animé
unknown   → Inconnue
```

Pour les valeurs phyphox relatives négatives, l’échelle utilisée est :

```text
Calme   : valeur <= -55
Modéré  : valeur <= -35
Animé   : valeur > -35
```

Pour les valeurs positives classiques, l’échelle utilisée est :

```text
Calme   : valeur <= 45
Modéré  : valeur <= 65
Animé   : valeur > 65
```

Le client React ne recalcule pas l’ambiance. Il affiche le badge, la description et les échelles fournis par l’API.

---

## 17. Fraîcheur des données

L’application utilise un seuil de fraîcheur de 30 minutes.

Si un lieu possède une mesure récente dans les 30 dernières minutes, l’ambiance actuelle est affichée.

Si aucune mesure récente n’est disponible, le lieu reste visible sur la carte, mais sa classification peut devenir :

```text
Inconnue
```

Ce choix permet de garder l’interface lisible même lorsque la collecte n’est pas active en continu.

---

## 18. Authentification et espace compte

L’application permet à un usager de :

- créer un compte ;
- se connecter ;
- se déconnecter ;
- consulter son espace compte ;
- soumettre une observation ;
- consulter ses observations ;
- consulter les lieux où il a soumis des observations ;
- ajouter un lieu aux favoris ;
- retirer un lieu des favoris.

L’interface reflète l’état connecté ou déconnecté :

- les lectures publiques restent accessibles sans connexion ;
- les actions protégées sont affichées seulement lorsque l’utilisateur est connecté ;
- les écritures envoient un justificatif d’authentification avec le token JWT.

Les routes protégées utilisent l’en-tête suivant :

```text
Authorization: Bearer TOKEN
```

---

## 19. Observations et auteur

Chaque observation soumise par un utilisateur connecté est associée à son auteur.

Cela permet de construire :

- le récapitulatif des contributions ;
- la liste des observations de l’utilisateur ;
- la notion de ses lieux ;
- l’espace compte personnalisé.

Le modèle d’observation a donc été étendu avec un champ auteur.

---

## 20. Gestion des favoris

Un utilisateur connecté peut ajouter ou retirer un lieu de ses favoris.

Les favoris sont liés au compte utilisateur.

Ils sont accessibles dans la page :

```text
Mon compte
```

et aussi depuis la page détail d’un lieu.

---

## 21. Principaux endpoints API

### Lieux

```http
GET /api/locations
GET /api/locations/:slug
```

Ces routes retournent les lieux, leurs coordonnées et leur ambiance courante.

### Ambiance

```http
GET /api/ambiance/:slug/summary
GET /api/ambiance/:slug/history
GET /api/ambiance/:slug/quiet-hours
```

Ces routes retournent le résumé d’ambiance, l’historique et les créneaux calmes d’un lieu.

### Mesures

```http
POST /api/measurements
```

Cette route permet d’ajouter une mesure sonore.

Elle nécessite une clé API.

Exemple d’en-tête :

```text
x-api-key: VOTRE_CLE_API
```

Exemple de body :

```json
{
  "location": "maison-test",
  "value": -65,
  "unit": "dB"
}
```

### Authentification

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Ces routes permettent de créer un compte, se connecter et récupérer l’utilisateur connecté.

### Observations

```http
GET /api/observations
POST /api/observations
```

La lecture des observations est publique.

La création d’une observation nécessite un utilisateur connecté.

Exemple de body :

```json
{
  "location": "maison-test",
  "proximity": "medium",
  "vibe": "calm",
  "notes": "Observation soumise depuis l’interface React."
}
```

Valeurs attendues pour `proximity` :

```text
near
medium
far
```

Valeurs attendues pour `vibe` :

```text
calm
normal
busy
noisy
```

### Espace compte

```http
GET /api/account/observations
GET /api/account/places
GET /api/account/favorites
POST /api/account/favorites/:slug
DELETE /api/account/favorites/:slug
```

Ces routes nécessitent un token JWT.

Elles permettent de consulter les observations de l’utilisateur, ses lieux et ses favoris.

---

## 22. Comment tester les actions protégées

### Depuis l’interface React

1. Lancer le backend.
2. Lancer le client React.
3. Ouvrir l’application dans le navigateur.
4. Aller à la page d’inscription.
5. Créer un compte.
6. Se connecter.
7. Ouvrir la page détail d’un lieu.
8. Soumettre une observation.
9. Ajouter un lieu aux favoris.
10. Aller dans la page `Mon compte`.
11. Vérifier les sections :
    - identité ;
    - mes observations ;
    - mes lieux ;
    - mes favoris.

### Depuis Postman

Se connecter avec :

```http
POST /api/auth/login
```

Exemple de body :

```json
{
  "email": "utilisateur@example.com",
  "password": "Password123"
}
```

Copier le token retourné.

Dans les routes protégées, utiliser :

```text
Authorization: Bearer TOKEN
```

Exemple de soumission d’observation :

```http
POST /api/observations
```

Body :

```json
{
  "location": "maison-test",
  "proximity": "medium",
  "vibe": "calm",
  "notes": "Observation de test avec utilisateur connecté."
}
```

Exemple de consultation de l’espace compte :

```http
GET /api/account/observations
GET /api/account/places
GET /api/account/favorites
```

---

## 23. Tests effectués

Les endpoints suivants ont été testés :

```text
GET /api/locations
GET /api/ambiance/:slug/summary
GET /api/ambiance/:slug/history
GET /api/ambiance/:slug/quiet-hours
POST /api/measurements
POST /api/observations avec token
GET /api/account/observations
GET /api/account/places
GET /api/account/favorites
POST /api/account/favorites/:slug
DELETE /api/account/favorites/:slug
```

Des captures de vérification sont placées dans le dossier :

```text
Endopoints_phase2/
```

---

## 24. Gestion des états dans React

L’interface React gère explicitement les états suivants :

- chargement ;
- erreur ;
- données vides ;
- utilisateur connecté ;
- utilisateur déconnecté ;
- action protégée non disponible ;
- message de succès après une action.

Ces états permettent de garder l’application lisible dans toutes les situations.

---

## 25. Mise à jour de l’infrastructure

La phase 2 a nécessité des mises à jour de l’infrastructure de la phase 1.

Les ajouts principaux sont :

- coordonnées des lieux avec latitude et longitude ;
- modèle de lieu exposé par l’API ;
- classification d’ambiance exposée par l’API ;
- échelles de classification exposées par l’API ;
- auteur associé aux observations ;
- routes d’authentification ;
- routes d’espace compte ;
- gestion des favoris ;
- protection des écritures sensibles.

Les lectures publiques de la phase 1 restent accessibles.

La collecte des mesures continue de fonctionner.

---

## 26. Build React

Pour vérifier que l’application React compile correctement :

```bash
cd client
npm run build
```

Le build doit se terminer sans erreur bloquante.

---

## 27. Branche Git utilisée

Le développement de la phase 2 a été effectué sur la branche :

```text
rachida-phase2
```

---

## 28. Remarques importantes

- Les secrets ne sont pas publiés dans le dépôt.
- Les fichiers `.env` sont ignorés par Git.
- Les fichiers `.env.example` contiennent seulement des valeurs fictives.
- Les lectures publiques ne nécessitent pas de connexion.
- Les écritures protégées nécessitent une authentification.
- La classification est calculée côté serveur.
- Le client React ne recalcule pas l’ambiance.
- Les observations sont liées à leur auteur.
- Les favoris sont liés au compte utilisateur connecté.
- Les coordonnées permettent l’affichage des lieux sur la carte.

---

## 29. Commandes utiles

Installer le backend :

```bash
npm install
```

Lancer le backend :

```bash
npm run dev
```

Installer le client :

```bash
cd client
npm install
```

Lancer le client :

```bash
npm run dev
```

Compiler le client :

```bash
cd client
npm run build
```
---

## Déploiement Render - Phase 3

La phase 3 du projet est déployée sur Render avec deux services séparés :

- un backend Express déployé comme Web Service ;
- un frontend React/Vite déployé comme Static Site.

Cette séparation permet de garder une architecture claire : le backend expose l’API et communique avec MongoDB Atlas, tandis que le frontend consomme cette API à partir d’une URL publique sécurisée en HTTPS.

---

### URLs de production

Backend API :

```text
https://ift3225-ambiance-api.onrender.com
```

Frontend React :

```text
https://ift3225-ambiance-client.onrender.com
```

---

### Déploiement du backend

Le backend Express est déployé sur Render comme Web Service Node.js.

Configuration utilisée :

```text
Service type: Web Service
Name: ift3225-ambiance-api
Branch: rachida-phase3
Root Directory: vide
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Le backend utilise MongoDB Atlas comme base de données distante. Les variables sensibles ne sont pas publiées dans le dépôt GitHub. Elles sont configurées directement dans l’environnement Render.

Variables d’environnement configurées dans Render pour le backend :

```text
NODE_ENV=production
MONGODB_URI=valeur configurée dans Render
API_KEY=valeur configurée dans Render
JWT_SECRET=valeur configurée dans Render
PHYPOX_BUFFER=dB
FRONTEND_URL=https://ift3225-ambiance-client.onrender.com
```

Les variables suivantes sont sensibles et ne doivent jamais être exposées dans le dépôt GitHub :

```text
MONGODB_URI
API_KEY
JWT_SECRET
```

Le serveur utilise le port fourni automatiquement par Render :

```js
const PORT = process.env.PORT || 3000;
```

Cette configuration permet au backend de fonctionner en local sur le port 3000, tout en utilisant le port dynamique fourni par Render en production.

---

### Déploiement du frontend

Le frontend React/Vite est déployé sur Render comme Static Site.

Configuration utilisée :

```text
Service type: Static Site
Name: ift3225-ambiance-client
Branch: rachida-phase3
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

Variable d’environnement configurée dans Render pour le frontend :

```text
VITE_API_BASE_URL=https://ift3225-ambiance-api.onrender.com/api
```

Cette variable permet au client React de consommer l’API backend déployée sur Render, au lieu d’utiliser l’API locale `http://localhost:3000/api`.

Aucune variable sensible n’est configurée dans le frontend. Le frontend ne contient pas :

```text
MONGODB_URI
API_KEY
JWT_SECRET
```

Ces informations restent uniquement côté backend.

---

### Redirection React Router

L’application React utilise des routes côté client, par exemple :

```text
/compte
/connexion
/inscription
/lieux/maison-test
```

Pour éviter une erreur 404 lors d’un rafraîchissement direct sur ces routes, une règle de rewrite a été ajoutée dans Render :

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

Cette règle permet à Render de toujours renvoyer `index.html`, puis React Router prend en charge l’affichage de la bonne page.

---

### Vérification du backend déployé

Les endpoints suivants permettent de vérifier que le backend est bien disponible en production :

```text
https://ift3225-ambiance-api.onrender.com/
https://ift3225-ambiance-api.onrender.com/api/locations
https://ift3225-ambiance-api.onrender.com/api/recommendations/quiet-place
```

Résultat attendu :

```text
success: true
```

Pour `/api/locations`, l’API doit retourner les lieux utilisés dans le projet, comme :

```text
maison-test
mcdonald
bibliotheque-udem
```

---

### Vérification du frontend déployé

L’application frontend est accessible ici :

```text
https://ift3225-ambiance-client.onrender.com
```

Parcours utilisateur testés en production :

```text
Accueil
Carte des lieux
Portrait détaillé d’un lieu
Recommandation du lieu calme
Connexion
Espace Mon compte
Ajout d’un lieu aux favoris
Retrait d’un lieu des favoris
Soumission d’une observation authentifiée
```

Les routes directes suivantes doivent aussi fonctionner grâce à la règle de rewrite :

```text
https://ift3225-ambiance-client.onrender.com/compte
https://ift3225-ambiance-client.onrender.com/connexion
https://ift3225-ambiance-client.onrender.com/lieux/maison-test
```

---

### Lien entre le frontend et le backend

Le lien entre les deux services est configuré de la façon suivante :

- le frontend utilise `VITE_API_BASE_URL` pour appeler l’API backend ;
- le backend utilise `FRONTEND_URL` pour autoriser l’origine du frontend avec CORS.

Configuration côté frontend :

```text
VITE_API_BASE_URL=https://ift3225-ambiance-api.onrender.com/api
```

Configuration côté backend :

```text
FRONTEND_URL=https://ift3225-ambiance-client.onrender.com
```

Cette configuration permet au frontend Render de communiquer avec le backend Render sans erreur CORS.

---

### Limite du plan gratuit Render

Le backend utilise le plan gratuit de Render. Après une période d’inactivité, le service peut se mettre en veille. La première requête après cette période peut donc être plus lente, parfois autour de 50 secondes ou plus.

Cette limite est liée au plan gratuit. Une solution possible serait d’utiliser un plan Render payant ou une stratégie de maintien actif si l’application devait être utilisée en production réelle.

---

### Résumé du déploiement

Le déploiement final de la phase 3 comprend :

```text
Backend Express en ligne sur Render
Frontend React/Vite en ligne sur Render
MongoDB Atlas utilisé comme base de données distante
Variables sensibles configurées dans Render
Communication frontend-backend configurée par variables d’environnement
CORS configuré avec FRONTEND_URL
Routes React protégées par une règle de rewrite
Application accessible en HTTPS
```
