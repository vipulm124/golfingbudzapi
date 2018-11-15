var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var event_attendees = mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    eventId: String,
});
event_attendees.plugin(timestamps);
module.exports = mongoose.model('eventAttendees', event_attendees);