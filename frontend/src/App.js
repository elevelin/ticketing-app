import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function TicketList({ tickets, claimTicket, currentUser }) {
  const allTickets = tickets.filter(
    (t) => t.status === "open" || t.status === "acknowledged"
  );
  const myTickets = tickets.filter((t) => t.owner === currentUser);
  const [view, setView] = useState("all");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => setView("all")}
            className={`mr-2 px-4 py-2 rounded ${view === "all" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setView("mine")}
            className={`px-4 py-2 rounded ${view === "mine" ? "bg-blue-600 text-white" : "bg-white border"}`}
          >
            My Tasks
          </button>
        </div>
        <Link
          to="/submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + New Ticket
        </Link>
      </div>

      <div>
        {(view === "all" ? allTickets : myTickets).map((ticket) => (
          <div key={ticket.id} className="border p-4 mb-6 rounded bg-white shadow">
            <Link
              to={`/ticket/${ticket.id}`}
              className="text-sm text-purple-700 font-bold mb-3 block hover:underline"
            >
              Ticket ID: {ticket.id}
            </Link>
            <h3 className="font-bold text-lg mb-2">{ticket.subject}</h3>
            <p className="mb-2">{ticket.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              Priority: {ticket.priority} | Owner: {ticket.owner || "Unclaimed"}
            </p>
            {view === "all" && (!ticket.owner || ticket.owner === "") && (
              <button
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => claimTicket(ticket.id)}
              >
                Claim
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmitTicket({ onSubmit }) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "0",
    issue_type: "",
    subcategory: "",
  });

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      navigate("/");
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Submit a Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block font-medium">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="0">0 - Feature Request</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - High</option>
            <option value="99">Unbreak Immediately</option>
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

function TicketDetail({ tickets, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = tickets.find((t) => t.id === parseInt(id));
  const [formState, setFormState] = useState({
    subject: ticket?.subject || "",
    priority: ticket?.priority || 0,
    status: ticket?.status || "open",
    owner: ticket?.owner || "",
    description: ticket?.description || "",
  });

  const handleUpdate = async () => {
    await onUpdate(ticket.id, formState);
    navigate("/");
  };

  if (!ticket) return <p className="p-4">Ticket not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-6 rounded shadow">
      <div className="space-y-4">
        <p className="font-bold text-lg text-gray-700">Ticket ID: {ticket.id}</p>

        <div>
          <label className="block font-medium">Title</label>
          <input
            value={formState.subject}
            onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Priority</label>
          <select
            value={formState.priority}
            onChange={(e) => setFormState({ ...formState, priority: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="0">0 - Feature Request</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - High</option>
            <option value="99">4 - Unbreak Immediately</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            value={formState.status}
            onChange={(e) => setFormState({ ...formState, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Owner</label>
          <input
            value={formState.owner}
            onChange={(e) => setFormState({ ...formState, owner: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Tags (coming soon)</label>
          <input className="w-full p-2 border rounded text-gray-400" disabled value="Coming Soon..." />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tickets, setTickets] = useState([]);
  const CURRENT_USER = "Current User";

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

  const createTicket = async (data) => {
    await axios.post("http://localhost:5050/tickets", data);
    fetchTickets();
  };

  const claimTicket = async (id) => {
    await axios.put(`http://localhost:5050/tickets/${id}/claim`, {
      owner: CURRENT_USER,
    });
    fetchTickets();
  };

  const updateTicket = async (id, updatedFields) => {
    await axios.put(`http://localhost:5050/tickets/${id}`, updatedFields);
    fetchTickets();
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<TicketList tickets={tickets} claimTicket={claimTicket} currentUser={CURRENT_USER} />}
        />
        <Route path="/submit" element={<SubmitTicket onSubmit={createTicket} />} />
        <Route path="/ticket/:id" element={<TicketDetail tickets={tickets} onUpdate={updateTicket} />} />
      </Routes>
    </Router>
  );
}

export default App;
