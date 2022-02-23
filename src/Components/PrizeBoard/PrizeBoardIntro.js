import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'

export default class PrizeBoardIntro extends Component {
  render() {
    return (
      <Container innerRef={this.props.reference}>
        <Wrapper>
          <TextWrapper>
            <Text font={'pamainlight'} size={5.5} color={'#ffffff'}>
              TOP&nbsp;
            </Text>
            <Text font={'pamainbold'} size={5.5} color={'#17c5ff'}>
              POINT
            </Text>
            <Text font={'pamainlight'} size={5.5} color={'#ffffff'}>
              &nbsp;EARNERS
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainbold'} size={7.5} color={'#ffffff'}>
              WIN LAVISH PRIZES
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainlight'} size={4.5} color={'#ffffff'}>
              AT THE&nbsp;
            </Text>
            <Text font={'pamainextrabold'} size={4.5} color={'#ec1c23'}>
              LIVE EVENTS
            </Text>
          </TextWrapper>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  //background: rgba(17,184,247,0.5);
`
const fadeIn = keyframes`
  0%{opacity:0;}
  100%{opacity:1;}
`
const Wrapper = styled.div`
  width: inherit;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(30%);
  opacity: 0;
  animation: ${props => slideUp} 0.5s forwards;
  animation-delay: 1s;
`
const slideUp = keyframes`
  0%{
    opacity: 0;
    transform: translateY(30%);
  }
  100%{
    opacity: 1;
    transform: translateY(0%);
  }
`

const TextWrapper = styled.div`
  line-height: 1;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
`
