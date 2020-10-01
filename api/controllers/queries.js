const mongoose = require("mongoose");
const Querie = require("../models/querie");

exports.queries_get_all = (req, res, next) => {
  Querie.find()
    .select("names email subject _id message")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        queries: docs.map(doc => {
          return {
            names: doc.names,
            email: doc.email,
            subject: doc.subject,
            message: doc.message,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/queries/" + doc._id
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

exports.queries_create_querie = (req, res, next) => {
  const querie = new Querie({
    _id: new mongoose.Types.ObjectId(),
    names: req.body.names,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  });
  querie
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created query successfully",
        createdQuerie: {

          names: result.names,
          email: result.email,
          subject: result.subject,
          message: result.message,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/queries/" + result._id
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

exports.queries_get_querie = (req, res, next) => {
  const id = req.params.querieId;
  Querie.findById(id)
    .select("names email subject _id message")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          querie: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/queries"
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

exports.queries_update_querie = (req, res, next) => {
  const id = req.params.querieId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Querie.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Querie updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/queries/" + id
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

exports.queries_delete = (req, res, next) => {
  const id = req.params.querieId;
  Querie.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Querie deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/queries",
          body: { names: "String", message: "String" }
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