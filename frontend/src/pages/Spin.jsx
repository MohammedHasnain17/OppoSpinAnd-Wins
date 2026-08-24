import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const prizes = [
  {
    name: "₹50 Gift Voucher",
    image: null,
    emoji: "🎁",
  },
  {
    name: "₹100 Gift Voucher",
    image: null,
    emoji: "🎟️",
  },
  {
    name: "₹200 Gift Voucher",
    image: null,
    emoji: "💳",
  },
  {
    name: "Wireless Earbuds",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80",
    emoji: "🎧",
  },
  {
    name: "Wireless Neckband",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    emoji: "🎧",
  },
  {
    name: "Special Gift",
    image: null,
    emoji: "🎁",
  },
];

function Spin() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedCustomer = sessionStorage.getItem("spinCustomer");

    if (!savedCustomer) {
      navigate("/");
      return;
    }

    try {
      setCustomer(JSON.parse(savedCustomer));
    } catch (error) {
      console.error("Customer data error:", error);

      sessionStorage.removeItem("spinCustomer");
      navigate("/");
    }
  }, [navigate]);

  const spinWheel = async () => {
    if (spinning || !customer) {
      return;
    }

    setSpinning(true);
    setError("");

    try {
      const response = await fetch("https://oppospinand-wins-backend.onrender.com/api/spin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer._id || customer.customerId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to complete spin."
        );
      }

      const prize = data.prize;

      /*
       * Backend se mila prize wheel me find karo.
       */
      const winningIndex = prizes.findIndex(
        (item) => item.name === prize
      );

      if (winningIndex === -1) {
        throw new Error(
          "Invalid prize received from server."
        );
      }

      /*
       * 6 segments hain.
       */
      const segmentAngle = 360 / prizes.length;

      /*
       * Winning prize ko pointer ke neeche stop karna.
       */
      const extraRotation =
        360 * 5 +
        (360 -
          winningIndex * segmentAngle -
          segmentAngle / 2);

      setRotation(
        (previous) => previous + extraRotation
      );

      /*
       * Animation complete hone ke baad result page.
       */
      setTimeout(() => {
        sessionStorage.setItem(
          "spinResult",
          JSON.stringify({
            customer,
            prize,
          })
        );

        navigate("/result");
      }, 5000);
    } catch (error) {
      console.error("Spin error:", error);

      setError(
        error.message ||
          "Unable to complete spin. Please try again."
      );

      setSpinning(false);
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 px-4 py-6 text-slate-800">

      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-md flex-col items-center justify-center">

        {/* HEADER */}
        <div className="mb-6 w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-100">

          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 px-6 py-7 text-center text-white">

            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-black text-green-600 shadow-lg">
              OPPO
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-50">
              Good Luck
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Spin & Win
            </h1>

            <p className="mt-2 text-sm text-white/90">
              Spin the wheel and discover your gift!
            </p>
          </div>

        </div>

        {/* CUSTOMER GREETING */}
        <div className="mb-5 w-full rounded-2xl border border-green-100 bg-white px-5 py-4 text-center shadow-md">

          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Welcome
          </p>

          <p className="mt-1 truncate text-lg font-extrabold text-slate-800">
            {customer.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your lucky spin is ready!
          </p>

        </div>

        {/* WHEEL */}
        <div className="relative flex h-[340px] w-[340px] items-center justify-center sm:h-[370px] sm:w-[370px]">

          {/* POINTER */}
          <div className="absolute -top-2 z-30">

            <div className="relative">

              <div className="h-0 w-0 border-l-[19px] border-r-[19px] border-t-[34px] border-l-transparent border-r-transparent border-t-green-700 drop-shadow-xl" />

              <div className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-md" />

            </div>

          </div>

          {/* OUTER RING */}
          <div className="absolute h-full w-full rounded-full bg-white p-2 shadow-[0_15px_50px_rgba(22,163,74,0.25)]">

            {/* WHEEL */}
            <div
              className="relative h-full w-full overflow-hidden rounded-full border-[8px] border-green-700 transition-transform"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: spinning ? "5s" : "0s",
                transitionTimingFunction:
                  "cubic-bezier(0.12, 0.8, 0.15, 1)",
                background:
                  "conic-gradient(#16a34a 0deg 60deg, #86efac 60deg 120deg, #22c55e 120deg 180deg, #bbf7d0 180deg 240deg, #16a34a 240deg 300deg, #dcfce7 300deg 360deg)",
              }}
            >

              {/* SEGMENT DIVIDERS */}
              {prizes.map((prize, index) => {
                const angle =
                  (360 / prizes.length) * index;

                return (
                  <div
                    key={`divider-${index}`}
                    className="absolute left-1/2 top-1/2 h-1/2 w-[2px] origin-bottom bg-white/70"
                    style={{
                      transform: `rotate(${angle}deg) translateX(-50%)`,
                    }}
                  />
                );
              })}

              {/* PRIZE ITEMS */}
              {prizes.map((prize, index) => {
                const angle =
                  (360 / prizes.length) * index;

                return (
                  <div
                    key={`${prize.name}-${index}`}
                    className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-left -translate-y-1/2"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <div className="flex h-full items-center justify-end pr-3 sm:pr-5">

                      <div
                        className="flex w-[76px] flex-col items-center justify-center text-center sm:w-[82px]"
                        style={{
                          transform: `rotate(${
                            360 / prizes.length / 2
                          }deg)`,
                        }}
                      >

                        {/* IMAGE / ICON */}
                        <div className="mb-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg">

                          {prize.image ? (
                            <img
                              src={prize.image}
                              alt={prize.name}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span className="text-2xl">
                              {prize.emoji}
                            </span>
                          )}

                        </div>

                        {/* NAME */}
                        <span className="w-full rounded-lg bg-white/95 px-1 py-1 text-[9px] font-black leading-tight text-green-800 shadow-sm sm:text-[10px]">
                          {prize.name}
                        </span>

                      </div>

                    </div>
                  </div>
                );
              })}

              {/* CENTER BUTTON */}
              <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-br from-green-700 to-green-500 text-sm font-black text-white shadow-[0_5px_20px_rgba(0,0,0,0.25)]">

                <div className="text-center">
                  <div className="text-[11px] tracking-widest">
                    SPIN
                  </div>

                  <div className="text-[9px] text-green-100">
                    & WIN
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 w-full max-w-xs rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {/* SPIN BUTTON */}
        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning}
          className="mt-8 w-full max-w-xs rounded-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 px-6 py-4 text-lg font-black text-white shadow-xl shadow-green-200 transition hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {spinning ? "SPINNING..." : "SPIN NOW"}
        </button>

        {/* FOOTER */}
        <div className="mt-5 rounded-xl bg-white/70 px-4 py-3 text-center shadow-sm">

          <p className="text-xs font-medium leading-5 text-slate-500">
            Please do not close or refresh the page while the
            wheel is spinning.
          </p>

          <p className="mt-1 text-[10px] font-semibold text-green-600">
            OPPO • Spin & Win Campaign
          </p>

        </div>

      </div>
    </main>
  );
}

export default Spin;