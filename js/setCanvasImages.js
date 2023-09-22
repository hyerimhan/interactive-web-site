import sceneInfo from './constants.js'

function setCanvasImages() {
  // 0
  let imgElem
  for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
    // new Image() = document.createElement('img')
    imgElem = new Image()
    imgElem.src = `./video/001/IMG_${6726 + i}.JPG`
    sceneInfo[0].objs.videoImages.push(imgElem)
  }

  // 2
  let imgElem2
  for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
    imgElem2 = new Image()
    imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`
    sceneInfo[2].objs.videoImages.push(imgElem2)
  }

  // 3
  let imgElem3
  for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
    imgElem3 = new Image()
    imgElem3.src = sceneInfo[3].objs.imagesPath[i]
    sceneInfo[3].objs.images.push(imgElem3)
  }
}

export default setCanvasImages
