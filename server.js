// Get the packages
///////////////////
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


// Import the controlers
////////////////////////
var TimelineCtrl  = require('./controllers/timelineCtrl');
var MessageCtrl   = require('./controllers/messageCtrl');
var ToDoCtrl      = require('./controllers/todoCtrl');
var QACtrl        = require('./controllers/qaCtrl'); 

var timeline_ctrl = new TimelineCtrl();
var message_ctrl  = new MessageCtrl();
var todo_ctrl     = new ToDoCtrl();
var qa_ctrl       = new QACtrl();


// Configure Database 
/////////////////////
mongoose.Promise = require('bluebird');
var port = process.env.PORT || 5000; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

// Configure Express
////////////////////
app.use(cookieParser());
app.set('superSecret', config.secret); // secret variable
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

// use body parser so we can get info from POST and/or URL parameters
/////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
////////////////////////////////////////////
app.use(morgan('dev'));

// SetUp Route 
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({
		name: 'test',
		password: 'test',
		admin: true
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});


// Signout Route
app.get('/signout',function(req,res) { 
    res.clearCookie('user_token');
    res.redirect('/');
});


// home route 
app.get('/', function(req, res) {
    var token = req.cookies['user_token'];
    if(token && token.length > 500) { 
        res.redirect('/home');
    } else { 
        res.render('index.pug',{});
    }
});

// Get an instance for the api routes
var apiRoutes = express.Router();

// Gen at instance for secure page routes
var pageRoutes = express.Router();


// authenticate using username and password
app.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.username
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
            res.clearCookie("user_token");
			res.json({ success: false, message: 'Authentication failed. User '+req.body.username+' not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
                res.clearCookie("user_token");
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


// checks if we have already logged in
auth_func = function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];


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

};

// both routes use thsi function
apiRoutes.use(auth_func);
pageRoutes.use(auth_func);


// api routes
/////////////
apiRoutes.route('/users').get( function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.route('/all').get( function(req, res) {
    timeline_ctrl.all(req,res);
});

apiRoutes.route('/message')
	.post(function(req,res) {
		message_ctrl.create(req,res);
	})

	.get(function(req,res) {
		message_ctrl.all(req,res);
	});

apiRoutes.route('/todo')
	.post(function(req,res) {
		todo_ctrl.create(req,res);
	})

	.get(function(req,res) {
		todo_ctrl.all(req,res);
	});

apiRoutes.route('/qa')
	.post(function(req,res) {
		qa_ctrl.create(req,res);
	})

	.get(function(req,res) {
		qa_ctrl.all(req,res);
	});


apiRoutes.route('/message/:message_id')
	.get(function(req, res) {
		message_ctrl.get(req,res);
	})
	.put(function(req, res) {
		mesage_ctrl.update(req,res);
	})
	.delete(function(req, res) {
		message_ctrl.remove(req,res);
	});

apiRoutes.get('/', function(req, res) {
    res.render('index.pug',{})
});

apiRoutes.get('/home', function(req, res) {
        res.render('home.pug',{});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

// Page routes
//////////////
pageRoutes.get('/timeline', function(req, res) {
    res.render('timeline.pug',{})
});

pageRoutes.get('/message/:message_id', function(req, res) {
    console.log(req.params.message_id);
    res.render('message.pug',{id:req.params.message_id})
});

app.use('/api', apiRoutes);
app.use('/page', pageRoutes);

// start
////////
app.listen(port);
