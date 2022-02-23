import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { intercept, extendObservable } from 'mobx'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import GameItem from './GameItem'
import LiveGameComponent from '@/Components/LiveGame'
import PrePickComponent from '@/Components/PrePick/PrePick'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import AuthSequence from '@/Components/Auth'
import dateFormat from 'dateformat'
import ActivityIndicator from '../Common/ActivityIndicator'
import { eventCapture } from '../Auth/GoogleAnalytics'
@inject(
  'CommandHostStore',
  'NavigationStore',
  'LiveGameStore',
  'ProfileStore',
  'GameStore',
  'PrePickStore'
)
@observer
export default class GameList extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      activityIndicator: null,
    })

    // this.disposeStopGame = intercept(this.props.CommandHostStore, 'isStopGame', change => {
    //   if (change.newValue) {
    //     this.props.CommandHostStore.getGamesBySport(this.props.item.name)
    //   }
    //   return change
    // })

    // this.disposeSessionAvailable = intercept(this.props.CommandHostStore, 'isSessionAvailable', change => {
    //   if (change.newValue) {
    //     this.props.NavigationStore.addSubScreen(<LiveGameComponent guid={this.props.CommandHostStore.gameId}/>, 'LiveGameSchedule-LiveGameComponent', true, true)
    //   }
    //   return change
    // })
  }

  handleLoggedIn(params) {
    params.userProfile = this.props.ProfileStore.profile
    this.nextScreen(params)
  }

  handleIsLoggedIn(params, goto, next) {
    this.toggleLoadingIndicator(1)

    params.userId = this.props.ProfileStore.profile.userId
    params.anonymousUserId = null
    if (next) {
      if ('prepick' === goto) {
        this.gotoPrePicks(params)
        this.activityIndicator = null
      } else if ('livegame' === goto) {
        this.props.CommandHostStore.setGameSubscriptionParams(params)
        this.props.NavigationStore.setCurrentView('/livegame')
      }
    }
  }

  handleMessageClose(params) {
    if (params.isPrePickCompleted) {
      if (params.userId) {
        this.activityIndicator = null
        this.props.CommandHostStore.setGameSubscriptionParams(params)
        this.props.NavigationStore.setCurrentView('/livegame')
      } else {
        this.activityIndicator = (
          <AuthWrapper>
            <AuthSequence
              mainHandleLoggedIn={this.handleIsLoggedIn.bind(
                this,
                params,
                'livegame'
              )}
            />
          </AuthWrapper>
        )
      }
    } else {
      this.activityIndicator = null
    }
    eventCapture('proceed_to_live_play', params) // GA details
  }

  gotoPrePicks(params) {
    this.props.CommandHostStore.getUserPrePicks({
      gameId: params.gameId,
      userId: params.userId,
      anonymousUserId: params.anonymousUserId,
    })
      .then(response => {
        if (response.isCompleted) {
          params.isPrePickCompleted = true
          if (params.userId && response.userLivePlayCount > 0) {
            //bypass prepicks message when the user has started playing.
            this.gotoLiveGame(params)
          } else {
            this.activityIndicator = (
              <MessageIndicator>
                <TextWrapper key={'pp-completed-1'} marginBottom={3}>
                  <Text
                    font={'pamainlight'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    {response.isAvailableForThisGame
                      ? 'you have completed all pre-picks.'
                      : 'no available pre-pick for this game.'}
                  </Text>
                </TextWrapper>
                <TextWrapper key={'pp-completed-2'} marginBottom={1}>
                  <Text
                    font={'pamainlight'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    live game session will start on
                  </Text>
                </TextWrapper>
                <TextWrapper key={'pp-completed-3'} marginBottom={4}>
                  <Text
                    font={'pamainregular'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    {dateFormat(
                      response.dateStart,
                      'dddd, mmmm dS yyyy'
                    ).toUpperCase()}
                  </Text>
                </TextWrapper>
                <Button
                  key={'pp-completed-4'}
                  borderColor={'#ffffff'}
                  text="proceed to live game"
                  onClick={this.handleMessageClose.bind(this, params)}
                />
              </MessageIndicator>
            )
          }
        } else {
          this.props.CommandHostStore.setGameSubscriptionParams(params)
          this.props.NavigationStore.setCurrentView('/prepick')
        }
      })
      .finally(_ => {
        this.toggleLoadingIndicator(0)
      })
  }

  gotoLiveGame(params) {
    /*
        this.props.GameStore.subscribeToGame(params)

        setTimeout(() => {
          this.props.NavigationStore.setCurrentView('/livegame')
          this.activityIndicator = null
        }, 0)
    */

    this.props.CommandHostStore.setGameSubscriptionParams(params)
    this.activityIndicator = null
    this.props.NavigationStore.setCurrentView('/livegame')
  }

  nextScreen(params) {
    debugger
    if (params.isLeap) {
      /*
  date commented: 05-12-2021
      if (
        'pregame, pending, live, postgame'.match(new RegExp(params.stage, 'gi'))
      ) {
        this.gotoPrePicks(params)
      } else {
        if (!params.userId) {
          //go to prepicks and login
          this.gotoPrePicks(params)
        } else {
          this.gotoLiveGame(params)
        }
      }
*/
      if (!params.userId) {
        this.activityIndicator = (
          <AuthWrapper>
            <AuthSequence
              mainHandleLoggedIn={this.handleIsLoggedIn.bind(
                this,
                params,
                'prepick'
              )}
            />
          </AuthWrapper>
        )
      } else {
        this.gotoPrePicks(params)
      }
    } else {
      if ('active, public'.match(new RegExp(params.stage, 'gi'))) {
        this.activityIndicator = (
          <MessageIndicator onClick={this.handleMessageClose.bind(this)}>
            <Section
              heightInPct="80"
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <TextWrapper key={'pp-completed-1'} marginBottom={2}>
                <Text
                  font={'pamainlight'}
                  size={3.5}
                  color={'#ffffff'}
                  uppercase
                >
                  live game session not available at this moment.
                </Text>
              </TextWrapper>
              <TextWrapper key={'pp-completed-2'} marginBottom={4}>
                <Text
                  font={'pamainlight'}
                  size={3.5}
                  color={'#ffffff'}
                  uppercase
                >
                  schedule will be announced soon.
                </Text>
              </TextWrapper>
            </Section>
            <Section heightInPct="20" justifyContent="center">
              <TextWrapper>
                <Text font="pamainlight" color={'#ffffff'} size="3.5" uppercase>
                  tap anywhere to return
                </Text>
              </TextWrapper>
            </Section>
          </MessageIndicator>
        )
      } else if (
        'pregame, pending, live, postgame'.match(new RegExp(params.stage, 'gi'))
      ) {
        if (!params.userId) {
          this.activityIndicator = (
            <AuthWrapper>
              <AuthSequence
                mainHandleLoggedIn={this.handleIsLoggedIn.bind(
                  this,
                  params,
                  'prepick'
                )}
              />
            </AuthWrapper>
          )
        } else {
          this.gotoPrePicks(params)
        }
      }
      // else if (
      //   'pending, live, postgame'.match(new RegExp(params.stage, 'gi'))
      // ) {
      //   this.gotoLiveGame(params)
      // }
    }
  }

  toggleLoadingIndicator(mode) {
    if (mode === 1) {
      if (this.refLoading) {
        this.refLoading.style.zIndex = 100
        ReactDOM.render(<ActivityComponent size={4} />, this.refLoading)
      }
    } else {
      if (this.refLoading) {
        this.refLoading.style.zIndex = -100
        ReactDOM.unmountComponentAtNode(this.refLoading)
      }
    }
  }

  async handleGameClick(gameId, stage, isLeap) {
    this.activityIndicator = <ActivityComponent size={4} />

    const params = {
      userId: await this.props.ProfileStore.profile.userId,
      anonymousUserId: await this.props.ProfileStore.profile.anonymousUserId,
      stage: stage,
      gameId: gameId,
      isLeap: isLeap,
    }

    if (this.props.ProfileStore.profile) {
      this.nextScreen(params)
    }
    console.log('gameId, stage, isLeap', params)
    eventCapture('select_game', params)
  }

  componentWillUnmount() {
    this.props.CommandHostStore.setSportGames([])
  }

  componentDidMount() {
    this.props.CommandHostStore.getGamesByCategory(this.props.item.code)
  }

  render() {
    let { item, CommandHostStore } = this.props
    let { sportGames } = CommandHostStore

    return (
      <Container>
        {this.activityIndicator}
        <Loading innerRef={ref => (this.refLoading = ref)} />
        <SelectedSportHeader>
          <SportItem item={item} />
          <SelectedSportHeaderInnerRight>
            <SeasonLabel>{'season 1 • week 1'}</SeasonLabel>
            <GamesLabel>games</GamesLabel>
          </SelectedSportHeaderInnerRight>
        </SelectedSportHeader>

        <Header>
          <HeaderLabel
            font={'pamainregular'}
            size={2.5}
            color={'#ffffff'}
            justifyContent={'flex-start'}
          >
            games
          </HeaderLabel>
          <HeaderLabel
            font={'pamainregular'}
            size={1.8}
            color={'rgba(255,255,255, 0.7)'}
            justifyContent={'center'}
          >
            upcoming games
          </HeaderLabel>
          <HeaderLabel
            font={'pamainregular'}
            size={2.5}
            color={'#ffffff'}
            justifyContent={'flex-end'}
          >
            date & time
          </HeaderLabel>
        </Header>

        <ContentScrolling>
          <Content>
            {CommandHostStore.isLoading ? (
              <Text
                font={'pamainregular'}
                size={2.5}
                color={'#ffffff'}
                style={{ marginLeft: '3%', marginTop: '3%' }}
                uppercase
              >
                please wait...
              </Text>
            ) : sportGames && sportGames.length > 0 ? (
              sportGames.map(game => {
                return (
                  <GameItem
                    key={`${game.sportType}-${game.gameId}`}
                    item={game}
                    handleClick={this.handleGameClick.bind(
                      this,
                      game.gameId,
                      game.stage,
                      game.isLeap
                    )}
                  />
                )
              })
            ) : (
              <Text
                font={'pamainregular'}
                size={2.5}
                color={'#ffffff'}
                style={{ marginLeft: '3%', marginTop: '3%' }}
                uppercase
              >
                game(s) not found
              </Text>
            )}
          </Content>
        </ContentScrolling>
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

const SelectedSportHeader = styled.div`
  width: 100%;
  height: 11%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SelectedSportHeaderInnerRight = styled.div`
  width: 43%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-right: 3%;
`

const SeasonLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.8)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1.1;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const GamesLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4)};
  color: #18c5ff;
  text-transform: uppercase;
  line-height: 1.1;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const Header = styled.div`
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #939598;
  padding: 0 3% 0 3%;
`

const HeaderLabel = styled.span`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifyContent};
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const ContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 79%;
  display: flex;
  //margin-top: ${props => props.marginTop || '12%'};
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 ${props =>
      responsiveDimension(0.3)} rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0.1)};
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ff0000;
  }
`

const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TextWrapper = styled.div`
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
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
`

const MessageIndicator = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 100;
`

const Button = styled.div`
  width: auto;
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
  ${props => (props.noarrow ? `padding: 0 10% 0 10%;` : `padding: 0 2% 0 4%;`)};
  &:before {
    content: '${props => props.text || `close`}';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3.4)};
    color: #ffffff;
    text-transform: uppercase;
    white-space: nowrap;
  }
  &:after {
    content: '';
    display: inline-block;
    width: ${props => (props.noarrow ? 0 : responsiveDimension(5))};
    height: 100%;
    display: inline-block;
    background-image: url(${props =>
      props.noarrow ? null : evalImage(`icon-arrow.svg`)});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
`

const Section = styled.div`
  width: 100%;
  ${props => (props.heightInPct ? `height:${props.heightInPct}%` : ``)};
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

const AuthWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
`

const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

/**
 * SportItem element
 * @param props
 * @constructor
 */

const SIBarHeight = 7.8

const SIContainer = styled.div`
  width: 57%;
  height: ${props => responsiveDimension(SIBarHeight)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  //padding-right: 5%;
`

const SIBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #18c5ff;
  border-top-right-radius: ${props => responsiveDimension(SIBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(SIBarHeight)};
  }
`

const SILabel = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(SIBarHeight * 0.5)};
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10%;
`

const SIIcon = styled.div`
  width: ${props => responsiveDimension(SIBarHeight)};
  height: ${props => responsiveDimension(SIBarHeight)};
  min-width: ${props => responsiveDimension(SIBarHeight)};
  min-height: ${props => responsiveDimension(SIBarHeight)};
  border-radius: 50%;
  background-color: #18c5ff;
/*
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: center;
  }
*/
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: ${props => props.sizeInPct || 60}%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: ${props => props.sizeInPct || 60}%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const SportItem = props => {
  return (
    <SIContainer>
      <SIBar innerRef={props.refBar} onClick={props.onClick}>
        <SILabel>{props.item.name}</SILabel>
        <SIIcon src={evalImage(`livegameschedule/${props.item.icon}`)} />
      </SIBar>
    </SIContainer>
  )
}
