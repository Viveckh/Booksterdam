var database = require('./database');

var dbRequester = module.exports = {
    //Retrieves the entire customer Records; user can overload the callback function if there is anything they want done with the returned data
    retrieveCustomerRecords: function (callback) {
        var customers = {};
        database.requester().query("Select * FROM CustomerRecords", function(err, recordset) {
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

    retrieveShelvesRecords: function (callback) {
        var items = {};
        database.requester().query("Select * FROM ShelvesRecords WHERE isAvailable = 1", function(err, recordset) {
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
                    itemInfo.isbn = column.isbn;
                    itemInfo.price = (column.price == null) ? "" : column.price;
                    items[column.itemID] =  itemInfo;
                });
                console.log("Request Fulfilled");
                
                //Calling the callback function here with the returned data after the request is successful
                callback(items);
            });

    }
}