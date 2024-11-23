import { rooms } from './Data/rooms.js';

rooms.forEach((room) => {
   document.querySelector('.classrooms').innerHTML += `
    <a href="eachClassRoom.html"><div class="classroom" data-securityCode="${room.securityCode}">
       <h4>Student</h4>
        <i class="fa-solid fa-${room.icon}"></i>
        <h1>${room.subjectName}</h1>
        <p>WorkBook ends in 25 Hours</p>
        <p>By Mr.<strong>${room.teacherName}</strong></p>
      </div></a>
    `;
});

// Access all classrooms and log their data-securityCode
const classrooms = document.querySelectorAll('.classroom');
classrooms.forEach((classroom) => {
    const security = 5678;
    console.log(document.querySelector('.classroom[data-securitycode = "55603"]'))
});
