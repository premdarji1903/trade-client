import React, { useState } from "react";

export default function ClientForm() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientId: "",
    token: "",
    trade: "",
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

    if (
      !formData.clientName ||
      !formData.clientId ||
      !formData.token ||
      !formData.trade
    ) {
      setMessage("⚠️ Please fill in all fields.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://trade-client-server.onrender.com/clients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Client added successfully!");
        setMessageType("success");
        setFormData({ clientName: "", clientId: "", token: "" });
      } else {
        setMessage(`❌ ${data.message || "Failed to add client"}`);
        setMessageType("error");
      }
      // eslint-disable-next-line no-unused-vars
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
        <h1 style={styles.title}>Client Information</h1>
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
          <div style={styles.row}>
            <label style={styles.label}>Trade</label>
            <select
              name="trade"
              value={formData.trade}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Trade</option>
              <option value="nifty">Nifty</option>
              <option value="naturalgas">Natural Gas</option>
              <option value="both">Both</option>
            </select>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Save Client"}
          </button>
        </form>
        {message && (
          <p
            style={{
              ...styles.message,
              color: messageType === "success" ? "#2E7D32" : "#D32F2F",
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
    background: "linear-gradient(135deg, #f8f9fb, #e9edf3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#2C3E50",
    fontSize: "1.8rem",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  row: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  button: {
    padding: "14px",
    backgroundColor: "#1976D2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "18px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
  },
};

// Extra interactive styles
styles.input[":focus"] = {
  borderColor: "#1976D2",
  boxShadow: "0 0 5px rgba(25,118,210,0.3)",
};
styles.button[":hover"] = {
  backgroundColor: "#1565C0",
};
