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

// Add click event listener to the submit button
submitBtn.addEventListener('click', () => {
    const selectedDiv = document.querySelector('.selected');
    
    if (!studentsDiv.classList.contains('selected') && !teachersDiv.classList.contains('selected')) {
        alert('Please select either Students or Teachers.');
    } else {
        window.location.href = 'createdRooms.html';
        console.log(`Selected div: ${selectedDiv.className}`);
    }
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
