import { useState } from "react";
import { useNavigate } from "react-router-dom";

function validateName(name) {
  const value = name.trim();

  if (value.length < 2 || value.length > 60) {
    return false;
  }

  return /^[A-Za-zÀ-ÖØ-öø-ÿ.' -]+$/.test(value);
}

function validateEmail(email) {
  const value = email.trim().toLowerCase();

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function validateIMEI(imei) {
  const value = imei.replace(/\D/g, "");

  // IMEI must contain exactly 15 digits
  if (!/^\d{15}$/.test(value)) {
    return false;
  }

  // IMEI Luhn checksum
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    let digit = Number(value[i]);

    if (i % 2 === 1) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  const checkDigit = Number(value[14]);

  return (sum + checkDigit) % 10 === 0;
}

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    email: "",
    imei: "",
  });

  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let newValue = value;

    // Mobile: numbers only, maximum 10 digits
    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Age: numbers only, maximum 3 digits
    if (name === "age") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    // IMEI: numbers only, maximum 15 digits
    if (name === "imei") {
      newValue = value.replace(/\D/g, "").slice(0, 15);
    }

    setFormData((previous) => ({
      ...previous,
      [name]: newValue,
    }));

    setError("");
  };

  const handleInvoiceChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG or PDF invoice.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Invoice size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setInvoice(file);
    setError("");
  };

  const removeInvoice = () => {
    setInvoice(null);

    const invoiceInput = document.getElementById("invoice");

    if (invoiceInput) {
      invoiceInput.value = "";
    }

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const name = formData.name.trim();
    const mobile = formData.mobile.trim();
    const age = Number(formData.age);
    const email = formData.email.trim().toLowerCase();
    const cleanImei = formData.imei.replace(/\D/g, "");

    // -------------------------
    // NAME VALIDATION
    // -------------------------

    if (!validateName(name)) {
      setError(
        "Please enter a valid full name. Numbers are not allowed."
      );
      return;
    }

    // -------------------------
    // MOBILE VALIDATION
    // -------------------------

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    // -------------------------
    // AGE VALIDATION
    // -------------------------

    if (
      !Number.isInteger(age) ||
      age < 18 ||
      age > 100
    ) {
      setError(
        "Please enter a valid age between 18 and 100."
      );
      return;
    }

    // -------------------------
    // EMAIL VALIDATION
    // -------------------------

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // -------------------------
    // IMEI VALIDATION
    // -------------------------

    if (!validateIMEI(cleanImei)) {
      setError(
        "Please enter a valid 15-digit IMEI number."
      );
      return;
    }

    // -------------------------
    // INVOICE VALIDATION
    // -------------------------

    if (!invoice) {
      setError("Please upload your purchase invoice.");
      return;
    }

    // -------------------------
    // SEND TO BACKEND
    // -------------------------

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", name);
      data.append("mobile", mobile);
      data.append("age", String(age));
      data.append("email", email);
      data.append("imei", cleanImei);

      // Invoice
      data.append("invoice", invoice);

      const response = await fetch(
        "http://localhost:5000/api/customers/register",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to register customer."
        );

        setLoading(false);
        return;
      }

      // Save customer information for Spin page
      sessionStorage.setItem(
        "spinCustomer",
        JSON.stringify({
          name,
          mobile,
          age,
          email,
          imei: cleanImei,
          customerId: result.customerId,
        })
      );

      navigate("/spin");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-500 via-white to-green-600 px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-[0_20px_60px_rgba(16,185,129,0.16)]">

          {/* =========================
              HEADER
          ========================== */}

          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-green-500 px-6 py-9 text-center text-white">

            {/* Decorative circles */}
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-white/10" />

            <div className="relative">

              {/* Logo */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl ring-4 ring-white/20">
                <span className="text-xl font-black tracking-tight text-emerald-600">
                  OPPO
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Spin & Win
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-emerald-50">
                Enter your details for a chance to win an exciting gift.
              </p>
            </div>
          </div>

          {/* =========================
              FORM
          ========================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white p-6 sm:p-7"
          >

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name <span className="text-emerald-600">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* MOBILE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Mobile Number <span className="text-emerald-600">*</span>
              </label>

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                placeholder="10-digit mobile number"
                autoComplete="tel"
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* AGE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Age <span className="text-emerald-600">*</span>
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                inputMode="numeric"
                placeholder="Enter your age"
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address <span className="text-emerald-600">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* IMEI */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                IMEI Number <span className="text-emerald-600">*</span>
              </label>

              <input
                type="text"
                inputMode="numeric"
                name="imei"
                value={formData.imei}
                onChange={handleChange}
                maxLength={15}
                placeholder="Enter 15-digit IMEI"
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3.5 text-sm font-medium tracking-wide text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <p className="mt-2 text-xs font-medium leading-5 text-slate-400">
                You can find your IMEI by dialing *#06# on your phone.
              </p>
            </div>

            {/* INVOICE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Purchase Invoice{" "}
                <span className="text-emerald-600">*</span>
              </label>

              {!invoice ? (
                <label
                  htmlFor="invoice"
                  className="group flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-green-50 px-4 py-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-emerald-100 transition group-hover:scale-105">
                    📄
                  </div>

                  <p className="text-sm font-bold text-slate-700">
                    Upload your invoice
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    JPG, PNG or PDF • Maximum 5MB
                  </p>

                  <input
                    id="invoice"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={handleInvoiceChange}
                  />
                </label>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-emerald-100">
                      {invoice.type === "application/pdf"
                        ? "📕"
                        : "🖼️"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {invoice.name}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-emerald-600">
                        Invoice selected successfully
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {(invoice.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeInvoice}
                      className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs font-medium text-slate-400">
                Your purchase invoice is required for verification.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-600">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 px-5 py-4 text-base font-extrabold tracking-wide text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "VERIFYING & UPLOADING..."
                : "PROCEED"}
            </button>

            {/* FOOTER */}

            <p className="text-center text-xs font-medium leading-5 text-slate-400">
              By continuing, you agree to the applicable campaign terms.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Home;