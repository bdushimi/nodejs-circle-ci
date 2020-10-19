let mongoose = require('mongoose');
let Article = require('../models/article');


/*
 * GET /article route to retrieve all the articles.
 */
function getArticles(req, res) {
	//Query the DB and if no errors, send all the articles
	let query = Article.find({});
	query.exec((err, articles) => {
		//if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(articles);
	});
}

/*
 * POST /article to save a new article.
 */
function postArticle(req, res) {
	//Creates a new article
	var newArticle = new Article({
		title: req.body.title,
		content: req.body.content,
		articleImage: req.file.path
		//articleImage: req.body.articleImage
	});
	//Save it into the DB.
	newArticle.save((err,article) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "Article successfully added!", article });
		}
	});
}

/*
 * GET /article/:id route to retrieve a article given its id.
 */
function getArticle(req, res) {
	Article.findById(req.params.id, (err, article) => {
		//if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(article);
	});		
}

/*
 * DELETE /article/:id to delete a article given its id.
 */
function deleteArticle(req, res) {
	Article.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "Article successfully deleted!", result });
	});
}

/*
 * PUT /article/:id to updatea a article given its id
 */
function updateArticle(req, res) {
	Article.findById({_id: req.params.id}, (err, article) => {
		//if(err) res.send(err);
		Object.assign(article, req.body).save((err, article) => {
			//if(err) res.send(err);
			res.json({ message: 'Article updated!', article });
		});	
	});
}

//export all the functions
module.exports = { getArticles, postArticle, getArticle, deleteArticle, updateArticle };