const schedule = require('node-schedule')
const ajaxInt = require('sea-axios')
const path = require('path')
const fs = require('fs')

let axios = ajaxInt.default()

let fPath = path.join(__dirname, './log/timelog.log')

// 日志文件是否存在
let existFile = {}

// 日志写入文件
function logToFile (fPath, log) {
  if (!existFile[fPath]) {
    const fileExist = fs.existsSync(fPath)
    if (!fileExist) {
      fs.writeFileSync(fPath, log + '\n')
      return existFile[fPath] = true
    } 
    existFile[fPath] = true
  }
  let old = fs.readFileSync(fPath)
  fs.writeFileSync(fPath, old.toString() + log + '\n')
}
async function job () {
  let resData = await axios({
    method: 'get',
    url: 'http://nblog-api.xinghaiyang.com/post/list',
    data: {
      current: 1,
      pageSize: 10
    }
  }).catch(err => {
    let log = `catch|${(new Date()).toLocaleString()}|${err.message}`
    logToFile(fPath, log)
  })
  if (!resData) {
    return 
  }
  if (resData.code !== 0) {
    let log = `then|${(new Date()).toLocaleString()}|${resData.message}`
    logToFile(fPath, log)
  }
}

schedule.scheduleJob('0 0 * * * *', () => {
  console.log('执行', new Date())
  for (let i = 0; i < 3; i ++) {
    console.log('job')
    job()
  }
})