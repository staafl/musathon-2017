import React, { Component } from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../store/createStore'
import {
    App,
    HomePageContainer,
    CreateGamePageContainer,
    InviteFriendsPageContainer
} from '../containers'
import { NotFound } from '.'
import getLink from '../utils/getLink'

export const configureStoreWithBrowserHistory = () => {
    const store = configureStore()

    syncHistoryWithStore(browserHistory, store)

    return store
}

export const defaultStore = configureStoreWithBrowserHistory()

export const createRoot = (store = defaultStore, name = 'Root') => {
    class Root extends Component {
        render() {
            return (
                <Provider store={store}>
                    <Router history={browserHistory}>
                        <Route path={getLink('')} component={App}>
                            <IndexRedirect to={getLink('home')} />
                            <Route path={getLink('home')} component={HomePageContainer} />
                            <Route path={getLink('create')} component={CreateGamePageContainer} />
                            <Route path={getLink('inviteFriends')} component={InviteFriendsPageContainer} />
                            <Route path='*' component={NotFound} />
                        </Route>
                    </Router>
                </Provider>
            )
        }
    }

    Root.displayName = name

    return Root
}
