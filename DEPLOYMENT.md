# Full Deployment Guide (Production)

Complete steps to deploy the Next.js + Supabase app to production, including environment variables.

---

## Production Environment Variables

### Required Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Same as above (use "anon" "public" key) |

### Template: `.env.production`

Create this file on the server (never commit it — already in `.gitignore`):

```env
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Option A: Vultr VPS Deployment

### Prerequisites

- VPS with Ubuntu 22.04 or 24.04 (1 vCPU, 2GB RAM recommended)
- Domain pointed to VPS IP (A record)
- SSH access to the server

---

### Step 1: Connect to VPS

```bash
ssh root@<your-vps-ip>
```

---

### Step 2: Install Server Dependencies

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git
sudo apt-get update && sudo apt-get install -y git

# PM2
sudo npm install -g pm2

# Nginx
sudo apt-get install -y nginx
```

Verify: `node -v` (should show v20.x)

---

### Step 3: Create App Directory

```bash
sudo mkdir -p /var/www/my-app
sudo chown $USER:$USER /var/www/my-app
cd /var/www/my-app
```

---

### Step 4: Deploy Code

**Option A: Git (recommended)**

```bash
git clone https://github.com/yourusername/my-app.git .
```

**Option B: SCP (from your Mac)**

```bash
# Run from your Mac terminal:
scp -r /Users/subhadatta.samal@iqvia.com/Desktop/My\ Space/personal/subhadatta/my-app/* root@<your-vps-ip>:/var/www/my-app/
```

**If code ended up in `/var/www/my-app/my-app/`** — either flatten it or use the nested path:

```bash
# Option 1: Flatten (move contents up one level)
cd /var/www/my-app
mv my-app/* . && mv my-app/.* . 2>/dev/null; rmdir my-app

# Option 2: Use nested path — replace /var/www/my-app with /var/www/my-app/my-app in steps below
```

**App path:** `/var/www/my-app` (or `/var/www/my-app/my-app` if nested)

---

### Step 5: Create Production Environment File

```bash
cd /var/www/my-app/my-app   # Use this if code is nested
# OR: cd /var/www/my-app    # Use this if flattened
nano .env.production
```

Paste (replace with your values from `.env.local` or Supabase Dashboard):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

---

### Step 6: Install Dependencies and Build

```bash
cd /var/www/my-app/my-app   # Or /var/www/my-app if flattened
npm ci                     # Full install (devDependencies needed for build: TypeScript, Tailwind, PostCSS)
npm run build
```

---

### Step 7: Start with PM2

```bash
cd /var/www/my-app/my-app   # Or /var/www/my-app if flattened
pm2 start npm --name "my-app" -- start
pm2 save
pm2 startup
# Run the command it outputs (e.g. sudo env PATH=... pm2 startup systemd -u root --hp /root)
```

---

### Step 8: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/my-app
```

Add (replace `your-domain.com` with your domain or IP):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 9: SSL (Optional, for domain)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

### Step 10: Configure Supabase Auth URLs

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **URL Configuration**
3. Set:
   - **Site URL**: `https://your-domain.com` (or `http://<vps-ip>` if no domain)
   - **Redirect URLs**: `https://your-domain.com/**` (or `http://<vps-ip>/**`)

---

### Step 11: Verify

- Visit `http://<your-vps-ip>` or `https://your-domain.com`
- Test `/`, `/apps`, login, register, Splitease, Todo

---

### Future Deployments (Updates)

```bash
cd /var/www/my-app/my-app   # Or /var/www/my-app if flattened
git pull
npm ci
npm run build
pm2 restart my-app
```

Or create `deploy.sh` in the app directory:

```bash
#!/bin/bash
cd /var/www/my-app/my-app   # Or /var/www/my-app if flattened
git pull
npm ci
npm run build
pm2 restart my-app
```

Make executable: `chmod +x deploy.sh`, then run `./deploy.sh`

---

## Option B: Vercel Deployment

### Step 1: Push to Git

```bash
cd /path/to/my-app
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/my-app.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. [vercel.com](https://vercel.com) → New Project → Import repo
2. Root Directory: `subhadatta/my-app` (if app is in subfolder)
3. Add environment variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Deploy

### Step 3: Supabase Auth URLs

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Security Checklist

- [ ] `.env.production` is never committed (`.gitignore` has `.env*`)
- [ ] Firewall: `sudo ufw allow 22 80 443` then `sudo ufw enable`
- [ ] Keep server updated: `sudo apt update && sudo apt upgrade -y`

---

## Troubleshooting

| Issue | Action |
|-------|--------|
| Build fails | `node -v` (need 20+), `npm run build` locally first |
| 502 Bad Gateway | `pm2 status`, `pm2 logs my-app` |
| Auth redirect fails | Check Supabase Site URL and Redirect URLs |
| Out of memory | Upgrade VPS or add swap |
