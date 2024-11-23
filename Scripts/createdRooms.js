import { rooms } from './Data/rooms.js';

rooms.forEach((room) => {
    const classroom = document.querySelector('.classrooms');
classroom.innerHTML += `
    <div class="classroom">

      <div class="full-classroom-detail">
        <i class="fa-solid fa-${room.icon}"></i>
        <div class="classroom-detail">
          <h1>${room.subjectName}</h1>
          <p>By Mr.<strong>${room.teacherName}</strong></p>
          <p class="security-code">${room.securityCode}</p>
        </div>
      </div>

      <a class="plus-button-a"><i class="fa-solid fa-plus"></i></a>

    </div>
`
});

let toastBox = document.getElementById('toastBox');

function showToast() {

  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> successfully submitted';
  toast.innerHTML += ''
  toastBox.appendChild(toast);

  setTimeout(()=>{
    toast.remove();
  }, 6000)
};



if(document.referrer ==="http://127.0.0.1:5500/HTML/role.html"){
  showToast();
}

