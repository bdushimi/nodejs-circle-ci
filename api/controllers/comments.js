const mongoose = require("mongoose");
const Comment = require("../models/comment");

exports.comments_get_all = (req, res, next) => {
  Comment.find()
    .select("article_id names email _id comment")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        comments: docs.map(doc => {
          return {
            article_id: doc.article_id,
            names: doc.names,
            email: doc.email,
            comment: doc.comment,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/comments/" + doc._id
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

exports.comments_create_comment = (req, res, next) => {
  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
     article_id: req.body.article_id,
     names: req.body.names,
     email: req.body.email,
     comment: req.body.comment
  });
  comment
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created comment successfully",
        createdComment: {

            article_id: result.article_id,
            names: result.names,
            email: result.email,
            comment: result.comment,
            _id: result._id,

          request: {
            type: "GET",
            url: "http://localhost:3000/comments/" + result._id
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

exports.comments_get_comment = (req, res, next) => {
  const id = req.params.commentId;
  Comment.findById(id)
    .select("article_id names email _id comment")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          comment: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/comments"
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

exports.comments_update_comment = (req, res, next) => {
  const id = req.params.commentId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Comment.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Comment updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/comments/" + id
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

exports.comments_delete_comment = (req, res, next) => {
  const id = req.params.commentId;
  Comment.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Comment deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/comments",
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