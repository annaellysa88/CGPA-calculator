let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

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
    if (subjects.length === 0) {
        document.getElementById("result").innerText = "";
        return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
        totalPoints += sub.gradePoint * sub.credit;
        totalCredits += sub.credit;
    });

    const cgpa = totalPoints / totalCredits;

    document.getElementById("result").innerText =
        `Your CGPA is: ${cgpa.toFixed(2)}`;
}

function clearAll() {
    if (confirm("Are you sure you want to clear all subjects?")) {
        subjects = [];
        localStorage.removeItem("subjects");
        displaySubjects();
        document.getElementById("result").innerText = "";
    }
}

// Load table on page refresh
displaySubjects();
calculateCGPA();
