
/*
    Server Side Database Connection is established here.
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
var request;

function replaceConnectionOnDisconnect() {
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
        request = new Request(connection);       // No parameters passed to Request implies a global connection will be used, but that's not working for some reason
    });

    // TESTING: Added this error handler and the function wrapper of 'replaceConnectionOnDisconnect' to see if connection is re-established on error
    connection.on('error', function(err) {
        console.log("Error on connection");
        console.log(err);
        replaceConnectionOnDisconnect();
    });
}

replaceConnectionOnDisconnect();

exports.requester = function() {
    return request;
}