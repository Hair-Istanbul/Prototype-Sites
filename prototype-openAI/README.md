# Hair Istanbul - Backend Dashboard

A secure backend dashboard for the Hair Istanbul website with visitor analytics, booking tracking, and user management.

## Features

- **Visitor Tracking**: Tracks website visitors with IP address and geolocation (country/city)
- **Booking Management**: Records all booking submissions with user details and location
- **Analytics Dashboard**: Graph visualization of visitors and unique visitors over time
- **User Management**: Add, remove, and modify dashboard users
- **Security**: JWT authentication, rate limiting, password hashing, and permanent user protection

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will start on port 3000 (default).

## Dashboard Access

The dashboard is accessible at: `http://localhost:3000/admin-dashboard-secure-2024`

## Default Users

Two users are created automatically:

1. **m_uvex** (Permanent - cannot be deleted or modified)
   - Username: `m_uvex`
   - Password: `040810MUSAmurad@..`

2. **admin** (Regular - can be modified/deleted)
   - Username: `admin`
   - Password: `admin123`

## Security Features

- **JWT Authentication**: Token-based authentication with 24-hour expiration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Password Hashing**: All passwords hashed with bcrypt (12 rounds)
- **Permanent User Protection**: The `m_uvex` user cannot be modified or deleted through the UI
- **Secure Cookies**: HTTP-only, secure, same-site cookies for token storage
- **Helmet.js**: Security headers for Express

## API Endpoints

### Authentication
- `POST /api/login` - Login with username and password
- `POST /api/logout` - Logout
- `GET /api/auth/check` - Check authentication status

### Visitor Tracking
- `POST /api/visitor` - Record visitor (IP, user agent)

### Bookings
- `POST /api/booking` - Submit booking data

### Analytics (Authenticated)
- `GET /api/analytics/visitors` - Get visitor analytics with date filters

### Bookings (Authenticated)
- `GET /api/bookings` - Get all bookings with pagination

### Users (Authenticated)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user password
- `DELETE /api/users/:id` - Delete user

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `NODE_ENV` - Environment (development/production)

## Database

Uses lowdb with JSON file storage (`hair_istanbul_db.json`). No external database required.

## Frontend Integration

The frontend automatically:
1. Tracks visitors on page load
2. Sends booking data when form is submitted
3. All tracking fails gracefully if backend is not running

## Production Deployment

### Important: GitHub Pages Limitations

**GitHub Pages only supports static sites** (HTML/CSS/JS). It **cannot** run Node.js backends. 

The current setup includes:
- Frontend: Static HTML/CSS/JS (works on GitHub Pages)
- Backend: Node.js/Express server (does NOT work on GitHub Pages)

### Deployment Options for Web Development Agencies

#### Best Option for Multiple Client Sites: Vercel Pro Team

**Why Vercel Pro is best for agencies:**
- **Manage all client sites** from one dashboard
- **Team collaboration** - invite clients to their own projects
- **1TB bandwidth/month** (10x free tier)
- **Unlimited projects** under one team
- **Custom domains** for each client site
- **Automatic SSL/HTTPS** for all domains
- **Edge network** for fast performance globally
- **Analytics** for each client site
- **Easy client handoff** - transfer project ownership

**Pricing:**
- **Pro Team**: $20/month
- Includes: 1TB bandwidth, unlimited projects, team members, custom domains
- **Per-site overage**: $40/100GB (rarely needed unless client has huge traffic)

**Deployment steps:**
1. Create Vercel account and upgrade to Pro Team
2. Create a team for your agency
3. For each client:
   - Create new project from client's GitHub repository
   - Deploy (auto-detects Node.js)
   - Add client's custom domain
   - Invite client as team member (read-only or admin access)
   - Client can view their site analytics and logs

**Benefits for agencies:**
- **One bill** for all client hosting
- **Profit opportunity** - charge clients markup on hosting
- **Easy management** - all sites in one place
- **Professional** - clients see their own dashboard
- **Scalable** - add unlimited clients

#### Alternative: Netlify Team

**Why Netlify Team:**
- **Manage multiple sites** from one account
- **Team collaboration** features
- **500GB bandwidth/month** on Pro plan
- **Form handling** built-in (great for client contact forms)
- **Edge functions** for backend APIs

**Pricing:**
- **Pro Team**: $19/month per member
- Includes: 500GB bandwidth, team collaboration, form handling
- **Business**: $99/month - 2TB bandwidth, SSO, priority support

#### Alternative: DigitalOcean VPS (Most Cost-Effective for High Traffic)

**Why DigitalOcean for agencies:**
- **Full control** over server
- **Host unlimited sites** on one VPS
- **Fixed pricing** - no bandwidth surprises
- **Install any stack** - Node.js, databases, etc.
- **Scale up** easily as needed
- **Most profitable** for agencies

**Pricing:**
- **Basic VPS**: $4/month (1GB RAM, 25GB SSD, 1TB transfer)
- **Recommended**: $6/month (2GB RAM, 50GB SSD, 2TB transfer)
- **High traffic**: $12/month (4GB RAM, 80GB SSD, 4TB transfer)

**Setup (more complex but worth it):**
1. Create DigitalOcean account
2. Create droplet (VPS) with Ubuntu
3. SSH into server
4. Install Node.js, nginx, SSL (Let's Encrypt)
5. Set up nginx reverse proxy for each client site
6. Deploy each site to its own subdirectory or domain
7. Configure SSL certificates for each domain

**Benefits:**
- **Unlimited sites** on one server
- **Fixed cost** regardless of bandwidth
- **Full control** - install any tools
- **Highest profit margin** for hosting
- **Scale** by upgrading VPS when needed

**Downsides:**
- Requires DevOps knowledge
- You manage security updates
- Manual SSL certificate renewal (or automate)
- No built-in analytics (add Google Analytics)

#### Recommendation for Your Agency

**For starting out:**
- Use **Vercel Pro Team** ($20/month)
- Easy to manage, professional for clients
- Scale up as you add more clients
- Charge clients $10-50/month markup on hosting

**For high-volume clients:**
- Use **DigitalOcean VPS** ($6-12/month per server)
- Host multiple clients per server
- Maximum profit margin
- Requires more technical setup

**Hybrid approach:**
- Small/medium clients → Vercel Pro
- High-traffic clients → DigitalOcean VPS

#### Option 2: Separate Deployment
Deploy frontend to GitHub Pages, backend to a different service:

1. **Frontend (GitHub Pages)**:
   - Upload `index.html` to GitHub repository
   - Enable GitHub Pages in repository settings
   - Site will be available at `username.github.io/repo-name`

2. **Backend (Render/Vercel/Netlify/Railway)**:
   - Deploy `server.js`, `database.js`, `package.json`
   - Get backend URL (e.g., `https://your-backend.onrender.com`)
   - Update frontend API calls to use backend URL
   - Change `fetch('/api/...')` to `fetch('https://your-backend.onrender.com/api/...')`

#### Option 3: Static Only (No Backend)
If you don't need the dashboard and tracking features:
- Deploy only `index.html` to GitHub Pages
- Remove the visitor tracking and booking API calls from the JavaScript
- Site will work without backend

### Before Deploying to Production

1. Change the `JWT_SECRET` environment variable to a secure random string
2. Set `NODE_ENV=production`
3. Use HTTPS (automatic on most deployment platforms)
4. Consider using a reverse proxy (nginx) for VPS deployments
5. Regularly backup the `hair_istanbul_db.json` file
6. Update the `ADMIN_PATH` in `server.js` to a custom secure path
7. Change default passwords for both users

### Example: Deploying to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables: Add `JWT_SECRET` with a secure random string
6. Click "Deploy Web Service"
7. Your backend will be available at `https://your-app-name.onrender.com`
8. Update frontend API URLs to point to your Render backend

### Example: Deploying Frontend to GitHub Pages (Static Only)

1. Create a new GitHub repository
2. Upload only `index.html`
3. Go to repository Settings → Pages
4. Select source: Deploy from branch → main
5. Save
6. Your site will be available at `https://username.github.io/repo-name`

Note: This option won't include the dashboard or tracking features.
