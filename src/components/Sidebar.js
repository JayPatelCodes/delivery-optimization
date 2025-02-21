import React from "react";
import './Sidebar.css';

const Sidebar = ({ mode, setMode }) => {
  return (
    <div className="sidebar">
      <button onClick={() => setMode("start-end")} className={mode === "start-end" ? "active" : ""}>
        Place Start/End
      </button>
      <button onClick={() => setMode("roadblock")} className={mode === "roadblock" ? "active" : ""}>
        Place Roadblock
      </button>
      <button onClick={() => setMode("traffic")} className={mode === "traffic" ? "active" : ""}>
        Place Traffic Zone
      </button>
    </div>
  );
};

export default Sidebar;
