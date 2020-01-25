// Retrieving all articles to display them on the DOM
$.getJSON("/articles",data => {
    for (let index = 0; index < data.length; index++) {
        // Creating a card for each article to show
        $("#articles").append(`<div class="card" data-id="${data[index]._id}" data-toggle="modal" data-target="#commentsModal">
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
    // Savind the id of the clicked element
    let id = $(this).attr("data-id");
    // Deleting everything from the modal
    $(".modal-body").empty();
    // Setting an id to the modal for future use
    $("#commentsModal").attr("data-id",id);

    $.ajax({
        method: "GET",
        url: "/articles/" + id
    })
    .then(data => {
        // Displaying the title of the comment
        $(".modal-body").append(`<h4> ${data.title} </h4>`);
        // Text input for a new title
        $(".modal-body").append(`<h5>Add a new comment</h5>`);
        $(".modal-body").append(`<input type="text" id ="titleInput" name="title" class="form-control"><br>`);
        // Text area for comment body
        $(".modal-body").append(`<textarea id="bodyInput" name="body" class="form-control"></textarea>`);

        if(data.note){
            data.note.forEach(element => {
                $(".modal-body").append(`<div class="card" data-id="${element._id}">
                                            <div class="card-body">
                                                <h5 class="card-title">${element.title}</h5>
                                                <p class="card-text">
                                                ${element.body}
                                                </p>
                                            </div>
                                        </div>`);
            });
        }
    });
});

$(document).on("click", "#saveComment", function(){
    // Grabbing the id of the modal
    let thisId = $("#commentsModal").attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleInput").val().trim(),
            body: $("#bodyInput").val().trim()
        }
    })
    .then(data => {
        console.log(data);
    });
    // Cleaning the comment inputs
    $("#titleInput").val("");
    $("#bodyInput").val("");
})