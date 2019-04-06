// 所有格式校验
const Joi = require('joi')

module.exports = {
  // 注册
  register: {
    name: Joi.string().max(20).required(),
    password: Joi.string().max(20).required(),
    repeatPassword: Joi.string().max(20).required(),
    avator: Joi.string().required()
  },
  // 登录
  login: {
    name: Joi.string().max(20).required(),
    password: Joi.string().max(20).required(),
    captcha: Joi.string().length(4).required()
  },
  // 新增文章
  postAdd: {
    title: Joi.string().max(40).required(),
    md: Joi.string().required(),
    userId: Joi.number().required()
  }, 
  // 修改文章
  postModify: {
    id: Joi.number().required(),
    title: Joi.string().max(40).required(),
    md: Joi.string().required()
  }
}