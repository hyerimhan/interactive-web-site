# [interactive-web-site (Demo)](https://interactive-web-airmug-pro.netlify.app/)

👆🏻 제목을 클릭하면 배포된 사이트를 확인하실 수 있습니다.

<br />

## :pencil2: 학습 목적

- Vanilla JS로 스크롤에 반응하는 화려한 인터랙티브 웹 구현하기

<br />

## 🛠️ Stacks

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-round&logo=html5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-round&logo=css3&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-round&logo=javascript&logoColor=white"/>

<br />

## :book: 학습 내용

### 🔆 Interactive Web이란?

> 참고 예시: [애플 상품 페이지](https://www.apple.com/kr/imac-24/)

- 반응 없는 정적인 웹보다 사용자의 마우스(클릭/이동/스크롤)에 반응하여 역동적이고 애니메이션적인 부분을 강조한 웹
- 어려운 글 대신 메시지에 맞는 효과로 유저에게 홈페이지의 복잡한 정보를 효과적으로 전달할 수 있다.
- 재밌는 효과로 여러번 방문하고 싶은 웹 사이트를 만들고, 높은 체류시간을 끌어낼 수 있다.

<details>
  <summary>구현 설명</summary>
  <div markdown="1">

#### 환경 변수 세팅

```JavaScript
// 디바이스 별로 창 사이즈 변경에 대응하기 위해 따로 함수로 처리한다.
;(() => {
// 환경 변수
const sceneInfo = [
  {
    // 0
    type: 'sticky',
    heightNum: 5, // 브라우저 높이의 n배로 scrollHeight 세팅
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-0'),
      messageA: document.querySelector('#scroll-section-0 .main-message.a'),
      messageB: document.querySelector('#scroll-section-0 .main-message.b'),
      // ...
    },
    values: {
        // 변화하는 opacity 값의 시작값과 끝값, {애니메이션이 재생되는 구간 설정}
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        // ...
      },
  },
  {
    // 1
    type: 'normal',
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-1'),
    },
  },
  // ...
]

function setLayout() {
// 각 스크롤 섹션의 높이 세팅
  for (let i = 0; i < sceneInfo.length; i++) {
    sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight
    sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
  }
}
})()

```

#### 스크롤 섹션 영역 저장

```JavaScript
  // 몇 번째 스크롤 섹션인지 판별하기 위한 함수
  function scrollLoop() {
    prevScrollHeight = 0

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지하기 위한 안전장치(모바일)
      currentScene--
      document.body.setAttribute('id', `show-scene-${currentScene}`)
    }
  }
```

#### 특정 영역에서 스크롤 애니메이션 ON & OFF

```JavaScript
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

  function playAnimation() {
    const obj = sceneInfo[currentScene].objs
    const values = sceneInfo[currentScene].values
    const currentYOffset = yOffset - prevScrollHeight
    const scrollHeight = sceneInfo[currentScene].scrollHeight
    const scrollRatio = currentYOffset / scrollHeight

    switch (currentScene) {
      case 0:
        const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset)
        const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset)
        const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset)
        const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset)

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
        break
      // ...
    }
  }
```

#### canvas로 비디오 인터렉션 적용하기

```JavaScript
  function setCanvasImages() {
    let imgElem
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      // new Image()는 document.createElement('img')와 같다.
      imgElem = new Image()
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG` // 스크롤 offset별로 이미지 불러오기
      sceneInfo[0].objs.videoImages.push(imgElem)
    }
  }
  setCanvasImages()

  function playAnimation(){
    // ...
    switch(currentScene) {
      case 0:
        // 소수점 반올림
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset))
        objs.context.drawImage(objs.videoImages[sequence], 0, 0)
        // ...
    }
  }
```

#### canvas를 창 사이즈에 맞추기

```HTML
<!-- html -->
<canvas id="video-canvas-0" width="1920" height="1080"></canvas>
```

```JavaScript
  function setLayout() {
    // ...

    // canvas의 초기 인라인 스타일의 height를 1080으로 정해놓았기 때문에 heightRatio로 각 디바이스의 화면 크기에 맞도록 설정해춘다.
    const heightRatio = window.innerHeight / 1080
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio}) `
  }
```

#### canvas를 브라우저 top에 맞게 애니메이션 구현하기

```JavaScript
const sceneInfo = [
  // ...
  {
    // section 3
    // ...
    values: {
      // 흰색 영역 박스 애니메이션 시작 포인트 세팅
      rect1X: [0, 0, { start: 0, end: 0 }],
      rect2X: [0, 0, { start: 0, end: 0 }],
      rectStartY: 0,
    },
  },
]

function playAnimation(currentScene, yOffset, prevScrollHeight, calcValues) {

  switch (currentScene) {
    case 3:
      // ...

      // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
      // document.body.offsetWidth: 스크롤바 영역 제외
      const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio

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

      // 좌우 흰색 박스 그리기
      // fillRect(x, y, width, height)
      objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height)
      objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height)

      break
  }
}
```

#### 이미지 블렌딩

```JavaScript
function playAnimation(currentScene, yOffset, prevScrollHeight, calcValues) {

  switch (currentScene) {
    case 3:
      // ...

      // 캔버스가 브라우저 상단에 닿지 않았다면
      if (scrollRatio < values.rect1X[2].end) {
        step = 1
        // console.log('캔버스 닿기 전')
        objs.canvas.classList.remove('sticky')
      } else {
        step = 2
        // console.log('캔버스 닿기 후')
        // 이미지 블렌딩
        values.blendHeight[0] = 0
        values.blendHeight[1] = objs.canvas.height
        values.blendHeight[2].start = values.rect1X[2].end
        values.blendHeight[2].end = values.blendHeight[2].start + 0.2

        const blendHeight = calcValues(values.blendHeight, currentYOffset)

        // drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight )
        objs.context.drawImage(objs.images[1], 0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight, 0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight)

        objs.canvas.classList.add('sticky')
        objs.canvas.style.top = `-${(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`
      }

      // 이미지 블렌딩 스케일
      if (scrollRatio > values.blendHeight[2].end) {
        values.canvas_scale[0] = canvasScaleRatio
        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width)
        values.canvas_scale[2].start = values.blendHeight[2].end
        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2

        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`
      }

      break
  }
}
```

#### 스크롤 부드러운 감속 처리

```JavaScript
  let acc = 0.1 // 스크롤 가속도
  let delayedYOffset = 0 // 스크롤 시작점
  let rafId // requestAnimationFrame ID
  let rafState // requestAnimationFrame 상태

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

    // requestAnimationFrame의 무한루프로 인한 과부하 방지
    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId)
      rafState = false
    }
  }

  window.addEventListener('scroll', () => {
    // ...

    if (!rafState) {
      rafId = requestAnimationFrame(loop)
      rafState = true
    }
  })
```

#### SVG stroke 로딩 애니메이션

```HTML
<!-- html -->
<body class="before-load">
  <div class="loading">
    <svg class="loading-circle">
      <circle cx="50%" cy="50%" r="25"></circle>
    </svg>
  </div>

  // ...
</body>
```

```CSS
/* css */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background-color: white;
  opacity: 0;
  transition: 0.5s;
}
.before-load .loading {
  opacity: 1;
}
@keyframes loading-spin {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes loading-circle-ani {
  0% {
    stroke-dashoffset: 157;
  }
  75% {
    stroke-dashoffset: -147;
  }
  100% {
    stroke-dashoffset: -157;
  }
}
.loading-circle {
  width: 54px;
  height: 54px;
  animation: loading-spin 3s infinite;
}
.loading-circle circle {
  stroke: black;
  /* stroke-width: stroke 선의 두께 */
  stroke-width: 4;
  /* JavaScript에서 getTotalLength()로 stroke의 길이를 얻어올 수 있음 */
  /* stroke-dasharray: stroke의 총 길이 */
  stroke-dasharray: 157;
  stroke-dashoffset: 0;
  fill: transparent;
  animation: loading-circle-ani 1s infinite;
}
```

```JavaScript
  // JavaScript
  window.addEventListener('load', () => {
    document.body.classList.remove('before-load')
    // ...
  })

    // transition이 끝나고 난 후
  document.querySelector('.loading').addEventListener('transitionend', (e) => {
    // 화살표 함수를 사용했기 때문에 this는 사용할 수 없다. 화살표 함수 안에서의 this는 전역객체를 가리키기 때문이다.
    document.body.removeChild(e.currentTarget)
  })
```

  </div>
</details>
