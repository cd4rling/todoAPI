//reminder apikey=1219, uri=https://fewd-todolist-api.onrender.com/

$(document).ready(function() {
    $('.btn-subtle-border').click(function() {
        $('.btn-subtle-border').removeClass('active');
        $(this).addClass('active');
    });

    var httpRequest = new XMLHttpRequest();

    //GET request function to load the most recent list
    var getRequest = function() {
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
                        var complete;
                        if (item.completed) {
                            checkButton = compButton;
                            complete = true;
                        } else {
                            checkButton = actButton;
                            complete = false;
                        }

                        var newCreated = item.created_at;
                        var newID = item.id;

                        var newItem = $("<div class='col-xs-5' id=" + newID + ">" + item.content + "</div>");
                        if (complete) {
                            newItem.addClass('completed');
                        }

                        var htmlText = "<div class='row rowitem'><div class='col-xs-1'>" + 
                            checkButton.prop('outerHTML') + "</div>" + 
                            newItem.prop('outerHTML') + "<div class='col-xs-5'>" + 
                            newCreated + "</div><div class='col-xs-1'>" + 
                            delButton.prop('outerHTML') + 
                            "</div><div class='hidden' data-item-id='" + newID + "' data-complete='" + complete + "'></div>" +
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
        var contentItem = $("#todo-input").val();
        httpRequest = new XMLHttpRequest();
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
        httpRequest.send(JSON.stringify({
            task: {
                content: contentItem
            }
        }));
    });

    //mark item complete/active, toggle icon
    $(document).on("click", ".btn-check", function() {
        var itemId = $(this).closest('.row').find('.hidden').data('item-id');
        var elemId = "#" + itemId;
        console.log(itemId, elemId);
        var complete = $(this).closest('.row').find('.hidden').data('complete');
        console.log(complete);
        if(complete) {
            $(elemId).css('text-decoration', 'none');
        } else {
            $(elemId).css('text-decoration', 'line-through');
        }
        toggleActive(itemId, complete);
    });

    function toggleActive(itemId, complete) {
        httpRequest = new XMLHttpRequest();
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
        var endpoint = complete ? 'mark_active' : 'mark_complete';
        httpRequest.open('PUT', 'https://fewd-todolist-api.onrender.com/tasks/' + itemId + '/' + endpoint + '?api_key=1219');
        httpRequest.send();
    }


    //delete item
    // Add event listener for delete buttons after they are created
    $(document).on("click", ".btn-delete", function() {
        var itemId = $(this).closest('.row').find('.hidden').data('item-id');
        deleteItem(itemId);
    });

    function deleteItem(itemId) {
        httpRequest = new XMLHttpRequest();
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

    //show all
    $("#all-button").click(function() {
        $(".row").each(function(){
            $(this).show();
        });
    });

    //filter list to active
    $("#active-button").click(function() {
        $(".rowitem").each(function() {
            var isCompleted = $(this).find('.hidden').data('complete');
            if (isCompleted) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });

    //filter list to completed
    $("#completed-button").click(function() {
        $(".rowitem").each(function() {
            var isCompleted = $(this).find('.hidden').data('complete');
            if (isCompleted) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $("#deleteAll-button").click(function() {
        $(".btn-delete").each(function() {
            var itemId = $(this).closest('.row').find('.hidden').data('item-id');
            deleteItem(itemId);
        });
    });
    

    $("#todo-input").keypress(function(event) {
        if (event.which === 13) { // Check if Enter key is pressed
            $("#add-button").click(); // Trigger click event on add button
        }
    });
});
