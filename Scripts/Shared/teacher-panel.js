const profileDetails = document.getElementById("profileDetails");
const dropdownMenu = document.getElementById("dropdownMenu");

profileDetails.addEventListener("click", () => {
  dropdownMenu.classList.toggle("active");
});

// Close the dropdown if clicked outside
window.addEventListener("click", (e) => {
  if (!profileDetails.contains(e.target)) {
    dropdownMenu.classList.remove("active");
  }
});