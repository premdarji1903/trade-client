import React from "react";
import "./TradeTechLandingPage.css";

export default function TradeTechLandingPage() {
  const handleSubscribe = (plan) => {
    const price = getPrice(plan);
    console.log(`Selected Plan: ${plan}, Price: ₹${price}`);
    window.location.href = "/client"; // redirect to /client
  };

  const getPrice = (plan) => {
    switch (plan) {
      case "Nifty":
        return 3000;
      case "Natural Gas":
        return 2000;
      case "Crude Oil":
        return 2000;
      case "Nifty+Natural Gas":
      case "Natural Gas+Nifty":
      case "Nifty+Crude Oil":
      case "Crude Oil+Nifty":
        return 4500;
      case "Crude Oil+Natural Gas":
        return 4000;
      case "Crude Oil+Natural Gas+Nifty":
      case "Natural Gas+Crude Oil+Nifty":
      case "Nifty+Crude Oil+Natural Gas":
        return 6000;
      default:
        return 0;
    }
  };

  const plans = [
    {
      name: "Nifty",
      description:
        "Trade Nifty automatically using algo-based precision entries and exits.",
    },
    {
      name: "Natural Gas",
      description:
        "Automate Natural Gas trading using Dhan-based smart execution.",
    },
    {
      name: "Crude Oil",
      description:
        "Fully automate Crude Oil trading strategies with live market data.",
    },
    {
      name: "Nifty+Natural Gas",
      description:
        "Access both Nifty and Natural Gas automated trading at once.",
    },
    {
      name: "Nifty+Crude Oil",
      description:
        "Automated algo trading for both Nifty and Crude Oil markets.",
    },
    {
      name: "Crude Oil+Natural Gas",
      description: "Dual automation for Crude Oil and Natural Gas trading.",
    },
    {
      name: "Crude Oil+Natural Gas+Nifty",
      description:
        "Unlock full automation for all 3 — Nifty, Crude Oil, and Natural Gas.",
      highlight: true,
    },
  ];
  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="navbar">
        <div
          className="navbar-left"
          onClick={() => (window.location.href = "/")}
        >
          <img
            src="/images/image.png"
            alt="TradeTech Logo"
            className="logo-img"
          />
          <h1 className="logo-text">TradeTech Solutions</h1>
        </div>

        <button
          className="subscribe-btn"
          onClick={() => handleSubscribe("Nifty+Crude Oil+Natural Gas")}
        >
          Subscribe Now
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Automated Dhan Algo Trading for Nifty, Natural Gas & Crude Oil</h2>
        <p>
          Unlock the power of algorithmic trading with TradeTech Solutions — a
          smart platform that executes
          <strong> Buy</strong> and <strong> Sell</strong> trades automatically
          using Dhan APIs.
        </p>
        <button
          className="primary-btn"
          onClick={() => handleSubscribe("Nifty")}
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>Nifty Option Trading</h3>
          <p>
            Execute trades in Nifty automatically using precise algo signals.
          </p>
        </div>
        <div className="feature-card">
          <h3>Natural Gas Option</h3>
          <p>
            Trade Natural Gas seamlessly with our intelligent Dhan-based
            automation.
          </p>
        </div>
        <div className="feature-card">
          <h3>Crude Oil Option</h3>
          <p>
            Automate your Crude Oil strategies — let our algo handle your
            entries and exits.
          </p>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="subscription">
        <h2>Subscribe & Start Algo Trading Today</h2>
        <p>
          Get access to advanced Dhan algo trading automation tools and expert
          support. Choose your plan and start executing profitable trades
          effortlessly.
        </p>

        <div className="plan-container">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card ${plan.highlight ? "pro" : ""}`}
            >
              <h3>{plan.name}</h3>
              <p className="price">₹{getPrice(plan.name)}/month</p>
              <p className="plan-desc">{plan.description}</p>
              <ul>
                <li>Algo Trading Access</li>
                <li>Real-time Signals</li>
                <li>{plan.highlight ? "Priority Support" : "Email Support"}</li>
              </ul>
              <button
                className="plan-btn"
                onClick={() => handleSubscribe(plan.name)}
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <img
          src="/images/image.png"
          alt="TradeTech Logo"
          className="footer-logo"
        />
        <h3>TradeTech Solutions</h3>
        <p>
          Empowering traders with AI-powered Dhan Algo Trading for Nifty,
          Natural Gas, and Crude Oil.
        </p>
        <small>© 2025 TradeTech Solutions. All rights reserved.</small>
      </footer>
    </div>
  );
}
