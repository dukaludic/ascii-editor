export function calculateAverageProximalLuminance(matrix, cellSide, height, width) {
  const outputLuminocity = [];
  for (let i = 0; i < height; i += cellSide) {
    for (let j = 0; j < width; j += cellSide) {
      let cellSum = 0;
      for (let k = i; k < i + cellSide; k++) {
        for (let l = j; l < j + cellSide; l++) {
          cellSum += matrix[k][l];
        }
      }
      const cellAverage = cellSum / cellSide ** 2;
      outputLuminocity.push(cellAverage);
    }
  }

  return outputLuminocity;
}

export function getPixelMatrix(data, height, width) {
  const matrix = new Array(height).fill().map(() => []);
  let row = 0;

  for (const pixel of data) {
    if (matrix[row].length >= width) {
      row++;
      matrix[row].push(pixel);
    } else {
      matrix[row].push(pixel);
    }
  }

  return matrix;
}
