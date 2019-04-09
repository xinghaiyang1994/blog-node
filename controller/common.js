const fs =require('fs')
const path =require('path')
const svgCaptcha = require('svg-captcha')
const {
  arrIn,
  dealBody
} = require('../utils/tools')

module.exports = {
    async postUpload (ctx) {
      // 获取字段为 file 的上传文件
      let file =  ctx.request.files.file
      console.log(file)
      // 校验图片格式
      if (!arrIn(file.type, ['image/png', 'image/jpeg', 'image/gif'])) {
        throw new Error('只能上传 png、jpeg、jpg、gif 格式的图片！')
      }
      // 校验大小
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('不能超过 2M ！')
      }
      // 生成唯一新的文件名
      let newFileName = Date.now() + file.name 
      await fs.readFile(file.path, async (err, data) => {
        if (err) {
          throw new Error(err)
        }
        await fs.writeFile(path.join(__dirname, '../static/' + newFileName), data, err => {
          if (err) {
            throw new Error(err)
          }
        })  
      })

      ctx.body = dealBody({
        data: {
          fileUrl: newFileName
        }
      })
    },
    getCaptcha (ctx) {
      const captcha = svgCaptcha.create({
        ignoreChars: '0o1il'
      })
      ctx.session.captcha = captcha.text.toLowerCase()
      ctx.response.set('Content-Type', 'image/svg+xml')
      ctx.body = String(captcha.data)
  },
}