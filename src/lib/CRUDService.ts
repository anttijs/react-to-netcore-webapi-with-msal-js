import Axios from 'axios'
interface ResponseData {
  data: any;
  schema: Schema
}
interface CRUD {
    Name: string,
    GetList: string,
    GetSingle: string,
    Put: string,
    Post: string,
    Delete: string
}
const RESOURCE_NAME = process.env.REACT_APP_API_ENDPOINT

export default {
  getList(name: string) {
    let endpoint = `${RESOURCE_NAME}/${this.apiMethods[this.getIndex(name)].GetList}`
    console.log('Axios.get, endpoint:',endpoint, 'name:', name)
    return Axios.get(endpoint);
  },
  get(name: string, id: number) {
    let endpoint = `${RESOURCE_NAME}/${this.apiMethods[this.getIndex(name)].GetSingle}/${id}`
    console.log('Axios.get, endpoint:',endpoint, 'name:', name)
    return Axios.get(endpoint);
  },
  post(name: string, dto: any) {
    let endpoint = `${RESOURCE_NAME}/${this.apiMethods[this.getIndex(name)].Post}`
    console.log('Axios.post, endpoint:',endpoint)
    return Axios.post(endpoint, dto)
  },
  put(name: string, dto: any) {
    let endpoint = `${RESOURCE_NAME}/${this.apiMethods[this.getIndex(name)].Put}/${dto.Id}`
    console.log('Axios.put, endpoint:',endpoint)
    return Axios.put(endpoint, dto)
  },
  delete(name: string, id: number) {
    let endpoint = `${RESOURCE_NAME}/${this.apiMethods[this.getIndex(name)].Delete}/${id}`
    console.log('Axios.delete, endpoint:',endpoint)
    return Axios.delete(endpoint)
    //return Axios.delete(endpoint, { headers: {"Authorization" : `Bearer ${token}`} });
  },
  getIndex(name: string) {
      return (this.apiMethods.indexOf(this.apiMethods.find(o => o.Name === name)!))
  },
  getSingleName(name: string): string {
    return this.apiMethods[this.getIndex(name)].SingleName
  },
  getErrorText(error: any): string {
    let txt=""
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log('CRUDService:',error.response.status);
      console.log('CRUDService:',error.response.headers);
      txt = `Operation failed. The server responded with error ${error.response.status}. ${error.response.data}`
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      txt = `Operation failed. The server did not respond`
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      txt = `Operation failed, reason ${error.message}`
    }
    return txt
  },
  apiMethods: [
    {Name: "People", SingleName: "person", GetList: "GetPeople", GetSingle: "GetPerson", Put: "PutPerson", Post: "PostPerson", Delete: "DeletePerson"},
    {Name: "Movies", SingleName: "movie", GetList: "GetMovies", GetSingle: "GetMovie", Put: "PutMovie", Post: "PostMovie", Delete: "DeleteMovie"},
    {Name: "Books", SingleName: "book", GetList: "GetBooks", GetSingle: "GetBook", Put: "PutMovie", Post: "PostMovie", Delete: "DeleteMovie"}
  ]
}