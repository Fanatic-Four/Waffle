var events = [];

var eventID = 0;

function createEvent(creator, name, desc) {

  var mEvent = {
    creator: creator,
    name: name,
    desc: desc,
    id: eventID,
    users: []
  };

  events[eventID++] = mEvent;

  return mEvent;
}

function getEvents() {
  if (!events) {
    return null
  }
  else {
    return events;
  }
}

function addUser(mEvent, user, number) {
  mEvent.users.push = {
    user: user,
    number: number
  };
}

exports.getEvents = getEvents;
exports.createEvent = createEvent;
exports.addUser = addUser;
