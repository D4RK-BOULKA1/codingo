# CODINGO — La Plateforme d'Apprentissage du Code (Gamifiée & IA)

Codingo est un SaaS éducatif ("Duolingo du code") permettant d'apprendre les langages de programmation (HTML et CSS disponibles, JavaScript, Python, React, Lua à venir) à travers des parcours gamifiés (unités, chapitres, leçons, cœurs, ligues, séries quotidiennes, quêtes, boutique) avec un mini-éditeur vérifié de façon déterministe et par une IA pédagogue.

---

## 🚀 Guide d'Installation et Démarrage Local

### 1. Prérequis
- **Node.js** v18+ ou v20+
- **npm** (inclus avec Node.js)
- Un compte gratuit [Google Firebase](https://console.firebase.google.com/)
- Une clé API [Google AI Studio](https://aistudio.google.com/) (Gemini)

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Copiez le fichier `.env.example` en `.env.local` :
```bash
cp .env.example .env.local
```
Renseignez les variables nécessaires (voir procédure Firebase ci-dessous).

### 4. Lancement du serveur de développement
```bash
npm run dev
```
L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Configuration pas à pas de Firebase

Pour faire fonctionner l'authentification, la persistance des profils, le stockage d'images et les notifications push :

### Étape 1 : Créer le projet Firebase
1. Rendez-vous sur la [Console Firebase](https://console.firebase.google.com/).
2. Cliquez sur **Ajouter un projet**, nommez-le (ex: `codingo-app`).
3. Vous pouvez désactiver Google Analytics pour aller plus vite ou le laisser activé.
4. Cliquez sur **Créer le projet**.

### Étape 2 : Activer Firebase Authentication
1. Dans le menu de gauche, allez dans **Build > Authentication**.
2. Cliquez sur **Commencer**.
3. Dans l'onglet **Sign-in method**, activez :
   - **Adresse e-mail / Mot de passe** (laisser décoché la connexion sans mot de passe).
   - **Google** (sélectionnez l'email d'assistance du projet et enregistrez).

### Étape 3 : Activer Cloud Firestore
1. Dans le menu de gauche, allez dans **Build > Firestore Database**.
2. Cliquez sur **Créer une base de données**.
3. Choisissez l'emplacement le plus proche (ex: `europe-west9` pour Paris ou `europe-west1` pour la Belgique).
4. Démarrez en **Mode production**.
5. Les règles de sécurité sont fournies dans le fichier `firestore.rules` du projet.

### Étape 4 : Activer Cloud Storage (Photos de profil)
1. Allez dans **Build > Storage**.
2. Cliquez sur **Commencer**.
3. Choisissez les règles de sécurité par défaut et validez l'emplacement du bucket.
> ℹ️ **Précision forfait payant (Plan Spark vs Plan Blaze) :**
> - **Non, un forfait payant N'EST PAS obligatoire pour démarrer avec Cloud Storage.**
> - Le forfait gratuit de Firebase (**Spark**) inclut **5 Go de stockage**, 1 Go/jour de téléchargement et 20 000 opérations d'écriture/jour, ce qui est amplement suffisant pour héberger les photos de profil des utilisateurs.
> - Le plan à l'usage (**Blaze**) ne devient nécessaire que si vous dépassez ce quota gratuit ou si vous souhaitez déployer des Cloud Functions externes.

### Étape 5 : Activer Cloud Messaging (FCM - Notifications Push Web)
1. Allez dans **Paramètres du projet (icône d'engrenage) > Cloud Messaging**.
2. Dans la section **Configuration web**, cliquez sur **Générer une paire de clés** sous *Certificats Web Push*.
3. Copiez la clé publique générée et collez-la dans la variable `NEXT_PUBLIC_FIREBASE_VAPID_KEY` de votre fichier `.env.local`.

### Étape 6 : Récupérer les clés de configuration Web (Client)
1. Dans **Paramètres du projet > Général**, faites défiler jusqu'à la section *Vos applications*.
2. Cliquez sur l'icône Web **`</>`**, donnez un nom (ex: `Codingo Web`) et validez.
3. Copiez les valeurs du snippet `firebaseConfig` dans votre fichier `.env.local` :
   - `apiKey` ➔ `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` ➔ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` ➔ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` ➔ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` ➔ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` ➔ `NEXT_PUBLIC_FIREBASE_APP_ID`

### Étape 7 : Générer la clé de compte de service Firebase Admin (Serveur)
1. Dans **Paramètres du projet > Comptes de service**.
2. Cliquez sur **Générer une nouvelle clé privée** puis validez le téléchargement du fichier JSON.
3. Ouvrez le fichier JSON téléchargé et reportez les valeurs dans `.env.local` :
   - `client_email` ➔ `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` ➔ `FIREBASE_ADMIN_PRIVATE_KEY`

---

## 👑 Initialisation du Compte Administrateur

1. Définissez la variable `ADMIN_INITIAL_PASSWORD` dans votre fichier `.env.local` (ex: `MonMotDePasseAdminSuperSecurise123!`).
2. Exécutez le script d'initialisation :
```bash
npm run seed:admin
```
3. Ce script crée l'utilisateur avec le pseudo `boulka-admin` associé à l'email interne `boulka-admin@codingo.local` et lui attribue le rôle administrateur protégé (`role: admin`) par Firebase Custom Claim.
4. Rendez-vous sur la route cachée `/panel-codingo` et connectez-vous avec :
   - Identifiant : `boulka-admin` (ou `boulka-admin@codingo.local`)
   - Mot de passe : celui configuré dans `ADMIN_INITIAL_PASSWORD`.

---

## 🎨 Charte Graphique & Design System

- **Palette 100% aplats (Zéro dégradé) :**
  - Bleu ciel primaire : `#4CC2FF`
  - Bleu foncé solide (relief 3D) : `#1B9BE0`
  - Bleu nuit (textes & contrastes) : `#0B3A5B`
  - Blanc pur (fonds & cartes) : `#FFFFFF`
  - Jaune soleil (accentuation ~10% uniquement : XP, flammes, gemmes, récompenses) : `#FFC83D`
- **Boutons "Flat 3D" :** Ombre solide inférieure de 4px, enfoncement physique au clic (`translateY(4px)`).
- **Zéro emoji dans l'interface :** Utilisation exclusive d'icônes vectorielles SVG ou de la mascotte Codie.
- **Mascotte Codie :** Robot vectoriel expressif SVG original.

---

## 📱 PWA (Progressive Web App)
L'application est entièrement responsive mobile-first et installable sur smartphone ou desktop via le manifest PWA inclus.
