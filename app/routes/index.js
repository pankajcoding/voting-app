'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var Poll = require('../models/polls.js');
module.exports = function(app, passport) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/index.html');
		});
	app.route('/addPoll')
		.get(isLoggedIn, function(req, res) {
			console.log(req.user);
			res.sendFile(path + '/public/addPoll.html');
		});
	app.route('/addPoll')
		.post(isLoggedIn, function(req, res) {
			var title = req.body.title;
			var options = req.body.options;
			console.log(title, options);
			var lines = options.split(/\n/);
			var texts = [];
			for (var i = 0; i < lines.length; i++) {
				// only push this line if it contains a non whitespace character.
				if (/\S/.test(lines[i])) {
					texts.push(lines[i].replace(/(^\s+|\s+$)/g, ''));
				}
			}
			console.log(texts);

			var newPoll = new Poll();

			newPoll.title = title;
			newPoll.creator = req.user._id;
			//newPoll.options = texts;
			for (var i = 0; i < texts.length; i++) {
				newPoll.options.push({
					optionTitle: texts[i],
					votes: 0
				});


			}

			newPoll.save(function(err, result) {
				if (err) {
					throw err;
				}

				console.log(result);
				var id=result._id;
				res.status(200);
				var newurl=`/poll/${id}`
				res.redirect(newurl);

			});



		});
		
	app.route('/poll/:id')
		.get(function(req, res) {
			var id=req.params.id;
			console.log(id);
			Poll.findOne({'_id':id},function(err,poll){
				if(err){
					res.send(err);
				}
				//res.json(poll);
				res.render('viewpoll',{poll:poll})
				
			});
			
			
		    // res.render("viewpoll.ejs");
		    
		});


	app.route('/login')
		.get(function(req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function(req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
