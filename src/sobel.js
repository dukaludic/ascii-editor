import sharp from "sharp";

const __dirname = process.cwd();
const path = process.argv[2];

const { data, info } = await sharp(path).blur(5).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

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

const matrix = getPixelMatrix(data);

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

  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      let sumX = 0;
      let sumY = 0;

      for (let k = 0; k <= 2; k++) {
        for (let l = 0; l <= 2; l++) {
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

      magnitudesArray[i] = mag > threshold ? mag : 0;
    }
  }

  return { magnitudes, directions, magnitudesArray };
}

const sobel = sobelize(matrix, width, height);
