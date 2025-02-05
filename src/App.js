import React from "react";
import ResizableGrid from "./components/ResizableGrid";
import './App.css'; 

function App() {
  return (
    <div>
      <h1 className="grid-title">Delivery Optimization Grid</h1>
      <ResizableGrid />
    </div>
  );
}

export default App;
