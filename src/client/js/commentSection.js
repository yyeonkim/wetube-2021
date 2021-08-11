const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll("#commentDelete");

const addComment = (text, id, avatar) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const profileImg = document.createElement("img");
  const div = document.createElement("div");
  const span = document.createElement("span");
  const deleteBtn = document.createElement("span");
  newComment.dataset.commentid = id;
  newComment.dataset.avatar = avatar;
  profileImg.src = `/${avatar}`;
  span.innerText = `${text}`;
  deleteBtn.innerText = "삭제";
  newComment.className = "video__comment";
  span.className = "comment__text";
  deleteBtn.className = "comment__delete";
  deleteBtn.id = "commentDelete";
  newComment.appendChild(profileImg);
  newComment.appendChild(div);
  div.appendChild(span);
  div.appendChild(deleteBtn);
  deleteBtn.addEventListener("click", handleDelete);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.videoid;
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

const handleDelete = async (event) => {
  console.log("Click delete");
  const comment = event.target.parentElement.parentElement;
  const commentId = comment.dataset.commentid;
  const videoId = videoContainer.dataset.videoid;
  console.log(comment);
  const response = await fetch(
    `/api/videos/${videoId}/comment/${commentId}/delete`,
    {
      method: "delete",
    }
  );
  if (response.status === 200) {
    comment.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtns) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}
