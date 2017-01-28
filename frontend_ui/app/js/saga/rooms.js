import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { CREATE_ROOM } from '../constants/rooms'
import { startLoading, stopLoading } from '../actions/loading'
import { CREATE_ROOM_IS_LOADING } from '../constants/loading'
import { handleSagaError } from './utils'
import { createRoom } from '../utils/services'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'

function* onCreateRoom({ payload: { id } }) {
    try {
        yield put(startLoading({ loader: CREATE_ROOM_IS_LOADING }))

        const data = yield call(createRoom, { data: { id } })

        console.info(data)
        yield put(push(`${getLink('room')}/${data.id}`))
    } catch (error) {
        yield call(handleSagaError, { error })
    } finally {
        yield put(stopLoading({ loader: CREATE_ROOM_IS_LOADING }))
    }
}

function* watchCreateRoom() {
    yield* takeLatest(CREATE_ROOM, onCreateRoom)
}

export default function* roomSaga() {
    yield [
        watchCreateRoom()
    ]
}
