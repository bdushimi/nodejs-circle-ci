const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProfessionsController = require('../controllers/profession.js');

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

router.get("/", ProfessionsController.getProfessions);

router.post("/", checkAuth, upload.single('professionImage'), ProfessionsController.postProfession);

router.get("/:id", checkAuth, ProfessionsController.getProfession);

router.put("/:id", checkAuth, ProfessionsController.updateProfession);

router.delete("/:id", checkAuth, ProfessionsController.deleteProfession);


module.exports = router;
 