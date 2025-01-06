import React, { useState } from 'react';

const ResizableGrid = ({ onCellClick }) => {
  const [rows, setRows] = useState(5); // Default number of rows
  const [cols, setCols] = useState(5); // Default number of columns
  const cellSize = 50; // Size of each cell in pixels

  // Calculate the width and height of the grid
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  // Generate grid cells
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ x: col * cellSize, y: row * cellSize, row, col });
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Rows: 
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value) || 1)}
            min="5"
            max="20"
            style={{ margin: '0 10px' }}
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
            style={{ margin: '0 10px' }}
          />
        </label>
      </div>
      <svg
        width={gridWidth}
        height={gridHeight}
        style={{ border: '1px solid black' }}
        onClick={(e) => {
          const rect = e.target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const clickedCol = Math.floor(x / cellSize);
          const clickedRow = Math.floor(y / cellSize);

          if (onCellClick) {
            onCellClick(clickedRow, clickedCol);
          }
        }}
      >
        {/* Render grid lines */}
        {cells.map((cell, index) => (
          <rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            fill="white"
            stroke="black"
          />
        ))}
      </svg>
    </div>
  );
};

export default ResizableGrid;
