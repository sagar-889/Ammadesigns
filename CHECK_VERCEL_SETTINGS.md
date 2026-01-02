# ✅ Vercel Settings Checklist

## Open Vercel Dashboard Now!

Go to: https://vercel.com/dashboard

## Find Your Project Settings

1. Click on your project: **Ammadesigns**
2. Click **Settings** (top navigation)
3. Click **General** (left sidebar)

---

## ✅ CHECKLIST - Verify These Settings

### 1. Root Directory
```
Current: _______________  (probably empty or ".")
Should be: frontend
```
- [ ] Root Directory is set to `frontend`

### 2. Framework Preset
```
Current: _______________  (probably "Other" or "Create React App")
Should be: Vite
```
- [ ] Framework Preset is set to `Vite`

### 3. Build Command
```
Current: _______________  (probably "react-scripts build")
Should be: npm run build
```
- [ ] Build Command is `npm run build`

### 4. Output Directory
```
Current: _______________  (probably "build")
Should be: dist
```
- [ ] Output Directory is `dist`

### 5. Install Command
```
Current: _______________  (probably "npm install")
Should be: npm install
```
- [ ] Install Command is `npm install` ✓

### 6. Node.js Version
```
Current: _______________
Should be: 18.x or 20.x
```
- [ ] Node.js Version is 18.x or higher

---

## 🔧 How to Change Settings

### Change Root Directory:
1. Scroll to **Root Directory** section
2. Click **Edit**
3. Type: `frontend`
4. Click **Save**

### Change Framework & Build Settings:
1. Scroll to **Build & Development Settings**
2. Click **Override** (if not already overridden)
3. Select Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Save**

---

## 🚀 After Changing Settings

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Watch the build log

### ✅ Success Looks Like:
```
Cloning completed
Running "npm run build"
> vite build
Building for production...
✓ built in 2.5s
Build Completed
```

### ❌ Failure Looks Like:
```
Running "react-scripts build"
sh: react-scripts: command not found
Error: Command exited with 127
```

---

## 📸 Screenshot Guide

Your settings page should look like this:

```
┌─────────────────────────────────────────┐
│ Root Directory                          │
│ ┌─────────────────────────────────────┐ │
│ │ frontend                            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Build & Development Settings            │
│                                         │
│ Framework Preset: Vite                  │
│                                         │
│ Build Command                           │
│ ┌─────────────────────────────────────┐ │
│ │ npm run build                       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Output Directory                        │
│ ┌─────────────────────────────────────┐ │
│ │ dist                                │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🆘 Quick Fix Commands

If you prefer using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel --prod
```

This will deploy correctly because it's running from the frontend folder.

---

## ⚡ TL;DR - 3 Steps

1. **Vercel Dashboard** → Your Project → **Settings** → **General**
2. Set **Root Directory** = `frontend`
3. Set **Framework** = `Vite`, **Build** = `npm run build`, **Output** = `dist`
4. **Redeploy**

---

**The issue is NOT in your code. It's in Vercel's project settings!**

Your code is correct. Vercel just needs to know:
- Where to look (`frontend` folder)
- What to use (Vite, not Create React App)
