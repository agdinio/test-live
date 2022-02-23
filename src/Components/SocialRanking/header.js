import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import GameStatus from '@/Components/LiveGame/StatusPanel/StatusPanel'
import styled, { keyframes } from 'styled-components'

@inject('LiveGameStore')
@observer
class SocialRankingHeader extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {})
  }

  componentDidMount() {
    this.props.LiveGameStore.gameFetch()
  }

  render() {
    // TODO: The game status panel has to have different updating abilities.
    return (
      <Wrapper>
        <GameStatus />
      </Wrapper>
    )
  }
}

export default SocialRankingHeader

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const Wrapper = styled.div`
  animation: 1s ${fadeIn} forwards;
`
