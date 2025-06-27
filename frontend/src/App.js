import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "0",
    issue_type: "",
    subcategory: "",
  });
  const [showForm, setShowForm] = useState(false);

  const issueTypeOptions = [
    { value: "network", label: "Network" },
    { value: "hardware", label: "Hardware" },
    { value: "software", label: "Software" },
    { value: "access", label: "Access" },
  ];

  const subcategories = {
    network: ["WiFi", "LAN", "VPN"],
    hardware: ["Laptop", "Desktop", "Monitor"],
    software: ["Email", "Office Suite", "Browser"],
    access: ["Login Issues", "Permission Request", "Account Locked"],
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5050/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/tickets", formData);
      fetchTickets();
      setShowForm(false);
      setFormData({
        subject: "",
        description: "",
        priority: "0",
        issue_type: "",
        subcategory: "",
      });
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {!showForm && (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="bg-white shadow-md rounded px-8 py-6 border border-gray-300">
              <h1 className="text-3xl font-bold text-center">Submit a Ticket</h1>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Ticket
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-4 space-y-4">
            <div>
              <label className="block font-medium">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Priority (0–3)</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="0">0 - Feature Request</option>
                <option value="1">1 - Low</option>
                <option value="2">2 - Medium</option>
                <option value="3">3 - High</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Issue Type</label>
              <select
                value={formData.issue_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    issue_type: e.target.value,
                    subcategory: "",
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Issue Type</option>
                {issueTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.issue_type && (
              <div>
                <label className="block font-medium">Subcategory</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories[formData.issue_type].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Ticket
            </button>
          </form>
        )}

        {tickets.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
            {tickets.map(ticket => (
              <div key={ticket.id} className="border p-4 mb-2 rounded bg-white shadow">
                <h3 className="font-bold">{ticket.subject}</h3>
                <p>{ticket.description}</p>
                <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
