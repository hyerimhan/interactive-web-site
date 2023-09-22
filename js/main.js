import sceneInfo from './constants.js'
import setCanvasImages from './setCanvasImages.js'
import setLayout from './setLayout.js'
import playAnimation from './playAnimation.js'

// 디바이스 별로 창 사이즈 변경에 대응하기 위해 따로 함수로 처리한다.
;(() => {
  let yOffset = 0 // window.pageOffset 대신 쓸 변수
  let prevScrollHeight = 0 // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0 // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false // 새로운 scene이 시작된 순간 true

  setCanvasImages()

  function calcValues(values, currentYOffset) {
    let rv
    // 현재 씬(스크롤 섹션)에서 현재 내가 위치한 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight
    const scrollRatio = currentYOffset / scrollHeight
    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight
      const partScrollEnd = values[2].end * scrollHeight
      const partScrollHeight = partScrollEnd - partScrollStart

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0]
      } else if (currentYOffset < partScrollStart) {
        rv = values[0]
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1]
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0]
    }

    return rv
  }

  // 몇 번째 스크롤 섹션인지 판별하기 위한 함수
  function scrollLoop() {
    enterNewScene = false
    prevScrollHeight = 0

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true
      currentScene++
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true
      if (currentScene === 0) return // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지하기 위한 안전장치(모바일)
      currentScene--
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (enterNewScene) return
    playAnimation(currentScene, yOffset, prevScrollHeight, calcValues)
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset
    scrollLoop()
  })
  // 'DOMContentLoaded': DOM이 로드됐을때 실행 | 'load': DOM + 이미지가 로드됐을때 실행
  window.addEventListener('load', () => {
    setLayout()
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0)
  })
  window.addEventListener('resize', setLayout) // 디바이스의 화면 높이에 맞춰 resize됨
})()
