const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Product = require("../models/Product");

dotenv.config();
connectDB();

const users = [
  {
    name: "Admin User",
    email: "admin@shopeasy.com",
    password: "admin123",
    isAdmin: true
  },
  {
    name: "John Doe",
    email: "john@shopeasy.com",
    password: "123456"
  }
];

const products = [
  {
    name: "Classic White Sneakers",
    image:
      "https://images.unsplash.com/photo-1608379894453-c6b729b05596?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    brand: "UrbanWalk",
    category: "Footwear",
    description: "Comfortable everyday sneakers with premium cushioning.",
    price: 2899,
    countInStock: 15
  },
  {
    name: "Minimal Black Backpack",
    image:
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=600&q=80",
    brand: "CarryCo",
    category: "Accessories",
    description: "Durable backpack with laptop compartment and water resistance.",
    price: 1999,
    countInStock: 22
  },
  {
    name: "Wireless Over-Ear Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    brand: "SonicPro",
    category: "Electronics",
    description: "Noise-isolating headphones with up to 30 hours battery life.",
    price: 4499,
    countInStock: 12
  },
  {
    name: "Slim Fit Denim Jacket",
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80",
    brand: "BlueLine",
    category: "Fashion",
    description: "All-season denim jacket with a modern slim fit silhouette.",
    price: 2599,
    countInStock: 18
  },
  {
    name: "Smartwatch Active S2",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    brand: "PulseTech",
    category: "Electronics",
    description: "Fitness-first smartwatch with heart tracking and GPS support.",
    price: 6999,
    countInStock: 10
  },
  {
    name: "Ceramic Coffee Mug Set",
    image:
      "https://images.unsplash.com/photo-1591728308898-0d025b4af29e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    brand: "HomeNest",
    category: "Home",
    description: "Set of 4 premium ceramic mugs for tea, coffee and hot chocolate.",
    price: 899,
    countInStock: 30
  },
  {
    name: "Portable Bluetooth Speaker",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=600&q=80",
    brand: "BoomBox",
    category: "Electronics",
    description: "Water-resistant wireless speaker with deep bass and 12-hour battery.",
    price: 2399,
    countInStock: 25
  },
  {
    name: "Running Track Pants",
    image:
      "https://images.unsplash.com/photo-1719473466836-ff9f5ebe0e1b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    brand: "StrideFit",
    category: "Fashion",
    description: "Lightweight, breathable track pants designed for all-day comfort.",
    price: 1299,
    countInStock: 20
  },
  {
    name: "Ergonomic Office Chair",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=600&q=80",
    brand: "WorkWise",
    category: "Furniture",
    description: "Mesh back office chair with lumbar support and adjustable height.",
    price: 8999,
    countInStock: 8
  },
  {
    name: "Stainless Steel Water Bottle",
    image:
      "https://images.unsplash.com/photo-1544003484-3cd181d17917?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    brand: "HydroPeak",
    category: "Accessories",
    description: "Leak-proof insulated bottle that keeps drinks cold for 24 hours.",
    price: 699,
    countInStock: 40
  },
  {
    name: "Gaming Mechanical Keyboard",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    brand: "HexaKeys",
    category: "Electronics",
    description: "RGB mechanical keyboard with tactile switches and anti-ghosting.",
    price: 3299,
    countInStock: 14
  },
  {
    name: "Organic Cotton Bedsheet Set",
    image:
      "https://images.unsplash.com/photo-1663247131274-ecbf38ec087c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    brand: "DreamSoft",
    category: "Home",
    description: "Soft breathable bedsheet set made from 100% organic cotton.",
    price: 1799,
    countInStock: 16
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    for (const user of users) {
      await User.create(user);
    }
    await Product.insertMany(products);

    console.log("Sample data imported.");
    process.exit();
  } catch (error) {
    console.error(`Data import failed: ${error.message}`);
    process.exit(1);
  }
};

importData();