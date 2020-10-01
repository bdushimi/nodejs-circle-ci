const mongoose = require("mongoose");
const Profession = require("../models/profession");

exports.professions_get_all = (req, res, next) => {
  Profession.find()
    .select("welcomeMessage professionTitle _id professionImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        professions: docs.map(doc => {
          return {
            welcomeMessage: doc.welcomeMessage,
            professionTitle: doc.professionTitle,
            professionImage: doc.professionImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/professions/" + doc._id
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

exports.professions_create_profession = (req, res, next) => {
  const profession = new Profession({
    _id: new mongoose.Types.ObjectId(),
    welcomeMessage: req.body.welcomeMessage,
    professionTitle: req.body.professionTitle,
    professionImage: req.file.path

  });
  profession
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created profession successfully",
        createdProfession: {
          welcomeMessage: result.welcomeMessage,
          professionTitle: result.professionTitle,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/professions/" + result._id
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

exports.professions_get_profession = (req, res, next) => {
  const id = req.params.professionId;
  Profession.findById(id)
    .select("welcomeMessage professionTitle _id professionImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          professionTitle: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/professions"
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

exports.professions_update_profession = (req, res, next) => {
  const id = req.params.professionId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Profession.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Profession updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/professions/" + id
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

exports.professions_delete = (req, res, next) => {
  const id = req.params.professionId;
  Profession.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Profession deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/professions",
          body: { professiontitle: "String", welcomeMessage: "String" }
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