import { combineReducers } from 'redux'
import loading, * as fromLoading from './loading'
import routing, * as fromRouting from './routing'
import actionsHistory from './actionsHistory'
import { isTesting } from '../utils/utils'
import rooms, * as fromRooms from './rooms'

const allReducers = {
    loading,
    routing,
    rooms
}

if (isTesting()) {
    allReducers.actionsHistory = actionsHistory
}

const rootReducer = combineReducers(allReducers)

export default rootReducer

/* loaders selectors start */
export const isLoadingSelector = (state, loader) => fromLoading.isLoadingSelector(state.loading, loader)
/* loaders selectors end */

/* routing selectors start */
export const routingPathnameSelector = state =>
    fromRouting.pathnameSelector(state.routing)
/* routing selectors end */

export const userIdSelector = state => fromRooms.userIdSelector(state.rooms)
export const isHostSelector = state => fromRooms.isHostSelector(state.rooms)
export const instrumentSelector = state => fromRooms.instrumentSelector(state.rooms)
export const roomSelector = state => fromRooms.roomSelector(state.rooms)
export const playersSelector = state => fromRooms.playersSelector(state.rooms)
export const songSelector = state => fromRooms.songSelector(state.rooms)
