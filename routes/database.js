
/*
    Server Side Database Requests Handler
    Author: Vivek Pandey
*/


//Including all the required drivers and packages
var sql = require("mssql");

//ATTENTION: Configuration Info, put this into a separate file later and import it instead
//Config file parameters configured for the mssql client, modify if you decide to use a different client
var config = {
    user: 'scriptster',
    password: 'vikingyo@69',
    server: 'scriptstudio.database.windows.net',
    database: 'Booksterdam',
    // Optional parameters
    options: {encrypt: true}
};

// Setting up the 'classes' that will be used.
//In object oriented terms, Connection is like the class, and connection is the instance of it
var Connection = sql.Connection;
//Setting up a Requester 'class'
var Request = sql.Request;
    

// Initializing a connection
var connection = new Connection(config, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connected");
});

    connection.on('connect', function() {
        console.log("connection ON");

        //Test queries making the request
        var myQuery = "Select * FROM CustomerRecords;";
        executeStatement(myQuery);
        myQuery = "Select cr.lastName, cr.zipCode, sr.itemID FROM CustomerRecords cr JOIN ShelvesRecords sr ON cr.customerID = sr.sellerID AND sr.price < 15;"
        executeStatement(myQuery);
    });


// Pass a query and it will execute the query and display the results to console
// Testing purposes
function executeStatement(queryStr) {
    var request = new Request(connection);       // No parameters passed to Request implies a global connection will be used, but that's not working for some reason
    
    request.query(queryStr, function(err, recordset) {
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
            if (column.itemID != null) {
                console.log(column.itemID);
            } 
            console.log();
        });
        console.log("request Fulfilled");
        
        //console.log(recordset[0].lastName);
    });
}

//Closing the active global connection
//connection.close();