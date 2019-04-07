const Router = require('koa-router')
const router = new Router()

// 新增评论
router.post('/add', require('../controller/comment').postCommentAdd)
// 评论列表
router.get('/list', require('../controller/comment').getCommentList)
// 删除评论
router.post('/delete', require('../controller/comment').postCommentDelete)

 
module.exports = router