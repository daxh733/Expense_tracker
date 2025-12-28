import { useEffect, useState } from "react";
import API from "../api/axios";

function Analytics(){
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/analytics/monthly/?year=${year}&month=${month}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
      setError("Could not load analytics. Please try again.");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MonthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const YearOptions = [year - 2, year - 1, year, year + 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Monthly Analytics</h1>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {MonthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {YearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={fetchSummary}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
              >
                View Summary
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
          {loading ? (
            <p className="text-gray-500 mt-2">Loading...</p>
          ) : summary ? (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Total spending for {MonthOptions[month-1].label} {year}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">₹{summary.total_spent}</p>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No data available</p>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-semibold text-gray-900">By Category</h2>
          {!summary || summary.by_category.length === 0 ? (
            <p className="text-gray-500 mt-2">No category data</p>
          ) : (
            <div className="mt-3 space-y-2">
              {summary.by_category.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-gray-800 font-medium">{cat._id}</span>
                  <span className="text-gray-900 font-semibold">₹{cat.total}</span>
                </div>
              ))}
            </div>
          )}
          {/* Placeholder for charts */}
          <div className="mt-4 h-32 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;


