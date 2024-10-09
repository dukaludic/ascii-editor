import sharp from "sharp";

export async function readGreyscaleImage(path) {
  const { data, info } = await sharp(path).greyscale().blur().resize(1000).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  return { data, width, height };
}
