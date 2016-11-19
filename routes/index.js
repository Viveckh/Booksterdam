var express = require('express');
var router = express.Router();

var dbRequests = require('./dbRequests');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    //Proper way of executing a database request from the dbRequests.js
    dbRequests.retrieveCustomerRecords(function (customers) {
        //Do stuffs with the retrieved data here
        console.log(customers);
        //console.log(data['100000001'].firstName);
        dbRequests.retrieveShelvesRecords(function (items) {
            console.log(items);
            res.render('index', { customers: customers, items : items });
        });
    });
});

module.exports = router;
