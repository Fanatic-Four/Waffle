var mongoose = require ("mongoose");

var users = [];


function createUser(username, password, firstName, lastName, phone) {

  if (users[username]) {
    return null;
    console.log("User already exists");
  }
  else {
    var user = {
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      events: []
    };

    users[username] = user;
    users.push(user);

    return user;
  }
}

function getUsers() {
  return users;
}

function addEvent(username, mEvent, number) {
  if (users[username]) {
    users[username].events.push({
      mEvent: mEvent,
      number: number
    });
  }
}

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.addEvent = addEvent;
