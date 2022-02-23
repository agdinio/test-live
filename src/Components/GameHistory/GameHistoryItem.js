import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { intercept } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, isEqual, evalImage } from '@/utils'
import { TweenMax, Ease, TimelineMax } from 'gsap'
import BezierEasing from '@/bezier-easing'
import dateFormat from 'dateformat'
import TeamIcon from '@/Components/Common/TeamIcon'
import Loadable from 'react-loadable'
import ActivityLoader from '@/Components/Common/ActivityLoader'

@inject('GameStore', 'NavigationStore')
export default class GameHistoryItemItem extends Component {
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
        if (this.uniqueIdentifier && change.newValue != this.uniqueIdentifier) {
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
      this.animRefs.refThisToggle = TweenMax.to(refThis, 0.2, {
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
    this.uniqueIdentifier = this.props.item.gameId
    this.props.GameStore.setActiveSlidingFollowedGame(this.uniqueIdentifier)
  }

  handleViewPlayHistoryClick(e) {
    e.stopPropagation()
    // const comp = (
    //   <GameHistoryView/>
    // )
    // this.props.NavigationStore.addSubScreen(comp, 'GameHistory-GameHistoryView')

    let Comp = Loadable({
      loader: () => import('@/Components/GameHistory/GameHistoryView'),
      loading: ActivityLoader,
    })

    this.props.NavigationStore.addSubScreen(
      <Comp item={this.props.item} />,
      'GameHistory-GameHistoryView'
    )
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
    let { item } = this.props
    let { participants } = item

    if (!item || !participants) {
      return null
    }

    //const timeStart = dateFormat(new Date('01/01/1980 '.concat(item.formattedTimeStart)), 'hh:MMTT')
    //const isGameEnded = 'postgame, end'.match(new RegExp(item.stage, 'gi')) ? true : false
    //const uid = `${item.gameId}${item.sportType}-${item.subSportGenre}`

    return (
      <Container>
        <Wrapper
          backgroundColor={'#3d3d3d'}
          onClick={this.handleContainerClick.bind(this)}
        >
          <SlidingPanel
            innerRef={ref => (this[`refSlidingPanel-${item.gameId}`] = ref)}
          >
            <SlidingSection widthInPct="60" />
            <SlidingSection widthInPct="40">
              <ButtonViewPlayHistory
                onClick={this.handleViewPlayHistoryClick.bind(this)}
              />
            </SlidingSection>
          </SlidingPanel>

          <SportTypeWrapper>
            <SportTypeCircle src={evalImage('events/' + item.sportTypeIcon)} />
          </SportTypeWrapper>
          <TeamWrapper>
            <TeamRowWrap>
              {participants.map(participant => {
                return (
                  <TeamRow
                    key={`participant-${participant.participantId}`}
                    backgroundColor={participant.backgroundColor}
                  >
                    <TeamIconWrapper>
                      <TeamIcon
                        teamInfo={participant}
                        size={2.8}
                        outsideBorderColor={'#ffffff'}
                        outsideBorderWidth={0.3}
                      />
                      <TeamName color={participant.teamNameColor}>
                        {participant.name}
                      </TeamName>
                    </TeamIconWrapper>
                    <TeamScore
                      text={participant.score}
                      color={participant.scoreColor}
                      backgroundColor={participant.scoreBackgroundColor}
                    />
                  </TeamRow>
                )
              })}
            </TeamRowWrap>
          </TeamWrapper>

          <AnalyticsWrapper>
            <AnalyticsRow>
              <Text
                font="pamainlight"
                size="2.8"
                color={'#17c5ff'}
                nospacing
                uppercase
              >
                pts
              </Text>
              <Text
                font="pamainbold"
                size="2.8"
                color={'#17c5ff'}
                nospacing
                uppercase
              >
                {item.pointsEarned}
              </Text>
            </AnalyticsRow>
            <AnalyticsRow>
              <Text
                font="pamainlight"
                size="2.8"
                color={'#ffffff'}
                nospacing
                uppercase
              >
                w / l
              </Text>
              <Text
                font="pamainbold"
                size="2.8"
                color={'#ffffff'}
                uppercase
              >{`${item.averageWinLoss}%`}</Text>
            </AnalyticsRow>
            <AnalyticsRow>
              <Text
                font="pamainlight"
                size="2.8"
                color={'#edbf00'}
                nospacing
                uppercase
              >
                used
              </Text>
              <Text
                font="pamainbold"
                size="2.8"
                color={'#edbf00'}
                nospacing
                uppercase
              >
                {item.tokensUsed}
              </Text>
            </AnalyticsRow>
          </AnalyticsWrapper>
        </Wrapper>

        {/*
        <SlidingPanel innerRef={ref => this[`refSlidingPanel-${uid}`] = ref}>
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
*/}
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
  margin-left: 35%;
`

const TeamName = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(h * 0.25)};
  color: ${props => props.color};
  text-transform: uppercase;
  line-height: 1;
  margin-left: 5%;
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
  font-size: ${props => responsiveDimension(h * 0.25)};
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
  background: linear-gradient(to right, rgba(34, 34, 34, 0.3), #222222);
  transform: translateX(-100%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  display: flex;
  justify-content: space-between;
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

const TeamScore = styled.div`
  width: ${props => responsiveDimension(h / 2)};
  height: ${props => responsiveDimension(h / 2)};
  min-width: ${props => responsiveDimension(h / 2)};
  min-height: ${props => responsiveDimension(h / 2)};
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    color: ${props => props.color};
    font-size: ${props => responsiveDimension((h / 2) * 0.6)};
    line-height: 0.9;
  }
`

const SlidingSection = styled.div`
  width: ${props => props.widthInPct}%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AnalyticsWrapper = styled.div`
  position: relative;
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const AnalyticsRow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props =>
    `${responsiveDimension(0.5)} ${responsiveDimension(
      2
    )} ${responsiveDimension(0.5)} ${responsiveDimension(2)}`};
`

const ButtonViewPlayHistory = styled.div`
  width: 70%;
  height: 70%;
  border: ${props => responsiveDimension(0.4)} solid #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:after {
    content: 'play history';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3)};
    color: #ffffff;
    text-transform: uppercase;
  }
`
