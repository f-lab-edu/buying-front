const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        logLevel: 'debug'
      }
      // WebSocket 연결은 직접 URL 사용 (http://localhost:8080/chat)
      // 프록시 설정으로 인한 REST API와의 충돌 방지
    }
  }
})
