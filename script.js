const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

// Define an array containing all the songs with their details
const allSongs = [
  // Each object represents a song with properties like id, title, artist, duration, and source URL

  {
    id: 0,
    title: "Basket Case",
    artist: "Green Day",
    duration: "3:01",
    src: "music/Basket Case.mp3",
  },
  {
    id: 1,
    title: "Here is the House",
    artist: "Andain",
    duration: "4:52",
    src: "music/Here is the House.mp3",
  },
  {
    id: 2,
    title: "Like A Stone",
    artist: "Audioslave",
    duration: "4:54",
    src: "music/Like A Stone.mp3",
  },
  {
    id: 3,
    title: "Money Trees (Feat. Jay Rock)",
    artist: "Kendrick Lamar",
    duration: "6:26",
    src: "music/Money Trees (Feat. Jay Rock).mp3",
  },
  {
    id: 4,
    title: "One In A Million (Radio Edit)",
    artist: "Andrew Rayel Ft. Jonathan Mendelsohn",
    duration: "3:09",
    src: "music/One In A Million (Radio Edit).mp3",
  },
  {
    id: 5,
    title: "Outside",
    artist: "Staind",
    duration: "4:52",
    src: "music/Outside.mp3",
  },
  {
    id: 6,
    title: "Pain",
    artist: "Jimmy Eat World",
    duration: "3:01",
    src: "music/Pain.mp3",
  },
  {
    id: 7,
    title: "Spiders",
    artist: "System Of A Down",
    duration: "3:35",
    src: "music/Spiders.mp3",
  },
  {
    id: 8,
    title: "Stir It Up",
    artist: "Bob Marley",
    duration: "5:32",
    src: "music/Stir It Up.mp3",
  },
  {
    id: 9,
    title: "T.N.T.",
    artist: "AC/DC",
    duration: "3:47",
    src: "music/T.N.T..mp3",
  },
];

// Initialize the Audio object
const audio = new Audio();

// userData object containing songs, current song, and song current time
let userData = {
  songs: [...allSongs], // Copy of allSongs
  currentSong: null, // Current song being played
  songCurrentTime: 0, // Current playback time of the song
};

// Function to play a song by its ID
const playSong = (id) => {
  // Find the song from userData using its ID
  const song = userData?.songs.find((song) => song.id === id);
  // Set audio source and title to the selected song
  audio.src = song.src;
  audio.title = song.title;

  // If the selected song is different from the current one, reset playback time
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }

  // Update userData with the current song
  userData.currentSong = song;
  // Update playButton style to indicate playing state
  playButton.classList.add("playing");

  // Highlight the current song in the playlist
  highlightCurrentSong();
  // Update player display with song title and artist
  setPlayerDisplay();
  // Update play button accessibility text
  setPlayButtonAccessibleText();
  // Play the audio
  audio.play();
};

// Function to pause the currently playing song
const pauseSong = () => {
  // Save current playback time
  userData.songCurrentTime = audio.currentTime;
  // Update playButton style to indicate paused state
  playButton.classList.remove("playing");
  // Pause the audio
  audio.pause();
};

// Function to play the next song in the playlist
const playNextSong = () => {
  // If no current song is playing, play the first song
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    // Get the index of the current song in the playlist
    const currentSongIndex = getCurrentSongIndex();
    // Get the next song from userData
    const nextSong = userData?.songs[currentSongIndex + 1];
    // Play the next song
    playSong(nextSong.id);
  }
};

// Function to play the previous song in the playlist
const playPreviousSong = () => {
  // If no current song is playing, return
  if (userData?.currentSong === null) return;
  else {
    // Get the index of the current song in the playlist
    const currentSongIndex = getCurrentSongIndex();
    // Get the previous song from userData
    const previousSong = userData?.songs[currentSongIndex - 1];
    // Play the previous song
    playSong(previousSong.id);
  }
};

// Function to shuffle the playlist
const shuffle = () => {
  // Shuffle the songs array in userData
  userData?.songs.sort(() => Math.random() - 0.5);
  // Reset current song and song current time
  userData.currentSong = null;
  userData.songCurrentTime = 0;
  // Render the shuffled songs in the playlist
  renderSongs(userData?.songs);
  // Pause the audio
  pauseSong();
  // Update player display
  setPlayerDisplay();
  // Update play button accessibility text
  setPlayButtonAccessibleText();
};

// Function to delete a song from the playlist
const deleteSong = (id) => {
  // If the deleted song is the current song, reset playback state
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    // Pause the audio
    pauseSong();
    // Update player display
    setPlayerDisplay();
  }
  // Remove the deleted song from the userData array
  userData.songs = userData?.songs.filter((song) => song.id !== id);
  // Re-render the updated playlist
  renderSongs(userData?.songs);
  // Highlight the current song
  highlightCurrentSong();
  // Update play button accessibility text
  setPlayButtonAccessibleText();

  // If there are no more songs in the playlist, create a reset button
  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    // Event listener to reset the playlist when the button is clicked
    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];
      // Render the default sorted playlist
      renderSongs(sortSongs());
      // Update play button accessibility text
      setPlayButtonAccessibleText();
      // Remove the reset button
      resetButton.remove();
    });
  }
};

// Function to update player display with current song information
const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  // Set text content of player elements
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

// Function to highlight the currently playing song in the playlist
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  // Remove highlighting from all songs
  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  // Highlight the current song if it exists
  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

// Function to render songs in the playlist
const renderSongs = (array) => {
  // Generate HTML for each song in the array
  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  // Set HTML content of the playlist
  playlistSongs.innerHTML = songsHTML;
};

// Function to set the accessible text for the play button
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

// Function to get the index of the current song in the playlist
const getCurrentSongIndex = () =>
  userData?.songs.indexOf(userData?.currentSong);

// Event listener for play button click
playButton.addEventListener("click", () => {
  // If no current song is playing, play the first song
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    // Otherwise, play the current song
    playSong(userData?.currentSong.id);
  }
});

// Event listener for pause button click
pauseButton.addEventListener("click", pauseSong);

// Event listener for next button click
nextButton.addEventListener("click", playNextSong);

// Event listener for previous button click
previousButton.addEventListener("click", playPreviousSong);

// Event listener for shuffle button click
shuffleButton.addEventListener("click", shuffle);

// Event listener for when the audio ends
audio.addEventListener("ended", () => {
  // Get the index of the current song in the playlist
  const currentSongIndex = getCurrentSongIndex();
  // Check if a next song exists
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

  // If a next song exists, play it, otherwise reset playback state
  if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
});

// Function to sort the songs array alphabetically by title
const sortSongs = () => {
  userData?.songs.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

// Render the sorted playlist initially
renderSongs(sortSongs());
// Set accessible text for play button
setPlayButtonAccessibleText();
