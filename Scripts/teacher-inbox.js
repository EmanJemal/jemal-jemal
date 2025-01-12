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
  } from "../Scripts/firebase.js";
  
  // DOM Elements
  const teacherNameElem = document.querySelector(".teacher-name"); // Fixed querySelector for teacher name
  const messageBody = document.querySelector(".chat-body"); // Updated to match class in the HTML
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-button"); // Corrected ID to match 'send-button' in HTML
  
  // Student's name from localStorage
  const studentName = localStorage.getItem("userData") || "UnknownStudent";
  
  // Selected teacher object
  let selectedTeacher = null;
  
  // Function to update the chat header with teacher details
  function updateMessageHeader(teacher) {
    teacherNameElem.textContent = teacher.name || "Unknown";
  }
  
  // Function to load messages for the selected teacher
  function loadMessages(teacherName) {
    const messageRef = ref(database, `Messages/${teacherName}/${studentName}`);
  
    onValue(messageRef, (snapshot) => {
      const messages = snapshot.val();
      messageBody.innerHTML = ""; // Clear the chat body
  
      if (messages) {
        Object.values(messages).forEach((message) => {
          const messageElem = document.createElement("div");
          messageElem.classList.add("message", message.sender === studentName ? "student-message" : "teacher-message");
  
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
  
        // Scroll to the bottom of the chat body
        messageBody.scrollTop = messageBody.scrollHeight;
      } else {
        messageBody.innerHTML = `<p class="no-messages-placeholder">No messages yet.</p>`;
      }
    });
  }
  
  // Function to handle sending a message
  function sendMessage() {
    const messageText = messageInput.value.trim();
  
    if (!messageText) {
      alert("Please type a message before sending.");
      return;
    }
  
    if (!selectedTeacher) {
      alert("Please select a teacher before sending a message.");
      return;
    }
  
    const messageRef = ref(database, `Messages/${selectedTeacher.name}/${studentName}`);
    push(messageRef, {
      text: messageText,
      timestamp: Date.now(),
      sender: studentName,
    });
  
    messageInput.value = ""; // Clear the input field
  }
  
  // Function to fetch teacher details and populate the chat header
  function fetchTeacherDetails() {
    const clickedClass = localStorage.getItem("clickedClass"); // Class name from local storage
  
    if (!clickedClass) {
      alert("Class name not found. Please select a class.");
      return;
    }
  
    const teacherRef = ref(database, `Approved_Classes/${clickedClass}`);
  
    get(teacherRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const teacherData = snapshot.val();
          selectedTeacher = {
            name: teacherData.TeacherName,
            lastSeen: teacherData.lastSeen || "Just now",
          };
  
          updateMessageHeader(selectedTeacher);
          loadMessages(selectedTeacher.name);
        } else {
          console.error("Teacher data not found for the class:", clickedClass);
        }
      })
      .catch((error) => {
        console.error("Error fetching teacher details:", error);
      });
  }
  
  // Event listener for send button
  sendBtn.addEventListener("click", sendMessage);
  
  // Initialize the chat on page load
  document.addEventListener("DOMContentLoaded", () => {
    fetchTeacherDetails();
  });
  


  window.addEventListener("load", function () {
    const chatBody = document.getElementById("chat-body");
    chatBody.scrollTop = chatBody.scrollHeight;
});
