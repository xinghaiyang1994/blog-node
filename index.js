const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const staticCache = require('koa-static-cache')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const helmet = require('koa-helmet')
const log4js = require('log4js')
const session = require('koa-session-minimal')
const MysqlSession = require('koa-mysql-session')

const routes = require('./routes')
const {
  database,
  port
} = require('./config/default')

const app = new Koa()
const logger = log4js.getLogger()
let store = new MysqlSession(database)

log4js.configure({
  appenders: {
    error: { // 定义了名为 error 的 appender 
      type: 'datefile',   // 按天记录日志
      filename: path.join(__dirname, `./log/error.log`),
      pattern: '.yyyy-MM-dd.log'
    }
  },
  categories: {
    default: {
      appenders: ['error'], // 使用名为 error 的 appender 
      level: 'error'
    }
  },
  pm2: true // 使用 pm2 启动项目
})

// 提供安全 headers 
app.use(helmet())

// 支持跨域
app.use(cors({
  'credentials': true
}))

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      'code': -1,
      'message': err.message,
      'data': ''
    }
    let errMsg = `${ctx.url} : ${err.message}`
    console.log(errMsg)
    logger.error(errMsg)
  }
})

// 静态资源
app.use(staticCache(path.join(__dirname, './static'), { dynamic: true }))

// session 存入 mysql 
app.use(session({
  key: 'SESSION_ID',
  store,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000    // 2小时过期
  }
}))

// 解析 post
app.use(koaBody({
  multipart: true, 
  formLimit: '1mb'
}))

// 路由
routes(app)

// 无效 url 处理
app.use(ctx => {
  ctx.body = '无效的 url'
  app.emit('error', '无效的 url', ctx)
})

// 判断 static 目录是否存在，不存在则新建。static 目录用于上传文件
let pathStatic = path.join(__dirname, './static')
fs.stat(pathStatic, (err, stats) => {
  if (err) {
    // 不存在
    fs.mkdir(pathStatic, err => {
      if (err) {
        console.log(err)
      } 
    })
  }
})


app.listen(port, () => {
  console.log('http://localhost:' + port)
})