import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import { vhToPx, responsiveDimension, evalImage, hex2rgb } from '@/utils'
import { WinstreakThermo } from '@/Components/Common/WinstreakThermo'

@observer
export default class StreakTime extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timeSpent: 90,
    })
  }

  render() {
    let { item } = this.props
    return (
      <Container>
        <Section direction="row" justifyContent="center">
          <Text
            font="pamainlight"
            size="4"
            color={'#ffffff'}
            nospacing
            uppercase
          >
            playalong&nbsp;
          </Text>
          <Text
            font="pamainregular"
            size="4"
            color={'#17c5ff'}
            nospacing
            uppercase
            italic
          >
            streak time
          </Text>
        </Section>
        <Section direction="row" justifyContent="center" marginTop="2">
          <TimeNumber>{item.gameLengthHours}</TimeNumber>
          <TimeText text="h" font="pamainbold" size="4.4" heightPct="0.9" />
          <TimeText text=":" font="pamainregular" size="7" heightPct="0.85" />
          <TimeNumber>{item.gameLengthMinutes}</TimeNumber>
          <TimeText text="m" font="pamainbold" size="4.4" heightPct="0.9" />
        </Section>
        {/*
        <Section justifyContent="center">
          <ThresholdSecondLayer>
            {
              this.props.GameStore.Thresholds.map((item, idx) => {
                return (
                  <ThresholdItemsWrapper key={idx}>
                    <ThresholdItem
                      innerRef={ref =>
                        (this[`threshold-item-${item.id}`] = ref)
                      }
                      baseColor={
                        !isNaN(item.minutesRequired) &&
                        this.timeSpent >= item.minutesRequired
                          ? item.baseColor
                          : item.baseColorInactive
                      }
                    >
                      <MinutesText
                        baseColor={
                          !isNaN(item.minutesRequired) &&
                          this.timeSpent >= item.minutesRequired
                            ? item.baseColor
                            : item.baseColorInactive
                        }
                        fontSize={
                          (!isNaN(item.minutesRequired) &&
                          item.minutesRequired.toString().length <= 2
                            ? 0.8
                            : !isNaN(item.minutesRequired) &&
                            item.minutesRequired.toString().length === 3
                              ? 0.5
                              : isNaN(item.minutesRequired)
                                ? 0.6
                                : 0.7) * gaugeHeight
                        }
                      >
                        {item.minutesRequired}
                      </MinutesText>
                      <MinutesText
                        baseColor={
                          !isNaN(item.minutesRequired)
                            ? 'rgba(0,0,0, 0.6)'
                            : '#ffffff'
                        }
                        fontSize={
                          (!isNaN(item.minutesRequired) &&
                          item.minutesRequired.toString().length <= 2
                            ? 0.8
                            : !isNaN(item.minutesRequired) &&
                            item.minutesRequired.toString().length === 3
                              ? 0.5
                              : isNaN(item.minutesRequired)
                                ? 0.6
                                : 0.7) * gaugeHeight
                        }
                      >
                        {item.minutesRequired}
                      </MinutesText>
                    </ThresholdItem>
                  </ThresholdItemsWrapper>
                )
              })
            }
          </ThresholdSecondLayer>
        </Section>
*/}
        <Section justifyContent="center" marginTop="2">
          <ThermoWrapper>
            <WinstreakThermo size="5" />
          </ThermoWrapper>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: ${props => vhToPx(5)};
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

const TimeNumber = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(7)};
  height: ${props => responsiveDimension(7 * 0.8)};
  color: #ffffff;
  line-height: 0.9;
`

const TimeText = styled.div`
  height: ${props => responsiveDimension(7 * 0.8)};
  display: flex;
  align-items: flex-end;
  &:after {
    content: '${props => props.text}';
    font-family: ${props => props.font};
    font-size: ${props => responsiveDimension(props.size)};
    height: ${props => responsiveDimension(props.size * props.heightPct)};
    color: #ffffff;
    line-height: 1;
    text-transform: uppercase;
  }
`

const gaugeHeight = 5

const ThresholdSecondLayer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
`

const ThresholdItemsWrapper = styled.div`
  //width: 100%;
  height: 100%;
  display: flex;
  //justify-content: flex-end;
`

const ThresholdItem = styled.div`
  position: relative;
  width: ${props => responsiveDimension(gaugeHeight)};
  height: ${props => responsiveDimension(gaugeHeight)};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  &:before {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: ${props =>
      `${responsiveDimension(gaugeHeight * 0.09)} solid ${props.baseColor}`};
    background-color: ${props => hex2rgb(props.baseColor, 0.6)};
  }
`

const MinutesText = styled.div`
  position: absolute;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(props.fontSize)};
  text-transform: uppercase;
  color: ${props => props.baseColor};
  top: 51%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const ThermoWrapper = styled.div`
  width: 80%;
`
