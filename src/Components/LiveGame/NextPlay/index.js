import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import TextCard from '@/Components/LiveGame/Common/TextCard'
import { vhToPx, hex2rgb, toFootage, responsiveDimension } from '@/utils'

@observer
export default class NextPlay extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      timer: this.props.timer,
      //timer: 0,
      check: null,
      footage: null,
      showTextCard: false,
    })
  }

  componentDidMount() {
    debugger
    this.countdown()
  }

  showTextCardMessage() {
    if (this.TextCardContainer) {
      TweenMax.to(this.NextPlayContainer, 0.3, {
        opacity: 0,
        onComplete: () => {
          TweenMax.to(this.TextCardContainer, 0.3, { opacity: 1 })
          this.showTextCard = true
        },
      })
    }
  }

  countdown() {
    debugger

    if (this.timer) {
      this.check = setInterval(() => {
        if (this.timer) {
          this.timer = this.timer - 1

          if (!this.timer) {
            clearInterval(this.check)
            if (this.TextCardContainer) {
              this.showTextCardMessage()
            } else {
              this.timeIsUp()
            }
          }
        }
      }, 1000)
    } else {
      if (this.TextCardContainer) {
        this.showTextCardMessage()
      } else {
        this.timeIsUp()
      }
    }

    /*
        let videoFootage = this.props.videoFootage || '0:0'
        if (videoFootage) {
          let m = 0
          let s = 0
          let footageSplit = this.props.videoFootage.split(':')
          if (footageSplit && footageSplit.length === 2) {
            m = parseInt(footageSplit[0]) * 60
            s = parseInt(footageSplit[1])
          }
          this.timer = m + s + 1

          this.check = setInterval(() => {
            this.footage = toFootage(this.timer++)
            let runningFootage = this.footage.split(':')
            let runningTotal =
              parseInt(runningFootage[0]) * 60 + parseInt(runningFootage[1])

            let pageFootage = this.props.inProgressFootage.split(':')
            let pageFootageTotal =
              parseInt(pageFootage[0]) * 60 + parseInt(pageFootage[1])

            if (runningTotal >= pageFootageTotal) {
              clearInterval(this.check)
              this.timeIsUp()
            }
          }, 1000)
        }
    */

    /*
        if (this.timer) {
          this.check = setInterval(() => {
            if (this.timer) {
              this.timer = this.timer - 1

              if (!this.timer) {
                clearInterval(this.check)
                this.timeIsUp()
              }
            }
          }, 1000)
        }
*/
  }

  componentWillUnmount() {
    clearInterval(this.check)
  }

  timeIsUp() {
    this.props.isTimeUp(true, { nextId: this.props.nextId })
  }

  render() {
    let { script, teams, msg } = this.props

    return (
      <Container>
        <NextPlayContainer innerRef={ref => (this.NextPlayContainer = ref)}>
          <FadeIn>
            <Text font={'pamainextrabold'} color={'#c61818'} fontSize={9.5}>
              next play
            </Text>
            <Text font={'pamainregular'} color={'#ffffff'} fontSize={7}>
              {script.period}
            </Text>
            <TeamWrapper>
              <Team
                teamInfo={teams[script.teamIndex]}
                size={7.5}
                abbrSize={5.5}
              />
              <TeamText>{teams[script.teamIndex].teamName} possession</TeamText>
            </TeamWrapper>
          </FadeIn>
        </NextPlayContainer>

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

const Container = styled.div`
  width: inherit;
  height: inherit;
`

const NextPlayContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props => props.color || 'transparent'};
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
  position: absolute;
`

const Text = styled.div`
  width: 100%;
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props =>
    responsiveDimension(props.fontSize) || responsiveDimension(3)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  line-height: 1;
`

const TeamWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${props => vhToPx(1.5)};
`

const TeamText = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4)};
  color: #ffffff;
  text-transform: uppercase;
  margin-left: ${props => responsiveDimension(1)};
`

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
  //justify-content: ${props => (props.center ? 'center' : 'space-between')};
  justify-content: center;
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
