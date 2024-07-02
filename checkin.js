const axios = require('axios')
const { getCookie, getTraffic, getEmailAndPwdList,getCookieFy, getTrafficFy, getEmailAndPwdListFy } = require('./utils')
const notify = require('./sendNotify')

const checkinURL = 'https://ikuuu.pw/user/checkin'
const checkinURLFy = 'https://a.lanying.win/user/checkin'


/** 签到 */
async function checkin(cookie) {
  try {
    const res = await axios(checkinURL, {
      method: 'POST',
      headers: {
        Cookie: cookie
      },
      withCredentials: true
    })
    return res.data.msg
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

/** 签到 */
async function checkinFy(cookie) {
  try {
    const res = await axios(checkinURLFy, {
      method: 'POST',
      headers: {
        Cookie: cookie
      },
      withCredentials: true
    })
    return res.data.msg
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

async function run() {
  const [emailList, pwdList] = await getEmailAndPwdList()
  
  console.log('开始签到...',emailList,pwdList);
  const messages = []
  for (let i = 0; i < emailList.length; i++) {
    const email = emailList[i]
    const pwd = pwdList[i]
    let msg = `邮箱：${emailList[i]}`
    const cookie = await getCookie(email, pwd)
    if (cookie.includes('登录失败')) {
      msg += `\n${cookie}`
      messages.push(msg)
      continue
    }
    const checkinRes = await checkin(cookie)
    msg += `\n${checkinRes}`
    const arr = await getTraffic(cookie)
    msg += `\n${arr.join('\n')}`
    messages.push(msg)
  }

  await notify.sendNotify(`iKuuu VPN 签到通知`, messages.join('\n\n========================\n\n'))
}

async function runFy() {
  const [emailList, pwdList] = await getEmailAndPwdListFy()
  
  console.log('开始签到fy...',emailList,pwdList);
  const messages = []
  for (let i = 0; i < emailList.length; i++) {
    const email = emailList[i]
    const pwd = pwdList[i]
    let msg = `邮箱：${emailList[i]}`
    const cookie = await getCookieFy(email, pwd)
    if (cookie.includes('登录失败')) {
      msg += `\n${cookie}`
      messages.push(msg)
      continue
    }
    const checkinRes = await checkinFy(cookie)
    msg += `\n${checkinRes}`
    const arr = await getTrafficFy(cookie)
    msg += `\n${arr.join('\n')}`
    messages.push(msg)
  }

  await notify.sendNotify(`飞云 VPN 签到通知`, messages.join('\n\n========================\n\n'))
}


run()
runFy()