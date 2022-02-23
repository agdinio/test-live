import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { vhToPx, hex2rgb, evalImage, responsiveDimension } from '@/utils'

@observer
export default class AdvertisementIntro extends Component {
  constructor(props) {
    super(props)
  }

  sponsorLogo() {
    let ret = this.props.sponsorLogos.filter(
      o => o.componentName === 'GameMaster'
    )[0]
      ? evalImage(
          `sponsors/${
            this.props.sponsorLogos.filter(
              o => o.componentName === 'GameMaster'
            )[0].image
          }`
        )
      : null

    return ret
  }

  render() {
    let { question, sponsorLogo } = this.props

    return (
      <Container>
        <FadeInIntro center>
          <ImageWrapper>
            <PlayIcon backgroundColor={question.backgroundColor}>
              <Icon src={evalImage(question.ringImage)} />
            </PlayIcon>
            <Title>
              <Text>{question.title}</Text>
            </Title>
          </ImageWrapper>
          {/*
          <IconWrapper src={evalImage(sponsorLogo.imageBig)} size={sponsorLogo.imageBigSize}>
            <PlayIcon backgroundColor={question.backgroundColor}>
              <Icon src={evalImage(question.ringImage)} />
            </PlayIcon>
          </IconWrapper>
*/}
          {sponsorLogo && sponsorLogo.introImageBig ? (
            <SponsorWrapper>
              <SponsorText>brought to you by:</SponsorText>
              <Sponsor
                src={evalImage(sponsorLogo.introImageBig.img)}
                size={sponsorLogo.introImageBig.size}
              />
            </SponsorWrapper>
          ) : null}
        </FadeInIntro>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const FadeInIntro = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.4s ${fadeOutBottom} forwards`
      : `animation: 0.4s ${fadeInTop} forwards;animation-delay: ${
          props.delay ? 0.4 : 0
        }s`};
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
`

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
`

const IconWrapper__ = styled.div`
  width: ${props => responsiveDimension(props.size || 20)};
  height: ${props => responsiveDimension(props.size || 20)};
  //border-radius: 50%;
  //border: ${props => responsiveDimension(0.4)} solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin-bottom: ${props => responsiveDimension(1)};
`

const PlayIcon = styled.div`
  color: white;
  background-color: ${props => props.backgroundColor || '#000'};
  height: ${props => responsiveDimension(8)};
  width: ${props => responsiveDimension(8)};
  overflow: hidden;
  border-radius: 50%;
  //margin-bottom: ${props => vhToPx(5)};
  border: ${props => responsiveDimension(0.5)} solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  //transform: translateY(-60%);
`

const Icon = styled.img`
  width: inherit;
  height: inherit;
  transform: scale(0.8);
`

const Title = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2%;
`

const Text = styled.div`
  font-family: ${props => props.font || 'pamainextrabold'};
  font-size: ${props => responsiveDimension(props.size || 7)};
  color: white;
  text-transform: uppercase;
  line-height: 1;
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
  font-size: ${props => responsiveDimension(1.9)};
  color: #ffffff;
  line-height: 2;
`

const Sponsor = styled.img`
  height: ${props => responsiveDimension(props.size || 5)};
  margin-right: ${props => responsiveDimension(props.marginRight || 0)};
`

const fadeInTop = keyframes`
  0% {opacity:0;position: relative; top: -500px;}
  100% {opacity:1;position: relative; top: 0px; height:inherit;}
`

const fadeOutBottom = keyframes`
  0% {opacity:1; }
  99% {opacity: 0; height: inherit;}
  100% {opacity:0;height: 0px;}
`
