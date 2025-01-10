import { database, get, ref } from '../../Scripts/firebase.js'; // No need to import storage or getDownloadURL
import * as JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve the class name from localStorage
  const classNameFromURL = localStorage.getItem('clickedClass');
  if (!classNameFromURL) {
    console.error("No class selected.");
    return;
  }

  // Fetch the latest task ID
  const taskIdFromURL = await fetchTasks(classNameFromURL);
  if (!taskIdFromURL) {
    console.error("No tasks available for the selected class.");
    return;
  }

  // Fetch and display the files for the teacher
  await fetchStudentFiles(classNameFromURL, taskIdFromURL);
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

async function fetchStudentFiles(className, taskId) {
  const filesList = document.getElementById('filesList'); // Element where files will be displayed

  if (!filesList) {
    console.error("Element with ID 'filesList' not found.");
    return;
  }

  try {
    const fileRef = ref(database, `Approved_Classes/${className}/tasks/${taskId}/homework-upload`);
    const snapshot = await get(fileRef);

    console.log(fileRef)

    if (snapshot.exists()) {
      const files = snapshot.val();

      // Iterate over the files and display them
      Object.keys(files).forEach(async (fileKey) => {
        const [studentName, fileName] = fileKey.split(':'); // Extract the student name and file name
        const fileData = files[fileKey]; // This will be the base64 string

        // Create a div element for each file
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.innerHTML = `
          <strong>${studentName}</strong> submitted <span>${fileName}</span>
          <button class="download-btn" onclick="downloadFileAsZip('${className}', '${taskId}', '${fileKey}', '${fileData}')">Download as ZIP</button>
        `;

        // Append the file element to the files list
        filesList.appendChild(fileElement);
      });
    } else {
      console.log('No files uploaded for this task.');
    }
  } catch (error) {
    console.error("Error fetching student files:", error);
  }
}

async function downloadFileAsZip(className, taskId, fileKey, base64Data) {
  const zip = new JSZip();
  const studentName = fileKey.split(':')[0]; // Extract student name from the key
  const fileName = fileKey.split(':')[1]; // Extract file name from the key

  // Add the base64 file to the zip
  zip.file(fileName, base64Data, { base64: true });

  // Generate the zip file and trigger download
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const zipFileName = `${studentName}_homework.zip`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = zipFileName;
    link.click();
  });
}