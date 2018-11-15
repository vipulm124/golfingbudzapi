var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var event_like = mongoose.Schema({

    userName: { type: String, required: true },
    userId: { type: String, required: true },
    eventId: String

});
event_like.plugin(timestamps);
module.exports = mongoose.model('event_like', event_like);