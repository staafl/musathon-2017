import { CREATE_ROOM } from '../constants/rooms'

export const createRoom = ({ id }) => ({
    type: CREATE_ROOM,
    payload: {
        id
    }
})
