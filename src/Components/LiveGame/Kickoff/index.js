import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('PrePickStore', 'LiveGameStore')
@observer
export default class Kickoff extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: this.props.timer,
      check: undefined,
    })
  }

  componentWillUnmount() {
    clearInterval(this.check)
  }

  componentDidMount() {
    this.countdown()
  }

  countdown() {
    this.check = setInterval(() => {
      if (this.timer) {
        this.timer = this.timer - 1
      }

      if (!this.timer) {
        clearInterval(this.check)
        setTimeout(() => {
          this.timeIsUp()
        }, 500)
      }
    }, 1000)
  }

  timeIsUp() {
    clearInterval(this.check)
    this.props.LiveGameStore.setPlayVideo(true)
    this.props.isTimeUp(true)
  }

  render() {
    let { teams } = this.props.PrePickStore
    //let { selectedTeam } = this.props.LiveGameStore
    let selectedTeam = this.props.PrePickStore.teams[1]

    return (
      <Container>
        <FadeIn>
          <HeaderText>game begins</HeaderText>

          <DescText>{'kick-off'}</DescText>
          <TeamWrapper>
            <Team teamInfo={selectedTeam} size={7} abbrSize={5} />
            <TeamName>{selectedTeam.teamName}</TeamName>
          </TeamWrapper>
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
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(9)};
  color: #c61818;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  line-height: ${props => responsiveDimension(10)};
`

const DescText = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(7)};
  color: #ffffff;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  line-height: ${props => responsiveDimension(7)};
`
const TeamWrapper = styled.div`
  padding-top: ${props => vhToPx(2)};
  display: flex;
  flex-direction: row;
`
const TeamName = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(5)};
  color: #ffffff;
  text-transform: uppercase;
  margin-left: ${props => responsiveDimension(1)};
  &:after {
    content: 'receive';
    margin-left: ${props => responsiveDimension(1)};
  }
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
const fadeInTop = keyframes`
  0% {opacity:0;position: relative; top: ${vhToPx(-45)};}
  100% {opacity:1;position: relative; top: 0; height:inherit;}
`

const fadeOutBottom = keyframes`
  0% {opacity:1; }
  99% {opacity: 0; height: inherit;}
  100% {opacity:0;height: 0px;}
`
