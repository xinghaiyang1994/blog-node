const md5 = require('md5')
const {
  dealBody
} = require('../utils/tools')
const validate = require('../utils/validate')
const {
  register,
  login 
} = require('../utils/joiSchema')
const {
  findUserByName,
  insertUser,
  findUserById
} = require('../dao/user')

module.exports = {
  async postRegister (ctx) {
    let { name, password, repeatPassword, avator } = ctx.request.body
    name = name.trim()

    // 校验
    validate({ name, password, repeatPassword, avator }, register)
    if (password !== repeatPassword) {
      throw new Error('两次密码应该相同!')
    }
    let sameUser = await findUserByName(name) 
    if (sameUser) {
      throw new Error('用户名已存在!')
    }

    // 新增用户
    let resUser = await insertUser({ name, password: md5(password), avator })
    return ctx.body = dealBody({
      data: {
        id: resUser.get('id')
      },
      message: '注册成功'
    })
  },
  async postLogin (ctx) {
    let { name, password, captcha } = ctx.request.body
    let sCaptcha = ctx.session.captcha
    name = name.trim()

    // 校验
    validate({ name, password, captcha }, login)
    if (captcha !== sCaptcha) {
      throw new Error('验证码错误!')
    }
    let existUser = await findUserByName(name)
    if (!existUser) {
      throw new Error('用户不存在!')
    } 
    if (md5(password) !== existUser.get('password')) {
      throw new Error('密码不正确!')
    }

    // 登录
    ctx.session = {
      id: existUser.id
    }
    return ctx.body = dealBody({
      message: '登录成功'
    })
  },
  async getInfo (ctx) {
    const { id } = ctx.session

    // 校验
    if (typeof id === 'undefined') {
      return ctx.body = dealBody({
        data: {},
        message: '暂未登录'
      })
    }
    let existUser = await findUserById(id)
    if (!existUser) {
      return ctx.body = dealBody({
        data: {},
        message: '用户不存在'
      })
    }

    return ctx.body = dealBody({
      data: {
        id: existUser.get('id'),
        name: existUser.get('name')
      }
    })
  },
  postLogout (ctx) {
    ctx.session = {}
    return ctx.body = dealBody({
      data: {},
      message: '退出成功'
    })
  }
}