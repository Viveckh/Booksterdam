var express = require('express');
var router = express.Router();

var dbRequests = require('./dbRequests');

/* GET Landing Page */
router.get('/', function(req, res, next){
    res.render('home');
});

/* GET Index Page. */
router.get('/index', function(req, res, next) {
    
    //Proper way of executing a database request from the dbRequests.js
    dbRequests.getMatchingItemsInfoForThumbnail('', function (items) { //Search for an empty string so that all the available books can be seen
        //console.log(items);
        res.render('index', { items : items, sessionInfo: req.session });
    });
});

/* GET search results */
router.get('/searchresults', function(req, res, next) {
    var searchFor = req.query.searchFor;
    console.log("Searching in DB for: " + searchFor);
    
    dbRequests.getMatchingItemsInfoForThumbnail(searchFor, function (items) { 
        //console.log(items);
        res.render('shelves', { items : items });
    });
});

/* GET search suggestions */
router.get('/searchsuggestions', function(req, res, next) {
    var searchFor = req.query.searchFor;
    
    dbRequests.getMatchingItemsInfoForThumbnail(searchFor, function (items) { 
        //console.log(items);
        res.send({ items : items });
    });
});

//Checks if a logged in session exists.
function authenticate(req, res, next) {
    //If no user is logged in, render the home page, else continue
    if (!req.session.user) {
        res.redirect('/index');
    } else {
        next();
    }
}

/* Renders signup page */
/* GET home page. */
router.get('/signup', function(req, res, next) {
    //Display the signup only if no user is logged in
    if (!req.session.user) {
        res.render('signup');
    }
    else {
        res.redirect('/dashboard');
    }
});

// Get dashboard page
router.get('/dashboard', authenticate, function(req, res, next) {
    console.log("Inside Dashboard: " + req.session.user);
    var customerID = req.session.refID;

    //Retrieve the information from the database for the logged in user
    dbRequests.retrieveCustomerRecord(customerID, function(customerInfo){ 
        dbRequests.getDashboardContent(customerID, function (items) {
            //console.log(items);
            res.render('dashboard', {sessionInfo: req.session, customerInfo: customerInfo, items: items});
        });
    });
});

router.get('/dash-postings', authenticate, function(req, res, next) {
    var customerID = req.session.refID;
    dbRequests.getDashboardContent(customerID, function(items) {
        res.render('dash-postings', {sessionInfo: req.session, items: items});
    });
});

// POST an item to shelf
router.post('/addToShelf', authenticate, function(req, res, next) {
    var customerID = req.session.refID;
    var item = req.body;
    //console.log(item);
    
    //Add the item to the shelf in database
    dbRequests.addToShelf(customerID, item, function (result) {
        //console.log(result);
        res.send(result);
    });
});

//Registers a user when provided with the signup form fields
router.post('/register', function(req, res, next) {
    //console.log(req.body);
    var registrationInfo = req.body;
    dbRequests.registerAUser(registrationInfo, function (result) {
        //console.log(result);
        res.send(result);
    });
});

//Attempts to Login, and returns the status to the caller. Also retrieves the customer reference ID if login successful for session use
router.post('/login', function(req, res, next) {
    //console.log(req.body);
    var loginInfo = req.body;
    dbRequests.attemptLogin(loginInfo, function (result, referenceID) {
        //console.log(result + " " + referenceID);
        if (result == 'success') {
            //Setting cookies with session info
            req.session.refID = referenceID;
            req.session.user = req.body.loginEmail;
            //console.log(req.session);
            res.send({redirect: '/dashboard'});
        }
        else {
            res.send(result);
        }
    });
});

//Logout
router.post('/logout', function(req, res, next) {
    //clear the saved user
    req.session.reset();
    //redirect to home
    res.send({redirect: '/index'});
});

module.exports = router;
