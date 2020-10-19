let mongoose = require('mongoose');
let Service = require('../models/service');


/*
 * GET /service route to retrieve all the services.
 */
function getServices(req, res) {
	//Query the DB and if no errors, send all the services
	let query = Service.find({});
	query.exec((err, services) => {
		//if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(services);
	});
}

/*
 * POST /service to save a new service.
 */
function postService(req, res) {
	//Creates a new service
	var newService = new Service({
		title: req.body.title,
		content: req.body.content,
		serviceImage: req.file.path
		//serviceImage: req.body.serviceImage
	});
	//Save it into the DB.
	newService.save((err,service) => {
		if(err) {
			res.send(err);
		}
		else { //If no errors, send it back to the client
			res.json({message: "Service successfully added!", service });
		}
	});
}

/*
 * GET /service/:id route to retrieve a service given its id.
 */
function getService(req, res) {
	Service.findById(req.params.id, (err, service) => {
		//if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(service);
	});		
}

/*
 * DELETE /service/:id to delete a service given its id.
 */
function deleteService(req, res) {
	Service.remove({_id : req.params.id}, (err, result) => {
		res.json({ message: "Service successfully deleted!", result });
	});
}

/*
 * PUT /service/:id to updatea a service given its id
 */
function updateService(req, res) {
	Service.findById({_id: req.params.id}, (err, service) => {
		//if(err) res.send(err);
		Object.assign(service, req.body).save((err, service) => {
			//if(err) res.send(err);
			res.json({ message: 'Service updated!', service });
		});	
	});
}

//export all the functions
module.exports = { getServices, postService, getService, deleteService, updateService };