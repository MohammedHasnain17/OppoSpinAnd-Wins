const Customer = require("../models/Customer");

// ==========================================
// IMEI Luhn Checksum Validation
// ==========================================
const isValidIMEI = (imei) => {
  if (!/^\d{15}$/.test(imei)) {
    return false;
  }

  const digits = imei.split("").map(Number);

  let sum = 0;

  // Process first 14 digits
  for (let i = 0; i < 14; i++) {
    let digit = digits[i];

    // Double every second digit
    if (i % 2 === 1) {
      digit = digit * 2;

      if (digit > 9) {
        digit = digit - 9;
      }
    }

    sum += digit;
  }

  // Calculate check digit
  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit === digits[14];
};

// ==========================================
// Email Validation
// ==========================================
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

// ==========================================
// Customer Registration
// ==========================================
const registerCustomer = async (req, res) => {
  try {
    const {
      name,
      mobile,
      age,
      email,
      imei,
    } = req.body;
        // ==========================================
    // PURCHASE INVOICE VALIDATION
    // ==========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Purchase invoice is required.",
      });
    }

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================
    if (!name || !mobile || !age || !email || !imei) {
      return res.status(400).json({
        success: false,
        message:
          "Name, mobile, age, email and IMEI are required.",
      });
    }

    // ==========================================
    // CLEAN VALUES
    // ==========================================
    const cleanName = String(name).trim();
    const cleanMobile = String(mobile).trim();
    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    // Remove spaces/non-digit characters from IMEI
    const cleanImei = String(imei).replace(/\D/g, "");

    const numericAge = Number(age);

    // ==========================================
    // NAME VALIDATION
    // ==========================================
    if (
      cleanName.length < 2 ||
      cleanName.length > 60
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name.",
      });
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ.' -]+$/.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message:
          "Name can contain letters, spaces, dots, apostrophes and hyphens only.",
      });
    }

    // ==========================================
    // MOBILE VALIDATION
    // ==========================================
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10-digit Indian mobile number.",
      });
    }

    // ==========================================
    // AGE VALIDATION
    // ==========================================
    if (
      !Number.isInteger(numericAge) ||
      numericAge < 18 ||
      numericAge > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid age between 18 and 100.",
      });
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // ==========================================
    // IMEI FORMAT VALIDATION
    // ==========================================
    if (!/^\d{15}$/.test(cleanImei)) {
      return res.status(400).json({
        success: false,
        message:
          "IMEI must contain exactly 15 digits.",
      });
    }

    // ==========================================
    // IMEI CHECKSUM VALIDATION
    // ==========================================
    if (!isValidIMEI(cleanImei)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid IMEI number. Check the IMEI again using *#06#.",
      });
    }

    // ==========================================
    // DUPLICATE IMEI CHECK
    // ==========================================
    const existingIMEI = await Customer.findOne({
      imei: cleanImei,
    });

    if (existingIMEI) {
      return res.status(409).json({
        success: false,
        message:
          "This IMEI has already participated.",
      });
    }

    // ==========================================
    // DUPLICATE MOBILE CHECK
    // ==========================================
    const existingMobile = await Customer.findOne({
      mobile: cleanMobile,
    });

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message:
          "This mobile number has already participated.",
      });
    }

    // ==========================================
    // CREATE CUSTOMER
    // ==========================================
    const customer = await Customer.create({
      name: cleanName,
      mobile: cleanMobile,
      age: numericAge,
      email: cleanEmail,
      imei: cleanImei,

      // Spin information
      prize: null,
      hasSpun: false,
      spinAt: null,
    });

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================
    return res.status(201).json({
      success: true,
      message: "Customer registered successfully.",
      customerId: customer._id,

      customer: {
        id: customer._id,
        name: customer.name,
        mobile: customer.mobile,
        age: customer.age,
        email: customer.email,
        imei: customer.imei,
        prize: customer.prize,
        hasSpun: customer.hasSpun,
        spinAt: customer.spinAt,
        createdAt: customer.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Register customer error:",
      error
    );

    // ==========================================
    // DUPLICATE KEY ERROR
    // ==========================================
    if (error.code === 11000) {
      if (error.keyPattern?.imei) {
        return res.status(409).json({
          success: false,
          message:
            "This IMEI has already participated.",
        });
      }

      if (error.keyPattern?.mobile) {
        return res.status(409).json({
          success: false,
          message:
            "This mobile number has already participated.",
        });
      }

      if (error.keyPattern?.email) {
        return res.status(409).json({
          success: false,
          message:
            "This email address has already participated.",
        });
      }
    }

    // ==========================================
    // VALIDATION ERROR
    // ==========================================
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(" "),
      });
    }

    // ==========================================
    // SERVER ERROR
    // ==========================================
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong. Please try again.",
    });
  }
};

module.exports = {
  registerCustomer,
};