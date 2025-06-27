// testPost.js
const axios = require("axios");

axios.post("http://localhost:5050/tickets", {
  subject: "Test Post",
  description: "Test via Axios CLI",
  priority: 1,
  issue_type: "hardware",
  subcategory: "Laptop",
})
.then(res => {
  console.log("Ticket created:", res.data);
})
.catch(err => {
  console.error("Failed:", err.message, err.response?.data);
});

