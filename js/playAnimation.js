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
      break
    case 3:
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
      objs.context.drawImage(objs.images[0], 0, 0)
      break
  }
}

export default playAnimation
