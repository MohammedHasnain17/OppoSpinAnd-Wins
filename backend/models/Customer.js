const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    imei: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{15}$/,
    },

    prize: {
      type: String,
      default: null,
    },

    hasSpun: {
      type: Boolean,
      default: false,
    },

    spinAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);