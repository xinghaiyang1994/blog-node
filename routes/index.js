const Router = require('koa-router')
const tools = require('../utils/tools')

module.exports = function (app) {

    const router = new Router()
    
    router.get('/', async ctx => {
        ctx.body = tools.dealBody({
            code: 0,
            data: {
                name : 'index'
            },
            message: ''
        })
    })

    // 子路由
    // 通用
    router.use('/common', require('./common').routes())
    // 用户
    router.use('/user', require('./user').routes())
    // 文章
    router.use('/post', require('./post').routes())

    app.use(router.routes())
    app.use(router.allowedMethods())

}