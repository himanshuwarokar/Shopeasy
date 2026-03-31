const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(createOrder).get(admin, getOrders);
router.get("/mine", getMyOrders);
router.route("/:id").get(getOrderById).put(admin, updateOrderStatus);

module.exports = router;
