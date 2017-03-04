var express = require('express');
var router = express.Router();

var dbRequests = require('./dbRequests');
var sayson;

/* GET home page. */
router.get('/', function(req, res, next) {
    
    //Proper way of executing a database request from the dbRequests.js
    dbRequests.retrieveCustomerRecords(function (customers) {
        //Do stuffs with the retrieved data here
        //console.log(customers);
        //console.log(data['100000001'].firstName);
        dbRequests.getMatchingItemsInfoForThumbnail('', function (items) { //Search for an empty string so that all the available books can be seen
            //console.log(items);
            res.render('index', { customers: customers, items : items });
        });
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

/* Renders signup page */
/* GET home page. */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

// Get dashboard page on login
router.get('/dashboard', function(req, res, next) {
    console.log(req.session);
    //var sess = req.session;
    //sess.user = "Vivek";
    //sess.password = "Password";
    //console.log(sess.user + sess.password);
    //console.log(sayson);
    req.session.store.get(sayson, function(error, session) {
        console.log(session);
    });
    res.render('dashboard');
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
            sayson = req.session.id;
            console.log(sayson);
            req.session.user = req.body.loginEmail;
            //req.session.resave();
            //res.redirect('/dashboard');
        }
        else {
            res.send(result);
        }
    });
});

module.exports = router;
