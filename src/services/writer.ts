import { CELL_SIDE, CONVERTED_WIDTH, FONT_SIZE } from "../index.js";
import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";

import fs from "fs";

let ctx: CanvasRenderingContext2D;
let canvas: Canvas;
let x = 0;
let y = 0;

export function setupCanvas(width: number, height: number): Canvas {
  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${FONT_SIZE}px sans`;
  ctx.fillStyle = "black";

  return canvas;
}

export function writeAscii(data: string[]): void {
  data.forEach((char, i) => {
    ctx.fillText(char, x, y);
    x += CELL_SIDE;

    if (i !== 0 && i % CONVERTED_WIDTH == 0) {
      x = 0;
      y += CELL_SIDE;
    }
  });
}

export function writeToFileSystem(directory: string, name: string, canvas: Canvas): void {
  const out = fs.createWriteStream(directory + `/${name}.png`);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on("finish", () => {
    console.log(`Ascii image was created and saved as ${name}.png`);
  });
}

export function debugDraw(data: { matrix?: Types.Matrix; array?: Buffer }, width: number, gridSquarePx: number = 100) {
  if (!data.array) {
    return;
  }

  const debugCanvas = createCanvas(1400, 1400);
  const ctx = debugCanvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, debugCanvas.width, debugCanvas.height);

  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < data.array.length; i++) {
    const x = (i % width) * gridSquarePx + gridSquarePx / 2;
    const y = Math.floor(i / width) * gridSquarePx + gridSquarePx / 2;

    ctx.fillText(data.array[i].toString(), x, y);
  }

  writeToFileSystem(process.cwd(), "debug", debugCanvas);
}
