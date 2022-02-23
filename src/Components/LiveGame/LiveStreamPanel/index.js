import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import iconLive from '@/assets/images/icon-live.svg'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('LowerPanelStore', 'LiveGameStore')
@observer
export default class PlayInProgress extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {})
  }

  switchToLive() {
    //this.props.switchToLive()
    //this.props.gotoKickOff()

    if (
      !this.props.LiveGameStore.proceedToVideoScreen &&
      this.props.LiveGameStore.getReadyDone
    ) {
      this.props.LiveGameStore.setProceedToVideoScreen(true)
    } else {
      this.props.switchToLive()
    }
  }

  render() {
    return (
      <Container>
        <HoverContainer>
          <TextContainer onClick={this.switchToLive.bind(this)}>
            <StreamText> game stream begins </StreamText>
            <PlayText> get ready to select and win! </PlayText>
          </TextContainer>
          <LiveContainer onClick={this.switchToLive.bind(this)}>
            <IconLive src={iconLive} />
          </LiveContainer>
        </HoverContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const HoverContainer = styled.div`
  z-index: 15;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 0.6;
    transition-duration: 0.5s;
  }

  margin-bottom: 10%;
`

const TextContainer = styled.div`
  cursor: pointer;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const StreamText = styled.span`
  color: #c61818;
  text-transform: uppercase;
  font-size: ${props => responsiveDimension(4.8)};
  line-height: 1;
  font-family: pamainextrabold;
`

const PlayText = styled.span`
  text-transform: uppercase;
  line-height: 1;
  color: #ffffff;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.6)};
`

const LiveContainer = styled.div`
  cursor: pointer;
  display: flex;
  padding-left: ${props => responsiveDimension(3)};
  height: ${props => responsiveDimension(9.5)};
  flex-direction: column;
  align-items: center;
`
const IconLive = styled.img`
  width: ${props => responsiveDimension(10)};
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`
