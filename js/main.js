import sceneInfo from './constants.js'
import playAnimation from './playAnimation.js'
import checkMenu from './checkMenu.js'

// 디바이스 별로 창 사이즈 변경에 대응하기 위해 따로 함수로 처리한다.
import { loadImageOfScene0, loadImageOfScene2 } from './loadImages.js'
;(() => {
  let yOffset = 0 // window.pageOffset 대신 쓸 변수
  let prevScrollHeight = 0 // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0 // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false // 새로운 scene이 시작된 순간 true
  let acc = 0.1 // 스크롤 가속도
  let delayedYOffset = 0 // 스크롤 시작점
  let rafId // requestAnimationFrame ID
  let rafState // requestAnimationFrame 상태

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight
      } else if (sceneInfo[i].type === 'normal') {
        // 설정된 높이값 없애기 (그냥 컨텐츠 높이)
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
    }

    // 새로고침했을때 currentScene이 초기화 되는 것을 방지
    yOffset = window.pageYOffset
    let totalScrollHeight = 0
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight
      if (totalScrollHeight >= yOffset) {
        currentScene = i
        break
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`)

    // canvas의 초기 인라인 스타일의 height를 1080으로 정해놓았기 때문에 heightRatio로 각 디바이스의 화면 크기에 맞도록 설정해춘다.
    const heightRatio = window.innerHeight / 1080
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`
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

    if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      document.body.classList.remove('scroll-effect-end')
    }

    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true

      if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add('scroll-effect-end')
      }
      // scemeInfo에 있는 객체만 인지하게
      if (currentScene < sceneInfo.length - 1) {
        currentScene++
      }
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

    // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
    // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
    if (delayedYOffset < 1) {
      scrollLoop()
      sceneInfo[0].objs.canvas.style.opacity = 1
      if (sceneInfo[0].objs.videoImages[0]) {
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0)
      }
    }
    // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
    if (document.body.offsetHeight - window.innerHeight - delayedYOffset < 1) {
      let tempYOffset = yOffset
      scrollTo(0, tempYOffset - 1)
    }

    rafId = requestAnimationFrame(loop)

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId)
      rafState = false
    }
  }

  // 'DOMContentLoaded': DOM이 로드됐을때 실행 | 'load': DOM + 이미지가 로드됐을때 실행
  window.addEventListener('DOMContentLoaded', () => {
    setLayout() // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
    document.body.classList.remove('before-load')
    setLayout()

    // Scene3 이미지 블렌드 캔버스에 쓰는 이미지 세팅
    let imgElem
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem = new Image()
      imgElem.src = sceneInfo[3].objs.imagesPath[i]
      sceneInfo[3].objs.images.push(imgElem)
    }

    if (currentScene !== 2) {
      // 0, 첫번쨰 씬의 이미지를 로드
      loadImageOfScene0(currentScene, yOffset)
    } else {
      // 2, 세번쨰 씬의 이미지를 로드
      loadImageOfScene2(currentScene, yOffset)
    }

    window.addEventListener('scroll', () => {
      yOffset = window.pageYOffset
      scrollLoop()
      checkMenu(yOffset)

      // requestAnimationFrame의 무한루프로 인한 과부하 방지
      if (!rafState) {
        rafId = requestAnimationFrame(loop)
        rafState = true
      }
    })

    // 디바이스의 화면 높이에 맞춰 resize됨
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        window.location.reload()
      }
    })

    // 디바이스가 가로/세로 모드로 변경될 때
    window.addEventListener('orientationchange', () => {
      scrollTo(0, 0)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    })
    // transition이 끝나고 난 후
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
      // 화살표 함수를 사용했기 때문에 this는 사용할 수 없다. 화살표 함수 안에서의 this는 전역객체를 가리키기 때문이다.
      if (e.currentTarget.parentNode === document.body) document.body.removeChild(e.currentTarget)
    })
  })
})()
