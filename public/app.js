// Retrieving all articles to display them on the DOM
$.getJSON("/articles",data => {
    for (let index = 0; index < data.length; index++) {
        // Creating a card for each article to show
        $("#articles").append(`<div class="card" data-id="${data[index]._id}" data-toggle="modal" data-target="#exampleModal">
                                    <div class="card-body">
                                        <h5 class="card-title">${data[index].title}</h5>
                                        <p class="card-text">
                                        <a href="${data[index].link}" target="_blank"> ${data[index].link} </a>
                                        </p>
                                    </div>
                                </div>`);
    }
});

$(document).on("click", ".card",function() {
    let id = $(this).attr("data-id");
    // alert(`Card with id: ${id} clicked`);
});
