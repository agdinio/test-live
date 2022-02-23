import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import { TweenMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import TeamIcon from './TeamIcon'
import ChoiceIndicatorRing from './ChoiceIndicatorRing'
import { vhToPx, responsiveDimension, dateTimeZone } from '@/utils'

@inject('PrePickStore', 'LiveGameStore')
@observer
export default class ABSlider extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      circleSpeed: 0.2,
      questionId: 0,
      direction: -1,
      slideX: 0,
      slideXChoiceIndicatorRing: 0,
      teamNameScaleLeft: 0,
      teamNameScaleRight: 0,
      teamNameColorLeft: '',
      teamNameColorRight: '',
      selectedTeamTemp: '',
      selectedTeamId: 0,
      selectedTeam: '',
      changeToLock: false,
      changeToBlank: false,
    })
  }

  reset() {
    this.circleSpeed = 0.2
    this.questionId = 0
    this.direction = -1
    this.slideXChoiceIndicatorRing = 0
    this.teamNameScaleLeft = 0
    this.teamNameScaleRight = 0
    this.teamNameColorLeft = ''
    this.teamNameColorRight = ''
    this.selectedTeamTemp = ''
    this.selectedTeamId = 0
    this.selectedTeam = ''
    this.changeToLock = false
    this.changeToBlank = false
  }

  componentWillUnmount() {
    this.reset()
    clearTimeout(this.to)
  }

  onClickSelectTeam(currDirection, selectedTeam) {
    let t = selectedTeam

    if (currDirection === 'LEFT') {
      this.direction = 0
      this.teamNameScaleLeft = 1.2
      this.teamNameScaleRight = 0.7
      this.teamNameColorLeft = '#000000'
      this.teamNameColorRight = '#6d6e71'
    } else if (currDirection === 'RIGHT') {
      this.direction = 1
      this.teamNameScaleLeft = 0.7
      this.teamNameScaleRight = 1.2
      this.teamNameColorLeft = '#6d6e71'
      this.teamNameColorRight = '#000000'
    } else {
      this.direction = -1
      this.teamNameScaleLeft = 0
      this.teamNameScaleRight = 0
    }

    this.selectedTeamId = t.id
    this.selectedTeamTemp = t.teamName
    this.animSliderChoiceAppear()
  }

  animSliderChoiceAppear() {
    if (this.props.groupComponent.toUpperCase() === 'PREPICK') {
      this.props.handleUpdateBackground(1)
    }
    TweenMax.set(this.sliderChoice, {
      opacity: 1,
      onComplete: () => {
        this.animSliderChoiceSlide()
      },
    })
  }

  animSliderChoiceSlide() {
    const el = this.sliderChoice
    if (this.direction === 0) {
      TweenMax.to(el, 0.5, {
        left: '0%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      TweenMax.to(this.refChoiceIndicatorRing, 0.7, {
        left: -this.sliderContainer.offsetWidth / 4,
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      this.animTeamIconChange()
    } else if (this.direction === 1) {
      TweenMax.to(el, 0.5, {
        left: '40%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      TweenMax.to(this.refChoiceIndicatorRing, 0.7, {
        left: this.sliderContainer.offsetWidth / 4,
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      this.animTeamIconChange()
    }
  }

  animTeamIconChange() {
    if (this.IconChange) {
      clearTimeout(this.IconChange)
    }
    this.IconChange = setTimeout(() => {
      //notify TeamIcon
      this.selectedTeam = this.selectedTeamTemp

      TweenMax.to(this.sliderContainer, 0.1, {
        backgroundColor: '#58595b',
        onComplete: this.animSliderChoiceChangeColor(),
      })
    }, 1500)
  }

  animSliderChoiceChangeColor() {
    //notify TeamIcon
    this.changeToBlank = true

    TweenMax.to(this.refChoiceIndicatorRing, 0.25, { transform: 'scale(0)' })

    //notify TeamIcon
    this.props.handleUpdateBackground(2)
    this.to = setTimeout(() => {
      this.changeToLock = true
      TweenMax.to(this.refLockingContainer, 0.1, { zIndex: 1 })
      TweenMax.to(this.sliderChoice, 0.1, { backgroundColor: '#2fc12f' })

      if (this.direction === 0) {
        TweenMax.to(this.teamNameLeft, 0.1, { color: '#FFFFFF' })
        TweenMax.to(this.teamNameRight, 0.1, { color: '#bcbec0' })
      } else if (this.direction === 1) {
        TweenMax.to(this.teamNameLeft, 0.1, { color: '#bcbec0' })
        TweenMax.to(this.teamNameRight, 0.1, { color: '#FFFFFF' })
      }

      /**
       *
       * SAVE ANSWER WHEN SLIDER LOCKS
       *
       */
      this.props.PrePickStore.pushAnswer({
        gameId: this.props.question.gameId,
        isMultiplier: this.props.question.isMultiplier,
        type: this.props.question.type || 'PrePick',
        prepickSequence: this.props.question.prepickSequence,
        shortHand: this.props.question.shortHand,
        questionId: this.props.question.id,
        answer: this.selectedTeam,
        correctAnswer: this.props.question.correctAnswer,
        choicesLength: this.props.question.choices.length,
        points: this.props.question.points,
        tokens: this.props.question.tokens,
        eventTimeStart: this.props.question.eventTimeStart,
        eventTimeStop: dateTimeZone(new Date()),
      })
      this.props.handlePicksPointsTokenNotification({ isNotify: true })

      if (this.props.answered) {
        if ('PrePick' === this.props.question.type) {
          this.props.answered({
            gameId: this.props.question.gameId,
            type: this.props.question.type,
            prepickSequence: this.props.question.prepickSequence,
            shortHand: this.props.question.shortHand,
            questionId: this.props.question.id,
            answer: this.selectedTeam,
            correctAnswer: this.props.question.correctAnswer,
            points: this.props.question.points,
            tokens: this.props.question.tokens,
            eventTimeStart: this.props.question.eventTimeStart,
            eventTimeStop: dateTimeZone(new Date()),
          })
        } else {
          this.props.answered({
            gameId: this.props.question.gameId,
            isMultiplier: this.props.question.isMultiplier,
            type: this.props.question.type || 'PrePick',
            prepickSequence: this.props.question.prepickSequence,
            shortHand: this.props.question.shortHand,
            questionId: this.props.question.id,
            answer: this.selectedTeam,
            correctAnswer: this.props.question.correctAnswer,
            nextId: this.question.nextId,
            points: this.props.question.points,
            tokens: this.props.question.tokens,
            eventTimeStart: this.props.question.eventTimeStart,
            eventTimeStop: dateTimeZone(new Date()),
          })
        }
      }
    }, 400)
  }

  render() {
    let { currentPrePick, teams, groupComponent } = this.props

    return (
      <Container>
        <Wrapper>
          <BlankSlider innerRef={c => (this.sliderContainer = c)}>
            <SliderChoice innerRef={c => (this.sliderChoice = c)} />
          </BlankSlider>

          <TeamWrapper>
            <TeamLeft
              id={
                'prepick' === (this.props.question.type || '').toLowerCase()
                  ? `prepick-choice-${teams[0].teamName}`
                  : `live-choice-${teams[0].teamName}`
              }
              onClick={this.onClickSelectTeam.bind(this, 'LEFT', teams[0])}
            >
              <TeamName
                flexStart={'flex-end'}
                paddingRight={27}
                innerRef={c => (this.teamNameLeft = c)}
              >
                {teams[0].teamName}
              </TeamName>
              <TeamIconWrapper style={{ left: 0 }}>
                <TeamIcon
                  key={`left-${currentPrePick}`}
                  team={teams[0]}
                  selectedTeam={this.selectedTeam}
                  changeToBlank={this.changeToBlank}
                  changeToLock={this.changeToLock}
                />
              </TeamIconWrapper>
            </TeamLeft>
            <TeamRight
              id={
                'prepick' === (this.props.question.type || '').toLowerCase()
                  ? `prepick-choice-${teams[1].teamName}`
                  : `live-choice-${teams[1].teamName}`
              }
              onClick={this.onClickSelectTeam.bind(this, 'RIGHT', teams[1])}
            >
              <TeamName
                flexEnd={'flex-start'}
                paddingLeft={27}
                innerRef={c => (this.teamNameRight = c)}
              >
                {teams[1].teamName}
              </TeamName>
              <TeamIconWrapper style={{ right: 0 }}>
                <TeamIcon
                  key={`right-${currentPrePick}`}
                  team={teams[1]}
                  selectedTeam={this.selectedTeam}
                  changeToBlank={this.changeToBlank}
                  changeToLock={this.changeToLock}
                />
              </TeamIconWrapper>
            </TeamRight>
          </TeamWrapper>

          <ChoiceIndicatorRingWrapper
            innerRef={c => (this.refChoiceIndicatorRing = c)}
          >
            <ChoiceIndicatorRing
              teams={this.props.teams}
              question={this.props.question}
              groupComponent={groupComponent}
            />
          </ChoiceIndicatorRingWrapper>

          <LockingContainer innerRef={c => (this.refLockingContainer = c)} />
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(7.6)};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${props => responsiveDimension(7.6)};
  background-color: #f0f2f2;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: visible;
  justify-content: center;
  align-items: center;
  display: flex;
`

const BlankSlider = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${props => responsiveDimension(7.6)};
  background-color: #f0f2f2;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;

  justify-content: center;
  text-align: center;
  align-items: center;
  display: flex;
`

const SliderChoice = styled.div`
  position: absolute;
  background-color: #fff200;
  width: 60%;
  height: inherit;
  border-radius: ${props => responsiveDimension(7.6)};
  opacity: 0;
`

const TeamWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;
  div {
    flex-basis: 100%;
  }
`

const TeamLeft = styled.div`
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
`

const TeamRight = styled.div`
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  margin-right: ${props => responsiveDimension(0.05)};
`

const TeamName = styled.div`
  position: absolute;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(2.6)};
  color: #333333;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  ${props => `justify-content: ${props.flexStart}` || ''};
  ${props => `justify-content: ${props.flexEnd}` || ''};
  ${props => `padding-left: ${props.paddingLeft}%` || ''};
  ${props => `padding-right: ${props.paddingRight}%` || ''};
`

const TeamIconWrapper = styled.div`
  width: ${props => responsiveDimension(7.6)};
  height: 100%;
  border-radius: ${props => responsiveDimension(7.6)};
  position: absolute;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  border: ${props => responsiveDimension(0.1)} solid #cccccc;
`
const ChoiceIndicatorRingWrapper = styled.div`
  position: relative;
  width: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
`

const LockingContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
  background-color: transparent;
`

ABSlider.propTypes = {
  question: PropTypes.object.isRequired,
  handlePicksPointsTokenNotification: PropTypes.func,
  handleUpdateBackground: PropTypes.func,
  onComplete: PropTypes.func,
}
