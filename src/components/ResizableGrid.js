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
    if (routes.length === 5 && routes.every((route) => route.end.row !== -1)) {
      const newRoutes = routes.map((route) => {
        const randomRoute = generateRandomRoute(route.start, route.end); // Generate the path from start to end
        return { ...route, path: randomRoute };
      });
      setRoutes(newRoutes);
      alert("Genetic algorithm started with randomly generated routes!");
    }
  };  
  
  // Random route generation between start and end points
  const generateRandomRoute = (start, end) => {
    const path = [];
    let currentRow = start.row;
    let currentCol = start.col;

    path.push({ row: currentRow, col: currentCol });

    // Move towards the end row and column, creating a series of cells between them
    while (currentRow !== end.row || currentCol !== end.col) {
      // Randomly move in the row and column direction
      const moveRow = (end.row - currentRow) !== 0 ? (end.row > currentRow ? 1 : -1) : 0;
      const moveCol = (end.col - currentCol) !== 0 ? (end.col > currentCol ? 1 : -1) : 0;

      // Sometimes randomize a move to simulate "winding" paths
      if (Math.random() < 0.5) {
        currentRow += moveRow;
      } else {
        currentCol += moveCol;
      }

      path.push({ row: currentRow, col: currentCol });

      // Ensure we don't go out of bounds (if needed)
      currentRow = Math.max(0, Math.min(rows - 1, currentRow));
      currentCol = Math.max(0, Math.min(cols - 1, currentCol));
    }

    return path;
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <button 
          onClick={() => setMode("start-end")}
          className={mode === "start-end" ? "active" : ""}
        >
          Place Start/End
        </button>
        
        <button 
          onClick={() => setMode("roadblock")}
          className={mode === "roadblock" ? "active" : ""}
        >
          Place Roadblock
        </button>
        
        <button 
          onClick={() => setMode("traffic")}
          className={mode === "traffic" ? "active" : ""}
        >
          Place Traffic Zone
        </button>
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
  <div className="grid-container" style={{
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    position: 'relative',
    gap: '6px',
  }}>
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
          } else if (route.path && route.path.some(p => p.row === row && p.col === col)) {
            shape = "path";
            cellColor = route.color;
          }
        }

        const isTrafficZone = gridData[row] && gridData[row][col] && gridData[row][col].type === 'trafficZone';
        const trafficZoneClass = isTrafficZone ? 'traffic-zone' : '';

        return (
          <div
            key={`${row}-${col}`}
            className={`grid-cell ${trafficZoneClass}`}
            onClick={() => handleCellClick(row, col)}
            style={{
              width: cellSize,
              height: cellSize,
              position: 'relative',
            }}
          >
            {shape === "circle" && <div className="circle" style={{ backgroundColor: cellColor }} />}
            {shape === "square" && <div className="square" style={{ backgroundColor: cellColor }} />}
            {shape === "path" && <div className="path" style={{ backgroundColor: cellColor }} />}
          </div>
        );
      })
    )}

    {/* Render lines */}
    {routes.map((route, routeIndex) => (
      route.path && route.path.length > 1 && route.path.map((point, pointIndex) => {
        if (pointIndex < route.path.length - 1) {
          const start = route.path[pointIndex];
          const end = route.path[pointIndex + 1];

          const startX = start.col * (cellSize + 6) + cellSize / 2; // Adjusting for gap 
          const startY = start.row * (cellSize + 6) + cellSize / 2;
          const endX = end.col * (cellSize + 6) + cellSize / 2; 
          const endY = end.row * (cellSize + 6) + cellSize / 2; 

          // Calculate the line's angle and distance
          const deltaX = endX - startX;
          const deltaY = endY - startY;
          const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

          return (
            <div
              key={`line-${routeIndex}-${pointIndex}`}
              className="line"
              style={{
                position: 'absolute',
                top: startY + 8, 
                left: startX + 9.5, 
                width: length,
                height: 4, 
                backgroundColor: route.color,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0% 0%',
                zIndex: 1,
              }}
            />
          );
        }
        return null;
      })
    ))}
  </div>
</div>



      </div>
    </div>
  );
};

export default ResizableGrid;
