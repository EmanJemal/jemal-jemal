import { database, get, set, push, ref,  auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';

const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});




const loginForm = document.querySelector('form');
const usernameInput = document.querySelector('.input-div.one .input');
const passwordInput = document.querySelector('.input-div.pass .input');

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const userRef = ref(database, 'users')

    async function fetchAllUsers() {

        
        try {
            const snapshot = await get(userRef); // Ensure 'userRef' is correctly defined
            
            
            if (snapshot.exists()) {
                const userArray = [];
                
                snapshot.forEach((childSnapshot) => {
                    userArray.push(childSnapshot.val());
                    if(name === childSnapshot.val().name && password === childSnapshot.val().password){
                        window.location.href="../HTML/classrooms.html"
                        localStorage.setItem('userData', name)
                    }
                });
    
                console.log(userArray); // Logs all fetched users
                return userArray; // Return the array for further usage
            } else {
                console.log('No data available');
                return []; // Return an empty array if no data
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            return []; // Return an empty array on error
        }
    }
    
    fetchAllUsers();
});