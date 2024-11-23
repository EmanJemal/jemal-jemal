import { rooms } from "../../Scripts/Data/rooms.js";

rooms.forEach((room) => {
    document.querySelector('.classes').innerHTML += `
    <div class="class">
        <i class="fa-solid fa-${room.icon}"></i>
        <h1 class="class-name">${room.subjectName}</h1>
        <p class="teacher-name">By Mr.<strong>${room.teacherName}</strong></p>
        <p class="teacher">Teacher</p>
    </div>
     `;
 });
 
 // Access all classrooms and log their data-securityCode
 const classrooms = document.querySelectorAll('.classes');

 classrooms.forEach((classroom) => {
     const security = 5678;
     console.log(document.querySelector('.classroom[data-securitycode = "55603"]'))
 });
 

 document.querySelector('.container-alert')
    .innerHTML += `      
      <div class="alert_box">

        <div class="icon">
          <i class="fas fa-book"></i>
        </div>

        <div class="input-fields">
          <input class="icon-name" type="text" placeholder="Icon Name" required >
          <div class="suggestions-list" id="icon-suggestions"></div>
          <input class="class-name" type="text" placeholder="Class Name" required>
        </div>


        <div class="btns">
          <label for="check">Create</label>
        </div>

      </div>`;


const icon = document.querySelector('.icon-name');

 icon.addEventListener('input', ()=>{
    document.querySelector('.icon')
        .innerHTML = `<i class="fas fa-${icon.value}"></i>`
 })

document.querySelector('.add-class').addEventListener('click', ()=>{
    document.getElementById("check").checked = true;
});





const inputField = document.querySelector('.icon-name');
const suggestionsContainer = document.getElementById("icon-suggestions");

let freeIcons = []; // Array to store Font Awesome free icons

// Fetch free Font Awesome icons
async function fetchFreeIcons() {
  const response = await fetch("https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json");
  const data = await response.json();
  
  // Extract free icons only
  freeIcons = Object.keys(data).filter(icon => data[icon].styles.includes("solid"));
}

// Filter suggestions based on user input
function filterIcons(query) {
  return freeIcons.filter(icon => icon.toLowerCase().includes(query.toLowerCase()));
}

// Display suggestions
function displaySuggestions(icons) {
  suggestionsContainer.innerHTML = ""; // Clear previous suggestions

  icons.forEach(icon => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");

    // Create icon and text
    item.innerHTML = `<i class="fas fa-${icon}"></i><span>${icon}</span>`;
    
    // Handle click event
    item.addEventListener("click", () => {
      inputField.value = icon; // Set input value to selected icon name
      suggestionsContainer.innerHTML = ""; // Clear suggestions
    });

    suggestionsContainer.appendChild(item);
  });
}

// Handle input events
inputField.addEventListener("input", () => {
  const query = inputField.value.trim();
  
  if (query) {
    const matches = filterIcons(query);
    displaySuggestions(matches);
  } else {
    suggestionsContainer.innerHTML = ""; // Clear suggestions when input is empty
  }
});

// Initial fetch of free icons
fetchFreeIcons();