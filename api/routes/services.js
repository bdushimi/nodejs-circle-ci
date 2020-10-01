const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ServicesController = require('../controllers/services');

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

router.get("/", ServicesController.services_get_all);

router.post("/", checkAuth, upload.single('serviceImage'), ServicesController.services_create_service);

router.get("/:serviceId", checkAuth, ServicesController.services_get_service);

router.patch("/:serviceId", checkAuth, ServicesController.services_update_service);

router.delete("/:serviceId", checkAuth, ServicesController.services_delete);


module.exports = router;
