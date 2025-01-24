import { database, ref, get } from '../../Scripts/firebase.js';

console.log(localStorage.getItem('userData'));

const users = ref(database, 'users');

get(users)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const eachUser = snapshot.val();
            const userData = localStorage.getItem('userData');
            
            // Check if the user exists by filtering the database
            const userExists = Object.keys(eachUser).some((key) => eachUser[key].name === userData);

            if (userExists) {
                window.location.href = "../../HTML/classrooms.html";
            } else {
                window.location.href = "../../HTML/LoginPage.html";
            }
        } else {
            // If no users exist in the database, redirect to the login page
            window.location.href = "../../HTML/LoginPage.html";
        }
    })
    .catch((error) => {
        console.error("Error fetching users:", error);
        // Handle errors (optional)
        window.location.href = "../../HTML/LoginPage.html";
    });
