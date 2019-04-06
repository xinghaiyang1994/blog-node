const Router = require('koa-router')
const router = new Router()

// 新增文章
router.post('/add', require('../controller/post').postAdd)
// 文章列表
router.get('/list', require('../controller/post').getList)
// 我的文章列表
router.get('/listMy', require('../controller/post').getListMy)
// 文章详情
router.get('/detail', require('../controller/post').getDetail)
// 增加浏览量
router.post('/pv', require('../controller/post').postPv)
// 删除文章
router.post('/delete', require('../controller/post').postDelete)
// 修改文章
router.post('/modify', require('../controller/post').postModify)
 
module.exports = router