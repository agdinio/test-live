import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { PACircle } from '@/Components/PACircle'
import PA from '@/assets/images/pa-icon-white.svg'
import PrizeChestIcon from '@/assets/images/menu-prize_chest-icon.svg'
import styled, { keyframes } from 'styled-components'
import {
  vhToPx,
  hex2rgb,
  evalImage,
  toTime,
  responsiveDimension,
} from '@/utils'

@observer
export default class PlayInProgress extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      //timer: this.props.timer,
      timer: 0,
      check: null,
      messages: {
        top: 'PLAY IN PROGRESS',
        bottom: 'WAITING FOR RESULTS',
      },
      footage: null,
    })
  }

  componentDidMount() {
    debugger
    //this.countdown()
  }

  countdown() {
    debugger
    if (this.props.videoFootage) {
      let m = 0
      let s = 0
      let footageSplit = this.props.videoFootage.split(':')
      if (footageSplit && footageSplit.length === 2) {
        m = parseInt(footageSplit[0]) * 60
        s = parseInt(footageSplit[1])
      }
      this.timer = m + s + 1

      this.check = setInterval(() => {
        this.footage = Footage(this.timer++)

        let splitFootage = this.footage.split(':')
        let numFootage =
          parseInt(splitFootage[0]) * 60 + parseInt(splitFootage[1])

        let splitInFootage = this.props.inProgressFootage.split(':')
        let numInFootage =
          parseInt(splitInFootage[0]) * 60 + parseInt(splitInFootage[1])

        if (numFootage >= numInFootage) {
          clearInterval(this.check)
          this.timeIsUp()
        }

        // if (this.footage === this.props.inProgressFootage) {
        //   clearInterval(this.check)
        //   this.timeIsUp()
        // }
      }, 1000)
    }

    /*
    if (this.timer) {
      this.check = setInterval(() => {
        if (this.timer) {
          this.timer = this.timer - 1

          if (!this.timer) {
            clearInterval(this.check)
            this.timeIsUp()
          }
        }
      }, 1000)
    }
*/
  }

  componentWillUnmount() {
    clearInterval(this.check)
  }

  timeIsUp() {
    this.props.setPlayHasStarted(false)
    //this.props.isTimeUp(true)
  }

  render() {
    let { question, sponsorLogo } = this.props

    if (sponsorLogo.inProgressImageVideo) {
      return (
        <SponsorInProgress
          sponsorLogo={sponsorLogo}
          bgColor={this.props.bgColor}
          messages={this.messages}
          footage={this.footage}
        />
      )
    } else {
      return (
        <DefaultInProgress
          sponsorLogo={sponsorLogo}
          bgColor={this.props.bgColor}
          messages={this.messages}
          footage={this.footage}
        />
      )
    }

    /*
        switch (question.type) {
          case 'Sponsor':
            return (
              <SponsorInProgress
                sponsorLogo={sponsorLogo}
                bgColor={this.props.bgColor}
                messages={this.messages}
                footage={this.footage}
              />
            )
          default:
            return (
              <DefaultInProgress
                sponsorLogo={sponsorLogo}
                bgColor={this.props.bgColor}
                messages={this.messages}
                footage={this.footage}
              />
            )
        }
    */
  }
}

let Footage = t => {
  let mins = t / 60
  let mods = t % 60

  if (Math.floor(mins) > 0) {
    return Math.floor(mins) + ':' + mods
  } else {
    return '0:' + mods
  }
}

const PAWrapper = styled.div``
const PAIcon = styled.img``

const PlayInProgressContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props => hex2rgb(props.bgColor || '#c61818', 0.8)};
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Text = styled.div`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: #ffffff;
  line-height: 1;
  padding-top: ${props => vhToPx(props.paddingTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom) || 0};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')}
  letter-spacing: ${props => responsiveDimension(props.letterSpacing || 0)};
`

const FadeIn = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.3s ${fadeOutBottom} forwards;`
      : `animation: 0.3s ${fadeInTop} forwards;
      animation-delay: ${props.delay ? 0.3 : 0}s;
      `} padding: 0 4.5% 0 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
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

const SponsorImageBig = styled.img`
  height: ${props => responsiveDimension(props.size || 5)};
`
const SponsorImageSmall = styled.img`
  margin-top: ${props => vhToPx(1)};
  height: ${props => responsiveDimension(2.5)};
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

const SponsorTopWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const HiddenTimer = styled.div`
  position: absolute;
  left: 5%;
  bottom: 5%;
  display: none;
`

const VideoWrapper = styled.div`
  width: ${props => responsiveDimension(44)};
  height: ${props => responsiveDimension(24)};
  //display: flex;
  //justify-content: flex-end;
  //position: relative;
  margin-top: ${props => vhToPx(1.5)};
  margin-bottom: ${props => vhToPx(1.5)};
`

const VideoArea = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center
  //position: relative;
  display: flex;
  justify-content: flex-end;
`
const VideoSponsorWrapper = styled.div`
  width: 70%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-30%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const VideoSponsor = styled.img`
  height: ${props => responsiveDimension(props.size || 5)};
  margin-bottom: ${props => vhToPx(1)};
`

const VideoShapes = styled.div`
  position: relative;
  width: 75%;
`
const VideoShapeTop = styled.div`
  width: 100%;
  border-left: ${props => responsiveDimension(19)} solid transparent;
  border-top: ${props => responsiveDimension(24)} solid #212121;
  position: absolute;
`
const VideoShapeBottom = styled.div`
  width: 100%;
  border-left: ${props => responsiveDimension(19)} solid transparent;
  border-bottom: ${props => responsiveDimension(24)} solid #212121;
  position: absolute;
`

const BottomSponsorWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PCIcon = styled.div`
  width: ${props => responsiveDimension(3.7)};
  height: ${props => responsiveDimension(3.7)};
  border-radius: ${props => responsiveDimension(3.7)};
  background-color: #ffffff;
  margin-left: ${props => responsiveDimension(1)};
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    width: ${props => responsiveDimension(2.5)};
    height: ${props => responsiveDimension(2.5)};
    margin-top: ${props => vhToPx(0.1)};
    background-color: black;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 100%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 100%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const VideoSponsorWrapperNoPlayCover = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: ${props => vhToPx(1)};
  ${props =>
    props.isGradient
      ? 'background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));'
      : ''};
`

/********************************** In Progress Panels *******************************************/

const SponsorInProgress = props => {
  return (
    <PlayInProgressContainer bgColor={props.bgColor}>
      <FadeIn center>
        <SponsorTopWrapper>
          <PAWrapper>
            <PACircle size={7} />
          </PAWrapper>
          <div style={{ marginLeft: '3%' }}>
            <Text font={'pamainlight'} size={5.5} paddingTop={2}>
              {props.messages.top}
            </Text>
          </div>
        </SponsorTopWrapper>

        <VideoWrapper>
          <VideoArea src={evalImage(props.sponsorLogo.inProgressImageVideo)}>
            {props.sponsorLogo.inProgressImageWithPlayCover ? (
              <VideoShapes>
                <VideoShapeTop />
                <VideoShapeBottom />
                <VideoSponsorWrapper>
                  <VideoSponsor
                    src={evalImage(props.sponsorLogo.inProgressImageBig)}
                    size={props.sponsorLogo.inProgressImageBigSize}
                  />
                  <Text
                    font={'pamainlight'}
                    size={2.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    {props.sponsorLogo.inProgressImageText}
                  </Text>
                </VideoSponsorWrapper>
              </VideoShapes>
            ) : (
              <VideoSponsorWrapperNoPlayCover
                isGradient={props.sponsorLogo.inProgressImageVideoIsGradient}
              >
                <VideoSponsor
                  src={evalImage(props.sponsorLogo.inProgressImageBig)}
                  size={props.sponsorLogo.inProgressImageBigSize}
                />
                <Text
                  font={'pamainlight'}
                  size={2.3}
                  color={'#ffffff'}
                  uppercase
                >
                  {props.sponsorLogo.inProgressImageText}
                </Text>
              </VideoSponsorWrapperNoPlayCover>
            )}
          </VideoArea>
        </VideoWrapper>

        <BottomSponsorWrapper>
          <Text
            font={'pamainregular'}
            size={3.5}
            color={'#ffffff'}
            letterSpacing={0.1}
            uppercase
          >
            {props.sponsorLogo.inProgressTextBelow[0].value}
          </Text>
          <TextWrapper>
            <Text
              font={'pamainregular'}
              size={2.5}
              color={'#ffffff'}
              letterSpacing={0.1}
              uppercase
            >
              {props.sponsorLogo.inProgressTextBelow[1].value}
            </Text>
            {props.sponsorLogo.inProgressTextBelow[1].showIcon ? (
              <PCIcon src={PrizeChestIcon} />
            ) : null}
          </TextWrapper>
        </BottomSponsorWrapper>
      </FadeIn>
      <HiddenTimer>{props.footage}</HiddenTimer>
    </PlayInProgressContainer>
  )
}

const DefaultInProgress = props => {
  return (
    <PlayInProgressContainer bgColor={props.bgColor} disabled={true}>
      <FadeIn center>
        <PAWrapper>
          <PACircle size={9} />
        </PAWrapper>
        <Text font={'pamainlight'} size={8} paddingTop={2}>
          {props.messages.top}
        </Text>
        <Text font={'pamainregular'} size={5} marginBottom={1}>
          {props.messages.bottom}
        </Text>
        {props.sponsorLogo && props.sponsorLogo.inProgressImageBig ? (
          <SponsorWrapper>
            <SponsorText>brought to you by:</SponsorText>
            <SponsorImageBig
              src={evalImage(props.sponsorLogo.inProgressImageBig)}
              size={props.sponsorLogo.inProgressImageBigSize}
            />
            <SponsorImageSmall
              src={evalImage(props.sponsorLogo.inProgressImageSmall)}
            />
          </SponsorWrapper>
        ) : null}
      </FadeIn>
      <HiddenTimer>{props.footage}</HiddenTimer>
    </PlayInProgressContainer>
  )
}
