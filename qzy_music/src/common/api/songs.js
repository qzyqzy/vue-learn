import axios from 'axios'
import {
  guid
} from 'common/js/config'

// 获取vkey
export function getSongVkey(songmid) {
  const url = 'http://ustbhuangyi.com/music/api/getPurlUrl'

  const data = Object.assign({}, {
    common: {
      g_tk: 5381,
      inCharset: "utf-8",
      outCharset: "utf-8",
      notice: 0,
      format: "json",
      platform: "h5",
      needNewCode: 1,
      uin: 0
    },
    req_0: {
      module: "vkey.GetVkeyServer",
      method: "CgiGetVkey",
      param: {
        guid,
        uin: "0",
        songmid: [songmid],
        songtype: [0],
        loginflag: 0,
        platform: "23"
      }
    }
  })

  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}
