import { combineReducers } from 'redux'
import loading, * as fromLoading from './loading'
import routing, * as fromRouting from './routing'
import actionsHistory from './actionsHistory'
import { isTesting } from '../utils/utils'

const allReducers = {
    loading,
    routing
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
