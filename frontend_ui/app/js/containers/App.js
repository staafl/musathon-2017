import React, { PureComponent as Component, PropTypes } from 'react'
import { NotificationContainer } from 'react-notifications'
import { Footer } from '../components'

export default class App extends Component {
    render() {
        const { children } = this.props

        return (
            <div className="main-app">
                <NotificationContainer />
                {children}
            </div>
        )
    }
}

App.propTypes = {
    children: PropTypes.object
}
