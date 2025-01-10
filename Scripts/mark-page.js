import { database, ref, get, onValue, set } from '../Scripts/firebase.js';

// Document Ready Event
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const classNameFromURL = decodeURIComponent(urlParams.get('tag'));
  const classNameFromStorage = localStorage.getItem('clickedClass');

  if (!classNameFromURL || classNameFromURL !== classNameFromStorage) {
    alert("Unauthorized access! Class name mismatch.");
    window.location.href = "../HTML/home.html";
    return;
  }

  // Update Class Name Display
  document.getElementById('classRoomName').textContent = classNameFromURL;

  // Fetch and Display Tasks and Task ID
  const taskId = await fetchTasks(classNameFromURL);

  // Fetch and Display Teacher Name
  fetchTeacherName(classNameFromURL);

  // Initialize file upload functionality
  if (taskId) {
    initializeFileUpload(taskId);
  }
});

// Function to Fetch Tasks and Retrieve Task ID
async function fetchTasks(className) {
  try {
    const classRef = ref(database, `Approved_Classes/${className}/tasks`);
    const snapshot = await get(classRef);

    if (!snapshot.exists()) {
      document.getElementById('homeworkTitle').textContent = "No tasks available.";
      return null;
    }

    const tasks = snapshot.val();
    const latestTaskId = Object.keys(tasks).pop(); // Get the latest task ID
    const latestTask = tasks[latestTaskId];

    // Display task information
    document.getElementById('homeworkTitle').innerHTML = `
      ${latestTask.learningTasks} <strong style="color: #4CC9FE;">${latestTask.title}</strong>
    `;

    const pointsList = document.getElementById('homeworkPoints');
    pointsList.innerHTML = `<ul><i class="fa-solid fa-check"></i> ${latestTask.points} Points</ul>`;

    if (latestTask.date) {
      startCountdown(new Date(latestTask.date).getTime());
    }

    return latestTaskId; // Return the task ID for further use
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("Failed to load class details. Please try again later.");
    return null;
  }
}

// Function to Fetch Teacher Name
async function fetchTeacherName(className) {
  const teacherNameElement = document.getElementById("teacher-name");

  if (!teacherNameElement) {
    console.error("Element with ID 'teacher-name' not found.");
    return;
  }

  try {
    const classRef = ref(database, `Approved_Classes/${className}/TeacherName`);
    const snapshot = await get(classRef);

    if (snapshot.exists()) {
      const teacherName = snapshot.val();
      teacherNameElement.textContent = teacherName;
    } else {
      teacherNameElement.textContent = "Not Found";
    }
  } catch (error) {
    console.error("Error fetching teacher name:", error);
    teacherNameElement.textContent = "Error Loading";
  }
}

// Countdown Timer Function
function startCountdown(deadline) {
  const timerElement = document.getElementById('deadlineTimer');
  const interval = setInterval(() => {
    const now = Date.now();
    const distance = deadline - now;

    if (distance <= 0) {
      clearInterval(interval);
      timerElement.textContent = "The deadline has passed.";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerElement.innerHTML = `
      <div class="time days"><span class="number">${days}</span><span class="text">days</span></div>
      <div class="time hours"><span class="number">${hours}</span><span class="text">hours</span></div>
      <div class="time minutes"><span class="number">${minutes}</span><span class="text">minutes</span></div>
      <div class="time seconds"><span class="number">${seconds}</span><span class="text">seconds</span></div>
    `;
  }, 1000);
}

// Initialize File Upload
function initializeFileUpload(taskId) {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = uploadForm.querySelector('.file-input');
  const uploadedArea = document.querySelector('.uploaded-area');

  fileInput.addEventListener('change', (event) => handleFileUpload(event, taskId));

  uploadForm.addEventListener('click', () => {
    fileInput.click(); // Trigger file input when the form is clicked
  });
}

async function handleFileUpload(event, taskId) {
  const files = event.target.files;
  if (!files.length) return;

  const className = localStorage.getItem('clickedClass');
  const studentName = localStorage.getItem('userData');

  if (!taskId || !studentName) {
    alert("Missing task ID or student name. Please ensure you're logged in and try again.");
    return;
  }

  // Sanitize student name and file name to remove invalid characters
  const sanitizedStudentName = studentName.replace(/[.#$\[\]]/g, '_'); // Replace invalid characters
  const sanitizedFileName = files[0].name.replace(/[.#$\[\]]/g, '_'); // Replace invalid characters

  for (const file of files) {
    const fileBase64 = await convertFileToBase64(file);
    const filePath = `Approved_Classes/${className}/tasks/${taskId}/homework-upload/${sanitizedStudentName}:${sanitizedFileName}`;

    try {
      await set(ref(database, filePath), fileBase64); // Store file in Firebase

      // Display uploaded file in the UI
      displayUploadedFile(file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  }
}




// Convert File to Base64
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Display Uploaded File
function displayUploadedFile(fileName) {
  const uploadedArea = document.querySelector('.uploaded-area');
  const fileElement = document.createElement('div');
  fileElement.className = 'uploaded-file';
  fileElement.innerHTML = `
    <i class="fas fa-file"></i> <span>${fileName}</span>
  `;
  uploadedArea.appendChild(fileElement);
}
