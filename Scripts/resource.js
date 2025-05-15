const API_KEY = 'AIzaSyDIOs5Riwjv4WPUmns1Q_ttk-zN6oKW5Yw'; // Replace with your YouTube API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

// Array of YouTube video links
const youtubeLinks = [
  "https://www.youtube.com/watch?v=4xrfkdO4fBI&t=4s",
  "https://www.youtube.com/watch?v=L5GLg98DIns&list=PLWeerq9oa1ne5T9Im1ei06yz1tUFqevel&index=1",
  "https://www.youtube.com/watch?v=rlxYEiLnfWk",
  "https://www.youtube.com/watch?v=7li8Q0cxWac",
  "https://www.youtube.com/watch?v=drLxfjqZHVo"
];

const links = [
  "https://www.youtube.com/watch?v=W6NZfCO5SIk",
  "https://www.youtube.com/watch?v=xf0Mli0LVgI",
  "https://www.exam-mate.com/media/pastpapers/452317/0417_s24_qp_22.pdf" // PDF link
];

// Extract video IDs from the links
const videoIds = youtubeLinks.map(link => {
  const url = new URL(link);
  return url.searchParams.get("v"); // Get the "v" parameter (video ID)
});

// Function to check if the link is a YouTube URL
function isYouTubeLink(url) {
  return url.includes('youtube.com');
}

// Function to handle PDF links and create a thumbnail
function handlePdfLink(link) {
  const fileItem = document.createElement("div");
  fileItem.classList.add("file-item");

  // Set the file name
  const fileName = link.split('/').pop();

  // Create the thumbnail container
  const thumbnailContainer = document.createElement("div");
  thumbnailContainer.classList.add("thumbnail-container");

  // Render the PDF thumbnail
  renderPdfThumbnail(link, (imageUrl) => {
    const img = document.createElement("img");
    img.src = imageUrl; // Set the PDF page image as the thumbnail
    img.alt = `Thumbnail for ${fileName}`;
    img.classList.add("thumbnail"); // You can style this like YouTube thumbnails
    thumbnailContainer.appendChild(img);
  });

  fileItem.innerHTML = `
    <div class="icon-fa">
      <i class="fa-regular fa-file-pdf"></i>
    </div>

    <div class="file-details">
      <h1 class="teacher-msg">This is 2022 pastpaper</h1>
      <h3 class="file-title">${fileName}</h3>
      <a href="${link}" target="_blank" class="file-link">View/Download File</a>
    </div>



  `;

  // Append the file item to the list
  videoList.appendChild(fileItem);
}

// Function to render the first page of the PDF as an image thumbnail
function renderPdfThumbnail(pdfUrl, callback) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Use pdf.js to load the PDF and render the first page
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  loadingTask.promise.then(function(pdf) {
    pdf.getPage(1).then(function(page) {
      const viewport = page.getViewport({ scale: 0.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext).promise.then(function() {
        // Return the base64 image as a thumbnail
        callback(canvas.toDataURL());
      });
    });
  });
}

// Render videos and file links
async function renderLinks() {
  for (const link of links) {
    if (isYouTubeLink(link)) {
      // Handle YouTube links as before
      const videoId = new URL(link).searchParams.get("v");
      const video = await fetchVideoDetails(videoId);
      if (video) {
        const videoItem = document.createElement("div");
        videoItem.classList.add("video-item");

        videoItem.innerHTML = `
          <div class="video-details">
            <p class="video-title">${video.title}</p>
            <p class="video-description">${video.description}</p>
          </div>
          <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail">
          
          <div class="like-dislike">
            <i class="fa-regular fa-thumbs-up"></i><h3 class="like-count">25</h3>
          </div>
          `;

        // Add click event to open video link
        videoItem.addEventListener("click", () => {
          window.open(video.link, "_blank");
        });

        videoList.appendChild(videoItem);
      }
    } else {
      // Handle PDF and file links
      handlePdfLink(link);
    }
  }
}

// Fetch and render the links
renderLinks();

// Function to fetch YouTube video details
async function fetchVideoDetails(videoId) {
  try {
    const response = await fetch(`${BASE_URL}?part=snippet&id=${videoId}&key=${API_KEY}`);
    const data = await response.json();
    if (data.items.length > 0) {
      const video = data.items[0].snippet;
      return {
        title: video.title,
        description: truncateDescription(video.description), // Truncate description to 10-20 words
        thumbnail: video.thumbnails.high.url,
        link: `https://www.youtube.com/watch?v=${videoId}`
      };
    } else {
      console.error("No data found for video ID:", videoId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}

// Function to truncate description to 10-20 words
function truncateDescription(description) {
  const words = description.split(' '); // Split by space to get words
  if (words.length > 20) {
    return words.slice(0, 20).join(' ') + '...'; // If more than 20 words, truncate
  }
  return words.join(' '); // Return the full description if it's less than 20 words
}

// Render videos
const videoList = document.getElementById("videoList");

async function renderVideos() {
  for (const videoId of videoIds) {
    const video = await fetchVideoDetails(videoId);
    if (video) {
      const videoItem = document.createElement("div");
      videoItem.classList.add("video-item");

      videoItem.innerHTML = `
        <div class="video-details">
          <p class="video-title">${video.title}</p>
          <p class="video-description">${video.description}</p>
        </div>


        <div class="thumbnail-wrapper">
          <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail">
        </div>


        <div class="like-dislike">
          <i class="fa-regular fa-thumbs-up"></i><h3 class="like-count">25</h3>
        </div>
      `;

      // Add click event to open video link
      videoItem.addEventListener("click", () => {
        window.open(video.link, "_blank");
      });

      videoList.appendChild(videoItem);
    }
  }
}

// Fetch and render the videos
renderVideos();
