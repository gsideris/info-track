var Message     = require('../app/models/message');


module.exports = (function() {
  function TimelineCtrl() {}


  TimelineCtrl.prototype.all= function(request,response) { 
		Message.find({}).sort({time:-1}).exec( function(err, messages) {
			if (err)
				response.send(err);

			response.json(messages);
		});
  };


  return TimelineCtrl;

})();

