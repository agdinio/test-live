import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Back } from 'gsap'
import {
  PointsAndTokens,
  StaticPointsAndTokens,
} from '@/Components/PrePick/PicksPointsTokens'
import { vhToPx, hex2rgb } from '@/utils'

@inject('LiveGameStore', 'ProfileStore', 'ResolveStore', 'NavigationStore')
@observer
export default class WinStreak extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      showThis: false,
      points: 0,
      tokens: 0,
      totalPoints: 0,
      totalTokens: 0,
      winAvg: 0,
      checkPoints: [],
      checkTokens: [],
      quadLength: 0,
      animateOnce: true,
      QuadraFectas: this.props.ResolveStore.quadraFectas || [],
    })
  }

  scalePointsAndTokens(scaleValue) {
    if (this.refPointsAndTokens) {
      TweenMax.to(this.refPointsAndTokens, 0.3, {
        scale: scaleValue,
        transformOrigin: 'right',
        ease: Back.easeOut.config(2),
      })
    }
  }

  showQuadra() {
    let bonusPoints = this.points
    let bonusTokens = this.tokens

    let handler = count => {
      if (count < this.QuadraFectas.length) {
        this.scalePointsAndTokens(1.2)
        this.caller = setTimeout(() => {
          TweenMax.to(this[`quadra-${count}`], 0.5, {
            opacity: 1,
            scale: 1,
            ease: Back.easeOut.config(2),
          })
          TweenMax.to(this[`quadra-inner-${count}`], 0.5, {
            opacity: 1,
            scale: 1,
            ease: Back.easeOut.config(2),
            onStart: () => {
              /**
               * Intercept in PointsAndTokens
               **/
              if (count > 1) {
                bonusPoints += this.points
                bonusTokens += this.tokens
                this.props.ProfileStore.setResolveWinStreak({
                  points: this.points,
                  tokens: this.tokens,
                })
              }
            },
          })
          ////computePoints(count)
          ////computeTokens(count)
          handler(++count)
        }, 500)
      } else {
        TweenMax.to(this.QuadraFectaBigCircle, 0.5, { opacity: 1 })
        // this.props.LiveGameStore.postPlayTotalPoints =
        //   this.quadLength * this.points
        // this.props.LiveGameStore.postPlayTotalTokens =
        //   this.quadLength * this.tokens
        clearTimeout(this.caller)
        this.prepareToHideThis(bonusPoints, bonusTokens)
      }
    }

    handler(0)

    let computePoints = key => {
      if (key === 0) {
        this.checkPoints[key] = setInterval(() => {
          this.totalPoints++
        }, 0)
      } else {
        clearInterval(this.checkPoints[key - 1])
        if (key < this.QuadraFectas.length - 1) {
          this.totalPoints = this.points * (key + 1)
          this.checkPoints[key] = setInterval(() => {
            this.totalPoints++
          }, 0)
        } else {
          this.totalPoints = this.points * (key + 1) - 50
          this.checkPoints[key] = setInterval(() => {
            this.totalPoints++
            if (this.totalPoints >= this.quadLength * this.points) {
              clearInterval(this.checkPoints[key])
              this.scalePointsAndTokens(1)
            }
          }, 0)
        }
      }
    }

    let computeTokens = key => {
      if (key === 0) {
        this.checkTokens[key] = setInterval(() => {
          this.totalTokens++
        }, 0)
      } else {
        clearInterval(this.checkTokens[key - 1])
        if (key < this.QuadraFectas.length - 1) {
          this.totalTokens = this.tokens * (key + 1)
          this.checkTokens[key] = setInterval(() => {
            this.totalTokens++
          }, 0)
        } else {
          this.totalTokens = this.tokens * (key + 1) - 50
          this.checkTokens[key] = setInterval(() => {
            this.totalTokens++
            if (this.totalTokens >= this.quadLength * this.tokens) {
              clearInterval(this.checkTokens[key])
            }
          }, 0)
        }
      }
    }
  }

  prepareToHideThis(bonusPoints, bonusTokens) {
    setTimeout(() => {
      console.log(bonusPoints)
      console.log(bonusTokens)
      this.props.ProfileStore.creditCurrencies({
        currency: 'points',
        amount: bonusPoints,
      })
      this.props.ProfileStore.creditCurrencies({
        currency: 'tokens',
        amount: bonusTokens,
      })
    }, 2000)

    setTimeout(() => {
      //this.props.ResolveStore.setResolveThrough(1)
      this.props.toGameState()
      this.props.NavigationStore.setPlayThroughOnActiveMenu('/resolve')
      this.props.ResolveStore.setLockMenu(false)
      this.props.NavigationStore.setCurrentView('/outro')
    }, 5000)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.showThis = nextProps.show

      if (this.animateOnce) {
        this.animateOnce = false
        this.points = this.props.ProfileStore.profile.currencies['points']
        this.tokens = this.props.ProfileStore.profile.currencies['tokens']
        this.quadLength = this.QuadraFectas.length

        this.winAvg = Math.ceil(
          this.QuadraFectas.reduce(function(sum, val) {
            return sum + val.percentage
          }, 0) / this.quadLength
        )

        this.showQuadra()
      }
    }
  }

  render() {
    if (this.showThis) {
      return (
        <Container show={this.showThis}>
          <Wrapper>
            <Content height={20}>
              <HeaderText>
                <TextWrapper>
                  <Text font={'pamainlight'} size={5} uppercase>
                    winstreak average
                  </Text>
                </TextWrapper>
              </HeaderText>
            </Content>

            <Content height={100}>
              <QuadraWrapper>
                {this.QuadraFectas.map((r, i) => {
                  return (
                    <QuadraFectaItem
                      item={r}
                      key={i}
                      reference={c => (this[`quadra-${i}`] = c)}
                    />
                  )
                })}

                <QuadraFectaBigCircle
                  innerRef={ref => (this.QuadraFectaBigCircle = ref)}
                />

                {this.QuadraFectas.map((r, i) => {
                  return (
                    <QuadraFectaItemInner
                      item={r}
                      key={i}
                      reference={c => (this[`quadra-inner-${i}`] = c)}
                    />
                  )
                })}

                {/*
                <QuadraCircleOuter backgroundColor={'#10bc1c'} x={-50} y={-95} innerRef={c => this[`quadra-0`] = c}>
                  <QuadraCircleInner backgroundColor={'#10bc1c'} marginTop={-25} />
                </QuadraCircleOuter>
                <QuadraCircleOuter backgroundColor={'#3632ab'} x={-123} y={-60} innerRef={c => this[`quadra-1`] = c}>
                  <QuadraCircleInner backgroundColor={'#3632ab'} marginLeft={-25} />
                </QuadraCircleOuter>

                <QuadraCircleOuter backgroundColor={'#02a9d6'}  x={23} y={-60} innerRef={c => this[`quadra-2`] = c}>
                  <QuadraCircleInner backgroundColor={'#02a9d6'} marginLeft={25} />
                </QuadraCircleOuter>



                <QuadraCircleOuter backgroundColor={'#c61819'} x={-50} y={-5} innerRef={c => this[`quadra-3`] = c}>
                  <QuadraCircleInner backgroundColor={'#c61819'} marginTop={25} />
                </QuadraCircleOuter>
*/}
              </QuadraWrapper>
            </Content>

            <Content height={20}>
              <TextWrapper>
                <Text
                  font={'pamainregular'}
                  size={2.6}
                  color={'#18c5ff'}
                  uppercase
                  letterSpacing={0.1}
                >
                  quadrafecta combo bonus
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text
                  font={'pamainregular'}
                  size={3.4}
                  uppercase
                  letterSpacing={0.1}
                >
                  {this.winAvg}% winning avg
                </Text>
              </TextWrapper>
            </Content>

            <PointsAndTokensWrapper>
              <PATLeft>
                <TextWrapper>
                  <Text font={'pamainextrabold'} size={10} uppercase>
                    {this.QuadraFectas.length}x
                  </Text>
                </TextWrapper>
              </PATLeft>
              <PATRight>
                <PATWrap>
                  <StaticPointsAndTokens
                    totalPoints={this.points}
                    totalTokens={this.tokens}
                  />
                </PATWrap>
              </PATRight>
            </PointsAndTokensWrapper>
          </Wrapper>
          <Footer>
            <FooterSlideUp innerRef={c => (this.refFooter = c)}>
              <FooterLeft>
                <TextWrapper>
                  <Text font={'pamainlight'} size={6} uppercase>
                    total
                  </Text>
                </TextWrapper>
              </FooterLeft>
              <FooterRight>
                <PointsAndTokens
                  reference={c => (this.refPointsAndTokens = c)}
                  totalPoints={
                    this.props.ProfileStore.profile.currencies['points']
                  }
                  totalTokens={
                    this.props.ProfileStore.profile.currencies['tokens']
                  }
                />
              </FooterRight>
            </FooterSlideUp>
          </Footer>
        </Container>
      )
    } else {
      return null
    }
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  display: flex;
  flex-direction: column;
  ${props =>
    props.show
      ? `animation: ${fadeIn} 0.5s forwards;`
      : `animation: ${slideUp} 0.5s forwards;`} color: white;
  font-size: 6vh;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  width: 100%;
  height: ${props => props.height}%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //margin: ${props => vhToPx(1)} 0 ${props => vhToPx(1)} 0;
`

const PointsAndTokensWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${props => vhToPx(3)} 0 ${props => vhToPx(2)} 0;
`

const PATLeft = styled.div`
  height: 100%;
  margin-left: 5%;
`

const PATRight = styled.div`
  height: 100%;
  margin-right: 5%;
`
const PATWrap = styled.div`
  transform: scale(0.7);
  transform-origin: right;
`

const fadeIn = keyframes`
  0%{opacity:0;}
  100%{opacity:1;}
`

const slideUp = keyframes`
  0%{transform: translateY(0%);}
  100%{transform: translateY(-100%);}
`

const Footer = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
`
const FooterSlideUp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  border-top: ${vhToPx(0.1)} solid #ffffff;
`
const FooterLeft = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 5%;
`
const FooterRight = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 5%;
`

const HeaderText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 6%;
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
    props.letterSpacing
      ? `letter-spacing: ${vhToPx(props.letterSpacing)};`
      : ``}
`

const QuadraFectaItem = props => {
  return (
    <QuadraCircleOuter
      backgroundColor={props.item.color}
      x={props.item.x}
      y={props.item.y}
      innerRef={props.reference}
    />
  )
}

const QuadraFectaItemInner = props => {
  return (
    <QuadraCircleInner
      backgroundColor={props.item.color}
      marginTop={props.item.innerMarginTop}
      marginLeft={props.item.innerMarginLeft}
      innerRef={props.reference}
    >
      <TextWrapper>
        <Text font={'pamainregular'} size={4} color={'#fff'} uppercase>
          {Math.ceil(props.item.percentage)}%
        </Text>
      </TextWrapper>
      <TextWrapper>
        <Text font={'pamainregular'} size={2} color={'#fff'} uppercase>
          {props.item.text}
        </Text>
      </TextWrapper>
    </QuadraCircleInner>
  )
}

const QuadraFectaBigCircle = styled.div`
  width: ${props => vhToPx(23)};
  height: ${props => vhToPx(23)};
  border-radius: ${props => vhToPx(23)};
  border: ${props => vhToPx(0.5)} solid white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
`

const QuadraWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const QuadraCircleOuter = styled.div`
  width: ${props => vhToPx(18)};
  height: ${props => vhToPx(18)};
  border-radius: ${props => vhToPx(18)};
  background-color: ${props => hex2rgb(props.backgroundColor, 0.3)};
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => (props.marginTop ? `${props.marginTop}%;` : '')} ${props =>
    props.marginLeft ? `${props.marginLeft}%;` : ''}
  position: absolute;
  top: 50%; /*safari hack*/
  left: 50%; /*safari hack*/
  transform: translate(${props => props.x}%, ${props => props.y}%) scale(0); /*safari hack*/
  opacity: 0;
`

const QuadraCircleInner = styled.div`
  width: ${props => vhToPx(14)};
  height: ${props => vhToPx(14)};
  border-radius: ${props => vhToPx(14)};
  background-color: ${props => hex2rgb(props.backgroundColor, 1)};
  margin-top: ${props => props.marginTop}%;
  margin-left: ${props => props.marginLeft}%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
`

const QuadraCircleInner__ = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background-color: ${props => hex2rgb(props.backgroundColor, 1)};
  margin-top: ${props => props.marginTop}%;
  margin-left: ${props => props.marginLeft}%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`

const QuadraFectasx = [
  {
    sequence: 0,
    text: 'prepicks',
    percentage: 60,
    color: '#10bc1c',
    x: -50,
    y: -95,
    innerMarginTop: -15,
    innerMarginLeft: 0,
    keyword: 'prepicks',
  },
  {
    sequence: 1,
    text: 'sponsors',
    percentage: 70,
    color: '#3632ab',
    x: -108,
    y: -43, //-60
    innerMarginTop: 2,
    innerMarginLeft: -18,
    keyword: 'sponsor',
  },
  {
    sequence: 2,
    text: 'gamemaster',
    percentage: 50,
    color: '#02a9d6',
    x: 8,
    y: -43, //-55
    innerMarginTop: 2,
    innerMarginLeft: 18,
    keyword: 'gamemaster',
  },
  {
    sequence: 3,
    text: 'live play',
    percentage: 60,
    color: '#c61819',
    x: -50,
    y: 11, //5
    innerMarginTop: 19,
    innerMarginLeft: 0,
    keyword: 'liveplay',
  },
]
