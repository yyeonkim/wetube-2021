import { async } from "regenerator-runtime";
import getBlobDuration from "get-blob-duration";

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreenBtn");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let volumeValue = 0.8;

video.volume = volumeValue;
video.play();

const handlePlayClick = async () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.classList = video.muted
    ? "fas fa-volume-mute fa-lg"
    : "fas fa-volume-down fa-lg";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleShowVolume = () => {
  volumeRange.classList = "showing";
};

const handleLeaveControls = () => {
  if (volumeRange.classList.value === "showing") {
    volumeRange.classList = "hidden";
    setTimeout(() => {
      volumeRange.classList.remove("hidden");
    }, 300);
  }
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) => {
  let time = new Date(seconds * 1000).toISOString().substr(11, 8);
  if (time[1] === "0") {
    time = time.substr(3, 5);
  }
  if (time[0] === "0") {
    time = time.substr(1, 4);
  }
  return time;
};

const setTotalTime = async () => {
  const duration = await getBlobDuration(video.src);
  totalTime.innerText = formatTime(Math.floor(duration));
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.max = Math.floor(duration);
};
setTotalTime();
/*
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.max = Math.floor(video.duration);
};
*/

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(video.currentTime);
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtn.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtn.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
  }
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  hideControls();
};

const handleEnded = () => {
  playBtn.classList = "fas fa-redo";
  playBtn.addEventListener("click", handlePlayClick);
  const { videoid } = videoContainer.dataset;
  fetch(`/api/videos/${videoid}/view`, {
    method: "post",
  });
};

const handleVideoClick = () => {
  handlePlayClick();
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
muteBtn.addEventListener("mousemove", handleShowVolume);
volumeRange.addEventListener("input", handleVolumeChange);
//video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("click", handleVideoClick);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
videoControls.addEventListener("mouseleave", handleLeaveControls);
