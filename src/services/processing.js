import { SOBEL_THRESHOLD } from "../index.js";

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

function makeEmptyMatrix(width, height) {
  const matrix = new Array(height);
  for (let i = 0; i < height; i++) {
    matrix[i] = new Array(width).fill(0);
  }
  return matrix;
}

export function sobelize(matrix, width, height) {
  const kernels = {
    x: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
    y: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
  };

  const magnitudes = makeEmptyMatrix(width, height);
  const directions = makeEmptyMatrix(width, height);
  const magnitudesArray = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let sumX = 0;
      let sumY = 0;

      for (let k = 0; k <= 2; k++) {
        for (let l = 0; l <= 2; l++) {
          if (!matrix[i + k - 1]) {
            sumX = 0;
            sumY = 0;
            continue;
          }

          const px = matrix[i + k - 1][j + l - 1];

          sumX += px * kernels.x[k][l];
          sumY += px * kernels.y[k][l];
        }
      }
      const mag = Math.sqrt(sumX ** 2 + sumY ** 2);
      const direction = Math.atan2(sumX, sumY);

      const threshold = SOBEL_THRESHOLD;

      magnitudes[i][j] = mag > threshold ? mag : 0;
      directions[i][j] = mag > threshold ? direction : 0;

      magnitudesArray.push(mag > threshold ? mag : 0);
    }
  }

  return { magnitudes, directions, magnitudesArray };
}
