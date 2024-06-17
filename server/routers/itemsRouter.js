const express = require("express");
const itemsController = require("../controllers/itemsController");
const router = express.Router();


router.post("/addItems",itemsController.addItems);
router.get("/getItems",itemsController.getItems);

router.get("/Search/:q",itemsController.Search);



module.exports = router;  