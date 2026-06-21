# MongoDB Setup Guide for Windows

## 📥 Step 1: Download MongoDB Community Edition

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **OS:** Windows
   - **Version:** Latest (currently 7.x or 8.x)
   - **Package:** MSI
3. Click **Download**

---

## 🔧 Step 2: Install MongoDB

### Using MSI Installer:

1. **Run the installer** (MongoDBCommunity-x.x.x-signed.msi)
2. **Click through the wizard:**
   - Accept license agreement
   - Choose "Setup Type" → Select **"Complete"**
   - Service Configuration:
     - ✅ Install MongoDB as a Service
     - Service Name: `MongoDB`
     - Data Directory: `C:\Program Files\MongoDB\Server\8.0\data`
     - Log Directory: `C:\Program Files\MongoDB\Server\8.0\log`
   - Click **Install**
3. **Installation completes** - MongoDB service will start automatically

---

## ✅ Step 3: Verify MongoDB is Running

### Check Service Status:
```powershell
Get-Service MongoDB | Select-Object Name, Status
```

Expected output:
```
Name    Status
----    ------
MongoDB Running
```

### Check if MongoDB is listening:
```powershell
netstat -ano | findstr :27017
```

You should see output showing port 27017 is listening.

---

## 🔌 Step 4: Test MongoDB Connection

### Open MongoDB Shell:
```powershell
mongosh mongodb://localhost:27017
```

If successful, you'll see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://localhost:27017/?directConnection=true
MongoServerSelectionError ...
```

(If it shows error, MongoDB might still be starting - wait 30 seconds and try again)

---

## 🛠️ Step 5: Create Database and Collections

Once MongoDB shell is open, run:

```javascript
// Create/switch to database
use trackify_db

// Create collections
db.createCollection("users")
db.createCollection("attendances")

// Verify
show collections
```

Then type `exit` to close the shell.

---

## 🚀 Step 6: Restart Your Node.js Server

```powershell
cd "c:\Users\ASUS\OneDrive\Desktop\drive-download-20260419T131732Z-3-001"
node server.js
```

You should now see:
```
[SERVER] Running on port 3000
[SERVER] Open your browser to: http://localhost:3000/login.html
[OK] Connected to MongoDB
```

---

## 🎯 Common Issues & Solutions

### Issue 1: "MongoDB not installed"
**Solution:** Follow the download and installation steps above

### Issue 2: MongoDB service not starting
```powershell
# Start the service manually
net start MongoDB

# If that doesn't work, check service status
Get-Service MongoDB
```

### Issue 3: Connection refused on port 27017
```powershell
# Check if anything is using port 27017
netstat -ano | findstr :27017

# If nothing shows, MongoDB isn't running yet
# Wait 1-2 minutes after installation for it to start
```

### Issue 4: "Cannot connect to localhost:27017"
- Ensure MongoDB service is running: `net start MongoDB`
- Ensure Windows Firewall isn't blocking it
- Check .env has correct MONGO_URI: `mongodb://localhost:27017/trackify_db`

---

## 📊 Verify Connection with Node.js

After restarting server, check the terminal for:
```
[OK] Connected to MongoDB
```

If you see this, everything is set up correctly!

---

## 🔄 Managing MongoDB Service

### Start MongoDB:
```powershell
net start MongoDB
```

### Stop MongoDB:
```powershell
net stop MongoDB
```

### Restart MongoDB:
```powershell
net stop MongoDB
net start MongoDB
```

---

## 📝 Your .env Configuration

Your current .env is already configured correctly:
```
MONGO_URI=mongodb://localhost:27017/trackify_db
PORT=3000
```

No changes needed!

---

## ✨ After Setup Complete

Your project will now:
- ✅ Store data in MongoDB (persistent)
- ✅ Survive server restarts
- ✅ Have proper database structure
- ✅ All features fully functional with real database

---

## 🎓 Quick Commands Reference

```powershell
# Check MongoDB status
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# View MongoDB logs
Get-Content "C:\Program Files\MongoDB\Server\8.0\log\mongod.log" -Tail 50

# Start Node.js server
node server.js

# Test server is running
Invoke-WebRequest http://localhost:3000 -UseBasicParsing
```

---

## 🚨 Important Notes

1. **MongoDB must be running** before you start the Node.js server
2. **Service starts automatically** after installation
3. **Port 27017** is the default - don't change it unless necessary
4. **Database will be created** automatically when server starts

---

## Next Steps

1. Download MongoDB from the link above
2. Run the MSI installer
3. Wait for installation to complete (5-10 minutes)
4. Verify service is running: `Get-Service MongoDB`
5. Start your Node.js server: `node server.js`
6. You should see `[OK] Connected to MongoDB` in the terminal

**Done!** Your project now uses MongoDB. 🎉

---

**Questions?** All MongoDB data will be stored in:
- `C:\Program Files\MongoDB\Server\8.0\data`

Your application data will be in the `trackify_db` database.
