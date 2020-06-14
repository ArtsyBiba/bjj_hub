const express = require('express');
const router = express.Router();
const Dojo = require('../models/dojo');
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');
 
let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);

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
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		let lat = data[0].latitude;
		let lng = data[0].longitude;
		let location = data[0].formattedAddress;
		let newDojo = {name: name, image: image, fee: fee, description: description, author: author, location: location, lat: lat, lng: lng};
		// Create a new dojo and save to DB
		Dojo.create(newDojo, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else {
				//redirect back to dojos page
				res.redirect('/dojos');
			}
		});
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
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.dojo.lat = data[0].latitude;
    req.body.dojo.lng = data[0].longitude;
    req.body.dojo.location = data[0].formattedAddress;

    Dojo.findByIdAndUpdate(req.params.id, req.body.dojo, function(err, dojo){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully Updated!');
            res.redirect('/dojos/' + dojo._id);
        }
    });
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
