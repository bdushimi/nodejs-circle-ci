const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ArticlesController = require('../controllers/articles');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", ArticlesController.articles_get_all);

router.post("/", checkAuth, upload.single('articleImage'), ArticlesController.articles_create_article);

router.get("/:articleId", checkAuth, ArticlesController.articles_get_article);

router.patch("/:articleId", checkAuth, ArticlesController.articles_update_article);

router.delete("/:articleId", checkAuth, ArticlesController.articles_delete);


module.exports = router;
 