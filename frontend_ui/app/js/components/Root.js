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
import { subscribe } from '../../lib/broker_facade'
import { setPlayers } from '../actions/rooms'

export const configureStoreWithBrowserHistory = () => {
    const store = configureStore()

    syncHistoryWithStore(browserHistory, store)

    return store
}

export const defaultStore = configureStoreWithBrowserHistory()

export const subscribeRoomPartial = roomId => {
    subscribe(`/room/${roomId}`, function(event){
        const data = JSON.parse(event.getData())

        if (data.type === 'joinedRoom' || data.type === 'instrumentChosen') {
            defaultStore.dispatch(setPlayers({ players: data.room.members }))
        }
        console.log(JSON.parse(event.getData()))
    })
}

export const createRoot = (store = defaultStore, name = 'Root') => {
    class Root extends Component {
        render() {
            return (
                <Provider store={store}>
                    <Router history={browserHistory}>
                        <Route path={getLink('')} component={App}>
                            <IndexRedirect to={getLink('home')} />
                            <Route path={getLink('home')} component={HomePageContainer} />
                            <Route path={getLink('chooseSong')} component={CreateGamePageContainer} />
                            <Route path={getLink('room')} component={InviteFriendsPageContainer}>
                                <Route path='*' />
                            </Route>
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
