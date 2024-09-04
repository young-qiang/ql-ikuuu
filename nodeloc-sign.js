const axios =require("axios")
const notify = require('./sendNotify')
var data = '{"data":{"type":"users","attributes":{"allowCheckin":false,"checkin_days_count":3,"checkin_type":"R"},"id":"3735"}}';


const checkinURL="https://www.nodeloc.com/api/users/3735";
const cookie = process.env.NodelocCookie;



var config = {
   method: 'post',
   url: checkinURL,
   headers: { 
      'pragma': 'no-cache', 
      'priority': 'u=1, i', 
      'sec-ch-ua-arch': '"x86"', 
      'sec-ch-ua-bitness': '"64"', 
      'sec-ch-ua-full-version': '"128.0.6613.86"', 
      'sec-ch-ua-full-version-list': '"Chromium";v="128.0.6613.86", "Not;A=Brand";v="24.0.0.0", "Google Chrome";v="128.0.6613.86"', 
      'sec-ch-ua-model': '""', 
      'sec-ch-ua-platform-version': '"10.0.0"', 
      'x-csrf-token': 'yREJAwjJQGifNMEP3pt1UIMfKDbEiwI8EtBeex8z', 
      'x-http-method-override': 'PATCH', 
      'Cookie': cookie, 
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)', 
      'content-type': 'application/json; charset=UTF-8', 
      'Accept': '*/*', 
      'Host': 'www.nodeloc.com', 
      'Connection': 'keep-alive'
   },
   data : data
};

axios(config)
.then(async function (response) {
    // var res= response.data.data.attributes;
    // var {lastCheckinTime,checkin_last_time,lastCheckinMoney,checkin_days_count}=res
    // var content=`签到时间：${checkin_last_time}，签到能量：${lastCheckinMoney}。累计签到：${checkin_days_count}天`
    //  var url = "https://api.day.app/" + process.env.ccKey + "/NodeLoc签到结果/" + content;
    // axios.get(url);
    // console.log(lastCheckinTime,checkin_last_time,lastCheckinMoney,checkin_days_count)

    var content=`签到时间：${checkin_last_time}，签到能量：${lastCheckinMoney}。累计签到：${checkin_days_count}天`
    
  await notify.sendNotify(content)

})
.catch(function (error) {
   console.log(error);
});