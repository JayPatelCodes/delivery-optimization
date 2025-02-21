import React from "react";
import './ResizableGrid.css';

const ResizableGrid = ({ rows, cols, routes, setRoutes, mode, gridData, setGridData, availableColors, setAvailableColors }) => {
  const cellSize = 50;

  const handleCellClick = (row, col) => {
    if (mode === "start-end") {
        console.log("Placing start/end at:", row, col); // Debugging log
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
            setRoutes((prev) => [...prev, { start: { row, col }, end: { row: -1, col: -1 }, color: newColor }]);
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
        const isTrafficZone = gridData[row][col].type === "trafficZone";
        gridData[row][col].type = isTrafficZone ? "normal" : "trafficZone";
        setGridData([...gridData]);
      }
    }
  };

  return (
    <div className="grid-wrapper">
      <div className="grid-container" style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gridTemplateRows: `repeat(${rows}, ${cellSize}px)`, position: "relative", gap: "6px" }}>
        {[...Array(rows)].map((_, row) =>
          [...Array(cols)].map((_, col) => {
            const isTrafficZone = gridData[row] && gridData[row][col] && gridData[row][col].type === "trafficZone";
            return (
              <div key={`${row}-${col}`} className={`grid-cell ${isTrafficZone ? "traffic-zone" : ""}`} onClick={() => handleCellClick(row, col)} style={{ width: cellSize, height: cellSize, position: "relative" }} />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResizableGrid;
