import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // 1️⃣ Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses/");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  // Load expenses on page load
  useEffect(() => {
    fetchExpenses();
  }, []);

  // 2️⃣ Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    console.log("Form state before POST:", {
      description,
      amount,
      category,
      date,
    });

    try {
      await API.post("/expenses/add/", {
        description,
        amount: Number(amount),
        category,
        date,
      });

      // Clear form
      setDescription("");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().slice(0, 10));

      // Refresh list
      fetchExpenses();
    } catch (err) {
      console.error("Failed to add expense", err);
      console.error("Response error:", err.response?.data);
    }
  };

  // 3️⃣ Delete expense
  const handleDeleteExpense = async (expenseId) => {
    try {
      await API.delete(`/expenses/delete/${expenseId}/`);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="bg-white rounded-xl shadow-sm border px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">Expense Tracker</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/analytics")}
              className="bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition"
            >
              Analytics
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Add Expense Card */}
      <div className="max-w-4xl mx-auto px-6 mt-6">
        <form
          onSubmit={handleAddExpense}
          className="bg-white rounded-xl shadow-sm border p-5"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a New Expense</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2 w-full placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Coffee at Starbucks"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 w-full placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 249"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Transport</option>
                <option>Rent</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Health</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expense List */}
      <div className="max-w-4xl mx-auto px-6 mt-4 pb-10">
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {exp.description || "(No description)"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {exp.category} • {exp.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-900">₹{exp.amount}</p>
                  <button
                    onClick={() => handleDeleteExpense(exp._id)}
                    className="p-2 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition"
                    aria-label="Delete expense"
                    title="Delete expense"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h4a1 1 0 1 1 0 2h-1v14a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V5H5a1 1 0 1 1 0-2h4Zm-1 4v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7H8Zm3 2a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
