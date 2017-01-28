import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from '../components'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'

class InviteFriendsPageContainer extends Component {
    onCreateButtonClick = () => {
        const { push } = this.props

        push(getLink('create'))
    }

    render() {
        return (
            <div className="invite-game">
                <main >

                    <ul className="workflow">
                        <li className=""><i className="fa fa-music" />{'1. Choose song'}</li>
                        <li className="primary"><i className="fa fa-users" />{'2. Invite Friends'}</li>
                        <li className="disabled"><i className="fa fa-trophy" />{'3. Play!'}</li>
                    </ul>
                </main>
            </div>
        )
    }
}

InviteFriendsPageContainer.propTypes = {
    push: PropTypes.func
}

export default connect(
    state => ({
    }),
    dispatch => bindActionCreators({
        push
    }, dispatch)
)(InviteFriendsPageContainer)
