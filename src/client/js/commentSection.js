import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".youngjin")


const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul")
    const newComment = document.createElement("li")
    newComment.dataset.id = id;
    newComment.className = "video__comment"
    const icon = document.createElement("i")
    icon.className = "fas fa-comment"
    const span = document.createElement("span")
    span.innerText = ` ${text}`
    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "🧡"
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(deleteBtn);
    videoComments.prepend(newComment);
}


const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value
    const videoId = videoContainer.dataset.id;
    if(text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({text}),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
        location.reload();
    }
};

const handleDelete = async (event) => {
    event.preventDefault();
    const videoId = videoContainer.dataset.id;
    const commentId = event.target.parentElement.dataset.id
    const commentList = event.target.parentElement
    const response = await fetch(`/api/comments/${commentId}/${videoId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "DELETE",
    });
    if (response.status === 200) {
        console.log(commentList)
        commentList.remove();
    }
};

deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDelete);
});

if (form) {
    form.addEventListener("submit", handleSubmit);
}
