var book_title;
var book_subtitle;

//To make the uneven thumbnails even in size
$(window).load(function() {
    $('.custom-dash-block').matchHeight();
});

$(document).ready(function () {
    // Initialize the state when client logs in and they are directed to the profile
    initialState();
    

    // If the nav bar is clicked, it changes the active state and then shows the content that is clicked (Single page app)
    $('.navbar-nav').on('click','li', function () {
        initialState();
        var listID = $(this).data('id');
        
        clearActiveNavBar();
        
        $(this).addClass('active');
        $('#'+listID).slideDown('slow', function() {
            $('.custom-dash-block').matchHeight();
        });
        
    });
    
    console.log("Mummy bhayo!");
    populateAddBookForm();
});


//Book API Parse
/*
var parseBookDetails = require('xml2js').parseString;
var xml = '';
parseString(xml, function(err, result) {
    
});
*/

function populateAddBookForm() {
    //var book_isbn = document.getElementById("book_isbn");
    bookURL = "https://www.googleapis.com/books/v1/volumes?q=isbn\:" + "0132569035";
    var encodedBookURL = encodeURI(bookURL);
    console.log("Encoded URL: " + encodedBookURL);
    
    $.getJSON(encodedBookURL, function() {
        console.log("Parsing JSON File");
    })
    .done(function(data) {
        if (typeof (data.items[0]) != "undefined") {
            book_title = data.items[0].volumeInfo.title;
            book_subtitle = data.items[0].volumeInfo.subtitle;
            console.log("book title: " + book_title);
            console.log("book subtitle: " + book_subtitle);
            /*REST OF THE FIELDS CAN BE POPULATED HERE LIKE AUTHOR, PUBLISHER, BOOK DESCRIPTION ETC
            JUST FOLLOW THE LINK ABOVE FOR 'BOOKURL' TO SEE A SAMPLE JSON FILE TO BE PARSED
            THE VALUES RETRIEVED CAN THEN BE POPULATED TO THE CORRESPONDING FORM FIELDS.
            Oh Yeahhh Baby! That's right! You heard me.
            */
        }
        else {
            console.log("ISBN not found");
        }
    })
    .fail(function(data) {
        console.error("Couldn't parse!");
    });
};

// END OF BOOK API

// Clears the navigation bar data
function clearActiveNavBar() {
    var navList = $('.navbar-nav').children();
    
    $.each(navList, function (index,data) {
           $(this).removeClass('active');
    })
};

//
function initialState() {
    mark(false,false,false);
}

function mark(orders, stuffs, addItem) {
    orders ? $('#orders').slideDown('slow') : $('#orders').hide();
    stuffs ? $('#postings').slideDown('slow') : $('#postings').hide();
    addItem ? $('#addItem').slideDown('slow') : $('#addItem').hide();
}