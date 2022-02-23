import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax } from 'gsap'
import styled, { keyframes } from 'styled-components'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import TextCard from '@/Components/LiveGame/Common/TextCard'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'

@observer
export default class Results extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      timer: this.props.timer,
      showTextCard: false,
      check: null,
    })
  }

  componentDidMount() {
    if (this.TextCardContainer) {
      TweenMax.to(this.ResultContainer, 0.3, {
        opacity: 0,
        delay: 2,
        onComplete: () => {
          //this.showTextCardMessages()
          TweenMax.to(this.TextCardContainer, 0.3, { opacity: 1 })
          this.showTextCard = true
        },
      })
    } else {
      // setTimeout(() => {
      //   this.timeIsUp()
      // }, 2000)
      this.countdown()
    }
  }

  showTextCardMessages() {
    TweenMax.to(this.TextCardContainer, 0.3, { opacity: 1 })

    let ctr = this.props.msg.textCards.length

    let len = -1
    let handler = count => {
      if (count < ctr) {
        len = this.props.msg.textCards[count].len
        this.caller = setTimeout(() => {
          if (count - 1 >= 0) {
            TweenMax.to(this[`TextCardBlock-${count - 1}`], 0.3, { opacity: 0 })
          }
          TweenMax.to(this[`TextCardBlock-${count}`], 0.3, { opacity: 1 })
          handler(count + 1)
        }, len * 1000)
      } else {
        clearTimeout(this.caller)
        len = this.props.msg.textCards[ctr - 1].len
        TweenMax.to(this[`TextCardBlock-${ctr - 1}`], 0.3, {
          opacity: 0,
          delay: len,
          onComplete: () => {
            this.timeIsUp()
          },
        })
        return
      }
    }

    TweenMax.to(this[`TextCardBlock-0`], 0.3, { opacity: 1 })
    handler(1)
  }

  countdown() {
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
  }

  componentWillUnmount() {
    clearInterval(this.check)
  }

  timeIsUp() {
    this.props.isTimeUp(true, {
      currentId: this.props.currentId,
      nextId: this.props.nextId,
      comp: 'RESULTS',
      isTextCard: this.props.isTextCard,
    })
  }

  render() {
    let { script, msg, stars, starEarned } = this.props

    return (
      <Container>
        <ResultContainer innerRef={ref => (this.ResultContainer = ref)}>
          <FadeIn>
            <Text font={'pamainregular'} color={'#000000'} fontSize={5}>
              results
            </Text>
            <ResultTextWrapper>
              <ResultText
                font={'pamainextrabold'}
                color={'#ffffff'}
                fontSize={7}
              >
                {script.result}
              </ResultText>
            </ResultTextWrapper>
            <Text font={'pamainlight'} color={'#ffffff'} fontSize={5}>
              {script.period}
            </Text>
            <TeamWrapper>
              {/*
              <Team teamInfo={teams[script.teamIndex]} size={6} abbrSize={4} />
              <TeamText>{teams[script.teamIndex].teamName}</TeamText>
*/}
              <Team teamInfo={script.team} size={6} abbrSize={4} />
              <TeamText>{script.team.teamName}</TeamText>
            </TeamWrapper>
            {stars > 0 ? (
              starEarned ? (
                <StarResultWrapper>
                  <Star src={StarIcon} color={'#eede16'} />
                  <StarTextWrapper>
                    <StarText
                      font={'pamainextrabold'}
                      size={4}
                      color={'#eede16'}
                    >
                      STAR&nbsp;
                    </StarText>
                    <StarText font={'pamainregular'} size={4} color={'#eede16'}>
                      EARNED
                    </StarText>
                  </StarTextWrapper>
                  <StarTextWrapper>
                    <StarText font={'pamainbold'} size={2.8} color={'#000000'}>
                      CHECK YOUR PRIZE CHEST
                    </StarText>
                  </StarTextWrapper>
                </StarResultWrapper>
              ) : (
                <StarResultWrapper>
                  <Star src={StarIcon} color={'#505050'} />
                  <StarTextWrapper>
                    <StarText
                      font={'pamainextrabold'}
                      size={4}
                      color={'#505050'}
                    >
                      STAR&nbsp;
                    </StarText>
                    <StarText font={'pamainregular'} size={4} color={'#505050'}>
                      MISSED
                    </StarText>
                  </StarTextWrapper>
                </StarResultWrapper>
              )
            ) : null}
          </FadeIn>
        </ResultContainer>

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

const ResultContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props => props.color || hex2rgb('#19a3d2', 0.8)};
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);

  opacity: 1;
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
  align-items: center;
  line-height: 1.3;
`

const ResultTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ResultText = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props =>
    responsiveDimension(props.fontSize) || responsiveDimension(3)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: 0.9;
  overflow-wrap: break-word;
  word-wrap: break-word;
  text-align: center;
`

const TeamWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${props => vhToPx(1)};
`

const TeamText = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4.5)};
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

const TextCardContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: ${props => vhToPx(0.5)} solid rgba(255, 255, 255, 0.2);
  opacity: 0;
`

const TextCardBlock = styled.div`
  width: 100%;
  position: absolute;
  display: inline-block;
  text-align: center;
  opacity: 0;
`

const TextCardText = styled.span`
  font-family: ${props => props.font || 'pamainbold'};
  font-size: ${props => vhToPx(props.size || 6)};
  color: ${props => props.color || '#ffffff'};
  line-height: 1;
`

const StarResultWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(2)};
`

const StarTextWrapper = styled.div`
  line-height: 1.1;
`

const StarText = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props => (props.bold ? `font-weight: bold;` : ``)};
`

const Star = styled.span`
  width: ${props => responsiveDimension(4)};
  height: ${props => responsiveDimension(4)};
  background-color: ${props => props.color};
  -webkit-mask-image: url(${props => props.src});
  -webkit-mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: url(${props => props.src});
  mask-size: 100%;
  mask-repeat: no-repeat;
  mask-position: center;
`

const StarMissed = styled.div``
