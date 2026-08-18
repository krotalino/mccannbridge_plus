# 🚀 GUIDE DE DÉPLOIEMENT EN LIGNE — MCCANN BRIDGE

Ce guide explique comment compiler et déployer la plateforme **McCann Bridge** sur un serveur web de production.

---

## 📋 PRÉREQUIS

1. Node.js (version 18 ou supérieure) installé localement ou sur le serveur.
2. Un serveur Web (Apache, Nginx, Hostinger, cPanel, Vercel ou Netlify).
3. Un serveur MySQL (si vous activez la base de données).

---

## 🛠️ ÉTAPE 1 : CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

1. Dupliquez le fichier `.env.example` et nommez-le `.env.production` (ou `.env`).
2. Ajustez les valeurs selon votre serveur :
   ```env
   VITE_APP_NAME="McCann Bridge"
   VITE_APP_ENV=production
   VITE_BASE_URL="/"
   VITE_API_BASE_URL="https://votre-domaine.com/api"
   VITE_ENABLE_MOCK_DATA=true
   ```
   *Note : Si votre site est hébergé dans un sous-dossier (ex: `https://votre-domaine.com/mccann/`), définissez `VITE_BASE_URL="/mccann/"`.*

---

## 📦 ÉTAPE 2 : COMPILATION DU PROJET (BUILD)

Dans votre terminal, lancez la commande de build :

```bash
npm run build
```

Cela va générer un dossier `dist/` contenant tous les fichiers optimisés pour la production (HTML, CSS, JS minifiés, images).

---

## 🌐 ÉTAPE 3 : MISE EN LIGNE SUR SERVEUR WEB

### Option A : Hébergement Apache (cPanel, Hostinger, OVH, WAMP)
1. Transférez tout le **contenu** du dossier `dist/` vers le dossier racine de votre serveur (ex: `public_html/` ou `www/`).
2. Assurez-vous que le fichier `.htaccess` (situé dans `dist/` ou fourni dans `public/.htaccess`) est bien présent à la racine.

### Option B : Serveur Nginx (VPS Linux / Ubuntu)
1. Copiez les fichiers du dossier `dist/` vers `/var/www/mccannbridge/dist`.
2. Utilisez le modèle de configuration fourni dans `nginx.conf.example` :
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/mccannbridge
   sudo ln -s /etc/nginx/sites-available/mccannbridge /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Option C : Hébergement Cloud Vercel / Netlify
1. Connectez votre dépôt Git à Vercel ou Netlify.
2. Définissez la commande de build : `npm run build`
3. Définissez le dossier d'output : `dist`
4. Le fichier `vercel.json` s'occupera automatiquement des réécritures d'URL.

---

## 🗄️ ÉTAPE 4 : IMPORTATION DE LA BASE DE DONNÉES MYSQL (OPTIONNEL)

Si vous souhaitez utiliser le backend PHP et MySQL :
1. Accédez à **phpMyAdmin** sur votre serveur.
2. Créez une base de données nommée `mccann_bridge`.
3. Importez le fichier `mccannbridge_database.sql`.
4. Copiez `api/config.php.example` vers `api/config.php` et renseignez les identifiants de connexion MySQL.
