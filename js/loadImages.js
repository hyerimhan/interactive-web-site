import sceneInfo from './constants.js'

// 캔버스 이미지 로드
const scene0Images = []
const scene2Images = []

// Scene0 이미지 로드
export function loadImageOfScene0(currentScene, yOffset) {
  if (sceneInfo[0].finishedLoadingImages) return

  let numberOfLoadedImages = 0
  for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
    let imgElem = new Image()
    imgElem.src = `./video/001/IMG_${6726 + i}.JPG`
    imgElem.addEventListener('load', () => {
      scene0Images.push(imgElem)
      numberOfLoadedImages++

      if (numberOfLoadedImages === sceneInfo[0].values.videoImageCount) {
        // 해당 씬의 이미지가 모두 로드되었으면
        sceneInfo[0].finishedLoadingImages = true
        setImagesOfScene0()
        initAfterLoadImages(currentScene, yOffset)

        if (!sceneInfo[2].finishedLoadingImages) loadImageOfScene2()
      }
    })
  }
}

// Scene2 이미지 로드
export function loadImageOfScene2(currentScene, yOffset) {
  if (sceneInfo[2].finishedLoadingImages) return

  let numberOfLoadedImages = 0
  for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
    let imgElem = new Image()
    imgElem.src = `./video/002/IMG_${7027 + i}.JPG`
    imgElem.addEventListener('load', () => {
      scene2Images.push(imgElem)
      numberOfLoadedImages++

      if (numberOfLoadedImages === sceneInfo[2].values.videoImageCount) {
        // 해당 씬의 이미지가 모두 로드되었으면
        sceneInfo[2].finishedLoadingImages = true
        setImagesOfScene2()
        initAfterLoadImages(currentScene, yOffset)

        if (!sceneInfo[0].finishedLoadingImages) loadImageOfScene0()
      }
    })
  }
}

// 이미지 파일의 번호만 추출하는 함수
function getImageNumber(str) {
  const newStr = str.substring(str.lastIndexOf('_') + 1, str.lastIndexOf('.'))
  return newStr * 1 // 숫자로 리턴이 되게 변환
}

// 이미지가 로드되는 순서는 이미지 번호 순으로 보장이 안되기 때문에 정렬 함수로 번호순 정렬이 필요
function sortImages(imageArray) {
  let temp
  let imageNumber1
  let imageNumber2
  for (let i = 0; i < imageArray.length; i++) {
    for (let j = 0; j < imageArray.length - i; j++) {
      if (j < imageArray.length - 1) {
        imageNumber1 = getImageNumber(imageArray[j].currentSrc)
        imageNumber2 = getImageNumber(imageArray[j + 1].currentSrc)
        if (imageNumber1 > imageNumber2) {
          temp = imageArray[j]
          imageArray[j] = imageArray[j + 1]
          imageArray[j + 1] = temp
        }
      }
    }
  }
}

function setImagesOfScene0() {
  // Scene 0에 쓰이는 scene0Images 이미지 배열을 번호순 정렬 후
  // sceneInfo[0].objs.videoImages 배열에 저장
  sortImages(scene0Images)
  for (let i = 0; i < scene0Images.length; i++) {
    sceneInfo[0].objs.videoImages.push(scene0Images[i])
  }
}

function setImagesOfScene2() {
  // Scene 2에 쓰이는 scene2Images 이미지 배열을 번호순 정렬 후
  // sceneInfo[2].objs.videoImages 배열에 저장
  sortImages(scene2Images)
  for (let i = 0; i < scene2Images.length; i++) {
    sceneInfo[2].objs.videoImages.push(scene2Images[i])
  }
}

function initAfterLoadImages(currentScene, yOffset) {
  if (currentScene !== 2 && sceneInfo[0].objs.videoImages[0]) sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0)

  // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
  let tempYOffset = yOffset
  let tempScrollCount = 0
  if (tempYOffset > 0) {
    let siId = setInterval(() => {
      // scrollTo(x, y)
      scrollTo(0, tempYOffset)
      tempYOffset += 5

      if (tempScrollCount > 20) clearInterval(siId)

      tempScrollCount++
    }, 20)
  }
}
