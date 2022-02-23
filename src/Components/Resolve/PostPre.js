import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Back, Linear } from 'gsap'
import styled, { keyframes } from 'styled-components'
import { vhToPx } from '@/utils'

@inject('PrePickStore', 'ProfileStore')
@observer
export default class PostPre extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      answers: this.props.preAnswers,
      questions: this.props.questions,
      isAnswerCorrect: false,
      multiplier: 0,
      multiplierFooter: 0,
      showThis: false,
      isStarted: false,
    })
  }

  animateAnswer() {
    let pointsToPush = 0
    let handler = count => {
      debugger
      if (count < this.props.preAnswers.length) {
        let a = this.props.preAnswers[count]
        let q = this.props.questions.filter(o => o.id === a.questionId)[0]
        let isCorrect = q.correctAnswer.trim() === a.answer.trim()
        this.isAnswerCorrect = isCorrect

        this.caller = setTimeout(() => {
          TweenMax.to(this[`preanswer-${count}`], 0.75, {
            opacity: 1,
            width: isCorrect ? '60%' : '45%',
            ease: Back.easeOut.config(2),
            onStart: () => {
              if (isCorrect) {
                /**
                 * Intercept in PointsAndTokens
                 **/
                let ptsCloned = this.props.ProfileStore.profile.currencies[
                  'points'
                ]
                this.props.ProfileStore.setResolvePoints({
                  bonusPoints: 1000,
                  pointsCloned: ptsCloned,
                })

                pointsToPush += 1000
                this.multiplier += 1
                this.renderMultiplier(count, this.multiplier)
              }
            },
            // onStart: isCorrect
            //   ? this.renderMultiplier.bind(this, count, ++this.multiplier)
            //   : null,
          })

          TweenMax.to(this[`question-${count}`], 0.3, {
            backgroundColor: isCorrect ? '#2fc12f' : '#808285',
          })
          TweenMax.to(this[`answer-${count}`], 0.3, {
            color: isCorrect ? '#2fc12f' : '#808285',
          })
          handler(count + 1)
        }, 500)
      } else {
        this.multiplierFooter = this.multiplier
        TweenMax.to(this.refFooter, 0.3, { opacity: 1, top: '0' })
        clearTimeout(this.caller)
        setTimeout(() => {
          this.pushPointsToServer(pointsToPush)
          this.showThis = false
          this.props.handleNotifyShow('postplay')
        }, 3000)
        return
      }
    }

    handler(0)
  }

  animateNoAnswer() {
    let pointsToPush = 0
    let handler = count => {
      debugger
      if (count < this.props.questions.length) {
        let isCorrect = false
        this.isAnswerCorrect = isCorrect

        this.caller = setTimeout(() => {
          TweenMax.to(this[`preanswer-${count}`], 0.75, {
            opacity: 1,
            width: isCorrect ? '60%' : '45%',
            ease: Back.easeOut.config(2),
            onStart: () => {
              if (isCorrect) {
                /**
                 * Intercept in PointsAndTokens
                 **/
                let ptsCloned = this.props.ProfileStore.profile.currencies[
                  'points'
                ]
                this.props.ProfileStore.setResolvePoints({
                  bonusPoints: 1000,
                  pointsCloned: ptsCloned,
                })

                pointsToPush += 1000
                this.multiplier += 1
                this.renderMultiplier(count, this.multiplier)
              }
            },
          })

          TweenMax.to(this[`question-${count}`], 0.3, {
            backgroundColor: isCorrect ? '#2fc12f' : '#808285',
          })
          TweenMax.to(this[`answer-${count}`], 0.3, {
            color: isCorrect ? '#2fc12f' : '#808285',
          })
          handler(count + 1)
        }, 500)
      } else {
        this.multiplierFooter = this.multiplier
        TweenMax.to(this.refFooter, 0.3, { opacity: 1, top: '0' })
        clearTimeout(this.caller)
        setTimeout(() => {
          this.pushPointsToServer(pointsToPush)
          this.showThis = false
          this.props.handleNotifyShow('postplay')
        }, 3000)
        return
      }
    }

    handler(0)
  }

  pushPointsToServer(pts) {
    this.props.ProfileStore.creditCurrencies({
      currency: 'points',
      amount: pts,
    })
  }

  renderMultiplier(key, mul) {
    if (this[`multiplier-${key}`]) {
      ReactDOM.unmountComponentAtNode(this[`multiplier-${key}`])
      let comp = <Multiplier mul={mul} />
      ReactDOM.render(comp, this[`multiplier-${key}`])
    }
  }

  componentDidUpdate() {
    if (this.props.show && !this.isStarted) {
      debugger
      this.isStarted = true
      this.showThis = this.props.show
      if (this.props.preAnswers && this.props.preAnswers.length > 0) {
        this.animateAnswer()
      } else {
        this.animateNoAnswer()
      }
    }
  }

  componentWillReceiveProps__(nextProps) {
    if (nextProps.show && !this.isStarted) {
      debugger
      this.isStarted = true
      this.showThis = nextProps.show
      if (this.props.preAnswers && this.props.preAnswers.length > 0) {
        this.animateAnswer()
      } else {
        this.animateNoAnswer()
      }
    }
  }

  render() {
    //let { answers } = this.props.PrePickStore
    debugger
    let { preAnswers, questions, reference } = this.props

    return (
      <PostPreContainer show={this.showThis} innerRef={reference}>
        <PostPreWrapper>
          {preAnswers && preAnswers.length > 0
            ? preAnswers.map((r, i) => {
                return (
                  <PreAnswerContainer key={i}>
                    <PreAnswer
                      item={r}
                      refPreanswer={c => (this[`preanswer-${i}`] = c)}
                      refQuestion={c => (this[`question-${i}`] = c)}
                      refAnswer={c => (this[`answer-${i}`] = c)}
                    />
                    <MultiplierWrapper
                      innerRef={c => (this[`multiplier-${i}`] = c)}
                    />
                  </PreAnswerContainer>
                )
              })
            : questions.map((r, i) => {
                return (
                  <PreAnswerContainer key={i}>
                    <PreAnswer
                      item={r}
                      refPreanswer={c => (this[`preanswer-${i}`] = c)}
                      refQuestion={c => (this[`question-${i}`] = c)}
                      refAnswer={c => (this[`answer-${i}`] = c)}
                    />
                    <MultiplierWrapper
                      innerRef={c => (this[`multiplier-${i}`] = c)}
                    />
                  </PreAnswerContainer>
                )
              })}
        </PostPreWrapper>
        <PostPreFooter>
          <FooterSlideUp innerRef={c => (this.refFooter = c)}>
            <TextWrapper>
              <Text font={'pamainlight'} size={7} uppercase>
                {this.multiplier} wins = {this.multiplier}x
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainregular'} size={4.4} uppercase>
                your pre game points
              </Text>
            </TextWrapper>
          </FooterSlideUp>
        </PostPreFooter>
      </PostPreContainer>
    )
  }
}

const PostPreContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  //////////////////align-items: center;
  animation: ${props => fadeIn} 0.5s forwards
    ${props => (!props.show ? `, animation: ${slideUp} 0.5s forwards` : ``)};
`

const slideUp = keyframes`
  0%{
    transform: translateY(0%);
  }
  100%{
    transform: translateY(-85%);
  }
`

const PostPreWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const PostPreFooter = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const FooterSlideUp = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  color: white;
`

const fadeIn = keyframes`
  0%{opacity:0;}
  100%{opacity:1;}
`

const scaleMultiplier = keyframes`
  0%{
    transform: scale(0.8) translateX(0%);
    background-color: #2fc12f;
  }
  50%{
    transform: scale(1.4) translateX(165%);
    background-color: #2fc12f;
  }
  100%{
    transform: scale(1) translateX(190%);
    background-color: #808285;
  }
`

const PreAnswer = props => {
  return (
    <PreAnswerWrapper innerRef={props.refPreanswer}>
      <Question innerRef={props.refQuestion}>{props.item.shortHand}</Question>
      <Answer innerRef={props.refAnswer}>
        {props.item.answer || `PRE-PICK`}
      </Answer>
    </PreAnswerWrapper>
  )
}

const PreAnswerContainer = styled.div`
  width: 100%;
  height: ${props => vhToPx(5)};
  margin: ${props => vhToPx(0.2)} 0 ${props => vhToPx(0.2)} 0;

  display: flex;
  justify-content: space-between;
`
const MultiplierWrapper = styled.div`
  margin-right: 5%;
  width: 20%;
`
const Multiplier = styled.div`
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(5)};
  border-radius: ${props => vhToPx(5)};
  background-color: #2fc12f;
  font-family: pamainregular;
  font-size: ${props => vhToPx(3)};
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '${props => props.mul}x';
    text-transform: uppercase;
  }
  animation: ${props => scaleMultiplier} 0.75s forwards;
`
const PreAnswerWrapper = styled.div`
  width: 0;
  height: ${props => vhToPx(5)};
  border-top-right-radius: ${props => vhToPx(5)};
  border-bottom-right-radius: ${props => vhToPx(5)};
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  opacity: 0.8;
`

const Question = styled.div`
  width: 100%;
  height: ${props => vhToPx(5)};
  border-top-right-radius: ${props => vhToPx(5)};
  border-bottom-right-radius: ${props => vhToPx(5)};
  background-color: ${props => props.backgroundColor || '#2fc12f'};
  font-family: pamainregular;
  font-size: ${props => vhToPx(1.7)};
  color: #ffffff;
  text-transform: uppercase;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 6%;
`

const Answer = styled.div`
  width: 60%;
  font-family: pamainregular;
  font-size: ${props => vhToPx(1.7)};
  color: #2fc12f;
  text-transform: uppercase;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 6%;
`

const TextWrapper = styled.div`
  display: flex;
  ${props => (props.center ? `justify-content: center;` : ``)};
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
  ${props =>
    props.letterSpacing ? `letter-spacing:${props.letterSpacing};` : ``}
`

const NoData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
