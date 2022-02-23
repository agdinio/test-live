import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import AbSlider from '@/Components/Slider/ABSlider'
import Multi from '@/Components/Slider/MultiSelectSlider'
import FeeCounter from '@/Components/FeeCounter'
import styled, { keyframes } from 'styled-components'
import token from '@/assets/images/playalong-token.svg'
import { vhToPx, hex2rgb, toFootage, responsiveDimension } from '@/utils'

@inject('PrePickStore', 'LiveGameStore', 'CommandHostStore')
@observer
export default class MultiplierQuestion extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: 0,
      fadeInFeeCounter: false,
      isTimerExpired: false,
      isInsertedWhenTimeIsUp: false,
      check: null,
      localLockout: false,
    })

    this.disposeLocalLockout = intercept(this, 'localLockout', change => {
      if (
        change.newValue &&
        'MultiplierQuestion' ===
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
          'MultiplierQuestion' ===
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
          'MultiplierQuestion' ===
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
          'MultiplierQuestion' ===
            this.props.CommandHostStore.currentPlay.componentName &&
          change.newValue === this.props.question.parentId
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

  componentDidMount() {
    this.handleAutoSelectFee()
    //this.countdown()

    setTimeout(() => {
      this.fadeInFeeCounter = true
    }, 2000)
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

  countdown() {
    /*
    if (this.timer) {
      this.check = setInterval(() => {
        debugger
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
    console.log('<>><<><><><><><><>><><><>><>TIME IS UP')
    if (!this.isInsertedWhenTimeIsUp) {
      this.insertAnswerWhenTimeIsUp()
      this.props.isTimeUp(true, {
        isTimerExpired: this.isTimerExpired,
        hideTimeout: this.props.question.hideTimeout || false,
      })
    }
  }

  handleInterceptAnswer(response, nextId) {
    if (response) {
      this.props.LiveGameStore.interceptedAnswer = true
      clearInterval(this.check)
      if (!nextId) {
        setTimeout(() => {
          this.localLockout = true
        }, 0)
      }
    }
  }

  answered(answer) {
    clearInterval(this.check)
    this.props.splash()

    if (this.props.CommandHostStore.lockout) {
      this.insertAnswerWhenTimeIsUp()
    }

    setTimeout(() => {
      answer.hideTimeout = this.props.question.hideTimeout
      this.props.answered(answer)

      // if (this.props.LiveGameStore.runningLength <= 3 && this.props.PrePickStore.multiplier > 1) {
      //
      //   this.advanceLockout = true
      //   this.props.LiveGameStore.setInProgress(true)
      //
      // } else {
      //
      //   answer.hideTimeout = this.props.question.hideTimeout
      //   this.props.answered(answer)
      //
      // }
    }, 100)
  }

  handleAutoSelectFee() {
    if (!this.props.LiveGameStore.isFeeCounterSpinned) {
      this.props.LiveGameStore.setIsFeeCounterSpinned(true)
      setTimeout(() => {
        this.props.LiveGameStore.setFeeCounterValue(2)
      }, 1000)
    }
  }

  render() {
    const { question } = this.props
    const Slider = question.choiceType === 'MULTI' ? Multi : AbSlider
    return (
      <Container color={question.backgroundColor}>
        <FadeIn>
          <QuestionContainer>
            <QuestionTitle>{question.playTitle}</QuestionTitle>
            <HiddenTimer>
              ID:
              {question.id}
              &nbsp;&nbsp;&nbsp;
              {this.props.LiveGameStore.runningLength}
            </HiddenTimer>
          </QuestionContainer>
          <div style={{ width: '100%' }}>
            <Slider
              currentPrePick={1}
              teams={this.props.teams}
              question={this.props.question}
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
          {this.props.PrePickStore.multiplier > 0 ? (
            <LowerSection center>
              <MultiSection>
                {this.props.PrePickStore.multiplier === 1 ? (
                  <Coin src={token} />
                ) : null}
                <MultiNum
                  white={!!(this.props.PrePickStore.multiplier > 1)}
                  border={
                    this.props.PrePickStore.multiplier > 1
                      ? { color: '#ffffff', opacity: 0.5 }
                      : { color: '#ff0000', opacity: 0.1 }
                  }
                  bgOpacity={this.props.PrePickStore.multiplier > 1 ? 1 : 0.5}
                >
                  {this.props.PrePickStore.multiplier > 1
                    ? `${this.props.PrePickStore.multiplier}x`
                    : this.props.LiveGameStore.feeCounterValue}
                </MultiNum>
                <MultiText
                  paddingLeft={this.props.PrePickStore.multiplier > 1 ? 11 : 9}
                >
                  <Text font={'pamainextrabold'} size={3.4}>
                    {this.props.LiveGameStore.feeCounterValue * 100}
                  </Text>
                  <Text font={'pamainregular'} size={3.4}>
                    <Blue>PTS</Blue>
                  </Text>
                  <Text font={'pamainlight'} size={3.4}>
                    {' '}
                    this Play
                  </Text>
                </MultiText>
              </MultiSection>
            </LowerSection>
          ) : (
            <LowerSection>
              <LowerLeft>
                <PlaceYour>Place your</PlaceYour>
                <TokenFee>Token Fee</TokenFee>
                <Minimum>Minimum 1-10</Minimum>
              </LowerLeft>
              <LowerRight>
                <FeeCounter
                  min={1}
                  max={10}
                  currentValue={this.props.LiveGameStore.feeCounterValue}
                  maxSlidingDistance={100}
                  maxAnimationSpeed={0.3}
                  fadeIn={this.fadeInFeeCounter}
                  handleSetFeeCounterValue={this.handleFeeCounterValue.bind(
                    this
                  )}
                />
              </LowerRight>
            </LowerSection>
          )}
        </FadeIn>
      </Container>
    )
  }
}

const MultiText = styled.div`
  text-transform: uppercase;
  padding-left: ${props => responsiveDimension(props.paddingLeft)};
  width: 100%;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
`

const Blue = styled.span`
  color: #18c5ff;
`

const Coin = styled.img`
  width: ${props => responsiveDimension(2)};
  left: 0;
  height: ${props => responsiveDimension(2)};
  z-index: 2;
`
const MultiNum = styled.div`
  width: ${props => responsiveDimension(10)};
  height: ${props => responsiveDimension(10)};
  border-radius: ${props => responsiveDimension(10)};
  color: ${props => (props.white ? 'white' : 'gold')};
  background-color: rgba(0, 0, 0, ${props => props.bgOpacity});
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(5)};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  border: ${props => responsiveDimension(0.8)} solid
    ${props => hex2rgb(props.border.color, props.border.opacity)};
`

const LowerSection = styled.div`
  flex-direction: row;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
  width: 100%;
  display: flex;
  align-items: center;
`

const MultiSection = styled.div`
  width: 60%;
  height: ${props => responsiveDimension(10)};
  border-radius: ${props => responsiveDimension(10)};
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
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

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props =>
    props.color ? hex2rgb(props.color, 0.8) : 'rgb(162, 23, 23)'};
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
`

const QuestionContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: inherit;
`
const QuestionTitle = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4.3)};
  text-transform: uppercase;
`
/*
const FadeIn = styled.div`
  padding: 5% 4.5% 5% 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
  animation: ${props => screenFadeIn} .5s;
`
const screenFadeIn = keyframes`
  from{opacity: 0;}
  to{opacity: 1;}
`
*/

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
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
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

const HiddenTimer = styled.div`
  position: absolute;
  left: 5%;
  bottom: 5%;
  display: none;
`
