document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize toasts
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    const toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 3000
        });
    });

    // Play button functionality
    const playButtons = document.querySelectorAll('.play-btn, .play-btn-card, .play-pause-btn');
    const playToast = document.getElementById('playToast');
    const playToastInstance = bootstrap.Toast.getInstance(playToast);
    const playingToastText = document.getElementById('playingToastText');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                // Change all other buttons to play
                document.querySelectorAll('.fa-pause').forEach(pauseIcon => {
                    pauseIcon.classList.remove('fa-pause');
                    pauseIcon.classList.add('fa-play');
                });
                // Change this button to pause
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                
                // Update now playing info (in a real app, this would play the actual song)
                const songName = this.dataset.song;
                const artistName = this.dataset.artist;
                const imgSrc = this.dataset.img;
                updateNowPlaying(songName, artistName, imgSrc);
                
                // Start progress bar animation
                startProgressBar();
                
                // Show toast notification
                if (playingToastText && songName) {
                    playingToastText.textContent = songName;
                    if (playToastInstance) {
                        playToastInstance.hide();
                        setTimeout(() => playToastInstance.show(), 200);
                    } else {
                        new bootstrap.Toast(playToast).show();
                    }
                }
            } else {
                // Change to play
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    });

    // Song item hover effect
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        const numberSpan = item.querySelector('.song-number-text');
        const playIcon = item.querySelector('.song-number-icon');
        
        item.addEventListener('mouseenter', function() {
            numberSpan.style.display = 'none';
            playIcon.style.display = 'inline-block';
        });
        
        item.addEventListener('mouseleave', function() {
            numberSpan.style.display = 'inline-block';
            playIcon.style.display = 'none';
        });

        // Double click to play
        item.addEventListener('dblclick', function() {
            const songName = this.querySelector('.song-name').textContent;
            const artistName = this.querySelector('.song-artist').textContent;
            const imgSrc = this.querySelector('.song-img').src;
            
            // Update now playing
            updateNowPlaying(songName, artistName, imgSrc);
            
            // Update play button in player
            const playerPlayBtn = document.querySelector('.play-pause-btn i');
            playerPlayBtn.classList.remove('fa-play');
            playerPlayBtn.classList.add('fa-pause');
        });
    });

    // Create Playlist button functionality
    const createPlaylistBtn = document.getElementById('createPlaylistBtn');
    const playlistToast = document.getElementById('playlistToast');
    const playlistNameInput = document.getElementById('playlistName');
    
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', function() {
            // Get the playlist name from the input
            const playlistName = playlistNameInput ? playlistNameInput.value : 'New Playlist';
            const playlistToastText = document.getElementById('playlistToastText');
            
            if (playlistToastText) {
                playlistToastText.textContent = `"${playlistName}" has been created!`;
            }
            
            // Show toast notification
            const playlistToastInstance = bootstrap.Toast.getInstance(playlistToast);
            if (playlistToastInstance) {
                playlistToastInstance.show();
            } else {
                new bootstrap.Toast(playlistToast).show();
            }
            
            // Reset form
            if (playlistNameInput) {
                playlistNameInput.value = '';
            }
        });
    }
    
    // Function to update now playing
    function updateNowPlaying(song, artist, img) {
        if (!song || !artist || !img) return;
        
        const nowPlayingImg = document.querySelector('.current-song-img');
        const nowPlayingName = document.querySelector('.current-song-name');
        const nowPlayingArtist = document.querySelector('.current-song-artist');
        
        if (nowPlayingImg) nowPlayingImg.src = img;
        if (nowPlayingName) nowPlayingName.textContent = song;
        if (nowPlayingArtist) nowPlayingArtist.textContent = artist;
    }

    // Progress bar functionality
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const progressBarWidth = this.clientWidth;
            const clickPosition = e.offsetX;
            const progressPercentage = (clickPosition / progressBarWidth) * 100;
            
            // Update progress bar
            this.querySelector('.progress-bar').style.width = progressPercentage + '%';
            
            // Update current time (in a real app, this would seek the song)
            const totalSeconds = 210; // 3:30 in seconds
            const newSeconds = Math.floor((progressPercentage / 100) * totalSeconds);
            document.querySelector('.current-time').textContent = formatTime(newSeconds);
        });
    }

    // Format time function (converts seconds to MM:SS format)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Volume slider functionality
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            // In a real app, this would change the actual volume
            const volumePercentage = this.value;
            document.querySelector('.volume-percentage').textContent = volumePercentage + '%';
        });
    }

    // Sidebar active link
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-button');
    const likeToast = document.getElementById('likeToast');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            // Toggle heart icon filled/outline
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.classList.add('text-success');
            } else if (icon.classList.contains('text-success')) {
                icon.classList.remove('text-success');
            } else {
                icon.classList.add('text-success');
                // Show toast notification
                const likeToastInstance = bootstrap.Toast.getInstance(likeToast);
                if (likeToastInstance) {
                    likeToastInstance.show();
                } else {
                    new bootstrap.Toast(likeToast).show();
                }
            }
        });
    });
    
    // Progress bar functionality
    let progressInterval;
    const currentTimeEl = document.querySelector('.current-time');
    const progressBarEl = document.querySelector('.progress-bar');
    
    // Volume control functionality
    const volumeControl = document.getElementById('volumeControl');
    const volumeIcon = document.querySelector('.fa-volume-up');
    
    if (volumeControl && volumeIcon) {
        volumeControl.addEventListener('input', function() {
            const volume = this.value;
            
            // Update volume icon based on level
            volumeIcon.className = ''; // Remove all classes
            
            if (volume == 0) {
                volumeIcon.classList.add('fas', 'fa-volume-mute');
            } else if (volume < 30) {
                volumeIcon.classList.add('fas', 'fa-volume-off');
            } else if (volume < 70) {
                volumeIcon.classList.add('fas', 'fa-volume-down');
            } else {
                volumeIcon.classList.add('fas', 'fa-volume-up');
            }
        });
        
        // Toggle mute when clicking the volume icon
        volumeIcon.parentElement.addEventListener('click', function() {
            if (volumeIcon.classList.contains('fa-volume-mute')) {
                // Unmute - restore to previous volume
                volumeControl.value = volumeControl.dataset.previousVolume || 70;
                volumeIcon.classList.remove('fa-volume-mute');
                volumeIcon.classList.add('fa-volume-up');
            } else {
                // Mute - save current volume
                volumeControl.dataset.previousVolume = volumeControl.value;
                volumeControl.value = 0;
                volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-off');
                volumeIcon.classList.add('fa-volume-mute');
            }
            
            // Trigger input event to update icon
            volumeControl.dispatchEvent(new Event('input'));
        });
    }
    
    function startProgressBar() {
        // Reset progress
        if (progressBarEl) {
            progressBarEl.style.width = '0%';
        }
        if (currentTimeEl) {
            currentTimeEl.textContent = '0:00';
        }
        
        // Clear any existing interval
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        
        // Start new progress simulation
        let progress = 0;
        let seconds = 0;
        let minutes = 0;
        
        progressInterval = setInterval(() => {
            progress += 0.5;
            seconds += 1;
            
            if (seconds >= 60) {
                minutes += 1;
                seconds = 0;
            }
            
            if (progressBarEl) {
                progressBarEl.style.width = `${progress}%`;
            }
            
            if (currentTimeEl) {
                currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 1000);
    }
    
    // Initialize with first song
    const firstSong = document.querySelector('.song-item');
    if (firstSong) {
        const songName = firstSong.querySelector('.song-name').textContent;
        const artistName = firstSong.querySelector('.song-artist').textContent;
        const imgSrc = firstSong.querySelector('.song-img').src;
        
        // Set initial now playing
        updateNowPlaying(songName, artistName, imgSrc);
    }
});




