import { rooms } from './Data/rooms.js';
import { database, ref, set, get, update, remove, onValue, child, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../Scripts/firebase.js';

const approvedRoomsRef = ref(database, 'Approved_Classes');

get(approvedRoomsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const rooms = snapshot.val();
      const classroomContainer = document.querySelector('.classrooms');
      let classFound = false; // Track if any class is found

      Object.keys(rooms).forEach(roomKey => {
        const room = rooms[roomKey];

        if (room.students) {
          Object.keys(room.students).forEach(studentKey => {
            if (room.students[studentKey] === localStorage.getItem('userData')) {
              classFound = true; // Class found for the user
              classroomContainer.innerHTML += `
                <div class="classroom" data-room-key="${roomKey}">
                  <h4>Student</h4>
                  <i class="fa-solid fa-${room.Icon}"></i>
                  <h1>${room.ClassName}</h1>
                  <p>WorkBook ends in Changable</p>
                  <p>By Mr.<strong>${room.TeacherName}</strong></p>
                </div>
              `;
            }
          });
        }
      });

      // If no class is found, show the "No Class Found" div
      if (!classFound) {
        classroomContainer.innerHTML = `
          <div class="no-class-div">
            <a href="createdRooms.html"> <i class="fa-solid fa-circle-plus no-class-found"></i></a>
            <h1 class="no-class-found-h1">No Class Found</h1>
          </div>
        `;
      }

      // Add click event listener to dynamically created classrooms
      document.querySelectorAll('.classroom').forEach(div => {
        div.addEventListener('click', () => {
          const roomKey = div.getAttribute('data-room-key');
          const roomDetails = rooms[roomKey];
          console.log('Class Name:', roomDetails.ClassName);
          console.log('Class Details:', roomDetails);



        // Redirect the user with the class name as a query parameter
        const className = encodeURIComponent(roomDetails.ClassName); // Encode to ensure special characters are handled
        window.location.href = `../HTML/mark-page.html?tag=${className}`;


          localStorage.setItem('clickedClass', roomDetails.ClassName)
        });
      });
    }
  })
  .catch((error) => {
    console.error('Error fetching approved rooms:', error);
  });


// Access all classrooms and log their data-securityCode
const classrooms = document.querySelectorAll('.classroom');
classrooms.forEach((classroom) => {
    const security = 5678;
    console.log(document.querySelector('.classroom[data-securitycode = "55603"]'))
});

