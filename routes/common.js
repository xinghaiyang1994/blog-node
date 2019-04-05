const Router = require('koa-router')
const router = new Router()

// 上传文件
router.post('/upload', require('../controller/common').postUpload)
// 获取验证码
router.get('/captcha', require('../controller/common').getCaptcha)

module.exports = router
