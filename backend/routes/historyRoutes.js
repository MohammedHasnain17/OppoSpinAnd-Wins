
const express = require("express");

const {
  getSpinHistory,
  deleteCustomer,
} = require("../controllers/historyController");

const router = express.Router();

// GET all spin history
router.get("/", getSpinHistory);

// DELETE customer
router.delete("/:id", deleteCustomer);

module.exports = router;