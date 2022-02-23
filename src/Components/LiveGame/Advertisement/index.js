import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import { PACircle } from '@/Components/PACircle'
import AbSlider from '@/Components/Slider/ABSlider'
import Multi from '@/Components/Slider/MultiSelectSlider'
import FeeCounter from '@/Components/FeeCounter'
import TextCard from '@/Components/LiveGame/Common/TextCard'
import AdvertisementIntro from './AdvertisementIntro'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import {
  vhToPx,
  hex2rgb,
  evalImage,
  toFootage,
  responsiveDimension,
} from '@/utils'

@inject(
  'ProfileStore',
  'UserStore',
  'PrePickStore',
  'LiveGameStore',
  'CommandHostStore'
)
@observer
export default class AdvertisementQuestion extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: this.props.question.length,
      fadeInFeeCounter: false,
      isTimerExpired: false,
      isInsertedWhenTimeIsUp: false,
      check: undefined,
      showTextCard: false,
      localLockout: false,
    })

    this.disposeLocalLockout = intercept(this, 'localLockout', change => {
      if (
        change.newValue &&
        'AdvertisementQuestion' ===
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
        debugger
        if (
          change.newValue &&
          'AdvertisementQuestion' ===
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
          'AdvertisementQuestion' ===
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
          'AdvertisementQuestion' ===
            this.props.CommandHostStore.currentPlay.componentName &&
          change.newValue === this.props.question.id
        ) {
          this.insertAnswerWhenTimeIsUp()
        }
        return change
      }
    )
  }

  handleFeeCounterValue(response) {
    this.props.LiveGameStore.setFeeCounterValue(response)
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
        setTimeout(() => {
          this.fadeInFeeCounter = true
        }, 2000)
      },
    })
  }

  countdown() {
    debugger
    if (this.timer) {
      this.check = setInterval(() => {
        this.timer = this.timer - 1

        if (!this.timer) {
          this.props.CommandHostStore.setLockout(true)
        }
      }, 1000)
    }
  }

  showTextCardMessages() {
    debugger
    if (this.props.msg && this.props.msg.textCards.length > 0) {
      TweenMax.to(this.AdvContainer, 0.3, {
        opacity: 0,
        onComplete: () => {
          this.showTextCard = true
        },
      })
    }
  }

  MonitorPlayInProgress(livegameInProgress) {
    debugger
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
    debugger
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
      answer.hideTimeout = this.props.question.hideTimeout
      this.props.answered(answer)
    }, 100)
  }

  render() {
    debugger
    const { question, sponsorLogo, msg } = this.props
    const Slider = question.choiceType === 'MULTI' ? Multi : AbSlider

    return (
      <Container>
        <AdvContainer
          color={question.backgroundColor}
          innerRef={ref => (this.AdvContainer = ref)}
        >
          <IntroWrapper innerRef={ref => (this.IntroWrapper = ref)}>
            <AdvertisementIntro question={question} sponsorLogo={sponsorLogo} />
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
                      size={sponsorLogo.imageSize}
                      marginRight={1}
                    />
                  ) : null}
                  <QuestionText maxWidth={75}>
                    {question.playTitle}
                  </QuestionText>
                </QuestionSponsorWrapper>
                <PACircleWrapper>
                  {this.timer ? (
                    <PACircle value={true}>{this.timer}s</PACircle>
                  ) : null}
                </PACircleWrapper>
              </QuestionContainer>
              <div style={{ width: 'inherit' }}>
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
              </div>
              <LowerSection>
                <PlayWrapper>
                  <PlayContent>
                    <SponsorLogo
                      src={sponsorLogo ? evalImage(sponsorLogo.imageBig) : null}
                      size={sponsorLogo ? sponsorLogo.imageBigSize : null}
                    />
                    <DescWrapper>
                      <Descs>
                        <PlayPoints points={question.prizePoints}>
                          {question.prizePoints > 0 ? question.prizePoints : ''}
                        </PlayPoints>
                        <MainDesc points={question.prizePoints} />
                      </Descs>
                      <DetailDesc>{question.prizeDetailDesc}</DetailDesc>
                    </DescWrapper>
                  </PlayContent>
                </PlayWrapper>
              </LowerSection>
            </FadeIn>
          </QuestionWrapper>
        </AdvContainer>

        {msg && msg.textCards.length > 0 ? (
          <TextCard
            msg={msg}
            show={this.showTextCard}
            handleTimeIsUp={this.timeIsUp.bind(this)}
            ref={ref => (this.TextCardContainer = ref)}
          />
        ) : null}
      </Container>
    )
  }
}

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
  letter-spacing: ${props => vhToPx(0.8)};
  font-size: ${props => vhToPx(3.1)};
`
const TokenFee = styled.span`
  text-transform: uppercase;
  font-size: ${props => vhToPx(5.6)};
`

const Minimum = styled.span`
  text-transform: lowercase;
  font-size: ${props => vhToPx(3.1)};
  letter-spacing: ${props => vhToPx(0.5)};
`

const LowerRight = styled.div`
  width: 45%;
`

const Text = styled.div`
  font-size: ${props => vhToPx(7)};
  line-height: 1;
`

const Container = styled.div`
  width: inherit;
  height: inherit;
`

const AdvContainer = styled.div`
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

  position: absolute;
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
/*
  ${props =>
    props.fadeOut
      ? `animation: 0.4s ${fadeOutBottom} forwards`
      : `animation: 0.4s ${fadeInTop} forwards;animation-delay: ${
          props.delay ? 0.4 : 0
        }s`};
*/
  padding: 5% 4.5% 5% 4.5%;
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
  font-size: ${props => vhToPx(1.9)};
  color: #ffffff;
  line-height: 2;
`

const Sponsor = styled.img`
  height: ${props => responsiveDimension(props.size || 6)};
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

const PlayWrapper = styled.div`
  width: 55%;
  height: ${props => responsiveDimension(10)};
  border-radius: ${props => responsiveDimension(10)};
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
`

const PlayContent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
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
const SponsorLogo = styled.div`
  width: ${props => responsiveDimension(props.size || 13)};
  height: ${props => responsiveDimension(props.size || 13)};
  //position: absolute;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  margin-left: ${props => responsiveDimension(1)};
  margin-right: ${props => responsiveDimension(1)};
`

const DescWrapper = styled.div`
  //width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  //padding-left: 45%;
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
  font-size: ${props => responsiveDimension(3.7)};
  text-transform: uppercase;
  padding-right: ${props => (props.points > 0 ? responsiveDimension(1) : 0)};
`

const MainDesc = styled.span`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: pamainlight;
  color: #ffffff;
  font-size: ${props => responsiveDimension(3.9)};
  text-transform: uppercase;
  line-height: ${props => responsiveDimension(3)};
`

const DetailDesc = styled.div`
  width: 100%;
  display: flex;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(2.9)};
  color: #c0c0c0;
  text-transform: uppercase;
`

const HiddenTimer = styled.div`
  position: absolute;
  left: 5%;
  bottom: 5%;
  display: none;
`
