const express = require("express");

const {
  spinCustomer,
} = require("../controllers/spinController");

const router = express.Router();

router.post("/", spinCustomer);

module.exports = router;