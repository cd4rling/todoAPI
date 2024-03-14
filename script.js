//reminder apikey=1219, uri=https://fewd-todolist-api.onrender.com/

$(document).ready(function() {
    $('.btn-subtle-border').click(function() {
        $('.btn-subtle-border').removeClass('active');
        $(this).addClass('active');
    });

    //GET request function to load the most recent list
    var getRequest = function() {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var items = JSON.parse(httpRequest.responseText)["tasks"];
                    console.log(items);
                    // Clear the existing items in the list before appending new ones
                    $("#items").empty();
                    // Iterate over items and append them to the list
                    $.each(items, function(index, item) {
                        var actButton = $("<button class='btn-icon btn-check'><i class='far fa-circle'></i></button>");
                        var compButton = $("<button class='btn-icon btn-check'><i class='far fa-check-circle'></i></button>");
                        var checkButton;
                        var delButton = $("<button class='btn-icon btn-delete'><i class='fa-solid fa-circle-minus'></i></button>");
                        if (item.complete) {
                            checkButton = compButton;
                        } else {
                            checkButton = actButton;
                        }
                        var newItem = item.content;
                        var newCreated = item.created_at;
                        var newID = item.id;
                        var htmlText = "<div class='row'><div class='col-xs-1'>" + 
                            checkButton.prop('outerHTML') + "</div><div class='col-xs-5'>" + 
                            newItem + "</div><div class='col-xs-5'>" + 
                            newCreated + "</div><div class='col-xs-1'>" + 
                            delButton.prop('outerHTML') + "</div>" + 
                            "<div class='hidden' data-item-id='" + newID + "'></div>" +
                            "</div>";

                        $("#items").append(htmlText);
                    });
                } else {
                    console.log(httpRequest.statusText);
                }
            }
        }
        httpRequest.onerror = function() {
            console.log(httpRequest.statusText);
        }

        httpRequest.open('GET', 'https://fewd-todolist-api.onrender.com/tasks?api_key=1219');
        httpRequest.send();
    };
    //initial GET request on page load
    getRequest();

    //add new item on click
    $("#add-button").click(function() {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var items = JSON.parse(httpRequest.responseText)["tasks"];
                    console.log(items);
                    $("#todo-input").val("");
                    getRequest(); //pull the updated list
                } else {
                    console.log(httpRequest.statusText);
                }
            }
        }
        httpRequest.onerror = function() {
            console.log(httpRequest.statusText);
        }
        httpRequest.open('POST', 'https://fewd-todolist-api.onrender.com/tasks?api_key=1219');
        httpRequest.setRequestHeader("Content-Type", "application/json");
        var contentItem = $("#todo-input").val();
        httpRequest.send(JSON.stringify({
            task: {
                content: contentItem
            }
        }));
    });

    //mark item complete, toggle icon

    //delete item
    // Add event listener for delete buttons after they are created
    $(document).on("click", ".btn-delete", function() {
        var itemId = $(this).closest('.row').find('.hidden').data('item-id');
        deleteItem(itemId);
    });

    function deleteItem(itemId) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
            getRequest();
            } else {
            console.log(httpRequest.statusText);
            }
        }
        }
        httpRequest.onerror = function() {
        console.log(httpRequest.statusText);
        }
        httpRequest.open('DELETE', 'https://fewd-todolist-api.onrender.com/tasks/' + itemId + '?api_key=1219');
        httpRequest.send();
    }

    //filter list to all
    $("#all-button").click(function() {
        // Filter list to all
    });

    //filter list to active
    $("#active-button").click(function() {
        // Filter list to active
    });

    //filter list to completed
    $("#completed-button").click(function() {
        // Filter list to completed
    });

    $("#todo-input").keypress(function(event) {
        if (event.which === 13) { // Check if Enter key is pressed
            $("#add-button").click(); // Trigger click event on add button
        }
    });
});
