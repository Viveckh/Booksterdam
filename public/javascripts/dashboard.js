var isbndb_API_KEY = "U68SN2O7";

//To make the uneven thumbnails even in size
$(window).load(function() {
    $('.custom-dash-block').matchHeight();
});

$(document).ready(function () {
    // Initialize the state when client logs in and they are directed to the profile
    initialState();
    $('#autoPopulatedPostingDetails').hide();

    // If the nav bar is clicked, it changes the active state and then shows the content that is clicked (Single page app)
    $('.navbar-nav').on('click','li', function () {
        initialState();
        var listID = $(this).data('id');
        
        clearActiveNavBar();
        
        $(this).addClass('active');
        $('#'+listID).slideDown('slow', function() {
            $('.custom-dash-block').matchHeight();
            //To clear previous alert messages generated while adding an item
            $('#alertbox').html('');
        });
        
    });

    //Validate the posting form
    $('#posting').validate({
        rules: {
            itemISBN: {
                required: true,
                minlength: 13,
                maxlength: 13
            },
            itemTitle: "required",
            itemAuthor: "required",
            itemSellerPrice: "required",
            itemSchool: "required",
            agreeToTerms: "required"
        },
        messages: {
            itemISBN: "Invalid ISBN",
            itemTitle: "Info not found on record!",
            itemAuthor: "Info not found on record!",
            itemSellerPrice: "Required",
            itemSchool: "Required",
            agreeToTerms: "Required "
        },
        submitHandler: function(form) {
            $.ajax({
                type: 'POST',
                url: '/addToShelf',
                data: $(form).serialize()
            })
                .done(function (msg) {
                    console.log(msg);
                    if (msg == "success") {
                        $('#clearInfo').trigger('click');
                        $("#alertbox").html("Item successfully added!");
                    }
                    else {
                        $("#alertbox").html(msg);
                        window.scrollTo(0, 0);
                    }
                });
            return false;
        }
    });

    //Populate the remaining form based on the provided ISBN
    $('#populateInfo').on('click', function() {
        if ($('#itemISBN').valid()) {
            $('#itemISBN').prop("readonly", true)
            populateBookInfo($('#itemISBN').val());
            $('#autoPopulatedPostingDetails').slideDown('slow', function(){
                $('.custom-dash-block').matchHeight();
            });
        }
    });
    
    //Clear the posting form
    $('#clearInfo').on('click', function() {
        $('#itemISBN').prop("readonly", false)
        $('#posting').trigger('reset');
        $('#autoPopulatedPostingDetails').hide(function(){
            $('.custom-dash-block').matchHeight();
        });
    });
});


//API Call to populate book info
function populateBookInfo(param){
    // Not using isbnDB due to having difficulty resolving the 'No Access-Control-Allow-Origin header is present on requested resource' error.
    //requestURL = "http://isbndb.com/api/v2/json/" + isbndb_API_KEY + "/books?q=" + param;
    var requestURL = "https://www.googleapis.com/books/v1/volumes?q=isbn\:" + param;
    //Necessary to enable 'Access-Control-Allow-Origin'
    var encodedBookURL = encodeURI(requestURL);
    //console.log(requestURL);

    var isbn13, title, author, edition, publisher, pages, marketPrice, imageURL;

    $.getJSON(encodedBookURL, function() {
        console.log("Parsing JSON File");
    })
    .done(function(data) {
        if (data.items) {
            isbn13 = data.items[0].volumeInfo.industryIdentifiers[1].identifier;
            title = data.items[0].volumeInfo.title;
            author = data.items[0].volumeInfo.authors.join(", "); //Since authors is an array
            //edition = data.items[0].volumeInfo.;
            publisher = data.items[0].volumeInfo.publisher;
            pages = data.items[0].volumeInfo.pageCount;

            // Image URL is retrieved from OpenLibrary.org
            imageURL = "http://covers.openlibrary.org/b/isbn/" + isbn13 + "-L.jpg?default=false";
            console.log(imageURL);

            //If image link is broken, set imageURL to the default 'Cover not found' URL
            // This part has issues to the  Access-Control-Allow-Origin header issue. See console.log for details
            urlExists(imageURL, function(status) {
                if (status === 404) {
                    imageURL = "http://d29ci68ykuu27r.cloudfront.net/images/new/no_image_available_large.gif";
                }
                $('#itemCover img').attr("src", imageURL);
                $('#itemImageUrl').val(imageURL);
                //console.log(imageURL);
            });
            //Setting form fields on the page
            $('#itemCover .caption').text("ISBN-13: "+ isbn13);

            if (data.items[0].saleInfo.listPrice) {
                marketPrice = data.items[0].saleInfo.listPrice.amount;
                $('#itemMarketPrice').val(marketPrice);
            }
            $('#itemTitle').val(title);
            $('#itemAuthor').val(author);
            $('#itemPublisher').val(publisher);
            $('#itemPages').val(pages);
        }
        else {
            console.log("ISBN not found");
        }
    })
    .fail(function(data) {
        console.error("Couldn't parse!");
    });
}

//Checks if a URL is broken or not
function urlExists(url, cb){
    jQuery.ajax({
        url:      url,
        dataType: 'image/jpg',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
               cb.apply(this, [xhr.status]);
        }
    });
}

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