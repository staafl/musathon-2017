import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from '../components'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'

class HomePageContainer extends Component {
    onCreateButtonClick = () => {
        const { push } = this.props

        push(getLink('create'))
    }

    render() {
        return (
            <div className="home">
                <header>
                    <h1>{'Multisician'}</h1>
                </header>
                <main>
                    <span>{'This is a game about Ivan. Lorem Upsum. Ivan is a dude. All hail Ivan!!!'}</span>
                    <Button
                        className={'centered'}
                        onClick={this.onCreateButtonClick}
                    >
                        {'Create'}
                    </Button>
                </main>
            </div>
        )
    }
}

HomePageContainer.propTypes = {
    push: PropTypes.func
}

export default connect(
    state => ({
    }),
    dispatch => bindActionCreators({
        push
    }, dispatch)
)(HomePageContainer)
