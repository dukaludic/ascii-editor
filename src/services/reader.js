import sharp from "sharp";

export async function readGreyscaleImage(path) {
  const { data, info } = await sharp(path).blur(5).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  return { data, width, height };
}
