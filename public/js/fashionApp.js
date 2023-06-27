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

let addWatchButtonListener = () => {
    $(".watch-button").click(event => {
        let $button = $(event.target),
            productId = $button.data("id");
        $.get(`/api/products/${productId}/watch`, (results = {}) => {
            let data = results.data;
            if (data && data.success) {
                $button
                    .text("Watching")
                    .addClass("watched-button")
                    .removeClass("watch-button");
            } else {
                $button.text("Try again");
            }
        });
    });
};