let mongoose = require('mongoose');
let Profession = require('../models/profession');


/*
 * GET /profession route to retrieve all the professions.
 */
function getProfessions(req, res) {
	//Query the DB and if no errors, send all the professions
	let query = Profession.find({});
	query.exec((err, professions) => {
		//if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(professions);
	});
}

/*
 * POST /profession to save a new profession.
 */
function postProfession(req, res) {
	//Creates a new profession
	var newProfession = new Profession({
		welcomeMessage: req.body.welcomeMessage,
		professionTitle: req.body.professionTitle,
		professionImage: req.file.path
		//professionImage: req.body.professionImage
	});
	//Save it into the DB.
	newProfession.save((err,profession) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "Profession successfully added!", profession });
		}
	});
}

/*
 * GET /profession/:id route to retrieve a profession given its id.
 */
function getProfession(req, res) {
	Profession.findById(req.params.id, (err, profession) => {
		//if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(profession);
	});		
}

/*
 * DELETE /profession/:id to delete a profession given its id.
 */
function deleteProfession(req, res) {
	Profession.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "Profession successfully deleted!", result });
	});
}

/*
 * PUT /profession/:id to updatea a profession given its id
 */
function updateProfession(req, res) {
	Profession.findById({_id: req.params.id}, (err, profession) => {
		//if(err) res.send(err);
		Object.assign(profession, req.body).save((err, profession) => {
			//if(err) res.send(err);
			res.json({ message: 'Profession updated!', profession });
		});	
	});
}

//export all the functions
module.exports = { getProfessions, postProfession, getProfession, deleteProfession, updateProfession };