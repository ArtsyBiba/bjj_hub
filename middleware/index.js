const Dojo = require('../models/dojo');
const Comment = require('../models/comment');
let middlewareObj = {};

middlewareObj.checkDojoOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Dojo.findById(req.params.id, function(err, foundDojo){
			if(err || !foundDojo) {
				req.flash('error', 'Sorry, we can\'t find this Dojo');
				res.redirect('back');
			} else {
				// check if user owns the post
				if(foundDojo.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that');
					res.redirect('back');
				}
			}
		});	
	} else {
		req.flash('error', 'Please login first!');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash('error', 'Sorry, we can\'t find this comment');
				res.redirect('back');
			} else {
				// check if user owns the comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error', 'You don\'t have permission to do that');
					res.redirect('back');
				}
			}
		});	
	} else {
		req.flash('error', 'Please login firts!');
		res.redirect('back');
	}
}; 

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'Please login firts!');
	res.redirect('/login');
};

module.exports = middlewareObj;