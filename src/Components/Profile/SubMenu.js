import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import Loadable from 'react-loadable'
import ActivityLoader from '@/Components/Common/ActivityLoader'

@inject('NavigationStore')
export default class SubMenu extends Component {
  friendsList() {
    let Comp = Loadable({
      loader: () => import('@/Components/ShareStatus'),
      loading: ActivityLoader,
    })

    this.props.NavigationStore.addSubScreen(
      <Comp isSubScreen />,
      'ShareStatus-FriendsList',
      false,
      true
    )
  }

  gamesAndAlerts() {}

  gameHistory() {
    let Comp = Loadable({
      loader: () => import('@/Components/GameHistory'),
      loading: ActivityLoader,
    })

    this.props.NavigationStore.addSubScreen(
      <Comp />,
      'GameHistory',
      false,
      true
    )
  }

  handleSubMenuClick(subMenu) {
    switch (subMenu) {
      case 'FRIENDS_LIST':
        this.friendsList()
        break
      case 'GAMES_&_ALERTS':
        this.gamesAndAlerts()
        break
      case 'GAME_HISTORY':
        this.gameHistory()
        break
    }
  }

  render() {
    return (
      <Container>
        <SubMenuBarWrap>
          <SubMenuBarTransparent
            onClick={this.handleSubMenuClick.bind(this, 'FRIENDS_LIST')}
          >
            <SubMenuBarInner backgroundColor={'#0b7ecc'} text="friends list" />
            <SubMenuIcon src={evalImage(`menu-social-icon-white.svg`)} />
          </SubMenuBarTransparent>
        </SubMenuBarWrap>
        <SubMenuBarWrap>
          <SubMenuBarTransparent
            onClick={this.handleSubMenuClick.bind(this, 'GAMES_&_ALERTS')}
          >
            <SubMenuBarInner
              backgroundColor={'#c61618'}
              text="games & alerts"
            />
            <SubMenuIcon src={evalImage(`menu-followed_games-icon.svg`)} />
          </SubMenuBarTransparent>
        </SubMenuBarWrap>
        <SubMenuBarWrap>
          <SubMenuBarTransparent
            onClick={this.handleSubMenuClick.bind(this, 'GAME_HISTORY')}
          >
            <SubMenuBarInner
              backgroundColor={'#222222'}
              borderColor={'#ffffff'}
              text="game history"
            />
            <SubMenuIcon
              src={evalImage(`playalongnow-icon-history_games.svg`)}
            />
          </SubMenuBarTransparent>
        </SubMenuBarWrap>
        <Divider />
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: ${props => vhToPx(41)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`

const SubMenuBarWrap = styled.div`
  width: 90%;
  height: ${props => responsiveDimension(9)};
  border-top-right-radius: ${props => responsiveDimension(9)};
  border-bottom-right-radius: ${props => responsiveDimension(9)};
  background-color: #939598;
  margin-top: ${props => vhToPx(0.5)};
  margin-bottom: ${props => vhToPx(0.5)};
  display: flex;
  justify-content: flex-end;
`

const SubMenuBarTransparent = styled.div`
  width: 80%;
  height: ${props => responsiveDimension(9)};
  border-radius: ${props => responsiveDimension(9)};
  position: relative;
  cursor: pointer;
`

const SubMenuBarInner = styled.div`
  width 100%;
  height: ${props => responsiveDimension(9)};
  border-radius: ${props => responsiveDimension(9)}};
  background-color: ${props => props.backgroundColor || '#000000'};
  ${props =>
    props.borderColor
      ? `border: ${responsiveDimension(0.6)} solid ${props.borderColor}`
      : ``};
  position: absolute;
  display: flex;
  align-items: center;
  border: ${props => responsiveDimension(0.8)} solid #939598;
  &:after {
    content: '${props => props.text}';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(4)};
    color: #ffffff;
    text-transform: uppercase;
    line-height: 0.9;
    height: ${props => responsiveDimension(4 * 0.8)};
    padding-left: 30%;
    letter-spacing: ${props => responsiveDimension(0.1)};
    transform: scaleX(0.8);
    transform-origin: left;
  }
`

const SubMenuIcon = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(9)};
  height: ${props => responsiveDimension(9)};
  border-radius: 50%;
  border: ${props => `${responsiveDimension(0.8)} solid #ffffff`};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ``};
  ${props =>
    props.flip ? `-webkit-transform: scaleX(-1);transform: scaleX(-1);` : ``};
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

const Dividerols = styled.div`
  width: 80%;
  height: ${props => vhToPx(1)};
  background-color: grey;
  display: flex;
  position: absolute;
  bottom: 0;
`

const Divider = styled.div`
  width: 100%;
  height: ${props => vhToPx(0.1)};
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  &:after {
    content: '';
    width: 80%
    height: inherit;
    background-color: grey;
  }
`
