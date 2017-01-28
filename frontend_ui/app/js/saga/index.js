import roomSaga from './rooms'

export default function* rootSaga() {
    yield [
        roomSaga()
    ]
}
