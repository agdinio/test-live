import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import FeeCounter from '@/Components/FeeCounter'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('ProfileStore', 'UserStore', 'LiveGameStore')
@observer
export default class NextPlay extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      timer: this.props.timer,
      check: null,
    })
  }

  handleFeeCounterValue(response) {
    this.props.LiveGameStore.feeCounterValue = response
  }

  handleAutoSelectFee() {
    this.props.LiveGameStore.setFeeCounterValue(2)
    setTimeout(() => {
      this.props.LiveGameStore.setFeeCounterValue(4)
    }, 3000)
  }

  countdown() {
    this.check = setInterval(() => {
      if (this.timer) {
        this.timer = this.timer - 1

        if (!this.timer) {
          this.timeIsUp()
        }
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.check)
  }

  componentDidMount() {
    this.handleAutoSelectFee()
    this.countdown()
    TweenMax.set(this.refFeeCounter, { y: -this.refContainer.offsetHeight })
    TweenMax.to(this.refFeeCounter, 0.5, { y: 0 })
  }

  timeIsUp() {
    this.props.isTimeUp(true)
  }

  render() {
    return (
      <Container color={'#000000'} innerRef={c => (this.refContainer = c)}>
        <TextField>
          <Header>First</Header>
          <TextBox>
            <span>
              Scroll and select your <Gold>Token</Gold> amount
            </span>
            <div style={{ height: responsiveDimension(0.5) }} />
            <span>then quickly select your answer</span>
          </TextBox>
          <LowerText>
            the greater your <Gold>tokens</Gold>
          </LowerText>
          <LowerText>
            the greater your <Blue>points</Blue>
          </LowerText>
          <TopPointText>TOP POINT EARNERS WIN BIG</TopPointText>
        </TextField>
        <FeedCounterContainer onClick={() => {}}>
          <FeeCounterWrapper innerRef={c => (this.refFeeCounter = c)}>
            <FeeCounter
              disabled
              red={'#d42912'}
              min={1}
              max={10}
              currentValue={this.props.LiveGameStore.feeCounterValue}
              maxSlidingDistance={100}
              maxAnimationSpeed={0.3}
              handleSetFeeCounterValue={this.handleFeeCounterValue.bind(this)}
            />
          </FeeCounterWrapper>
        </FeedCounterContainer>
      </Container>
    )
  }
}

const LowerText = styled.span`
  font-size: ${props => responsiveDimension(3.5)};
  line-height: 1;
  //--${props => (props.top ? `margin-top:${props.top}px;` : '')} ${props =>
  props.bottom ? `margin-bottom:${props.top}px;` : ''};
  font-family: pamainregular;
`

const Header = styled.span`
  text-transform: uppercase;
  font-size: ${props => responsiveDimension(5)};
`

const Gold = styled.span`
  color: #ffb600;
`

const Blue = styled.span`
  color: #18c5ff;
`

const TextBox = styled.div`
  font-family: pamainregular, sans-serif;
  font-size: ${props => responsiveDimension(3.5)};
  text-transform: uppercase;
  flex-direction: column;
  display: flex;
  align-items: center;
  margin-bottom: ${props => vhToPx(1)};
  line-height: 1;
`

const TopPointText = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(4)};
  text-transform: uppercase;
  margin-top: ${props => vhToPx(1.5)};
`

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props => props.color || '#c61818'};
  animation: ${props => bgFadeIn} 0.3s;
`

const bgFadeIn = keyframes`
  from{opacity: 0;}
  to{opacity: 1;}
`

const TextField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  line-height: 1;
  margin-top: ${props => vhToPx(2)};
`

const FeedCounterContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 10%;
  display: flex;
  justify-content: flex-end;
`
const FeeCounterWrapper = styled.div`
  width: 45%;
  margin-right: 4.5%;
`
