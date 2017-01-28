import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from '../components'
import { push } from 'react-router-redux'
import getLink from '../utils/getLink'

class HomePageContainer extends Component {
    onCreateButtonClick = () => {
        const { push } = this.props

        push(getLink('chooseSong'))
    }

    render() {
        return (
            <div className="home">
                <header>
                    <h1>{'Multisician'}</h1>
                </header>
                <main>
                    <span>{'Това приложение ще ви позволи да тренирате своя усет към музиката, докато се забавлявате заедно с приятели. Достатъчно за да играете ще е само PC - настолен компютър или лаптоп. Ще можете да свирите на различни инструменти, заедно с вашите приятели или със случайни хора. Ще трябва да уцелите точната мелодия в такт и да не изпускате ритъма.'}</span>
                    <br />
                    <Button
                        className="create-button"
                        onClick={this.onCreateButtonClick}
                        title="Create New Room"
                    >
                        {'Create'}
                    </Button>
                    <br />
                    <Button
                        onClick={() => {}}
                        title="Join Room"
                    >
                        {'Join'}
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
