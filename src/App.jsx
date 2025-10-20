import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClientForm from "./ClientForm";
import UpdateClientForm from "./UpdateClientForm";
import TradeTechLandingPage from "./TradeTechSolutionLandingPage";

function App() {
  return (
    <Router>
      {/* 🔹 Navigation Bar */}
      {/* <nav style={styles.nav}>
        <Link to="/" style={styles.link}>➕ Add Client</Link>
        <Link to="/update" style={styles.link}>✏️ Update Client</Link>
      </nav> */}

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<TradeTechLandingPage />} />
        <Route path="/client" element={<ClientForm />} />
        <Route path="/update" element={<UpdateClientForm />} />
      </Routes>
    </Router>
  );
}

export default App;

// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "20px",
//     padding: "15px",
//     backgroundColor: "#1E90FF", // Blue navbar
//     borderBottom: "2px solid #0d6efd",
//     position: "sticky",
//     top: 0,
//     zIndex: 1000,
//   },
//   link: {
//     textDecoration: "none",
//     backgroundColor: "#ffffff20", // transparent white overlay
//     color: "#fff",
//     fontWeight: "bold",
//     padding: "10px 20px",
//     borderRadius: "6px",
//     transition: "all 0.3s ease",
//   },
//   linkHover: {
//     backgroundColor: "#ffffff40",
//   },
// };
