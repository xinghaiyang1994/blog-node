const marked = require('marked')
const moment = require('moment')
const {
  dealBody
} = require('../utils/tools')
const validate = require('../utils/validate')
const {
  postAdd,
  postModify
} = require('../utils/joiSchema')
const {
  insertPost,
  findPostAllCount,
  findPostAllPage,
  findPostAllCountByUserId,
  findPostAllPageByUserId,
  findPostDetailById,
  updatePvById,
  deletePostById,
  updatePost
} = require('../dao/post')
const {
  checkLogin
} = require('../middlewares/checkLogin')

module.exports = {
  async postAdd (ctx) {
    // 检查是否登录
    checkLogin(ctx)
    
    let { title, md } = ctx.request.body
    let userId = ctx.session.id
    title = title.trim()
    md = md.trim()

    // 校验
    validate({title, md, userId}, postAdd)

    // 新增
    // let content = filterXSS(marked(md))
    let content = marked(md)
    let resPost = await insertPost({title, md, content, userId})
    return ctx.body = dealBody({
      data: {
        id: resPost.get('id')
      },
      message: '发布成功'
    })
  },
  async getList (ctx) {
    let { current, pageSize } = ctx.query

    // 查询
    let total = await findPostAllCount()
    let list = await findPostAllPage({
      page: current,
      pageSize
    })
    list.forEach(el => {
      el.set('gmtModified', moment(el.gmtModified).toDate().getTime())
    })
    return ctx.body = dealBody({
      data: {
        total,
        list
      }
    })
  },
  async getListMy (ctx) {
    // 检查是否登录
    checkLogin(ctx)

    let { current, pageSize } = ctx.query
    let userId = ctx.session.id

    // 查询
    let total = await findPostAllCountByUserId(userId)
    let list = await findPostAllPageByUserId({
      page: current,
      pageSize,
      userId
    })
    list.forEach(el => {
      el.set('gmtModified', moment(el.gmtModified).toDate().getTime())
    })
    return ctx.body = dealBody({
      data: {
        total,
        list
      }
    })
  },
  async getDetail (ctx) {
    let { id } = ctx.query

    // 查询
    let resDetail = await findPostDetailById(id)
    resDetail.set('gmtModified', moment(resDetail.gmtModified).toDate().getTime())
    return ctx.body = dealBody({
      data: resDetail
    })
  },
  async postPv (ctx) {
    let { id } = ctx.request.body

    // 增加 1 pv
    let resDetail = await findPostDetailById(id)
    await updatePvById({ id, pv: resDetail.get('pv') + 1})
    return ctx.body = dealBody()
  },
  async postDelete (ctx) {
    // 检查是否登录
    checkLogin(ctx)

    let { id } = ctx.request.body
    let userId = ctx.session.id

    // 判断是否是作者
    let resDetail = await findPostDetailById(id)
    if (resDetail.get('userId') !== userId) {
      throw new Error('不是该文章作者，无法删除!')
    }

    // 删除
    await deletePostById(id)
    return ctx.body = dealBody({
      message: '删除成功'
    })
  },
  async postModify (ctx) {
    // 检查是否登录
    checkLogin(ctx)

    let { id, title, md } = ctx.request.body
    let userId = ctx.session.id
    title = title.trim()
    md = md.trim()

    // 校验
    validate({id, title, md}, postModify)

    // 判断是否是作者
    let resDetail = await findPostDetailById(id)
    if (resDetail.get('userId') !== userId) {
      throw new Error('不是该文章作者，无法修改!')
    }

    // 修改
    let content = marked(md)
    let resPost = await updatePost({ id, title, md, content, gmtModified: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') })
    return ctx.body = dealBody({
      data: {
        id: resPost.get('id')
      },
      message: '修改成功'
    })
  }
}