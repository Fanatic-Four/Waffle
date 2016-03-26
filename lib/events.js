var events = [];

var eventID = 0;

function result(success, message, data) {
	return {
		success: success,
		message: message,
		data: data,
		count: data.length
	};
}

function createEvent(creator, name, desc) {

  var mEvent = {
    creator: creator,
    name: name,
    desc: desc,
    id: eventID,
    users: []
  };

  events[eventID++] = mEvent;

  return result(true, "Event created!", mEvent);
}

function getEvents() {
  if (!events) {
    return result(false, "No events exist", null);
  }
  else {
    return result(true, "Returning events..", events);
  }
}

function addUser(mEvent, user) {
  mEvent.push = user;
}

exports.getEvents = getEvents;
exports.createEvent = createEvent;
exports.addUser = addUser;
