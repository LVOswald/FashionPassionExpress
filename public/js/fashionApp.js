$(document).ready(() => {
    $("#modal-button").click(() => {
        $(".modal-body").html('');
        $.get("/api/products", (results = {}) => {
            let data = results.data;
            if (!data || !data.products) return;
            data.products.forEach((product) => {
                $(".modal-body").append(
                    `<div>
<span class="product-title">
${product.title}
</span>
<button class='watch-button ${product.watched ? "watched-button" : "watch-button"}' data-id="${product._id}">
${product.watched ? "Watched" : "Watch"}
</button>
<div class="product-description">
${product.description}
</div>
</div>`
                );
            });
        }).then(() => {
            addWatchButtonListener();
        });
    });
});

const socket = io();
$("#chatForm").submit(() => {
    let text = $("#chat-input").val(),
        userName = $("#chat-user-name").val(),
        userId = $("#chat-user-id").val();
    socket.emit("message", {
        content: text,
        userName: userName,
        userId: userId
    });
    $("#chat_input").val("");
    return false;
});
socket.on("load all messages", (data) => {
    data.forEach(message => {
        displayMessage(message);
    });
});
socket.on("message", (message) => {
    displayMessage(message);
    for (let i = 0; i < 2; i++) {
        $(".chat-icon").fadeOut(200).fadeIn(200);
    }
});
socket.on("user disconnected", () => {
    displayMessage({
        userName: "Notice",
        content: "User left the chat"
    });
});
let displayMessage = (message) => {
    $("#chat").prepend($("<li>").html(`
<strong class="message ${getCurrentUserClass(message.user )}">
${message.userName}
</strong>: ${message.content}
`));

};
let getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return userId === id ? "current-user": "";
};
let addWatchButtonListener = () => {
    $(".watch-button").click(event => {
        let $button = $(event.target),
            productId = $button.data("id");

        $.ajax({
            url: `/api/products/${productId}/watch`,
            type: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            success: (results = {}) => {
                let data = results.data;
                if (data && data.success) {
                    $button
                        .text("Watching")
                        .addClass("watched-button")
                        .removeClass("watch-button");
                } else {
                    $button.text("Try again");
                }
            }
        });
    });
};