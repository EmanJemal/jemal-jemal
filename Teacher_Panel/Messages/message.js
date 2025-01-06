document.querySelector('.nav-open-btn')
  .addEventListener('click', ()=>{

     
    if(hameburger.className === "hameburger-menu-close") {

      const hameburger = document.querySelector('.hameburger-menu-close')


      document.querySelector('.hameburger-menu-close') 
      .classList.add('hameburger-menu-open');

        document.querySelector('.hameburger-menu-close') 
          .classList.remove('hameburger-menu-close');

        document.querySelector('.nav-open-btn')
          .classList.add('nav-close-btn');


        }


        else {

          const hameburger = document.querySelector('.hameburger-menu-open')


          document.querySelector('.hameburger-menu-open') 
          .classList.add('hameburger-menu-close');
    
            document.querySelector('.hameburger-menu-open') 
              .classList.remove('hameburger-menu-open');
    
            document.querySelector('.nav-open-btn')
              .classList.add('nav-close-btn');
    
    
        }
});
const hameburger = document.querySelector('.hameburger-menu-close')

document.querySelector('.grade-10')
  .addEventListener('click', ()=>{
    console.log('10')
  })