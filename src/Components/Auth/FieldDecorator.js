import React, { Component } from 'react'
import styled from 'styled-components'
import Incorrect from '@/assets/images/input_field-incorrect.svg'
import Verified from '@/assets/images/input_field-verified.svg'
import { responsiveDimension } from '@/utils'

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
  height: ${props => responsiveDimension(5)};
  width: ${props => responsiveDimension(5)};
`

const FieldDecoratorContainer = styled.div`
  position: absolute;
  top: ${props => responsiveDimension(0.7)};
  opacity: 1;
  right: ${props => responsiveDimension(-2.7)};
  width: ${props => responsiveDimension(5.5)};
  height: ${props => responsiveDimension(5.5)};
  display: flex;
  align-items: center;
  justify-content: center;
`
