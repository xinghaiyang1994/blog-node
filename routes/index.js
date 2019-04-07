const Router = require('koa-router')
const tools = require('../utils/tools')

module.exports = function (app) {
    const router = new Router()

    // 子路由
    // 通用
    router.use('/common', require('./common').routes())
    // 用户
    router.use('/user', require('./user').routes())
    // 文章
    router.use('/post', require('./post').routes())
    // 评论
    router.use('/comment', require('./comment').routes())

    app.use(router.routes())
    app.use(router.allowedMethods())
}