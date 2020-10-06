let mongoose = require('mongoose');
let Comment = require('../models/comment');


/*
 * GET /comment route to retrieve all the comments.
 */
function getComments(req, res) {
	//Query the DB and if no errors, send all the comments
	let query = Comment.find({});
	query.exec((err, comments) => {
		if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(comments);
	});
}

/*
 * POST /comment to save a new comment.
 */
function postComment(req, res) {
	//Creates a new comment
	var newComment = new Comment({
		article_id: req.body.article_id,
		names: req.body.names,
		email: req.body.email,
		comment: req.body.comment
	});
	//Save it into the DB.
	newComment.save((err,comment) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "Comment successfully added!", comment });
		}
	});
}

/*
 * GET /comment/:id route to retrieve a comment given its id.
 */
function getComment(req, res) {
	Comment.findById(req.params.id, (err, comment) => {
		if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(comment);
	});		
}

/*
 * DELETE /comment/:id to delete a comment given its id.
 */
function deleteComment(req, res) {
	Comment.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "Comment successfully deleted!", result });
	});
}

/*
 * PUT /comment/:id to updatea a comment given its id
 */
function updateComment(req, res) {
	Comment.findById({_id: req.params.id}, (err, comment) => {
		if(err) res.send(err);
		Object.assign(comment, req.body).save((err, comment) => {
			if(err) res.send(err);
			res.json({ message: 'Comment updated!', comment });
		});	
	});
}

//export all the functions
module.exports = { getComments, postComment, getComment, deleteComment, updateComment };