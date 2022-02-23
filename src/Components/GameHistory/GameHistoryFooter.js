import React, { Component } from 'react'
import styled from 'styled-components'
import { inject } from 'mobx-react'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'
import { StaticPointsAndTokens } from '@/Components/PrePick/PicksPointsTokens'

@inject('ProfileStore', 'GameStore')
export default class GameHistoryFooter extends Component {
  render() {
    let { ProfileStore, GameStore } = this.props

    const total_points = GameStore.gameHistory.pointsEarned
      ? GameStore.gameHistory.winstreakActiveCount
        ? GameStore.gameHistory.pointsEarned *
          GameStore.gameHistory.winstreakActiveCount
        : GameStore.gameHistory.pointsEarned
      : 0
    const total_tokens = ProfileStore.profile.tokens
      ? GameStore.gameHistory.winstreakActiveCount
        ? ProfileStore.profile.tokens *
          GameStore.gameHistory.winstreakActiveCount
        : ProfileStore.profile.tokens
      : 0

    return (
      <Container>
        <Section justifyContent="space-between">
          <LeftWrap>
            <Text font="pamainlight" size="6" color={'#ffffff'} uppercase>
              total
            </Text>
          </LeftWrap>
          <RightWrap>
            <StaticPointsAndTokens
              totalPoints={total_points}
              totalTokens={ProfileStore.profile.tokens}
            />
          </RightWrap>
        </Section>
        <Section justifyContent="center" marginTop="6" marginBottom="6">
          <Text font="pamainlight" size="3.5" color={'#ffffff'} uppercase>
            slide right to return
          </Text>
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
