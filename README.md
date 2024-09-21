# Order Manager App

## Description du Projet

OrderManagerApp est une application console développée en Node.js pour gérer les opérations essentielles d'une entreprise spécialisée dans l'importation et l'exportation de produits. Cette application permet de gérer les clients, les commandes, les paiements, et les produits associés aux commandes.

## Fonctionnalités de l'Application

- **Gestion des Clients** :

  - Ajouter un nouveau client.
  - Consulter les détails des clients.
  - Mettre à jour les informations des clients.
  - Supprimer des clients.

- **Gestion des Commandes** :

  - Créer de nouvelles commandes pour les clients.
  - Lire les détails des commandes existantes.
  - Mettre à jour les commandes.
  - Supprimer des commandes.

- **Gestion des Détails de Commande** :

  - Ajouter des produits aux commandes.
  - Modifier les détails des produits d'une commande.
  - Supprimer des produits d'une commande.

- **Gestion des Paiements** :
  - Enregistrer un paiement pour une commande.
  - Consulter les paiements effectués.
  - Mettre à jour les informations de paiement.
  - Supprimer des paiements.

## Comment Démarrer avec le Projet

### Prérequis

- [Node.js Official Website](https://nodejs.org/) installé node sur votre machine.
- **Configuration MariaDB via le terminal**
- Installer XAMPP : Assurez-vous que XAMPP est installé avec MariaDB inclus. Vous pouvez le télécharger depuis [le site officiel de XAMPP](https://www.apachefriends.org/index.html).

1. **Clonez le dépôt :**

   ```bash
   git clone https://github.com/Fatoumacisse99/order_management_app2.git
   ```

2. **pour acceder au dossier du projet**
   ```bash
   cd order_management_app2
   ```

### Installation

```bash
npm install
```

### Configuration de la Base de Données

Pour configurer correctement la base de données, vous devez ajuster les paramètres `user`, `password`, et `port` dans le fichier `src/db.js`. Voici comment procéder :

- Modification des Paramètres de Connexion :

Dans le fichier `src/db.js`, remplacez les valeurs par celles qui correspondent à votre configuration de base de données :



  - host: "localhost": Adresse du serveur de base de données
  - user: "votre_nom_utilisateur": Remplacez 'root' par votre nom d'utilisateur
  - password : "votre_mot_de_passe":Remplacez '' par votre mot de passe
  - database : "gestion_import_export":Nom de la base de données
  - port: 3306 :Remplacez 3306 par le port utilisé par votre base de données si différent





- Le fichier de configuration de la base de données est situé à l'emplacement suivant :

```bash
src/db.js
```

- Apres configurationla lancer l'application avec :

  ```bash
   node src/app.js
  ```

  ## Auteur

[Fatouma Abdallahi Cissé](https://github.com/Fatoumacisse99)
