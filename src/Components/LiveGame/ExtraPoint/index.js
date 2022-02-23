import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import AbSlider from '@/Components/Slider/ABSlider'
import Multi from '@/Components/Slider/MultiSelectSlider'
import FeeCounter from '@/Components/FeeCounter'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, hex2rgb, evalImage, responsiveDimension } from '@/utils'

@inject(
  'ProfileStore',
  'UserStore',
  'PrePickStore',
  'LiveGameStore',
  'CommandHostStore'
)
@observer
export default class ExtraPointQuestion extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: 0,
      fadeInFeeCounter: false,
      isTimerExpired: false,
      isInsertedWhenTimeIsUp: false,
      check: undefined,
      localLockout: false,
    })

    this.interceptedRunningLength = false

    intercept(this, 'localLockout', change => {
      if (
        change.newValue &&
        'ExtraPointQuestion' ===
          this.props.CommandHostStore.currentPlay.componentName
      ) {
        this.MonitorPlayInProgress(change.newValue)
      }
      return change
    })

    intercept(this.props.CommandHostStore, 'lockout', change => {
      debugger
      if (
        change.newValue &&
        'ExtraPointQuestion' ===
          this.props.CommandHostStore.currentPlay.componentName
      ) {
        this.MonitorPlayInProgress(change.newValue)
      }
      return change
    })
  }

  componentDidMount() {
    this.countdown()

    setTimeout(() => {
      this.fadeInFeeCounter = true
    }, 2000)
  }

  componentDidUpdate_(nextProps) {
    if (
      !this.interceptedRunningLength &&
      this.props.LiveGameStore.runningLength <= 0
    ) {
      this.interceptedRunningLength = true
      clearInterval(this.check)
      this.props.LiveGameStore.inProgress = true
    }
  }

  countdown() {
    /*
    if (this.timer) {
      this.check = setInterval(() => {
        this.timer = this.timer - 1

        if (!this.timer) {
          //PERM
          //this.isTimerExpired = true
          //clearInterval(this.check)
          //this.timeIsUp()

          //TEMP -  if you changed the inProgress value to true, it will trigger MonitorPlayInProgress() function
          clearInterval(this.check)
          this.props.LiveGameStore.inProgress = true
        }
      }, 1000)
    }
*/
  }

  MonitorPlayInProgress(livegameInProgress) {
    debugger
    if (livegameInProgress) {
      if (!this.props.LiveGameStore.interceptedAnswer && !this.localLockout) {
        this.isInsertedWhenTimeIsUp = false
        setTimeout(() => {
          this.timeIsUp()
        }, 0)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.check)
    this.props.LiveGameStore.setInterceptedAnswer(false)
  }

  insertAnswerWhenTimeIsUp() {
    debugger
    if (!this.isInsertedWhenTimeIsUp) {
      this.isInsertedWhenTimeIsUp = true
      let { question, CommandHostStore } = this.props
      let ans = {
        type: question.type,
        id:
          this.props.PrePickStore.multiplier < 1
            ? question.id
            : CommandHostStore.currentPlay.id > 0
            ? CommandHostStore.currentPlay.id
            : question.id,
        sequence: question.sequence,
        answer: '',
        stars: question.stars,
        isStar: question.stars > 0 ? true : false,
        shortHand: question.shortHand,
        parentId: question.parentId,
        isPresetTeamChoice: question.isPresetTeamChoice,
      }

      this.props.PrePickStore.pushAnswerOnLivePlay(ans)
    }
  }

  timeIsUp() {
    debugger
    if (!this.isInsertedWhenTimeIsUp) {
      this.insertAnswerWhenTimeIsUp()
      if (this.props.LiveGameStore.currentPageId === this.props.question.id) {
        this.props.isTimeUp(true, {
          isTimerExpired: this.isTimerExpired,
          hideTimeout: this.props.question.hideTimeout,
        })
      }
    }
  }

  handleInterceptAnswer(response) {
    if (response) {
      this.interceptedRunningLength = true
      this.props.LiveGameStore.interceptedAnswer = true
      clearInterval(this.check)
      this.localLockout = true
    }
  }

  answered(answer) {
    clearInterval(this.check)
    this.props.splash()
    setTimeout(() => {
      answer.hideTimeout = this.props.question.hideTimeout
      this.props.answered(answer)
    }, 100)
  }

  render() {
    const { question, sponsorLogos } = this.props
    const Slider = question.choiceType === 'MULTI' ? Multi : AbSlider

    return (
      <Container color={question.backgroundColor}>
        <QuestionWrapper innerRef={ref => (this.QuestionWrapper = ref)}>
          <FadeIn>
            <QuestionContainer>
              <QuestionTitle>{question.playTitle}</QuestionTitle>
              {/*
              <HiddenTimer>
                ID:
                {question.id}
                &nbsp;&nbsp;&nbsp;
              </HiddenTimer>
*/}
              <HiddenTimer>
                ID:
                {question.id}
              </HiddenTimer>
            </QuestionContainer>
            <SliderContainer>
              <Slider
                currentPrePick={1}
                teams={this.props.teams}
                question={question}
                answered={this.answered.bind(this)}
                handlePicksPointsTokenNotification={() => {}}
                handleUpdateBackground={() => {}}
                groupComponent="LIVEGAME"
                feeCounterValue={this.props.LiveGameStore.feeCounterValue}
                handleLiveGameInterceptAnswer={this.handleInterceptAnswer.bind(
                  this
                )}
              />
            </SliderContainer>
            <BottomContainer>
              <BottomText>{question.title}</BottomText>
            </BottomContainer>
          </FadeIn>
        </QuestionWrapper>
      </Container>
    )
  }
}

const SliderContainer = styled.div`
  width: inherit;
`

const BottomContainer = styled.div`
  width: inherit;
  height: 50%;
  display: flex;
  justify-content: center;
  padding-top: 14%;
`

const BottomText = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(6)};
  color: #ffffff;
  text-transform: uppercase;
`

const LowerSection = styled.div`
  //flex-direction: row;
  //justify-content: space-between;
  justify-content: center;
  width: 100%;
  display: flex;
  align-items: center;
`

const LowerLeft = styled.div`
  flex-direction: column;
  display: flex;
  color: white;
  font-family: pamainregular;
  width: 50%;
  line-height: 1;
`

const PlaceYour = styled.span`
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.8)};
  font-size: ${props => responsiveDimension(3.1)};
`
const TokenFee = styled.span`
  text-transform: uppercase;
  font-size: ${props => responsiveDimension(5.6)};
`

const Minimum = styled.span`
  text-transform: lowercase;
  font-size: ${props => responsiveDimension(3.1)};
  letter-spacing: ${props => responsiveDimension(0.5)};
`

const LowerRight = styled.div`
  width: 45%;
`

const Text = styled.div`
  font-size: ${props => responsiveDimension(7)};
  line-height: 1;
`

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props =>
    props.color ? hex2rgb(props.color, 0.8) : hex2rgb('#c61818', 0.8)};
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
`

const IntroWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`

const QuestionWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const PlayIcon = styled.div`
  color: white;
  background-color: #19d1bf;
  height: ${props => vhToPx(8)};
  width: ${props => vhToPx(8)};
  overflow: hidden;
  border-radius: 100%;
  margin-bottom: ${props => vhToPx(2.5)};
  border: ${props => vhToPx(0.5)} solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Icon = styled.img`
  width: inherit;
  height: inherit;
  transform: scale(0.8);
`

const Title = styled.div`
  color: white;
  font-family: 'pamainextrabold';
  font-weight: normal;
  text-transform: uppercase;
  text-align: center;
`

const QuestionContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: inherit;
  margin-top: 5%;
  margin-bottom: 5%;
`
const QuestionTitle = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4.3)};
  text-transform: uppercase;
`

const QuestionSponsorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const QuestionText = styled.span`
  font-family: pamainregular;
  font-size: ${props => vhToPx(4)};
  text-transform: uppercase;
  color: #ffffff;
  width: auto;
  max-width: ${props => props.maxWidth || 'auto'}%;
  line-height: 1;
`
const PACircleWrapper = styled.div``

const FadeInIntro = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.5s ${fadeOutBottom} forwards`
      : `animation: 0.75s ${fadeInTop} forwards;animation-delay: ${
          props.delay ? 0.5 : 0
        }s`};
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
`

const FadeIn = styled.div`
  padding: 5% 4.5% 5% 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  animation: ${props => fadeInTop} 0.4s forwards;
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

const Sponsor = styled.img`
  height: ${props => vhToPx(props.height || 5)};
  margin-right: ${props => vhToPx(props.marginRight || 0)};
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

const PlayWrapper = styled.div`
  width: 55%;
  height: ${props => vhToPx(10)};
  border-radius: ${props => vhToPx(10)};
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
`

const PlayContent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
`

const PrizeImage = styled.div`
  width: ${props => vhToPx(10)};
  height: ${props => vhToPx(10)};
  position: absolute;
  border-radius: ${props => vhToPx(10)};
  background: #c0c0c0;
  border: ${props => vhToPx(0.3)} solid #c0c0c0;

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
`

const DescWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-left: 33%;
`

const Descs = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

const PlayPoints = styled.span`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: pamainextrabold;
  color: #ffb600;
  font-size: ${props => vhToPx(3.7)};
  text-transform: uppercase;
  padding-right: ${props => (props.points > 0 ? vhToPx(1) : 0)};
`

const MainDesc = styled.span`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: pamainlight;
  color: #ffffff;
  font-size: ${props => vhToPx(3.9)};
  text-transform: uppercase;
  line-height: ${props => vhToPx(3)};
`

const DetailDesc = styled.div`
  width: 100%;
  display: flex;
  font-family: pamainbold;
  font-size: ${props => vhToPx(2.9)};
  color: #c0c0c0;
  text-transform: uppercase;
`

const HiddenTimer = styled.div`
  position: absolute;
  left: 5%;
  bottom: 5%;
  //display: none;
`
