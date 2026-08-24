const Customer = require("../models/Customer");

// ==========================================
// GET SPIN HISTORY
// ==========================================
const getSpinHistory = async (req, res) => {
  try {
    const customers = await Customer.find({
      hasSpun: true,
    })
      .select("name mobile age email imei prize spinAt createdAt")
      .sort({ spinAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      history: customers,
    });
  } catch (error) {
    console.error("History error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch spin history.",
    });
  }
};

// ==========================================
// DELETE CUSTOMER
// ==========================================
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // ID check
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required.",
      });
    }

    // Find and delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    // Customer not found
    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
      customerId: deletedCustomer._id,
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete customer. Please try again.",
    });
  }
};

module.exports = {
  getSpinHistory,
  deleteCustomer,
};