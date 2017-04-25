var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var tagSchema = mongoose.Schema({
    name: String
});

var commentSchema = mongoose.Schema({
    name: String,
	time : { type : Date, default: Date.now }
});

var MessageSchema   = new Schema({
	name     : String,
	time     : { type : Date, default: Date.now },
	tags     : [tagSchema],
	comments : [commentSchema],
},{ strict: false });

module.exports = mongoose.model('Message', MessageSchema);
