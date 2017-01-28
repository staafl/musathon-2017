import React, { PureComponent as Component, PropTypes } from 'react'

export class Img extends Component {
    render() {
        const { src, alt, heading, onClick } = this.props

        return (
            <div className="carousel-img" onClick={onClick}>
                <span>{heading}</span>
                {/* TODO: instruments show */}
                <span className="carousel-caption">{}</span>
                <img
                    src={src}
                    alt={alt}
                    height="200px"
                    width="200px"
                />
            </div>
        )
    }
}

Img.defaultProps = {
    alt: 'title or description'
}

Img.propTypes = {
    src: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    alt: PropTypes.string
}
