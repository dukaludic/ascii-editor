import { createCanvas } from "canvas";
import { dirname } from "path";
import fs from "fs";
import sharp from "sharp";

// Get the current file path from import.meta.url
// const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = process.cwd();

const imagePath = process.argv[2];

const { data, info } = await sharp(imagePath).raw().greyscale().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

function getCellSideSizeInOriginalPixelsQuantity(originalHeight) {
  return originalHeight / 50;
}

function getPerceivedLuminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getPixelMatrix(data) {
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

// console.log(matrix)

const cellSide = 10; // ovo takodje treba da varira. Npr ako je slika manja da ne izgubi sve

const mergedMatrix = new Array(height / cellSide).fill().map(() => []);
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
    mergedMatrix[i / cellSide][j / cellSide] = cellAverage;
  }
}
console.log(mergedMatrix);

const ascii = ["■", "@", "?", "0", "P", "o", "c", ":", ".", " "];

function findAppropriateAsciiCharacter(value) {
  const percentage = (value / 255) * 100;
  let index = 0;
  if (percentage > 0 && percentage < 10) {
    index = 0;
  } else if (percentage > 10 && percentage < 20) {
    index = 1;
  } else if (percentage > 20 && percentage < 30) {
    index = 2;
  } else if (percentage > 30 && percentage < 40) {
    index = 3;
  } else if (percentage > 40 && percentage < 50) {
    index = 4;
  } else if (percentage > 50 && percentage < 60) {
    index = 5;
  } else if (percentage > 60 && percentage < 70) {
    index = 6;
  } else if (percentage > 70 && percentage < 80) {
    index = 7;
  } else if (percentage > 80 && percentage < 90) {
    index = 8;
  } else if (percentage > 90 && percentage < 100) {
    index = 9;
  }
  return ascii[index];
}

const output = [];
for (const cell of outputLuminocity) {
  output.push(findAppropriateAsciiCharacter(cell));
}

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";

ctx.fillRect(0, 0, width, height);

ctx.font = "10px serif";
ctx.fillStyle = "black";

let x = 0;
let y = 0;

ctx.fillStyle = "black";

output.forEach((char, i) => {
  // if(i !== 0 && i % 350 === 0) {
  //   y += 20
  // }

  ctx.fillText(char, x, y);
  x += 10;

  if (i !== 0 && i % 140 == 0) {
    x = 0;
    y += 10;
  }
});

const out = fs.createWriteStream(__dirname + "/draw_characters.png");
const stream = canvas.createPNGStream();
stream.pipe(out);

out.on("finish", () => {
  console.log("Character image was created and saved as draw_characters.png");
});
