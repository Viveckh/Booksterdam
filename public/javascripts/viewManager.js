//To make the uneven thumbnails even in size
$(window).load(function() {
    $('.thumbnail').matchHeight();
});

// Do something on HTML Change
$(document).bind("DOMSubtreeModified", function() {
    //console.log("New code generated");
});

/*
// Detect key presses throughout the page
$(document).keypress(function(e) {
    console.log(e.which);
});
*/

//Retrieve the books that match when the user presses enter on search bar
$(document).ready(function() {
    $("#custom-searchBarText").keypress(function(e){
        //If user presses the Enter Key
        if (e.which == 13) {
            console.log("Enter pressed");
            var searchFor = $('#custom-searchBarText').val();

            // Make ajax call to update the view with search results
            $.ajax({
                url: '/searchresults',
                data: {searchFor: searchFor}
            })
                .done(function (data) {
                    $('#custom-shelves').html(data);
                    $('.thumbnail').matchHeight();
                    //console.log(data);
                });
            /*
            $.get('/searchresults', {searchFor: searchFor}, function() {
                console.log("Getting search results");
            });
            */
        }
    });
});