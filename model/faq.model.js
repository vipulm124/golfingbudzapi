var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var faqSchema = mongoose.Schema({
    title: String,
    description: String,

});
faqSchema.plugin(timestamps);
module.exports = mongoose.model('faq', faqSchema);