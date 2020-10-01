const mongoose = require("mongoose");
const Service = require("../models/service");

exports.services_get_all = (req, res, next) => {
  Service.find()
    .select("title content _id serviceImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        services: docs.map(doc => {
          return {
            title: doc.title,
            content: doc.content,
            serviceImage: doc.serviceImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/services/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.services_create_service = (req, res, next) => {
  const service = new Service({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    serviceImage: req.file.path
  });
  service
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created service successfully",
        createdService: {
          title: result.title,
          content: result.content,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/services/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.services_get_service = (req, res, next) => {
  const id = req.params.serviceId;
  Service.findById(id)
    .select("title content _id serviceImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          service: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/services"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.services_update_service = (req, res, next) => {
  const id = req.params.serviceId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Service.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Service updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/services/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.services_delete = (req, res, next) => {
  const id = req.params.serviceId;
  Service.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Service deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/services",
          body: { title: "String", content: "String" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};