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
}
