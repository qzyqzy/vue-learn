import axios from 'axios'
// 获取vkey
export function getSongVkey(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, {
    g_tk: 195219765,
    loginUin: 1297716249, //可以传空值
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    guid: 9918820956,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 1297716249, //可以传空值
    songmid,
    filename: `C400${songmid}.m4a`,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
