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
  let acc = 0.1 // 스크롤 가속도
  let delayedYOffset = 0 // 스크롤 시작점
  let rafId // requestAnimationFrame ID
  let rafState // requestAnimationFrame 상태

  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky')
    } else {
      document.body.classList.remove('local-nav-sticky')
    }
  }

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

    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true
      currentScene++
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true
      if (currentScene === 0) return // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지하기 위한 안전장치(모바일)
      currentScene--
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (enterNewScene) return
    playAnimation(currentScene, yOffset, prevScrollHeight, calcValues)
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc

    // 애니메이션 부드러운 감속 스크롤 처리
    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayedYOffset - prevScrollHeight
        const objs = sceneInfo[currentScene].objs
        const values = sceneInfo[currentScene].values
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset))

        if (objs.videoImages[sequence]) {
          objs.context.drawImage(objs.videoImages[sequence], 0, 0)
        }
      }
    }

    rafId = requestAnimationFrame(loop)

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId)
      rafState = false
    }
  }

  // 'DOMContentLoaded': DOM이 로드됐을때 실행 | 'load': DOM + 이미지가 로드됐을때 실행
  window.addEventListener('load', () => {
    document.body.classList.remove('before-load')
    setLayout()
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0)

    window.addEventListener('scroll', () => {
      yOffset = window.pageYOffset
      scrollLoop()
      checkMenu()

      // requestAnimationFrame의 무한루프로 인한 과부하 방지
      if (!rafState) {
        rafId = requestAnimationFrame(loop)
        rafState = true
      }
    })

    // 디바이스의 화면 높이에 맞춰 resize됨
    window.addEventListener('resize', () => {
      if (window.innerWidth > 600) {
        setLayout()
      }
      sceneInfo[3].values.rectStartY = 0
    })

    // 디바이스가 가로/세로 모드로 변경될 때
    window.addEventListener('orientationchange', setLayout)
    // transition이 끝나고 난 후
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
      // 화살표 함수를 사용했기 때문에 this는 사용할 수 없다. 화살표 함수 안에서의 this는 전역객체를 가리키기 때문이다.
      document.body.removeChild(e.currentTarget)
    })
  })

  setCanvasImages()
})()
