import { calculateAverageProximalLuminance, detectEdges, getPixelMatrix } from "./services/processing.js";
import { debugDraw, setupCanvas, writeAscii, writeToFileSystem, writeToTextFile } from "./services/writer.js";

import { convertToAscii } from "./services/conversion.js";
import { readGreyscaleImage } from "./services/reader.js";

export const CELL_SIDE = 20;
export const SOBEL_THRESHOLD = 900;
export const FONT_SIZE = 20;

const __dirname = process.cwd();
const imagePath = process.argv[2];

const { data, width, height } = await readGreyscaleImage(imagePath);

export const ORIGINAL_HEIGHT = width;
export const ORIGINAL_WIDTH = height;
export const CONVERTED_WIDTH = ORIGINAL_WIDTH / CELL_SIDE;
export const CONVERTED_HEIGHT = ORIGINAL_HEIGHT / CELL_SIDE;

const isDetectEdgesEnabled = false;

let magnitudes: number[] | undefined = undefined;
let directions: number[] | undefined = undefined;

if (isDetectEdgesEnabled) {
  const edges = detectEdges(data, width, height);
  magnitudes = edges.magnitudes;
  directions = edges.directions;
}

const proximalLuminanceOutput = calculateAverageProximalLuminance(data, CELL_SIDE, height, width);

const asciiOutput = convertToAscii(proximalLuminanceOutput, magnitudes, directions);

const canvas = setupCanvas(width, height);
writeToTextFile(asciiOutput);
writeAscii(asciiOutput);
writeToFileSystem(__dirname, "output", canvas);
// debugDraw({ array: data }, ORIGINAL_HEIGHT, CELL_SIDE);
