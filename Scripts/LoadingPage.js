import { database, get, set, push, ref,  auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';




const userRef = ref(database, 'users')
get(userRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const users = snapshot.val();
      const currentUser = localStorage.getItem('userData');
      let validUser = false;

      for (const user in users) {
        if (
          users[user].name === currentUser

        ) {
          validUser = true;

          if (users[user].role === "students") {
            console.log('Student logged in');
            break;
          } 
          else if (users[user].role === "teachers") {
            console.log('Teacher logged in');
            document.querySelector('.for-teachers').innerHTML = `  <a href="../Teacher_Panel/Teacher-Dashboard/teacher-dashboard.html" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-person-chalkboard"></i><h4>Turn into teachers Page</h4></a>`
            break;
          }
        }
      }

      if (validUser) {

      } else {
        console.warn('No valid user found, redirecting to login...');
        window.location.href = "../HTML/LoginPage.html";
      }
    } else {
      console.warn('No user data found in the database, redirecting to login...');
      window.location.href = "../HTML/LoginPage.html";
    }
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
    window.location.href = "../HTML/LoginPage.html";
  });
