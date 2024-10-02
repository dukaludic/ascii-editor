import sharp from "sharp";

export async function readGreyscaleImage(path) {
  const { data, info } = await sharp(path).raw().greyscale().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  return { data, width, height };
}
