import axios from 'axios'
import R from 'ramda'
import { ParseGlobalNetworkError } from '../utils/utils'
import { UNKNOWN_NETWORK_ERROR } from '../constants/notification'

const defaults = {
    withCredentials: false,
    timeout: 100000
}

const BASE_URL = process.env.API_URL

const servicesDesc = [
    {
        name: 'CREATE_ROOM',
        url: `${BASE_URL}/rooms`,
        method: 'POST'
    }
].map(service => R.merge(service, defaults))

export const successCallback = (resolve, reject) => response => {
    const { headers } = response
    const contentType = headers['content-type']

    // If not all services expect resultsMap fix this
    if (typeof response.data === 'object' && contentType.includes('application/json')) {
        resolve(response.data)
    } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        resolve(response)
    } else {
        reject({ message: ParseGlobalNetworkError({ errorCode: UNKNOWN_NETWORK_ERROR }) })
    }
}

export const errorCallback = reject => (error = {}) => {
    reject({
        message: ParseGlobalNetworkError({
            errorCode: typeof error === 'object' ? typeof error.response === 'object' ? error.response.status : UNKNOWN_NETWORK_ERROR : UNKNOWN_NETWORK_ERROR
        })
    })
}

const services = servicesDesc.reduce((acc, service) => {
    acc[service.name] = ({ data = {}, method, url }) => {
        const newService = R.clone(service)

        newService.data = data
        if (data.id) {
            newService.url = `${service.url}/${data.id}`
        }
        if (method !== undefined) {
            newService.method = service.method || 'GET'
        }

        return new Promise((resolve, reject) => {
            axios(newService)
                .then(successCallback(resolve, reject))
                .catch(errorCallback(reject))
        })
    }

    return acc
}, {})

export const createRoom = services['CREATE_ROOM']
