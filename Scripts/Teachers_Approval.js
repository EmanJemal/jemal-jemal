import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get, update, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVIym8X-GDRx6_1256dtVZdo3hIm7TRgI",
  authDomain: "flipper-hack.firebaseapp.com",
  databaseURL: "https://flipper-hack-default-rtdb.firebaseio.com",
  projectId: "flipper-hack",
  storageBucket: "flipper-hack.appspot.com",
  messagingSenderId: "9118741906",
  appId: "1:9118741906:web:d8860d3094a46bafd37d4b",
  measurementId: "G-EYLLFHW5XS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Check if userName is Arafat_Mohammed
const storedUserName = localStorage.getItem("username");

console.log(storedUserName);
// Load users function
function loadUsers(securityCode = null) {
  const usersRef = ref(database, "users");
  get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const tbody = document.getElementById("user-table-body");
        tbody.innerHTML = "";
        let usersFound = false;

        for (const key in users) {
          const user = users[key];
          const userSecurityCode = String(user.securityCode);
          if (securityCode && userSecurityCode !== securityCode) continue;

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${key}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.password}</td>
            <td>${user.securityCode}</td>
            <td><input type="text" data-username="${key}" class="role-input" value="${user.role}" /></td>
            <td><select data-username="${key}" class="pass-fail-dropdown">
              <option value="" disabled selected>Select</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select></td>
            <td><button data-username="${key}" class="delete-user-btn">Delete</button></td>
          `;
          tbody.appendChild(row);
          usersFound = true;
        }

        if (!usersFound) {
          tbody.innerHTML = '<tr><td colspan="9">No users found with the provided security code.</td></tr>';
        }
      } else {
        alert("No users found.");
      }
    })
    .catch((error) => console.error("Error fetching user data: ", error));
}

// Only load users if storedUserName is Arafat_Mohammed
document.getElementById("load-users").addEventListener("click", function () {
  if (storedUserName === "Arafat_Mohammed") {
    loadUsers();
  } else {
    alert("You are not authorized to view this data.");
  }
});