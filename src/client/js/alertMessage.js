const { async } = require("regenerator-runtime");

const deleteBtn = document.getElementById("deleteBtn");

const handleClick = async () => {
  const deleteRes = confirm(
    "탈퇴할 경우 영상과 댓글이 모두 삭제됩니다.\n탈퇴하시겠습니까?"
  );
  if (deleteRes) {
    const response = await fetch("/api/users/delete", { method: "delete" });
    if (response.status === 201) {
      alert("탈퇴가 완료되었습니다.");
      location.href = "https://wetubecc.herokuapp.com/"; // homepage
    }
  }
};

deleteBtn.addEventListener("click", handleClick);
