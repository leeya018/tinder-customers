const { readImagesFromTxt, fromUrlToImage } = require("./api")
const { sleep } = require("./util")

async function imagesConv(sourcePath, outputPath) {
  let imgUrls = readImagesFromTxt(sourcePath)
  imgUrls = [...new Set(imgUrls)]
  console.log(imgUrls)
  let i = 509
  for (const url of imgUrls.reverse()) {
    await fromUrlToImage(url, outputPath + `\\${i}.png`)
    i++
  }
}
const sourceLikes = "./tensorFolder/like.txt"
const sourcePass = "./tensorFolder/pass.txt"

const outputAll = "C:\\Users\\user\\Documents\\tinder-tensor\\sarit"
// C:\Users\user\Documents\tinder-tensor\sarit
// const url =
//   "https://images-ssl.otinder.com/u/e6bfb9njR9JbaePj89/c9WUMBYKeKzkpmvj5Ajs19.jpeg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9uYjh4ZTZiZmI5bmpSOUpiYWVQajg5LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MDg0NTA5NjB9fX1dfQ__&Signature=Zu5WrbU5hIkrnHRYjW8rOVfaKm9H~1xNTvjV0PjLc9-Di2bY4iSx213AWLomBJFDvSx25h7zhjRlg4zRe2d6Q7qdGj~ZM~ZH6G2wp9f89dJLiKwct4rzVUCyn3xrhyJfwsClq5LK02HZuN9UyWd9ulUHl~8RXmKYOX1Zr1TfuepvSnnhXTo4faPqe~jvWvXIZp3rByLUXHACEzhkRAQ50LmDkiVTxpSliMmdXUjskHOG4Ik6tT0nr-yWH4c9nPU2m6kTFfSiAAHod16r1xS9Vsn6WN4mvkfodRbIat8qIL1bk90PcZmi54oOcpNBR57pAH1ZoHCjpeK-s7PCANdlww__&Key-Pair-Id=K368TLDEUPA6OI"
// fromUrlToImage(url, outputAll + "\\4.png")
// imagesConv(sourceLikes, outputAll)
imagesConv(sourcePass, outputAll)

// let big = 0
// let small = 0

// let switchSm = 0

// async function rotate() {
//   while (true) {
//     const rand = Math.random()
//     if (rand < 0.03) {
//       console.log({ switchSm })
//       switchSm = 0
//       small++
//     }
//     {
//       switchSm++
//       big++
//     }
//     await sleep(200)
//     console.log({ small, big, rand })
//   }
// }
// rotate()
