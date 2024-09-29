import canvas from 'canvas'
import sharp from 'sharp'

const imagePath = process.argv[2]

const { data, info } = await sharp(imagePath)
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info

function getPerceivedLuminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// koliko treba pixela da spojim u jednu vrednost?
//

for (let i = 0; i < data.length; i += channels) {
  if (data[i] > 5) {
    data[i] = 0
  }
}

await sharp(data, { raw: { width, height, channels } })
  .toFormat('jpg')
  .toFile('output.jpg')
