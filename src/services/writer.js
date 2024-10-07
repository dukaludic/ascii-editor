import { CELL_SIDE, CONVERTED_ROW_LENGTH, FONT_SIZE } from "../index.js";

import { createCanvas } from "canvas";
import fs from "fs";

let ctx;
let canvas;
let x = 0;
let y = 0;

export function setupCanvas(width, height) {
  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${FONT_SIZE}px sans`;
  ctx.fillStyle = "black";
}

export function writeAscii(data) {
  data.forEach((char, i) => {
    ctx.fillText(char, x, y);
    x += CELL_SIDE;

    if (i !== 0 && i % CONVERTED_ROW_LENGTH == 0) {
      x = 0;
      y += CELL_SIDE;
    }
  });
}

export function writeToFileSystem(directory) {
  const out = fs.createWriteStream(directory + "/output.png");
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on("finish", () => {
    console.log("Ascii image was created and saved as output.png");
  });
}
