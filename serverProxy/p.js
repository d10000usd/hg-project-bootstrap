const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const cors = require('cors');

const app = express();
const port = 1338;

// 프록시 미들웨어 생성
const backendProxy = createProxyMiddleware({
  target: 'http://0.0.0.0:7001', // 백엔드 서버 주소
  changeOrigin: true, // 프록시 서버가 원본 서버처럼 동작하도록 설정
  logLevel: 'debug',
});

// '/news' 경로로 들어오는 모든 요청을 프록시로 전달
app.use(cors());
app.use('/news/1', backendProxy);
// app.use('/ping/1', backendProxy);
// 프록시 서버 시작
app.listen(port, () => {
  console.log(`프록시 서버가 포트 ${port}에서 실행 중입니다.`);
  
});
