// URL for the songs directory
const songsDirectory = "http://127.0.0.1:5500/songs/";
let songList = [];
let currentSongIndex = -1; // No song is selected initially
let isPlaying = false;

// Reference to the audio element
const audioPlayer = new Audio();

// Fetch song list from the songs.json
async function fetchSongs() {
    try {
        const response = await fetch('songs.json'); // Replace with your correct path to the JSON file
        const data = await response.json();
        songList = data.sort((a, b) => a.localeCompare(b)); // Sort songs alphabetically
        displaySongList();
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

// Display the song list in the library
function displaySongList() {
    const songListElement = document.getElementById('songList');
    songListElement.innerHTML = ''; // Clear any existing content

    songList.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.innerHTML = `
            <img class="music" width="50px" src="music.svg" alt="">
            <div class="songdetails">${song}</div>
            <button class="btn play" data-index="${index}">
                Play
                <img class="play" width="25px" src="play1.svg" alt="">
            </button>
        `;
        songListElement.appendChild(songItem);
    });

    // Add event listeners to the play buttons
    const playButtons = document.querySelectorAll('.btn.play');
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.closest('button').getAttribute('data-index');
            playSong(index);
        });
    });
}

// Function to play the song at the given index
function playSong(index) {
    if (index === currentSongIndex && isPlaying) {
        // If the same song is already playing, pause it
        audioPlayer.pause();
        isPlaying = false;
        updatePlayButton();
    } else {
        // Stop the current song and play the new one
        audioPlayer.src = songsDirectory + songList[index];
        audioPlayer.play();
        currentSongIndex = index;
        isPlaying = true;
        updatePlayButton();
        updateSongDetails(songList[index]);
        updateSeekbar();
    }
}

// Update the play button (Play/Pause)
function updatePlayButton() {
    const playButton = document.querySelector('.playmain');
    if (isPlaying) {
        playButton.src = "pause.svg"; // Change play button to pause
    } else {
        playButton.src = "play.svg"; // Change pause button to play
    }
}

// Update song details (song name) in the right section
function updateSongDetails(songName) {
    const songDetails = document.querySelector('.right .songname');
    songDetails.textContent = songName;
}

// Update the song progress on the seekbar
function updateSeekbar() {
    const seekbar = document.querySelector('.seekbar');
    const currentTime = document.getElementById('currentTime');
    const durationTime = document.getElementById('durationTime');

    // Update duration time when song metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationTime.textContent = formatTime(audioPlayer.duration);
        seekbar.max = audioPlayer.duration;
    });

    // Update seekbar and time display while song is playing
    audioPlayer.addEventListener('timeupdate', () => {
        seekbar.value = audioPlayer.currentTime;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    });

    // Seekbar event (user clicking on the seekbar)
    seekbar.addEventListener('input', () => {
        audioPlayer.currentTime = seekbar.value;
    });
}

// Format time in minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
}

// Volume control
const volumeControl = document.querySelector('.volume');
volumeControl.addEventListener('input', () => {
    audioPlayer.volume = volumeControl.value / 100;
});

// Previous and Next buttons
document.querySelector('.previous').addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--; // Move to the previous song
        audioPlayer.src = songsDirectory + songList[currentSongIndex]; // Directly set song source
        audioPlayer.play(); // Immediately play the previous song
        updateSongDetails(songList[currentSongIndex]);
        updateSeekbar();
        isPlaying = true; // Ensure the play button is updated to "pause"
        updatePlayButton();
    }
});

document.querySelector('.next').addEventListener('click', () => {
    if (currentSongIndex < songList.length - 1) {
        currentSongIndex++; // Move to the next song
        audioPlayer.src = songsDirectory + songList[currentSongIndex]; // Directly set song source
        audioPlayer.play(); // Immediately play the next song
        updateSongDetails(songList[currentSongIndex]);
        updateSeekbar();
        isPlaying = true; // Ensure the play button is updated to "pause"
        updatePlayButton();
    }
});

// Play/Pause toggle for the playmain button
document.querySelector('.playmain').addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    updatePlayButton();
});

// Add event listeners to the playlist cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const playlist = card.getAttribute('data-playlist');
        loadPlaylist(playlist);
    });
});

// Load songs from the selected playlist
async function loadPlaylist(playlist) {
    try {
        const response = await fetch(playlist); // Fetch playlist JSON file
        const data = await response.json();
        songList = data.sort((a, b) => a.localeCompare(b)); // Sort songs alphabetically
        displaySongList(); // Refresh the song library
    } catch (error) {
        console.error('Error loading playlist:', error);
    }
}

// Select all buttons and the popup elements
const buttons = document.querySelectorAll('.mushkul');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');

// Show popup when any button is clicked
buttons.forEach(button => {
    button.addEventListener('click', function() {
        popup.classList.remove('hidden');
    });
});

// Hide popup when close button is clicked
closePopup.addEventListener('click', function() {
    popup.classList.add('hidden');
});

// Select the elements
const hamburger = document.querySelector('.hamburger');
const leftPanel = document.querySelector('.left');

// Track the panel's state
let isAtZero = false; // false: Panel is at -30vw, true: Panel is at 0

// Add a click event listener to the hamburger
hamburger.addEventListener('click', () => {
    if (!isAtZero) {
        leftPanel.style.left = '-6%'; // Move to visible
        isAtZero = true; // Update state
    } else {
        leftPanel.style.left = '-150%'; // Move off-screen
        setTimeout(() => {
            // Reset to initial hidden position after the animation
            leftPanel.style.left = '-150%';
            isAtZero = false; // Update state
        }, 500); // Matches the CSS transition duration
    }
});





// Fetch songs on page load
fetchSongs();
