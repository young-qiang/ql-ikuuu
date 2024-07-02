const { initInstance, getEnv } = require('./qlApi.js')
const axios = require('axios')


const loginURLFy = 'https://a.lanying.win/auth/login'
const infoURLFy = 'https://a.lanying.win/user'

const loginURL = 'https://ikuuu.pw/auth/login'
const infoURL = 'https://ikuuu.pw/user'
const todayTrafficReg = /今日已用\n.*\s(\d+\.?\d*)([M|G]?B)/
const restTrafficReg = /剩余流量[\s\S]*<span class="counter">(\d+\.?\d*)<\/span> ([M|G]?B)/

function extractArr(envStr) {
  if (typeof envStr === 'string') {
    envStr = envStr.trim()
  }

  if (Array.isArray(envStr)) {
    return envStr
  } else if (envStr.includes('\n')) {
    return envStr.split('\n').map(v => v.trim()).filter(Boolean)
  }
  return [envStr]
}

/** 获取邮箱和密码数组 */
async function getEmailAndPwdList() {
  let instance = null
  try {
    instance = await initInstance()
  } catch (e) { }

  let emailEnv = process.env.IKUUU_EMAIL || []
  let pwdEnv = process.env.IKUUU_PWD || []

  try {
    if (instance) {
      emailEnv = await getEnv(instance, 'IKUUU_EMAIL')
      pwdEnv = await getEnv(instance, 'IKUUU_PWD')
    }
  } catch { }

  const emailList = extractArr(emailEnv)
  const pwdList = extractArr(pwdEnv)

  const emailLen = emailList.length
  const pwdLen = pwdList.length

  if (!emailLen || !pwdLen) {
    console.log('未获取到邮箱和密码, 程序终止')
    process.exit(1)
  }

  if (emailLen !== pwdLen) {
    console.log('邮箱和密码数量不一致, 程序终止')
    process.exit(1)
  }

  console.log(`✅ 成功读取 ${emailLen} 对邮箱和密码`)

  return [emailList.map(x=>x.value), pwdList.map(x=>x.value)]
}

/** 获取邮箱和密码数组 飞云*/
async function getEmailAndPwdListFy() {
  let instance = null
  try {
    instance = await initInstance()
  } catch (e) { }

  let emailEnv = process.env.FYUN_EMAIL || []
  let pwdEnv = process.env.FYUN_PWD || []

  try {
    if (instance) {
      emailEnv = await getEnv(instance, 'FYUN_EMAIL')
      pwdEnv = await getEnv(instance, 'FYUN_PWD')
    }
  } catch { }

  const emailList = extractArr(emailEnv)
  const pwdList = extractArr(pwdEnv)

  const emailLen = emailList.length
  const pwdLen = pwdList.length

  if (!emailLen || !pwdLen) {
    console.log('未获取到邮箱和密码, 程序终止')
    process.exit(1)
  }

  if (emailLen !== pwdLen) {
    console.log('邮箱和密码数量不一致, 程序终止')
    process.exit(1)
  }

  console.log(`✅ 成功读取 ${emailLen} 对邮箱和密码`)

  return [emailList.map(x=>x.value), pwdList.map(x=>x.value)]
}

/** 登录获取 cookie */
async function getCookie(email, pwd) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('passwd', pwd)
  try {
    const res = await axios(loginURL, {
      method: 'POST',
      data: formData
    })
console.log(res.data)
    if (res.data.ret === 0) {
        
      return `❌ 登录失败：${res.data.msg}`
    }
    console.log(`✅ 登录成功：${email}`)
    return res.headers['set-cookie'].join('; ')
  } catch { }
}

/** 登录获取 cookie  飞云*/
async function getCookieFy(email, pwd) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('passwd', pwd)
  try {
    const res = await axios(loginURLFy, {
      method: 'POST',
      data: formData
    })
    if (res.data.ret === 0) {
      return `❌ 登录失败：${res.data.msg}`
    }
    console.log(`✅ 登录成功：${email}`)
    return res.headers['set-cookie'].join('; ')
  } catch (e){ console.log('获取cookie失败',e) }
}

/** 获取流量 */
async function getTraffic(cookie) {
  try {
    const { data } = await axios(infoURL, {
      method: 'GET',
      headers: {
        Cookie: cookie
      },
      withCredentials: true
    })

    const trafficRes = data.match(todayTrafficReg)
    const restRes = data.match(restTrafficReg)
    if (!trafficRes || !restRes) {
      return ['查询流量失败，请检查正则和用户页面 HTML 结构']
    }

    const [, today, todayUnit] = trafficRes
    const [, rest, restUnit] = restRes

    return [
      `今日已用：${today} ${todayUnit}`,
      `剩余流量：${rest} ${restUnit}`
    ]
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}


/** 获取流量 飞云 */
async function getTrafficFy(cookie) {
  try {
    const { data } = await axios(infoURLFy, {
      method: 'GET',
      headers: {
        Cookie: cookie
      },
      withCredentials: true
    })

    // const trafficRes = data.match(todayTrafficReg)
    // const restRes = data.match(restTrafficReg)
    // if (!trafficRes || !restRes) {
    //   return ['查询流量失败，请检查正则和用户页面 HTML 结构']
    // }

    // const [, today, todayUnit] = trafficRes
    // const [, rest, restUnit] = restRes

    const trafficRes = data.match(/<span[^>]*>剩余流量 ： ([^<]+)<\/span>/)
if (!trafficRes) {
  return ['查询流量失败，请检查正则和用户页面 HTML 结构']
}
const [, today] = trafficRes
console.log(today);
    return [
      // `今日已用：${today} ${todayUnit}`,
      `剩余流量：${today.trim()}`
    ]
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = { getCookie, getTraffic, getEmailAndPwdList,getCookieFy, getTrafficFy, getEmailAndPwdListFy }
