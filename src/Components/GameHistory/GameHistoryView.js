import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import TeamIcon from '@/Components/Common/TeamIcon'
import ActivityIndicator from '@/Components/Common/ActivityIndicator'
import PrePickResolve from './PrePickResolve'
import LivePlayResolve from './LivePlayResolve'
import StreakTime from './StreakTime'
import WinStreak from './WinStreak'
import GameHistoryFooter from './GameHistoryFooter'

@inject('GameStore')
@observer
export default class GameHistoryView extends Component {
  constructor(props) {
    super(props)
    this.props.GameStore.getGameHistoryById(this.props.item.gameId)
  }

  componentDidMount() {}

  render() {
    let { item, GameStore } = this.props
    let { participants } = item

    return (
      <Container backgroundColor={this.props.backgroundColor}>
        <Scrolling>
          <Section direction="column" alignItems="center" marginTop="7">
            <InnerSection>
              <SportTypeCircle
                size="13"
                src={evalImage('events/' + item.sportTypeIcon)}
              />
            </InnerSection>
            <InnerSection marginTop="1.5">
              <Text font="pamainbold" size="5.5" color={'#ffffff'} uppercase>
                {item.sportTypeName}
              </Text>
            </InnerSection>
          </Section>
          <Section alignItems="center" marginTop="6" direction="column">
            {participants ? (
              <TeamsWrap>
                <TeamIconWrapper>
                  <TeamIcon
                    teamInfo={participants[0]}
                    size={5}
                    outsideBorderColor={'#ffffff'}
                    outsideBorderWidth={0.4}
                  />
                  <TeamName color={participants[0].teamNameColor} marginLeft>
                    {participants[0].name}
                  </TeamName>
                </TeamIconWrapper>

                <TMVs>VS</TMVs>

                <TeamIconWrapper>
                  <TeamName color={participants[1].teamNameColor} marginRight>
                    {participants[1].name}
                  </TeamName>
                  <TeamIcon
                    teamInfo={participants[1]}
                    size={5}
                    outsideBorderColor={'#ffffff'}
                    outsideBorderWidth={0.4}
                  />
                </TeamIconWrapper>
              </TeamsWrap>
            ) : null}
            <Divider marginTop="5" />
          </Section>

          <Section direction="column" alignItems="center" marginTop="5">
            <Text font="pamainregular" size="3.5" color={'#ffffff'} uppercase>
              your results summary
            </Text>
            {GameStore.isLoadingHistoryById ? (
              <ActivityIndicator height={7} color={'#ffffff'} />
            ) : null}
          </Section>

          <Section marginTop="2.5" direction="column" alignItems="center">
            {GameStore.isLoadingHistoryById ? null : <PrePickResolve />}
            {GameStore.isLoadingHistoryById ? null : <LivePlayResolve />}
            {GameStore.isLoadingHistoryById ? null : <Divider marginTop="5" />}
            {GameStore.isLoadingHistoryById ? null : <StreakTime item={item} />}
            {GameStore.isLoadingHistoryById ? null : <Divider marginTop="5" />}
            {GameStore.isLoadingHistoryById ? null : (
              <WinStreak fectaSize="30" />
            )}
            {GameStore.isLoadingHistoryById ? null : (
              <Divider widthInPct="90" marginTop="1" />
            )}
            {GameStore.isLoadingHistoryById ? null : <GameHistoryFooter />}
          </Section>
        </Scrolling>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.backgroundColor || `rgba(0,0,0,0.9)`};
`

const Scrolling = styled.div`
  width: 100%;
  height: ${props => vhToPx(94)};
  position: relative;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const Section = styled.div`
  width: 100%;
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`

const InnerSection = styled.div`
  text-align: center;
  display: flex;
  ${props => (props.widthInPct ? `width:${props.widthInPct}%` : ``)};
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`

const SportTypeCircle = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  min-width: ${props => responsiveDimension(props.size)};
  min-height: ${props => responsiveDimension(props.size)};
  border-radius: 50%;
  border: ${props => responsiveDimension(1)} solid #ffffff;
  background-color: #ffffff;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #000000;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 80%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 80%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const TeamsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TeamIconWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const TeamName = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(5.5)};
  color: #ffffff;
  text-transform: uppercase;
  height: ${props => responsiveDimension(5.5 * 0.8)};
  line-height: 0.9;
  ${props => (props.marginLeft ? `margin-left: 3%;` : ``)};
  ${props => (props.marginRight ? `margin-right: 3%;` : ``)};
`

const TMVs = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(6.5)};
  color: #ffffff;
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

const Divider = styled.div`
  width: ${props => props.widthInPct || 80}%;
  height: ${props => vhToPx(0.1)};
  background-color: grey;
  display: flex;
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)};` : ``)};
`
