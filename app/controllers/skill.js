let mongoose = require('mongoose');
let Skill = require('../models/skill');


/*
 * GET /skill route to retrieve all the skills.
 */
function getSkills(req, res) {
	//Query the DB and if no errors, send all the skills
	let query = Skill.find({});
	query.exec((err, skills) => {
		if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(skills);
	});
}

/*
 * POST /skill to save a new skill.
 */
function postSkill(req, res) {
	//Creates a new skill
	var newSkill = new Skill({
		title: req.body.title,
		content: req.body.content,
		skillImage: req.file.path
		//skillImage: req.body.skillImage
	});
	//Save it into the DB.
	newSkill.save((err,skill) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "Skill successfully added!", skill });
		}
	});
}

/*
 * GET /skill/:id route to retrieve a skill given its id.
 */
function getSkill(req, res) {
	Skill.findById(req.params.id, (err, skill) => {
		if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(skill);
	});		
}

/*
 * DELETE /skill/:id to delete a skill given its id.
 */
function deleteSkill(req, res) {
	Skill.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "Skill successfully deleted!", result });
	});
}

/*
 * PUT /skill/:id to updatea a skill given its id
 */
function updateSkill(req, res) {
	Skill.findById({_id: req.params.id}, (err, skill) => {
		if(err) res.send(err);
		Object.assign(skill, req.body).save((err, skill) => {
			if(err) res.send(err);
			res.json({ message: 'Skill updated!', skill });
		});	
	});
}

//export all the functions
module.exports = { getSkills, postSkill, getSkill, deleteSkill, updateSkill };