// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var pug         = require('pug');
var cookieParser = require('cookie-parser');

var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config      = require('./config'); // get our config file
var User        = require('./app/models/user'); // get our mongoose model
var Message     = require('./app/models/message');


var Controller  = require('./controller');

// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

app.use(cookieParser());
app.set('superSecret', config.secret); // secret variable
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({
		name: 'yiorgos',
		password: 'test',
		admin: true
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// basic route (http://localhost:8080)
app.get('/', function(req, res) {
    res.render('index.pug',{})
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
app.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.username
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
            res.cookie('user_token', '');
			res.json({ success: false, message: 'Authentication failed. User '+req.body.username+' not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
                res.cookie('user_token', '');
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

                res.cookie('user_token', token);

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}

		}

	});
});


// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    console.log(req.cookies);

    if (req.cookies['user_token'] && !token) {
        token = req.cookies['user_token'];
    }
	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

apiRoutes.route('/users').get( function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});


apiRoutes.route('/api/message')
	.post(function(req,res) {
		Conroller.create_message(req,res);
	})

	.get(function(req,res) {
		Controller.all_messages(req,res);
	});

apiRoutes.route('/api/message/:message_id')
	.get(function(req, res) {
		Controller.find_message(req,res);
	})
	.put(function(req, res) {
		Controller.update_message(req,res);
	})
	.delete(function(req, res) {
		Controller.delete_message(req,res);
	});



// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
    res.render('index.pug',{})
});


apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);


// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
