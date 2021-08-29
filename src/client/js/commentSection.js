import { async } from "regenerator-runtime";

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
  const editBtn = document.createElement("span");
  newComment.dataset.commentid = comment._id;
  newComment.dataset.avatar = comment.owner.avatarUrl;
  profileImg.src = comment.owner.avatarUrl;
  textSpan.innerText = comment.text;
  nameSpan.innerText = comment.owner.username;
  deleteBtn.innerText = "삭제";
  editBtn.innerText = "수정";
  newComment.className = "video__comment";
  div.className = "comment__info";
  textSpan.className = "comment__text";
  nameSpan.className = "comment__name";
  deleteBtn.className = "comment__delete";
  deleteBtn.id = "commentDelete";
  editBtn.className = "comment__edit";
  editBtn.id = "commentEdit";
  imgA.href = `/users/${comment.owner._id}`;
  usernameA.href = `/users/${comment.owner._id}`;
  imgA.appendChild(profileImg);
  usernameA.appendChild(nameSpan);
  newComment.appendChild(imgA);
  newComment.appendChild(div);
  div.appendChild(usernameA);
  div.appendChild(textSpan);
  div.appendChild(deleteBtn);
  div.appendChild(editBtn);
  deleteBtn.addEventListener("click", handleDelete);
  editBtn.addEventListener("click", handleEdit);
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

const handleEdit = (event) => {
  const commentInfo = event.target.parentElement;
  const commentText = commentInfo.children[1];
  let text = commentText.innerText;
  const newForm = document.createElement("form");
  const textarea = document.createElement("textarea");
  const button = document.createElement("button");
  const editBtn = event.target;
  newForm.classList = "comment__form";
  button.innerText = "등록";
  commentText.remove();
  newForm.appendChild(textarea);
  newForm.appendChild(button);
  commentInfo.insertBefore(newForm, commentInfo.children[1]);
  textarea.value = text;
  editBtn.innerText = "취소";

  // 댓글 수정 취소
  const insertComment = () => {
    const span = document.createElement("span");
    span.className = "comment__text";
    span.innerText = text;
    newForm.remove();
    commentInfo.insertBefore(span, commentInfo.children[1]);
    editBtn.innerText = "수정";
    editBtn.removeEventListener("click", insertComment);
    editBtn.addEventListener("click", handleEdit);
  };
  editBtn.removeEventListener("click", handleEdit);
  editBtn.addEventListener("click", insertComment);

  // 수정 댓글 등록
  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    const comment = event.target.parentElement.parentElement;
    const commentId = comment.dataset.commentid;
    const videoId = videoContainer.dataset.videoid;
    text = textarea.value;
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
    if (response.status === 201) {
      text = await response.json();
      insertComment();
    }
  };
  newForm.addEventListener("submit", handleSubmitEdit);
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
