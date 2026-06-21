const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: { type: String, required: true },
    scholarNo: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    subject: { type: String, required: true } 
});

module.exports = mongoose.model('Attendance', attendanceSchema);

