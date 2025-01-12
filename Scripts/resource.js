const API_KEY = 'AIzaSyDIOs5Riwjv4WPUmns1Q_ttk-zN6oKW5Yw'; // Replace with your YouTube API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

// Array of YouTube video links
const youtubeLinks = [
  "https://www.youtube.com/watch?v=W6NZfCO5SIk",
  "https://www.youtube.com/watch?v=bWPMSSsVdPk",
  "https://www.youtube.com/watch?v=yfoY53QXEnI"
];

// Extract video IDs from the links
const videoIds = youtubeLinks.map(link => {
  const url = new URL(link);
  return url.searchParams.get("v"); // Get the "v" parameter (video ID)
});

// Function to truncate description to 10-20 words
function truncateDescription(description) {
    const words = description.split(' '); // Split by space to get words
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...'; // If more than 20 words, truncate
    }
    return words.join(' '); // Return the full description if it's less than 20 words
  }
  
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
        <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail">
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
