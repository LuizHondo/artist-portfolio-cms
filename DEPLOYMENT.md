# Deployment Guide - Raul Barbosa Neto Portfolio CMS

## Local Development Setup

### Prerequisites

- Node.js 18+ (https://nodejs.org/)
- npm or yarn
- Git

### Step 1: Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd raul-portfolio-cms

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Environment Configuration

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
JWT_SECRET=your_very_secure_random_secret_key_change_in_production
ADMIN_EMAIL=admin@raulbarbosa.com
ADMIN_PASSWORD=secure_initial_password
```

### Step 3: Database Setup

```bash
# Run Prisma migrations
npm run db:migrate

# Seed database (creates tags and admin user)
npm run db:seed
```

### Step 4: Run Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev
# Server runs on http://localhost:3000
# API available at http://localhost:3000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api
- **Admin Login**: Use credentials from `.env`

## Production Deployment

### Option 1: Deploy to Railway (Recommended)

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Create Project**
```bash
railway init
```

4. **Configure Environment Variables in Railway Dashboard**
- `DATABASE_URL`: PostgreSQL URL from Railway
- `JWT_SECRET`: Generate a strong random key
- `ADMIN_EMAIL`: Your admin email
- `ADMIN_PASSWORD`: Strong secure password
- `NODE_ENV`: production

5. **Deploy**
```bash
railway up
```

### Option 2: Deploy to Heroku

1. **Create Heroku App**
```bash
heroku create your-app-name
```

2. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set ADMIN_EMAIL=admin@raulbarbosa.com
heroku config:set ADMIN_PASSWORD=secure_password
```

3. **Add PostgreSQL Add-on**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

4. **Deploy**
```bash
git push heroku main
```

5. **Run Migrations**
```bash
heroku run npm run db:migrate
heroku run npm run db:seed
```

### Option 3: Docker Deployment

1. **Create Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy prisma
COPY prisma ./prisma

# Build backend
COPY src ./src
COPY tsconfig.json ./

# Copy frontend
COPY frontend ./frontend

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app

# Expose ports
EXPOSE 3000 5173

# Run migrations and start server
CMD ["sh", "-c", "npm run db:migrate && npm start"]
```

2. **Build and Run**
```bash
docker build -t raul-portfolio .
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." raul-portfolio
```

### Option 4: AWS EC2 Deployment

1. **Launch EC2 Instance** (Ubuntu 20.04 LTS)

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib

# Clone repository
git clone <your-repo-url>
cd raul-portfolio-cms
npm install
```

3. **Setup PostgreSQL**
```bash
sudo -u postgres createdb raul_portfolio
sudo -u postgres createuser raul_admin
# Set password and permissions...
```

4. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with PostgreSQL connection string
```

5. **Setup as SystemD Service**

Create `/etc/systemd/system/raul-portfolio.service`:

```ini
[Unit]
Description=Raul Portfolio CMS
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/raul-portfolio-cms
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

6. **Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl start raul-portfolio
sudo systemctl enable raul-portfolio
```

7. **Setup Nginx Reverse Proxy**

Create `/etc/nginx/sites-available/raul-portfolio`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Production Checklist

- [ ] Update `JWT_SECRET` to strong random key
- [ ] Set `NODE_ENV=production`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/SSL
- [ ] Setup automated backups
- [ ] Configure proper logging
- [ ] Setup monitoring (e.g., Sentry)
- [ ] Enable CORS for frontend domain
- [ ] Change default admin password
- [ ] Setup CI/CD pipeline

## Database Backup

### PostgreSQL Backup
```bash
pg_dump -U username -h localhost raul_portfolio > backup.sql
```

### Restore
```bash
psql -U username -h localhost raul_portfolio < backup.sql
```

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules
npm install
```

### Database migration issues
```bash
npm run db:reset  # WARNING: Deletes all data!
npm run db:migrate
npm run db:seed
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### JWT Token issues
- Clear browser localStorage
- Regenerate token by logging in again

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable HTTPS in production**
4. **Validate all inputs** (done with Zod)
5. **Use environment variables** for secrets
6. **Regular security updates** for dependencies
7. **Implement rate limiting** for login endpoint
8. **Use CORS** to restrict API access
9. **Database access** only from application
10. **Regular backups** of database

## Performance Optimization

1. **Database indexing** (especially slug field)
2. **Image optimization** (use WebP format)
3. **Frontend caching** with Service Workers
4. **API response caching**
5. **CDN for static assets**

## Next Steps

1. Configure your domain
2. Setup SSL certificate (Let's Encrypt)
3. Configure email notifications
4. Setup monitoring and logging
5. Create CI/CD pipeline
6. Setup automated database backups
