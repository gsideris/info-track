var Message     = require('../app/models/message');

module.exports = (function() {
  function QACtrl() {}

  QACtrl.prototype.create = function(request, response) {
        tags = request.body.tags || '';
		var message = new Message({
            name : request.body.name,
            tags : tags.split(",").map(function(obj){ return { name : obj }}),
            answer : request.body.answer
        });
		message.save(function(err) {
			if (err)
				response.send(err);

			response.json({ message: 'Message created!' });
		});
  };

  QACtrl.prototype.update = function(request, response) {
    Message.findById(request.params.message_id, function(err, message) {

        if (err)
            response.send(err);

        tags = request.body.tags || '';
        message.name = request.body.name;
        message.tags = tags.split(",");
        message.save(function(err) {
            if (err)
                response.send(err);

            response.json({ message: 'Message updated!' });
        });

    });
  };

  QACtrl.prototype.remove = function(request, response) {
    Message.remove({
        _id: req.params.message_id
    }, function(err, message) {
        if (err)
            respponse.send(err);

        ressponse.json({ message: 'Successfully deleted' });
    });
  };

  QACtrl.prototype.get = function(request, response) {
    Message.findById(request.params.message_id, function(err, message) {
        if (err)
            response.send(err);
        response.json(message);
	});
  };


  QACtrl.prototype.all = function(request,response) { 
		Message.find(function(err, messages) {
			if (err)
				response.send(err);

			response.json(messages);
		});
  };


  return QACtrl;

})();

