var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var tagSchema = mongoose.Schema({
    name: String
});

var MessageSchema   = new Schema({
	name : String,
	time : { type : Date, default: Date.now },
	tags : [tagSchema]
});

module.exports = mongoose.model('Message', MessageSchema);