const Router = require('koa-router')
const router = new Router()

router.get('/', require('../controller/common').getHome)
router.post('/upload', require('../controller/common').postUpload)

module.exports = router
