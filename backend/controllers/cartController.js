const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "cartItems.product",
    select: "name image price countInStock"
  });

  const items = user.cartItems
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      countInStock: item.product.countInStock,
      qty: item.qty
    }));

  res.json(items);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    res.status(400);
    throw new Error("productId and qty are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.countInStock < qty) {
    res.status(400);
    throw new Error("Insufficient stock");
  }

  const user = await User.findById(req.user._id);
  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.qty = Math.min(existingItem.qty + Number(qty), product.countInStock);
  } else {
    user.cartItems.push({ product: productId, qty: Number(qty) });
  }

  await user.save();
  res.status(201).json({ message: "Item added to cart" });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const { productId } = req.params;

  if (!qty || qty < 1) {
    res.status(400);
    throw new Error("qty must be at least 1");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (qty > product.countInStock) {
    res.status(400);
    throw new Error("Qty exceeds stock");
  }

  const user = await User.findById(req.user._id);
  const item = user.cartItems.find((cartItem) => cartItem.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  item.qty = Number(qty);
  await user.save();
  res.json({ message: "Cart item updated" });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await user.save();
  res.json({ message: "Item removed from cart" });
});

const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cartItems = [];
  await user.save();
  res.json({ message: "Cart cleared" });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
