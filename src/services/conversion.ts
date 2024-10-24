import { CELL_SIDE, CONVERTED_HEIGHT, CONVERTED_WIDTH } from "../index.js";

import { fakeMatrixCoordinatesToIndex } from "./processing.js";

const ascii = ["■", "@", "?", "0", "P", "o", "c", ":", ".", " "];
const edges = ["|", "—", "/", "\\"];

export function findAppropriateAsciiCharacter(value: number) {
  const percentage = (value / 255) * 100;
  let index = Math.floor(percentage / 10);
  if (percentage > 80) {
    index = 9;
  }
  return ascii[index];
}

export function findAppropriateEdgeCharacter(direction: number): string {
  switch (true) {
    case direction >= -0.1 && direction <= 0.1:
      return "—";
    case direction > 0.1 && direction <= 0.78:
      return "/";
    case direction > 0.78 && direction <= 2.35:
      return "|";
    case direction > 2.35 && direction <= 3.14:
      return "\\";
    case direction < -0.1 && direction >= -0.78:
      return "\\";
    case direction < -0.78 && direction >= -2.35:
      return "|";
    case direction < -2.35 && direction >= -3.14:
      return "/";
    default:
      return " ";
  }
}

export function convertToAscii(data: number[], magnitudes?: number[], directions?: number[]) {
  const output: string[] = [];

  for (let i = 0; i < CONVERTED_HEIGHT; i++) {
    for (let j = 0; j < CONVERTED_WIDTH; j++) {
      const index = fakeMatrixCoordinatesToIndex(j, i, CONVERTED_WIDTH);
      if (magnitudes && directions) {
        const edgesIndex = fakeMatrixCoordinatesToIndex(j * CELL_SIDE, i * CELL_SIDE, CONVERTED_WIDTH);
        const edgeMapTwin = magnitudes && magnitudes[edgesIndex];
        const isEdge = edgeMapTwin > 0;
        const direction = directions[edgesIndex];
        if (isEdge) {
          output.push(findAppropriateEdgeCharacter(direction));
        } else {
          output.push(findAppropriateAsciiCharacter(data[index]));
        }
      } else {
        output.push(findAppropriateAsciiCharacter(data[index]));
      }
    }
  }

  return output;
}
