import React, { Component } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax } from 'gsap'
import { responsiveDimension } from '@/utils'
import iconProfile from '@/assets/images/icon-profile.svg'
let h = 0

@observer
export class WinstreakThermo extends Component {
  constructor(props) {
    super(props)
    h = this.props.size

    extendObservable(this, {
      progressData: [
        {
          multiplier: 15,
          isMultiply: true,
        },
        {
          multiplier: 30,
          isMultiply: true,
        },
        {
          multiplier: 60,
          isMultiply: true,
        },
        {
          multiplier: 90,
          isMultiply: true,
          isBonus: true,
        },
        {
          multiplier: 120,
        },
        {
          multiplier: 150,
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
                        {item.multiplier}
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
                      {item.multiplier}
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
  margin-top: ${props => responsiveDimension(h)};
`
const ProgressBarCompInner = styled.div`
  display: flex;
  width: 100;
`
const TickComp = styled.div`
  position: relative;
  width: 100%;
  height: ${props => responsiveDimension(h * 0.35)}; //1.7
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
        ? responsiveDimension(h * -0.9) //-4.6
        : responsiveDimension(h * -0.24) //-1.2
      : responsiveDimension(0)};
  display: flex;
  position: absolute;
`

const BarTextBonus = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${props => responsiveDimension(h * -0.24)}; //-1.2
`
const Bar = styled.div`
  width: ${props => responsiveDimension(h * 0.1)}; //0.5
  height: ${props => (props.isMultiply ? '170%' : '100%')};
  background-color: ${props =>
    props.isMultiply ? (props.isBonus ? '#ffffff' : '#18d1bd') : '#d2d4d6'};
  position: absolute;
  bottom: 0;
`

const DataContainer = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(h * 1.3)}; //6.5
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
  width: ${props => responsiveDimension(h * 1.3)}; //6.5
  height: ${props => responsiveDimension(h * 1.3)}; //6.5
  border-radius: ${props => responsiveDimension(h * 1.3)}; //6.5
  background-color: #18d1bd;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    width: ${props => responsiveDimension(h * 0.9)}; //4.5
    height: ${props => responsiveDimension(h * 0.9)}; //4.5
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
  font-size: ${props => responsiveDimension(h * (props.size / 5))};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
`
