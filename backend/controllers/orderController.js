const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const user = await User.findById(req.user._id).populate({
    path: "cartItems.product",
    select: "name image price countInStock"
  });

  if (!user.cartItems.length) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const orderItems = user.cartItems
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      qty: item.qty
    }));

  if (!orderItems.length) {
    res.status(400);
    throw new Error("No valid cart items");
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.name}`);
    }
  }

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "Cash on Delivery",
    totalPrice
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.countInStock -= item.qty;
    await product.save();
  }

  user.cartItems = [];
  await user.save();

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not allowed to view this order");
  }

  res.json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  order.status = status;
  order.isDelivered = status === "Delivered";
  order.deliveredAt = status === "Delivered" ? Date.now() : null;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus
};
