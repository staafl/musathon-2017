import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Img, Search } from '../components'
import { push } from 'react-router-redux'
import Coverflow from 'react-coverflow'
import cover1 from '../../assets/cover1.jpg'
import cover2 from '../../assets/cover2.jpg'
import { createRoom } from '../actions/rooms'

const ALBUMS = [
    {
        id: '0',
        src: cover1,
        songName: 'Babe',
        author: 'Justin Beiber',
        alt: ''
    },
    {
        id: '1',
        src: cover2,
        songName: 'Babe',
        author: 'Justin Beiber',
        alt: ''
    },
    {
        id: '0',
        src: cover1,
        songName: 'Babe',
        author: 'Justin Beiber',
        alt: ''
    },
    {
        id: '1',
        src: cover2,
        songName: 'Babe',
        author: 'Justin Beiber',
        alt: ''
    },
    {
        id: '0',
        src: cover1,
        songName: 'Babe',
        author: 'Justin Beiber',
        alt: ''
    },
    {
        id: '1',
        src: cover2,
        songName: 'Babe',
        author: 'Justin Beiber',
        alt: ''
    }
]

class CreateGamePageContainer extends Component {
    onCreateButtonClickPartial = ({ id }) => () => {
        const { createRoom } = this.props

        createRoom({ id })
    }

    render() {
        return (
            <div className="create-game">
                <main >
                    <Search
                        className="song-search"
                        placeholder={'Search songs...'}
                    />
                    <Coverflow
                        width={'90%'} height="300"
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
