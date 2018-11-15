var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var contacSchema = mongoose.Schema({

    userName: { type: String, required: true },
    userId: { type: String, required: true },
    title: String,
    message: String,
    email: String,

});
contacSchema.plugin(timestamps);
module.exports = mongoose.model('contact', contacSchema);