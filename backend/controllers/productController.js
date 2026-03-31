const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};

  const products = await Product.find({ ...category }).sort({
    createdAt: -1
  });
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, image, brand, category, description, price, countInStock } =
    req.body;

  if (!name || !category || !description || price == null || countInStock == null) {
    res.status(400);
    throw new Error("Missing required product fields");
  }

  const product = await Product.create({
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatableFields = [
    "name",
    "image",
    "brand",
    "category",
    "description",
    "price",
    "countInStock"
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
