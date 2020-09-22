import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www=from-urlencoded'

export default {
  //get 请求
  requestGet(url,params={}){
    return new Promise(((resolve, reject) => {
      axios.get(url,params).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        reject(error)
      })
    }))
  },
  //post 请求
  requestPost(url,params={}){
    return new Promise(((resolve, reject) => {
      axios.post(url,params).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        reject(error)
      })
    }))
  },
  //delete 请求
  requestDelete(url,params={}){
    return new Promise(((resolve, reject) => {
      axios.delete(url,params).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        reject(error)
      })
    }))
  },
  //put 请求
  requestPut(url,params={}){
    return new Promise(((resolve, reject) => {
      axios.put(url,params).then(res=>{
        resolve(res.data)
      }).catch(error=>{
        reject(error)
      })
    }))
  }
}
