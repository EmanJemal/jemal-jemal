document.addEventListener("DOMContentLoaded", () => {
  const inputContainer = document.getElementById("input-container");

  inputContainer.addEventListener("input", (event) => {
    if (event.target.classList.contains("points")) {
      // Check if a new field already exists to avoid duplicates
      const lastPointsField = inputContainer.querySelector(".points:last-of-type");
      if (lastPointsField && lastPointsField.value.trim() !== "") {
        // Create a new points input field
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.className = "points input";
        newInput.placeholder = "Point";

        // Append the new input field to the container
        inputContainer.appendChild(newInput);
      }
    }
  });
});
