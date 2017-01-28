import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Img, Search } from '../components'
import { push } from 'react-router-redux'
import Coverflow from 'react-coverflow'
import { createRoom } from '../actions/rooms'
import backArrow from '../../assets/back.png'
import getLink from '../utils/getLink'
import { ALBUMS } from '../constants/global'

class CreateGamePageContainer extends Component {
    onCreateButtonClickPartial = ({ id }) => () => {
        const { createRoom } = this.props

        createRoom({ id })
    }

    onGoBackClick = () => {
        const { push } = this.props

        push(getLink('home'))
    }

    render() {
        return (
            <div className="create-game">
                <main>
                    <div style={{ width: '100%', textAlign: 'left', position: 'relative ' }}>
                        <img
                            style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                position: 'relative',
                                bottom: '8px',
                                marginRight: '40px'
                            }}
                            onClick={this.onGoBackClick}
                            title="Go back go menu"
                            className="btn"
                            src={backArrow}
                            width="100px"
                            height="50px"
                        />
                        <Search
                            className="song-search"
                            title="Search for songs"
                            value={''}
                            onButtonClick={() => {}}
                            onInputChange={() => {}}
                            placeholder={'Search songs...'}
                        />
                    </div>
                    <Coverflow
                        width={'90%'} height="340"
                        displayQuantityOfSide={2}
                        navigation={false}
                        enableScroll={true}
                        clickable={true}
                        active={0}
                    >
                        {
                            ALBUMS.map(album =>
                                <Img
                                    key={album['id']}
                                    src={album['src']}
                                    alt={''}
                                    heading={`${album['author']}-${album['songName']}`}
                                    onClick={this.onCreateButtonClickPartial({ id: album['id'] })}
                                />
                            )
                        }
                    </Coverflow>
                    <ul className="workflow">
                        <li className="primary"><i className="fa fa-music" />{'1. Choose song'}</li>
                        <li className="disabled"><i className="fa fa-users" />{'2. Invite Friends'}</li>
                        <li className="disabled"><i className="fa fa-trophy" />{'3. Play!'}</li>
                    </ul>
                </main>
            </div>
        )
    }
}

CreateGamePageContainer.propTypes = {
    push: PropTypes.func,
    createRoom: PropTypes.func
}

export default connect(
    state => ({}),
    dispatch => bindActionCreators({
        push,
        createRoom
    }, dispatch)
)(CreateGamePageContainer)
