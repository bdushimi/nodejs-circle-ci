const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const SkillsController = require('../controllers/skills');

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

router.get("/", SkillsController.skills_get_all);

router.post("/", checkAuth, upload.single('skillImage'), SkillsController.skills_create_skill);

router.get("/:skillId", checkAuth, SkillsController.skills_get_skill);

router.patch("/:skillId", checkAuth, SkillsController.skills_update_skill);

router.delete("/:skillId", checkAuth, SkillsController.skills_delete);


module.exports = router;
