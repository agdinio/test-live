import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { PACircle } from '@/Components/PACircle'
import { vhToPx } from '@/utils'

export default class Gathering extends Component {
  render() {
    return (
      <Container hasLoaded={!this.props.isLoading}>
        <Content>
          <ContentPA>
            <PACircle size={9} />
          </ContentPA>
          <TextWrapper>
            <Text font={'pamainregular'} size={5} uppercase>
              Gathering Results
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainlight'} size={10} uppercase>
              Post-Game Bonuses
            </Text>
          </TextWrapper>
        </Content>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  animation: ${props => slideLeft} 0.5s forwards
    ${props => (props.hasLoaded ? `, ${slideUp} 1s forwards` : ``)};
  position: absolute;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const slideLeft = keyframes`
  0%{
    transform: translateX(100%);
  }
  100%{
    transform: translateX(0%);  
  }
`
const slideUp = keyframes`
  0%{
    transform: translateY(0%);
  }
  100%{
    transform: translateY(-100%);  
  }
`

const ContentPA = styled.div`
  margin-top: ${props => vhToPx(10)};
  margin-bottom: ${props => vhToPx(4)};
  display: flex;
`

const TextWrapper = styled.div`
  display: flex;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  line-height: 1.1;
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)};
`

const Footer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  background: green;
`
