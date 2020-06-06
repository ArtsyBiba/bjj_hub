const express = require('express');
const router = express.Router();
const Dojo = require('../models/dojo');
const middleware = require('../middleware');

// INDEX ROUTE - list all dojos
router.get('/', function(req, res){
	// Get all dojos from DB
	Dojo.find({}, function(err, allDojos){
		if(err){
			console.log(err);
		} else {
			res.render('./dojos/index', {dojos: allDojos});	
		}
	});
});

// NEW ROUTE - show the form to create new dojo
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('./dojos/new');
});

// CREATE ROUTE - create new dojo and redirect to the list
router.post('/', middleware.isLoggedIn, function(req, res){
	let name = req.body.name;
	let fee = req.body.fee;
	let image = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user.id,
		username: req.user.username
	};
	let newDojo = {name: name, fee: fee, image: image, description: description, author: author};
	Dojo.create(newDojo, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect('/dojos');
		}
	});
});

// SHOW ROUTE - more info about one dojo
router.get('/:id', function(req, res){
	Dojo.findById(req.params.id).populate('comments').exec(function(err, foundDojo){
		if(err || !foundDojo){
			req.flash('error', 'Dojo not found');
			res.redirect('back');
		} else {
			res.render('./dojos/show', {dojo: foundDojo});
		}
	});
});

// EDIT ROUTE - edit dojo info
router.get('/:id/edit', middleware.checkDojoOwnership, function(req, res){
	Dojo.findById(req.params.id, function(err, foundDojo){
		res.render('dojos/edit', {dojo: foundDojo});
	});
});

// UPDATE ROUTE - update dojo info
router.put('/:id', middleware.checkDojoOwnership, function(req, res){
	Dojo.findByIdAndUpdate(req.params.id, req.body.dojo, function(err, updatedDojo){
		if(err){
			res.redirect('/dojos');
		} else {
			res.redirect('/dojos/' + req.params.id);
		}
	});
});

// DESTROY ROUTE - delete dojo
router.delete('/:id', middleware.checkDojoOwnership, function(req, res){
	Dojo.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/dojos');
		} else {
			req.flash('success', 'Dojo deleted!');
			res.redirect('/dojos');
		}
	});
});

module.exports = router;
