import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH HISTORY
  // ==========================================
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/history"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load history."
        );
      }

      setHistory(data.history || []);
    } catch (error) {
      console.error("History fetch error:", error);

      setError(
        "Unable to load spin history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchHistory();
  }, []);

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================
  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?\n\nThis customer record will be permanently removed.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(customer._id);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/history/${customer._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete customer."
        );
      }

      // Remove deleted customer immediately from UI
      setHistory((previousHistory) =>
        previousHistory.filter(
          (item) => item._id !== customer._id
        )
      );
    } catch (error) {
      console.error("Delete customer error:", error);

      setError(
        error.message ||
          "Unable to delete customer. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 px-4 py-6 text-slate-900 sm:px-6">

      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-green-200/40 blur-3xl" />

        <div className="absolute right-[-120px] top-1/4 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-green-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px]">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl shadow-green-900/10">

          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div>

              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 text-lg font-black text-white shadow-lg shadow-green-600/20">
                  OP
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-600">
                    Campaign Records
                  </p>

                  <p className="text-xs text-slate-400">
                    Spin & Win Management
                  </p>
                </div>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Spin History
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-500">
                View customers, winning prizes and campaign
                participation records.
              </p>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              {/* TOTAL */}
              <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                  Total Winners
                </p>

                <p className="mt-1 text-2xl font-black text-green-700">
                  {history.length}
                </p>
              </div>

              {/* NEW CUSTOMER */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 font-black text-white shadow-lg shadow-green-600/20 transition duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              >
                + NEW CUSTOMER
              </button>

            </div>

          </div>

          {/* GREEN LINE */}
          <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600" />

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}
        {!loading && error && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700 shadow-lg">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-bold">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-green-600">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchHistory}
                className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
              >
                TRY AGAIN
              </button>

            </div>

          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}
        {loading && (
          <div className="rounded-3xl border border-green-100 bg-white p-10 text-center text-slate-700 shadow-xl shadow-green-900/10">

            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="font-bold">
              Loading campaign records...
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Please wait.
            </p>

          </div>
        )}

        {/* ==========================================
            EMPTY
        ========================================== */}
        {!loading &&
          !error &&
          history.length === 0 && (
            <div className="rounded-3xl border border-green-100 bg-white p-12 text-center text-slate-700 shadow-xl shadow-green-900/10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-4xl">
                🎁
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900">
                No Spin History Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Customer results will appear here after
                the first successful spin.
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 font-bold text-white shadow-lg shadow-green-600/20"
              >
                ADD FIRST CUSTOMER
              </button>

            </div>
          )}

        {/* ==========================================
            HISTORY TABLE
        ========================================== */}
        {!loading &&
          !error &&
          history.length > 0 && (
            <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl shadow-green-900/10">

              {/* TABLE TOP BAR */}
              <div className="flex flex-col gap-3 border-b border-green-100 bg-gradient-to-r from-white to-green-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Customer Records
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest spin results are shown first.
                  </p>
                </div>

                <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
                  {history.length} RECORD
                  {history.length !== 1 ? "S" : ""}
                </div>

              </div>

              {/* ======================================
                  DESKTOP TABLE
              ====================================== */}
              <div className="hidden overflow-x-auto xl:block">

                <table className="w-full min-w-[1250px] text-left">

                  <thead className="bg-green-50">

                    <tr>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        S.NO
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Mobile
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Age
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Email
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        IMEI
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Prize
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-green-700">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {history.map((customer, index) => (

                      <tr
                        key={customer._id}
                        className="border-t border-green-50 transition hover:bg-green-50/70"
                      >

                        <td className="px-5 py-5 font-bold text-green-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-5">

                          <p className="font-black text-slate-800">
                            {customer.name || "-"}
                          </p>

                        </td>

                        <td className="px-5 py-5 text-sm font-medium text-slate-600">
                          {customer.mobile || "-"}
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-600">
                          {customer.age ?? "-"}
                        </td>

                        <td className="max-w-[220px] px-5 py-5 text-sm text-slate-600">
                          <div className="truncate">
                            {customer.email || "-"}
                          </div>
                        </td>

                        <td className="px-5 py-5 font-mono text-xs font-semibold text-slate-600">
                          {customer.imei || "-"}
                        </td>

                        <td className="px-5 py-5">

                          <span className="inline-flex rounded-full bg-green-100 px-3 py-2 text-xs font-black text-green-700">
                            {customer.prize || "Not Spun"}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
                          {formatDate(customer.spinAt)}
                        </td>

                        <td className="px-5 py-5">

                          <button
                            type="button"
                            disabled={deletingId === customer._id}
                            onClick={() =>
                              handleDelete(customer)
                            }
                            className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-xs font-black text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === customer._id
                              ? "DELETING..."
                              : "DELETE"}
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              {/* ======================================
                  MOBILE / TABLET CARDS
              ====================================== */}
              <div className="space-y-4 p-4 xl:hidden">

                {history.map((customer, index) => (

                  <div
                    key={customer._id}
                    className="rounded-2xl border border-green-100 bg-gradient-to-br from-white to-green-50 p-5 shadow-sm"
                  >

                    {/* CARD HEADER */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                          Customer #{index + 1}
                        </p>

                        <h2 className="mt-1 break-words text-lg font-black text-slate-800">
                          {customer.name || "-"}
                        </h2>

                      </div>

                      <div className="shrink-0 rounded-xl bg-green-100 px-3 py-2 text-right">

                        <p className="text-[9px] font-black uppercase text-green-600">
                          Prize
                        </p>

                        <p className="mt-1 text-xs font-black text-green-700">
                          {customer.prize || "Not Spun"}
                        </p>

                      </div>

                    </div>

                    {/* DETAILS */}
                    <div className="mt-5 grid gap-4 border-t border-green-100 pt-4 sm:grid-cols-2">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Mobile
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {customer.mobile || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Age
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {customer.age ?? "-"}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                          {customer.email || "-"}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          IMEI
                        </p>

                        <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-700">
                          {customer.imei || "-"}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Spin Date
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(customer.spinAt)}
                        </p>
                      </div>

                    </div>

                    {/* DELETE */}
                    <div className="mt-5 border-t border-green-100 pt-4">

                      <button
                        type="button"
                        disabled={deletingId === customer._id}
                        onClick={() =>
                          handleDelete(customer)
                        }
                        className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-black text-green-700 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === customer._id
                          ? "DELETING CUSTOMER..."
                          : "DELETE CUSTOMER"}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

        {/* FOOTER */}
        <div className="py-8 text-center">

          <p className="text-xs text-green-700/40">
            Spin & Win Campaign Management
          </p>

        </div>

      </div>
    </main>
  );
}

export default History;