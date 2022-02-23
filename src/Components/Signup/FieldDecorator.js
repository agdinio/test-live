import React, { Component } from 'react'
import styled from 'styled-components'
import Incorrect from '@/assets/images/input_field-incorrect.svg'
import Verified from '@/assets/images/input_field-verified.svg'

class FieldDecorator extends Component {
  render() {
    if (this.props.valid === true || this.props.valid === false) {
      return (
        <FieldDecoratorContainer>
          <Icon src={this.props.valid ? Verified : Incorrect} />
        </FieldDecoratorContainer>
      )
    }
    return null
  }
}

export default FieldDecorator

const Icon = styled.img`
  height: 5vh;
  width: 5vh;
`

const FieldDecoratorContainer = styled.div`
  position: absolute;
  top: 0.7vh;
  opacity: 1;
  right: -2.7vh;
  width: 5.5vh;
  height: 5.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
