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

$(document).ready(function() {
    
    //Reload the home page from scratch everytime the brand logo is clicked
    $('.navbar-brand').on("click", function() {
        window.location.href='/index';
    });

    //Display suggestions as user types, and retrieve the books that match when the user presses enter on search bar..
    $("#custom-searchBarText").keyup(function(e){

        //Option 1: If user presses the Enter Key, directly display the results
        if (e.which == 13) {
            //console.log("Enter pressed");
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

        //Option 2: If user is casually typing, display suggestions
        else {
            var searchFor = $('#custom-searchBarText').val();

            // Make ajax call to receive potential book suggestions from database, make sure there is no repetition
            $.ajax({
                url: '/searchsuggestions',
                data: {searchFor: searchFor}
            })
                .done(function (data) {
                    //console.log(data.items['1000000005'].author);

                    //Organize all the retrieved items in a dropdown array
                    var dropdown = [];
                    var results = data.items
                    for (var suggestion in results) {
                        var tempobj = {isbn: results[suggestion].isbn, label: results[suggestion].title, author: results[suggestion].author};
                        //Insert it into the array only if it hasn't already been inserted before
                        if (!dropdown.find(function(obj) {return obj.isbn == tempobj.isbn;})) {
                            dropdown.push(tempobj); //label is the key that gets printed
                        }
                    }

                    //Use the array organized above and display the book suggestions in dropdown
                    //Since it is autocomplete, it won't display suggestions that don't contain the typed string within book title; so if user types author name, it's likely nothing will pop up
                    $("#custom-searchBarText").autocomplete({
                        source: dropdown,
                        select: function(event, ui) {
                            $('#custom-searchBarText').val(ui.item.isbn); //default behavior of autocomplete anyway
                            //Simulate an enter press to display results;
                            var e = jQuery.Event("keyup")   //using keyup here, because the search display is triggered when human releases the enter key
                            e.which = 13;
                            $('#custom-searchBarText').trigger(e);
                        }
                    });
                });
        } 
    });

    $('#custom-signupBtn').on('click', function() {
        window.location.href='/signup';
    });

    // Set login form validation rules using the Jquery validation plugin
    $('#loginForm').validate({
        rules: {
            loginEmail: "required",
            loginPassword: "required"
        },
        messages: {
            loginEmail: "Required",
            loginPassword: "Required"
        },
        submitHandler: function(form) {
            $.ajax({
                type: 'POST',
                url: '/login',
                data: $(form).serialize()
            })
                .done(function (response) {
                    console.log(response);
                    //If the response is an object with a redirect key, do the redirection, it means it's a success
                    if (typeof response.redirect == 'string') {
                        window.location = response.redirect;
                    }
                    //Else login was a fail, so clear the form
                    else {
                        $('#loginForm').trigger("reset");
                        //reset focus to email field
                        $( "#loginEmail").focus();
                    }
                    
                });
            return false;
        }
    });

    //Logout button click
    $('#logoutSubmit').on('click', function() {
        $.ajax({
                type: 'POST',
                url: '/logout',
            })
                .done(function (response) {
                    console.log(response);
                    //If the response is an object with a redirect key, do the redirection, it means it's a success
                    if (typeof response.redirect == 'string') {
                        window.location = response.redirect;
                    }                    
                });
    });
});