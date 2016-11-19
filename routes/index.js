var express = require('express');
var router = express.Router();

var dbRequests = require('./dbRequests');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    //Proper way of executing a database request from the dbRequests.js
    dbRequests.retrieveCustomerRecords(function (data) {
        //Do stuffs with the retrieved data here
        console.log(data);
        console.log(data['100000001'].firstName);
        console.log("here");
    });
    
    res.render('index', { title: 'Expressed' });
});

module.exports = router;
