import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'
import { StaticPointsAndTokens } from '@/Components/PrePick/PicksPointsTokens'
let h = 0

@inject('ResolveStore', 'GameStore', 'ProfileStore')
@observer
export default class WinStreak extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      fectaWrapperLoaded: false,
    })
    h = this.props.fectaSize
    this.quadraFectas = this.props.ResolveStore.fectas || []
  }

  componentDidMount() {
    const el = document.getElementById('fecta-wrapper')
    if (el) {
      this.fectaWrapperLoaded = true
    }
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <Text
            font="pamainlight"
            size="5"
            color={'#fff'}
            letterSpacing="0.1"
            uppercase
          >
            your winstreak bonuses
          </Text>
          <Section justifyContent="center" marginTop="2">
            <QuadraWrapper id="fecta-wrapper">
              {this.quadraFectas.map((r, i) => {
                return (
                  <QuadraFectaItem
                    item={r}
                    index={i}
                    key={i}
                    reference={c => (this[`quadra-${i}`] = c)}
                  />
                )
              })}

              <QuadraFectaBigCircle
                innerRef={ref => (this.QuadraFectaBigCircle = ref)}
              />

              {this.fectaWrapperLoaded
                ? this.quadraFectas.map((r, i) => {
                    return (
                      <QuadraFectaItemInner
                        item={r}
                        key={i}
                        reference={c => (this[`quadra-inner-${i}`] = c)}
                      />
                    )
                  })
                : null}
            </QuadraWrapper>
          </Section>
          <Section direction="column" alignItems="center">
            <TextWrapper style={{ marginTop: vhToPx(2) }}>
              <Text
                font="pamainlight"
                size="2.5"
                color={'#18c5ff'}
                letterSpacing="0.1"
                uppercase
              >
                quintafecta combo bonus
              </Text>
            </TextWrapper>
            <TextWrapper style={{ marginTop: vhToPx(0.5) }}>
              <Text
                font="pamainlight"
                size="3"
                color={'#ffffff'}
                letterSpacing="0.1"
                uppercase
              >
                {this.props.GameStore.gameHistory.winningAvg}% winning avg
              </Text>
            </TextWrapper>
          </Section>
          <Section justifyContent="space-between" marginTop="3">
            <LeftWrap>
              <Text
                font="pamainextrabold"
                size="9"
                color={'#ffffff'}
                letterSpacing="0.1"
                uppercase
              >
                {this.props.GameStore.gameHistory.winstreakActiveCount}x
              </Text>
            </LeftWrap>
            <RightWrap>
              <StaticPointsAndTokens
                totalPoints={this.props.GameStore.gameHistory.pointsEarned || 0}
                totalTokens={this.props.ProfileStore.profile.tokens || 0}
              />
            </RightWrap>
          </Section>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  margin-top: ${props => vhToPx(5)};
`

const Wrapper = styled.div`
  width; 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Section = styled.div`
  width: ${props => props.widthInPct || 100}%;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.pos ? `position:${props.pos}` : '')};
`

const QuadraWrapper = styled.div`
  position: relative;
  height: ${props => vhToPx(45)};
  display: flex;
`

const QuadraFectaBigCircle = styled.div`
  width: ${props => responsiveDimension(h * 0.77)};
  height: ${props => responsiveDimension(h * 0.77)};
  border-radius: ${props => responsiveDimension(h * 0.77)};
  border: ${props => responsiveDimension(h * 0.02)} solid white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*enable this for animation opacity: 0;*/
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

const QuadraCircleOuter = styled.div`
  width: ${props => responsiveDimension(h * 0.6)};
  height: ${props => responsiveDimension(h * 0.6)};
  border-radius: ${props => responsiveDimension(h * 0.6)};
  background-color: ${props => hex2rgb(props.backgroundColor, 0.3)};
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => (props.marginTop ? `${props.marginTop}%;` : '')};
  ${props => (props.marginLeft ? `${props.marginLeft}%;` : '')};
  position: absolute;
  top: 50%; /*safari hack*/
  left: 50%; /*safari hack*/
  /*enable this for animation transform: translate(${props =>
    props.x}%, ${props => props.y}%) scale(0);*/ /*safari hack*/
  /*enable this for animation opacity: 0;*/

  transform: translate(${props => props.x}%, ${props => props.y}%)
`

const QuadraCircleInner = styled.div`
  width: ${props => responsiveDimension(h * 0.47)};
  height: ${props => responsiveDimension(h * 0.47)};
  border-radius: ${props => responsiveDimension(h * 0.47)};
  background-color: ${props => hex2rgb(props.backgroundColor, 1)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;

  top: 50%;
  left: 50%;
  transform: translate(${props => props.innerX}%, ${props => props.innerY}%);

  /*
  enable this for animation
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
*/
`

const TextWrapper = styled.div`
  display: flex;
  ${props => (props.center ? `justify-content: center;` : ``)};
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
  ${props =>
    props.letterSpacing
      ? `letter-spacing: ${responsiveDimension(props.letterSpacing)};`
      : ``}
`

const LeftWrap = styled.div`
  display: flex;
  align-items: center;
  padding-left: 5%;
`

const RightWrap = styled.div`
  width: 100%;
  align-items: center;
  padding-right: 5%;
`

const QuadraFectaItemInner = props => {
  return (
    <QuadraCircleInner
      backgroundColor={props.item.color}
      //marginTop={props.item.innerMarginTop}
      //marginLeft={props.item.innerMarginLeft}
      innerX={props.item.innerX}
      innerY={props.item.innerY}
      innerRef={props.reference}
    >
      <TextWrapper>
        <Text font={'pamainregular'} size={h * 0.12} color={'#fff'} uppercase>
          {Math.ceil(props.item.percentage)}%
        </Text>
      </TextWrapper>
      <TextWrapper>
        <Text font={'pamainregular'} size={h * 0.07} color={'#fff'} uppercase>
          {props.item.text}
        </Text>
      </TextWrapper>
    </QuadraCircleInner>
  )
}
