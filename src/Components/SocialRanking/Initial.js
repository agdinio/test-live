import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { PaCircle } from '@/Components/IntroScreen'
import Arrow from '@/assets/images/icon-arrow-grey.svg'
import { vhToPx } from '@/utils'

export default class Initial extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container hasLoaded={!this.props.isLoading}>
        <Wrapper>
          <Top>
            <PaCircle />
          </Top>
          <Middle>
            <TextWrapper>
              <Text color={'#ffffff'} font={'pamainlight'} size={6} uppercase>
                your&nbsp;
              </Text>
              <Text
                color={'#18c5ff'}
                font={'pamainextrabold'}
                size={6}
                uppercase
              >
                social ranking
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text
                color={'#ffffff'}
                font={'pamainregular'}
                size={7.5}
                uppercase
              >
                this game
              </Text>
            </TextWrapper>
          </Middle>
          <Bottom>
            <TextWrapper lineHeight={2}>
              <Text
                color={'#ffffff'}
                font={'pamainregular'}
                size={3.5}
                uppercase
              >
                see how well you did
              </Text>
            </TextWrapper>
            <TextWrapper lineHeight={2}>
              <Text
                color={'#ffffff'}
                font={'pamainregular'}
                size={3.5}
                uppercase
              >
                against your friends
              </Text>
            </TextWrapper>
          </Bottom>
        </Wrapper>
      </Container>
    )
  }
}

const slideLeft = keyframes`
  0%{
    opacity: 1;
    transform: translateX(100%);
  }
  100%{
    opacity: 1;
    transform: translateX(0);
  }
`
const fadeOut = keyframes`
  0%{
    opacity: 1;
    transform: translateY(0);
  }
  100%{
    opacity: 1;
    transform: translateY(-150%);
  }
`

const Container = styled.div`
  width: 100%;
  //height: -webkit-fill-available;
  height: 100%;
  display: flex;
  //--align-items: center;
  animation: ${props => `${slideLeft} 0.5s forwards`}
    ${props =>
      props.hasLoaded
        ? `,${fadeOut} 1.5s forwards cubic-bezier(0.77, 0, 0.175, 1)`
        : ''};

  margin-top: 10%;
  position: absolute;
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  width: 100%;
  padding: ${props => vhToPx(1)} 0 ${props => vhToPx(1)} 0;
  display: flex;
  justify-content: center;
`
const Middle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(2)};
`
const Bottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(10)};
`

const TextWrapper = styled.div`
  text-align: center;
  line-height: ${props => props.lineHeight || 1};
`

const Text = styled.span`
  font-family: ${props => props.font || `pamainregular`};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color};
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'lowercase')};
  line-height: ${props => props.lineHeight || 1.05};
`

const ArrowUp = styled.img`
  transform: rotate(-90deg);
  margin-bottom: ${props => vhToPx(1)};
`
