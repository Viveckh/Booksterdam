var sql = require("mssql");
var database = require('./database');

var Request = sql.Request;
var connection = database.connectionPool(); //Import established connection from database.js

var dbRequester = module.exports = {
    //Retrieves the entire customer Records; user can overload the callback function if there is anything they want done with the returned data
    retrieveCustomerRecords: function (callback) {
        var customers = {};
        
        request = new Request(connection);
        request.query("Select * FROM CustomerRecords", function(err, recordset) {
                console.log("Inside Query Request");

                // If any error occurs during the request, display the error log and return;
                if (err) {
                    console.log("couldn't fetch the request. Error log below");
                    console.log(err);
                    return;
                }

                // If no errors, then, display the fetched data
                recordset.forEach(function(column) {
                    //console.log(column);
                    //console.log(column.lastName);
                    //console.log(column.zipCode);
                    
                    //FETCHING DATA FROM DATABASE TO EXPORT
                    var customerInfo = {};
                    customerInfo.customerID = column.customerID;
                    customerInfo.lastName = column.lastName;
                    customerInfo.middleName = (column.middleName == null) ? "" : column.middleName;
                    customerInfo.firstName = column.firstName;
                    customerInfo.street = (column.street == null) ? "" : column.street;
                    customerInfo.city = column.city;
                    customerInfo.zipCode = column.zipCode;
                    customerInfo.stateName = column.stateName;
                    customerInfo.country = column.country;
                    customerInfo.phone = column.phone;
                    customerInfo.email = column.email;
                    customers[column.customerID] =  customerInfo;
                });
                console.log("Request Fulfilled");
                
                //Calling the callback function here with the returned data after the request is successful
                callback(customers);
            });
    },

    //Retrieves the content from the ShelvesRecords Table
    retrieveShelvesRecords: function (callback) {
        var items = {};

        request = new Request(connection);
        request.query("Select * FROM ShelvesRecords WHERE isAvailable = 1", function(err, recordset) {
                console.log("Inside Query Request");

                // If any error occurs during the request, display the error log and return;
                if (err) {
                    console.log("couldn't fetch the request. Error log below");
                    console.log(err);
                    return;
                }

                // If no errors, then, display the fetched data
                recordset.forEach(function(column) {          
                    //FETCHING DATA FROM DATABASE TO EXPORT
                    var itemInfo = {};
                    itemInfo.itemID = column.itemID;
                    itemInfo.sellerID = column.sellerID;
                    itemInfo.schoolID = column.schoolID;
                    itemInfo.isbn = column.ISBN;
                    itemInfo.price = (column.price == null) ? "" : column.price;
                    items[column.itemID] =  itemInfo;
                });
                console.log("Request Fulfilled");
                
                //Calling the callback function here with the returned data after the request is successful
                callback(items);
            });
    },

    //Gets all the items on the shelves with their necessary info to display on the thumbnail
    getItemsInfoForThumbnail: function (callback) {
        var items = {};
        
        var queryForRequest = "SELECT sr.itemID AS itemID, br.ISBN AS ISBN, br.title AS title, br.edition AS edition, br.author AS author, br.publisher AS publisher, br.marketPrice AS marketPrice, br.imageURL AS imageURL, scr.schoolName AS schoolName, cr.lastName AS sellerLastName, cr.middleName AS sellerMiddleName, cr.firstName AS sellerFirstName, sr.price AS listedPrice FROM ShelvesRecords sr JOIN CustomerRecords cr ON (sr.sellerID = cr.customerID) JOIN BookRecords br ON (sr.ISBN = br.ISBN) JOIN SchoolRecords scr ON (sr.schoolID = scr.schoolID);"
        
        request = new Request(connection);
        request.query(queryForRequest, function(err, recordset) {
                console.log("Inside Query Request");

                // If any error occurs during the request, display the error log and return;
                if (err) {
                    console.log("couldn't fetch the request. Error log below");
                    console.log(err);
                    return;
                }

                // If no errors, then, display the fetched data
                recordset.forEach(function(column) {          
                    //FETCHING DATA FROM DATABASE TO EXPORT
                    var itemInfo = {};
                    // Populating book info
                    itemInfo.itemID = column.itemID;
                    itemInfo.isbn = column.ISBN;
                    itemInfo.title = column.title;
                    itemInfo.edition = (column.edition == null) ? "N/A" : column.edition;
                    itemInfo.author = (column.author == null) ? "Not Available" : column.author;
                    itemInfo.publisher = (column.publisher == null) ? "Not Available" : column.publisher;
                    itemInfo.imageURL = (column.imageURL == null) ? "" : column.imageURL;
                    itemInfo.marketPrice = (column.marketPrice == null) ? "Not Available" : column.marketPrice;
                    itemInfo.listedPrice = (column.listedPrice == null) ? "Not Provided" : column.listedPrice;

                    // Populating seller Info
                    itemInfo.schoolName = column.schoolName;
                    itemInfo.sellerLastName = column.sellerLastName;
                    itemInfo.sellerMiddleName = (column.sellerMiddleName == null) ? "" : column.sellerMiddleName;
                    itemInfo.sellerFirstName = column.sellerFirstName;
                    
                    // Adding the item to the master object
                    items[column.itemID] =  itemInfo;
                });
                console.log("Request Fulfilled");
                
                //Calling the callback function here with the returned data after the request is successful
                callback(items);
            });
    }

}