import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

class ServerSideRender extends Component {
  constructor(props) {
    super(props)
    if (this.props.data) {
      this.Dom = styled[this.props.data.dom]`
        ${this.props.data.style};
        animation: 1.5s ${fadeIn} forwards;
        animation-delay: ${this.props.delay}s;
        opacity: 0;
      `
    }
  }
  render() {
    if (!this.props.data) {
      return null
    }
    return (
      <this.Dom>
        {this.props.data.children.filter(o => o).map((child, i) => {
          const Childdom = styled[child.dom]`
            ${child.style || ''};
          `
          return (
            <Childdom key={`${JSON.stringify(child)}-${i}`}>
              {child.text}
            </Childdom>
          )
        })}
      </this.Dom>
    )
  }
}

ServerSideRender.propTypes = {
  data: PropTypes.object,
  delay: PropTypes.number,
}

export default ServerSideRender
