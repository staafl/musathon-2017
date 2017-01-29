import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { CREATE_ROOM, JOIN_ROOM, CHOOSE_INSTRUMENT, ROOM_READY } from '../constants/rooms'
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
import { subscribeRoomPartial } from '../components/Root'

function* onCreateRoom({ payload: { id: songId } }) {
    try {
        yield put(startLoading({ loader: CREATE_ROOM_IS_LOADING }))

        const { id, members } = yield call(createRoom, { data: { id: songId } })

        yield put(setSongId({ songId }))
        yield put(setUserId({ userId: id }))
        yield put(setPlayers({ players: members }))
        yield put(setIsHost({ isHost: true }))
        yield put(setRoomId({ roomId: id }))

        subscribeRoomPartial(id)
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

        const data = yield call(createRoom, { data: { id: `${room}/join` } })

        if (data.failed === true) {
            throw new Error('Sorry you cant join. Room is already full. Very sorry, mister.')
        }
        const { room: { id, members }, userId } = data

        yield put(setSongId({ songId: 0 }))
        yield put(setUserId({ userId }))
        yield put(setPlayers({ players: members }))
        yield put(setRoomId({ roomId: id }))

        subscribeRoomPartial(id)

        yield put(push(`${getLink('room')}/${id}`))
    } catch (error) {
        yield call(handleSagaError, { error })

        yield put(push(getLink('home')))
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

function* onRoomReady({ payload: { room, userId } }) {
    try {
        yield put(startLoading({ loader: CREATE_ROOM_IS_LOADING }))
        yield call(createRoom, { data: { id: `${room}/ready/${userId}` } })
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

function* watchRoomReady() {
    yield* takeLatest(ROOM_READY, onRoomReady)
}

export default function* roomSaga() {
    yield [
        watchCreateRoom(),
        watchJoinRoom(),
        watchChooseRoom(),
        watchRoomReady()
    ]
}
