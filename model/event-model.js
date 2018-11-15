var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var eventSchema = mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    title: String,
    description: String,
    date: String,
    time: String,
    image: String,
    video: String,
    isActive: { type: String, default: 1 },
    likeCount: { type: Number, default: 0 },
    likes: [],
    eventsAttendess: []
});
eventSchema.plugin(timestamps);
module.exports = mongoose.model('event', eventSchema);