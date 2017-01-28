import Immutable from 'immutable'
import { RESET_STORE } from '../constants/global'

const initialState = Immutable.Map({
    userId: '',
    instrumentId: '',
    roomId: '',
    songId: '',
    players: []
})

const roomsReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case RESET_STORE:
            state = initialState
            break
    }

    return state
}

export default roomsReducer

export const userIdSelector = state => state.get('userId')
export const instrumentSelector = state => state.get('instrumentId')
export const songSelector = state => state.get('songId')
export const roomSelector = state => state.get('roomId')
export const playersSelector = state => state.get('players')
