import sharp from "sharp";

export async function readGreyscaleImage(path: string): Promise<{ data: Buffer; width: number; height: number }> {
  const { data, info } = await sharp(path).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  return { data, width, height };
}
