let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

function gradePoint(m) {
    if (m >= 80) return 4.0;
    if (m >= 70) return 3.0;
    if (m >= 60) return 2.0;
    if (m >= 50) return 1.0;
    return 0.0;
}

function gradeLetter(m) {
    if (m >= 80) return "A";
    if (m >= 70) return "B";
    if (m >= 60) return "C";
    if (m >= 50) return "D";
    return "F";
}

function addSubject() {
    const name = document.getElementById("subject").value.trim();
    const credit = Number(document.getElementById("credit").value);
    const marks = Number(document.getElementById("marks").value);

    if (!name || credit <= 0 || marks < 0 || marks > 100) {
        alert("Please enter valid subject details");
        return;
    }

    subjects.push({
        name,
        credit,
        marks,
        gp: gradePoint(marks)
    });

    localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();

    // Clear ONLY subject inputs
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

    const semesterGPA = totalPoints / totalCredits;
    const lastCGPA = Number(document.getElementById("lastCGPA").value) || 0;
    const newCGPA = lastCGPA > 0
        ? (semesterGPA + lastCGPA) / 2
        : semesterGPA;

    document.getElementById("result").innerHTML = `
        <strong>Semester GPA:</strong> ${semesterGPA.toFixed(2)}<br>
        <strong>New CGPA:</strong> ${newCGPA.toFixed(2)}
    `;

    showStats(totalCredits, marksArr);
    drawGraph(lastCGPA, semesterGPA);

    // Clear ONLY last CGPA input
    document.getElementById("lastCGPA").value = "";
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

    ctx.fillText("CGPA Comparison", 150, 20);

    ctx.fillStyle = "#2196F3";
    ctx.fillRect(120, 230 - last * 40, 50, last * 40);
    ctx.fillText("Last", 130, 245);

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(240, 230 - current * 40, 50, current * 40);
    ctx.fillText("Current", 230, 245);
}

function clearAll() {
    if (!confirm("Clear all data?")) return;

    subjects = [];
    localStorage.removeItem("subjects");

    document.getElementById("subjectList").innerHTML = "";
    document.getElementById("stats").innerHTML = "";
    document.getElementById("result").innerText = "";

    document.getElementById("cgpaChart")
        .getContext("2d")
        .clearRect(0, 0, 420, 260);
}

// Load saved data on page load
displaySubjects();
