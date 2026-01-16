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

function addSubject() {
    let name = document.getElementById("subject").value;
    let credit = Number(document.getElementById("credit").value);
    let marks = Number(document.getElementById("marks").value);

    if (name === "" || credit <= 0 || marks < 0 || marks > 100) {
        alert("Please enter valid subject details!");
        return;
    }

    let gradePoint = getGradePoint(marks);

    subjects.push({ name, credit, marks, gradePoint });
    localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();

    document.getElementById("subject").value = "";
    document.getElementById("credit").value = "";
    document.getElementById("marks").value = "";
}

function displaySubjects() {
    let list = document.getElementById("subjectList");
    list.innerHTML = "";

    subjects.forEach((sub, index) => {
        list.innerHTML += `
        <li>
            ${sub.name} | Credit: ${sub.credit} | Marks: ${sub.marks} | GP: ${sub.gradePoint}
            <button onclick="deleteSubject(${index})">Delete</button>
        </li>`;
    });
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();
}

function calculateCGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(sub => {
        totalPoints += sub.gradePoint * sub.credit;
        totalCredits += sub.credit;
    });

    if (totalCredits === 0) {
        alert("No subjects added!");
        return;
    }

    let cgpa = totalPoints / totalCredits;

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

displaySubjects();
