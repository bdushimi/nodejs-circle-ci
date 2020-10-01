const mongoose = require("mongoose");
const Article = require("../models/article");

exports.articles_get_all = (req, res, next) => {
  Article.find()
    .select("title content _id articleImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        articles: docs.map(doc => {
          return {
            title: doc.title,
            content: doc.content,
            articleImage: doc.articleImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/articles/" + doc._id
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

exports.articles_create_article = (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    articleImage: req.file.path
  });
  article
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created article successfully",
        createdArticle: {
          title: result.title,
          content: result.content,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/articles/" + result._id
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

exports.articles_get_article = (req, res, next) => {
  const id = req.params.articleId;
  Article.findById(id)
    .select("title content _id articleImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          article: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/articles"
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

exports.articles_update_article = (req, res, next) => {
  const id = req.params.articleId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Article.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Article updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/articles/" + id
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

exports.articles_delete = (req, res, next) => {
  const id = req.params.articleId;
  Article.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Article deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/articles",
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