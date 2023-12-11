const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

class ProxyServer {
  constructor() {
    this.app = express();
    this.port = 1338;

    this.setupMiddleware();
    this.startServer();
  }

  setupMiddleware() {
    const backendProxy = createProxyMiddleware({
      target: 'http://0.0.0.0:7001',
      changeOrigin: true,
      logLevel: 'debug',
    });

    this.app.use(cors());
    this.app.use('/news/1', backendProxy);
  }

  startServer() {
    this.app.listen(this.port, () => {
      console.log(`프록시 서버가 포트 ${this.port}에서 실행 중입니다.`);
    });
  }
}

// ProxyServer 클래스의 인스턴스 생성
const proxyServer = new ProxyServer();