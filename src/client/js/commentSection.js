const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id, avatar) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const profileImg = document.createElement("img");
  const div = document.createElement("div");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  newComment.dataset.commentId = id;
  newComment.dataset.avatar = avatar;
  profileImg.src = `/${avatar}`;
  span.innerText = `${text}`;
  span2.innerText = "삭제";
  newComment.className = "video__comment";
  span.className = "comment__text";
  span2.className = "comment__delete";
  newComment.appendChild(profileImg);
  newComment.appendChild(div);
  div.appendChild(span);
  div.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId, commentAvatar } = await response.json();
    textarea.value = "";
    addComment(text, newCommentId, commentAvatar);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
