var database = require('./database');

var dbRequester = module.exports = {
    //Retrieves the entire customer Records; user can overload the callback function if there is anything they want done with the returned data
    retrieveCustomerRecords: function (callback) {
        var customers = {};
        database.requester().query("Select * FROM CustomerRecords cr JOIN ShelvesRecords sr ON cr.customerID = sr.sellerID;", function(err, recordset) {
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
                    customerInfo.firstName = column.firstName;
                    customerInfo.zipCode = column.zipCode;
                    customers[column.customerID] =  customerInfo;
                });
                console.log("Request Fulfilled");
                
                //Calling the callback function here with the returned data after the request is successful
                callback(customers);
            });
    }
}