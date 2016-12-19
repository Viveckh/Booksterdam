var express = require('express');
var router = express.Router();

var dbRequests = require('./dbRequests');

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
    
    dbRequests.getMatchingItemsInfoForThumbnail(searchFor, function (items) { //Search for an empty string so that all the available books can be seen
        //console.log(items);
        res.render('shelves', { items : items });
    });
});


module.exports = router;
