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
    router.use('/common', require('./common').routes())
    router.use('/user', require('./user').routes())

    app.use(router.routes())
    app.use(router.allowedMethods())

}