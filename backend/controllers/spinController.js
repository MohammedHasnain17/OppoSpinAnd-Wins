const Customer = require("../models/Customer");

// ==========================================
// PRIZES
// ==========================================

const prizes = [
  {
    name: "₹50 Gift Voucher",
    weight: 45,
  },
  {
    name: "₹100 Gift Voucher",
    weight: 25,
  },
  {
    name: "₹200 Gift Voucher",
    weight: 15,
  },
  {
    name: "Wireless Earbuds",
    weight: 7,
  },
  {
    name: "Wireless Neckband",
    weight: 6,
  },
  {
    name: "Special Gift",
    weight: 2,
  },
];

// ==========================================
// RANDOM PRIZE SELECTION
// ==========================================

function choosePrize() {
  const totalWeight = prizes.reduce(
    (total, prize) => total + prize.weight,
    0
  );

  let random = Math.random() * totalWeight;

  for (const prize of prizes) {
    random -= prize.weight;

    if (random <= 0) {
      return prize.name;
    }
  }

  return prizes[0].name;
}

// ==========================================
// SPIN CUSTOMER
// ==========================================

const spinCustomer = async (req, res) => {
  try {
    const { customerId } = req.body;

    // ==========================================
    // CUSTOMER ID CHECK
    // ==========================================

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    // ==========================================
    // FIND CUSTOMER
    // ==========================================

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // ==========================================
    // CHECK ALREADY SPUN
    // ==========================================

    if (customer.hasSpun) {
      return res.status(409).json({
        success: false,
        message: "This customer has already used the spin.",
        prize: customer.prize,
      });
    }

    // ==========================================
    // SELECT PRIZE
    // ==========================================

    const prize = choosePrize();

    // ==========================================
    // SAVE SPIN RESULT
    // ==========================================

    customer.prize = prize;
    customer.hasSpun = true;
    customer.spinAt = new Date();

    await customer.save();

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Spin completed successfully.",
      prize,
    });
  } catch (error) {
    console.error("Spin error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to complete spin.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  spinCustomer,
};