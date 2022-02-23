import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import { PACircle } from '@/Components/PACircle'
import AbSlider from '@/Components/Slider/ABSlider'
import Multi from '@/Components/Slider/MultiSelectSlider'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import TokenIcon from '@/assets/images/playalong-token.svg'
import {
  vhToPx,
  hex2rgb,
  evalImage,
  toFootage,
  responsiveDimension,
} from '@/utils'
import SponsorIntro from './SponsorIntro'

@inject('PrePickStore', 'LiveGameStore', 'CommandHostStore')
@observer
export default class SponsorQuestion extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: this.props.question.length,
      isTimerExpired: false,
      isInsertedWhenTimeIsUp: false,
      localLockout: false,
    })

    this.disposeLocalLockout = intercept(this, 'localLockout', change => {
      if (
        change.newValue &&
        'SponsorQuestion' ===
          this.props.CommandHostStore.currentPlay.componentName
      ) {
        this.MonitorPlayInProgress(change.newValue)
      }
      return change
    })

    this.disposeLockout = intercept(
      this.props.CommandHostStore,
      'lockout',
      change => {
        if (
          change.newValue &&
          'SponsorQuestion' ===
            this.props.CommandHostStore.currentPlay.componentName
        ) {
          this.MonitorPlayInProgress(change.newValue)
        }
        return change
      }
    )

    this.disposeIsPending = intercept(
      this.props.CommandHostStore,
      'isPending',
      change => {
        if (
          change.newValue &&
          'SponsorQuestion' ===
            this.props.CommandHostStore.currentPlay.componentName &&
          change.newValue.id === this.props.question.id
        ) {
          this.insertAnswerWhenTimeIsUp()
        }
        return change
      }
    )

    this.disposeForcePushEmptyAnswer = intercept(
      this.props.CommandHostStore,
      'forcePushEmptyAnswer',
      change => {
        if (
          change.newValue &&
          'SponsorQuestion' ===
            this.props.CommandHostStore.currentPlay.componentName &&
          change.newValue === this.props.question.id
        ) {
          this.insertAnswerWhenTimeIsUp()
        }
        return change
      }
    )
  }

  componentDidUpdate__(nextProps) {
    if (
      !this.interceptedRunningLength &&
      this.props.LiveGameStore.runningLength <= 0
    ) {
      this.interceptedRunningLength = true
      clearInterval(this.check)
      this.props.LiveGameStore.inProgress = true
    }
  }

  componentDidMount() {
    let questionwrapper = document.getElementById('questionwrapper')
    TweenMax.to(this.IntroWrapper, 0.5, {
      opacity: 0,
      delay: 2,
      onStart: () => {
        TweenMax.to(questionwrapper, 0.5, {
          opacity: 1,
        })
      },
      onComplete: () => {
        this.countdown()
      },
    })
  }

  countdown() {
    if (this.timer) {
      this.check = setInterval(() => {
        this.timer = this.timer - 1

        if (!this.timer) {
          clearInterval(this.check)
          this.props.CommandHostStore.setLockout(true)
        }
      }, 1000)
    }
  }

  MonitorPlayInProgress(livegameInProgress) {
    if (livegameInProgress) {
      clearInterval(this.check)

      if (!this.props.LiveGameStore.interceptedAnswer) {
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

    this.disposeLocalLockout()
    this.disposeLockout()
    this.disposeIsPending()
    this.disposeForcePushEmptyAnswer()
  }

  insertAnswerWhenTimeIsUp() {
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
        started: question.started,
        isPresetTeamChoice: question.isPresetTeamChoice,
      }

      this.props.PrePickStore.pushAnswerOnLivePlay(ans)
    }
  }

  timeIsUp() {
    if (!this.isInsertedWhenTimeIsUp) {
      this.insertAnswerWhenTimeIsUp()
      if (this.props.LiveGameStore.currentPageId === this.props.question.id) {
        let lockoutText = {
          header: 'time is up',
          detail: 'next play begins',
        }
        this.props.isTimeUp(true, {
          isTimerExpired: this.isTimerExpired,
          //nextPlay: true,
          lockoutText,
          hideTimeout: this.props.question.hideTimeout || false,
        })
      }
    }
  }

  handleInterceptAnswer(response) {
    if (response) {
      this.props.LiveGameStore.interceptedAnswer = true
      clearInterval(this.check)
    }
  }

  answered(answer) {
    clearInterval(this.check)
    this.props.splash()
    setTimeout(() => {
      //answer.nextPlay = true
      answer.hideTimeout = this.props.question.hideTimeout
      this.props.answered(answer)
    }, 100)
  }

  render() {
    const { question, sponsorLogo } = this.props
    const Slider = question.choiceType === 'MULTI' ? Multi : AbSlider

    return (
      <Container color={question.backgroundColor}>
        <IntroWrapper innerRef={ref => (this.IntroWrapper = ref)}>
          <SponsorIntro question={question} sponsorLogo={sponsorLogo} />
        </IntroWrapper>

        <QuestionWrapper
          disabled={true}
          innerRef={ref => (this.QuestionWrapper = ref)}
          id="questionwrapper"
        >
          <FadeIn>
            <QuestionContainer>
              <HiddenTimer>
                ID:
                {question.id}
                &nbsp;&nbsp;&nbsp;
              </HiddenTimer>
              <QuestionSponsorWrapper>
                {sponsorLogo && sponsorLogo.image ? (
                  <Sponsor
                    src={evalImage(sponsorLogo.image)}
                    height={4}
                    marginRight={1}
                  />
                ) : null}
                <QuestionText maxWidth={60}>{question.playTitle}</QuestionText>
              </QuestionSponsorWrapper>
              <PACircleWrapper>
                {this.timer ? (
                  <PACircle value={true}>{this.timer}s</PACircle>
                ) : null}
              </PACircleWrapper>
            </QuestionContainer>
            <SliderWrapper>
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
            </SliderWrapper>
            <LowerSection>
              <PointsPlayWrapper>
                <PointsPlayBackground backgroundColor={question.ringColor} />
                <PointsPlayValues>
                  <TokenText>{question.tokens || 0}</TokenText>
                  <TokenWrapper>
                    <Token src={TokenIcon} size={2.5} index={3} />
                    <Faded index={2} size={2.5} color={'#6d6c71'} left={-2.2} />
                    <Faded index={1} size={2.5} color={'#33342f'} left={-2.2} />
                  </TokenWrapper>
                  <PointsText>{question.points || 0}</PointsText>
                  <PointsLabel>pts</PointsLabel>
                  <PointsPlayDesc>this play</PointsPlayDesc>
                </PointsPlayValues>
              </PointsPlayWrapper>
            </LowerSection>
          </FadeIn>
        </QuestionWrapper>
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
  opacity: 0;
`

const Sponsor = styled.img`
  height: ${props => responsiveDimension(props.height || 5)};
  margin-right: ${props => responsiveDimension(props.marginRight || 0)};
`

const QuestionContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: inherit;
`

const QuestionSponsorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const QuestionText = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4)};
  text-transform: uppercase;
  color: #ffffff;
  width: auto;
  max-width: ${props => props.maxWidth || 'auto'}%;
  line-height: 1;
`
const PACircleWrapper = styled.div``

const SliderWrapper = styled.div`
  width: inherit;
`

const LowerSection = styled.div`
  width: inherit;
  display: flex;
  justify-content: center;
`

const PointsPlayWrapper = styled.div`
  width: 70%;
  height: ${props => responsiveDimension(7)};
  border-radius: ${props => responsiveDimension(7)};
  position: relative;
  overflow: hidden;
`

const PointsPlayBackground = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  background-color: ${props => props.backgroundColor};
  opacity: 0.3;
`

const PointsPlayValues = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const PointsPlayValues_ = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`
const PointsText = styled.span`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: pamainextrabold;
  color: #ffb600;
  color: ${props => props.color || '#ffffff'};
  font-size: ${props => responsiveDimension(3.7)};
  text-transform: uppercase;
  margin-left: ${props => responsiveDimension(1)};
`
const PointsLabel = styled.span`
  font-family: pamainregular;
  color: #16c5ff;
  font-size: ${props => responsiveDimension(2.5)};
  text-transform: uppercase;
  padding-top: ${props => vhToPx(0.8)};
`
const PointsPlayDesc = styled.span`
  //height: 100%;
  //display: flex;
  //justify-content: center;
  //align-items: center;
  font-family: pamainregular;
  color: #ffffff;
  font-size: ${props => responsiveDimension(3.7)};
  text-transform: uppercase;
  margin-left: ${props => responsiveDimension(2)};
  line-height: 0.9;
`

const FadeIn = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.4s ${fadeOutBottom} forwards;`
      : `animation: 0.4s ${fadeInTop} forwards;animation-delay: ${
          props.delay ? 0.4 : 0
        }s;`} padding: 5% 4.5% 5% 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
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

const HiddenTimer = styled.div`
  position: absolute;
  left: 5%;
  bottom: 5%;
  display: none;
`

const TokenText = styled.span`
  height: 100%;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.7)};
  color: #ffb600;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => responsiveDimension(0.5)};
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 1;
`

const TokenWrapper = styled.div`
  height: 100%;
  margin-right: ${props => vhToPx(0.5)};
  margin-bottom: ${props => vhToPx(0.4)};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Token = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props =>
    props.adjustWidth
      ? responsiveDimension(props.size + 0.1)
      : responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
`

const Faded = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left)};
  z-index: ${props => props.index};
`
