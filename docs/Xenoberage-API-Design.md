# Sample API Endpoint Design for Xenoberage Integration

## REST Endpoints

### Player
- `GET /api/players` — List all players
- `GET /api/players/:id` — Get player by ID
- `POST /api/players` — Create new player
- `PUT /api/players/:id` — Update player
- `DELETE /api/players/:id` — Delete player

### Ship
- `GET /api/ships` — List all ships
- `GET /api/ships/:id` — Get ship by ID
- `POST /api/ships` — Create new ship
- `PUT /api/ships/:id` — Update ship
- `DELETE /api/ships/:id` — Delete ship

### Sector
- `GET /api/sectors` — List all sectors
- `GET /api/sectors/:id` — Get sector by ID
- `POST /api/sectors` — Create new sector
- `PUT /api/sectors/:id` — Update sector
- `DELETE /api/sectors/:id` — Delete sector

### Event
- `GET /api/events` — List all events
- `GET /api/events/:id` — Get event by ID
- `POST /api/events` — Create new event
- `PUT /api/events/:id` — Update event
- `DELETE /api/events/:id` — Delete event

### Session/Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/session` — Get current session

### Log
- `GET /api/logs` — List logs
- `GET /api/logs/:id` — Get log by ID

---

## GraphQL (Alternative)
- `type Query { players, player(id), ships, ship(id), sectors, sector(id), ... }`
- `type Mutation { createPlayer, updatePlayer, ... }`

*Endpoints should return JSON and support CORS for frontend integration.*
