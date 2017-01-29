import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { CREATE_ROOM, JOIN_ROOM, CHOOSE_INSTRUMENT } from '../constants/rooms'
import {
    setUserId,
    setRoomId,
    setSongId,
    setPlayers,
    setIsHost
} from '../actions/rooms'
import { startLoading, stopLoading } from '../actions/loading'
import { CREATE_ROOM_IS_LOADING } from '../constants/loading'
import { handleSagaError } from './utils'
import { createRoom } from '../utils/services'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'

function* onCreateRoom({ payload: { id: songId } }) {
    try {
        yield put(startLoading({ loader: CREATE_ROOM_IS_LOADING }))

        const { id, members } = yield call(createRoom, { data: { id: songId } })

        yield put(setSongId({ songId }))
        yield put(setUserId({ userId: id }))
        yield put(setPlayers({ players: members }))
        yield put(setIsHost({ isHost: true }))
        yield put(setRoomId({ roomId: id }))

        yield put(push(`${getLink('room')}/${id}`))
    } catch (error) {
        yield call(handleSagaError, { error })
    } finally {
        yield put(stopLoading({ loader: CREATE_ROOM_IS_LOADING }))
    }
}

function* onJoinRoom({ payload: { room } }) {
    try {
        yield put(startLoading({ loader: CREATE_ROOM_IS_LOADING }))

        const { room: { id, members }, userId } = yield call(createRoom, { data: { id: `${room}/join` } })

        yield put(setSongId({ songId: 0 }))
        yield put(setUserId({ userId }))
        yield put(setPlayers({ players: members }))
        yield put(setRoomId({ roomId: id }))

        yield put(push(`${getLink('room')}/${id}`))
    } catch (error) {
        yield call(handleSagaError, { error })
    } finally {
        yield put(stopLoading({ loader: CREATE_ROOM_IS_LOADING }))
    }
}

function* onChooseRoom({ payload: { room, userId, instrumentId } }) {
    try {
        yield put(startLoading({ loader: CREATE_ROOM_IS_LOADING }))

        const { members } = yield call(createRoom, { data: { id: `${room}/instrument/${userId}/${instrumentId}` } })

        yield put(setPlayers({ players: members }))
    } catch (error) {
        yield call(handleSagaError, { error })
    } finally {
        yield put(stopLoading({ loader: CREATE_ROOM_IS_LOADING }))
    }
}

function* watchCreateRoom() {
    yield* takeLatest(CREATE_ROOM, onCreateRoom)
}

function* watchJoinRoom() {
    yield* takeLatest(JOIN_ROOM, onJoinRoom)
}

function* watchChooseRoom() {
    yield* takeLatest(CHOOSE_INSTRUMENT, onChooseRoom)
}

export default function* roomSaga() {
    yield [
        watchCreateRoom(),
        watchJoinRoom(),
        watchChooseRoom()
    ]
}
