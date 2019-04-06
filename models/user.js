const db = require('../middlewares/db')

module.exports = db.Model.extend({
  tableName: 'user',     // 表名
  hidden: ['gmt_create', 'gmt_modified']
})

