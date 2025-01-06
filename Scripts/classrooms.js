import { rooms } from './Data/rooms.js';
import { database, ref, set, get, update, remove, onValue, child, push, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../Scripts/firebase.js';

const approvedRoomsRef = ref(database, 'Approved_Classes');

get(approvedRoomsRef)
  .then((snapshot)=>{

    if(snapshot.exists()){
      const rooms = snapshot.val();

      Object.keys(rooms).forEach(room => {
        
        console.log(rooms[room])


        const classroom = document.querySelector('.classrooms');
        classroom.innerHTML += `
        <div class="classroom" data-securityCode="${room.securityCode}">
          <h4>Student</h4>
            <i class="fa-solid fa-${rooms[room].Icon}"></i>
            <h1>${rooms[room].ClassName}</h1>
            <p>WorkBook ends in Changable</p>
            <p>By Mr.<strong>Changable</strong></p>
          </div>
    `;
  });


}

})


// Access all classrooms and log their data-securityCode
const classrooms = document.querySelectorAll('.classroom');
classrooms.forEach((classroom) => {
    const security = 5678;
    console.log(document.querySelector('.classroom[data-securitycode = "55603"]'))
});

