const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const SkillsController = require('../controllers/skill.js');

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

router.get("/", SkillsController.getSkills);

router.post("/", checkAuth, upload.single('skillImage'), SkillsController.postSkill);

router.get("/:id", checkAuth, SkillsController.getSkill);

router.put("/:id", checkAuth, SkillsController.updateSkill);

router.delete("/:id", checkAuth, SkillsController.deleteSkill);


module.exports = router;
 