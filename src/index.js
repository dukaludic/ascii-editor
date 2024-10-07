import { calculateAverageProximalLuminance, getPixelMatrix, sobelize } from "./services/processing.js";
import { setupCanvas, writeAscii, writeToFileSystem } from "./services/writer.js";

import { convertToAscii } from "./services/conversion.js";
import { readGreyscaleImage } from "./services/reader.js";
import sharp from "sharp";

export const CELL_SIDE = 10;
export const SOBEL_THRESHOLD = 5;
export const FONT_SIZE = 5;

const __dirname = process.cwd();
const imagePath = process.argv[2];

const { data, width, height } = await readGreyscaleImage(imagePath);

export const ORIGINAL_HEIGHT = width;
export const ORIGINAL_WIDTH = height;
export const CONVERTED_ROW_LENGTH = ORIGINAL_WIDTH / CELL_SIDE;

const matrix = getPixelMatrix(data, height, width);

const { magnitudes, directions, magnitudesArray } = sobelize(matrix, width, height);

const proximalLuminanceOutput = calculateAverageProximalLuminance(matrix, CELL_SIDE, height, width);

const proximalLuminanceOutputMatrix = getPixelMatrix(proximalLuminanceOutput, height, width);

const asciiOutput = convertToAscii(proximalLuminanceOutputMatrix, magnitudes, directions);

setupCanvas(width, height);
writeAscii(asciiOutput);
writeToFileSystem(__dirname);

const buffer = Buffer.from(magnitudesArray);

sharp(buffer, {
  raw: {
    width: width,
    height: height,
    channels: 1,
  },
})
  .toFile("grayscale_image.png")
  .then(() => {
    console.log("Grayscale image successfully saved as grayscale_image.png");
  })
  .catch((err) => {
    console.error("Error saving grayscale image:", err);
  });
