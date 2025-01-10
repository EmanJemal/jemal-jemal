import {
  database,
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  child,
  push,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from '../../Scripts/firebase.js';

// DOM Elements
const studentNameElem = document.getElementById("student-name");
const studentClassElem = document.getElementById("student-class");
const lastSeenElem = document.getElementById("last-seen");
const messageBody = document.getElementById("message-body");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const studentListOrder = document.querySelector(".student-list-order");

// Teacher's name from localStorage
const teacherName = localStorage.getItem("userData") || "UnknownTeacher";

// Selected student object
let selectedStudent = null;

// Function to update the message header
function updateMessageHeader(student) {
  studentNameElem.textContent = student.name || "Unknown";
  studentClassElem.textContent = student.class || "Unknown Class";
  lastSeenElem.textContent = `Last Seen: ${student.lastSeen || "Just now"}`;
}

// Function to load messages for the selected student
function loadMessages(studentName) {
  const messageRef = ref(database, `Messages/${teacherName}/${studentName}`);
  
  onValue(messageRef, (snapshot) => {
    const messages = snapshot.val();
    messageBody.innerHTML = ""; // Clear the chat body

    if (messages) {
      Object.values(messages).forEach((message) => {
        const messageElem = document.createElement("div");
        messageElem.classList.add("message", message.sender === teacherName ? "sent" : "received");

        const messageContent = document.createElement("p");
        messageContent.textContent = message.text;

        const messageTimestamp = document.createElement("span");
        messageTimestamp.classList.add("timestamp");
        messageTimestamp.textContent = new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        messageElem.appendChild(messageContent);
        messageElem.appendChild(messageTimestamp);
        messageBody.appendChild(messageElem);
      });
    } else {
      messageBody.innerHTML = `<p class="no-messages-placeholder">No messages yet.</p>`;
    }
  });
}

// Function to handle student selection
function handleStudentSelection(event) {
  const studentElem = event.currentTarget;

  // Extract student details
  const studentName = studentElem.querySelector("h1").textContent.trim();
  const studentClass = "Grade 10"; // Adjust if class data is dynamically loaded

  selectedStudent = {
    name: studentName,
    class: studentClass,
    lastSeen: "Just now",
  };

  updateMessageHeader(selectedStudent);

  // Highlight the selected student
  document.querySelectorAll(".student").forEach((elem) => elem.classList.remove("active-student"));
  studentElem.classList.add("active-student");

  loadMessages(studentName);
}

// Function to populate the student list
function populateStudentList() {
  const usersRef = ref(database, "Approved_Classes");
  const uniqueStudents = new Set();

  get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();

        Object.keys(users).forEach((array) => {
          if (users[array].TeacherName === teacherName) {
            const students = users[array].students;
            if (students && typeof students === "object") {
              Object.keys(students).forEach((studentsArray) => {
                uniqueStudents.add(students[studentsArray]);
              });
            }
          }
        });

        // Populate the HTML
        studentListOrder.innerHTML = ""; // Clear existing list
        uniqueStudents.forEach((student) => {
          const studentCard = `
            <div class="student">
              <h1>${student}</h1>
              <p>Hi Mr. What is 3+2?</p>
              <h4>1 min ago</h4>
            </div>`;
          studentListOrder.insertAdjacentHTML("beforeend", studentCard);
        });

        // Attach event listeners to the dynamically created students
        document.querySelectorAll(".student").forEach((studentElem) => {
          studentElem.addEventListener("click", handleStudentSelection);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to handle sending a message
function sendMessage() {
  const messageText = messageInput.value.trim();

  if (!messageText) {
    alert("Please type a message before sending.");
    return;
  }

  if (!selectedStudent) {
    alert("Please select a student before sending a message.");
    return;
  }

  const messageRef = ref(database, `Messages/${teacherName}/${selectedStudent.name}`);
  push(messageRef, {
    text: messageText,
    timestamp: Date.now(),
    sender: teacherName,
  });

  messageInput.value = ""; // Clear the input field
}

// Event listener for send button
sendBtn.addEventListener("click", sendMessage);

// Populate the student list on page load
populateStudentList();
