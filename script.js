let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

let currentCGPA = null;
let finalCGPA = null;

function getGradePoint(marks) {
    if (marks >= 80) return 4.00;
    else if (marks >= 75) return 3.67;
    else if (marks >= 70) return 3.33;
    else if (marks >= 65) return 3.00;
    else if (marks >= 60) return 2.67;
    else if (marks >= 55) return 2.33;
    else if (marks >= 50) return 2.00;
    else if (marks >= 45) return 1.67;
    else if (marks >= 40) return 1.00;
    else return 0.00;
}

function getGradeLetter(marks) {
    if (marks >= 80) return "A";
    else if (marks >= 75) return "A-";
    else if (marks >= 70) return "B+";
    else if (marks >= 65) return "B";
    else if (marks >= 60) return "B-";
    else if (marks >= 55) return "C+";
    else if (marks >= 50) return "C";
    else if (marks >= 45) return "D+";
    else if (marks >= 40) return "D";
    else return "F";
}

function addSubject() {
    const name = document.getElementById("subject").value.trim();
    const credit = Number(document.getElementById("credit").value);
    const marks = Number(document.getElementById("marks").value);

    if (name === "" || credit <= 0 || marks < 0 || marks > 100) {
        alert("Please enter valid subject details!");
        return;
    }

    const gradePoint = getGradePoint(marks);
    const grade = getGradeLetter(marks);

    subjects.push({ name, credit, marks, grade, gradePoint });
    localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();
    calculateCGPA();

    document.getElementById("subject").value = "";
    document.getElementById("credit").value = "";
    document.getElementById("marks").value = "";
}

function displaySubjects() {
    const tableBody = document.getElementById("subjectList");
    tableBody.innerHTML = "";

    subjects.forEach((sub, index) => {
        let gradeClass =
            sub.marks >= 70 ? "grade-high" :
            sub.marks >= 50 ? "grade-mid" : "grade-low";

        const row = document.createElement("tr");
        row.className = gradeClass;

        row.innerHTML = `
            <td>${sub.name}</td>
            <td>${sub.credit}</td>
            <td>${sub.marks}</td>
            <td>${sub.grade}</td>
            <td>${sub.gradePoint.toFixed(2)}</td>
            <td>
                <button onclick="deleteSubject(${index})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();
    calculateCGPA();
}

function calculateCGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
        totalPoints += sub.gradePoint * sub.credit;
        totalCredits += sub.credit;
    });

    if (totalCredits === 0) return null;

    return totalPoints / totalCredits;
}

function finishCalculation() {
    if (subjects.length === 0) {
        alert("Please enter at least one subject.");
        return;
    }

    const lastCGPA = Number(document.getElementById("lastCGPA").value);

    if (lastCGPA <= 0 || lastCGPA > 4) {
        alert("Please enter a valid last semester CGPA.");
        return;
    }

    currentCGPA = calculateCGPA();
    finalCGPA = ((lastCGPA + currentCGPA) / 2).toFixed(2);

    displayFinalResult(lastCGPA, currentCGPA, finalCGPA);
    displayStatistics();
    drawComparisonGraph(lastCGPA, currentCGPA);
}

function clearAll() {
    if (confirm("Are you sure you want to clear all subjects?")) {
        subjects = [];
        localStorage.removeItem("subjects");
        displaySubjects();
        document.getElementById("result").innerText = "";
    }
}

function displayFinalResult(last, current, finalCGPA) {
    document.getElementById("result").innerHTML = `
        <strong>Last Semester CGPA:</strong> ${last.toFixed(2)} <br>
        <strong>Current Semester CGPA:</strong> ${current.toFixed(2)} <br>
        <strong>Final CGPA:</strong> ${finalCGPA}
    `;
}
function displayStatistics() {
    const marks = subjects.map(s => s.marks);
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);

    document.getElementById("stats").innerHTML = `
        <table class="stats-table">
            <tr>
                <th>Highest Marks</th>
                <th>Lowest Marks</th>
            </tr>
            <tr>
                <td>${highest}</td>
                <td>${lowest}</td>
            </tr>
        </table>
    `;
}
function drawComparisonGraph(last, current) {
    const canvas = document.getElementById("cgpaChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 80;
    const maxCGPA = 4;
    const scale = 150 / maxCGPA;

    // Last semester
    ctx.fillStyle = "#2196F3";
    ctx.fillRect(80, 180 - last * scale, barWidth, last * scale);
    ctx.fillText("Last", 100, 195);

    // Current semester
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(220, 180 - current * scale, barWidth, current * scale);
    ctx.fillText("Current", 230, 195);
}


// Load table on page refresh
displaySubjects();
calculateCGPA();
