// import http from "~/api/http";
import http from "./http";
// const baseUrl = 'http://localhost:8090'

export const checkUser = () =>{
  if (process.client){
    return http.requestGet('/user/check-token')
  }else {
    return http.requestGet('/user/check-token')
  }
};
export const doLoginOut = () =>{
  return http.requestGet('/user/logout')
}
