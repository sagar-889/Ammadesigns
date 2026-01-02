# Oracle Cloud Free Tier Deployment Guide

Complete guide to deploy your e-commerce website on Oracle Cloud for FREE forever.

## 📋 What You'll Get (100% FREE Forever)

- ✅ **2 VMs** with 1GB RAM each (or 1 VM with 2GB RAM)
- ✅ **200GB Block Storage**
- ✅ **10TB Outbound Data Transfer/month**
- ✅ **MySQL Database**
- ✅ **Always On** (no sleeping)
- ✅ **99.95% Uptime SLA**
- ✅ **Professional Infrastructure**

Perfect for: 10,000-50,000 visitors/month

---

## 🚀 Part 1: Account Setup

### Step 1: Create Oracle Cloud Account

1. **Go to**: https://www.oracle.com/cloud/free/
2. **Click**: "Start for free"
3. **Fill in details**:
   - Email address
   - Country/Region (Select India)
   - First & Last Name
   
4. **Verify Email**: Check inbox and click verification link

5. **Complete Registration**:
   - Choose "Individual" account type
   - Enter phone number (will receive OTP)
   - Verify phone with OTP
   
6. **Payment Verification** (No charges):
   - Add credit/debit card (for verification only)
   - ₹2 will be charged and refunded immediately
   - This is just to verify you're not a bot
   
7. **Identity Verification**:
   - Upload ID proof (Aadhaar/PAN/Passport)
   - Take a selfie
   - Wait 1-2 days for approval

### Step 2: Wait for Approval

- Check email for approval (usually 24-48 hours)
- You'll receive: "Your Oracle Cloud Account is Ready"

---

## 🖥️ Part 2: Create Virtual Machine

### Step 1: Login to Oracle Cloud Console

1. Go to: https://cloud.oracle.com/
2. Login with your credentials
3. You'll see the Oracle Cloud Dashboard

### Step 2: Create Compute Instance (VM)

1. **Click**: "Create a VM instance"
2. **Name**: `tailor-shop-server`
3. **Placement**: Leave default (Availability Domain)

4. **Image and Shape**:
   - **Image**: Click "Change Image"
     - Select: **Ubuntu 22.04** (Canonical)
     - Click "Select Image"
   
   - **Shape**: Click "Change Shape"
     - Select: **VM.Standard.A1.Flex** (ARM-based, Always Free)
     - **OCPUs**: 2 (or 1 if you want 2 VMs)
     - **Memory**: 12GB (or 6GB each for 2 VMs)
     - Click "Select Shape"

5. **Networking**:
   - **Virtual Cloud Network**: Create new VCN (default)
   - **Subnet**: Create new subnet (default)
   - **Assign Public IP**: ✅ YES (checked)

6. **SSH Keys**:
   - **Generate SSH Key Pair**: Click this
   - **Download Private Key**: Save as `oracle-key.pem`
   - **Download Public Key**: Save as `oracle-key.pub`
   - ⚠️ IMPORTANT: Keep these files safe!

7. **Boot Volume**: Leave default (50GB)

8. **Click**: "Create"

### Step 3: Wait for VM Creation

- Status will change from "Provisioning" to "Running" (2-3 minutes)
- Note down the **Public IP Address** (e.g., 152.67.123.45)

---

## 🔐 Part 3: Configure Firewall & Security

### Step 1: Open Ports in Oracle Cloud

1. **In VM Details Page**:
   - Click on **Virtual Cloud Network** name
   - Click on **Default Security List**
   
2. **Add Ingress Rules** (Allow incoming traffic):

   **Rule 1: HTTP (Port 80)**
   - Click "Add Ingress Rules"
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: TCP
   - Destination Port Range: `80`
   - Description: HTTP
   - Click "Add Ingress Rules"

   **Rule 2: HTTPS (Port 443)**
   - Click "Add Ingress Rules"
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: TCP
   - Destination Port Range: `443`
   - Description: HTTPS
   - Click "Add Ingress Rules"

   **Rule 3: Custom Backend (Port 5000)**
   - Click "Add Ingress Rules"
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: TCP
   - Destination Port Range: `5000`
   - Description: Backend API
   - Click "Add Ingress Rules"

### Step 2: Connect to VM via SSH

**On Windows (using PowerShell):**

```powershell
# Navigate to where you saved the key
cd Downloads

# Set correct permissions
icacls oracle-key.pem /inheritance:r
icacls oracle-key.pem /grant:r "%username%:R"

# Connect to VM (replace with your IP)
ssh -i oracle-key.pem ubuntu@YOUR_VM_PUBLIC_IP
```

**First time connection:**
- Type `yes` when asked about fingerprint
- You should now be connected to your Ubuntu server!

### Step 3: Configure Ubuntu Firewall

```bash
# Allow SSH, HTTP, HTTPS, and Backend port
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📦 Part 4: Install Required Software

### Step 1: Update System

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y
```

### Step 2: Install Node.js 18

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x
```

### Step 3: Install MySQL

```bash
# Install MySQL Server
sudo apt install mysql-server -y

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

**MySQL Secure Installation Prompts:**
- Validate Password Component: `N` (No)
- Remove anonymous users: `Y` (Yes)
- Disallow root login remotely: `Y` (Yes)
- Remove test database: `Y` (Yes)
- Reload privilege tables: `Y` (Yes)

### Step 4: Create Database and User

```bash
# Login to MySQL as root
sudo mysql

# In MySQL prompt, run these commands:
```

```sql
-- Create database
CREATE DATABASE tailor_shop;

-- Create user (change password!)
CREATE USER 'tailorshop'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON tailor_shop.* TO 'tailorshop'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 5: Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 6: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 7: Install Git

```bash
# Install Git
sudo apt install git -y

# Verify
git --version
```

---

## 🚀 Part 5: Deploy Your Application

### Step 1: Clone Your Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository (replace with your repo URL)
git clone https://github.com/yourusername/your-repo.git

# Or if you don't have it on GitHub yet, we'll upload files
```

**If you don't have GitHub repo, upload files:**

```bash
# On your local machine (in project folder)
# Compress your project
tar -czf project.tar.gz backend frontend

# Upload to server (from your local machine)
scp -i oracle-key.pem project.tar.gz ubuntu@YOUR_VM_IP:~/

# On server, extract
cd ~
tar -xzf project.tar.gz
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd ~/backend  # or ~/your-repo/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Add this to .env file:**

```env
PORT=5000
DB_HOST=localhost
DB_USER=tailorshop
DB_PASSWORD=YourStrongPassword123!
DB_NAME=tailor_shop

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

NODE_ENV=production
```

**Save file**: Press `Ctrl+X`, then `Y`, then `Enter`

### Step 3: Import Database Schema

```bash
# Import your database schema
mysql -u tailorshop -p tailor_shop < database/complete_schema.sql

# Enter password when prompted
```

### Step 4: Start Backend with PM2

```bash
# Start backend
pm2 start server.js --name tailor-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it shows

# Check status
pm2 status
pm2 logs tailor-backend
```

### Step 5: Build and Deploy Frontend

```bash
# Navigate to frontend folder
cd ~/frontend  # or ~/your-repo/frontend

# Install dependencies
npm install

# Create production .env file
nano .env.production
```

**Add this to .env.production:**

```env
VITE_API_URL=http://YOUR_VM_PUBLIC_IP:5000
VITE_SHOP_NAME=Sri Ladies Tailor
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Save file**: `Ctrl+X`, `Y`, `Enter`

```bash
# Build for production
npm run build

# The build will be in 'dist' folder
```

---

## 🌐 Part 6: Configure Nginx

### Step 1: Create Nginx Configuration

```bash
# Create new Nginx config
sudo nano /etc/nginx/sites-available/tailor-shop
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name YOUR_VM_PUBLIC_IP;  # Replace with your IP or domain

    # Frontend - Serve React build
    location / {
        root /home/ubuntu/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }

    # Backend API - Proxy to Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve uploaded images
    location /uploads {
        alias /home/ubuntu/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save file**: `Ctrl+X`, `Y`, `Enter`

### Step 2: Enable Site and Restart Nginx

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/tailor-shop /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

---

## 🔒 Part 7: Setup SSL Certificate (HTTPS)

### Step 1: Install Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Get SSL Certificate

**If you have a domain:**

```bash
# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes
```

**If using IP only (for testing):**
- SSL won't work with IP addresses
- Use HTTP for now
- Get a free domain from Freenom.com or buy one

---

## ✅ Part 8: Verify Deployment

### Step 1: Check Backend

```bash
# Check if backend is running
pm2 status

# Check logs
pm2 logs tailor-backend

# Test backend API
curl http://localhost:5000/api/health
```

### Step 2: Check Frontend

Open browser and visit:
```
http://YOUR_VM_PUBLIC_IP
```

You should see your website!

### Step 3: Test Full Flow

1. ✅ Homepage loads
2. ✅ Shop page shows products
3. ✅ Can add to cart
4. ✅ Login works
5. ✅ Checkout works
6. ✅ Admin panel accessible

---

## 🔧 Part 9: Maintenance Commands

### Useful Commands

```bash
# Check PM2 processes
pm2 status
pm2 logs
pm2 restart tailor-backend

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx

# Check MySQL
sudo systemctl status mysql
mysql -u tailorshop -p

# View system resources
htop  # Install with: sudo apt install htop

# Check disk space
df -h

# Check memory
free -h

# Update application
cd ~/backend
git pull
npm install
pm2 restart tailor-backend

cd ~/frontend
git pull
npm install
npm run build
sudo systemctl restart nginx
```

### Monitor Logs

```bash
# Backend logs
pm2 logs tailor-backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

---

## 🎯 Part 10: Connect Your Domain (Optional)

### Step 1: Point Domain to VM

1. **Go to your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Add A Record**:
   - Type: `A`
   - Name: `@`
   - Value: `YOUR_VM_PUBLIC_IP`
   - TTL: `3600`

3. **Add WWW Record**:
   - Type: `A`
   - Name: `www`
   - Value: `YOUR_VM_PUBLIC_IP`
   - TTL: `3600`

### Step 2: Update Nginx Configuration

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/tailor-shop

# Change server_name line to:
server_name yourdomain.com www.yourdomain.com;

# Save and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 3: Get SSL Certificate

```bash
# Get SSL for your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🚨 Troubleshooting

### Issue: Can't connect to VM

```bash
# Check if VM is running in Oracle Console
# Check security list rules
# Check Ubuntu firewall: sudo ufw status
# Try ping: ping YOUR_VM_IP
```

### Issue: Website not loading

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: Backend not working

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs tailor-backend

# Restart backend
pm2 restart tailor-backend

# Check if port 5000 is listening
sudo netstat -tulpn | grep 5000
```

### Issue: Database connection error

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u tailorshop -p tailor_shop

# Check credentials in backend/.env
```

### Issue: Out of memory

```bash
# Check memory usage
free -h

# Add swap space (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 📊 Performance Optimization

### Enable Caching

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/tailor-shop

# Add inside server block:
```

```nginx
# Browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Enable Compression

Already enabled in the Nginx config above with gzip.

### Optimize MySQL

```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add under [mysqld]:
```

```ini
innodb_buffer_pool_size = 256M
max_connections = 50
query_cache_size = 32M
```

```bash
# Restart MySQL
sudo systemctl restart mysql
```

---

## 💰 Cost Monitoring

### Check Your Usage

1. Login to Oracle Cloud Console
2. Go to **Billing & Cost Management**
3. View **Cost Analysis**
4. Should show **$0.00** (Always Free resources)

### Stay Within Free Tier

- ✅ Use Always Free shapes only
- ✅ Don't exceed 10TB outbound transfer/month
- ✅ Don't create paid resources
- ✅ Monitor usage regularly

---

## 🎉 Success!

Your e-commerce website is now deployed on Oracle Cloud Free Tier!

**Your website is accessible at:**
- `http://YOUR_VM_PUBLIC_IP`
- Or `https://yourdomain.com` (if you configured domain + SSL)

**Admin panel:**
- `http://YOUR_VM_PUBLIC_IP/admin`

**Next Steps:**
1. Test all features thoroughly
2. Add your products
3. Configure Razorpay for payments
4. Share your website link
5. Monitor performance

---

## 📞 Support

If you face any issues:
1. Check the Troubleshooting section above
2. Check PM2 logs: `pm2 logs`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Check MySQL logs: `sudo tail -f /var/log/mysql/error.log`

---

**Congratulations! Your business website is now live on professional infrastructure for FREE! 🎊**
