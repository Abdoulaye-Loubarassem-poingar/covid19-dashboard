# Documentation – Dashboard Covid-19

## 1. Présentation générale

Le projet **Dashboard Covid-19** est une application web interactive développée dans le cadre du cours **8INF309**. Il permet de visualiser, analyser et comparer les données relatives à la pandémie de Covid-19 à l’échelle mondiale et par pays, à l’aide de graphiques et d’une carte interactive.

Cette documentation a pour objectif de fournir :

* Un **README technique** destiné aux développeurs
* Un **guide utilisateur** destiné aux utilisateurs finaux

---

## 2. README – Documentation technique

### 2.1 Prérequis

Avant d’exécuter le projet, les éléments suivants doivent être installés :

* Node.js (version 16 ou supérieure recommandée)
* npm ou yarn
* Un navigateur web moderne (Chrome, Firefox, Edge)

### 2.2 Installation du projet

1. Cloner le dépôt du projet :

```bash
git clone <url_du_depot>
```

2. Accéder au dossier du projet :

```bash
cd dashboard-covid19
```

3. Installer les dépendances :

```bash
npm install
```

4. Lancer l’application en mode développement :

```bash
npm start
```

L’application sera accessible à l’adresse suivante :

```
http://localhost:3000
```

### 2.3 Structure du projet

```
src/
 ├── components/        # Composants réutilisables
 ├── pages/             # Pages principales (Accueil, Comparaison, Évolution)
 ├── services/          # Appels API et gestion des données
 ├── assets/            # Ressources statiques
 ├── App.jsx            # Composant principal
 └── index.js           # Point d’entrée de l’application
```

### 2.4 Sources de données

Les données Covid-19 sont récupérées à partir d’API publiques fournissant des statistiques mondiales et nationales (cas confirmés, décès, guérisons). Les appels API sont centralisés afin de faciliter la maintenance et le remplacement éventuel des sources.

### 2.5 Technologies utilisées

* React.js
* JavaScript (ES6)
* HTML5 / CSS3
* Bibliothèques de visualisation (graphiques et cartes interactives)

---

## 3. Guide utilisateur

### 3.1 Accès à l’application

L’utilisateur accède au dashboard via un navigateur web. Aucune authentification n’est requise. L’interface est conçue pour être intuitive et accessible.

### 3.2 Page d’accueil

La page d’accueil présente une vue globale de la situation sanitaire mondiale :

* Nombre total de cas confirmés
* Nombre total de décès
* Nombre total de personnes guéries

Ces informations sont affichées sous forme de cartes statistiques pour une lecture rapide.

### 3.3 Page d’évolution

Cette page permet de suivre l’évolution de la pandémie dans le temps à l’aide de graphiques linéaires. L’utilisateur peut observer :

* L’évolution des cas
* L’évolution des décès
* L’évolution des guérisons

Les graphiques facilitent l’identification des tendances et des périodes critiques.

### 3.4 Page de comparaison

La fonctionnalité de comparaison permet de sélectionner plusieurs pays afin de comparer leurs statistiques respectives. Cette page est particulièrement utile pour analyser les différences de propagation entre régions.

### 3.5 Carte mondiale interactive

La carte mondiale affiche la répartition géographique des cas de Covid-19. Les interactions possibles sont :

* Survol d’un pays pour afficher ses statistiques
* Sélection d’un pays pour afficher des informations détaillées

Cette visualisation offre une compréhension spatiale immédiate de la pandémie.

### 3.6 Navigation

La navigation entre les différentes pages se fait à l’aide d’un menu principal. Les transitions sont rapides et permettent une exploration fluide des données.

---

## 4. Bonnes pratiques d’utilisation

* Utiliser un navigateur récent pour une meilleure performance
* Vérifier la connexion Internet pour assurer la récupération des données
* Rafraîchir la page en cas de problème de chargement des statistiques

---

## 5. Limites connues

* Dépendance à la disponibilité des API externes
* Données pouvant présenter des retards de mise à jour
* Performances variables selon la taille des jeux de données

---

## 6. Conclusion

Cette documentation accompagne le projet Dashboard Covid-19 en fournissant à la fois une description technique et un guide utilisateur clair. Elle permet une prise en main rapide de l’application et facilite sa maintenance et son évolution future.
