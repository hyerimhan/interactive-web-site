import sceneInfo from './constants.js'

function setLayout(yOffset, currentScene) {
  // 각 스크롤 섹션의 높이 세팅
  for (let i = 0; i < sceneInfo.length; i++) {
    if (sceneInfo[i].type === 'sticky') {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight
    } else if (sceneInfo[i].type === 'normal') {
      // 설정된 높이값 없애기 (그냥 컨텐츠 높이)
      sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight
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

export default setLayout
