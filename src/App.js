import React, { useState } from 'react';
import ResizableGrid from './components/ResizableGrid';

const App = () => {
  const [deliveryPoints, setDeliveryPoints] = useState([]);

  const handleCellClick = (row, col) => {
    // Check if the point already exists
    const exists = deliveryPoints.some(
      (point) => point.row === row && point.col === col
    );
    if (exists) {
      // Remove point if clicked again
      setDeliveryPoints(deliveryPoints.filter((point) => point.row !== row || point.col !== col));
    } else {
      // Add new delivery point
      setDeliveryPoints([...deliveryPoints, { row, col }]);
    }
  };

  return (
    <div>
      <h1>Delivery Route Grid</h1>
      <ResizableGrid onCellClick={handleCellClick} />
      <div>
        <h2>Delivery Points:</h2>
        <ul>
          {deliveryPoints.map((point, index) => (
            <li key={index}>
              Row: {point.row}, Col: {point.col}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
