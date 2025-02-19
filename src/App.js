import React, { useState, useEffect } from "react";
import ResizableGrid from "./components/ResizableGrid";
import GridControls from "./components/GridControls";
import Sidebar from "./components/Sidebar";
import generateRandomRoute from "./algorithms/generateRandomRoute";
import './App.css'; 

function App() {
  const colors = ["red", "orange", "yellow", "green", "blue"];
  const [availableColors, setAvailableColors] = useState([...colors]);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [routes, setRoutes] = useState([]);
  const [mode, setMode] = useState("start-end");
  const [gridData, setGridData] = useState(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ type: 'empty' })))
  );

  useEffect(() => {
    setGridData(
      Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ type: 'empty' })))
    );
  }, [rows, cols]);

  const handleStartGeneticAlgorithm = () => {
    if (routes.length === 5 && routes.every(route => route.end.row !== -1)) {
      const newRoutes = routes.map(route => ({
        ...route,
        path: generateRandomRoute(route.start, route.end, rows, cols)
      }));
      setRoutes(newRoutes);
      alert("Genetic algorithm started with randomly generated routes!");
    }
  };

  return (
    <div>
      <h1 className="grid-title">Delivery Optimization Grid</h1>
      <div className="layout-container">
        <Sidebar mode={mode} setMode={setMode} />
        <div className="main-content">
          <GridControls 
            rows={rows} 
            cols={cols} 
            setRows={setRows} 
            setCols={setCols} 
            canStartAlgorithm={routes.length === 5 && routes.every(route => route.end.row !== -1)} 
            handleStartGeneticAlgorithm={handleStartGeneticAlgorithm} 
          />
          <ResizableGrid 
            rows={rows} 
            cols={cols} 
            routes={routes} 
            setRoutes={setRoutes} 
            mode={mode} 
            gridData={gridData} 
            setGridData={setGridData} 
            availableColors={availableColors} 
            setAvailableColors={setAvailableColors} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
