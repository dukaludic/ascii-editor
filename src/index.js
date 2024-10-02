import { calculateAverageProximalLuminance, getPixelMatrix } from "./services/processing.js";
import { setupCanvas, writeAscii, writeToFileSystem } from "./services/writer.js";

import { convertToAscii } from "./services/conversion.js";
import { readGreyscaleImage } from "./services/reader.js";

const __dirname = process.cwd();
const imagePath = process.argv[2];
const cellSide = 10;

const { data, width, height } = await readGreyscaleImage(imagePath);

const matrix = getPixelMatrix(data, height, width);

const proximalLuminanceOutput = calculateAverageProximalLuminance(matrix, cellSide, height, width);

const asciiOutput = convertToAscii(proximalLuminanceOutput);

setupCanvas(width, height);
writeAscii(asciiOutput);
writeToFileSystem(__dirname);
