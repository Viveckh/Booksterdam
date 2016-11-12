var sql = require("mssql");

var config = {
    userName: 'scriptster@scriptstudio.database.windows.net',
    password: 'vikingyo@69',
    server: 'scriptstudio.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'Booksterdam'}
};

var connection = new sql.Connection(config, function(err) {
    var request = new sql.Request(connection);
    request.query("Select * FROM CustomerRecords", function (err, recordset) {
        console.log(recordset);
    });
});

