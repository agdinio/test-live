import React, { Component } from 'react'
import styled from 'styled-components'
import ActivityIndicator from '@/Components/Common/ActivityIndicator'
import {
  IsMobile,
  IsTablet,
  vwToPx,
  maxWidth,
  maxHeight,
  responsiveDimension,
} from '@/utils'

export default class ActivityLoader extends Component {
  render() {
    return (
      <Container backgroundColor={this.props.backgroundColor || 'transparent'}>
        <ActivityIndicator height={7} color={this.props.color || '#ffffff'} />
        <Message color={this.props.color || '#ffffff'}>
          {this.props.message}
        </Message>
      </Container>
    )
  }
}

const Container = styled.div`
  width: ${props => (IsMobile || IsTablet ? vwToPx(100) : maxWidth)};
  height: ${props => maxHeight}
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.backgroundColor};
  position: absolute;
  z-index: 300;
`

const Message = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.8)};
  color: ${props => props.color};
  line-height: 1;
  text-transform: uppercase;
`
