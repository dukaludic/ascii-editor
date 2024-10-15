import { calculateAverageProximalLuminance, detectEdges, getPixelMatrix } from "./services/processing.js";
import { setupCanvas, writeAscii, writeToFileSystem } from "./services/writer.js";

import { convertToAscii } from "./services/conversion.js";
import { readGreyscaleImage } from "./services/reader.js";

export const CELL_SIDE = 14;
export const SOBEL_THRESHOLD = 900;
export const FONT_SIZE = 10;

const __dirname = process.cwd();
const imagePath = process.argv[2];

const { data, width, height } = await readGreyscaleImage(imagePath);

export const ORIGINAL_HEIGHT = width;
export const ORIGINAL_WIDTH = height;
export const CONVERTED_WIDTH = ORIGINAL_WIDTH / CELL_SIDE;
export const CONVERTED_HEIGHT = ORIGINAL_HEIGHT / CELL_SIDE;

const matrix: Types.Matrix = getPixelMatrix(data, height, width);

const { magnitudes, directions } = detectEdges(matrix, width, height);

const proximalLuminanceOutput = calculateAverageProximalLuminance(matrix, CELL_SIDE, height, width);

const proximalLuminanceOutputMatrix = getPixelMatrix(proximalLuminanceOutput, CONVERTED_HEIGHT, CONVERTED_HEIGHT);

const asciiOutput = convertToAscii(proximalLuminanceOutputMatrix, magnitudes, directions);

setupCanvas(width, height);
writeAscii(asciiOutput);
writeToFileSystem(__dirname);
