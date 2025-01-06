import { database, ref, set, get, update, remove, onValue, child, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../Scripts/firebase.js';


// Select the divs and button
const studentsDiv = document.querySelector('.students');
const teachersDiv = document.querySelector('.teachers');
const submitBtn = document.querySelector('.submit-btn');

// Add click event listeners to the divs
studentsDiv.addEventListener('click', () => {
    studentsDiv.classList.toggle('selected');
    teachersDiv.classList.remove('selected'); // Deselect the other
});

teachersDiv.addEventListener('click', () => {
    teachersDiv.classList.toggle('selected');
    studentsDiv.classList.remove('selected'); // Deselect the other
});


 // Select all divs that need to be toggled
 const toggleDivs = document.querySelectorAll('.students, .teachers');
    
 toggleDivs.forEach(div => {
     div.addEventListener('click', () => {
         // Remove 'selected' class from all divs
         toggleDivs.forEach(d => d.classList.remove('selected'));
         
         // Add 'selected' class to the clicked div
         div.classList.add('selected');
     });
 });


 console.log(localStorage.getItem('userData'))




// Reference to the users node in the database
const usersRef = ref(database, 'users');

// Search for the user with the name 'arafat' and update the role
get(usersRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const users = snapshot.val();
      let userIdToUpdate = null;

      // Loop through the users to find the user with the name 'arafat'
      for (const userId in users) {
        if (users[userId].name && users[userId].name === localStorage.getItem('userData')) {
          userIdToUpdate = userId;
          break;
        }
      }

      if (userIdToUpdate) {


        // Add click event listener to the submit button
        submitBtn.addEventListener('click', () => {
            const selectedDiv = document.querySelector('.selected');
            
            if (!studentsDiv.classList.contains('selected') && !teachersDiv.classList.contains('selected')) {
                alert('Please select either Students or Teachers.');
            } else {
                window.location.href = 'createdRooms.html';
                console.log(`Selected div: ${selectedDiv.className}`);


                update(ref(database, `users/${userIdToUpdate}`), {
                    role: `${selectedDiv.classList[0]}`
                  })
                  .then(() => {
                    console.log('Role updated successfully for user: arafat');
                  })
                  .catch((error) => {
                    console.error('Error updating role:', error);
                  });

            }
        });
        // Update the role for the found user

      } else {
        console.log('User with name "arafat" not found');
      }
    } else {
      console.log('No users found in the database');
    }
  })
  .catch((error) => {
    console.error('Error fetching users:', error);
  });
