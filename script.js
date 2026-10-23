
window.onload = function () {
    // PAGE ELEMENTS
    var welcome = document.getElementById("welcome");
    var noPage = document.getElementById("no-page");
    var birthday = document.getElementById("birthday");
    var gift = document.getElementById("gift");
    var memories = document.getElementById("memories");
    var letter = document.getElementById("letter");

    // BUTTONS
    var yesButton = document.getElementById("yes");
    var noButton = document.getElementById("no");
    var backButton = document.getElementById("back");
    var openButton = document.getElementById("open");
    var closeButton = document.getElementById("close");

    // MUSIC PLAYER ELEMENTS
    var song = document.getElementById("birthdaySong");
    var playPause = document.getElementById("playPause");
    var progress = document.getElementById("progress");
    var currentTime = document.getElementById("currentTime");
    var duration = document.getElementById("duration");
    var volume = document.getElementById("volume");
    var playerStatus = document.getElementById("playerStatus");

    // WELCOME: YES
    yesButton.onclick = function () {
        welcome.classList.add("hidden");
        noPage.classList.add("hidden");

        birthday.classList.remove("hidden");
        gift.classList.remove("hidden");
        memories.classList.remove("hidden");

        birthday.scrollIntoView();
    };

    // WELCOME: NO
    noButton.onclick = function () {
        welcome.classList.add("hidden");
        noPage.classList.remove("hidden");
    };

    // BACK TO WELCOME
    backButton.onclick = function () {
        noPage.classList.add("hidden");
        welcome.classList.remove("hidden");

        welcome.scrollIntoView();
    };

    // OPEN LETTER
    openButton.onclick = function () {
        letter.classList.remove("hidden");
    };

    // CLOSE LETTER
    function closeLetter() {
        letter.classList.add("hidden");
    }

    closeButton.onclick = closeLetter;

    letter.onclick = function (event) {
        if (event.target === letter) {
            closeLetter();
        }
    };

    document.onkeydown = function (event) {
        if (event.key === "Escape") {
            closeLetter();
        }
    };

    // FORMAT SONG TIME
    function formatTime(seconds) {
        if (!isFinite(seconds)) {
            return "0:00";
        }

        var minutes = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);

        return minutes + ":" + (secs < 10 ? "0" : "") + secs;
    }

    // UPDATE PLAY BUTTON
    function updatePlayButton(isPlaying) {
        playPause.innerHTML = isPlaying ? "Ⅱ" : "▶";

        playPause.setAttribute(
            "aria-label",
            isPlaying ? "Pause song" : "Play song"
        );
    }

    // PLAYBACK STATUS
    song.addEventListener("loadstart", function () {
        playerStatus.textContent = "♡ LOADING SONG ♡";
    });

    song.addEventListener("loadedmetadata", function () {
        duration.textContent = formatTime(song.duration);
        playerStatus.textContent = "♡ READY TO PLAY ♡";
    });

    song.addEventListener("canplay", function () {
        playerStatus.textContent = "♡ READY TO PLAY ♡";
    });

    // PLAY OR PAUSE
    playPause.onclick = function () {
        if (song.paused) {
            playerStatus.textContent = "♡ LOADING SONG ♡";

            var playRequest = song.play();

            if (playRequest && playRequest.catch) {
                playRequest.catch(function () {
                    playerStatus.textContent =
                        "♡ CANNOT PLAY — CHECK AUDIO FILE ♡";
                });
            }
        } else {
            song.pause();
        }
    };

    // SONG STARTS
    song.addEventListener("play", function () {
        updatePlayButton(true);
        playerStatus.textContent = "♡ PLAYING ♡";
    });

    // SONG PAUSES
    song.addEventListener("pause", function () {
        updatePlayButton(false);

        if (!song.ended && !song.error) {
            playerStatus.textContent = "♡ PAUSED ♡";
        }
    });

    // SONG ENDS
    song.addEventListener("ended", function () {
        updatePlayButton(false);
        progress.value = 0;
        currentTime.textContent = "0:00";
        playerStatus.textContent = "♡ SONG FINISHED ♡";
    });

    // AUDIO ERROR
    song.addEventListener("error", function () {
        updatePlayButton(false);
        playerStatus.textContent =
            "♡ AUDIO NOT FOUND — CHECK FILE PATH ♡";
    });

    // UPDATE PLAYBACK TIME
    song.addEventListener("timeupdate", function () {
        currentTime.textContent = formatTime(song.currentTime);

        if (isFinite(song.duration) && song.duration > 0) {
            progress.value =
                (song.currentTime / song.duration) * 100;
        }
    });

    // SEEK THROUGH SONG
    progress.oninput = function () {
        if (isFinite(song.duration) && song.duration > 0) {
            song.currentTime =
                (Number(progress.value) / 100) * song.duration;
        }
    };

    // VOLUME CONTROL
    volume.oninput = function () {
        song.volume = Number(volume.value);
    };

    // INITIAL SETTINGS
    song.volume = 0.8;
    song.load();
};
