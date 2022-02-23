import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, hex2rgb } from '@/utils'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'

@observer
export default class ResetDatabase extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <FadeIn>
            <TextWrapper style={{ marginBottom: vhToPx(3) }}>
              <Text font={'pamainbold'} size={6} spacing={0.1} uppercase>
                resetting
              </Text>
            </TextWrapper>
            <TextWrapper style={{ marginBottom: vhToPx(3) }}>
              <Text font={'pamainbold'} size={6} spacing={0.1} uppercase>
                database...
              </Text>
            </TextWrapper>
          </FadeIn>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: inherit;
  height: inherit;
`

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  border-top: ${props => vhToPx(0.5)} solid rgba(255, 255, 255, 0.2);

  opacity: 1;
  position: absolute;
`

const FadeIn = styled.div`
  animation: ${props => fadeIn} 0.4s forwards;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: center;
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1}
`

const fadeInTop = keyframes`
  0% {opacity:0;position: relative; top: ${vhToPx(-45)};}
  100% {opacity:1;position: relative; top: 0; height:inherit;}
`

const fadeOutBottom = keyframes`
  0% {opacity:1; }
  99% {opacity: 0; height: inherit;}
  100% {opacity:0;height: 0px;}
`

const TextWrapper = styled.div`
  line-height: 1;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: white;
  letter-spacing: ${props => props.spacing || 0};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)};
`

const Text2 = styled.span`
  font-family: ${props => props.font || 'pamainbold'};
  font-size: ${props => vhToPx(props.size || 3)};
  color: white;
  text-transform: uppercase;
  letter-spacing: ${props => vhToPx(0.1)};
`

const Section = styled.div`
  margin-top: ${props => vhToPx(1.5)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SponsorLogo = styled.img`
  height: ${props => vhToPx(6)};
`
