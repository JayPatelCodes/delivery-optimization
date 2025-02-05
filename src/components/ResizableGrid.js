import React, { useState, useEffect } from "react";
import "./ResizableGrid.css";

const ResizableGrid = () => {
  const colors = ["red", "orange", "yellow", "green", "blue"];
  const [availableColors, setAvailableColors] = useState([...colors]);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const cellSize = 50;
  const [routes, setRoutes] = useState([]);
  const [mode, setMode] = useState("start-end");
  const [gridData, setGridData] = useState(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ type: 'empty' })))
  );

  // Update gridData when rows or cols change
  useEffect(() => {
    setGridData(
      Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ type: 'empty' })))
    );
  }, [rows, cols]);

  const handleCellClick = (row, col) => {
    if (mode === "start-end") {
      const existingRouteIndex = routes.findIndex(
        (route) =>
          (route.start.row === row && route.start.col === col) ||
          (route.end.row === row && route.end.col === col)
      );

      if (existingRouteIndex !== -1) {
        const removedRoute = routes[existingRouteIndex];
        setAvailableColors((prev) => [...prev, removedRoute.color]);
        const updatedRoutes = [...routes];
        updatedRoutes.splice(existingRouteIndex, 1);
        setRoutes(updatedRoutes);
      } else {
        const lastRoute = routes[routes.length - 1];

        if (routes.length < 5 && availableColors.length > 0) {
          if (!lastRoute || lastRoute.end.row !== -1) {
            const newColor = availableColors[0];
            setAvailableColors((prev) => prev.slice(1));
            setRoutes((prev) => [
              ...prev,
              { start: { row, col }, end: { row: -1, col: -1 }, color: newColor },
            ]);
          } else {
            const updatedRoutes = [...routes];
            updatedRoutes[updatedRoutes.length - 1].end = { row, col };
            setRoutes(updatedRoutes);
          }
        } else if (lastRoute && lastRoute.end.row === -1) {
          const updatedRoutes = [...routes];
          updatedRoutes[updatedRoutes.length - 1].end = { row, col };
          setRoutes(updatedRoutes);
        }
      }
    } else if (mode === "traffic") {

      if (gridData[row] && gridData[row][col]) {
        const isTrafficZone = gridData[row][col].type === 'trafficZone';

        gridData[row][col].type = isTrafficZone ? 'normal' : 'trafficZone';
        setGridData([...gridData]);
      }
    }
  };

  const canStartAlgorithm = routes.length === 5 && routes.every((route) => route.end.row !== -1);

  const handleStartGeneticAlgorithm = () => {
    alert("Starting genetic algorithm!");
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <button onClick={() => setMode("start-end")}>Place Start/End</button>
        <button onClick={() => setMode("roadblock")}>Place Roadblock</button>
        <button onClick={() => setMode("traffic")}>Place Traffic Zone</button>
      </div>
      <div className="main-content">
        <div className="grid-controls">
          <label>
            Rows:
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value) || 1)}
              min="5"
              max="20"
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value) || 1)}
              min="5"
              max="20"
            />
          </label>
          <button id="startGeneticAlgorithm" disabled={!canStartAlgorithm} onClick={handleStartGeneticAlgorithm}>
            Start Genetic Algorithm
          </button>
        </div>

        <div className="grid-wrapper">
          <div
            className="grid-container"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            }}
          >
            {[...Array(rows)].map((_, row) =>
              [...Array(cols)].map((_, col) => {
                let shape = null;
                let cellColor = null;

                for (const route of routes) {
                  if (route.start.row === row && route.start.col === col) {
                    shape = "circle";
                    cellColor = route.color;
                  } else if (route.end.row === row && route.end.col === col) {
                    shape = "square";
                    cellColor = route.color;
                  }
                }

                // Determine if it's a traffic zone 
                const isTrafficZone = gridData[row] && gridData[row][col] && gridData[row][col].type === 'trafficZone';
                const trafficZoneClass = isTrafficZone ? 'traffic-zone' : '';

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`grid-cell ${trafficZoneClass}`}
                    onClick={() => handleCellClick(row, col)}
                  >
                    {shape === "circle" && (
                      <div className="circle" style={{ backgroundColor: cellColor }} />
                    )}
                    {shape === "square" && (
                      <div className="square" style={{ backgroundColor: cellColor }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizableGrid;
