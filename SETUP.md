# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Clone & Install
```bash
cd raul-portfolio-cms
npm install
cd frontend && npm install && cd ..
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

### Step 3: Database
```bash
npm run db:migrate
npm run db:seed
```

### Step 4: Run Both Servers
**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

### Step 5: Open Browser
- **Frontend**: http://localhost:5173
- **Admin Login**: /admin/login
- **Email**: admin@raulbarbosa.com
- **Password**: change_me

---

## 📖 Key Documentation

1. **README.md** - Complete project overview
2. **API.md** - Detailed API documentation
3. **DEPLOYMENT.md** - Production deployment guides
4. **prisma/schema.prisma** - Database schema

---

## 🎯 First Steps in Admin

1. Login at `/admin/login`
2. Go to "Manage Artworks"
3. Click "Create New Artwork"
4. Fill in:
   - Title (e.g., "Cyberpunk Samurai")
   - Summary (brief description)
   - Medium (e.g., "Digital Painting")
   - Year Created
   - Cover Image URL
   - Featured Priority (1 = hero, 2-3 = featured grid, 0 = not featured)
   - Tags (select predefined tags)
5. Add Process Entries showing the creative journey
   - Step 1: Initial Sketch
   - Step 2: Anatomy Refinement
   - Step 3: Color Pass
   - Step 4: Final Render

---

## 🏗️ Project Structure

```
Backend:    src/ → Express API + Prisma ORM
Frontend:   frontend/src/ → React SPA
Database:   prisma/ → Schema & migrations
Docs:       README.md, API.md, DEPLOYMENT.md
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `src/app.ts` | Main Express app |
| `prisma/schema.prisma` | Database structure |
| `frontend/src/App.tsx` | React main component |
| `.env.example` | Environment variables template |
| `package.json` | Dependencies |

---

## 🐛 Troubleshooting

**Port 3000 already in use:**
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

**Database errors:**
```bash
npm run db:reset      # WARNING: Deletes all data
npm run db:migrate
npm run db:seed
```

**Frontend not loading:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/src/pages/HomePage.css` and `AdminDashboard`

### Change Admin Email/Password
Update `.env` and run `npm run db:seed` again

### Add More Tags
Edit `src/database/seed.ts` and rerun seed

---

## 📚 Learn More

- **Express.js**: https://expressjs.com/
- **Prisma ORM**: https://www.prisma.io/
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

## ✅ You're All Set!

Everything is configured and ready to go. Start creating amazing work! 🎨

For deployment, see `DEPLOYMENT.md`
