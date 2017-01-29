import Immutable from 'immutable'
import { RESET_STORE } from '../constants/global'
import {
    SET_USER_ID,
    SET_INSTRUMENT_ID,
    SET_ROOM_ID,
    SET_SONG_ID,
    SET_PLAYERS,
    SET_IS_HOST
} from '../constants/rooms'

const initialState = Immutable.Map({
    userId: '',
    instrumentId: '',
    roomId: '',
    songId: 0,
    players: [],
    isHost: false
})

const roomsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_USER_ID: {
            const { userId } = payload

            state = state.set('userId', userId)
        }
            break
        case SET_INSTRUMENT_ID: {
            const { instrumentId } = payload

            state = state.set('instrumentId', instrumentId)
        }
            break
        case SET_ROOM_ID: {
            const { roomId } = payload

            state = state.set('roomId', roomId)
        }
            break
        case SET_SONG_ID: {
            const { songId } = payload

            state = state.set('songId', songId)
        }
            break
        case SET_PLAYERS: {
            const { players } = payload

            state = state.set('players', players)
        }
            break
        case SET_IS_HOST: {
            const { isHost } = payload

            state = state.set('isHost', isHost)
        }
            break
        case RESET_STORE:
            state = initialState
            break
    }

    return state
}

export default roomsReducer

export const userIdSelector = state => state.get('userId')
export const isHostSelector = state => state.get('isHost')
export const instrumentSelector = state => state.get('instrumentId')
export const songSelector = state => state.get('songId')
export const roomSelector = state => state.get('roomId')
export const playersSelector = state => state.get('players')
