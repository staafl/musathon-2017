import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from '../components'
import Select from 'react-select'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'
import {
    isHostSelector,
    userIdSelector,
    instrumentSelector,
    roomSelector,
    playersSelector,
    songSelector
} from '../reducers'
import { mapValuesToMultiSelectOptions } from '../utils/utils'
import { ALBUMS } from '../constants/global'
import { joinRoom, setInstrumentId, chooseInstrument } from '../actions/rooms'

class InviteFriendsPageContainer extends Component {
    componentDidMount() {
        const { isHost, joinRoom } = this.props

        if (!isHost) {
            joinRoom({ room: this.props.location.pathname.split('/')[2] })
        }
    }

    onSelectChange = (e) => {
        const { room, setInstrumentId, userId, chooseInstrument } = this.props

        if (e) {
            setInstrumentId({ instrumentId: e.value })
            chooseInstrument({ room, instrumentId: e.value, userId })
        } else {
            setInstrumentId({ instrumentId: '' })
        }
    }

    render() {
        const { isHost, userId, instrument, room, song, players } = this.props

        if (userId === undefined || song === undefined) {
            return null
        }

        return (
            <div className="invite-players">
                <main>
                    <div className="players">
                        <div className="player player-self">
                            <span className="player-name">{`${userId} (Player)`}</span>
                            <Select
                                value={instrument}
                                placeholder={'select instrument'}
                                className={'select-instrument'}
                                options={
                                    mapValuesToMultiSelectOptions(ALBUMS[song]['instruments']
                                            .filter(instrument => {
                                                return !players.some(player => player.instrument === instrument)
                                            })
                                            // This is hardcode
                                            .map(instrument => {
                                                if (instrument) {
                                                    return instrument
                                                }
                                            })
                                    )
                                }
                                onChange={this.onSelectChange}
                            />
                        </div>
                        {
                            players.filter(player => player.id !== userId)
                                    .map(player =>
                                        <div className="player" key={player.id}>{`${player.id} - ${player.instrument ? player.instrument : ''}`}</div>
                                    )
                        }
                    </div>
                    {
                        isHost ?
                            <div className="url"><span className="join">{'Join'}</span><span className="well">{`http://192.168.111.150:3000/room/${room}`}</span></div>
                            : null
                    }
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
    isHost: PropTypes.bool,
    userId: PropTypes.string,
    instrument: PropTypes.string,
    room: PropTypes.string,
    song: PropTypes.number,
    players: PropTypes.array,
    push: PropTypes.func,
    joinRoom: PropTypes.func,
    setInstrumentId: PropTypes.func,
    chooseInstrument: PropTypes.func
}

export default connect(
    state => ({
        isHost: isHostSelector(state),
        userId: userIdSelector(state),
        instrument: instrumentSelector(state),
        room: roomSelector(state),
        players: playersSelector(state),
        song: songSelector(state)
    }),
    dispatch => bindActionCreators({
        push,
        joinRoom,
        setInstrumentId,
        chooseInstrument
    }, dispatch)
)(InviteFriendsPageContainer)
