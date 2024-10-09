import { CONVERTED_HEIGHT, CONVERTED_WIDTH, ORIGINAL_HEIGHT, ORIGINAL_WIDTH } from "../index.js";

const ascii = ["■", "@", "?", "0", "P", "o", "c", ":", ".", " "];
const edges = ["|", "—", "/", "\\"];

export function findAppropriateAsciiCharacter(value) {
  // return " ";
  const percentage = (value / 255) * 100;
  let index = Math.floor(percentage / 10);
  if (percentage > 80) {
    index = 9;
  }
  return ascii[index];
}

export function findAppropriateEdgeCharacter(direction) {
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

export function convertToAscii(matrix, magnitudes, directions) {
  const output = [];

  for (let i = 0; i < CONVERTED_HEIGHT; i++) {
    for (let j = 0; j < CONVERTED_WIDTH; j++) {
      const edgeMapTwin = magnitudes[i * 10][j * 10];
      const isEdge = edgeMapTwin > 0;
      const direction = directions[i * 10][j * 10];
      if (isEdge) {
        output.push(findAppropriateEdgeCharacter(direction));
      } else {
        output.push(findAppropriateAsciiCharacter(matrix[i][j]));
      }
    }
  }

  return output;
}
