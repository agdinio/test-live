import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, hex2rgb } from '@/utils'
import { evalImage, responsiveDimension } from '@/utils'

@observer
export default class MultiplyPoints extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.isTimeUp(true, { nextId: this.props.nextId })
    }, 1500)
  }

  render() {
    let { sponsorLogo } = this.props
    return (
      <Container>
        <FadeIn>
          <Text>multiply</Text>
          <Text>your points</Text>
          {sponsorLogo && sponsorLogo.multiplierImageBig ? (
            sponsorLogo.multiplierImageBigIsPosBottom ? (
              <SponsorImageBigBottomWrapper>
                <SponsorImageBigBottom>
                  <SponsorImageBig
                    src={evalImage(sponsorLogo.multiplierImageBig)}
                    size={sponsorLogo.multiplierImageBigSize}
                  />
                </SponsorImageBigBottom>
              </SponsorImageBigBottomWrapper>
            ) : (
              <SponsorWrapper>
                <SponsorText>brought to you by:</SponsorText>
                <SponsorImageBig
                  src={evalImage(sponsorLogo.multiplierImageBig)}
                  size={sponsorLogo.multiplierImageBigSize}
                />
                <SponsorImageSmall
                  src={evalImage(sponsorLogo.multiplierImageSmall)}
                />
              </SponsorWrapper>
            )
          ) : null}
        </FadeIn>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
  background-color: ${props => hex2rgb('#c61818', 0.8)};
`

const Text = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(9)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1;
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${props =>
    props.fadeOut
      ? `animation: 0.3s ${fadeOutBottom} forwards;`
      : `animation: 0.3s ${fadeInTop} forwards;
      animation-delay: ${props.delay ? 0.3 : 0}s;
      `};
`

const SponsorWrapper = styled.div`
  width: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SponsorText = styled.span`
  font-family: pamainregular;
  text-transform: uppercase;
  font-size: ${props => vhToPx(1.9)};
  color: #ffffff;
  line-height: 2;
`

const SponsorImageBigBottomWrapper = styled.div`
  width: 100%;
  margin-top: ${props => vhToPx(10)};
`

const SponsorImageBigBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
`

const SponsorImageBig = styled.img`
  height: ${props => responsiveDimension(props.size || 5)};
`

const SponsorImageSmall = styled.img`
  height: ${props => responsiveDimension(2.5)};
  margin-top: ${props => vhToPx(1)};
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
