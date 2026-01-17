let subjects = [];

function gradePoint(m) {
    if (m >= 80) return 4.0;
    else if (m >= 75) return 3.67;
    else if (m >= 70) return 3.33;
    else if (m >= 65) return 3.00;
    else if (m >= 60) return 2.67; 
    else if (m >= 55) return 2.33; 
    else if (m >= 50) return 2.00; 
    else if (m >= 45) return 1.67; 
    else if (m >= 40) return 1.00;
    else return 0.00;
}

function gradeLetter(m) {
    if (m >= 80) return "A";
    else if (m >= 75) return "A-"; 
    else if (m >= 70) return "B+"; 
    else if (m >= 65) return "B"; 
    else if (m >= 60) return "B-"; 
    else if (m >= 55) return "C+"; 
    else if (m >= 50) return "C"; 
    else if (m >= 45) return "D+"; 
    else if (m >= 40) return "D"; 
    else return "F";
}

function addSubject() {
    const name = document.getElementById("subject").value.trim();
    const credit = Number(document.getElementById("credit").value);
    const marks = Number(document.getElementById("marks").value);

    if (!name || credit <= 0 || marks < 0 || marks > 100) {
        alert("Invalid subject input");
        return;
    }

    subjects.push({
        name,
        credit,
        marks,
        gp: gradePoint(marks)
    });
    

    displaySubjects();

    // ✅ Clear subject inputs after adding
    document.getElementById("subject").value = "";
    document.getElementById("credit").value = "";
    document.getElementById("marks").value = "";
}

function displaySubjects() {
    const tbody = document.getElementById("subjectList");
    tbody.innerHTML = "";

    subjects.forEach((s, i) => {
        tbody.innerHTML += `
        <tr>
            <td>${s.name}</td>
            <td>${s.credit}</td>
            <td>${s.marks}</td>
            <td>${gradeLetter(s.marks)}</td>
            <td>${s.gp.toFixed(2)}</td>
            <td><button onclick="deleteSubject(${i})">Delete</button></td>
        </tr>`;
    });
}

function deleteSubject(i) {
    subjects.splice(i, 1);
     localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();
}

function finishCalculation() {
    if (subjects.length === 0) {
        alert("No subjects added");
        return;
    }

    let totalCredits = 0;
    let totalPoints = 0;
    let marksArr = [];

    subjects.forEach(s => {
        totalCredits += s.credit;
        totalPoints += s.credit * s.gp;
        marksArr.push(s.marks);
    });

    // ✅ Semester GPA
    const semesterGPA = totalPoints / totalCredits;

    // ✅ Last CGPA
    const lastCGPA = Number(document.getElementById("lastCGPA").value) || 0;

    // ✅ New CGPA (simple average)
    const newCGPA = lastCGPA > 0
        ? (semesterGPA + lastCGPA) / 2
        : semesterGPA;

    // ✅ Display results step-by-step
    document.getElementById("result").innerHTML = `
        <strong>Semester GPA:</strong> ${semesterGPA.toFixed(2)} <br>
        <strong>New CGPA:</strong> ${newCGPA.toFixed(2)}
    `;

    showStats(totalCredits, marksArr);
    drawGraph(lastCGPA, semesterGPA);

   
}

function showStats(credits, marks) {
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const average = (
        marks.reduce((a, b) => a + b, 0) / marks.length
    ).toFixed(2);

    document.getElementById("stats").innerHTML = `
    <table class="stats-table">
        <tr>
            <th>Total Credits</th>
            <th>Highest Marks</th>
            <th>Lowest Marks</th>
            <th>Average Marks</th>
        </tr>
        <tr>
            <td>${credits}</td>
            <td>${highest}</td>
            <td>${lowest}</td>
            <td>${average}</td>
        </tr>
    </table>`;
}

function drawGraph(last, current) {
    const canvas = document.getElementById("cgpaChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillText("CGPA Comparison", 140, 20);

    ctx.fillStyle = "#2196F3";
    ctx.fillRect(120, 220 - last * 40, 50, last * 40);
    ctx.fillText("Last", 130, 235);

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(230, 220 - current * 40, 50, current * 40);
    ctx.fillText("Current", 225, 235);
}


function clearAll() {
    subjects = [];
    document.getElementById("subjectList").innerHTML = "";
    document.getElementById("stats").innerHTML = "";
    document.getElementById("result").innerText = "";
    document.getElementById("lastCGPA").value = "";
    document.getElementById("cgpaChart")
        .getContext("2d")
        .clearRect(0, 0, 400, 250);
         localStorage.removeItem("subjects");
}
