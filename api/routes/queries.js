const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const QueriesController = require('../controllers/queries');



router.get("/", checkAuth, QueriesController.queries_get_all);

router.post("/", QueriesController.queries_create_querie);

router.get("/:querieId", checkAuth, QueriesController.queries_get_querie);

router.patch("/:querieId", checkAuth, QueriesController.queries_update_querie);

router.delete("/:querieId", checkAuth, QueriesController.queries_delete);


module.exports = router;
