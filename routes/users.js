var express = require('express');
var router = express.Router();

/*
resultsCollector = {}
resultsCollector.lastName = "Pandey";
resultsCollector.zipCode = "07430";

*/
/*
//So, to get the data from the database, you need to require the script that connects to the db and makes the query
//At the end of that script, there should be a module export which will export the object loaded with the data (refer to database.js)
//receive the data and pass that to the jade template
//sample object to navigate
//{
    100010: {
        lastName: Pandey
        zipCode: Vivek
    }
    100011: {
        lastName:xxxx
        zipCode: xxxxx
    }
   }
   
   sample jade code to navigate
   
   each person in info
        p #{person.lastName} #{person.zipCode}
*/

var db = require('./database');
var results = db.resultsCollector();
console.log(results);


/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
  //res.send('respond with a resource');
    res.render('users', { info: results });
});

module.exports = router;
