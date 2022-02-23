import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'

@inject('GameStore')
export default class PrePickResolve extends Component {
  constructor(props) {
    super(props)
    this.playTypeColor = '#22ba2c'
    this.state = {
      totalPlays: 0,
      totalCorrectAnswers: 0,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.totalPlays !== this.state.totalPlays) {
      return true
    }
    return false
  }

  componentDidMount() {
    if (
      this.props.GameStore.gameHistory.prePicks &&
      Array.isArray(
        JSON.parse(JSON.stringify(this.props.GameStore.gameHistory.prePicks))
      )
    ) {
      let countCorrectAnswers = 0
      for (
        let i = 0;
        i < this.props.GameStore.gameHistory.prePicks.length;
        i++
      ) {
        const pp = this.props.GameStore.gameHistory.prePicks[i]
        if (pp.correct_choice) {
          const parsedCorrectChoice = JSON.parse(
            JSON.parse(JSON.stringify(pp.correct_choice.replace(/'/g, '"')))
          )
          if (
            parsedCorrectChoice &&
            Object.keys(parsedCorrectChoice).length > 0
          ) {
            if (parsedCorrectChoice.value) {
              if (
                (pp.answer || '')
                  .toString()
                  .trim()
                  .toLowerCase() ===
                (parsedCorrectChoice.value || '')
                  .toString()
                  .trim()
                  .toLowerCase()
              ) {
                countCorrectAnswers += 1
              }
            }
          }
        }
      }

      this.setState({
        totalPlays: this.props.GameStore.gameHistory.prePicks
          ? this.props.GameStore.gameHistory.prePicks.length || 0
          : 0,
        totalCorrectAnswers: countCorrectAnswers,
      })
    }
  }

  render() {
    let { totalPlays, totalCorrectAnswers } = this.state

    return (
      <Container>
        <PlayContainer>
          <PlayBar backgroundColor={'#ffffff'}>
            <PlayText text="pre-picks" color={this.playTypeColor} />
            <PlayIcon src={null} borderColor={'#ffffff'} iconBG={'#ffffff'} />
          </PlayBar>
          <PlayStats>
            <Text
              font="pamainbold"
              size="4.6"
              color={
                totalPlays < 1
                  ? 'rgba(255,255,255,0.5)'
                  : totalCorrectAnswers < totalPlays
                  ? 'rgba(255,255,255,0.5)'
                  : this.playTypeColor
              }
            >
              {totalCorrectAnswers}
            </Text>
            <Text
              font="pamainlight"
              size="4.6"
              color={
                totalPlays > 0 && totalCorrectAnswers === totalPlays
                  ? this.playTypeColor
                  : '#ffffff'
              }
              style={{
                marginLeft: '10%',
                marginRight: '5%',
                marginTop: responsiveDimension(0.2),
              }}
            >
              /
            </Text>
            <Text
              font="pamainbold"
              size="4.6"
              color={
                totalPlays < 1
                  ? 'rgba(255,255,255,0.5)'
                  : totalCorrectAnswers < totalPlays
                  ? '#ffffff'
                  : this.playTypeColor
              }
            >
              {totalPlays}
            </Text>
          </PlayStats>
        </PlayContainer>
        <PrePickContainer>
          {(this.props.GameStore.gameHistory.prePicks || []).map(pp => {
            const parsedQuestion = JSON.parse(
              JSON.parse(JSON.stringify(pp.question_detail.replace(/'/g, '"')))
            )
            let q = ''
            if (
              parsedQuestion &&
              Array.isArray(JSON.parse(JSON.stringify(parsedQuestion))) &&
              parsedQuestion.length > 0
            ) {
              const words = parsedQuestion[0].value.split(' ')
              if (
                words &&
                Array.isArray(JSON.parse(JSON.stringify(words))) &&
                words.length > 1
              ) {
                q = words[words.length - 2] + ' ' + words[words.length - 1]
              }
            }

            let isCorrect = false
            if (pp.correct_choice) {
              const parsedCorrectChoice = JSON.parse(
                JSON.parse(JSON.stringify(pp.correct_choice.replace(/'/g, '"')))
              )
              if (
                parsedCorrectChoice &&
                Object.keys(parsedCorrectChoice).length > 0
              ) {
                if (parsedCorrectChoice.value) {
                  if (
                    (pp.answer || '')
                      .toString()
                      .trim()
                      .toLowerCase() ===
                    (parsedCorrectChoice.value || '')
                      .toString()
                      .trim()
                      .toLowerCase()
                  ) {
                    isCorrect = true
                  }
                }
              }
            }

            return (
              <PrePickItemWrap key={`pp-${pp.appuser_prepick_id}`}>
                <PPQuestionWrap
                  backgroundColor={isCorrect ? this.playTypeColor : '#7F8184'}
                >
                  <PPQuestionSequence
                    text={pp.sequence}
                    color={isCorrect ? this.playTypeColor : '#7F8184'}
                  />
                  <PPQuestionText text={q} />
                </PPQuestionWrap>
                <PPAnswer
                  text={pp.answer}
                  color={isCorrect ? this.playTypeColor : '#7F8184'}
                />
              </PrePickItemWrap>
            )
          })}
        </PrePickContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => vhToPx(2)};
`

const barHeight = 6.7
const PlayContainer = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(barHeight)};
  margin: ${props => responsiveDimension(0.2)} 0
    ${props => responsiveDimension(0.2)} 0;

  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => vhToPx(0.5)};
`

const PlayBar = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(barHeight)};
  border-top-right-radius: ${props => responsiveDimension(barHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(barHeight)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  align-items: center;
  position: relative;
`

const PlayText = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(barHeight)};
  display: flex;
  align-items: center;
  margin-left: 10%;
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(barHeight * 0.4)};
    color: ${props => props.color};
    height: ${props => responsiveDimension(barHeight * 0.4 * 0.8)};
    line-height: 0.9;
    text-transform: uppercase;
  }
`

const PlayIcon = styled.div`
  width: ${props => responsiveDimension(barHeight)};
  height: ${props => responsiveDimension(barHeight)};
  min-width: ${props => responsiveDimension(barHeight)};
  min-height: ${props => responsiveDimension(barHeight)};
  border-radius: 50%;
  border: ${props =>
    `${responsiveDimension(barHeight * 0.08)} solid ${props.borderColor}`};
  background-color: ${props => props.iconBG || '#ffffff'};
  &:after {
    content: '';
    width: 100%;
    height: 100%;
    display: inline-block;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
  }
`

const PlayStats = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5%;
`

const Text = styled.div`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 0.9};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
  height: ${props => responsiveDimension(props.size * 0.8)};
`

const PrePickContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const PrePickItemWrap = styled.div`
  width: 95%;
  height: ${props => vhToPx(5)};
  background-color: #ffffff;
  margin-bottom: ${props => responsiveDimension(0.5)};
  border-top-right-radius: ${props => responsiveDimension(5)};
  border-bottom-right-radius: ${props => responsiveDimension(5)};
  display: flex;
  justify-content: space-between;
`

const PPQuestionWrap = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#7F8184'};
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PPQuestionSequence = styled.div`
  width: ${props => responsiveDimension(2.8)};
  height: ${props => responsiveDimension(2.8)};
  min-width: ${props => responsiveDimension(2.8)};
  min-height: ${props => responsiveDimension(2.8)};
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${props => responsiveDimension(1)};
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(2.5)};
    color: ${props => props.color || '#7F8184'};
    text-transform: uppercase;
    line-height: 1;
    margin-top: 10%;
  }
`

const PPQuestionText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: ${props => responsiveDimension(2)};
  &:after {
    content: '${props => props.text}';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(3)};
    color: #ffffff;
    text-transform: uppercase;
    line-height: 1;
    white-space: nowrap;
  }
`

const PPAnswer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: ${props => responsiveDimension(3)};
  &:after {
    content: '${props => props.text}';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(3.5)};
    color: ${props => props.color || '#7F8184'};
    text-transform: uppercase;
    line-height: 1;
  }
`
