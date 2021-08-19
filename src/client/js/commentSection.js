const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll("#commentDelete");
const editBtns = document.querySelectorAll("#commentEdit");

const addComment = (comment) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const imgA = document.createElement("a");
  const usernameA = document.createElement("a");
  const profileImg = document.createElement("img");
  const div = document.createElement("div");
  const nameSpan = document.createElement("span");
  const textSpan = document.createElement("span");
  const deleteBtn = document.createElement("span");
  newComment.dataset.commentid = comment._id;
  newComment.dataset.avatar = comment.owner.avatarUrl;
  profileImg.src = `/${comment.owner.avatarUrl}`;
  textSpan.innerText = `${comment.text}`;
  nameSpan.innerText = `${comment.owner.username}`;
  deleteBtn.innerText = "삭제";
  newComment.className = "video__comment";
  textSpan.className = "comment__text";
  nameSpan.className = "comment__name";
  deleteBtn.className = "comment__delete";
  deleteBtn.id = "commentDelete";
  imgA.href = `/users/${comment.owner._id}`;
  usernameA.href = `/users/${comment.owner._id}`;
  imgA.appendChild(profileImg);
  usernameA.appendChild(nameSpan);
  newComment.appendChild(imgA);
  newComment.appendChild(div);
  div.appendChild(usernameA);
  div.appendChild(textSpan);
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
    const comment = await response.json();
    textarea.value = "";
    addComment(comment);
  }
};

const handleDelete = async (event) => {
  const comment = event.target.parentElement.parentElement;
  const commentId = comment.dataset.commentid;
  const videoId = videoContainer.dataset.videoid;
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

const handleEdit = async (event) => {
  const text = document.getElementById("commentText");
  // textarea 만들어서 새로운 값 text 받아내기

  const comment = event.target.parentElement.parentElement;
  const commentId = comment.dataset.commentid;
  const videoId = videoContainer.dataset.videoid;
  const response = await fetch(
    `/api/videos/${videoId}/comment/${commentId}/edit`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );
  if (response.status === 200) {
    // 새 text로 comment 보이기
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

if (editBtns) {
  editBtns.forEach((btn) => {
    btn.addEventListener("click", handleEdit);
  });
}
