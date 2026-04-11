<div align="center">

# 🤖 Golden BOT

![Discord](https://img.shields.io/badge/Discord-Bot-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![discord.py](https://img.shields.io/badge/discord.py-Library-blue?style=for-the-badge)
![License](https://img.shields.io/badge/Licence-Éducatif-green?style=for-the-badge)

**Bot Discord multifonction — Modération · Musique · Stats · Fun**

</div>

---

## 📌 Présentation

**Golden BOT** est un bot Discord développé pour faciliter la gestion d'un serveur tout en ajoutant des fonctionnalités de divertissement.

Il propose quatre catégories de commandes :

| Catégorie | Description |
|-----------|-------------|
| 🛡️ Modération | Gestion des membres et des messages |
| 📊 Statistiques | Infos membres et serveur |
| 🎵 Musique | Lecture YouTube en vocal |
| 🎉 Fun | Commandes humoristiques |

---

## ⚙️ Fonctionnalités

### 🛡️ Commandes Staff

| Commande | Description |
|----------|-------------|
| `ban <membre>` | Bannir un utilisateur |
| `kick <membre>` | Expulser un utilisateur |
| `clear <nombre>` | Supprimer un nombre de messages |

### 📊 Commandes Statistiques

| Commande | Description |
|----------|-------------|
| `info <membre>` | Afficher les statistiques d'un utilisateur |
| `stats` | Afficher les statistiques du serveur |

### 🎵 Commandes Musique

| Commande | Description |
|----------|-------------|
| `play <url>` | Jouer une musique depuis YouTube |
| `skip` | Passer à la musique suivante |
| `stop` | Arrêter la musique et déconnecter le bot |

### 🎉 Commandes Fun

| Commande | Description |
|----------|-------------|
| `nitro` | Simule un gain de Nitro |
| `meme` | Envoie un contenu humoristique |

---

## 🧰 Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| Python | Langage principal |
| discord.py | Librairie Discord |
| API YouTube | Lecture de musique en vocal |

---

## 🧩 Structure du projet

```
golden-bot/
│── main.py
│── commands/
│   ├── moderation.py
│   ├── music.py
│   ├── fun.py
│   └── stats.py
│── config.json
│── requirements.txt
```

---

## ▶️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/ton-repo/golden-bot.git
cd golden-bot
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configuration

Créer un fichier `config.json` à la racine :

```json
{
  "token": "VOTRE_TOKEN_DISCORD"
}
```

> ⚠️ Ne jamais partager ni commit votre token Discord.

### 4. Lancer le bot

```bash
python main.py
```

---

## ⚠️ Permissions nécessaires

Le bot doit disposer des permissions suivantes sur le serveur :

- ✅ Bannir des membres
- ✅ Expulser des membres
- ✅ Gérer les messages
- ✅ Accès aux salons vocaux (musique)
- ✅ Lire et envoyer des messages

> 💡 Une permission **Administrateur** peut être utilisée pour simplifier la configuration.

---

## 📉 Limites actuelles

- Système musique dépendant de l'API YouTube (peut être instable)
- Commandes préfixées uniquement (pas de slash commands)
- Gestion des erreurs limitée

---

## 🚀 Améliorations possibles

- [ ] Migration vers les **slash commands**
- [ ] Système de **logs** d'actions
- [ ] Meilleure **gestion des erreurs**
- [ ] File d'attente musicale complète
- [ ] Dashboard web de gestion
- [ ] Système de permissions avancé par rôles

---

## 📄 Licence

Ce projet est libre d'utilisation à **but éducatif**.

---

<div align="center">
  <i>Projet personnel — Bot Discord multifonction</i><br/>
  <i>Python · discord.py · YouTube API</i>
</div>
