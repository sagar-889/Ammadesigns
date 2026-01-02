# Scripts Folder

Windows batch scripts for easy project management.

---

## 📜 Available Scripts

### 1. **install.bat**
Installs all dependencies for both frontend and backend.

**Usage:**
```bash
cd scripts
install.bat
```

**What it does:**
- Installs backend dependencies (`npm install` in backend folder)
- Installs frontend dependencies (`npm install` in frontend folder)
- Shows completion message

**When to use:**
- First time setup
- After cloning the repository
- After pulling new changes with package updates

---

### 2. **start-dev.bat**
Starts both development servers simultaneously.

**Usage:**
```bash
cd scripts
start-dev.bat
```

**What it does:**
- Starts backend server on http://localhost:5000
- Starts frontend dev server on http://localhost:5173
- Opens two separate command windows

**When to use:**
- During development
- Testing the application locally
- Daily development work

**Note:** Press `Ctrl+C` in each window to stop the servers.

---

### 3. **deploy-prep.bat**
Prepares the application for deployment.

**Usage:**
```bash
cd scripts
deploy-prep.bat
```

**What it does:**
- Builds frontend for production
- Runs production checks
- Creates optimized build in `frontend/dist`
- Validates environment files

**When to use:**
- Before deploying to production
- Testing production build locally
- Creating deployment package

---

## 🚀 Quick Start Workflow

### First Time Setup:
```bash
# 1. Install dependencies
cd scripts
install.bat

# 2. Configure environment files
# Edit backend/.env and frontend/.env

# 3. Setup database
# Import database schema

# 4. Start development
start-dev.bat
```

### Daily Development:
```bash
cd scripts
start-dev.bat
```

### Before Deployment:
```bash
cd scripts
deploy-prep.bat
```

---

## 💡 Tips

### Running from Root Directory

You can also run these scripts from the project root:

```bash
# From C:\webapp\
scripts\install.bat
scripts\start-dev.bat
scripts\deploy-prep.bat
```

### Creating Desktop Shortcuts

**For easy access, create shortcuts:**

1. Right-click on `start-dev.bat`
2. Select "Create shortcut"
3. Move shortcut to Desktop
4. Rename to "Start Tailor Shop"

Now you can start development with one double-click!

---

## 🔧 Troubleshooting

### Script doesn't run
- Make sure you're in the correct directory
- Check if Node.js is installed: `node --version`
- Check if npm is installed: `npm --version`

### Port already in use
- Close other applications using ports 5000 or 5173
- Or change ports in configuration files

### Dependencies not installing
- Check internet connection
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` folders and try again

---

## 📝 Script Details

### install.bat
```batch
@echo off
echo Installing dependencies...
cd ..\backend
call npm install
cd ..\frontend
call npm install
echo Installation complete!
pause
```

### start-dev.bat
```batch
@echo off
start cmd /k "cd ..\backend && npm start"
start cmd /k "cd ..\frontend && npm run dev"
```

### deploy-prep.bat
```batch
@echo off
echo Preparing for deployment...
cd ..\frontend
call npm run build
echo Build complete!
pause
```

---

## 🆕 Adding New Scripts

To add a new script:

1. Create a new `.bat` file in this folder
2. Add your commands
3. Update this README with documentation
4. Test the script

**Example - create-backup.bat:**
```batch
@echo off
echo Creating backup...
xcopy /E /I ..\backend backup\backend
xcopy /E /I ..\frontend backup\frontend
echo Backup complete!
pause
```

---

## 📞 Support

If scripts don't work:
1. Check Node.js installation
2. Verify you're in the correct directory
3. Check file permissions
4. Review error messages

For more help, see the main documentation in the `docs` folder.

---

**Last Updated:** January 2, 2026
