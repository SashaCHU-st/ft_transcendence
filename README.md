# ✅ Project Summary

A secure, feature-rich Pong game with local & online multiplayer, AI opponent, user management, tournament system, 3D graphics, monitoring tools, and full Dockerized deployment.
---
## 👥 Contributors

- Aleksandra Heinänen [@SashaCHU-st](https://github.com/SashaCHU-st)
- Alisa Arbenina [@aarbenin](https://github.com/aarbenin)
- Elena Polkhovski [@lenkras](https://github.com/lenkras)
- Oleg Goman [@OleGoman85](https://github.com/OleGoman85)

---

## 📚 Table of Contents

- [✅ Basic Requirements](#-basic-requirements)
- [🧱 Web Stack](#-web-stack)
- [👤 User Management](#-user-management-)
- [🕹️ Gameplay & Experience](#-gameplay--experience)
- [🤖 AI & Graphics](#-ai--graphics)
- [♿ Accessibility](#-accessibility)
- [🛠️ DevOps](#-devops)
- [🖼️ Pictures](#-pictures)
  - [Main Page](#main-page)
  - [Login / Sign Up](#loginsignup)
  - [Profile](#profile)
  - [Game](#game)
- [🎥 Full Video Demo](#full-video-demo)
- [💻 Usage on Local Computer](#-usage-on-local-computer)

---

## ✅ Basic Requirements

- 🧑‍💻 **Frontend**: TypeScript SPA with browser history  
- 🔒 **Security**: HTTPS, hashed passwords, validation, SQL injection & XSS protection  
- 🎮 **Gameplay**: Local 2-player mode on the same keyboard with equal paddle speed  
- 🏆 **Tournament**: Player registration and matchmaking  
- 🐳 **Deployment**: One-command Docker setup  
- 🌐 **Compatibility**: Fully supported in the latest Firefox with no unhandled errors  

---

## 🧱 Web Stack

- ⚙️ **Backend Framework** (★★★): Fastify with Node.js  
- 🎨 **Frontend Toolkit** (★★): Tailwind CSS with TypeScript  
- 🗄️ **Database** (★★): SQLite for persistent storage  

---

## 👤 User Management (★★★)

- 🔐 Secure authentication with unique tournament display names  
- 🖼️ Profile editing and avatar upload  
- 👥 Friends list with online status  
- 📊 Player stats (wins/losses)  
- 🕘 Match history for logged-in users  

---

## 🕹️ Gameplay & Experience

- 🌍 **Remote Play** (★★★): Play online with smooth network handling  
- 🛠️ **Customization** (★★): Power-ups, map options, and consistent settings across games  
- 💬 **Live Chat** (★★★): Messaging, blocking, invites, notifications, and profile access  

---

## 🤖 AI & Graphics

- 🧠 **AI Opponent** (★★★): Simulates input, uses power-ups, adapts, and plays to win  
- 📈 **Stats Dashboard** (★★): Charts and metrics of user history and gameplay  
- 🕹️ **3D Graphics** (★★★): Enhanced visuals using Babylon.js with smooth performance  

---

## ♿ Accessibility

- ⚡ **SSR Integration** (★): Server-rendered landing page with faster load and React hydration  

---

## 🛠️ DevOps

- 📊 **Monitoring** (★★): Prometheus & Grafana with dashboards, alerts, and secure access  

---

## 🖼️ Pictures

### Main Page  
<img width="800" height="547" alt="MainPage" src="https://github.com/user-attachments/assets/2d682f4d-a95d-4321-9deb-614582818e1c" />

### Login/SignUp  
<img width="2480" height="870" alt="Login/Signup" src="https://github.com/user-attachments/assets/183897be-e4ee-4913-b34b-07dff4fb7493" />

### Profile  
<img width="1385" height="895" alt="Profile" src="https://github.com/user-attachments/assets/3c8ddb93-9a34-4703-be79-c96e7a7a730a" />

### Game  
<img alt="Game" src="https://github.com/user-attachments/assets/66480d5f-f1a1-4223-9f16-b6e50f1a57b8" />

---

## 🎥 Full Video Demo

*Coming soon...*

---
# Usage in local computer

### 1. Clone Repository
```bash
git clone <ssh-or-https-repo-url>
```

 ### 🚀2. For backend
2.1 Move to server directory
```bash
cd server         # Move to backend directory
npm install       # Install dependencies
./generate-cert.sh # Generate local SSL certs (run once)
npm run dev       # Start development server
```

 ### 🚀3. For frontend
3.1 Move to client directory
```bash
cd client         # Move to frontend directory
npm install       # Install dependencies
npm run dev       # Start frontend server
```
