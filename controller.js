
module.exports = (function() {
  function Controller() {}

  Controller.create_message = function(request,response) {
		var message = new Message();
		message.name = request.body.name;
		message.tags = request.body.tags.split(",");
		message.save(function(err) {
			if (err)
				response.send(err);

			response.json({ message: 'Message created!' });
		});
	  };

  Controller.update_message = function(request,response) {

	  		Message.findById(request.params.message_id, function(err, message) {

	  			if (err)
	  				response.send(err);

				message.name = request.body.name;
				message.tags = request.body.tags.split(",");
	  			message.save(function(err) {
	  				if (err)
	  					response.send(err);

	  				response.json({ message: 'Message updated!' });
	  			});

	  		});


	  };

  Controller.delete_message = function(request,response) {
	  		Message.remove({
	  			_id: req.params.message_id
	  		}, function(err, message) {
	  			if (err)
	  				respponse.send(err);

	  			ressponse.json({ message: 'Successfully deleted' });
	  		});
	  };


  Controller.all_messages = function(request,response) {
		Message.find(function(err, messages) {
			if (err)
				response.send(err);

			response.json(messages);
		});
	  };


  Controller.find_message = function(request,response) {
	  	Message.findById(request.params.message_id, function(err, message) {
	  			if (err)
	  				response.send(err);
	  			response.json(message);
	  		});

  };


  return Controller;

})();

