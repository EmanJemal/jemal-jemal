import { rooms } from './Data/rooms.js';
import { database, ref, set, get, update, remove, onValue, child, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../Scripts/firebase.js';

const approvedRoomsRef = ref(database, 'Approved_Classes');

get(approvedRoomsRef)
  .then((snapshot)=>{

    if(snapshot.exists()){
      const rooms = snapshot.val();

      const classroom = document.querySelector('.classrooms');

      classroom.innerHTML = ''

      Object.keys(rooms).forEach(room => {
        
        console.log(rooms[room])

        
        const classroom = document.querySelector('.classrooms');
        classroom.innerHTML += `
          <div class="classroom">
      
            <div class="${rooms[room].ClassName} full-classroom-detail">
              <i class="fa-solid fa-${rooms[room].Icon}"></i>
              <div class="classroom-detail">
                <h1>${rooms[room].ClassName}</h1>
                <p>By Mr.<strong>Changable</strong></p>
                <p class="security-code">Changable</p>
              </div>
            </div>
      
            <a class="plus-button-a"><i class="fa-solid fa-plus"></i></a>
      
          </div>
      `
      });

    
    }

  })




let toastBox = document.getElementById('toastBox');

function showToast() {

  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> successfully submitted';
  toast.innerHTML += ''
  toastBox.appendChild(toast);

  setTimeout(()=>{
    toast.remove();
  }, 6000)
};



if(document.referrer ==="http://127.0.0.1:5500/HTML/role.html"){
  showToast();
}


document.addEventListener('DOMContentLoaded', () => {
  const classroom = document.getElementById('classroom');
  let selectedClassName = null; // Store the selected class name globally

  if (classroom) {
    classroom.addEventListener('click', (event) => {
      if (event.target.classList.contains('fa-plus')) {
        const plusButtonParent = event.target.closest('.plus-button-a');
        
        if (plusButtonParent) {
          const previousElement = plusButtonParent.previousElementSibling;
          
          if (previousElement) {
            selectedClassName = previousElement.classList[0]; // Update the selected class
            console.log('Selected Class:', selectedClassName);

            document.querySelector('.alert_box .text').innerHTML = `Add ${selectedClassName} To My List`;
            document.getElementById("check").checked = true;
          } else {
            console.warn('No previous element found.');
          }
        }
      }
    });

    const usersRef = ref(database, 'users');
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          let userIdToUpdate = null;

          // Find the user by localStorage username
          for (const userId in users) {
            if (users[userId].name && users[userId].name === localStorage.getItem('userData')) {
              userIdToUpdate = userId;
              break;
            }
          }

          if (userIdToUpdate) {
            const submitBtn = document.querySelector('.join-button');
            
            submitBtn.addEventListener('click', async () => {
              if (selectedClassName) {
                const currentStudent = localStorage.getItem('userData');
                
                try {
                  // ✅ Update Approved_Classes
                  const approveClassesRef = ref(database, `Approved_Classes/${selectedClassName}/students`);
                  let studentsSnapshot = await get(approveClassesRef);
                  let students = studentsSnapshot.val() || [];
                  
                  if (!Array.isArray(students)) {
                    students = Object.values(students);
                  }

                  if (!students.includes(currentStudent)) {
                    students.push(currentStudent);
                    await update(ref(database, `Approved_Classes/${selectedClassName}`), {
                      students: students
                    });
                    console.log('Student added to Approved_Classes successfully!');
                  } else {
                    console.warn('Student is already in the class list.');
                  }

                  // ✅ Update User Profile Classes
                  const userClassesRef = ref(database, `users/${userIdToUpdate}/classes`);
                  let userClassesSnapshot = await get(userClassesRef);
                  let userClasses = userClassesSnapshot.val() || [];
                  
                  if (!Array.isArray(userClasses)) {
                    userClasses = Object.values(userClasses);
                  }

                  if (!userClasses.includes(selectedClassName)) {
                    userClasses.push(selectedClassName);
                    await update(ref(database, `users/${userIdToUpdate}`), {
                      classes: userClasses
                    });
                    console.log('Class added to user profile successfully!');
                  } else {
                    console.warn('Class already exists in user profile.');
                  }

                  // Optional: Provide visual confirmation or reload
                  // window.location.reload();
                } catch (error) {
                  console.error('Error updating database:', error);
                }
              } else {
                console.warn('No class selected. Click on a plus button first.');
              }
            });
          } else {
            console.warn('User not found in the database.');
          }
        } else {
          console.warn('No users found in the database.');
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  } else {
    console.error('The classroom element was not found in the DOM.');
  }
});
