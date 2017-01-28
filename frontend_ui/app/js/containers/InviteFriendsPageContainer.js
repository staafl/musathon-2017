import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from '../components'
import Select from 'react-select'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'
import {
    userIdSelector,
    instrumentSelector,
    roomSelector,
    playersSelector,
    songSelector
} from '../reducers'
import { mapValuesToMultiSelectOptions } from '../utils/utils'
import { ALBUMS } from '../constants/global'

class InviteFriendsPageContainer extends Component {
    render() {
        const { userId, instrument, room, song, players } = this.props

        return (
            <div className="invite-game">
                <main >
                    {userId}
                    <Select
                        value={instrument}
                        placeholder={'select instrument'}
                        options={
                            mapValuesToMultiSelectOptions(ALBUMS[song]['instruments']
                                    .filter(instrument => {
                                        return !players.some(player => player.instrument === instrument)
                                    })
                            )
                        }
                        onChange={() => {}}
                    />
                    <ul>
                        {
                            players.filter(player => player.id !== userId)
                                    .map(player => <li>{`${player.id} - ${player.instrument}`}</li>)
                        }
                    </ul>
                    <ul className="workflow">
                        <li className=""><i className="fa fa-music"/>{'1. Choose song'}</li>
                        <li className="primary"><i className="fa fa-users"/>{'2. Invite Friends'}</li>
                        <li className="disabled"><i className="fa fa-trophy"/>{'3. Play!'}</li>
                    </ul>
                    <span>{`Join: http://192.182.125.21/room/join/${room}`}</span>
                </main>
            </div>
        )
    }
}

InviteFriendsPageContainer.propTypes = {
    userId: PropTypes.string,
    instrument: PropTypes.string,
    room: PropTypes.string,
    song: PropTypes.string,
    players: PropTypes.array,
    push: PropTypes.func
}

export default connect(
    state => ({
        /*userId: userIdSelector(state),
        instrument: instrumentSelector(state),
        room: roomSelector(state),
        players: playersSelector(state),
        song: songSelector(state),*/
        userId: 'Pesho',
        instrument: instrumentSelector(state),
        room: roomSelector(state),
        players: playersSelector(state),
        song: 0
    }),
    dispatch => bindActionCreators({
        push
    }, dispatch)
)(InviteFriendsPageContainer)
