import { database, get, set, push, ref,  auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';
// 8
// Show Loading Animation
function showLoadingPage() {
  document.body.innerHTML = `
    <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
    <div class="parent-container">
      <dotlottie-player 
        class="full-width"
        src="https://lottie.host/ca4215fb-31aa-471f-9708-ae245d4f4dc4/Bu346LATDK.json" 
        background="transparent" 
        speed="1"
        loop autoplay>
      </dotlottie-player>
    </div>
  `;
}



// Fetch Data from Firebase
showLoadingPage(); // Display loading animation first

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
            break;
          }
        }
      }

      if (validUser) {
        // Load main HTML content if the user is valid
        loadMainPage();
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
