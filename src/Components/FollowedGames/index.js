import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import MenuBanner from '@/Components/Common/MenuBanner'
import GameItem from '@/Components/FollowedGames/GameItem'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import Loadable from 'react-loadable'
import ActivityLoader from '@/Components/Common/ActivityLoader'
import { eventCapture } from '../Auth/GoogleAnalytics'
import ResetPassword from '../Auth/ResetPassword'
@inject('CommandHostStore', 'NavigationStore', 'AnalyticsStore')
@observer
export default class FollowedGames extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      showThis: false,
    })
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handleGameClick(gameId, stage, isLeap) {
    console.log(gameId, stage, isLeap)
    // this.activityIndicator = (<ActivityComponent size={4} />)
    //
    // if (this.props.ProfileStore.profile && this.props.ProfileStore.profile.userId) {
    //   this.nextScreen({userId: this.props.ProfileStore.profile.userId, stage: stage, gameId: gameId, isLeap: isLeap})
    // }
  }

  handleGameScheduleClick() {
    let Comp = Loadable({
      loader: () => import('@/Components/LiveGameSchedule'),
      loading: ActivityLoader,
    })

    this.props.NavigationStore.addSubScreen(
      <Comp
        timeStart={this.handleTimeStart.bind(
          this,
          'FollowedGames-LiveGameSchedule'
        )}
        timeStop={this.handleTimeStop.bind(
          this,
          'FollowedGames-LiveGameSchedule'
        )}
      />,
      'FollowedGames-LiveGameSchedule',
      false,
      true
    )
    setTimeout(() => (this.showThis = true), 500)

    eventCapture('followedgamesviewschedule', {
      'FollowedGames-LiveGameSchedule': 'FollowedGames-LiveGameSchedule',
    })
  }

  handleCancel(key) {
    this.props.NavigationStore.removeSubScreen(key)
  }

  handleShareThisGame() {
    let Comp = Loadable({
      loader: () => import('@/Components/ShareThrough'),
      loading: ActivityLoader,
    })

    this.props.NavigationStore.addSubScreen(
      <Comp
        headerText="share this game"
        banner={{
          backgroundColor: '#c61618',
          icon: 'menu-followed_games-icon.svg',
          iconBackgroundColor: '#ffffff',
          iconMaskColor: '#c61618',
          sizeInPct: '80',
          text: '',
          textColor: '#ffffff',
        }}
        referralCode={this.referralCode}
        cancel={this.handleCancel.bind(this, 'FollowedGames-ShareThrough')}
      />,
      'FollowedGames-ShareThrough'
    )
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({
      page: 'FollowedGames',
      isMainPage: true,
    })
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({
      page: 'FollowedGames',
      isMainPage: true,
    })
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )

    this.props.CommandHostStore.getFollowedGames().then(next => {
      if (next) {
        // if (this.props.NavigationStore.location === '/followedgames') {
        this.handleGameScheduleClick()
        // }
      }
    })
    if (window.location.search !== '') {
    }
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'FollowedGames',
      isMainPage: true,
      isUnload: true,
    })
  }

  render() {
    let { CommandHostStore } = this.props
    let { followedGames } = CommandHostStore

    return (
      <Container isShow={this.showThis}>
        {this.props.NavigationStore.subScreens.map(comp => {
          return comp
        })}
        <MenuBannerWrap>
          <MenuBanner
            backgroundColor={'#c61618'}
            icon={`menu-followed_games-icon.svg`}
            iconBackgroundColor={'#ffffff'}
            iconMaskColor={'#c61618'}
            sizeInPct="80"
            text="followed games"
            textColor={'#ffffff'}
          />
        </MenuBannerWrap>

        <div>asdfasdf</div>

        <Scrolling>
          <Content>
            {followedGames && followedGames.length > 0 ? (
              followedGames.map(game => {
                return (
                  <GameItem
                    key={`${game.sportType}-${game.gameId}`}
                    item={game}
                    refShareThisGame={this.handleShareThisGame.bind(this)}
                  />
                )
              })
            ) : !CommandHostStore.isLoading ? (
              <Text
                font={'pamainlight'}
                size={4}
                color={'#ffffff '}
                style={{ marginLeft: '3%', marginTop: '3%' }}
                uppercase
                fadein
              >
                no record found
              </Text>
            ) : null}
          </Content>
          {CommandHostStore.isLoading ? (
            <ActivityComponent size={4} backgroundColor={'transparent'} />
          ) : null}
        </Scrolling>
        <Footer>
          <Button
            id="followedgames-button-viewschedule"
            borderColor={'#ffffff'}
            onClick={this.handleGameScheduleClick.bind(this)}
          />
        </Footer>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: ${props => (props.isShow ? `flex` : `none`)};
  flex-direction: column;
`

const MenuBannerWrap = styled.div`
  width: 100%;
  height: ${props => vhToPx(12)};
`

const Scrolling = styled.div`
  width: 100%;
  height: ${props => vhToPx(61)};
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

const Footer = styled.div`
  width: 100%;
  height: ${props => vhToPx(20)};
  display: flex;
  justify-content: center;
  align-items: center;
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
  letter-spacing: ${props => responsiveDimension(0.1)};
  height: ${props => vhToPx(props.size * 0.8)};
  ${props =>
    props.fadein
      ? `opacity:0; animation:${fadeIn} 0.4s forwards; animation-delay: 1s;`
      : ``};
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Button = styled.div`
  width: ${props => responsiveDimension(37)};
  height: ${props => responsiveDimension(9)};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ''};
  padding: 0 2% 0 4%;
  &:before {
    content: 'view game schedule';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(3.4)};
    color: #ffffff;
    text-transform: uppercase;
    white-space: nowrap;
  }
  &:after {
    content: '';
    display: inline-block;
    width: 20%;
    height: 100%;
    display: inline-block;
    background-image: url(${props => evalImage(`icon-arrow.svg`)});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
`

const ButtonTextWrap = styled.div`
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonArrow = styled.div`
  width: 15%;
  height: 100%;
  &:after {
    content: '';
    width: 100%
    height: 100%
    display: inline-block;
    background-image: url(${props => evalImage(`icon-arrow.svg`)});
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
  }
  padding-right: 5%;
`

const GameItemClickable = styled.div`
  display: flex;
  cursor: pointer;
`
