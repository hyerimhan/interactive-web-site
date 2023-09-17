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

window.addEventListener('resize', setLayout) // 디바이스의 화면 높이에 맞춰 resize됨

setLayout()
})()

```

  </div>
</details>
