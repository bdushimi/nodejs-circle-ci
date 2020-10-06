const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const CommentsController = require('../controllers/comment.js');



router.get("/", CommentsController.getComments);

router.post("/", checkAuth, CommentsController.postComment);

router.get("/:id", checkAuth, CommentsController.getComment);

router.put("/:id", checkAuth, CommentsController.updateComment);

router.delete("/:id", checkAuth, CommentsController.deleteComment);


module.exports = router;
 