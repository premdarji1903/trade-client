/* eslint-disable no-unused-vars */
import React, { useState } from "react";

export default function ClientRegistration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [clientDbId, setClientDbId] = useState(null);

  const [formData, setFormData] = useState({
    clientName: "",
    mobileNumber: "",
    email: "",
    clientId: "",
    trade: [], // Array to hold selected trades
    api_key: "",
    api_secret: "",
  });

  const tradeOptions = ["Nifty", "Natural Gas", "Crude Oil"]; // All available trade options

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change for trades
  const handleTradeCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newTrade = checked
        ? [...prev.trade, value] // add if checked
        : prev.trade.filter((t) => t !== value); // remove if unchecked
      return { ...prev, trade: newTrade };
    });
  };

  // Step 1: API call and move to payment
  const handleNextStep = async (e) => {
    e.preventDefault();
    const { clientName, mobileNumber, email, clientId, trade } = formData;

    if (!clientName || !mobileNumber || !email || !clientId || trade.length === 0) {
      setMessage("⚠️ Please fill all fields.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://trade-client-server.onrender.com/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, mobileNumber, email, clientId, trade }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Client created successfully. Proceed to payment.");
        setMessageType("success");
        setClientDbId(data?.client?._id);
        setStep(2);
      } else {
        setMessage(`❌ ${data.message || "Failed to create client"}`);
        setMessageType("error");
      }
    } catch (err) {
      setMessage("❌ Network error.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: API keys submission
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const { api_key, api_secret } = formData;

    if (!api_key || !api_secret) {
      setMessage("⚠️ Please enter API details.");
      setMessageType("error");
      return;
    }

    if (!clientDbId) {
      setMessage("❌ Client ID not found. Please complete step 1 first.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `https://trade-client-server.onrender.com/clients/${clientDbId}/apikeys`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key, api_secret }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registration completed successfully!");
        setMessageType("success");
        setStep(1);
        setFormData({
          clientName: "",
          mobileNumber: "",
          email: "",
          clientId: "",
          trade: [],
          api_key: "",
          api_secret: "",
        });
        setClientDbId(null); // reset for next registration
      } else {
        setMessage(`❌ ${data.message || "Failed to save API keys"}`);
        setMessageType("error");
      }
    } catch (err) {
      setMessage("❌ Network error.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Client Registration</h2>

        {/* STEP 1: BASIC DETAILS */}
        {step === 1 && (
          <form style={styles.form} onSubmit={handleNextStep}>
            <input
              type="text"
              name="clientName"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="clientId"
              placeholder="Client ID"
              value={formData.clientId}
              onChange={handleChange}
              style={styles.input}
            />

            <div>
              <label style={{ fontSize: 14, color: "#555" }}>
                Select Trade(s):
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "5px",
                }}
              >
                {tradeOptions.map((option) => (
                  <label
                    key={option}
                    style={{ fontSize: "14px", color: "#333" }}
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.trade.includes(option)}
                      onChange={handleTradeCheckbox}
                      style={{ marginRight: "8px" }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Saving..." : "Next →"}
            </button>
          </form>
        )}

        {/* STEP 2: MOCK PAYMENT UI */}
        {step === 2 && (
          <div style={styles.paymentBox}>
            <h3>💳 Registration Payment</h3>
            <p style={{ color: "#555" }}>Amount: ₹499.00</p>

            <div style={styles.fakeRazorBox}>
              <p style={{ fontSize: "14px", color: "#777" }}>
                [Razorpay Checkout UI Placeholder]
              </p>
            </div>

            <div style={styles.paymentButtons}>
              <button onClick={() => setStep(1)} style={styles.secondaryBtn}>
                ← Back
              </button>
              <button onClick={() => setStep(3)} style={styles.button}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: API KEYS */}
        {step === 3 && (
          <form style={styles.form} onSubmit={handleFinalSubmit}>
            <input
              type="text"
              name="api_key"
              placeholder="Enter API Key"
              value={formData.api_key}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="api_secret"
              placeholder="Enter API Secret"
              value={formData.api_secret}
              onChange={handleChange}
              style={styles.input}
            />
            <div style={styles.paymentButtons}>
              <button onClick={() => setStep(2)} style={styles.secondaryBtn}>
                ← Back
              </button>
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Saving..." : "Finish Registration"}
              </button>
            </div>
          </form>
        )}

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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f9fb",
  },
  container: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2C3E50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#1976D2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px",
    backgroundColor: "#E0E0E0",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },
  paymentBox: {
    textAlign: "center",
  },
  fakeRazorBox: {
    border: "1px dashed #1976D2",
    borderRadius: "10px",
    padding: "30px",
    margin: "20px 0",
    backgroundColor: "#f0f6ff",
  },
  paymentButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
};
