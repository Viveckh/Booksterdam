var database = require('./database');

var dbRequester = module.exports = {
    retrieveCustomerRecords: function () {
        var customerInfo = {};
        database.requester().query("Select * FROM CustomerRecords cr JOIN ShelvesRecords sr ON cr.customerID = sr.sellerID;", function(err, recordset) {
                console.log("inside query request");

                // If any error occurs during the request, display the error log and return;
                if (err) {
                    console.log("couldn't fetch the request. Error log below");
                    console.log(err);
                    return;
                }

                // If no errors, then, display the fetched data
                recordset.forEach(function(column) {
                    //console.log(column);
                    console.log(column.lastName);
                    console.log(column.zipCode);
                    //COLLECTING RESULTS TO EXPORT
                    customerInfo.customerID = column.customerID;
                    customerInfo.lastName = column.lastName;
                    customerInfo.firstName = column.firstName;
                    customerInfo.zipCode = column.zipCode;
                    //resultsCollector[column.customerID] =  customerInfo;


                    if (column.itemID != null) {
                        //console.log(column.itemID);
                    } 
                    console.log();
                    
                });
                console.log("request Fulfilled");
                //console.log(recordset[0].lastName);
            });
        return customerInfo;
    }
}