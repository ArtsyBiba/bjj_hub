const express = require('express');
const router = express.Router({mergeParams: true});
const Dojo = require('../models/dojo');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res){
	Dojo.findById(req.params.id, function(err, dojo){
		if(err || !dojo){
			req.flash('error', 'Dojo not found');
			res.redirect('back');
		} else {
			res.render('comments/new', {dojo: dojo});
		}
	});
});

// CREATE ROUTE
router.post(('/'), middleware.isLoggedIn, function(req,res){
		Dojo.findById(req.params.id, function(err, dojo){
		if(err){
			console.log(err);
			res.redirect('/dojos');
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', 'Sorry, something went wrong');
					console.log(err);
				} else {
					// add username & id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					dojo.comments.push(comment);
					dojo.save();
					req.flash('success', 'Successfully added comment!');
					res.redirect('/dojos/' + dojo._id);
				}
			});
		}
	});
});

// EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
	Dojo.findById(req.params.id, function(err, foundDojo){
		if(err || !foundDojo) {
			req.flash('error', 'No Dojo found');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				res.redirect('back');
			} else {
				res.render('comments/edit', {dojo_id: req.params.id, comment: foundComment});
			}
		});
	});
});

// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect('back');
		} else {
			res.redirect('/dojos/' + req.params.id);
		}
	});
});

// DESTROY ROUTE - delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted!');
			res.redirect('/dojos/' + req.params.id);
		}
	});
});

module.exports = router;