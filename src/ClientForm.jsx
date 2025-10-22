/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./TradeTechLandingPage.css";
import axios from "axios";
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
    trade: [],
    api_key: "",
    api_secret: "",
  });

  const [amount, setAmount] = useState(0);

  const tradeOptions = ["Nifty", "Natural Gas", "Crude Oil"];

  // Function to calculate amount based on selected trades
  const calculateAmount = (selectedTrades) => {
    const trades = [...selectedTrades].sort();
    const key = trades.join("+");

    switch (key) {
      case "Nifty":
        return 3000;
      case "Natural Gas":
        return 2000;
      case "Crude Oil":
        return 2000;
      case "Nifty+Natural Gas":
        return 4500;
      case "Natural Gas+Nifty":
        return 4500;
      case "Nifty+Crude Oil":
        return 4500;
      case "Crude Oil+Nifty":
        return 4500;
      case "Crude Oil+Natural Gas":
        return 4000; // optional, can adjust if needed
      case "Crude Oil+Natural Gas+Nifty":
      case "Natural Gas+Crude Oil+Nifty":
      case "Nifty+Crude Oil+Natural Gas":
        return 6000;
      default:
        return 0;
    }
  };

  // Update amount automatically when trades change
  useEffect(() => {
    setAmount(calculateAmount(formData.trade));
  }, [formData.trade]);
  const [qrUrl, setQrUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(60); // 1 minute
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (step === 2) {
      generateQr();
      startTimer();
    }
  }, [step]);

  const generateQr = async () => {
    try {
      setQrLoading(true);
      const response = await axios.post(
        "https://trade-client-server.onrender.com/generate-qr",
        { amount, note: "Registration Payment" },
        { responseType: "blob" }
      );
      const qrImageUrl = URL.createObjectURL(response.data);
      setQrUrl(qrImageUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
    } finally {
      setQrLoading(false);
    }
  };

  const startTimer = () => {
    setIsButtonDisabled(true);
    setTimer(60);
    let countdown = 60;
    const interval = setInterval(() => {
      countdown -= 1;
      setTimer(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
        setIsButtonDisabled(false); // ✅ Enable button after 1 minute
      }
    }, 1000);
  };
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox trade change
  const handleTradeCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newTrade = checked
        ? [...prev.trade, value]
        : prev.trade.filter((t) => t !== value);
      return { ...prev, trade: newTrade };
    });
  };

  // Step 1: Create client
  const handleNextStep = async (e) => {
    e.preventDefault();
    const { clientName, mobileNumber, email, clientId, trade } = formData;

    if (
      !clientName ||
      !mobileNumber ||
      !email ||
      !clientId ||
      trade.length === 0
    ) {
      setMessage("⚠️ Please fill all fields.");
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
          body: JSON.stringify({
            clientName,
            mobileNumber,
            email,
            clientId,
            trade,
            amount,
          }),
        }
      );

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
    setShowPopup(true);
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
        setClientDbId(null);
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
      {/* ---------- Navbar ---------- */}
      <header style={styles.navbar}>
        <div
          style={styles.logoContainer}
          onClick={() => (window.location.href = "/")}
        >
          <img
            src="/images/image.png"
            alt="TradeTech Logo"
            style={styles.logoImg}
          />
          <span style={styles.logoText}>TradeTech Solutions</span>
        </div>
        <nav>
          <a href="/" style={styles.navLink}>
            Home
          </a>
        </nav>
      </header>

      {/* ---------- Registration Container ---------- */}
      <div style={styles.container}>
        <h2 style={styles.title}>Client Registration</h2>

        {/* STEP 1 */}
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

            <p
              style={{
                color: "#1976D2",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              💰 Amount: ₹{amount || 0}
            </p>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Saving..." : "Next →"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={styles.paymentBox}>
            <h3>💳 Registration Payment</h3>
            <p style={{ color: "#555" }}>Amount: ₹{amount}</p>

            {/* QR Section */}
            {qrLoading ? (
              <p>Generating QR Code...</p>
            ) : qrUrl ? (
              <div>
                <h4>📷 Scan this UPI QR to Pay</h4>
                <img
                  src={qrUrl}
                  alt="UPI Payment QR"
                  width="220"
                  height="220"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
                <p style={{ marginTop: "10px", color: "#777" }}>
                  Please complete the payment within <strong>{timer}</strong>{" "}
                  seconds
                </p>
              </div>
            ) : (
              <p>QR Code not available</p>
            )}

            <div style={styles.paymentButtons}>
              <button onClick={() => setStep(1)} style={styles.secondaryBtn}>
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  ...styles.button,
                  opacity: isButtonDisabled ? 0.5 : 1,
                  cursor: isButtonDisabled ? "not-allowed" : "pointer",
                }}
                disabled={isButtonDisabled}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
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
      {showPopup && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.modal}>
            <h3>🎉 Registration Completed!</h3>
            <p style={{ color: "#555", marginTop: "10px" }}>
              Your registration has been submitted successfully.
            </p>
            <p style={{ color: "#777" }}>
              You’ll be eligible to trade once the admin reviews and approves
              your account.
            </p>
            <button
              style={popupStyles.button}
              onClick={() => {
                setShowPopup(false);
                setStep(1); // optionally go back to start page
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* ---------- Footer ---------- */}
      <footer style={styles.footer}>
        <img src="/images/image.png" alt="TradeTech Logo" style={styles.logo} />
        <p style={styles.companyName}>TradeTech Solutions</p>
        <p style={styles.description}>
          Empowering traders with next-gen Dhan Algo Trading Automation.
        </p>
        <p style={styles.copyright}>
          © 2025 TradeTech Solutions. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// ---------- Inline Styles ----------
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8f9fb",
  },
  container: {
    width: "100%",
    maxWidth: "700px",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    margin: "50px auto",
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
  navbar: {
    background: "#ffffff", // White background
    color: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logoImg: {
    width: "45px",
    height: "45px",
    marginRight: "10px",
    borderRadius: "8px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1976D2",
  },
  navLink: {
    color: "#000",
    marginRight: "20px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },
  subscribeBtn: {
    background: "#1976D2",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s ease",
  },
  footer: {
    marginTop: "60px",
    background: "#f8f9fb",
    color: "#ddd",
    textAlign: "center",
    padding: "40px 20px",
    borderTop: "1px solid #e0e0e0",
  },
  logo: {
    width: "60px",
    height: "60px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  companyName: {
    fontWeight: 600,
    color: "#1976D2",
    marginBottom: "6px",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  copyright: {
    fontSize: "11px",
    color: "#777",
    marginTop: "8px",
  },
};

const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px 40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
  },
  button: {
    marginTop: "20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
