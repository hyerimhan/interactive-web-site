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
      messageC: document.querySelector('#scroll-section-0 .main-message.c'),
      messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      canvas: document.querySelector('#video-canvas-0'),
      context: document.querySelector('#video-canvas-0').getContext('2d'),
      videoImages: [],
    },
    values: {
      videoImageCount: 300,
      imageSequence: [0, 299],
      canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
      // 변화하는 opacity 값의 시작값과 끝값, {애니메이션이 재생되는 구간 설정}
      messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
      messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
      messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
      messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
      messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
      messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
      messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
      messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
      messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
      messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
      messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
      messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
      messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
    },
  },
  {
    // 1
    type: 'normal',
    // heightNum: 5, // type normal에서는 필요 없음
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-1'),
      content: document.querySelector('#scroll-section-1 .description'),
    },
  },
  {
    // 2
    type: 'sticky',
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-2'),
      messageA: document.querySelector('#scroll-section-2 .a'),
      messageB: document.querySelector('#scroll-section-2 .b'),
      messageC: document.querySelector('#scroll-section-2 .c'),
      pinB: document.querySelector('#scroll-section-2 .b .pin'),
      pinC: document.querySelector('#scroll-section-2 .c .pin'),
      canvas: document.querySelector('#video-canvas-1'),
      context: document.querySelector('#video-canvas-1').getContext('2d'),
      videoImages: [],
    },
    values: {
      videoImageCount: 960,
      imageSequence: [0, 959],
      canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
      canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
      messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
      messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
      messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
      messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
      messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
      messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
      messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
      messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
      messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
      messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
      messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
      messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
      pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
      pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
    },
  },
  {
    // 3
    type: 'sticky',
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-3'),
      canvasCaption: document.querySelector('.canvas-caption'),
      canvas: document.querySelector('.image-blend-canvas'),
      context: document.querySelector('.image-blend-canvas').getContext('2d'),
      imagesPath: ['./images/blend-image-1.jpg', './images/blend-image-2.jpg'],
      images: [],
    },
    values: {
      // 흰색 영역 박스 애니메이션 시작 포인트 세팅
      rect1X: [0, 0, { start: 0, end: 0 }],
      rect2X: [0, 0, { start: 0, end: 0 }],
      rectStartY: 0,
    },
  },
]

export default sceneInfo
