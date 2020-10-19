let mongoose = require('mongoose');
let Querie = require('../models/querie');


/*
 * GET /querie route to retrieve all the queries.
 */
function getQueries(req, res) {
	//Query the DB and if no errors, send all the queries
	let query = Querie.find({});
	query.exec((err, queries) => {
		//if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(queries);
	});
}

/*
 * POST /querie to save a new querie.
 */
function postQuerie(req, res) {
	//Creates a new querie
	var newQuerie = new Querie({
		names: req.body.names,
		email: req.body.email,
		subject: req.body.subject,
		message: req.body.message
	});
	//Save it into the DB.
	newQuerie.save((err,querie) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "Querie successfully added!", querie });
		}
	});
}

/*
 * GET /querie/:id route to retrieve a querie given its id.
 */
function getQuerie(req, res) {
	Querie.findById(req.params.id, (err, querie) => {
		//if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(querie);
	});		
}

/*
 * DELETE /querie/:id to delete a querie given its id.
 */
function deleteQuerie(req, res) {
	Querie.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "Querie successfully deleted!", result });
	});
}

/*
 * PUT /querie/:id to updatea a querie given its id
 */
function updateQuerie(req, res) {
	Querie.findById({_id: req.params.id}, (err, querie) => {
		//if(err) res.send(err);
		Object.assign(querie, req.body).save((err, querie) => {
			//if(err) res.send(err);
			res.json({ message: 'Querie updated!', querie });
		});	
	});
}

//export all the functions
module.exports = { getQueries, postQuerie, getQuerie, deleteQuerie, updateQuerie };