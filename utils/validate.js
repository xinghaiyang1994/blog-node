// 格式校验
const language = require('../config/joi-lang');
const Joi = require('joi')

module.exports = (value, schema, options = {}) => {
  options.language = language
  return Joi.validate(value, schema, options, err => {
    if (err) {
      console.log('校验格式错误', err.details)
      throw new Error(err.details[0].message)
    }
  })
}