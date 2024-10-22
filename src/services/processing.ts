import { CONVERTED_WIDTH, SOBEL_THRESHOLD } from "../index.js";

export function calculateAverageProximalLuminance(
  data: number[] | Buffer,
  cellSide: number,
  height: number,
  width: number
): number[] {
  const outputLuminocity: number[] = [];
  for (let i = 0; i < height; i += cellSide) {
    for (let j = 0; j < width; j += cellSide) {
      let cellSum = 0;
      for (let k = i; k < i + cellSide; k++) {
        for (let l = j; l < j + cellSide; l++) {
          const index = fakeMatrixCoordinatesToIndex(l, k, width);
          cellSum += data[index];
        }
      }
      const cellAverage = cellSum / cellSide ** 2;
      outputLuminocity.push(cellAverage);
    }
  }

  return outputLuminocity;
}

export function getPixelMatrix(data: Buffer | Types.FlatPixelData, height: number, width: number): Types.Matrix {
  const matrix = makeEmptyMatrix(width, height);
  let row = 0;
  let column = 0;

  for (let i = 0; i < data.length; i++) {
    const pixel = data[i];

    matrix[row][column] = pixel;

    column++;

    if (column >= width) {
      column = 0;
      row++;
    }

    if (row >= height) {
      break;
    }
  }

  return matrix;
}

function makeEmptyMatrix(width: number, height: number): Array<number[]> {
  const matrix = new Array(height);
  for (let i = 0; i < height; i++) {
    matrix[i] = new Array(width).fill(0);
  }
  return matrix;
}

export function detectEdges(
  matrix: Buffer | number[],
  width: number,
  height: number
): { magnitudes: number[]; directions: number[] } {
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

  const magnitudes: number[] = [];
  const directions: number[] = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let sumX = 0;
      let sumY = 0;

      for (let k = 0; k <= 2; k++) {
        for (let l = 0; l <= 2; l++) {
          const y = i + k - 1;
          const x = j + l - 1;

          const index = fakeMatrixCoordinatesToIndex(x, y, CONVERTED_WIDTH);

          if (!matrix[index]) {
            sumX = 0;
            sumY = 0;
            continue;
          }

          const px = matrix[index];

          sumX += px * kernels.x[k][l];
          sumY += px * kernels.y[k][l];
        }
      }
      const mag = Math.sqrt(sumX ** 2 + sumY ** 2);
      const direction = Math.atan2(sumX, sumY);

      const threshold = SOBEL_THRESHOLD;

      const index = fakeMatrixCoordinatesToIndex(j, i, CONVERTED_WIDTH);

      magnitudes[index] = mag > threshold ? mag : 0;
      directions[index] = mag > threshold ? direction : 0;
    }
  }

  return { magnitudes, directions };
}

type Cartesian = {
  x: number;
  y: number;
};

export function indexToFakeMatrixCoordinates(index: number, width: number): Cartesian {
  const y = Math.trunc(index / width);
  const x = index % width;

  return { x, y };
}

export function fakeMatrixCoordinatesToIndex(x: number, y: number, width: number): number {
  return y * width + x;
}
