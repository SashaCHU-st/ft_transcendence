# Project progress tracker

## Basic Requirements
- [x] Frontend built with TypeScript
- [x] Single Page Application with browser history support
- [ ] Compatible with the latest Firefox
- [ ] No unhandled errors or warnings when browsing
- [ ] Dockerized deployment with a single command
- [x] HTTPS enabled for all communication
- [x] Passwords stored hashed
- [ ] Protection against SQL injection and XSS verified
- [x] Form and input validation on server side
- [x] Local two-player gameplay on the same keyboard
- [x] Tournament system with registration and matchmaking
- [x] Identical paddle speed for all players

## Modules

### Web ★★
- **Backend Framework (Major)**
  - [x] Use Fastify with Node.js for the backend
- **Front-End Toolkit (Minor)**
  - [x] Use Tailwind CSS alongside TypeScript
- **Database Integration (Minor)**
  - [x] Use SQLite for all database storage

### User Management ★★
- **Standard user management, authentication and users across tournaments (Major)**
  - [x] Secure registration and login
  - [x] Unique display name for tournaments
  - [x] Profile update and avatar upload
  - [ ] Friends list and online status
  - [x] Player stats (wins/losses)
  - [ ] Match history for logged in users
- **Implementing a remote authentication (Major)**
  - [ ] Integrate Google Sign‑in
  - [ ] Obtain credentials and permissions from provider
  - [ ] Implement user-friendly login and authorization flows
  - [ ] Securely exchange authentication tokens and user data

### Gameplay & Experience
#### Remote Players ★★★ (Major)
- [x] Two players can play remotely from separate computers
- [ ] Handle network issues and provide the best user experience

#### Game Customization ★★ (Minor)
- [x] Offer power-ups, attacks or different maps
- [x] Allow users to pick a default basic variant
- [ ] Apply customization options to all games
- [x] Provide settings menus for adjusting parameters
- [ ] Keep customization consistent across games

#### Live Chat ★★★ (Major)
- [x] Direct messages between users
- [x] Ability to block other users
- [ ] Invite users to play Pong via chat
- [x] Tournament notifications through chat
- [x] Access other players' profiles from chat

### AI‑Algo
#### AI Opponent ★★★ (Major)
- [x] AI opponent simulates keyboard input
- [x] Anticipates bounces with view refresh once per second
- [ ] Uses power-ups if customization module is enabled
- [x] Strategic decision making without A* algorithm
- [x] Adapts to different gameplay situations and can win

#### Stats Dashboards ★★ (Minor)
- [ ] Dashboard with user gaming statistics
- [ ] Dashboard for game session history
- [ ] Charts and graphs for data visualization
- [ ] Users can explore their own history and metrics

### Graphics ★★★ (Major)
- [x] Implement advanced 3D graphics using Babylon.js
- [ ] Provide immersive gameplay with enhanced visuals
- [ ] Ensure compatibility and performance of the 3D engine

### Cybersecurity
#### 2FA & JWT ★★★ (Major)
- [x] JWT-based authentication for API endpoints
- [ ] Two-Factor Authentication for users

### Server-Side Pong
#### Server Game & API ★★★★ (Major)
- [x] Develop server-side Pong logic for gameplay and scoring
- [ ] Expose API endpoints for CLI and web interaction
- [ ] Support game initialization, player controls and state updates
- [ ] Provide responsive and enjoyable gameplay
- [ ] Integrate the server-side game with the web application

### Accessibility
#### Server-Side Rendering (SSR) Integration ★ (Minor)
- [x] Pre-render the landing page on the server
- [x] Serve HTML content for faster initial load
- [x] Hydrate the React app on the client

### Devops
#### Monitoring System ★★ (Minor)
* [x] Deploy Prometheus to collect metrics from system components
* [x] Configure exporters to gather service, database and host metrics
* [x] Provide custom Grafana dashboards for real‑time visualization
* [x] Set up Prometheus alert rules for critical issues
* [x] Retain historical metrics using persistent storage
* [x] Protect Grafana with authentication and access control

