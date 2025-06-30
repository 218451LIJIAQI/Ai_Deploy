# 🚀 Netlify Deployment Guide

This guide will help you deploy the Moodify music recommendation application to Netlify.

## 📋 Pre-deployment Preparation

### 1. Account Setup
- Create a [Netlify](https://www.netlify.com/) account
- Create a [Spotify Developer](https://developer.spotify.com/dashboard/) account
- Prepare backend deployment (recommended: Heroku, Railway, or DigitalOcean)

### 2. Environment Variables Configuration
The following environment variables need to be set in Netlify:

#### Required Environment Variables:
```bash
# Spotify API credentials
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret

# Backend API URL
REACT_APP_API_BASE_URL=https://your-backend-url.herokuapp.com

# Production environment settings
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

## 🔧 Deployment Steps

### Method 1: Git Integration Deployment (Recommended)

1. **Connect Git Repository**
   - Log in to Netlify console
   - Click "New site from Git"
   - Select GitHub/GitLab/Bitbucket
   - Choose your project repository

2. **Build Settings**
   ```bash
   # Build command
   Build command: npm run build
   
   # Publish directory
   Publish directory: moody-music/build
   
   # Base directory
   Base directory: moody-music
   ```

3. **Environment Variables Setup**
   - Go to Site settings > Environment variables
   - Add all the above environment variables

4. **Deploy**
   - Click "Deploy site"
   - Wait for build completion

### Method 2: Manual Deployment

1. **Local Build**
   ```bash
   cd moody-music
   npm install
   npm run build
   ```

2. **Manual Upload**
   - Compress the `build` folder
   - Drag and drop upload in Netlify console

## ⚠️ Important Configuration Notes

### 1. Spotify API Security
The original code exposes `CLIENT_SECRET` in the frontend, which is insecure in production. We provide two solutions:

#### Option A: Use Netlify Functions (Recommended)
- Created `functions/spotify-auth.js`
- Use `apiService.production.js` to replace original service
- Set `CLIENT_SECRET` in Netlify environment variables

#### Option B: Remove CLIENT_SECRET (Simplified approach)
- Only use `CLIENT_ID` in frontend
- Limited to public data access

### 2. Backend API Integration
If you have a backend API:

1. **Deploy Backend**
   - Recommended: Heroku, Railway, or DigitalOcean
   - Get backend URL

2. **Update Frontend Configuration**
   - Set `REACT_APP_API_BASE_URL` in `.env.production`
   - Update proxy settings in `netlify.toml`

### 3. File Structure Verification
Ensure your project contains the following files:
```
Project Root/
├── netlify.toml                    # Netlify configuration
├── functions/
│   └── spotify-auth.js            # Spotify authentication function
└── moody-music/
    ├── _redirects                 # Redirect rules
    ├── .env.production           # Production environment variables
    └── src/components/
        └── apiService.production.js  # Production API service
```

## 🔧 Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain name

2. **DNS Configuration**
   - Set up DNS at your domain provider
   - Add CNAME record pointing to Netlify

3. **SSL Certificate**
   - Netlify automatically provides Let's Encrypt SSL certificate

## 🐛 Troubleshooting

### 1. Build Failures
```bash
# Check Node.js version
NODE_VERSION=18

# Clean dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 2. API Request Failures
- Check if environment variables are correctly set
- Confirm backend URL is accessible
- Check CORS settings

### 3. Spotify Authentication Issues
- Ensure Spotify app settings include correct redirect URIs
- Verify CLIENT_ID and CLIENT_SECRET are correct

### 4. Routing Issues
- Ensure `_redirects` file exists
- Check SPA redirect rules

## 📊 Performance Optimization

### 1. Build Optimization
```bash
# Enable in netlify.toml
[build.processing.css]
  bundle = true
  minify = true
[build.processing.js]
  bundle = true
  minify = true
```

### 2. Caching Strategy
- Static assets automatically cached
- API response caching (if implemented)

### 3. Image Optimization
- Use Netlify image optimization plugins
- Compress album cover images

## 🔄 Continuous Deployment

Set up automatic deployment:
1. **Git Integration**
   - Push to main branch automatically triggers deployment
   - Set branch deployment rules

2. **Build Hooks**
   - Set webhook for external triggers
   - Scheduled builds (if needed)

## 📈 Monitoring and Analytics

1. **Netlify Analytics**
   - Enable site analytics
   - Monitor traffic and performance

2. **Error Monitoring**
   - Integrate Sentry or other error tracking services
   - Monitor JavaScript errors

## 🎉 Deployment Complete

After successful deployment, your application will be available at:
- Netlify provided URL: `https://your-app-name.netlify.app`
- Custom domain (if configured): `https://your-domain.com`

## 📞 Support

If you encounter issues, please check:
1. Netlify deployment logs
2. Browser developer console
3. Network request status

---

**Happy Deploying! 🎵** 