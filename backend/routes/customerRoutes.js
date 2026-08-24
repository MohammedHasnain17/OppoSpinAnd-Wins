// const express = require("express");

// const {
//   registerCustomer,
// } = require("../controllers/customerController");

// const router = express.Router();

// router.post("/register", registerCustomer);

// module.exports = router;




const express = require("express");

const {
  registerCustomer,
} = require("../controllers/customerController");

const upload = require("../middleware/upload");

const router = express.Router();

// Customer registration with purchase invoice upload
router.post(
  "/register",
  (req, res, next) => {
    upload.single("invoice")(req, res, (error) => {
      if (error) {
        console.error("Invoice upload error:", error);

        return res.status(400).json({
          success: false,
          message:
            error.message ||
            "Invoice upload failed. Please upload a JPG, PNG or PDF file under 5MB.",
        });
      }

      next();
    });
  },
  registerCustomer
);

module.exports = router;