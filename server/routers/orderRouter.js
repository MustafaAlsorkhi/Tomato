const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();


router.post("/addOrder",orderController.addOrder);
router.put("/SubOrder",orderController.SubOrder);
router.get("/getOrder/:orderId",orderController.getOrder);
router.put("/editOrder/:cart_id",orderController.editOrder);
router.put("/addAdd/:cart_id",orderController.addAdd);


router.get("/getOrdersCart/:customer_id",orderController.getOrdersCart);
router.put("/removeFromCart/:item_id",orderController.removeFromCart);
router.put("/addFromCart/:item_id",orderController.addFromCart);




module.exports = router;  