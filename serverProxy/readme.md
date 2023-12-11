## setup
- npm init
  - inssert pakage.json
    ```json
    "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.2",
    "got": "^11.8.3",
    "http-proxy-middleware": "2.0.6",
    "tulind": "^0.8.20"
    },
    ```
- npm istall
- For reload
  - yarn add nodemon --dev
  - add script
    -   "scripts": { "start": "nodemon app.js"},
  
- exection


```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const cors = require('cors');

const app = express();
const port = 3000;

// 프록시 미들웨어 생성
const backendProxy = createProxyMiddleware({
  target: 'http://0.0.0.0:1338', // 백엔드 서버 주소
  changeOrigin: true, // 프록시 서버가 원본 서버처럼 동작하도록 설정
  logLevel: 'debug',
});

// '/api' 경로로 들어오는 모든 요청을 프록시로 전달
app.use(cors());
app.use('/news/1', backendProxy);

// 프록시 서버 시작
app.listen(port, () => {
  console.log(`프록시 서버가 포트 ${port}에서 실행 중입니다.`);
  
});

```