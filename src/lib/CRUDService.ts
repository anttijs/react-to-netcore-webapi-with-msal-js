import Axios, { AxiosResponse } from 'axios'
import {Schema} from './SchemaTool'
import React, {useState, useEffect, useReducer} from 'react'
import {isEqual, cloneDeep} from 'lodash'

interface ResponseData {
  data: any;
  schema: Schema
}

const RESOURCE_NAME = process.env.REACT_APP_API_ENDPOINT


const get = (name: string, id: number) => {
  let endpoint = `${RESOURCE_NAME}/${apiMethods[getIndex(name)].GetSingle}/${id}`
  console.log('Axios.get, endpoint:',endpoint, 'name:', name)
  return Axios.get(endpoint);
}
type StateforGet = {
  data: any,
  dataOriginal: any,
  schema: Schema | undefined,
  isChanged: boolean,
  isLoading: boolean,
  isError: boolean,
  errorText: string
}
type ActionforGet = {
  type: 'init' | 'success' | 'error' | 'update',
  payload?: {data: any | undefined, schema: Schema | undefined, errorText: string}
}

const getReducer = (state: StateforGet,  action: ActionforGet) => {
  switch (action.type) {
    case "init":
      return {
        ...state,
        data: undefined,
        dataOriginal: undefined,
        schema: undefined,
        isChanged: false,
        isLoading: true,
        isError: false,
        errorText: ""
      };
    case "success":
      return {
        ...state,
        data: action.payload!.data,
        dataOriginal: cloneDeep(action.payload!.data),
        schema: action.payload!.schema,
        isChanged: false,
        isLoading: false,
        isError: false,
        errorText: ""
        
      };
    case "error":
      return {
        ...state,
        data: undefined,
        dataOriginal: undefined,
        schema: undefined,
        isChanged: false,
        isLoading: false,
        isError: true,
        errorText: action.payload!.errorText
      };
      case "update":
        console.log('iseqaul',isEqual(action.payload!.data,state.dataOriginal), state.dataOriginal )
      return {
        ...state,
        data: action.payload!.data,
        isChanged: !isEqual(action.payload!.data,state.dataOriginal),
        isLoading: false,
        isError: false,
        errorText: ""
      };
    default:
      throw new Error();
  }
};
export const useGet = (initialEntity: string, initialId: number): [StateforGet, (data: any)=> void] => {
  const [entity, setEntity] = useState<string>(initialEntity)
  const [id, setId] = useState<number>(initialId)
  const [state, dispatch] = useReducer(getReducer, {data: undefined, dataOriginal: undefined, schema: undefined, isChanged: false, isLoading: false, isError: false, errorText:""})
  
  const updateData = (data: any) => {
    dispatch({type: 'update', payload: {data: data, schema: undefined, errorText:""}})
  }

  if (entity !== initialEntity || id !== initialId) {
    setEntity(initialEntity)
    setId(initialId)
    console.log('update', entity, initialEntity)
  }
  else {
    console.log('no update', entity, initialEntity)
  }
  useEffect(() => {
    console.log('getting data', entity)
    dispatch({type:'init'})
    get(entity, id)
    .then((response: any) => {
      dispatch({type:'success', payload: { data: response.data.data, schema: response.data.schema, errorText: ""}})
    })
    .catch(e => {
      dispatch({type:'error', payload: { data: undefined, schema: undefined, errorText: getErrorText(e)}})
    })
  },[entity, id])
  return [state, updateData]
}

type StateforGetList = {
  data: any[],
  schema: Schema | undefined,
  isLoading: boolean,
  isError: boolean,
  errorText: string
}
type ActionforGetList = {
  type: 'init' | 'success' | 'error',
  payload?: {data: any[], schema: Schema | undefined, errorText: string}
}

const getListReducer = (state: StateforGetList,  action: ActionforGetList) => {
  switch (action.type) {
    case "init":
      return {
        ...state,
        data: [],
        schema: undefined,
        isLoading: true,
        isError: false,
        errorText: ""
      };
    case "success":
      return {
        ...state,
        data: action.payload!.data,
        schema: action.payload!.schema,
        isLoading: false,
        isError: false,
        errorText: ""
        
      };
    case "error":
      return {
        ...state,
        data: action.payload!.data,
        schema: undefined,
        isLoading: false,
        isError: true,
        errorText: action.payload!.errorText
      };
    default:
      throw new Error();
  }
};

const getList = (name: string) => {
  let endpoint: string = `${RESOURCE_NAME}/${apiMethods[getIndex(name)].GetList}`
  console.log('Axios.get, endpoint:',endpoint, 'name:', name)
  return Axios.get<ResponseData>(endpoint);
}

export const useGetList = (initialEntity: string): 
[StateforGetList, boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [entity, setEntity] = useState<string>(initialEntity)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [state, dispatch] = useReducer(getListReducer, { data: [], schema: undefined, isError: false, isLoading: false, errorText:"" });

  
  if (entity !== initialEntity) {
    setEntity(initialEntity)
    console.log('update', entity, initialEntity)
  }
  else {
    console.log('no update', entity, initialEntity)
  }
  useEffect(() => {
    dispatch( { type: 'init' } );
    getList(entity)
    .then(response => {
      dispatch({type: 'success', payload: {data: response.data.data, schema: response.data.schema, errorText: ""}})
    })
    .catch((e: AxiosResponse)=>{
      dispatch({type: 'error', payload: {data: [], schema: undefined, errorText: getErrorText(e)}})
    })
  },[entity, refresh])
  return [state, refresh, setRefresh]
}

export const postDTO = async (name: string, dto: any) => {
  let endpoint = `${RESOURCE_NAME}/${apiMethods[getIndex(name)].Post}`
  console.log('Axios.post, endpoint:',endpoint)
  try {
    return await Axios.post(endpoint, dto)
  }
  catch (e) {
    throw new Error(getErrorText(e))
  }
}

export const putDTO = async (name: string, dto: any) => {
  let endpoint = `${RESOURCE_NAME}/${apiMethods[getIndex(name)].Put}/${dto.Id}`
  console.log('Axios.put, endpoint:',endpoint)
  try {
    return await Axios.put(endpoint, dto)
  }
  catch (e) {
    throw new Error(getErrorText(e))
  }
}

export const removeDTO = async (name: string, id: number, accessToken: string) => {
  let endpoint = `${RESOURCE_NAME}/${apiMethods[getIndex(name)].Delete}/${id}`
  console.log('Axios.delete, endpoint:',endpoint)
  try {
    return await Axios.delete(endpoint, { headers: {"Authorization" : `Bearer ${accessToken}`} });
  }
  catch (e) {
    throw new Error(getErrorText(e))
  }
}
const getIndex = (name: string) => {
    return (apiMethods.indexOf(apiMethods.find(o => o.Name === name)!))
}
export const getSingleName = (name: string): string => {
  return apiMethods[getIndex(name)].SingleName
}

const getErrorText = (error: any): string => {
  let txt=""
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log('getErrorText:',error.response.status);
    console.log('getErrorText:',error.response.headers);
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
}
export const apiMethods = [
  {Name: "People", SingleName: "person", GetList: "GetPeople", GetSingle: "GetPerson", Put: "PutPerson", Post: "PostPerson", Delete: "DeletePerson"},
  {Name: "Movies", SingleName: "movie", GetList: "GetMovies", GetSingle: "GetMovie", Put: "PutMovie", Post: "PostMovie", Delete: "DeleteMovie"},
  {Name: "Books", SingleName: "book", GetList: "GetBooks", GetSingle: "GetBook", Put: "PutBook", Post: "PostBook", Delete: "DeleteBook"}
]
