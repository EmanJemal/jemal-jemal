import { database, ref, set, get, update, remove, onValue, child, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../Scripts/firebase.js';

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


// Select the form
const form = document.getElementById('signInForm');

// Listen for form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const nameOfUser = document.querySelector('.name-user').value;
    const emailOfUser = document.querySelector('.email-user').value;
    const passOfUser = document.querySelector('.pass-user').value;



	const userData = {
		name: nameOfUser,
		email: emailOfUser,
		password: passOfUser,
		status: 'underReview'
	};

	const studentRef = ref(database, 'users');
	const newUserRef = push(studentRef);
	const userKey = nameOfUser.replace(/\s+/g, '_');

	const userRef = ref(database, `users/${userKey}`)

	set(userRef, userData)
		.then (()=>{
			localStorage.setItem('userData', nameOfUser)
            window.location = 'role.html'    
        });

});