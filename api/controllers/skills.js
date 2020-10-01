const mongoose = require("mongoose");
const Skill = require("../models/skill");

exports.skills_get_all = (req, res, next) => {
  Skill.find()
    .select("title content _id skillImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        skills: docs.map(doc => {
          return {
            title: doc.title,
            content: doc.content,
            skillImage: doc.skillImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/skills/" + doc._id
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

exports.skills_create_skill = (req, res, next) => {
  const skill = new Skill({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    skillImage: req.file.path
  });
  skill
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created skill successfully",
        createdSkill: {
          title: result.title,
          content: result.content,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/skills/" + result._id
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

exports.skills_get_skill = (req, res, next) => {
  const id = req.params.skillId;
  Skill.findById(id)
    .select("title content _id skillImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          skill: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/skills"
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

exports.skills_update_skill = (req, res, next) => {
  const id = req.params.skillId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Skill.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Skill updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/skills/" + id
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

exports.skills_delete = (req, res, next) => {
  const id = req.params.skillId;
  Skill.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Skill deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/skills",
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