import React, { Component } from 'react'
import styled from 'styled-components'

class ListErrors extends Component {
  render() {
    const errors = this.props.errors
    if (errors) {
      return (
        <ul className="error-messages">
          {Object.keys(errors).map(key => {
            return (
              <LI key={key}>
                {key} {errors[key]}
              </LI>
            )
          })}
        </ul>
      )
    } else {
      return null
    }
  }
}

export default ListErrors

const LI = styled.li`
  color: #ff0000;
  text-transform: uppercase;
  font-family: pamainregular;
  font-size: 1.5em;
`
