
const classes = [
    { id: 'C101', name: 'ADA' },
    { id: 'C102', name: 'DC' },
    { id: 'C103', name: 'TOC' }
];


let students = []; 


async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students');
        students = await response.json();
        console.log("Students loaded from database:", students);
    } catch (err) {
        console.error("Failed to fetch students:", err);
    }
}


window.onload = async () => {
    await fetchStudents();
    renderClasses(); 
};


const classListContainer = document.getElementById('class-list');
const classSelectionView = document.getElementById('class-selection-view');
const attendanceView = document.getElementById('attendance-view');
const currentClassTitle = document.getElementById('current-class-title');
const studentListContainer = document.getElementById('student-list');
const backBtn = document.getElementById('back-btn');
const saveBtn = document.getElementById('save-attendance');
const dateInput = document.getElementById('attendance-date');





function openAttendanceView(className) {
    classSelectionView.style.display = 'none';
    attendanceView.style.display = 'block';
    currentClassTitle.innerText = className;
    
    
    dateInput.valueAsDate = new Date();

    renderStudents();
}


let isHolidayMode = false;

function renderStudents() {
    studentListContainer.innerHTML = ""; 
    isHolidayMode = false; 
    
    students.forEach(student => {
        const row = document.createElement('tr');
        const percent = student.attendancePercent || 0;

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.scholarNo || 'N/A'}</td>
            <td><span style="color: ${percent < 75 ? 'red' : 'green'}; font-weight: bold;">${percent}%</span></td>
            <td>
                <input type="checkbox" class="attendance-cb" style="width: 20px; height: 20px; cursor: pointer;">
                <span class="status-label" style="margin-left: 8px; color: red;">Absent</span>
            </td>
        `;
        studentListContainer.appendChild(row);
        attachCheckboxListener(row.querySelector('.attendance-cb'));
    });
}

backBtn.addEventListener('click', () => {
    attendanceView.style.display = 'none';
    classSelectionView.style.display = 'block';
});


function renderClasses() {
    
    classListContainer.innerHTML = ""; 
    
    classes.forEach(cls => {
        
        const card = document.createElement('div');
        
        
        card.className = 'clickable-card card'; 
        
        
        card.innerHTML = `
            <h3>${cls.name}</h3>
            <p style="font-size: 14px; color: #666;">Click to mark attendance</p>
        `;
        
       
        card.addEventListener('click', () => {
            openAttendanceView(cls.name);
        });
        
        
        classListContainer.appendChild(card);
    });
}

renderClasses();

saveBtn.addEventListener('click', async () => {
    const selectedDate = dateInput.value;
    const rows = studentListContainer.querySelectorAll('tr');
    const attendanceData = [];

    rows.forEach(row => {
        const scholarNo = row.cells[1].innerText; 
        const status = row.querySelector('select').value;
        attendanceData.push({ scholarNo, status });
    });

    try {
        const response = await fetch('http://localhost:3000/api/attendance/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                date: selectedDate, 
                attendance: attendanceData,
                subject: currentClassTitle.innerText.trim() 
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Attendance saved to MongoDB!");
            backBtn.click();
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        alert("Server Error: " + err.message);
    }
});


async function loadExistingAttendance() {
    const date = dateInput.value;
    const subject = currentClassTitle.innerText.trim();

    if (!date) return;

    try {
        const response = await fetch(`http://localhost:3000/api/attendance/view?date=${date}&subject=${subject}`);
        const existingRecords = await response.json();

        if (existingRecords.length > 0) {
          
            updateTableWithExistingData(existingRecords);
            saveBtn.innerText = "Update Attendance"; 
        } else {
            
            renderStudents(); 
            saveBtn.innerText = "Save Attendance";
        }
    } catch (err) {
        console.error("Error loading previous data:", err);
    }
}

function updateTableWithExistingData(records) {
    studentListContainer.innerHTML = ""; 
    isHolidayMode = false;
    
    students.forEach(student => {
        const record = records.find(r => r.scholarNo === student.scholarNo);
        const status = record ? record.status : "Absent"; 
        if (status === "Holiday") isHolidayMode = true;

        const row = document.createElement('tr');
        const percent = student.attendancePercent || 0;
        const isPresent = status === 'Present';

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.scholarNo || 'N/A'}</td>
            <td><span style="color: ${percent < 75 ? 'red' : 'green'}; font-weight: bold;">${percent}%</span></td>
            <td>
                <input type="checkbox" class="attendance-cb" style="width: 20px; height: 20px; cursor: pointer;" ${isPresent ? 'checked' : ''} ${isHolidayMode ? 'disabled' : ''}>
                <span class="status-label" style="margin-left: 8px; font-weight: bold; color: ${isPresent ? 'green' : (isHolidayMode ? 'orange' : 'red')}">
                    ${isHolidayMode ? 'Holiday' : (isPresent ? 'Present' : 'Absent')}
                </span>
            </td>
        `;
        studentListContainer.appendChild(row);
        if (!isHolidayMode) attachCheckboxListener(row.querySelector('.attendance-cb'));
    });
}


function attachCheckboxListener(cb) {
    cb.addEventListener('change', (e) => {
        const label = e.target.nextElementSibling;
        if (e.target.checked) {
            label.innerText = "Present";
            label.style.color = "green";
        } else {
            label.innerText = "Absent";
            label.style.color = "red";
        }
    });
}

dateInput.addEventListener('change', loadExistingAttendance);


document.getElementById('mark-all-present').addEventListener('click', () => {
    isHolidayMode = false;
    document.querySelectorAll('.attendance-cb').forEach(cb => {
        cb.disabled = false;
        cb.checked = true;
        const label = cb.nextElementSibling;
        label.innerText = "Present";
        label.style.color = "green";
    });
});

document.getElementById('mark-holiday').addEventListener('click', () => {
    isHolidayMode = true;
    document.querySelectorAll('.attendance-cb').forEach(cb => {
        cb.checked = false;
        cb.disabled = true; 
        const label = cb.nextElementSibling;
        label.innerText = "Holiday";
        label.style.color = "orange";
    });
});


saveBtn.addEventListener('click', async () => {
    const selectedDate = dateInput.value;
    const rows = studentListContainer.querySelectorAll('tr');
    const attendanceData = [];

    rows.forEach(row => {
        const scholarNo = row.cells[1].innerText; 
        const cb = row.querySelector('.attendance-cb');
        
        let status = "Absent";
        if (isHolidayMode) status = "Holiday";
        else if (cb.checked) status = "Present";

        attendanceData.push({ scholarNo, status });
    });

    try {
        const response = await fetch('http://localhost:3000/api/attendance/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                date: selectedDate, 
                attendance: attendanceData,
                subject: currentClassTitle.innerText 
            })
        });

        if (response.ok) {
            alert("Attendance successfully saved!");
            saveBtn.innerText = "Update Attendance";
        } else {
            alert("Error saving attendance.");
        }
    } catch (err) {
        alert("Server Error: " + err.message);
    }
});


document.getElementById('download-report').addEventListener('click', async () => {
    const monthInput = document.getElementById('report-month').value; 
    const subject = currentClassTitle.innerText.trim();

    if (!monthInput) {
        return alert("Please select a Report Month first!");
    }

    try {
        
        const response = await fetch(`http://localhost:3000/api/attendance/view?subject=${subject}`);
        const allRecords = await response.json();

        console.log("ALL records for this subject:", allRecords);
        console.log("The Month Input we are searching for:", monthInput);
        const monthRecords = allRecords.filter(r => r.date.startsWith(monthInput));
        
        console.log("Records found for this month:", monthRecords); 

        
        const [year, month] = monthInput.split('-');
        const daysInMonth = new Date(year, month, 0).getDate();

       
        let csvContent = "Student Name,Scholar Number,";
        for (let i = 1; i <= daysInMonth; i++) {
            csvContent += `${i},`;
        }
        csvContent += "Total Present,Total Absent\n";

        
        students.forEach(student => {
            let row = `"${student.name}","${student.scholarNo}",`;
            let presentCount = 0;
            let absentCount = 0;

            for (let i = 1; i <= daysInMonth; i++) {
                
                const dayStr = `${year}-${month}-${String(i).padStart(2, '0')}`;
                
                
                const record = monthRecords.find(r => String(r.scholarNo) === String(student.scholarNo) && r.date === dayStr);

                if (record) {
                    if (record.status === 'Present') { row += "P,"; presentCount++; }
                    else if (record.status === 'Absent') { row += "A,"; absentCount++; }
                    else if (record.status === 'Holiday') { row += "H,"; }
                    else { row += "-,"; }
                } else {
                    row += "-,"; 
                }
            }
            
            row += `${presentCount},${absentCount}\n`;
            csvContent += row;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${subject}_Attendance_${monthInput}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        console.error("Error generating report:", err);
        alert("Failed to generate report.");
    }
});