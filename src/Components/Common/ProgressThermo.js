import React, { Component } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx } from '@/utils'
import iconProfile from '@/assets/images/icon-profile.svg'

@observer
export class ProgressThermo extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      progressData: [
        {
          multiplier: 1,
          isMultiply: true,
        },
        {
          multiplier: 2,
          isMultiply: true,
        },
        {
          multiplier: 3,
          isMultiply: true,
          isBonus: true,
        },
        {
          multiplier: 4,
        },
        {
          multiplier: 5,
        },
        {
          multiplier: 6,
        },
      ],
    })
  }

  componentDidMount() {
    for (let i = 0; i < this.progressData.length; i++) {
      if (this[`bar-${i}`]) {
        if (this.progressData[i].isMultiply) {
          TweenMax.set(this[`bartext-${i}`], {
            x: this[`bar-${i}`].offsetLeft - 5,
          })
        } else {
          TweenMax.set(this[`bartext-${i}`], { x: this[`bar-${i}`].offsetLeft })
        }
      }
    }
  }

  render() {
    return (
      <ProgressBarComp>
        <ProgressBarCompInner>
          {this.progressData.map((item, key) => {
            if (key > 0) {
              if (item.isBonus) {
                return (
                  <BarText
                    isMultiply={item.isMultiply}
                    isBonus={item.isBonus}
                    key={key}
                    innerRef={c => (this[`bartext-${key}`] = c)}
                  >
                    <BarTextBonus>
                      <Text
                        font={
                          item.isMultiply ? 'pamainextrabold' : 'pamainregular'
                        }
                        size={
                          item.isMultiply ? (item.isBonus ? 2.6 : 1.8) : 1.8
                        }
                        color={
                          item.isMultiply
                            ? item.isBonus
                              ? '#19d1be'
                              : '#19d1be'
                            : '#ffffff'
                        }
                        uppercase
                      >
                        {item.multiplier}x
                      </Text>
                      <Text
                        font={'pamainlight'}
                        size={3}
                        color={'#19d1be'}
                        uppercase
                      >
                        bonus
                      </Text>
                    </BarTextBonus>
                  </BarText>
                )
              } else {
                return (
                  <BarText
                    isMultiply={item.isMultiply}
                    isBonus={item.isBonus}
                    key={key}
                    innerRef={c => (this[`bartext-${key}`] = c)}
                  >
                    <Text
                      font={
                        item.isMultiply ? 'pamainextrabold' : 'pamainregular'
                      }
                      size={item.isMultiply ? (item.isBonus ? 2.6 : 1.8) : 1.8}
                      color={
                        item.isMultiply
                          ? item.isBonus
                            ? '#19d1be'
                            : '#19d1be'
                          : '#ffffff'
                      }
                      uppercase
                    >
                      {item.multiplier}x
                    </Text>
                  </BarText>
                )
              }
            }
          })}
        </ProgressBarCompInner>

        <DataContainer>
          <ProfileCircleContainer>
            <ProfileCircle src={iconProfile} />
          </ProfileCircleContainer>
          <TickComp>
            {this.progressData.map((item, key) => {
              if (key > 0) {
                return (
                  <TickContainer key={key}>
                    <Tick isMultiply={item.isMultiply}>
                      <Bar
                        isMultiply={item.isMultiply}
                        isBonus={item.isBonus}
                        innerRef={c => (this[`bar-${key}`] = c)}
                      />
                    </Tick>
                  </TickContainer>
                )
              }
            })}
          </TickComp>
        </DataContainer>
      </ProgressBarComp>
    )
  }
}

const ProgressBarComp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 0;
  position: relative;
  margin-top: ${props => vhToPx(1)};
  margin-bottom: ${props => vhToPx(1)};
`
const ProgressBarCompInner = styled.div`
  display: flex;
  width: 100;
`
const TickComp = styled.div`
  position: relative;
  width: 100%;
  height: ${props => vhToPx(1.7)};
  margin-left: 0.5%;
  display: flex;
  flex-direction: row;
`
const TickContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  background: blue;
`
const Tick = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => (props.isMultiply ? '#18d1bd' : '#a6aaad')};
  display: flex;
  justify-content: flex-end;
`

const BarText = styled.div`
  margin-top: ${props =>
    props.isMultiply
      ? props.isBonus
        ? vhToPx(-4.6)
        : vhToPx(-1.2)
      : vhToPx(0)};
  display: flex;
  position: absolute;
`
const BarTextBonus = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${props => vhToPx(-1.2)};
`
const Bar = styled.div`
  width: ${props => vhToPx(0.5)};
  height: ${props => (props.isMultiply ? '170%' : '100%')};
  background-color: ${props =>
    props.isMultiply ? (props.isBonus ? '#ffffff' : '#18d1bd') : '#d2d4d6'};
  position: absolute;
  bottom: 0;
`

const DataContainer = styled.div`
  width: 100%;
  height: ${props => vhToPx(6.5)};
  display: flex;
  align-items: center;
`
const ProfileCircleContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`
const ProfileCircle = styled.div`
  width: ${props => vhToPx(6.5)};
  height: ${props => vhToPx(6.5)};
  border-radius: ${props => vhToPx(6.5)};
  background-color: #18d1bd;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    width: ${props => vhToPx(4.5)};
    height: ${props => vhToPx(4.5)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: contain;
    display: inline-block;
  }
`

const TextWrapper = styled.div`
  text-align: center;
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
`
