let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

function addSubject() {
    let name = document.getElementById("subject").value;
    let marks = Number(document.getElementById("marks").value);
    let weight = Number(document.getElementById("weight").value);

    // Input validation
    if (name === "" || marks < 0 || marks > 100 || weight <= 0) {
        alert("Please enter valid input!");
        return;
    }

    subjects.push({ name, marks, weight });
    localStorage.setItem("subjects", JSON.stringify(subjects));

    displaySubjects();
}

function displaySubjects() {
    let list = document.getElementById("subjectList");
    list.innerHTML = "";

    for (let i = 0; i < subjects.length; i++) {
        list.innerHTML += `<li>${subjects[i].name}: ${subjects[i].marks} (${subjects[i].weight}%)</li>`;
    }
}

function calculateGrade() {
    let total = 0;
    let totalWeight = 0;

    for (let i = 0; i < subjects.length; i++) {
        total += subjects[i].marks * subjects[i].weight;
        totalWeight += subjects[i].weight;
    }

    if (totalWeight !== 100) {
        alert("Total weight must be 100%");
        return;
    }

    let average = total / 100;
    let grade = getGrade(average);

    document.getElementById("result").innerText =
        `Final Score: ${average.toFixed(2)}% | Grade: ${grade}`;
}

// Function for grade determination
function getGrade(score) {
    if (score >= 80) return "A";
    else if (score >= 70) return "B";
    else if (score >= 60) return "C";
    else if (score >= 50) return "D";
    else return "F";
}

displaySubjects();