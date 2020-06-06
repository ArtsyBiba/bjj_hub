const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root route
router.get('/', function(req, res){
	res.render('home');
});

// Show register form
router.get('/register', function(req, res){
	res.render('register');
});

// Handle sign up logic
router.post('/register', function(req, res){
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to BJJ Hub, ' + user.username + '!');
			res.redirect('/dojos');
		});
	});
});

// Show login form
router.get('/login', function(req, res){
	res.render('login');
});

// Handling login logic
router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/dojos",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome back, " + req.body.username + "!"
    })(req, res);
});

// Logout route
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You\'re logged out now!');
	res.redirect('/dojos');
});

module.exports = router;
