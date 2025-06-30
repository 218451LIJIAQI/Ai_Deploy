# 🚀 Quick Deploy to GitHub

## ⚠️ Git Required
You need to install Git first: https://git-scm.com/download/win

## After Installing Git, run these commands:

```bash
cd C:\Users\89846\Desktop\AI_PROJECT-main

git init
git add .
git commit -m "Initial commit: Netlify deployment ready"
git remote add origin https://github.com/218451LIJIAQI/Ai_Deploy.git
git branch -M main
git push -u origin main
```

## 🌐 Netlify Setup:
1. Go to netlify.com
2. "New site from Git" 
3. Select your GitHub repo
4. Build settings:
   - Command: `npm run build`
   - Directory: `moody-music/build`
   - Base: `moody-music`

## ✅ Your project is ready! 