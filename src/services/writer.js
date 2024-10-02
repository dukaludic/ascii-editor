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

  ctx.font = "10px sans";
  ctx.fillStyle = "black";
}

export function writeAscii(data) {
  data.forEach((char, i) => {
    ctx.fillText(char, x, y);
    x += 10;

    if (i !== 0 && i % 140 == 0) {
      x = 0;
      y += 10;
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
