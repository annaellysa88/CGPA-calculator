let subjects = [];

function getGradePoint(marks) {
    if (marks >= 80) return 4.0;
    if (marks >= 70) return 3.0;
    if (marks >= 60) return 2.0;
    if (marks >= 50) return 1.0;
    return 0.0;
}

function getGradeLetter(marks) {
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
}

function addSubject() {
    const name = subject.value.trim();
    const credit = Number(creditInput.value);
    const marks = Number(marksInput.value);

    if (!name || credit <= 0 || marks < 0 || marks > 100) {
        alert("Invalid input");
        return;
    }

    subjects.push({
        name,
        credit,
        marks,
        gradePoint: getGradePoint(marks)
    });

    displaySubjects();
    subject.value = creditInput.value = marksInput.value = "";
}

function displaySubjects() {
    subjectList.innerHTML = "";

    subjects.forEach((s, i) => {
        const grade = getGradeLetter(s.marks);
        const rowClass =
            s.marks >= 70 ? "grade-high" :
            s.marks >= 50 ? "grade-mid" : "grade-low";

        subjectList.innerHTML += `
        <tr class="${rowClass}">
            <td>${s.name}</td>
            <td>${s.credit}</td>
            <td>${s.marks}</td>
            <td>${grade}</td>
            <td>${s.gradePoint.toFixed(2)}</td>
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
        alert("No subjects added");
        return;
    }

    let totalCredits = 0;
    let totalPoints = 0;
    let marks = [];

    subjects.forEach(s => {
        totalCredits += s.credit;
        totalPoints += s.credit * s.gradePoint;
        marks.push(s.marks);
    });

    const currentCGPA = totalPoints / totalCredits;
    const lastCGPA = Number(document.getElementById("lastCGPA").value);

    document.getElementById("result").innerText =
        `Current CGPA: ${currentCGPA.toFixed(2)}`;

    showStats(totalCredits, marks);
    drawChart(lastCGPA, currentCGPA);
}

function showStats(credits, marks) {
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const avg = (marks.reduce((a,b)=>a+b,0)/marks.length).toFixed(2);

    stats.innerHTML = `
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
            <td>${avg}</td>
        </tr>
    </table>`;
}

function drawChart(last, current) {
    const ctx = cgpaChart.getContext("2d");
    ctx.clearRect(0,0,400,200);

    ctx.fillText("CGPA Comparison", 140, 20);

    ctx.fillRect(100, 200 - last*40, 50, last*40);
    ctx.fillRect(220, 200 - current*40, 50, current*40);

    ctx.fillText("Last", 105, 190);
    ctx.fillText("Current", 215, 190);
}

function clearAll() {
    subjects = [];
    subjectList.innerHTML = "";
    result.innerText = "";
    stats.innerHTML = "";
    cgpaChart.getContext("2d").clearRect(0,0,400,200);
}
