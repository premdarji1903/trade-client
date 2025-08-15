import React, { useState } from "react";

export default function ClientForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientId: "",
    token: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientId || !formData.token) {
      setMessage("⚠️ Please fill in all fields.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://trade-client-server.onrender.com/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Client added successfully!");
        setMessageType("success");
        setFormData({ clientName: "", clientId: "", token: "" });
      } else {
        // Show server error message like "Client ID already exists"
        setMessage(`❌ ${data.message || "Failed to add client"}`);
        setMessageType("error");
      }
    } catch (err) {
      setMessage("❌ Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Client Information Form</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.row}>
            <label style={styles.label}>Client Name</label>
            <input
              type="text"
              name="clientName"
              placeholder="Enter client name"
              value={formData.clientName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.row}>
            <label style={styles.label}>Client ID</label>
            <input
              type="text"
              name="clientId"
              placeholder="Enter client ID"
              value={formData.clientId}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.row}>
            <label style={styles.label}>Token</label>
            <input
              type="text"
              name="token"
              placeholder="Enter token"
              value={formData.token}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
        {message && (
          <p
            style={{
              ...styles.message,
              color: messageType === "success" ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E90FF",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "800px",
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontSize: "15px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "14px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "15px",
  },
};
