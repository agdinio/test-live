import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import MenuBanner from '@/Components/Common/MenuBanner'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import GameHistoryItem from './GameHistoryItem'
import GameHistoryView from './GameHistoryView'

@inject('GameStore')
@observer
export default class GameHistory extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.GameStore.getGameHistory()
  }

  render() {
    let { GameStore } = this.props

    return (
      <Container>
        <MenuBannerWrap>
          <MenuBanner
            backgroundColor={'#ffffff'}
            icon={`playalongnow-icon-history_games.svg`}
            iconBackgroundColor={'#000000'}
            sizeInPct="80"
            text="game history"
            textColor={'#ffffff'}
          />
        </MenuBannerWrap>
        <Scrolling>
          <Content>
            {(GameStore.gameHistories || []).map(game => {
              return (
                <GameHistoryItem
                  key={`gamehistory-${game.gameId}`}
                  item={game}
                />
              )
            })}
          </Content>
          {GameStore.isLoading ? (
            <ActivityComponent size={4} backgroundColor={'transparent'} />
          ) : null}
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
`

const MenuBannerWrap = styled.div`
  width: 100%;
  height: ${props => vhToPx(12)};
`

const Scrolling = styled.div`
  height: ${props => vhToPx(82)};
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

const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
