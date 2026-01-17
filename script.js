let subjects = [];

function gradePoint(m) {
    if (m >= 80) return 4;
    if (m >= 70) return 3;
    if (m >= 60) return 2;
    if (m >= 50) return 1;
    return 0;
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
        alert("Invalid input");
        return;
    }

    subjects.push({
        name, credit, marks,
        gp: gradePoint(marks)
    });

    displaySubjects();

    subject.value = credit.value = marks.value = "";
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
            <td>${s.gp}</td>
            <td><button onclick="deleteSubject(${i})">Delete</button></td>
        </tr>`;
    });
}

function deleteSubject(i) {
    subjects.splice(i, 1);
    displaySubjects();
}

function finishCalculation() {
    if (subjects.length === 0) {
        alert("No subjects");
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

    const currentCGPA = (totalPoints / totalCredits).toFixed(2);
    const lastCGPA = Number(document.getElementById("lastCGPA").value) || 0;

    document.getElementById("result").innerText =
        `Current CGPA: ${currentCGPA}`;

    showStats(totalCredits, marksArr);
    drawGraph(lastCGPA, currentCGPA);
}

function showStats(credits, marks) {
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const average = (marks.reduce((a,b)=>a+b,0)/marks.length).toFixed(2);

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
    const c = document.getElementById("cgpaChart");
    const ctx = c.getContext("2d");
    ctx.clearRect(0,0,400,250);

    ctx.fillText("CGPA Comparison", 140, 20);

    ctx.fillStyle = "#2196F3";
    ctx.fillRect(120, 220 - last*40, 50, last*40);

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(230, 220 - current*40, 50, current*40);

    ctx.fillStyle = "black";
    ctx.fillText("Last", 130, 235);
    ctx.fillText("Current", 225, 235);
}

function clearAll() {
    subjects = [];
    document.getElementById("subjectList").innerHTML = "";
    document.getElementById("stats").innerHTML = "";
    document.getElementById("result").innerText = "";
    document.getElementById("cgpaChart")
        .getContext("2d").clearRect(0,0,400,250);
}
