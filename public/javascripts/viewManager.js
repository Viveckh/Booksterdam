//To make the uneven thumbnails even in size
$(window).load(function() {
    $('.thumbnail').matchHeight();
});

/*
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
        }
    });
});