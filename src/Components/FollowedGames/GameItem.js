import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { intercept } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, isEqual, evalImage } from '@/utils'
import { TweenMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import dateFormat from 'dateformat'
import TeamIcon from '@/Components/Common/TeamIcon'

@inject('GameStore')
export default class GameItem extends Component {
  constructor(props) {
    super(props)
    this.animSlidRefToggle = null
    this.uniqueIdentifier = null
    this.check = null
    this.animRefs = {
      refThisToggle: null,
    }
    intercept(this.props.GameStore, 'activeSlidingFollowedGame', change => {
      if (change.newValue) {
        if (
          this.uniqueIdentifier &&
          change.newValue !== this.uniqueIdentifier
        ) {
          this.reverseActiveItem()
        } else {
          this.executeActiveItem()
        }
      }
      return change
    })
  }

  reverseActiveItem() {
    if (this.check) {
      clearTimeout(this.check)
    }

    if (this.animRefs.refThisToggle) {
      this.animRefs.refThisToggle.reverse()
    }
  }

  executeActiveItem() {
    const refThis = this[`refSlidingPanel-${this.uniqueIdentifier}`]
    if (refThis) {
      this.animRefs.refThisToggle = TweenMax.to(refThis, 0.3, {
        x: '0%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      this.check = setTimeout(() => {
        this.animRefs.refThisToggle.reverse()
        clearTimeout(this.check)
      }, 10000)
    }
  }

  handleContainerClick() {
    this.uniqueIdentifier = `${this.props.item.gameId}${this.props.item.sportType}-${this.props.item.subSportGenre}`
    this.props.GameStore.setActiveSlidingFollowedGame(this.uniqueIdentifier)
  }

  handleShareClick(e) {
    e.stopPropagation()
    this.reverseActiveItem()
    this.props.refShareThisGame()
  }

  componentWillUnmount() {
    this.props.GameStore.setActiveSlidingFollowedGame(null)
    clearTimeout(this.check)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props.item, nextProps.item)) {
      return true
    }
    return false
  }

  render() {
    let { item, GameStore } = this.props
    let { participants } = item

    if (!item || (item && !item.stage) || !participants) {
      return null
    }

    const timeStart = dateFormat(
      new Date('01/01/1980 '.concat(item.formattedTimeStart)),
      'hh:MMTT'
    )
    const isGameEnded = 'postgame, end'.match(new RegExp(item.stage, 'gi'))
      ? true
      : false
    const uid = `${item.gameId}${item.sportType}-${item.subSportGenre}`

    return (
      <Container>
        <Wrapper
          backgroundColor={
            'live' === item.stage ? GameStore.gameStatus[item.stage].bg : ''
          }
          onClick={this.handleContainerClick.bind(this)}
        >
          <SportTypeWrapper>
            <SportTypeCircle
              src={evalImage(
                'events/' + GameStore.sportTypes[item.sportType].icon
              )}
            />
          </SportTypeWrapper>
          <TeamWrapper>
            <TeamRowWrap>
              <TeamRow backgroundColor={'#bcbec0'}>
                <TeamIconWrapper>
                  <TeamIcon
                    teamInfo={participants[0]}
                    size={2.8}
                    outsideBorderColor={'#ffffff'}
                    outsideBorderWidth={0.3}
                  />
                  <TeamName>{participants[0].name}</TeamName>
                </TeamIconWrapper>
              </TeamRow>
              <TeamRow backgroundColor={'#d1d3d4'}>
                <TeamIconWrapper>
                  <TeamIcon
                    teamInfo={participants[1]}
                    size={2.8}
                    outsideBorderColor={'#ffffff'}
                    outsideBorderWidth={0.3}
                  />
                  <TeamName>{participants[1].name}</TeamName>
                </TeamIconWrapper>
              </TeamRow>
            </TeamRowWrap>
          </TeamWrapper>
          <ScheduleWrapper>
            {'live' === item.stage ? (
              <ScheduleStage
                text="live"
                color={'#fff'}
                backgroundColor={GameStore.gameStatus[item.stage].bg}
              />
            ) : (
              <div>
                <Schedule
                  backgroundColor={
                    isGameEnded ? '#231F20' : GameStore.gameStatus['pregame'].bg
                  }
                >
                  <PrePickSched marginLeft="8">
                    <Text
                      font="pamainlight"
                      size={(h / 2) * 0.5}
                      color={
                        isGameEnded
                          ? GameStore.gameStatus['pregame'].bg
                          : '#ffffff'
                      }
                      uppercase
                    >
                      prepicks
                    </Text>
                  </PrePickSched>
                  <PrePickSched marginRight="6">
                    <Text
                      font="pamainbold"
                      size={(h / 2) * 0.5}
                      color={isGameEnded ? 'rgba(255,255,255, 0.5)' : '#ffffff'}
                      nospacing
                      uppercase
                    >
                      {dateFormat(item.datePrePicks, 'mm/dd')}
                    </Text>
                  </PrePickSched>
                </Schedule>
                <Schedule
                  backgroundColor={
                    isGameEnded ? '#231F20' : GameStore.gameStatus['live'].bg
                  }
                >
                  <PrePickSched marginLeft="8">
                    <Text
                      font="pamainlight"
                      size={(h / 2) * 0.5}
                      color={
                        isGameEnded
                          ? GameStore.gameStatus['live'].bg
                          : '#ffffff'
                      }
                      uppercase
                    >
                      start
                    </Text>
                  </PrePickSched>
                  <PrePickSched marginRight="6">
                    <Text
                      font="pamainbold"
                      size={(h / 2) * 0.5}
                      color={isGameEnded ? 'rgba(255,255,255, 0.5)' : '#ffffff'}
                      nospacing
                      uppercase
                    >{`${dateFormat(
                      item.dateStart,
                      'mm/dd'
                    )} ${timeStart}`}</Text>
                  </PrePickSched>
                </Schedule>
              </div>
            )}
          </ScheduleWrapper>
        </Wrapper>

        <SlidingPanel innerRef={ref => (this[`refSlidingPanel-${uid}`] = ref)}>
          <SlidingButton
            text={'live' === item.stage ? 'join' : 'remove'}
            color={'#ffffff'}
            backgroundColor={'live' === item.stage ? '#c61818' : 'transparent'}
            hasBorder={'live' === item.stage ? false : true}
            marginRight="1.5"
          />
          <SlidingButton
            text="share"
            color={'#ffffff'}
            backgroundColor={'#18c5ff'}
            marginRight="2.5"
            onClick={this.handleShareClick.bind(this)}
          />
        </SlidingPanel>
      </Container>
    )
  }
}

const h = 10
const Container = styled.div`
  position: relative;
  width: 100%;
  height: ${props => responsiveDimension(h)};
  margin-bottom: ${props => responsiveDimension(0.5)};
  display: flex;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#3d3d3d'};
  display: flex;
  justify-content: space-between;
`

const TeamIconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 35%;
`

const TeamName = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(h * 0.25)};
  color: #000000;
  text-transform: uppercase;
  line-height: 1;
  margin-left: 5%;
`

const SlidingPanel = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  padding-left: 3%;
  transform: translateX(-100%);
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const TeamWrapper = styled.div`
  position: relative;
  width: 60%;
  height: 100%;
  display: flex;
`

const TeamRowWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
`

const TeamRow = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(h / 2)};
  border-top-right-radius: ${props => responsiveDimension(h / 2)};
  border-bottom-right-radius: ${props => responsiveDimension(h / 2)};
  background-color: ${props => props.backgroundColor || '#231f20'};
`

const SportTypeWrapper = styled.div`
  position: absolute;
  width: 18%;
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(h / 2)};
  border-bottom-right-radius: ${props => responsiveDimension(h / 2)};
  background-color: #ffffff;
  display: flex;
  justify-content: flex-end;
  z-index: 3;
`

const SportTypeCircle = styled.div`
  width: ${props => responsiveDimension(h)};
  height: ${props => responsiveDimension(h)};
  min-width: ${props => responsiveDimension(h)};
  min-height: ${props => responsiveDimension(h)};
  border-radius: 50%;
  border: ${props => responsiveDimension(1)} solid #ffffff;
  background-color: #000000;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 65%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 65%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const ScheduleWrapper = styled.div`
  width: 38%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Schedule = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(h / 2)};
  border-top-left-radius: ${props => responsiveDimension(h / 2)};
  border-bottom-left-radius: ${props => responsiveDimension(h / 2)};
  background-color: ${props => props.backgroundColor || '#231f20'};
  display: flex;
  justify-content: space-between;
`

const ScheduleStage = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10%;
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(h * 0.7)};
    color: ${props => props.color};
    line-height: 0.9;
    height: ${props => responsiveDimension(h * 0.7 * 0.8)};
    text-transform: uppercase;
  }
`

const PrePickSched = styled.div`
  display: flex;
  align-items: center;
  ${props => (props.marginLeft ? `margin-left: ${props.marginLeft}%` : ``)};
  ${props => (props.marginRight ? `margin-right: ${props.marginRight}%` : ``)};
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
  height: ${props => vhToPx(props.size * 0.7)};
`

const SlidingButton = styled.div`
  width: 20%;
  height: 60%;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ``};
  ${props =>
    props.hasBorder
      ? `border:${responsiveDimension(0.4)} solid ${props.color}`
      : ``};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${props =>
    props.marginRight
      ? `margin-right:${responsiveDimension(props.marginRight)}`
      : ``};
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(2.3)};
    color: ${props => props.color};
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: ${props => responsiveDimension(0.1)};
  }
`
