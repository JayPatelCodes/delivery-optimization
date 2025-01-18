import React, { useState } from "react";
import "./ResizableGrid.css";

const ResizableGrid = () => {
  const colors = ["red", "orange", "yellow", "green", "blue"];
  const [availableColors, setAvailableColors] = useState([...colors]);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const cellSize = 50;
  const [routes, setRoutes] = useState([]);

  const handleCellClick = (row, col) => {
    const existingRouteIndex = routes.findIndex(
      (route) =>
        (route.start.row === row && route.start.col === col) ||
        (route.end.row === row && route.end.col === col)
    );
  
    if (existingRouteIndex !== -1) {
      // Remove the route and recycle its colour
      const removedRoute = routes[existingRouteIndex];
      setAvailableColors((prev) => [...prev, removedRoute.color]);
      const updatedRoutes = [...routes];
      updatedRoutes.splice(existingRouteIndex, 1);
      setRoutes(updatedRoutes);
    } else {
      const lastRoute = routes[routes.length - 1];
  
      if (routes.length < 5 && availableColors.length > 0) {
        if (!lastRoute || lastRoute.end.row !== -1) {
          // Add new route with start point
          const newColor = availableColors[0];
          setAvailableColors((prev) => prev.slice(1));
          setRoutes((prev) => [
            ...prev,
            { start: { row, col }, end: { row: -1, col: -1 }, color: newColor },
          ]);
        } else {
          // Place the endpoint for the current route
          const updatedRoutes = [...routes];
          updatedRoutes[updatedRoutes.length - 1].end = { row, col };
          setRoutes(updatedRoutes);
        }
      } else if (lastRoute && lastRoute.end.row === -1) {
        // Ensure the final route can place an endpoint
        const updatedRoutes = [...routes];
        updatedRoutes[updatedRoutes.length - 1].end = { row, col };
        setRoutes(updatedRoutes);
      }
    }
  };
  
  // The buttons that change the number of rows and columns for the grid 
  // The grid container holds the grid squares
  // Each grid square can have a circle to represent the beginning of a route and a square to represent the end of a route
  return (
    <div>
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
      </div>

      {/* Wrapper div to center the grid */}
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

              return (
                <div
                  key={`${row}-${col}`}
                  className={`grid-cell`}
                  onClick={() => handleCellClick(row, col)}
                >
                  {shape === "circle" && (
                    <div
                      className="circle"
                      style={{ backgroundColor: cellColor }}
                    />
                  )}
                  {shape === "square" && (
                    <div
                      className="square"
                      style={{ backgroundColor: cellColor }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ResizableGrid;
