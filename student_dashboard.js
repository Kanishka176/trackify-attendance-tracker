
async function loadAnalytics() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const scholarNo = user.scholarNo || user.email;
        const response = await fetch(`/api/analytics/${scholarNo}`);
        
        if (!response.ok) throw new Error('Failed to load analytics');
        
        const data = await response.json();

        
        document.querySelector('.percentage-circle').innerText = `${data.overall}%`;
        const statusSpan = document.querySelector('.main-stats span');
        statusSpan.innerText = data.overall >= 75 ? "Good" : "Shortage";
        statusSpan.style.color = data.overall >= 75 ? "green" : "red";

        
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        if (data.subjectWise && Array.isArray(data.subjectWise)) {
            data.subjectWise.forEach(item => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${item.subject}</td>
                        <td>${item.attended}</td>
                        <td style="color: red;">${item.total - item.attended}</td>
                        <td>${item.total}</td>
                    </tr>`;
            });
        }
        
        
        updateCharts(data.subjectWise);
        
    } catch (error) {
        console.error("Error loading analytics:", error);
    }
}

window.addEventListener('load', loadAnalytics);



document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', async function() {
            const selectedDate = document.getElementById('view-date').value;
            const resultDiv = document.getElementById('date-result');

            if (!selectedDate) {
                resultDiv.innerText = "Please select a date.";
                resultDiv.style.color = "orange";
                return;
            }

            
            
try {
    const response = await fetch(`/api/attendance/view?date=${selectedDate}`);
    const data = await response.json();
    const user = JSON.parse(localStorage.getItem('user'));
    
    
    const myRecord = data.find(r => r.scholarNo === user.scholarNo);

    if (myRecord) {
        const isPresent = myRecord.status.toUpperCase() === 'PRESENT';
        resultDiv.innerHTML = `On <strong>${selectedDate}</strong>, you were: 
            <span style="color: ${isPresent ? 'green' : 'red'}">${myRecord.status}</span>`;
    } else {
        resultDiv.innerHTML = `<span style="color: gray;">No record found for this date.</span>`;
    }
} catch (err) {
    resultDiv.innerText = "Error fetching data.";
}

            const record = mockRecords['present'];
            resultDiv.innerHTML = `On <strong>${selectedDate}</strong>, you were: 
                                   <span style="color: ${record.color}">${record.status}</span>`;
        });
    }
});



function updateCharts(subjectWise) {
    if (!subjectWise || !Array.isArray(subjectWise) || subjectWise.length === 0) return;

    const subjects = subjectWise.map(s => s.subject);
    const percentages = subjectWise.map(s => Math.round((s.attended / s.total) * 100));

    
    const chartElement1 = document.getElementById('subjectChart');
    if (chartElement1 && typeof Chart !== 'undefined') {
        try {
            const ctx1 = chartElement1.getContext('2d');
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: subjects,
                    datasets: [{
                        label: 'Attendance %',
                        data: percentages,
                        backgroundColor: '#2d6a4f',
                        borderRadius: 5
                    }]
                }
            });
        } catch (e) {
            console.warn('Chart 1 failed:', e);
        }
    }

    
    const chartElement2 = document.getElementById('monthlyChart');
    if (chartElement2 && typeof Chart !== 'undefined') {
        try {
            const ctx2 = chartElement2.getContext('2d');
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Absents',
                        data: [2, 1, 3, 0],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)'
                    }]
                }
            });
        } catch (e) {
            console.warn('Chart 2 failed:', e);
        }
    }
}

