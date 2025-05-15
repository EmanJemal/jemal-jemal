import { database, ref, set, get, update, remove, onValue, child, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../../Scripts/firebase.js';

const classesRef = ref(database, 'Approved_Classes')

get(classesRef)
  .then((snapshot)=>{
    if(snapshot.exists()) {
      const classes = snapshot.val();

      console.log(classes)


      Object.keys(classes).forEach((array)=>{
        console.log(classes[array])

        if(classes[array].TeacherName === localStorage.getItem('userData')){
          document.querySelector('.classes').innerHTML += `
          <div class="class">
              <i class="fa-solid fa-${classes[array].Icon}"></i>
              <h1 class="class-name">${classes[array].ClassName}</h1>
              <p class="teacher-name">By Mr.<strong>${classes[array].TeacherName}</strong></p>
              <p class="teacher">Teacher</p>
          </div>
           `;
        }

      });

    }
  })



 
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
          <input class="class-name name-of-class" type="text" placeholder="Class Name" required>
        </div>


        <div class="btns">
          <label class="create-button">Create</label>
          <label for="check">Close</label>
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







/* Creating Room */

const button = document.querySelector('.alert_box .create-button');

// Listen for form submission
button.addEventListener('click', () => {

    const iconName = document.querySelector('.icon-name').value;
    const className = document.querySelector('.name-of-class').value;
    const teacherName = localStorage.getItem('userData');


	const userData = {
		Icon: iconName,
		ClassName: className,
		status: 'underReview',
    TeacherName: teacherName
	};


  console.log(userData);

	const classKey = className;

	const userRef = ref(database, `Approved_Classes/${classKey}`)/** Just for now untill the admin panel is built */

	set(userRef, userData)
		.then (()=>{
           showToastClassApproved();
           setTimeout(()=>{window.location.reload();}, 6000)
        });

});




let toastBox = document.getElementById('toastBox');

function showToastClassApproved() {

  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Your class is under review and may take up to 24 hours. Please check your email.';
  toast.innerHTML += ''
  toastBox.appendChild(toast);

  setTimeout(()=>{
    toast.remove();
  }, 6000)
};




