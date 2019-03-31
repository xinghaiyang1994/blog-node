const fs =require('fs')
const path =require('path')
const tools = require('../utils/tools')

module.exports = {
    async getHome (ctx) {
        await ctx.render('index', {
            content: 'home'
        })
    },
    async postUpload (ctx) {
      // 获取字段为 file 的上传文件
      let file =  ctx.request.files.file
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
      ctx.body = tools.dealBody({
        data: {
          fileUrl: newFileName
        }
      })
    }
}