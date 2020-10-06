const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const QueriesController = require('../controllers/querie.js');



router.get("/", QueriesController.getQueries);

router.post("/", checkAuth, QueriesController.postQuerie);

router.get("/:id", checkAuth, QueriesController.getQuerie);

router.put("/:id", checkAuth, QueriesController.updateQuerie);

router.delete("/:id", checkAuth, QueriesController.deleteQuerie);


module.exports = router;
 