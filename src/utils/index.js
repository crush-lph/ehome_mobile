import axios from 'axios'

export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('ehome_city'))
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const currentCity = new window.BMapGL.LocalCity()
      currentCity.get(async res => {
        try {
          console.log('当前城市信息', res);
          const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
          localStorage.setItem('ehome_city', JSON.stringify(result.data.body))
          resolve(result.data.body)
        } catch (e) {
          // 获取定位城市失败
          reject(e)
        }
      })
    })
  } else {
    // 上面为了处理异步操作用了promise，为了返回值的统一，此处也应该使用promise
    // 因为此处的promise不会失败，所以此处只要返回一个成功的promise即可
    return Promise.resolve(localCity)
  }
}