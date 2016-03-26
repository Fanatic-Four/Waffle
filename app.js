var express = require('express');
var app = express();
var http = require ('http');
var mongoose = require ("mongoose");

var uristring = 'mongodb://heroku_xvxr827b:735klrc3ennhtqa8b1u2437fo2@ds025459.mlab.com:25459/heroku_xvxr827b';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});
var handlebars = require('express-handlebars');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

var userCol = require('./lib/users.js');
var eventCol = require('./lib/events.js');

// The body parser is used to parse the body of an HTTP request.
var bodyParser = require('body-parser');

//Handlebars
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');


// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/test', function(req, res) {
    userCol.createUser("myatnoe", "password", "MyatNoe", "Aint", "6176429478", [])
    res.render('index')
});

app.post('/login', function(req, res) {

    console.log(req);

    var username = req.body.username;
    var password = req.body.password;

    console.log(username);
    console.log(password);

    var users = userCol.getUsers();

    if (users[username] && users[username].password === password) {
        console.log("Success on login");
        res.send('Success');
        res.redirect('/main');
    }
    else {
        console.log("Failure to login");
        res.send('Failure');
    }

});

app.post('/signup', function(req, res) {
    var username = req.body.name;
    var password = req.body.pass;
    var fName = req.body.fName;
    var lName = req.body.lName;
    var phone = req.body.phone;

    console.log("Signup page reached");

    var newUser = userCol.createUser(username, password, fName, lName, phone);
    if (newUser) {
        //Success!
        console.log("Success on signup");
        res.send("Success");
        //res.redirect('/main');
    }
    else {
        console.log("Failure to signup");
        res.send("Failure. User already exists");
        //res.redirect('/');
    }
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port:', app.get('port'));
});
