import sceneInfo from './constants.js'

function playAnimation(currentScene, yOffset, prevScrollHeight, calcValues) {
  const objs = sceneInfo[currentScene].objs
  const values = sceneInfo[currentScene].values
  const currentYOffset = yOffset - prevScrollHeight
  const scrollHeight = sceneInfo[currentScene].scrollHeight
  const scrollRatio = currentYOffset / scrollHeight

  switch (currentScene) {
    case 0:
      let sequence = Math.round(calcValues(values.imageSequence, currentYOffset))
      objs.context.drawImage(objs.videoImages[sequence], 0, 0)
      objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset)

      // 스크롤 위치에 따른 텍스트 위치 변화
      if (scrollRatio <= 0.22) {
        // in
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset)
        // transform 속성 중 뒤에 3d가 붙은 속성은 하드웨어 가속이 보장이 돼서 퍼포먼스가 좋기 때문에 translateY가 아닌 translate3d로 작성했다.
        // translate3d(x축, y축, z축)
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`
      } else {
        // out
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset)
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`
      }

      if (scrollRatio <= 0.42) {
        // in
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset)
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`
      } else {
        // out
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset)
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`
      }

      if (scrollRatio <= 0.62) {
        // in
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset)
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`
      } else {
        // out
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset)
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`
      }

      if (scrollRatio <= 0.82) {
        // in
        objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset)
        objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`
      } else {
        // out
        objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset)
        objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`
      }
      break
    case 2:
      let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset))
      objs.context.drawImage(objs.videoImages[sequence2], 0, 0)

      // canvas 애니메이션
      if (scrollRatio <= 0.5) {
        // in
        objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset)
      } else {
        // out
        objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset)
      }

      // 텍스트 애니메이션
      if (scrollRatio <= 0.32) {
        // in
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset)
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`
      } else {
        // out
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset)
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`
      }

      if (scrollRatio <= 0.67) {
        // in
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset)
        objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`
      } else {
        // out
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset)
        objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`
      }

      if (scrollRatio <= 0.93) {
        // in
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset)
        objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`
      } else {
        // out
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset)
        objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`
      }

      // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
      if (scrollRatio > 0.9) {
        const objs = sceneInfo[3].objs
        const values = sceneInfo[3].values
        // 가로/세로 모두 꽉 차게 하기 위해 세팅(계산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width
        const heightRatio = window.innerHeight / objs.canvas.height
        let canvasScaleRatio

        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio
        } else {
          // 캔버스보다 브라우저 창이 납작한 경우
          canvasScaleRatio = widthRatio
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`
        objs.context.fillStyle = 'white'
        objs.context.drawImage(objs.images[0], 0, 0)

        // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        // document.body.offsetWidth: 스크롤바 영역 제외
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio
        const recalculatedInnerHeight = document.body.offsetHeight / canvasScaleRatio

        const whiteRectWidth = recalculatedInnerWidth * 0.15
        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth

        // 좌우 흰색 박스 그리기
        objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height)
        objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height)
      }

      break
    case 3:
      let step = 0

      // 가로/세로 모두 꽉 차게 하기 위해 세팅(계산 필요)
      const widthRatio = window.innerWidth / objs.canvas.width
      const heightRatio = window.innerHeight / objs.canvas.height
      let canvasScaleRatio

      if (widthRatio <= heightRatio) {
        // 캔버스보다 브라우저 창이 홀쭉한 경우
        canvasScaleRatio = heightRatio
      } else {
        // 캔버스보다 브라우저 창이 납작한 경우
        canvasScaleRatio = widthRatio
      }

      objs.canvas.style.transform = `scale(${canvasScaleRatio})`
      objs.context.fillStyle = 'white'
      objs.context.drawImage(objs.images[0], 0, 0)

      // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
      // document.body.offsetWidth: 스크롤바 영역 제외
      const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio
      const recalculatedInnerHeight = document.body.offsetHeight / canvasScaleRatio

      // 처음의 Y위치만 저장
      if (!values.rectStartY) {
        // getBoundingClientRect: 해당 element의 위치와 크기의 정보를 알 수 있는 매서드, 스크롤 올/내림 속도에 따라 값이 변한다.
        // values.rectStartY = objs.canvas.getBoundingClientRect().top

        // offsetTop은 전체의 높이값을 불러오지만, 해당 영역에 position: relative를 주면 그 영역의 높이값만 불러올 수 있다. 스크롤 올/내림 속도에 따라 값이 변하지 않는다.
        values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2
        values.rect1X[2].start = (window.innerHeight * 0.3) / scrollHeight
        values.rect2X[2].start = (window.innerHeight * 0.3) / scrollHeight
        values.rect1X[2].end = values.rectStartY / scrollHeight
        values.rect2X[2].end = values.rectStartY / scrollHeight
      }

      const whiteRectWidth = recalculatedInnerWidth * 0.15
      values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2
      values.rect1X[1] = values.rect1X[0] - whiteRectWidth
      values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth
      values.rect2X[1] = values.rect2X[0] + whiteRectWidth

      // 좌우 흰색 박스 그리기
      // fillRect(x, y, width, height)
      // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height)
      // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height)
      objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height)
      objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height)

      // 캔버스가 브라우저 상단에 닿지 않았다면
      if (scrollRatio < values.rect1X[2].end) {
        step = 1
        // console.log('캔버스 닿기 전')
        objs.canvas.classList.remove('sticky')
      } else {
        step = 2
        // 이미지 블랜드
        // console.log('캔버스 닿기 후')
        objs.canvas.classList.add('sticky')
        objs.canvas.style.top = `-${(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`
      }

      break
  }
}

export default playAnimation
