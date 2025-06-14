# Whole assignment checklist


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
### Modules in progress
Web: Backend Framework (Major), 
Web: Front-End Toolkit (Minor), 
Web: Database Integration (Minor), 

User Management: Standard user management, authentication, users across
tournaments (Major)
User Management: Implementing a remote authentication (Major)

Gameplay and user experience: Remote players (Major)
Gameplay and user experience: Game customization options (Minor)
Gameplay and user experience: Live chat (Major)

AI-Algo: Introduce an AI opponent (Major)
AI-Algo: User and game stats dashboards (Minor)

Graphics: Use advanced 3D techniques (Major)

Cybersecurity: Implement Two-Factor Authentication (2FA) and JWT (Major)

Server-side pong: Replace basic Pong with server-side Pong and implement an API (Major)


### Backend Framework (Major) ★★
- [x] Backend built with Fastify using Node.js

### Front-End Toolkit (Minor) ★★
- [x] Tailwind CSS used alongside TypeScript

### Database Integration (Minor) ★★
- [x] All DB instances use SQLite

### Blockchain Score Storage (Major) ★★★
- [ ] Integrate Avalanche blockchain to store tournament scores
- [ ] Develop Solidity smart contracts for score management
- [ ] Use a testing blockchain environment
- [ ] Adjust backend to interact with blockchain

### Standard User Management (Major) ★★
- [x] Secure registration and login
- [x] Unique display name for tournaments
- [x] Ability to update profile information
- [x] Avatar upload with default fallback
- [ ] Friends list with online status
- [x] Player stats showing wins and losses
- [ ] Match history with dates and details for logged-in users
- [ ] Logical handling of duplicate usernames and emails

### Remote Authentication (Major) ★★★
- [ ] Integrate Google Sign‑in
- [ ] Obtain credentials and permissions from provider
- [ ] Provide user-friendly login/authorization flows
- [ ] Secure exchange of tokens and user info

### Remote Players (Major) ★★★
- [x] Two players can play remotely via WebSocket
- [ ] Handle disconnects and lag for best experience

### Multiple Players (Major) ★★★
- [ ] Support games with more than two players

### Extra Game (Major) ★★★★
- [ ] Develop an additional game
- [ ] Track user gameplay history
- [ ] Implement matchmaking for the new game
- [ ] Store history and matchmaking data securely
- [ ] Maintain performance and update regularly

### Game Customization (Minor) ★★
- [x] Power-ups, attacks or map variants
- [x] Allow default basic version
- [ ] Options available for all games
- [x] User-friendly settings menus
- [ ] Consistent customization across games

### Live Chat (Major) ★★★
- [x] Direct messages between users
- [x] Ability to block other users
- [ ] Invite users to play from chat
- [x] Tournament notifications in chat
- [x] Links to user profiles

### AI Opponent (Major) ★★★
- [x] AI behaves using simulated keyboard input
- [ ] AI refreshes view once per second to anticipate bounces
- [ ] Uses power-ups if available
- [ ] Implements intelligent decision making without A*
- [ ] Adapts to different scenarios and can occasionally win

### Stats Dashboards (Minor) ★★
- [ ] Dashboard with user statistics
- [ ] Game session dashboard with outcomes/history
- [ ] Intuitive interface for tracking data
- [ ] Charts or graphs for visualization
- [ ] Easy access to personal history
- [ ] Additional metrics as desired

### WAF & Vault (Major) ★★★★
- [ ] Deploy WAF/ModSecurity with hardened configuration
- [ ] Use HashiCorp Vault for secrets management

### GDPR Options (Minor) ★★★
- [ ] Allow user anonymization
- [ ] Manage local data
- [ ] Provide account deletion

### 2FA & JWT (Major) ★★★
- [x] JWT-based endpoints implemented
- [ ] Two‑Factor Authentication

### Log Management (Major) ★★
- [ ] Infrastructure for centralized log collection

### Monitoring (Minor) ★★
- [ ] Implement monitoring system

### Microservices (Major) ★★★★
- [ ] Split backend into microservices

### Graphics (Major) ★★★
- [x] Implement Babylon.js 3D gameplay

### All Devices (Minor) ★★
- [ ] Responsive design for various screen sizes
- [ ] Support touch, keyboard and mouse input

### Browser Compatibility (Minor) ★★
- [ ] Support an additional browser with testing and optimization

### Multi-Language (Minor) ★★
- [ ] Support at least three languages
- [ ] Provide language selector
- [ ] Translate key content
- [ ] Use language packs for consistency
- [ ] Store preferred language for return visits

### Visually Impaired (Minor) ★★
- [ ] Screen reader and assistive technology support
- [ ] Alt text for images
- [ ] High-contrast color scheme
- [ ] Keyboard navigation and focus management
- [ ] Adjustable text size
- [ ] Keep accessibility standards updated

### Server-Side Rendering (Minor) ★★★
- [ ] Integrate SSR for faster loads
- [ ] Pre-render content and deliver HTML
- [ ] Optimize SEO
- [ ] Maintain consistent user experience

### Server Game & API (Major) ★★★★
- [x] Server-side Pong logic available through API
- [ ] Provide endpoints for game initialization, controls and updates
- [ ] Integrate with web interface so users can play on the site
- [ ] Ensure responsive and enjoyable gameplay

### CLI vs Web Players (Major) ★★★★
- [ ] CLI client replicates Pong gameplay
- [ ] Connect CLI to website via API
- [ ] Provide CLI authentication
- [ ] Real-time sync between CLI and web
- [ ] Allow CLI users to join/create matches
- [ ] Document how to play via CLI
