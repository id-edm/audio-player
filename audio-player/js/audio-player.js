import { audioTracks } from "./audio.js"

function initAudioPlayer() {
	const coverImg = document.querySelector(".cover__img");
	const backgroundImg = document.querySelector(".background");
	const artist = document.querySelector(".artist");
	const trackTitle = document.querySelector(".track__title");
	const prevBtn = document.querySelector(".prev__btn");
	const nextBtn = document.querySelector(".next__btn");
	const playBtn = document.querySelector(".play__btn");
	const pauseBtn = document.querySelector(".pause__btn");
	const progressBar = document.querySelector(".progress__bar-range");
	const currentTime = document.querySelector(".current__time");
	const durationTime = document.querySelector(".duration__time");
    const shuffleBtn = document.querySelector(".shuffle__btn");
    const repeatBtn = document.querySelector(".repeat__btn");

	let currentTrack = 0;
	let isPlay = false;
    let isShuffle = false;
    let isRepeat = false;
	let shuffledTracks = [];
	const tracks = audioTracks.tracks;
	let audio = new Audio(tracks[currentTrack].track);

	audio.addEventListener("loadedmetadata", () => {
		progressBar.max = audio.duration
		durationTime.textContent = formatTime(audio.duration)
		currentTime.textContent = formatTime(0)
		progressBar.value = 0
	});

	function updateTrackInfo() {
		if (!tracks.length) return
		const track = isShuffle ? shuffledTracks[currentTrack] : tracks[currentTrack];
		
		coverImg.src = track.cover
		artist.textContent = track.artist
		trackTitle.textContent = track.title
		audio.src = track.track
        updateTrackBackground(track.background)
	};

	function updateTrackBackground(imageUrl) {
		if (backgroundImg) {
			backgroundImg.style.backgroundImage = `url(${imageUrl})`
		}
	};

	function togglePlayPause() {
		if (isPlay) {
			audio.pause()
			coverImg.classList.remove("scale")
		} else {
			audio.play()
			coverImg.classList.add("scale")
		}
		isPlay = !isPlay
		togglePlayPauseBtn()
	};

	function togglePlayPauseBtn() {
		playBtn.classList.toggle("hidden", isPlay)
		pauseBtn.classList.toggle("hidden", !isPlay)
	};

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60)
		const sec = Math.floor(seconds % 60)
			.toString()
			.padStart(2, "0")
		return `${minutes}:${sec}`
	};

	function updateProgress() {
		if (audio.duration) {
			progressBar.value = audio.currentTime
			currentTime.textContent = formatTime(audio.currentTime)
		}
	};

	function shuffleTracks() {
		shuffledTracks = tracks.slice()
		for (let i = shuffledTracks.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
            [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j],shuffledTracks[i]]
		}
	};

	function toggleShuffleRepeat(type) {
        if (type === "shuffle") {
            isShuffle = !isShuffle;
            if (isShuffle) {
                shuffleTracks();
                console.log(shuffledTracks)
                currentTrack = 0;
                shuffleBtn.classList.add("active");
            } else {
                shuffleBtn.classList.remove("active");
            }
        } else if (type === "repeat") {
            isRepeat = !isRepeat;
            repeatBtn.classList.toggle("active", isRepeat);
        }
    }

	function changeTrack(direction) {
		const trackList = isShuffle ? shuffledTracks : tracks
		currentTrack =
			(currentTrack + direction + trackList.length) % trackList.length
		updateTrackInfo()
		audio.src = trackList[currentTrack].track
		if (isPlay) {
			audio.play()
		}
	};

	audio.addEventListener("ended", () => {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            changeTrack(1); 
        }
    });

    shuffleBtn.addEventListener("click", () => toggleShuffleRepeat("shuffle"));
    repeatBtn.addEventListener("click", () => toggleShuffleRepeat("repeat"));
	playBtn.addEventListener("click", togglePlayPause)
	pauseBtn.addEventListener("click", togglePlayPause)

	document.addEventListener("keydown", e => {
		if (e.code === "Space") {
			e.preventDefault()
			togglePlayPause()
		}
	});

	nextBtn.addEventListener("click", () => changeTrack(1))
	prevBtn.addEventListener("click", () => changeTrack(-1))

	progressBar.addEventListener("input", () => {
		if (audio.duration) {
			audio.currentTime = progressBar.value
		}
	});

	audio.addEventListener("timeupdate", updateProgress)

	updateTrackInfo()
};

export { initAudioPlayer }
