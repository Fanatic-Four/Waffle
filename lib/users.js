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

function addEvent(username, mEvent) {
  if (user[username]) {
    users[username].events[mEvent.id] = mEvent;
  }
}

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.addEvent = addEvent;
