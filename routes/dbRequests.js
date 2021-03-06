var sql = require("mssql");
var bcrypt = require("bcryptjs");
var database = require('./database');

var Request = sql.Request;
var connection = database.connectionPool(); //Import established connection from database.js

var dbRequester = module.exports = {
    //Retrieves the customer Record of the given customerID; user can overload the callback function if there is anything they want done with the returned data
    retrieveCustomerRecord: function (customerID, callback) {
        var customerInfo = {};
        
        request = new Request(connection);
        request.input('custID', sql.Int, customerID);
        request.query("Select * FROM CustomerRecords where customerID=@custID", function(err, recordset) {
                console.log("Inside Query Request");

                // If any error occurs during the request, display the error log and return;
                if (err) {
                    console.log("couldn't fetch the request. Error log below");
                    console.log(err);
                    return;
                }
                
                // If no errors, then, display the fetched data
                //FETCHING DATA FROM DATABASE TO EXPORT
                if (recordset[0]) {
                    customerInfo.customerID = recordset[0].customerID;
                    customerInfo.lastName = recordset[0].lastName;
                    customerInfo.middleName = (recordset[0].middleName == null) ? "" : recordset[0].middleName;
                    customerInfo.firstName = recordset[0].firstName;
                    customerInfo.street = (recordset[0].street == null) ? "" : recordset[0].street;
                    customerInfo.city = recordset[0].city;
                    customerInfo.zipCode = recordset[0].zipCode;
                    customerInfo.stateName = recordset[0].stateName;
                    customerInfo.country = recordset[0].country;
                    customerInfo.phone = recordset[0].phone;
                    customerInfo.email = recordset[0].email;
                    console.log("Request Fulfilled");
                }

                //Calling the callback function here with the returned data after the request is successful
                callback(customerInfo);
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

        var queryForRequest = "SELECT sr.itemID AS itemID, br.ISBN AS ISBN, br.title AS title, br.edition AS edition, br.author AS author, br.publisher AS publisher, br.marketPrice AS marketPrice, br.imageURL AS imageURL, scr.schoolName AS schoolName, cr.lastName AS sellerLastName, cr.middleName AS sellerMiddleName, cr.firstName AS sellerFirstName, cr.email AS sellerEmail, sr.price AS listedPrice FROM ShelvesRecords sr JOIN CustomerRecords cr ON (sr.sellerID = cr.customerID) JOIN BookRecords br ON (sr.ISBN = br.ISBN) JOIN SchoolRecords scr ON (sr.schoolID = scr.schoolID) WHERE (br.ISBN LIKE @find) OR (br.title LIKE @find) OR (br.author LIKE @find) OR (br.publisher LIKE @find) OR (scr.schoolName LIKE @find) ORDER BY itemID DESC;"
        
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
                    itemInfo.sellerEmail = column.sellerEmail;
                    
                    // Adding the item to the master object
                    items[column.itemID] =  itemInfo;
                });
                console.log("Request Fulfilled");
                //Calling the callback function here with the returned data after the request is successful
                callback(items);
            });
    },

    // Gets the postings made by the logged in user
    getDashboardContent: function(customerID, callback) {
        var items = {};
        
        //Parameterizing input to prevent from SQL injection
        request = new Request(connection);
        request.input('custID', sql.Int, customerID);  //'customerID' is the parameter name, sql.Int is to tell that the input is going to be in int format

        //STEP 1: Get all the posted items by the logged in user
        var queryForRequest = "SELECT sr.itemID AS itemID, br.ISBN AS ISBN, br.title AS title, br.edition AS edition, br.author AS author, br.publisher AS publisher, br.marketPrice AS marketPrice, br.imageURL AS imageURL, sr.price AS listedPrice FROM ShelvesRecords sr JOIN CustomerRecords cr ON (sr.sellerID = cr.customerID) JOIN BookRecords br ON (sr.ISBN = br.ISBN) WHERE sr.sellerID = @custID ORDER BY sr.itemID DESC;"
        
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
                    // Populating listed books info
                    itemInfo.itemID = column.itemID;
                    itemInfo.isbn = column.ISBN;
                    itemInfo.title = column.title;
                    itemInfo.edition = (column.edition == null) ? "N/A" : column.edition;
                    itemInfo.author = (column.author == null) ? "Not Available" : column.author;
                    itemInfo.publisher = (column.publisher == null) ? "Not Available" : column.publisher;
                    itemInfo.imageURL = (column.imageURL == null) ? "" : column.imageURL;
                    itemInfo.marketPrice = (column.marketPrice == null) ? "Not Available" : column.marketPrice;
                    itemInfo.listedPrice = (column.listedPrice == null) ? "Not Provided" : column.listedPrice;

                    // Adding the item to the master object
                    items[column.itemID] =  itemInfo;
                });

                //STEP 2: Get the customer's personal information
                var queryForRequest = "";
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
    },

    //Attempts a login, and returns the user customerID if successful
    attemptLogin: function(loginInfo, callback) {
        //String with output msg
        var outputMsg = '';
        var customerID = ''; //identifier for the user if login is successful

        //Load all the user provided input into the loginCred object.
        //Not necessary to do this, but doing it to ensure the backend doesn't get affected by changes on the front end field names
        var loginCred = {};
        loginCred.email = loginInfo.loginEmail;
        loginCred.password = loginInfo.loginPassword;

        //Check if any of the required fields are null, return an error message if that is the case
        if (loginCred.email && loginCred.password) {
            //Create a request object
            request = new Request(connection);

            //Retrieve the hash from the DB and compare if it matches the entered password; returns NULL if email isn't registered
            //Parameterizing input to prevent from SQL injection
            request.input('email', sql.VarChar, loginCred.email);
            request.output('password', sql.VarChar(60));
            request.execute('FetchHashedPassword', function(err, recordsets, result) {
                if (err) {
                    console.log(err);
                    outputMsg = "connection error";
                    callback(outputMsg, customerID);
                }
                var retrievedPassword = request.parameters.password.value;
                //If password retrieved is not NULL, go ahead with authentication. Else it's a failure.
                if (retrievedPassword) {
                    //Compare the entered password with the retrieved password
                    bcrypt.compare(loginCred.password, retrievedPassword, function(err, res) {
                        if (res === true) {
                            outputMsg = "success";

                            //Retrieve the customerID and send it back for session use.    
                            request.input('email', sql.VarChar, loginCred.email);
                            var queryForRequest = "SELECT customerID FROM CustomerRecords WHERE email = @email;";
                            request.query(queryForRequest, function(err, recordset) {
                                customerID = recordset[0].customerID;
                                callback(outputMsg, customerID);
                            });
                        }
                        else {
                            outputMsg = "incorrect password";
                            callback(outputMsg, customerID);
                        }
                    });     
                }
                else {
                    outputMsg = 'email not registered';
                    callback(outputMsg, customerID);
                }
            });
        }
        else {
            outputMsg = "improper fields";
            callback(outputMsg, customerID);
        }
    },

    //Add an item to the shelves
    addToShelf: function(customerID, item, callback) {
        //String with output msg
        var outputMsg = '';

        //Not loading the itemDetails gathered from form to separate variables for simplicity
        
        //Check if any of the required fields are null, return an error message if that is the case
        if (customerID && item.itemISBN && item.itemTitle && item.itemAuthor && item.itemSellerPrice && item.itemSchool) {
            //create a request object
            request = new Request(connection);

            //Verifying if the not-required integer fields are filled, if empty setting them to null to avoid errors
            item.itemEdition = (item.itemEdition) ? item.itemEdition: null;
            item.itemPages = (item.itemPages) ? item.itemPages: null;
            item.itemMarketPrice = (item.itemMarketPrice) ? item.itemMarketPrice: null;
            //console.log(item);

            request.input('school', sql.VarChar, item.itemSchool);
            request.input('sellerID', sql.Int, customerID);
            request.input('isbn', sql.BigInt, item.itemISBN);
            request.input('title', sql.VarChar, item.itemTitle);
            request.input('author', sql.VarChar, item.itemAuthor);
            request.input('edition', sql.Float, item.itemEdition);
            request.input('publisher', sql.VarChar, item.itemPublisher);
            request.input('numberOfPages', sql.Int, item.itemPages);
            request.input('marketPrice', sql.Float, item.itemMarketPrice);
            request.input('price', sql.Float, item.itemSellerPrice);
            request.input('imageUrl', sql.VarChar, item.itemImageUrl);
            
            //STEP 1: First get the corresponding schoolID of the selected school
            var queryForRequest = "SELECT schoolID from SchoolRecords WHERE schoolName=@school;"
            request.query(queryForRequest, function(err, recordset) {
                //If any error occurs during the request. Return error
                if (err) {
                    console.log(err);
                    outputMsg = "ALERT: Database Connection error. Please try again!";
                    return;
                }
                //Retrieve School ID
                var schoolID = recordset[0].schoolID;
                request.input('schoolID', sql.Int, schoolID);

                //STEP 2: Insert the book info the BookRecords Table
                queryForRequest = "INSERT INTO BookRecords (ISBN, title, edition, author, publisher, numberOfPages, marketPrice, imageURL) VALUES (@isbn, @title, @edition, @author, @publisher, @numberOfPages, @marketPrice, @imageUrl);"
                request.query(queryForRequest, function(err, recordset){
                    if (err) {
                        console.log(err);
                        outputMsg = "ALERT: Database Connection error. Please try again!";
                    }

                    //If new item was added to the BookRecords
                    if (request.rowsAffected == 1) {
                        console.log("New Book Info added to BookRecords");
                    }
                    
                    //STEP 3: Insert the item to the shelf
                    queryForRequest = "INSERT INTO ShelvesRecords (sellerID, schoolID, ISBN, price, isAvailable) VALUES (@sellerID, @schoolID, @isbn, @price, 1);"
                    request.query(queryForRequest, function(err, recordset){
                        if (err) {
                            console.log(err);
                            outputMsg = "ALERT: Database Connection error. Please try again!";
                            return;
                        }

                        //If the item is successfully added to the shelf
                        if (request.rowsAffected == 1) {
                            console.log("New item on the shelves");
                            outputMsg = "success";
                        }
                        else {
                            console.log("Item couldn't be shelved");
                            outputMsg = "ALERT: Item couldn't be shelved. Try again!";
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