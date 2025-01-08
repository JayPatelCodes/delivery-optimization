import React, { useState } from "react";
import "./ResizableGrid.css"; // Import the CSS file

// A single grid cell component
const GridCell = ({ row, col, size, onClick, color, shape }) => {
  return (
    <div
      onClick={() => onClick(row, col)}
      className="grid-cell" // Apply grid-cell class
    >
      {shape === "circle" && (
        <div
          className="circle"
          style={{ backgroundColor: color }} // Apply color dynamically
        />
      )}
      {shape === "square" && (
        <div
          className="square"
          style={{ backgroundColor: color }} // Apply color dynamically
        />
      )}
    </div>
  );
};

// Main ResizableGrid component
const ResizableGrid = () => {
  const [rows, setRows] = useState(5); // Default rows
  const [cols, setCols] = useState(5); // Default columns
  const cellSize = 50; // Size of each cell in pixels
  const colors = ["red", "orange", "yellow", "green", "blue"]; // Colors for routes
  const [routes, setRoutes] = useState([]); // Store route sets

  // Handle cell click to add/remove start or end points
  const handleCellClick = (row, col) => {
    const existingRouteIndex = routes.findIndex(
      (route) =>
        (route.start.row === row && route.start.col === col) ||
        (route.end.row === row && route.end.col === col)
    );

    if (existingRouteIndex !== -1) {
      // Remove the route if the clicked point is already part of a route
      const updatedRoutes = [...routes];
      updatedRoutes.splice(existingRouteIndex, 1);
      setRoutes(updatedRoutes);
    } else {
      // Add new route or update the latest route
      const currentRoute = routes[routes.length - 1];
      if (!currentRoute || currentRoute.end.row !== -1) {
        // Add a new route with a start point
        if (routes.length < 5) {
          setRoutes((prev) => [
            ...prev,
            { start: { row, col }, end: { row: -1, col: -1 }, color: colors[prev.length] },
          ]);
        }
      } else {
        // Add an end point to the last route
        const updatedRoutes = [...routes];
        updatedRoutes[updatedRoutes.length - 1].end = { row, col };
        setRoutes(updatedRoutes);
      }
    }
  };

  return (
    <div>
      {/* Grid resizing controls */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value) || 1)}
            min="5"
            max="20"
            style={{ margin: "0 10px" }}
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
            style={{ margin: "0 10px" }}
          />
        </label>
      </div>

      {/* Render grid */}
      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {[...Array(rows)].map((_, row) =>
          [...Array(cols)].map((_, col) => {
            // Determine the shape and color for the current cell
            let shape = null;
            let cellColor = null;

            for (const route of routes) {
              if (route.start.row === row && route.start.col === col) {
                shape = "circle";
                cellColor = route.color; // Start point
              } else if (route.end.row === row && route.end.col === col) {
                shape = "square";
                cellColor = route.color; // End point
              }
            }

            return (
              <GridCell
                key={`${row}-${col}`}
                row={row}
                col={col}
                size={cellSize}
                onClick={handleCellClick}
                color={cellColor}
                shape={shape}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResizableGrid;
