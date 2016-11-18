var express = require('express');
var router = express.Router();

//var database = require('./database');

var dbRequests = require('./dbRequests');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    // ATTENTION: Trying to print the retrieved results using a callback function to prevent from constantly showing null
    // FIX THESE LINES USING CALLBACK
    var custInfo;
    custInfo = dbRequests.retrieveCustomerRecords();
    console.log(custInfo);
    console.log(custInfo.customerID);
    console.log(custInfo.lastName);
    console.log(custInfo.firstName);
    console.log(custInfo.zipCode);
    
    res.render('index', { title: 'Expressed' });
});

module.exports = router;
