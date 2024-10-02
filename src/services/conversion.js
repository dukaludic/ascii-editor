const ascii = ["■", "@", "?", "0", "P", "o", "c", ":", ".", " "];

export function findAppropriateAsciiCharacter(value) {
  const percentage = (value / 255) * 100;
  const index = Math.floor(percentage / 10);
  return ascii[index];
}

export function convertToAscii(data) {
  const output = [];
  for (const cell of data) {
    output.push(findAppropriateAsciiCharacter(cell));
  }

  return output;
}
