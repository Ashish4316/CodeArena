# CodeArena Deployment Guide

## 🚀 Production Deployment Guide

This guide covers deploying CodeArena to production using MongoDB Atlas and popular hosting platforms.

---

## 📋 Prerequisites

1. **MongoDB Atlas Account** (free tier available)
2. **Hosting Platform Account** (Render, Railway, or Vercel)
3. **Node.js 18+** installed locally
4. **Git** repository set up

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new organization and project

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose **M0 (Free tier)** for testing, or paid tier for production
3. Select your preferred region (closest to your users)
4. Click "Create"

### 1.3 Configure Database Access
1. Go to **Database Access** in the sidebar
2. Click "Add New Database User"
3. Create a username and **strong password** (save these!)
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### 1.4 Configure Network Access
1. Go to **Network Access** in the sidebar
2. Click "Add IP Address"
3. For development: Add your current IP
4. **For production**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ In production with sensitive data, whitelist specific IPs

### 1.5 Get Connection String
1. Go to **Database** → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select **Driver: Node.js**, **Version: 5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add database name: `mongodb+srv://...mongodb.net/codearena?retryWrites=true&w=majority`

---

## 🔐 Step 2: Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save this value - you'll need it for deployment.

---

## 🖥️ Step 3: Deploy Backend

### Option A: Deploy to Render (Recommended - Free Tier)

1. Go to [Render](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `codearena-api`
   - **Root Directory**: `codearena/backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...your-atlas-connection-string...
   JWT_SECRET=your-generated-jwt-secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
6. Click "Create Web Service"

### Option B: Deploy to Railway

1. Go to [Railway](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure root directory: `codearena/backend`
5. Add environment variables (same as Render)
6. Deploy automatically

### Option C: Deploy to Vercel (Serverless)

1. Create `vercel.json` in `backend/`:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "server.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "server.js" }]
   }
   ```
2. Deploy via Vercel CLI or GitHub integration

---

## 🌐 Step 4: Deploy Frontend

### Deploy to Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `codearena`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
6. Deploy!

### Deploy to Netlify

1. Go to [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Configure:
   - **Base directory**: `codearena`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variables
5. Deploy!

---

## 📝 Step 5: Update CORS Settings

After deploying frontend, update backend environment:

```
CLIENT_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.yourcustomdomain.com
```

---

## ✅ Step 6: Verify Deployment

1. **Check Backend Health**:
   ```
   curl https://your-backend-url.onrender.com/health
   ```

2. **Check API Docs**:
   ```
   https://your-backend-url.onrender.com/api
   ```

3. **Test Frontend**:
   - Open your frontend URL
   - Register a new account
   - Verify data saves correctly

---

## 🔧 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `64-char-hex-string` |
| `JWT_EXPIRE` | Token expiration | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://app.com` |
| `ALLOWED_ORIGINS` | Additional CORS origins | `https://a.com,https://b.com` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.com/api` |

---

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Verify IP whitelist in Atlas (add 0.0.0.0/0 for cloud deployment)
- Check username/password are correct

### "CORS error"
- Verify CLIENT_URL matches your frontend domain exactly
- Include protocol (https://)
- Check for trailing slashes

### "JWT malformed"
- Ensure JWT_SECRET is set in production
- Check token is being sent in Authorization header

### "502 Bad Gateway"
- Check server logs for errors
- Verify all dependencies installed
- Check PORT environment variable

---

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor memory/CPU usage
- Set up alerts

### MongoDB Atlas
- Monitor database performance
- View slow queries
- Set up alerts for connection limits

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:
1. Push to `main` branch
2. Deployment triggers automatically
3. Zero-downtime deployments

---

## 💡 Production Best Practices

1. **Always use HTTPS** in production
2. **Never commit .env files** to Git
3. **Use strong JWT secrets** (64+ characters)
4. **Enable rate limiting** (already configured)
5. **Monitor error logs** regularly
6. **Set up database backups** in Atlas
7. **Use environment variables** for all secrets

---

## 📞 Support

If you encounter issues:
1. Check server logs
2. Verify environment variables
3. Test API endpoints with Postman/curl
4. Check MongoDB Atlas metrics

Happy deploying! 🚀
