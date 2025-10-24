// const express = require('express');
// const cors = require('cors');
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Mock product data
const products = [
  { id: 1, name: "Laptop", price: 750 },
  { id: 2, name: "Headphones", price: 120 },
  { id: 3, name: "Keyboard", price: 60 }
];

// Routes
app.get("/api/products", async(req, res) => {

  // const randomError = Math.random() < 0.5; // 50% chance of failure

  // if (randomError) {
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }

  let delay = Math.floor(Math.random() * 5000 - 1000 + 1) + 4000; // Random delay between 1s to 5s
  console.log(`Delaying response by ${delay} ms`);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, delay));

  res.status(200).json(products);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost: ${PORT}`);
});
