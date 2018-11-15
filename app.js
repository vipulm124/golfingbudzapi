// set up ========================
var express = require('express');
var mongoose = require('mongoose');
var Config = require('./util/config');
conf = new Config();

// mongoose.Promise = global.Promise;
// mongoose.connect(conf.url, {
//     useMongoClient: true
// });
var app = express();                              // create our app w/ express 
// get instance of mysql
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var path = require('path');
var cookieParser = require('cookie-parser');
//var session = require('express-session');

// configuration =================
// app.set('views', path.join(__dirname, 'views'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '/public')));

app.use(cookieParser());
//app.use(session({ secret: 'YUiljiYIlkji6979IUulYRtdsYDAD989' }));

var pool = require('./util/config')();
require('./routes')(app, pool);




app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");