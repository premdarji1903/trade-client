/* eslint-disable no-unused-vars */
import React, { useState } from "react";

export default function UpdateClientForm() {
  const [formData, setFormData] = useState({
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

    if (!formData.clientId || !formData.token) {
      setMessage("⚠️ Client ID and Token are required.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `https://trade-client-server.onrender.com/client/${formData.clientId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: formData.token }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Token updated successfully!");
        setMessageType("success");
        setFormData({ clientId: "", token: "" });
      } else {
        setMessage(`❌ ${data.message || "Failed to update token"}`);
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
        <h1 style={styles.title}>Update Client Token</h1>
        <form style={styles.form} onSubmit={handleSubmit}>
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
            <label style={styles.label}>New Token</label>
            <input
              type="text"
              name="token"
              placeholder="Enter new token"
              value={formData.token}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Update Token"}
          </button>
        </form>
        {message && (
          <p
            style={{
              ...styles.message,
              color: messageType === "success" ? "#2e7d32" : "#d32f2f",
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
    background: "linear-gradient(135deg, #f8f9fb, #e9edf3)", // same gradient
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
    backgroundColor: "#1976D2", // same as add client
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

// Extra pseudo styles
styles.input[":focus"] = {
  borderColor: "#1976D2",
  boxShadow: "0 0 5px rgba(25,118,210,0.3)",
};
styles.button[":hover"] = {
  backgroundColor: "#1565C0",
};
