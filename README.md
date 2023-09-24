# [interactive-web-site (Demo)]()

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

        // offsetTop은 전체의 높이값을 불러오지만, 해당 영역에 position: relative를 주면 그 영역의 높이값만 불러올 수 있다.
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

  </div>
</details>
