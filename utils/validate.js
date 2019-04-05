// 格式校验
const language = require('../config/joi-lang');
const Joi = require('joi')

module.exports = (value, schema, options = {}) => {
  options.language = language
  return Joi.validate(value, schema, options).catch(err => {
    throw err;
  })
}