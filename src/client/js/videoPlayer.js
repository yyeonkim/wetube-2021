const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handlePause = (e) => (playBtn.innerText = "Play");
const handlePlay = (e) => (playBtn.innerText = "Pause");

const handleMute = (e) => {
  // 비디오 소리가 나면 음소거,
  // 아니면 소리가 나게 한다
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
