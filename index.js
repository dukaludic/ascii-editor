import sharp from 'sharp'

const imagePath = process.argv[2]

const { data, info } = await sharp(imagePath)
  .raw()
  .greyscale()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info

function getCellSideSizeInOriginalPixelsQuantity(originalHeight) {
  return originalHeight / 50
}

function getPerceivedLuminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getPixelMatrix(data) {
  const matrix = new Array(height).fill().map(() => []);
  let row = 0
  
  for (const pixel of data) {
    if(matrix[row].length >= width) {
      row++
      matrix[row].push(pixel)
    } else {
      matrix[row].push(pixel)
    }
  }

  return matrix
}

const matrix = getPixelMatrix(data)

console.log(matrix)

const cellSide = 50 // ovo takodje treba da varira. Npr ako je slika manja da ne izgubi sve

for (let i = 0; i < height; i+= cellSide) {
  for (let j = 0; j < width; j+= cellSide) {
    for (let k = i; k < i + cellSide; k++) {
      for (let l = j; l < j + cellSide; l++) {
        console.log({i,j,k,l})
        
      }
      
    }
    
  }
  
}

await sharp(data, { raw: { width, height, channels } })
  .toFormat('jpg')
  .toFile('output.jpg')
