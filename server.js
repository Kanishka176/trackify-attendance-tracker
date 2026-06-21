require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, '/')));


mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 
})
.then(() => console.log("[OK] MongoDB Connected"))
.catch(err => console.log("[ERROR] MongoDB Error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    scholarNo: String
});

const User = mongoose.model('User', userSchema);

const attendanceSchema = new mongoose.Schema({
    date: String,
    scholarNo: String,
    subject: String,
    status: String
});

const Attendance = mongoose.model('Attendance', attendanceSchema);


app.post('/api/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "Registration successful", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email, password, role });

        if (user) {
            res.json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});


app.post('/api/attendance/save', async (req, res) => {
    const { date, attendance, subject } = req.body;

    try {
        for (const record of attendance) {
            await Attendance.findOneAndUpdate(
                { date, scholarNo: record.scholarNo, subject },
                { status: record.status },
                { upsert: true }
            );
        }

        res.json({ message: "Attendance saved" });
    } catch {
        res.status(500).json({ message: "Error saving attendance" });
    }
});


app.get('/api/attendance/:scholarNo', async (req, res) => {
    try {
        const data = await Attendance.find({ scholarNo: req.params.scholarNo });
        res.json(data);
    } catch {
        res.status(500).json({ message: "Error fetching attendance" });
    }
});


app.get('/api/attendance/view', async (req, res) => {
    const { date, subject } = req.query;

    try {
        const data = await Attendance.find({
            ...(date && { date }),
            ...(subject && { subject })
        });

        res.json(data);
    } catch {
        res.status(500).json({ message: "Error fetching attendance" });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch {
        res.status(500).json({ message: "Error fetching users" });
    }
});


app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch {
        res.status(500).json({ message: "Error deleting user" });
    }
});


app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch {
        res.status(500).json({ message: "Error updating user" });
    }
});


app.patch('/api/users/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { password: newPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Password updated" });
    } catch {
        res.status(500).json({ message: "Error resetting password" });
    }
});


app.get('/api/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'Student' });
        res.json(students);
    } catch {
        res.status(500).json({ message: "Error fetching students" });
    }
});



app.get('/api/analytics/:scholarNo', async (req, res) => {
    try {
        const { scholarNo } = req.params;
        
        const records = await Attendance.find({ scholarNo });

        if (records.length === 0) {
            return res.json({ overall: 0, subjectWise: [] });
        }

        const stats = {};
        records.forEach(rec => {
            if (!stats[rec.subject]) stats[rec.subject] = { attended: 0, total: 0 };
            stats[rec.subject].total++;
            if (rec.status.toUpperCase() === 'PRESENT') stats[rec.subject].attended++;
        });

        const subjectWise = Object.keys(stats).map(subj => ({
            subject: subj,
            attended: stats[subj].attended,
            total: stats[subj].total
        }));

        const totalAttended = subjectWise.reduce((acc, curr) => acc + curr.attended, 0);
        const totalClasses = subjectWise.reduce((acc, curr) => acc + curr.total, 0);
        const overall = Math.round((totalAttended / totalClasses) * 100);

        res.json({ overall, subjectWise });
    } catch (err) {
        res.status(500).json({ message: "Error calculating analytics" });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registeration.html'));
});


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});