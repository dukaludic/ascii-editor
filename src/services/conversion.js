import { ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from "../index.js";

const ascii = ["■", "@", "?", "0", "P", "o", "c", ":", ".", " "].reverse();
const edges = ["#", "|", "—", "/", "\\"];

export function findAppropriateAsciiCharacter(value) {
  // return " ";
  const percentage = (value / 255) * 100;
  let index = Math.floor(percentage / 10);
  if (percentage > 80) {
    index = 9;
  }
  return ascii[index];
}

export function convertToAscii(matrix, magnitudes, directions) {
  const output = [];

  for (let i = 0; i < ORIGINAL_HEIGHT; i++) {
    for (let j = 0; j < ORIGINAL_WIDTH; j++) {
      const edgeMapTwin = directions[i][j];
      const isEdge = edgeMapTwin !== 0;
      if (isEdge) {
        output.push("#");
      } else {
        output.push(findAppropriateAsciiCharacter(matrix[i][j]));
      }
    }
  }

  const count = output.filter((i) => i === "#");

  return output;
}
