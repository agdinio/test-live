import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'

@inject('CommandHostStore')
@observer
export default class Pending extends Component {
  constructor(props) {
    super(props)

    this.disposeCurrentPlay = intercept(
      this.props.CommandHostStore,
      'currentPlay',
      change => {
        this.props.isTimeUp(true, { playAdDone: true })
        return change
      }
    )
  }

  componentWillUnmount() {
    this.disposeCurrentPlay()
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <FadeIn>
            <TextWrapper style={{ marginBottom: vhToPx(3) }}>
              <Text font={'pamainbold'} size={5} spacing={0.1} uppercase>
                pending results
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainregular'} size={5} spacing={0.1} uppercase>
                get ready
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainlight'} size={5.5} spacing={0.1} uppercase>
                for the next play
              </Text>
            </TextWrapper>
            <Section>
              <Text font={'pamainlight'} size={2} spacing={0.1}>
                brought to you by
              </Text>
              <SponsorLogo src={sportocoLogo} />
            </Section>
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
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);

  opacity: 1;
  position: absolute;
`

const FadeIn = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.4s ${fadeOutBottom} forwards;`
      : `animation: 0.4s ${fadeInTop} forwards;
      animation-delay: ${props.delay ? 0.4 : 0}s;
      `} padding: 5% 4.5% 5% 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: center;
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
  font-size: ${props => responsiveDimension(props.size)};
  color: white;
  letter-spacing: ${props => props.spacing || 0};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)};
`

const Text2 = styled.span`
  font-family: ${props => props.font || 'pamainbold'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: white;
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const Section = styled.div`
  margin-top: ${props => vhToPx(1.5)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const SponsorLogo = styled.img`
  height: ${props => responsiveDimension(6)};
`
