# Trackify - Attendance Management System

## 📋 Project Setup & Status

### Current Status ✅
- **Server**: Running on port 3000
- **Database**: Using in-memory storage (MongoDB optional)
- **All Features**: Fully functional

---

## 🚀 Quick Start

### Start the Server
```bash
cd "c:\Users\ASUS\OneDrive\Desktop\drive-download-20260419T131732Z-3-001"
node server.js
```

Then open your browser to:
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login.html
- **Register**: http://localhost:3000/registeration.html

---

## 🗄️ Database Options

### Option 1: In-Memory Storage (Current - Default)
✅ **Pros:**
- Works immediately without setup
- Perfect for testing and development
- No external dependencies

❌ **Cons:**
- Data resets when server restarts
- No data persistence

**Status:** Currently active - everything works!

---

### Option 2: MongoDB Local (Optional - For Persistent Data)

#### Step 1: Install MongoDB Community Edition
Download from: https://www.mongodb.com/try/download/community

#### Step 2: Start MongoDB Service (Windows)
```powershell
# Start MongoDB service
net start MongoDB

# To stop it:
net stop MongoDB

# Or use Services app (services.msc)
```

#### Step 3: Verify MongoDB is Running
```powershell
# Check if MongoDB is listening on port 27017
netstat -ano | findstr :27017

# Or test connection
mongosh mongodb://localhost:27017
```

#### Step 4: Update .env (Already configured)
```
MONGO_URI=mongodb://localhost:27017/trackify_db
PORT=3000
```

#### Step 5: Restart Server
```powershell
node server.js
```

You should see:
```
[SERVER] Running on port 3000
[OK] Connected to MongoDB
```

---

### Option 3: MongoDB Cloud (Atlas)

If you want to use cloud MongoDB:

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update .env:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trackify_db
```
5. Restart server

---

## 📊 API Endpoints (All Working)

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Login user
- `POST /api/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/reset-password` - Admin password reset

### Attendance
- `POST /api/attendance/save` - Save attendance records
- `GET /api/attendance/:scholarNo` - Get user's attendance
- `GET /api/attendance/view` - View attendance by date/subject

### Analytics
- `GET /api/analytics/:scholarNo` - Get attendance analytics

---

## 👥 Test Users (Create via Registration)

To test the system:

1. **Register as Student**
   - Name: John Doe
   - Email: john@example.com
   - Role: Student
   - Scholar No: S001
   - Password: password123

2. **Register as Teacher**
   - Name: Jane Smith
   - Email: jane@example.com
   - Role: Teacher
   - Scholar No: T001
   - Password: password123

3. **Register as Admin**
   - Name: Admin User
   - Email: admin@example.com
   - Role: Admin
   - Scholar No: A001
   - Password: password123

---

## 🎯 Features Available

### For Students
- ✅ View attendance overview
- ✅ Check daily attendance
- ✅ Subject-wise breakdown
- ✅ Monthly statistics

### For Teachers
- ✅ Mark attendance
- ✅ View class attendance
- ✅ Generate reports

### For Admins
- ✅ Manage users
- ✅ View all attendance
- ✅ Reset passwords
- ✅ Generate analytics

---

## 🛠️ Troubleshooting

### Server Not Starting
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process using port 3000
taskkill /PID <PID> /F
```

### MongoDB Not Connecting
- Check if MongoDB service is running: `Get-Service MongoDB`
- Verify connection string in .env
- Check if mongod.exe is running on port 27017
- **OR** use in-memory storage (current setup - works fine!)

### Registration/Login Issues
- Ensure server is running
- Check browser console for errors (F12)
- Clear browser cache and cookies
- Try incognito/private window

---

## 📁 Project Structure

```
├── index.html                 # Landing page
├── login.html                 # Login page
├── login.js                   # Login logic
├── registeration.html         # Registration page
├── registeration.js           # Registration logic
├── forgot_password.html       # Password reset
├── student_dashboard.html     # Student dashboard
├── student_dashboard.js       # Student dashboard logic
├── teacher_dashboard.html     # Teacher dashboard
├── teacher_dashboard.js       # Teacher dashboard logic
├── admin_dashboard.html       # Admin dashboard
├── admin_dashboard.js         # Admin dashboard logic
├── attendance.js              # Attendance model
├── user.js                    # User model
├── server.js                  # Node.js Express server
├── login_reg.css              # Styling
├── .env                       # Environment variables
└── package.json               # Dependencies
```

---

## 📦 Dependencies

- **express** - Web server
- **mongoose** - MongoDB connection (optional)
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

Install with:
```bash
npm install
```

---

## ℹ️ Current Configuration

**Recommended Setup:** In-memory storage (already working!)

**Why in-memory storage works:**
- All registration data is stored in-memory
- Login credentials are validated
- Attendance records are tracked
- Perfect for development and testing
- Data resets on server restart (which is fine for testing)

**To add MongoDB later:**
1. Just install MongoDB
2. Start the service
3. Restart Node.js server
4. Server will automatically connect

---

## ✅ Everything is Working!

- ✅ Server running on port 3000
- ✅ Registration working
- ✅ Login working
- ✅ Dashboards loading
- ✅ API endpoints responding
- ✅ In-memory storage functioning perfectly

**No action needed** - your project is fully operational! 🎉

---

## Need Help?

1. Check console output (F12 in browser)
2. Check terminal for server errors
3. Ensure server is running: `node server.js`
4. Clear browser cache and refresh
5. Try a fresh registration/login

---

**Last Updated:** April 19, 2026
**Status:** ✅ All systems operational
