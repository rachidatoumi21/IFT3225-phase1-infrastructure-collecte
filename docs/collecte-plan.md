# Tâche 1 — Planification de la collecte

## 1. Lieu choisi

Le lieu choisi pour la collecte est la **Bibliothèque de l’Université de Montréal**.

## 2. Description du lieu

La collecte sera réalisée dans un espace de bibliothèque ou d’étude à l’Université de Montréal. Ce lieu est pertinent pour le projet, car son ambiance peut varier selon l’heure de la journée. Le matin, l’environnement peut être plus calme; vers midi, il peut y avoir davantage d’activité; en fin de journée, l’ambiance peut encore changer selon l’achalandage.

Identifiant utilisé dans l’API :

```text
bibliotheque-udem
```

## 3. Objectif de la collecte

L’objectif est de mesurer l’évolution de l’ambiance sonore et environnementale dans un lieu réel à différents moments de la journée. Les données collectées permettront ensuite de produire des résultats consultables par des endpoints HTTP, par exemple pour connaître les périodes calmes ou l’évolution de l’ambiance.

## 4. Données collectées

Le système collectera deux types de données.

### 4.1 Données capteurs

Les données capteurs seront collectées automatiquement avec l’application **phyphox** installée sur un iPhone.

Expérience utilisée :

```text
Intensité sonore
```

Données prévues :

```text
type: sound_level
value: valeur mesurée en dB
unit: dB
location: bibliotheque-udem
timestamp: date et heure de la mesure
```

Les mesures sonores serviront d’indicateur du niveau sonore ambiant.

### 4.2 Données environnementales

Les données environnementales seront collectées avec une méthode mixte.

L’heure et le jour de la semaine seront déduits automatiquement à partir du timestamp de la mesure. La proximité de la source de bruit humaine la plus proche, la vibe générale du lieu et les notes seront saisies manuellement par l’équipe pendant les sessions.

Données prévues :

```text
location
timestamp
proximity
vibe
notes
```

## 5. Méthode de collecte environnementale

La méthode choisie est une méthode mixte :

* l’heure et le jour de la semaine seront obtenus automatiquement à partir du timestamp;
* la proximité humaine sera notée manuellement;
* la vibe générale sera notée manuellement;
* des notes libres pourront être ajoutées au besoin.

Cette méthode est simple, réaliste et adaptée à une première phase du projet. Elle permet de combiner des données mesurées automatiquement avec des observations humaines.

## 6. Valeurs utilisées pour la proximité humaine

La proximité de la source de bruit humaine la plus proche sera représentée avec trois valeurs :

```text
near
medium
far
```

Définition :

```text
near: une personne ou une source humaine de bruit est proche du téléphone, environ 0 à 2 mètres.
medium: une source humaine de bruit est présente à distance moyenne, environ 2 à 5 mètres.
far: aucune source humaine proche n’est présente, plus de 5 mètres.
```

## 7. Valeurs utilisées pour la vibe générale

La vibe générale du lieu sera représentée avec quatre valeurs :

```text
calm
normal
busy
noisy
```

Définition :

```text
calm: ambiance très calme.
normal: ambiance normale.
busy: plusieurs personnes présentes ou activité élevée.
noisy: ambiance bruyante.
```

## 8. Sessions de collecte prévues

Trois sessions de collecte de 20 minutes sont prévues dans le même lieu, à des moments différents de la journée.

| Session   | Moment prévu    |      Durée | Objectif                                             |
| --------- | --------------- | ---------: | ---------------------------------------------------- |
| Session 1 | Matin vers 9h30 | 20 minutes | Observer une période généralement calme              |
| Session 2 | Midi vers 12h00 | 20 minutes | Observer une période potentiellement plus fréquentée |
| Session 3 | Soir vers 17h30 | 20 minutes | Observer l’ambiance en fin de journée                |

Ces trois moments permettront de comparer l’ambiance du lieu selon différentes périodes de la journée.

## 9. Utilisation de phyphox

L’application phyphox sera utilisée sur iPhone avec l’expérience **Intensité sonore**. Cette expérience permet de mesurer le niveau sonore ambiant en dB.

Un test préliminaire a confirmé que les valeurs affichées par phyphox varient lorsque le bruit autour du téléphone augmente ou diminue. Les mesures seront donc utilisées comme indicateurs comparatifs du niveau sonore ambiant.

L’application indique que les mesures peuvent ne pas être parfaitement étalonnées. Les valeurs ne seront donc pas considérées comme des mesures acoustiques professionnelles, mais plutôt comme des données permettant de comparer l’ambiance entre différentes périodes.

## 10. Fallback manuel obligatoire

Si la collecte automatique échoue ou si le mécanisme de collecte n’est pas praticable, l’équipe utilisera un fichier CSV manuel nommé :

```text
manual_observations.csv
```

Format prévu :

```csv
timestamp,location,proximity,vibe,notes
2026-05-27T09:30:00,bibliotheque-udem,far,calm,Peu de personnes autour
2026-05-27T12:00:00,bibliotheque-udem,near,busy,Plusieurs personnes présentes
2026-05-27T17:30:00,bibliotheque-udem,medium,normal,Ambiance modérée en fin de journée
```

Ce fallback permet de conserver les observations environnementales même si la collecte automatique ne fonctionne pas.

## 11. Lien avec la tâche 2

Les choix faits dans cette tâche seront utilisés pour concevoir le protocole de l’API dans la tâche 2.

Les champs suivants devront donc être supportés par les endpoints :

```text
location
timestamp
type
value
unit
proximity
vibe
notes
```

Les valeurs acceptées pour `proximity` seront :

```text
near, medium, far
```

Les valeurs acceptées pour `vibe` seront :

```text
calm, normal, busy, noisy
```
