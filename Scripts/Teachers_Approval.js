import { database, get, set, ref, remove } from './firebase.js';

// Check if userName is Arafat_Mohammed
const storedUserName = localStorage.getItem("userData");

console.log(storedUserName);

// Load users function with filters
function loadUsers(filters = {}) {
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
          const username = String(user.username);

          // Filter by username and security code if provided
          if (filters.securityCode && userSecurityCode !== filters.securityCode) continue;
          if (filters.username && username !== filters.username) continue;

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${key}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>${user.securityCode || 'N/A'}</td>
            <td><input type="text" data-username="${key}" class="role-input" value="${user.role}" /></td>
            <td>
              <select data-username="${key}" class="pass-fail-dropdown">
                <option value="" disabled selected>Select</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </td>
            <td>${user.status || "Not Approved"}</td>
            <td><button data-username="${key}" class="delete-user-btn">Delete</button></td>
          `;
          tbody.appendChild(row);
          usersFound = true;
        }

        if (!usersFound) {
          tbody.innerHTML = '<tr><td colspan="8">No users found with the provided criteria.</td></tr>';
        }

        // Add event listeners for updates
        addRoleUpdateListeners();
        addStatusUpdateListeners();
        addDeleteListeners();
      } else {
        alert("No users found.");
      }
    })
    .catch((error) => console.error("Error fetching user data: ", error));
}

// Update Role in Database
function addRoleUpdateListeners() {
  const roleInputs = document.querySelectorAll('.role-input');
  roleInputs.forEach(input => {
    input.addEventListener('change', (event) => {
      const username = event.target.getAttribute('data-username');
      const newRole = event.target.value;

      if (!username) {
        console.error("Username not found for role update.");
        return;
      }

      const userRef = ref(database, `users/${username}/role`);

      set(userRef, newRole)
        .then(() => {
          console.log(`Role updated successfully for ${username}: ${newRole}`);
          alert(`Role updated to "${newRole}" for user ${username}`);
        })
        .catch((error) => {
          console.error("Error updating role: ", error);
          alert("Failed to update role. Please try again.");
        });
    });
  });
}

// Update Status Based on Dropdown Selection
function addStatusUpdateListeners() {
  const statusDropdowns = document.querySelectorAll('.pass-fail-dropdown');
  statusDropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', (event) => {
      const username = event.target.getAttribute('data-username');
      const selectedValue = event.target.value;
      const newStatus = selectedValue === 'Pass' ? 'Approved' : 'Not Approved';

      if (!username) {
        console.error("Username not found for status update.");
        return;
      }

      const userRef = ref(database, `users/${username}/status`);

      set(userRef, newStatus)
        .then(() => {
          console.log(`Status updated successfully for ${username}: ${newStatus}`);
          alert(`Status updated to "${newStatus}" for user ${username}`);
          // Update status cell in the table dynamically
          const row = event.target.closest('tr');
          if (row) {
            row.cells[6].innerText = newStatus; // Assuming status is in the 7th column (index 6)
          }
        })
        .catch((error) => {
          console.error("Error updating status: ", error);
          alert("Failed to update status. Please try again.");
        });
    });
  });
}

// Delete User from Database
function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.delete-user-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const username = event.target.getAttribute('data-username');

      if (!username) {
        console.error("Username not found for deletion.");
        return;
      }

      const userRef = ref(database, `users/${username}`);

      if (confirm(`Are you sure you want to delete the user: ${username}?`)) {
        remove(userRef)
          .then(() => {
            console.log(`User ${username} deleted successfully.`);
            alert(`User ${username} deleted successfully.`);
            // Remove row from the table
            const row = event.target.closest('tr');
            if (row) {
              row.remove();
            }
          })
          .catch((error) => {
            console.error("Error deleting user: ", error);
            alert("Failed to delete user. Please try again.");
          });
      }
    });
  });
}

// Search Event Listener
document.getElementById("search-users").addEventListener("click", () => {
  const username = document.getElementById("username-input").value.trim();
  const securityCode = document.getElementById("security-code-input").value.trim();

  loadUsers({ username, securityCode });
});

// Load All Users
document.getElementById("load-users").addEventListener("click", function () {
  loadUsers();
});
