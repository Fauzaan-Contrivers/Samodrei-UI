import axios from 'axios'
import { CategoryScale } from 'chart.js'
import { BASE_URL, API_KEY } from './config'

export async function apiCall(type = 'GET', appendUrl, data = {}) {
  let URL = BASE_URL + appendUrl
  console.log('apiCall', URL)
  let reqHeaders = {}
  reqHeaders['API-KEY'] = API_KEY
  if (type === 'POST' || type === 'PUT') {
    reqHeaders['Content-Type'] = 'application/json'
    data = JSON.stringify(data)
  }
  try {
    switch (type) {
      case 'GET':
        return await axios.get(URL, { headers: reqHeaders })
      case 'DELETE':
        return await axios.delete(URL, { headers: reqHeaders }, data)
      case 'POST':
        return await axios.post(URL, data, { headers: reqHeaders })
      case 'PUT':
        return await axios.put(URL, data, { headers: reqHeaders })
      default:
        console.log('apiCallError this type not handled here', type)
    }
  } catch (error) {
    console.log('apiCall -- Catch error', appendUrl, error)
  }
}

export function convertDateToReadableFormat(str) {
  try {
    if (str) {
      return new Date(str).toLocaleString('en-US', { timeZone: 'America/New_York' })
    }

    return str
  } catch (error) {
    console.log('convertDateToReadableFormat -- error', str, error)

    return str
  }
}

export function convertTimeZoneToReadableDate(str) {
  try {
    if (str) {
      return new Date(str).toLocaleDateString('en-US', { timeZone: 'America/New_York' })
    }

    return ''
  } catch (error) {
    console.log('convertDateToReadableFormat -- error', str, error)

    return ''
  }
}

export function convertTimeZoneToReadableTime(str) {
  try {
    if (str) {
      return new Date(str).toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
    }

    return ''
  } catch (error) {
    console.log('convertDateToReadableFormat -- error', str, error)

    return ''
  }
}

export function isJson(item) {
  let value = typeof item !== 'string' ? JSON.stringify(item) : item
  try {
    value = JSON.parse(value)
  } catch (e) {
    return false
  }

  return typeof value === 'object' && value !== null
}
