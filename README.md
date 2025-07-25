# ✅ Project Summary
## Basic requiremnts

This project is a secure, TypeScript-based Single Page Application (SPA) featuring:
- 🧑‍💻 **Frontend**: Built with TypeScript and supports browser history  
- 🔒 **Security**: HTTPS, hashed passwords, server-side validation, SQL injection & XSS protection  
- 🎮 **Gameplay**: Local 2-player mode (same keyboard) with fair mechanics  
- 🏆 **Tournament**: Registration and matchmaking system  
- 🐳 **Deployment**: One-command Docker setup  
- 🌐 **Compatibility**: Fully works on the latest Firefox, with no unhandled errors or warnings  

## Web 
- **Backend Framework (Major)**
   ✅ Use Fastify with Node.js for the backend
- **Front-End Toolkit (Minor)**
   ✅ Use Tailwind CSS alongside TypeScript
- **Database Integration (Minor)**
   ✅ Use SQLite for all database storage

# Pictures 
## Main page
<img width="800" height="547" alt="MainPage (2)" src="https://github.com/user-attachments/assets/2d682f4d-a95d-4321-9deb-614582818e1c" />


## Login/SignUp
<img width="2480" height="870" alt="image" src="https://github.com/user-attachments/assets/183897be-e4ee-4913-b34b-07dff4fb7493" />

## Profile
<img width="1385" height="895" alt="image" src="https://github.com/user-attachments/assets/3c8ddb93-9a34-4703-be79-c96e7a7a730a" />

## Game
<img width="800" height="515" alt="game (2)" src="https://github.com/user-attachments/assets/5953bfda-4da7-43c0-8adc-619c4f3e0f64" />

# Usage in local computer

## Steps
1.💻 Clone repository

 ### 🚀2. For backend
2.1 Move to server directory
```bash
cd server
```
2.2 Install dependencies
```bash
npm install
```
2.3 Generate local SSL certificates (only once)
```bash
./generate-cert.sh
```

2.4 Start server
```bash
npm run dev
```

 ### 🚀3. For frontend
3.1 Move to client directory
```bash
cd client
```
3.2 Install dependencies
```bash
npm install
```
  
3.3 Start server   
```
npm run dev

```
