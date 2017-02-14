var sql = require("mssql");
var bcrypt = require("bcryptjs");
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

    //Searches the DB for occurence of a string to find potential matches in ISBN, title, author, publisher and school.
    //Then gets matching items from the shelves with their necessary info to display on the thumbnail
    getMatchingItemsInfoForThumbnail: function (strToFind, callback) {
        var items = {};
        
        //Parameterizing input to prevent from SQL injection
        request = new Request(connection);
        request.input('find', sql.VarChar, '%' + strToFind + '%');  //'find' is the parameter name, sql.VarChar is to tell that the input is going to be in var format, and the third parameter is the string to search with wildcards appended

        var queryForRequest = "SELECT sr.itemID AS itemID, br.ISBN AS ISBN, br.title AS title, br.edition AS edition, br.author AS author, br.publisher AS publisher, br.marketPrice AS marketPrice, br.imageURL AS imageURL, scr.schoolName AS schoolName, cr.lastName AS sellerLastName, cr.middleName AS sellerMiddleName, cr.firstName AS sellerFirstName, sr.price AS listedPrice FROM ShelvesRecords sr JOIN CustomerRecords cr ON (sr.sellerID = cr.customerID) JOIN BookRecords br ON (sr.ISBN = br.ISBN) JOIN SchoolRecords scr ON (sr.schoolID = scr.schoolID) WHERE (br.ISBN LIKE @find) OR (br.title LIKE @find) OR (br.author LIKE @find) OR (br.publisher LIKE @find) OR (scr.schoolName LIKE @find);"
        
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
    },

    //Registers a user on the db based on the given credentials. Returns error message if issues with provided data
    registerAUser: function(registrationInfo, callback) {
        //String with output msg
        var outputMsg = '';

        //Load all the user provided input into the userInfo object.
        //Not necessary to do this, but doing it to ensure the backend doesn't get affected by changes on the front end field names
        var userInfo = {};
        userInfo.email = registrationInfo.userEmail;
        userInfo.password = registrationInfo.userPassword;
        userInfo.firstName = registrationInfo.userFname;
        userInfo.middleName = registrationInfo.userMname;
        userInfo.lastName = registrationInfo.userLname;
        userInfo.street = registrationInfo.userStreet;
        userInfo.city = registrationInfo.userCity;
        userInfo.zip = registrationInfo.userZip;
        userInfo.state = registrationInfo.userState;
        userInfo.country = registrationInfo.userCountry;
        userInfo.school = registrationInfo.userSchool;
        userInfo.phone = registrationInfo.userPhone;
        console.log(userInfo);

        //Check if any of the required fields are null, return an error message if that is the case
        if (userInfo.email && userInfo.password && userInfo.firstName && userInfo.lastName && userInfo.city && userInfo.zip && userInfo.state && userInfo.country && userInfo.phone) {

            //Create a request object
            request = new Request(connection);
            // Generate a hash and store the user info in the database
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userInfo.password, salt, function(err, hash) {
                    //Parameterizing input to prevent from SQL injection
                    request.input('email', sql.VarChar, userInfo.email);
                    request.input('password', sql.VarChar, hash);
                    request.input('lastName', sql.VarChar, userInfo.lastName);
                    request.input('middleName', sql.VarChar, userInfo.middleName);
                    request.input('firstName', sql.VarChar, userInfo.firstName);
                    request.input('street', sql.VarChar, userInfo.street);
                    request.input('city', sql.VarChar, userInfo.city);
                    request.input('zipCode', sql.Int, userInfo.zip);
                    request.input('stateName', sql.VarChar, userInfo.state);
                    request.input('country', sql.VarChar, userInfo.country);
                    request.input('phone', sql.Int, userInfo.phone);

                    //request.output('returnValue', sql.Int);
                    // Return value is 1 for success, 2 for already used email, 3 for write to DB error
                    request.execute('RegisterAUser', function(err, recordsets, result) {
                        if (err) {
                            console.log(err);
                            outputMsg = "ALERT: Database Connection error. Please try again!"
                        }
                        //console.log("ReturnValue: " + request.parameters.returnValue.value);
                        console.log("Result: " + result);
                        if (result == 1) {
                            outputMsg = "success";
                        }
                        if (result == 2) {
                            outputMsg = "ALERT: An account already exists with the given email!"
                        }
                        if (result == 3) {
                            outputMsg = "ALERT: Internal server error during registration. Please try again!"
                        }
                        callback(outputMsg);
                    });
                });
            });

        }
        else {
            outputMsg = "ALERT: Improper/Missing fields. Please try again!";
            callback(outputMsg);
        }
    }
}