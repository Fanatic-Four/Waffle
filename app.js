var express = require('express');
var app = express();
var http = require ('http');
var mongoose = require ("mongoose");
var handlebars = require('express-handlebars');

app.use(express.static(__dirname + '/public'));

var uristring = 'mongodb://heroku_xvxr827b:735klrc3ennhtqa8b1u2437fo2@ds025459.mlab.com:25459/heroku_xvxr827b';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

app.set('port', (process.env.PORT || 3000));

var userCol = require('./lib/users.js');
var eventCol = require('./lib/events.js');

//Handlebars
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// The body parser is used to parse the body of an HTTP request.
var bodyParser = require('body-parser');

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/test', function(req, res) {
    userCol.createUser("myatnoe", "password", "MyatNoe", "Aint", "6176429478", []);
    res.render('index');
});

//Testing for dummy events:
var dummy1 = userCol.createUser("John", "password", "John", "Parker", "7322771111");
var dummy2 = userCol.createUser("myatnoe", "password", "MyatNoe", "Aint", "7322771111", []);
var dummy3 = userCol.createUser("Wayde", "password", "Wayde", "Smith", "7322771111");
var dummy4 = userCol.createUser("Brian", "password", "Brian", "Cooper", "7322771111");
var dummy5 = userCol.createUser("Edison", "password", "Edison", "Hatley", "7322771111");
var dummy6 = userCol.createUser("Charlie", "password", "Charlie", "Baker", "7322771111");

var event1 = eventCol.createEvent(dummy1, "Chocolate Raffle", "Raffle for chocolate! If you are the winner, please email me at jparker@chocolate.com with a picture of your ticket.");
var event2 = eventCol.createEvent(dummy2, "Super Bowl Raffle", "Raffle for $$ for the superbowl!! If you are the winner, please email me at myatnoe@superbowl.com with a picture of your ticket.");
var event3 = eventCol.createEvent(dummy3, "Ice Cream Raffle", "Raffle for ice cream!! If you are the winner, please email me at wsmith@icecream.com with a picture of your ticket.");
var event4 = eventCol.createEvent(dummy4, "Board Games Raffle", "Raffle for cards against humanity!! If you are the winner, please email me at boardgames@cah.com with a picture of your ticket.");
var event5 = eventCol.createEvent(dummy5, "Whiteboard Raffle", "Raffle for a whiteboard!! If you are the winner, please email me at raffle@whiteboards.com with a picture of your ticket.");
var event5 = eventCol.createEvent(dummy6, "Oculus Rift Raffle", "Raffle for an Oculus Rift!! If you are the winner, please email me at riffle@oculus.com with a picture of your ticket.");

eventCol.addUser(event1, dummy6, 101);
userCol.addEvent(dummy6, event1, 101);

eventCol.addUser(event2, dummy5, 102);
userCol.addEvent(dummy5, event2, 102);

eventCol.addUser(event3, dummy4, 103);
userCol.addEvent(dummy4, event3, 103);

eventCol.addUser(event4, dummy1, 100);
userCol.addEvent(dummy1, event4, 100);

app.post('/login', function(req, res) {

    console.log(req);

    var username = req.body.username;
    var password = req.body.password;

    console.log(username);
    console.log(password);

    var users = userCol.getUsers();

    if (users[username] && users[username].password === password) {
        console.log("Success on login");
        res.redirect('/events?username=' + username);
    }
    else {
        console.log("Failure to login");
        res.redirect('/');
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
        res.redirect('/events?username=' + username);
    }
    else {
        console.log("Failure to signup");
        res.redirect('/');
    }
});

app.get('/events', function(req, res) {

  var username = req.query.username;
  var currentUser = userCol.getUsers()[username];
  var attending = userCol.getUsers()[username].events;

  //console.log(attending);

  var currentEvents = eventCol.getEvents();
  var hosted = [];

  var other = [];

  for (var i = 0; i < currentEvents.length; i++) {
    if (currentEvents[i].creator.username === username) {
      hosted.push(currentEvents[i]);
    }
    else {
      var isAttending = false;

      for (var j = 0; j < attending.length; j++) {
        if(attending[j].mEvent.id === currentEvents[i].id || currentEvents[i].creator.username === username) {
          isAttending = true;
        }
      }

      if (!isAttending) {
          other.push(currentEvents[i]);
      }
    }
  }

  //console.log(currentEvents);

  //console.log(other);

  res.render('events', {
    hosted: hosted,
    attending: attending,
    other: other,
    currentUser: currentUser
  });
});

app.get('/android-events', function(req, res) {
  var username = req.query.username;
  var attending = userCol.getUsers()[username].events;

  //console.log(attending);

  var currentEvents = eventCol.getEvents();
  var hosted = [];

  var other = [];

  for (var i = 0; i < currentEvents.length; i++) {
    if (currentEvents[i].creator.username === username) {
      hosted.push(currentEvents[i]);
    }
    else {
      var isAttending = false;

      for (var j = 0; j < attending.length; j++) {
        if(attending[j].mEvent.id === currentEvents[i].id || currentEvents[i].creator.username === username) {
          isAttending = true;
        }
      }

      if (!isAttending) {
          other.push(currentEvents[i]);
      }
    }
  }

  console.log("hosting", hosted);
  console.log("attending", attending);
  console.log("other" + other);

  for (var i = 0; i < other.length; i++) {
    console.log(other[i].creator.username);
  }

  var hostedResult = "";

  for (var i = 0; i < hosted.length; i++) {
  	hostedResult += "HOST,"
    hostedResult += hosted[i].creator.username + ",";
    hostedResult += hosted[i].name + ",";

    if (hosted[i].attendees.length > 0) {
      hostedResult += hosted[i].desc + ",";
      // hostedResult += "Attendees:";

      for (var j = 0; j < hosted[i].attendees.length; j++) {
          if (j < hosted[i].attendees.length - 1) {
              hostedResult += hosted[i].attendees[j].user.username + ",";
          }
          else {
              hostedResult += hosted[i].attendees[j].user.username;
          }
      }
    }
    else {
      hostedResult += hosted[i].desc + "";
    }

    hostedResult += "\n";
  }

  console.log(hostedResult);


  var attendingResult = "";

  for (var i = 0; i < attending.length; i++) {
    var mEvent = attending[i].mEvent;

    attendingResult += "ATTENDING,"
    attendingResult += mEvent.creator.username + ",";
    attendingResult += mEvent.name + ",";

    if (mEvent.attendees.length > 0) {
      attendingResult += mEvent.desc + ",";
      // attendingResult += "Attendees:";

      for (var j = 0; j < mEvent.attendees.length; j++) {
          if (j < mEvent.attendees.length - 1) {
              attendingResult += mEvent.attendees[j].user.username + ",";
          }
          else {
              attendingResult += mEvent.attendees[j].user.username;
          }
      }
    }
    else {
      attendingResult += mEvent.desc + "";
    }

    attendingResult += "\n";
  }

  console.log(attendingResult);

  var otherResult = "";

  for (var i = 0; i < other.length; i++) {
  	otherResult += "OTHER,";
    console.log("Hello" + other[i]);
    otherResult += other[i].creator.username + ",";
    otherResult += other[i].name + ",";

    if (other[i].attendees.length > 0) {
      otherResult += other[i].desc + ",";
      // otherResult += "Attendees:";

      for (var j = 0; j < other[i].attendees.length; j++) {
          if (j < other[i].attendees.length - 1) {
              otherResult += other[i].attendees[j].user.username + ",";
          }
          else {
              otherResult += other[i].attendees[j].user.username;
          }
      }
    }
    else {
      otherResult += other[i].desc + "";
    }


    otherResult += "\n";
  }

  res.send("" + hostedResult + "\n" + attendingResult + "\n" + otherResult);
});


var twilio = require('./lib/twilio_msg.js');
app.post('/winner', function(req, res) {
  var eventID = req.query.id;
  //var winningNum = req.query.winner;

  ///var eventID = req.body.id;
  var winningNum = req.body.winner;

  var currentEvents = eventCol.getEvents();

  console.log(eventID);
  console.log(winningNum);

  var sent = false;

  for (var i = 0; i < currentEvents.length; i++) {

    if ("" + currentEvents[i].id === "" + eventID) {

      var attendees = currentEvents[i].attendees;

      for (var j = 0; j < attendees.length; j++) {

        if ("" + attendees[j].number === "" + winningNum) {
          var message = twilio.sendMessage(attendees[j].user.username, attendees[j].user.phone, currentEvents[i].name, currentEvents[i].desc);
          res.render('winner', {
            username: attendees[j].user.username,
            phone: attendees[j].user.phone,
            message: message
          });
          sent = true;
        }
      }
    }
  }

  if (!sent) {
      res.send("No winner found");
  }

});

app.post('/add-event', function(req, res) {
  var creator = req.body.creator;
  var eventName = req.body.name;
  var desc = req.body.desc;

  creator = userCol.getUsers()[creator];

  eventCol.createEvent(creator, eventName, desc);

  res.redirect('/events?username=' + creator.username);

});

app.get('/announce', function(req, res) {
  var eventID = req.query.eventID;

  var currentEvents = eventCol.getEvents();

  var rendered = false;

  for (var i = 0; i < currentEvents.length; i++) {
    if ("" + currentEvents[i].id === "" + eventID) {
      res.render('announce', {
        eventName: currentEvents[i].name,
        eventID: eventID
      });
      rendered = true;
    }
  }

  if (!rendered) {
      res.redirect('/');
  }

});

app.post('/android-add-event', function(req, res) {
  var creator = req.body.creator;
  var eventName = req.body.name;
  var desc = req.body.desc;

  creator = userCol.getUsers()[creator];

  eventCol.createEvent(creator, eventName, desc);

  res.send("Successfully added event.");
});

app.post('/join', function(req, res) {
  var eventID = req.body.eventID;
  var username = req.body.username;
  var number = req.body.number;

  var currentEvents = eventCol.getEvents();

  var rendered = false;

  for (var i = 0; i < currentEvents.length; i++) {
    if ("" + currentEvents[i].id === "" + eventID) {

      var users = userCol.getUsers();
      var correctUser;

      for (var j = 0; j < users.length; j++) {
        if (users[j].username === username) {
          correctUser = users[j];
        }
      }

      eventCol.addUser(currentEvents[i], correctUser, number);
      userCol.addEvent(correctUser, currentEvents[i], number);
      res.redirect('/events?username=' + username);
      rendered = true;
    }
  }

  if (!rendered) {
      res.redirect('/');
  }

});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port:', app.get('port'));
});
