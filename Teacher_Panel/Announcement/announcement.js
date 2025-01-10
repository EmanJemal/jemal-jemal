import { database, get, set, push, ref, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '../../Scripts/firebase.js';

console.log(localStorage.getItem('userData'));

// Ensure DOMContentLoaded runs once
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("input-container");
  const previewSection = document.querySelector(".see-preview");

  const titlePreview = previewSection.querySelector(".homework-title");
  const pointsPreview = previewSection.querySelector("li");
  const timePreview = previewSection.querySelector(".time-content");
  const uploadSection = previewSection.querySelector(".uploaded-area");

  // Dynamically add 'Points' input fields
  form.addEventListener("input", (event) => {
    if (event.target.classList.contains("points")) {
      const lastPointsField = form.querySelector(".points:last-of-type");
      if (lastPointsField && lastPointsField.value.trim() !== "") {
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.className = "points input";
        newInput.placeholder = "Point";
        form.appendChild(newInput);
      }
    }

    // Update Preview Dynamically
    const learningTasks = document.querySelector(".Learning-Tasks").value;
    const title = document.querySelector(".Title").value;
    const date = document.querySelector(".date").value;
    const upload = document.querySelector('input[name="upload"]:checked')?.value;
    const points = document.querySelector(".points").value;

    if (learningTasks && title && points) {
      titlePreview.innerHTML = `${learningTasks} <strong style="color: #4CC9FE;">${title}</strong>`;
    }

    if (points) {
      pointsPreview.innerHTML = `<ul><i class="fa-solid fa-check"></i> ${points} Points</ul>`;
    }

    if (date) {
      const deadline = new Date(date).getTime();
      updateTimeRemaining(deadline);
    }

    if (upload) {
      uploadSection.innerHTML = `
        <h1 class="upload-h1">Upload Homework</h1>
        <form action="#">
          <input class="file-input" type="file" name="file" hidden multiple webkitdirectory>
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Browse File to Upload</p>
        </form>
      `;
    } else {
      uploadSection.innerHTML = "";
    }
  });

  // Countdown Timer for Deadline
  function updateTimeRemaining(deadline) {
    // Clear any existing intervals to prevent duplicates
    clearInterval(updateTimeRemaining.interval);
  
    updateTimeRemaining.interval = setInterval(() => {
      const now = new Date().getTime();
      let distance = deadline - now;
  
      if (distance <= 0) {
        clearInterval(updateTimeRemaining.interval);
        timePreview.innerHTML = "The deadline has passed.";
        return;
      }
  
      // Normalize distance to avoid glitch from milliseconds
      distance = Math.floor(distance / 1000) * 1000;
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      timePreview.innerHTML = `
        <div class="time days">
          <span class="number">${days}</span>
          <span class="text">days</span>
        </div>
        <div class="time hours">
          <span class="number">${hours}</span>
          <span class="text">hours</span>
        </div>
        <div class="time minutes">
          <span class="number">${minutes}</span>
          <span class="text">minutes</span>
        </div>
        <div class="time seconds">
          <span class="number">${seconds}</span>
          <span class="text">seconds</span>
        </div>
      `;
    }, 1000);
  }
  

  // Handle Form Submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const learningTasks = document.querySelector(".Learning-Tasks").value;
    const title = document.querySelector(".Title").value;
    const date = document.querySelector(".date").value;
    const upload = document.querySelector('input[name="upload"]:checked')?.value;
    const lateSubmission = document.querySelector('input[name="late-submisson"]:checked')?.value;
    const alertMsg = document.querySelector(".alert-msg").value;
    const points = document.querySelector(".points").value;

    const teacherName = localStorage.getItem('userData');

    if (!teacherName) {
      alert("Teacher name not found in local storage. Please log in again.");
      return;
    }

    const selectedClass = prompt("Enter the class (e.g., ICT, Math, Science):").trim();

    if (!selectedClass) {
      alert("Class name is required!");
      return;
    }

    if (!learningTasks || !title || !date || !upload || !lateSubmission || !alertMsg || !points) {
      alert("Please fill in all fields before submitting!");
      return;
    }

    try {
      const classRef = ref(database, `Approved_Classes/${selectedClass}`);
      const snapshot = await get(classRef);

      if (!snapshot.exists()) {
        alert("Class not found in the database.");
        return;
      }

      const classData = snapshot.val();
/*
      if (classData.TeacherName !== teacherName) {
        alert(`You are not authorized to add tasks to the ${selectedClass} class.`);
        return;
      }
*/
      const UploadclassRef = ref(database, `Approved_Classes/${selectedClass}/tasks`);

      await push(UploadclassRef, {
        learningTasks,
        title,
        date,
        upload,
        lateSubmission,
        alertMsg,
        points,
        createdAt: new Date().toISOString()
      });

      alert(`Task added successfully to ${selectedClass}!`);
      form.reset(); // Clear form after submission
      previewSection.innerHTML = ''; // Clear preview section

    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again later.");
    }
  });
});
