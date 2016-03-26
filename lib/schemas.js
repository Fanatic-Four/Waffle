var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    creator: {type : mongoose.Schema.ObjectId, ref : 'User'},
    name: String,
    desc: String,
    attendees: [{
        user : {type : mongoose.Schema.ObjectId, ref : 'User'},
        ticket: String,
    }]
});
module.exports = mongoose.model('Event', eventSchema);
