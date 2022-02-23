import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { intercept } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, isEqual } from '@/utils'
import dateFormat from 'dateformat'
import TeamIcon from '@/Components/Common/TeamIcon'
//import TeamIcon from '@/Components/LiveGame/StatusPanel/TeamSymbol'
import { TweenMax } from 'gsap'

@inject('GameStore')
export default class GameItem extends Component {
  constructor(props) {
    super(props)
    this.animSlidRefToggle = null
    this.uniqueIdentifier = null
    this.check = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.item, nextProps.item)) {
      return true
    }
    return false
  }

  render() {
    let { item, GameStore, handleClick } = this.props
    let { participants } = item

    if (!item || (item && !item.stage) || !participants) {
      return null
    }

    const dateStart = dateFormat(item.dateStart, 'mm/dd/yyyy')
    const timeStart = dateFormat(
      new Date('01/01/1980 '.concat(item.formattedTimeStart)),
      'hh:MMTT'
    )
    const dateTimeStart = dateStart + ' ' + timeStart

    return (
      <Container>
        <Wrapper
          backgroundColor={GameStore.gameStatus[item.stage].bg}
          onClick={handleClick}
        >
          <TeamsWrapper>
            <TeamIconWrapper>
              <TeamIcon
                teamInfo={participants[0]}
                size={2.7}
                outsideBorderColor={'#ffffff'}
                outsideBorderWidth={0.2}
              />
              <TeamName>{participants[0].name}</TeamName>
            </TeamIconWrapper>
            <TeamIconWrapper>
              <TeamIcon
                teamInfo={participants[1]}
                size={2.7}
                outsideBorderColor={'#ffffff'}
                outsideBorderWidth={0.2}
              />
              <TeamName>{participants[1].name}</TeamName>
            </TeamIconWrapper>
          </TeamsWrapper>
          <InfoWrapper>
            {item.stage === 'active' ? (
              <StatusWrapper>
                <Status
                  font={'pamainbold'}
                  color={GameStore.gameStatus[item.stage].color}
                  size={h * 0.35}
                >
                  {GameStore.gameStatus[item.stage].text}
                </Status>
                <Venue>
                  {item.city}&nbsp;{item.state},&nbsp;{item.stadium}
                </Venue>
              </StatusWrapper>
            ) : item.stage === 'public' ? (
              <StatusWrapper>
                <TimeWrapper>
                  <MonthDay>
                    {dateFormat(item.dateStart, 'mmmm dS, dddd')}&nbsp;
                  </MonthDay>
                  <Time ap color={'#22ba2c'}>
                    {timeStart}
                  </Time>
                </TimeWrapper>
                <Venue>
                  {item.city}&nbsp;{item.state},&nbsp;{item.stadium}
                </Venue>
              </StatusWrapper>
            ) : (
              <StatusWrapper>
                <TimeWrapper>
                  <Time color={GameStore.gameStatus[item.stage].color}>
                    {dateTimeStart}
                  </Time>
                </TimeWrapper>
                <Status
                  font={'pamainbold'}
                  color={GameStore.gameStatus[item.stage].color}
                  size={h * 0.35}
                >
                  {item.leapType === 'recording' ? 'AUTOMATE - ' : ''}
                  {GameStore.gameStatus[item.stage].text}
                </Status>
              </StatusWrapper>
            )}
          </InfoWrapper>
        </Wrapper>
      </Container>
    )
  }
}

const h = 10
const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${props => responsiveDimension(h)};
  margin-bottom: 0.3%;
  display: flex;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#3d3d3d'};
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`

const TeamsWrapper = styled.div`
  width: 40%;
  min-width: 40%;
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(h / 2)};
  border-bottom-right-radius: ${props => responsiveDimension(h / 2)};
  background-color: #d1d3d3;
  display: flex;
  flex-direction: column;
  padding-left: 4%;
`

const TeamIconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TeamName = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(h * 0.25)};
  color: #000000;
  text-transform: uppercase;
  line-height: 1;
  margin-left: 10%;
`

const InfoWrapper = styled.div`
  height: 100%;
  display: flex;
  // flex-direction: column;
  // align-items: flex-end;
  // justify-content: center;
  padding-right: 3%;
  width: 60%;
  justify-content: flex-end;
  overflow: hidden;
`

const StatusWrapper = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`

const TimeWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const MonthDay = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(h * 0.25)};
  color: #808285;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const Time = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(h * 0.23)};
  color: ${props => props.color || '#000000'};
  text-transform: uppercase;
  line-height: 1;
  //padding-top: ${props => (props.ap ? 0 : '5%')};
  //padding-bottom: ${props => (props.ap ? 0 : '5%')};
  letter-spacing: ${props => responsiveDimension(0.1)};
  height: ${props => responsiveDimension(h * 0.25 * 0.8)};
  margin-bottom: ${props => (props.ap ? 0 : '5%')};
  white-space: nowrap;
`

const Status = styled.div`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#000000'};
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const Venue = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(h * 0.2)};
  color: ${props => props.color || '#000000'};
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: ${props => responsiveDimension(0.1)};
  white-space: nowrap;
`

const SlidingPanel = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
  padding-left: 3%;
  transform: translateX(-101%);
`

const SlidingStageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
`

const ButtonWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Button = styled.div`
  width: ${props => responsiveDimension(props.width)};
  height: ${props => responsiveDimension(h * 0.65)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${props => responsiveDimension(props.marginLeft || 0)};
  cursor: pointer;
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(h * 0.23)};
    color ${props => props.color};
    text-transform: uppercase;
    letter-spacing: ${props => responsiveDimension(0.1)};
  }
`
