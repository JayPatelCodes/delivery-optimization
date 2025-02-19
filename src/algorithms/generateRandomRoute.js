const generateRandomRoute = (start, end, rows, cols) => {
    const path = [];
    let currentRow = start.row;
    let currentCol = start.col;
  
    path.push({ row: currentRow, col: currentCol });
  
    while (currentRow !== end.row || currentCol !== end.col) {
      const moveRow = (end.row - currentRow) !== 0 ? (end.row > currentRow ? 1 : -1) : 0;
      const moveCol = (end.col - currentCol) !== 0 ? (end.col > currentCol ? 1 : -1) : 0;
  
      if (Math.random() < 0.5) {
        currentRow += moveRow;
      } else {
        currentCol += moveCol;
      }
  
      path.push({ row: currentRow, col: currentCol });
  
      currentRow = Math.max(0, Math.min(rows - 1, currentRow));
      currentCol = Math.max(0, Math.min(cols - 1, currentCol));
    }
  
    return path;
  };
  
  export default generateRandomRoute;