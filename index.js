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

// Dobijem koliki je cell u originalnim pixelima
// 4 loopa: cell po cell su 2 i 2 su pixeli u cellu

const cellSideSize = 1

// for (let i = 0; i < height * channels; i += cellSideSize * channels) {
//   for (let j = 0; j < width * channels; j += cellSideSize * channels) {
//     for (
//       let k = i * cellSideSize;
//       k < i * cellSideSize + cellSideSize;
//       k += 1 * channels
//     ) {
//       for (
//         let l = j * cellSideSize;
//         l < j * cellSideSize + cellSideSize;
//         l += 1 * channels
//       ) {
//         console.log({ i, j, k, l })
//       }
//     }
//   }
// }

// koliko treba pixela da spojim u jednu vrednost?
// output ce da bude 50 x N za pocetak
//  ratio treba da ostane isti
// to znaci da treba da treba da odredim koliko pixela od input slike upada u 1/50 deo koji ce biti jedan character
// jedan karater ce da bude 10 x 10 pixela
// X input pixela loopujem i trazim sredisnje vrednosti da dobijem luminocity od grupe pixela
// ako broj input pixela nije deljiv sa 50 ?

// for (let i = 0; i < data.length; i += 3) {
//   //   if (data[i] > 5) {
//   data[i] = 255
//   //   }
// }

// for (let i = 0; i < height; i += cellSideSize) {
//   for (let j = 0; j < width; j += cellSideSize) {
//     for (let k = 0; k < ; k++) {
//       for(let l = 0; k < data.length / height; l++) {
//         console.log({i,j,k,l})
//       }
//     }
//   }
// }

await sharp(data, { raw: { width, height, channels } })
  .toFormat('jpg')
  .toFile('output.jpg')
