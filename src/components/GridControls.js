// GridControls.js
import React from "react";

const GridControls = ({ rows, cols, setRows, setCols, canStartAlgorithm, handleStartGeneticAlgorithm }) => {
  return (
    <div className="grid-controls">
      <label>
        Rows:
        <input type="number" value={rows} onChange={(e) => setRows(Number(e.target.value) || 1)} min="5" max="20" />
      </label>
      <label>
        Columns:
        <input type="number" value={cols} onChange={(e) => setCols(Number(e.target.value) || 1)} min="5" max="20" />
      </label>
      <button id="startGeneticAlgorithm" disabled={!canStartAlgorithm} onClick={handleStartGeneticAlgorithm}>
        Start Genetic Algorithm
      </button>
    </div>
  );
};

export default GridControls;
