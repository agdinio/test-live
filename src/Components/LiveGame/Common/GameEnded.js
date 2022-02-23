import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'

@inject('LiveGameStore')
@observer
export default class GameEnded extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: 2,
      check: undefined,
    })
  }

  componentDidMount() {
    debugger
    this.props.LiveGameStore.setCurrentPageId(this.props.question.id)
    this.props.LiveGameStore.setIsInitNextPage(true)
    this.countdown()
  }

  countdown() {
    if (this.timer) {
      this.check = setInterval(() => {
        this.timer = this.timer - 1

        if (!this.timer) {
          clearInterval(this.check)
          this.props.isTimeUp(true, { comp: 'GAMEENDED' })
        }
      }, 1000)
    }
  }

  render() {
    return (
      <Container>
        <FadeIn>
          <Text>game ends</Text>
          <Text>Sponsor Play</Text>
        </FadeIn>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
  background-color: ${props => hex2rgb('#18c5ff', 0.8)};
`

const Text = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(9)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1;
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${props =>
    props.fadeOut
      ? `animation: 0.5s ${fadeOutBottom} forwards;`
      : `animation: 0.5s ${fadeInTop} forwards;
      animation-delay: ${props.delay ? 0.5 : 0}s;
      `};
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
  height: ${props => responsiveDimension(7)};
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
