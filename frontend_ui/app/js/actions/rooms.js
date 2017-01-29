import {
    CREATE_ROOM,
    SET_USER_ID,
    SET_INSTRUMENT_ID,
    SET_ROOM_ID,
    SET_SONG_ID,
    SET_PLAYERS,
    SET_IS_HOST,
    JOIN_ROOM,
    CHOOSE_INSTRUMENT,
    ROOM_READY
} from '../constants/rooms'

export const setUserId = ({ userId }) => ({
    type: SET_USER_ID,
    payload: {
        userId
    }
})
export const setInstrumentId = ({ instrumentId }) => ({
    type: SET_INSTRUMENT_ID,
    payload: {
        instrumentId
    }
})
export const chooseInstrument = ({ room, instrumentId, userId }) => ({
    type: CHOOSE_INSTRUMENT,
    payload: {
        room,
        instrumentId,
        userId
    }
})
export const roomReady = ({ room, userId }) => ({
    type: ROOM_READY,
    payload: {
        room,
        userId
    }
})
export const setRoomId = ({ roomId }) => ({
    type: SET_ROOM_ID,
    payload: {
        roomId
    }
})
export const setSongId = ({ songId }) => ({
    type: SET_SONG_ID,
    payload: {
        songId
    }
})
export const setPlayers = ({ players }) => ({
    type: SET_PLAYERS,
    payload: {
        players
    }
})
export const setIsHost = ({ isHost }) => ({
    type: SET_IS_HOST,
    payload: {
        isHost
    }
})

export const createRoom = ({ id }) => ({
    type: CREATE_ROOM,
    payload: {
        id
    }
})

export const joinRoom = ({ room }) => ({
    type: JOIN_ROOM,
    payload: {
        room
    }
})
