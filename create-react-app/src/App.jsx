import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* --- NAVBAR SECTION --- */}
      <div className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <div className="logo-box">
              <div className="logo-letter">S</div>
            </div>
            <div className="logo-text">StudyCollab</div>
          </div>

          <div className="navbar-links">
            <div className="nav-link">Find Students</div>
            <div className="nav-link">Browse Projects</div>
            <div className="nav-link">How it Works</div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        <h1>Hello, World!</h1>
        <p>
          Welcome to my first React app! 🎉 This is my code. <strong>Project Team</strong>
        </p>
      </div>
    </div>
  );
}

export default App;

