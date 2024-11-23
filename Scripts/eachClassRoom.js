const elements = {
    seconds: document.querySelector(".seconds .number"),
    minutes: document.querySelector(".minutes .number"),
    hours: document.querySelector(".hours .number"),
    days: document.querySelector(".days .number"),
  };
  
  let values = {
    seconds: 11,
    minutes: 2,
    hours: 2,
    days: 9,
  };
  
  function updateValue(key, value) {
    elements[key].textContent = String(value).padStart(2, "0");
  }
  
  const timeFunction = setInterval(() => {
    values.seconds--;
  
    if (values.seconds === 0) {
      values.minutes--;
      values.seconds = 59;
    }
    if (values.minutes === 0) {
      values.hours--;
      values.minutes = 59;
    }
    if (values.hours === 0) {
      values.days--;
      values.hours = 23;
    }
  
    if (values.days === 0) clearInterval(timeFunction);
  
    updateValue("seconds", values.seconds);
    updateValue("minutes", values.minutes);
    updateValue("hours", values.hours);
    updateValue("days", values.days);
  }, 1000);
  





const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  let file = target.files[0];
  if(file){
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  }
}

function uploadFile(name){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({loaded, total}) =>{
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    let progressHTML = `<li class="row"  style="background: #343f4f;">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
      progressArea.innerHTML = "";
      let uploadedHTML = `<li class="row"  style="background: #343f4f;">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size" >${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let data = new FormData(form);
  xhr.send(data);
}