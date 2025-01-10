function checkWidth() {
    if (window.innerWidth < 960) {
        // Update icon to make it more mobile-friendly
        responsiveIcon();
    }
}

function responsiveIcon() {
    const classRoom = document.querySelector('.classroom-link');
    classRoom.innerHTML = `<i class="fa-solid fa-house"></i>`;
    
    const Assignment = document.querySelector('.classroom-assignment');
    Assignment.innerHTML = `<i class="fa-solid fa-book"></i>`;
    
    const rooms = document.querySelector('.classroom-rooms');
    rooms.innerHTML = `<i class="fa-solid fa-person-booth"></i>`;
    
    const settings = document.querySelector('.classroom-setting');
    settings.innerHTML = `<i class="fa-solid fa-gear"></i>`;
    
    const profile = document.querySelector(".classroom-profile");
    profile.innerHTML = `<i class="fa-solid fa-user"></i>`;
};

// Add event listener for resize to check width on window resize
window.addEventListener('resize', checkWidth);

// Initial check
checkWidth();
