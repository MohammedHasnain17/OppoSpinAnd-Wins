import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("spinResult");

    if (!savedResult) {
      navigate("/");
      return;
    }

    try {
      setResult(JSON.parse(savedResult));
    } catch (error) {
      console.error("Result parsing error:", error);
      navigate("/");
    }
  }, [navigate]);

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 px-4 py-6 text-slate-800 sm:px-6">

      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-md items-center justify-center">

        <div className="w-full overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-[0_20px_60px_rgba(22,163,74,0.15)]">

          {/* ================= HEADER ================= */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-green-500 px-6 pb-10 pt-8 text-center text-white">

            {/* Decorative circles */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />

            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />

            {/* OPPO */}
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black tracking-tight text-green-600 shadow-xl">

              OPPO

            </div>

            <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.3em] text-green-50">
              Spin & Win
            </p>

            <h1 className="relative mt-2 text-3xl font-black tracking-tight">
              Congratulations!
            </h1>

            <p className="relative mt-2 text-sm text-white/85">
              Your spin has been successfully completed.
            </p>

          </div>

          {/* ================= CONTENT ================= */}
          <div className="px-6 pb-7 pt-8">

            {/* ================= GIFT ICON ================= */}
            <div className="relative mx-auto -mt-16 flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-gradient-to-br from-green-300 via-emerald-400 to-green-600 text-5xl shadow-[0_12px_35px_rgba(22,163,74,0.3)]">

              🎁

              {/* Small sparkle */}
              <span className="absolute -right-1 top-1 text-xl">
                ✨
              </span>

              <span className="absolute -left-2 bottom-1 text-lg">
                ✨
              </span>

            </div>

            {/* ================= WIN MESSAGE ================= */}
            <div className="mt-6 text-center">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-600">
                You are a winner
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                You Won!
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Here is your Spin & Win reward.
              </p>

            </div>

            {/* ================= PRIZE CARD ================= */}
            <div className="relative mt-7 overflow-hidden rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-6 text-center shadow-sm">

              {/* Decorative background */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-200/40" />

              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-emerald-100/60" />

              <div className="relative">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-md">
                  🏆
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Your Prize
                </p>

                <p className="mt-2 break-words text-2xl font-black text-green-700">
                  {result.prize}
                </p>

                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-600" />

                <p className="mt-3 text-xs font-medium text-slate-400">
                  Congratulations on your lucky spin!
                </p>

              </div>

            </div>

            {/* ================= PARTICIPANT ================= */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">

              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
                  👤
                </div>

                <div className="min-w-0 text-left">

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-600">
                    Participant
                  </p>

                  <p className="mt-1 truncate text-base font-extrabold text-slate-800">
                    {result.customer?.name}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">

                {/* Mobile */}
                <div className="rounded-xl bg-white px-3 py-3 shadow-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Mobile
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {result.customer?.mobile}
                  </p>

                </div>

                {/* IMEI */}
                <div className="rounded-xl bg-white px-3 py-3 shadow-sm">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    IMEI
                  </p>

                  <p className="mt-1 break-all text-xs font-bold text-slate-700">
                    {result.customer?.imei}
                  </p>

                </div>

              </div>

            </div>

            {/* ================= IMPORTANT MESSAGE ================= */}
            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 px-4 py-4 text-center">

              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                ✓
              </div>

              <p className="mt-2 text-sm font-bold text-green-800">
                Spin completed successfully
              </p>

              <p className="mt-1 text-xs leading-5 text-green-700/80">
                Please keep this result for your prize collection
                and verification.
              </p>

            </div>

            {/* ================= HISTORY BUTTON ================= */}
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 px-5 py-4 text-sm font-black tracking-wide text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            >
              VIEW SPIN HISTORY
            </button>

            {/* ================= HOME BUTTON ================= */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-3 w-full rounded-2xl border border-green-200 bg-white px-5 py-4 text-sm font-black tracking-wide text-green-700 transition hover:bg-green-50 active:scale-[0.98]"
            >
              NEW CUSTOMER
            </button>

            {/* ================= FOOTER ================= */}
            <div className="mt-6 text-center">

              <div className="mx-auto mb-2 h-px w-20 bg-green-100" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                OPPO • Spin & Win Campaign
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Thank you for participating
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Result;