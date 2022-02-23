import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'

export default class SwipingLineAnimation extends Component {
  render() {
    return (
      <Container>
        <SwipeLineRightBall />
        <SwipeLineRightAnim />
      </Container>
    )
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`

const SwipeLineRightBall = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  animation: ${props => swipeBall} 2s infinite;
  display: flex;
  align-items: center;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(3)};
    height: ${props => responsiveDimension(3)};
    border-radius: 50%;
    background-color: #ffffff;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
`

const SwipeLineRightAnim = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  &:after {
    content: '';
    display: inline-block;
    width: 5%;
    height: ${props => responsiveDimension(1)};
    background: linear-gradient(to right, transparent, white);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    animation: ${props => swipeLine} 2s infinite;
  }
`

const swipeBall = keyframes`
  0%{ transform: translateX(0%); }
  100%{ transform: translateX(100%); }
`

const swipeLine = keyframes`
  0%{ width: 5%; }
  100%{ width: 105%; }
`
