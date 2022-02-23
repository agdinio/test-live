import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject, Provider } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax, Power1 } from 'gsap'
import bgDefault from '@/assets/images/playalong-default.jpg'
import HorizontalLineIcon from '@/assets/images/horizontal-line.svg'
import StatusPanel from '@/Components/LiveGame/StatusPanel/StatusPanel'
import FirstTab from '@/Components/LiveGame/FirstTab'
import ThirdTab from '@/Components/LiveGame/ThirdTab'
import HistoryTracker from '@/Components/HistoryTracker/HistoryTracker'
import LiveGameQuestions from '@/Components/LiveGame/LiveGameQuestions'
import PointsAndTokens from '@/Components/PrePick/PicksPointsTokens'
import SuperbowlLoginFirst from '@/Components/Common/SuperbowlLoginFirst'
import {
  hex2rgb,
  vhToPx,
  IsMobile,
  IsTablet,
  isInStandaloneMode,
  responsiveDimension,
} from '@/utils'
import agent from '@/Agent'
import 'react-quill/dist/quill.snow.css'
import LivePlay from '@/assets/images/symbol-liveplay.svg'
import GameMaster from '@/assets/images/symbol-gm.svg'
import Sponsor from '@/assets/images/symbol-sponsor.svg'
import Prize from '@/assets/images/symbol-prize.svg'
import TokenIcon from '@/assets/images/playalong-token.svg'
import StarIconDark from '@/assets/images/star-icon-dark.svg'
import ActivityComponent from '@/Components/Common/ActivityComponent'

const PlayIcons = {
  LivePlay,
  GameMaster,
  Sponsor,
  Prize,
}

const PlayTypeColor = {
  Empty: '#c1c1c1',
  PrePick: '#2fc12f',
  GameMaster: '#19d1bf',
  LivePlay: '#c61818',
  Sponsor: '#495bdb',
  Prize: '#9368AA',
  ExtraPoint: '#c61818',
  Summary: '#c61818',
  NextPlayAd: '#c61818',
  Announce: '#c61818',
}

@inject(
  'ProfileStore',
  'UserStore',
  'LiveGameStore',
  'PrePickStore',
  'CommandHostStore',
  'AuthStore',
  'CommonStore',
  'PlayStore',
  'GameStore',
  'NavigationStore',
  'AnalyticsStore'
)
@observer
export default class LiveGameComponent extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      //muted: true,
      activeTab: -1,
      //timer: 30,
      //check: undefined,
      //heightCalc: 0,
      notifyPicksPointsTokens: false,
      gotoKickOff: false,
      activityIndicator: null,
    })

    this.preText = ''
    this.nextType = ''
    this.state = {
      isPlayVideo: false,
    }
    this.isPendingPanelHidden = true
    this.initStorageCounter = 0

    this.disposeProceedToVideoScreen = intercept(
      this.props.LiveGameStore,
      'proceedToVideoScreen',
      change => {
        if (change.newValue) {
          this.next(2)
        }
        return change
      }
    )

    /*
    observe(this.props.CommandHostStore.activePlay, 'id', change => {
      debugger
      if (change.newValue) {
        setTimeout(() => {}, 0)
      }
      return change
    })
*/

    this.disposeCurrentPlay = observe(
      this.props.CommandHostStore,
      'currentPlay',
      change => {
        if (change.newValue) {
          this.props.LiveGameStore.gameStart()
        }
        return change
      }
    )

    this.disposeLatestResolvedPlay = observe(
      this.props.CommandHostStore,
      'latestResolvedPlay',
      change => {
        if (change.newValue) {
          if (this.LatestResolvePlayUIRef) {
            this.props.CommandHostStore.setIsPendingPanelHidden(
              this.isPendingPanelHidden
            )
            new TimelineMax({ repeat: 0 })
              .to(this.LatestResolvePlayUIRef, 0.3, { x: '0%' })
              .to(this.LatestResolvePlayUIRef, 0.3, {
                x: '100%',
                delay: 2,
                onComplete: () => {
                  this.props.CommandHostStore.setLatestResolvedPlay(null)
                },
              })
          }
        }
        return change
      }
    )

    this.disposeGameId = intercept(
      this.props.CommandHostStore,
      'gameId',
      change => {
        if (change.newValue) {
          this.activityIndicator = null
        }
        return change
      }
    )

    if (
      this.props.CommandHostStore.gameSubscriptionParams &&
      Object.keys(this.props.CommandHostStore.gameSubscriptionParams).length > 0
    ) {
      this.props.GameStore.subscribeToGame(
        this.props.CommandHostStore.gameSubscriptionParams
      )
    } else {
      this.props.NavigationStore.setCurrentView('/followedgames')
    }
  }

  initSwipeEventListeners() {
    let startX
    let isDown = false

    if (!this.refTabs) {
      return
    }

    this.refTabs.addEventListener('mousedown', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        isDown = true
        startX = e.screenX + this[`tab${this.activeTab}`].offsetLeft
      }
    })

    this.refTabs.addEventListener('mousemove', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        if (!isDown) {
          return false
        }

        let change = startX - e.screenX
        TweenMax.to(this.refTabs, 0, { left: -change })
      }
    })

    this.refTabs.addEventListener('mouseup', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        isDown = false

        let x = this[`tab${this.activeTab}`].offsetWidth * this.activeTab
        let change = startX - e.screenX

        let threshold = 0
        let distX = x + (e.screenX - startX)
        if (distX < 0) {
          threshold = x + this[`tab${this.activeTab}`].offsetWidth / 2
        } else {
          threshold = x - this[`tab${this.activeTab}`].offsetWidth / 2
        }

        if (distX < 0) {
          //LEFT DIRECTION
          if (change < threshold) {
            this.next(this.activeTab)
          } else {
            this.next(this.activeTab < 2 ? this.activeTab + 1 : this.activeTab)
          }
        } else {
          //RIGHT DIRECTION
          if (change < threshold) {
            this.next(
              this.activeTab > 0 && this.activeTab < TabCount
                ? this.activeTab - 1
                : this.activeTab
            )
          } else {
            this.next(this.activeTab)
          }
        }
      }
    })

    this.refTabs.addEventListener('mouseleave', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        if (!isDown) {
          return false
        }
        isDown = false

        let x = this[`tab${this.activeTab}`].offsetWidth * this.activeTab
        let change = startX - e.screenX

        let threshold = 0
        let distX = x + (e.screenX - startX)
        if (distX < 0) {
          threshold = x + this[`tab${this.activeTab}`].offsetWidth / 2
        } else {
          threshold = x - this[`tab${this.activeTab}`].offsetWidth / 2
        }

        if (distX < 0) {
          //LEFT DIRECTION
          if (change < threshold) {
            this.next(this.activeTab)
          } else {
            this.next(this.activeTab < 2 ? this.activeTab + 1 : this.activeTab)
          }
        } else {
          //RIGHT DIRECTION
          if (change < threshold) {
            this.next(
              this.activeTab > 0 && this.activeTab < TabCount
                ? this.activeTab - 1
                : this.activeTab
            )
          } else {
            this.next(this.activeTab)
          }
        }
      }
    })

    this.refTabs.addEventListener('touchstart', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        startX = e.touches[0].clientX + this[`tab${this.activeTab}`].offsetLeft
      }
    })

    this.refTabs.addEventListener('touchmove', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        let change = startX - e.touches[0].clientX
        TweenMax.to(this.refTabs, 0, { left: -change })
      }
    })

    this.refTabs.addEventListener('touchend', e => {
      e.stopPropagation()
      if (this.activeTab !== 1) {
        let x = this[`tab${this.activeTab}`].offsetWidth * this.activeTab
        let change = startX - e.changedTouches[0].clientX

        let threshold = 0
        let distX = x + (e.changedTouches[0].clientX - startX)
        if (distX < 0) {
          threshold = x + this[`tab${this.activeTab}`].offsetWidth / 2
        } else {
          threshold = x - this[`tab${this.activeTab}`].offsetWidth / 2
        }

        if (distX < 0) {
          //LEFT DIRECTION
          if (change < threshold) {
            this.next(this.activeTab)
          } else {
            this.next(this.activeTab < 2 ? this.activeTab + 1 : this.activeTab)
          }
        } else {
          //RIGHT DIRECTION
          if (change < threshold) {
            this.next(
              this.activeTab > 0 && this.activeTab < 3
                ? this.activeTab - 1
                : this.activeTab
            )
          } else {
            this.next(this.activeTab)
          }
        }
      }
    })
  }

  next(key) {
    this.handleShowHistoryPending('hide')
    if (this[`tab${key}`] && this[`step${key}`]) {
      this.activeTab = key

      let tab = this[`tab${key}`]
      let step = this[`step${key}`]

      TweenMax.to(this.refTabs, 0.5, { left: -tab.offsetWidth * key })
      TweenMax.to(this.history, 0.5, { right: key === 2 ? '-50%' : '0%' })
      for (let i = 0; i < TabCount; i++) {
        this[`step${i}`].className = this[`step${i}`].className.replace(
          'active',
          ''
        )
      }
      step.className += ' active'
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({ page: 'LiveGame', isMainPage: true })

    /**
     * [isSet: false] is in GameStore.setInfo function
     */
    this.props.AnalyticsStore.setPendingGamePlay({
      location: '/livegame',
      isSet: true,
    })

    //clearInterval(this.check)
    clearTimeout(this.to)
    clearTimeout(this.cl)
    this.disposeCurrentPlay()
    this.disposeLatestResolvedPlay()
    this.disposeProceedToVideoScreen()
    this.disposeGameId()

    this.props.PrePickStore.resetVars()
    this.props.CommandHostStore.resetObservables()
    this.props.CommandHostStore.unsubscribeToGame()
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'LiveGame',
      isMainPage: true,
      isUnload: true,
    })
    /**
     * [isSet: false] is in GameStore.setInfo function
     */
    this.props.AnalyticsStore.setPendingGamePlay({
      location: '/livegame',
      isSet: true,
      isUnload: true,
    })
  }

  componentDidUpdate(prevProps) {
    //this.next(1) is used when a new play arrived.
    //this.next(1)

    this.initSwipeEventListeners()

    if (this.HistoryPendingRef) {
      /*
            if (this.props.CommandHostStore.currentPlay && this.props.CommandHostStore.currentPlay.type === 'Announce') {
              if (this.props.CommandHostStore.isPendingPanelHidden) {
                TweenMax.to(this.HistoryPendingRef, 0.3, { y: '100%' })
              } else {
                TweenMax.to(this.HistoryPendingRef, 0.3, { y: '24%' })
              }
            } else {
            }
      */

      if (parseInt(this.props.CommandHostStore.pendingPlayCount) < 1) {
        this.isPendingPanelHidden = true
        this.props.CommandHostStore.setIsPendingPanelHidden(true)
        TweenMax.to(this.HistoryPendingRef, 0.3, { y: '100%' })
      } else {
        if (this.props.CommandHostStore.isPendingPanelHidden) {
          this.isPendingPanelHidden = true
          TweenMax.to(this.HistoryPendingRef, 0.3, { y: '100%' })
        } else {
          this.isPendingPanelHidden = false
          TweenMax.to(this.HistoryPendingRef, 0.3, { y: '24%' })
        }
      }
    }

    if (
      this.props.ProfileStore.profile &&
      this.props.ProfileStore.profile.userId
    ) {
      // if (this.initStorageCounter < 1) {
      //   this.initStorageCounter++
      //   const localStorageItem = agent.Storage.getItem(
      //     this.props.ProfileStore.profile.userId
      //   )
      //   console.log('EXISTING ANSWERS', localStorageItem)
      //   if (localStorageItem) {
      //     if (localStorageItem.answers) {
      //       this.props.PrePickStore.setAnswers(localStorageItem.answers)
      //     }
      //   }
      // }
    }
  }

  componentWillMount() {
    // if (!this.props.ProfileStore.profile.userName) {
    //   this.props.PrePickStore.pullData()
    // }

    //    this.props.ProfileStore.getProfile()
    //this.props.PrePickStore.setTokensTemp(200)
    //this.props.PrePickStore.setPointsTemp(1000)
    //this.props.LiveGameStore.initScript()
    this.props.LiveGameStore.gameFetch()
    // setTimeout(() => {
    //   this.props.LiveGameStore.gameStart()
    // }, 5000)
    //this.props.PlayStore.connectGameServer()
  }

  componentDidMount() {
    if (
      '/livegame' === (this.props.NavigationStore.location || '').toLowerCase()
    ) {
      window.addEventListener(
        'beforeunload',
        this.handleUnload.bind(this),
        true
      )
      this.props.AnalyticsStore.timeStart({
        page: 'LiveGame',
        isMainPage: true,
      })

      this.activityIndicator = <ActivityComponent size={4} />
      //this.countdown()
      this.next(1)

      if (!this.props.ProfileStore.err && !this.props.ProfileStore.isLoading) {
        this.initSwipeEventListeners()
      }

      // this.props.GameStore.connectSC();
    }
  }

  onClickTogglePlayHasStarted() {
    this.props.LiveGameStore.inProgress = !this.props.LiveGameStore.inProgress
  }

  handleLockout(val) {
    //let el = ReactDOM.findDOMNode(this.StatusPanel)
    let tab0 = document.getElementById('tab0')
    let tab1 = document.getElementById('tab1')
    let bgColor = 'transparent'
    if (this.StatusPanel) {
      bgColor = val ? '#000000' : 'transparent'
      TweenMax.set(this.StatusPanel, { backgroundColor: bgColor })
      TweenMax.set(tab0, { backgroundColor: bgColor })
      TweenMax.set(tab1, { backgroundColor: bgColor })
    }
  }

  handleAnswered(evt, cb) {
    this.notifyPicksPointsTokens = evt.isNotify
    this.to = setTimeout(() => {
      this.notifyPicksPointsTokens = false
    }, 1250)
    this.cl = setTimeout(() => {
      cb()
    }, 500)
  }

  handleSplash() {
    new TimelineMax({ repeat: 0 })
      .to(this.refBlankContainer, 0.2, {
        zIndex: 100,
        opacity: 0.9,
        ease: Power1.easeIn,
      })
      .to(this.refBlankContainer, 0.2, {
        delay: 0.1,
        zIndex: 100,
        opacity: 0,
        ease: Power1.easeOut,
      })
      .set(this.refBlankContainer, {
        zIndex: -100,
      })
  }

  handleShowHistoryPending(mode, toggle, current) {
    if (this.HistoryPendingRef) {
      if (toggle) {
        if (this.isPendingPanelHidden) {
          this.isPendingPanelHidden = false
          TweenMax.to(this.HistoryPendingRef, 0.3, { y: '24%' })
        } else {
          this.isPendingPanelHidden = true
          TweenMax.to(this.HistoryPendingRef, 0.3, { y: '100%' })
        }
      } else {
        if (mode === 'show') {
          this.isPendingPanelHidden = false
          TweenMax.to(this.HistoryPendingRef, 0.3, { y: '24%' })
        } else {
          this.isPendingPanelHidden = true
          TweenMax.to(this.HistoryPendingRef, 0.3, { y: '100%' })
        }
      }
    }
  }

  getCommandHostActivePlay() {
    return this.props.CommandHostStore.currentPlay
  }

  getNextQuestion() {
    debugger
    let current = this.props.LiveGameStore.currentScriptItem

    if (
      current &&
      current.id === 1003 &&
      current.choices &&
      current.choices.length > 1
    ) {
      //--re this.next(1)
    }

    // while (current && !current.isQuestion) {
    //   current = current.next && current.next[0] ? current.next[0] : current.next
    // }
    return current
  }

  setCommandHostPreText() {
    if (
      this.props.CommandHostStore.currentPlay &&
      this.props.PrePickStore.multiplier === 0 &&
      !this.props.CommandHostStore.lockout
    ) {
      this.nextType = this.props.CommandHostStore.currentPlay.nextPlayType
      this.preText = this.props.CommandHostStore.currentPlay.shortHand
    }

    if (
      this.props.CommandHostStore.currentPlay &&
      this.props.CommandHostStore.currentPlay.type === 'Summary'
    ) {
      this.nextType = this.props.CommandHostStore.currentPlay.type
      this.preText = this.props.CommandHostStore.currentPlay.shortHand
    }
  }

  setCommandHostPreText1() {
    debugger
    if (
      this.props.CommandHostStore.currentPlay &&
      this.props.PrePickStore.multiplier === 0 &&
      !this.props.CommandHostStore.lockout
    ) {
      this.nextType = this.props.CommandHostStore.currentPlay.type
      this.preText = this.props.CommandHostStore.currentPlay.shortHand
    }

    if (
      this.props.CommandHostStore.currentPlay &&
      this.props.CommandHostStore.currentPlay.type === 'Summary'
    ) {
      this.nextType = this.props.CommandHostStore.currentPlay.type
      this.preText = this.props.CommandHostStore.currentPlay.shortHand
    }
  }

  setPreText() {
    if (
      this.props.PrePickStore.multiplier === 0 &&
      !this.props.LiveGameStore.inProgress
    ) {
      this.nextType = this.props.LiveGameStore.getNextType(
        this.props.LiveGameStore.currentScriptItem.nextId
      )
      let shortHand = this.props.LiveGameStore.currentScriptItem.shortHand
      //if (this.props.LiveGameStore.currentScriptItem.stars > 0) {
      //  this.preText = shortHand + ' STAR'
      //} else {
      this.preText = shortHand
      //}
    }
  }

  getType(cur) {
    if (!cur) {
      return 'LivePlay'
    }
    switch (cur.componentName) {
      case 'GameMasterQuestion':
        return 'GameMaster'
      case 'SponsorQuestion':
        return 'Sponsor'
      case 'AdvertisementQuestion':
        return 'Prize'
      case 'ExtraPointQuestion':
        return 'ExtraPoint'
      case 'Summary':
        return 'Summary'
      default:
        return 'LivePlay'
    }
  }

  handleBackground(img) {
    let bg = ''
    try {
      bg = require('@/assets/images/' + img)
    } catch (e) {
      bg = bgDefault
    }

    if (this.refBackground) {
      TweenMax.to(this.refBackground, 0.3, {
        backgroundImage: 'url(' + bg + ')',
      })
    }
  }

  render() {
    let { isLoading, profile, err } = this.props.ProfileStore
    let {
      latestResolvedPlay,
      pendingPlayCount,
      isAuthenticated,
      isSessionAvailable,
    } = this.props.CommandHostStore

    if (!isSessionAvailable) {
      return (
        <Container>
          <SessionAvailable>
            <Text font="pamainregular" size="4" color="#ffffff" uppercase>
              session unavailable
            </Text>
          </SessionAvailable>
        </Container>
      )
    }

    if (this.props.CommonStore.isLoading || (isLoading && !err)) {
      return <Container />
    }

    const current = this.getCommandHostActivePlay()
    this.setCommandHostPreText()

    return (
      <Container>
        {this.activityIndicator}

        <BackgroundWrapper innerRef={c => (this.refBackground = c)} />
        <BlankContainer innerRef={c => (this.refBlankContainer = c)} />
        {/*
        <ImaginaryContainer>
          <TogglePlayInProgress
            onClick={this.onClickTogglePlayHasStarted.bind(this)}
          />
        </ImaginaryContainer>
*/}
        <ContentWrapper>
          <StatusPanelWrapper
            innerRef={ref => {
              this.StatusPanel = ref
            }}
          >
            <StatusPanel />
          </StatusPanelWrapper>

          <BodyWrapper>
            <Content
              innerRef={ref => (this.LiveGameIndexContent = ref)}
              id={'LiveGameIndexContent'}
            >
              <LiveGameQuestions
                questionBackground={this.handleBackground.bind(this)}
                isLockout={this.handleLockout.bind(this)}
                answered={this.handleAnswered.bind(this)}
                splash={this.handleSplash.bind(this)}
                proceedToVideoScreen={this.next.bind(this, 2)}
              />
            </Content>

            <StepWrapper innerRef={ref => (this.StepWrapper = ref)}>
              <Step
                key={0}
                innerRef={c => (this[`step0`] = c)}
                onClick={this.next.bind(this, 0)}
              />
              <Step
                key={1}
                innerRef={c => (this[`step1`] = c)}
                onClick={this.next.bind(this, 1)}
              />
              <Step
                key={2}
                innerRef={c => (this[`step2`] = c)}
                onClick={this.next.bind(this, 2)}
              />
            </StepWrapper>
            <TabWrapper innerRef={ref => (this.TabWrapper = ref)}>
              <TabInnerWrapper innerRef={c => (this.refTabs = c)}>
                <Tab grab key={0} innerRef={c => (this['tab0'] = c)} id="tab0">
                  <FirstTab switchToLive={this.next.bind(this, 2)} />
                </Tab>
                <Tab key={1} innerRef={c => (this['tab1'] = c)} id="tab1">
                  {isAuthenticated ? (
                    <HistoryTrackerWrapper>
                      <HistoryTrackerPrimary>
                        <HistoryTracker
                          mode={'live'}
                          //preText={current ? current.shortHand : null}
                          preText={this.preText || ''}
                          symbol={this.getType(current)}
                          nextSymbol={this.nextType}
                        />
                        <PendingCounterWrapper>
                          <PendingCounter
                            onClick={this.handleShowHistoryPending.bind(
                              this,
                              'show',
                              true,
                              current
                            )}
                          >
                            <PendingCounterCircle>
                              {pendingPlayCount}
                            </PendingCounterCircle>
                            <PlayPointsText>PENDING</PlayPointsText>
                          </PendingCounter>
                          <LatestResolvePlayUIWrapper
                            innerRef={ref =>
                              (this.LatestResolvePlayUIRef = ref)
                            }
                          >
                            <LatestResolvedPlayUI
                              resolvedPlay={latestResolvedPlay}
                            />
                          </LatestResolvePlayUIWrapper>
                        </PendingCounterWrapper>
                      </HistoryTrackerPrimary>
                      <HistoryTrackerSecondary
                        innerRef={ref => (this.HistoryPendingRef = ref)}
                      >
                        <UpDownSwipeLineImage src={HorizontalLineIcon} />
                        <HistoryTracker
                          mode={'live'}
                          preText={this.preText || ''}
                          symbol={this.getType(current)}
                          nextSymbol={this.nextType}
                          filter={'pending'}
                          pendingPlays={this.props.PrePickStore.answers.filter(
                            o => o.isPending || !o.ended
                          )}
                        />
                      </HistoryTrackerSecondary>
                    </HistoryTrackerWrapper>
                  ) : null}
                </Tab>
                <Tab grab key={2} innerRef={c => (this['tab2'] = c)} id="tab2">
                  {this.props.GameStore.videoPath ? <ThirdTab /> : null}
                </Tab>
              </TabInnerWrapper>
            </TabWrapper>
            <TokenContainer innerRef={ref => (this.history = ref)}>
              <Token>
                <PointsAndTokens
                  question={this.props.LiveGameStore.currentScriptItem}
                  currentPrePick={0}
                  isNotified={this.notifyPicksPointsTokens}
                  picksPointsTokensCallback={() => {}}
                />
              </Token>
            </TokenContainer>
          </BodyWrapper>
        </ContentWrapper>
      </Container>
    )
  }
}

const TokenContainer = styled.div`
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0%;
  right: 0%;
`
const Token = styled.div`
  height: 100%;
  width: inherit;
  padding-right: 5%;
`

const HistoryTrackerWrapper = styled.div`
  padding-top: ${props => responsiveDimension(0.5)};
  width: inherit;
  height: inherit;
  position: absolute;
  display: flex;
`

const HistoryTrackerPrimary = styled.div`
  position: absolute;
  width: 100%;
  height: inherit;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
`

const HistoryTrackerSecondary = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #000000;
  transform: translateY(100%);
  z-index: 8;
`

const UpDownSwipeLineImage = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(2)};
  display: flex;
  justify-content: center;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(8)};
    height: ${props => responsiveDimension(2)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
  }
`

const LatestResolvedPlayContainer = styled.div`
  width: 25%
  color: white;
  background-color: rgba(240,216,16, 0.3);
  display: flex;
  padding-top: ${props => responsiveDimension(15)};
`
const PendingCounterWrapper = styled.div`
  position: relative;
  width: 25%;
  margin-top: 25%;
  z-index: 10;
`
const PendingCounter = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => responsiveDimension(LatestResolvedPlayHeight)};
  border-top-left-radius: ${props =>
    responsiveDimension(LatestResolvedPlayHeight)};
  border-bottom-left-radius: ${props =>
    responsiveDimension(LatestResolvedPlayHeight)};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${props => responsiveDimension(0.4)};
  background-color: #666666;
`

const LatestResolvedPlayHeight = 5.5

const LatestResolvePlayUIWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(LatestResolvedPlayHeight)};
  position: absolute;
  transform: translateX(100%);
`

const LatestResolvedPlayUIContainer = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => responsiveDimension(LatestResolvedPlayHeight)};
  border-top-left-radius: ${props =>
    responsiveDimension(LatestResolvedPlayHeight)};
  border-bottom-left-radius: ${props =>
    responsiveDimension(LatestResolvedPlayHeight)};
  background-color: ${props =>
    props.nowin ? '#666666' : props.backgroundColor};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${props => responsiveDimension(props.borderColor ? 0.3 : 0.4)};

  ${props =>
    props.borderColor
      ? `
      border-left: ${responsiveDimension(0.3)} solid ${props.borderColor};
      border-top: ${responsiveDimension(0.3)} solid ${props.borderColor};
      border-bottom: ${responsiveDimension(0.3)} solid ${props.borderColor};
    `
      : ''};
`

const PendingCounterCircle = styled.div`
  width: ${props => responsiveDimension(4.6)};
  height: ${props => responsiveDimension(4.6)};
  border-radius: ${props => responsiveDimension(4.6)};
  background-color: #000000;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.2)};
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  padding-top: ${props => responsiveDimension(0.3)};
`

const PlayIcon = styled.div`
  width: ${props => responsiveDimension(props.bordered ? 4.3 : 4.6)};
  height: ${props => responsiveDimension(props.bordered ? 4.3 : 4.6)};
  border-radius: ${props => responsiveDimension(props.bordered ? 4.3 : 4.6)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(props.bordered ? 4.3 : 4.6)};
    height: ${props => responsiveDimension(props.bordered ? 4.3 : 4.6)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
  }
`

const PlayPointsText = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  color: ${props => (props.nowin ? '#afafaf' : props.color || '#ffffff')};
  text-transform: uppercase;
  padding-left: ${props => responsiveDimension(1)};
`

const Container = styled.div`
  position: relative;
  animation: 0.25s ${props => fadeInAnimation} forwards;
  margin: 0 auto;
  overflow: hidden;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`
const fadeInAnimation = keyframes`
  0% { opacity:0; }
  100% { opacity:1; }
`

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const BackgroundWrapper = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-filter: grayscale(1);
  filter: grayscale(1);
`
const BlankContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: -100;
  background-color: #ffffff;
  opacity: 0;
`
const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
`

const ContentNav = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const StatusPanelWrapper = styled.div`
  width: inherit:
  height: inherit;
`

const BodyWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const StepWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(2.5)};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #565859;
  position: relative;
  z-index: 99;
`
const Step = styled.span`
  height: ${props => responsiveDimension(4)};
  width: ${props => responsiveDimension(4)};
  background-color: #919594;
  border: none;
  border-radius: 50%;
  display: inline-block;
  z-index: 1;
  margin-right: ${props => responsiveDimension(3.5)};
  &:hover {
    cursor: pointer;
  }
  &.active {
    background-color: #ffffff;
  }
`
const StepORIG = styled.span`
  height: ${props => responsiveDimension(2.2)};
  width: ${props => responsiveDimension(2.2)};
  background-color: #919594;
  border: none;
  border-radius: 50%;
  display: inline-block;
  z-index: 1;
  margin-right: ${props => responsiveDimension(3.5)};
  &:hover {
    cursor: pointer;
  }
  &.active {
    background-color: #ffffff;
  }
`
const TabWrapper = styled.div`
  width: 100%;
  height: ${props =>
    IsMobile && isInStandaloneMode()
      ? 70
      : IsTablet && isInStandaloneMode()
      ? 90
      : 80}%;
  position: relative;
  display: flex;
  background-color: transparent;
  overflow: hidden;
`

const TabCount = 3

const TabInnerWrapper = styled.div`
  position: absolute;
  display: flex;
  width: calc(100% * ${props => TabCount});
  //height: fill-available;
  height: 100%;
  z-index: 1; /* to put infront of the points and tokens div */
`

const Tab = styled.div`
  display: inline-block;
  width: calc(100% / ${props => TabCount});
  height: 100%;
  &:hover {
    cursor: ${props => (props.grab ? '-moz-grab' : '')};
    cursor: ${props => (props.grab ? '-webkit-grab' : '')};
    cursor: ${props => (props.grab ? 'grab' : '')};
  }
  &:active {
    cursor: ${props => (props.grab ? '-moz-grabbing' : '')};
    cursor: ${props => (props.grab ? '-webkit-grabbing' : '')};
    cursor: ${props => (props.grab ? 'grabbing' : '')};
  }
`

const SponsorActiveTokensWrapper = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${props => responsiveDimension(1)};
`
const ActivePoints = styled.div`
  height: inherit;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  color: ${props => (props.nowin ? '#afafaf' : props.color || '#ffffff')};
  display: flex;
  justify-content: center;
  align-items: center;
`
const TokenWrapper = styled.div`
  height: 100%;
  margin-left: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.4)};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TokenImg = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props =>
    props.adjustWidth
      ? responsiveDimension(props.size + 0.1)
      : responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
`
const Faded = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left)};
  z-index: ${props => props.index};
`

const MenuWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  z-index: 1;
`

const ImaginaryContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 2%;
  z-index: 100;
  bottom: 0;
`
const TogglePlayInProgress = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  &:hover {
    background: ${hex2rgb('#f46e42', 0.1)};
  }
`

const SessionAvailable = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  line-height: ${props => props.lineheight || 1};
  letter-spacing: ${props => responsiveDimension(0.1)};
  ${props => (props.uppercase ? `text-transform: uppercase;` : '')};
`

let LatestResolvedPlayUI = props => {
  let { resolvedPlay } = props
  const resolvedType = resolvedPlay ? resolvedPlay.type : 'LivePlay'
  let resolvedPoints =
    resolvedPlay && resolvedPlay.shortHand
      ? resolvedPlay.shortHand === 'NO POINTS' || resolvedPlay.shortHand === '0'
        ? 'NO WIN'
        : `+${resolvedPlay.shortHand}`
      : 'NO WIN'
  const withBorder = resolvedType !== 'Sponsor' ? true : false
  const nowin = resolvedPoints === 'NO WIN'
  const stars =
    resolvedPlay &&
    resolvedPlay.livegameAnswers.length > 0 &&
    resolvedPlay.livegameAnswers[0].stars
      ? resolvedPlay.livegameAnswers[0].stars
      : 0

  if (stars) {
    return (
      <LatestResolvedPlayUIContainer nowin={nowin} backgroundColor={'#eede16'}>
        <PlayIcon src={StarIconDark} />
        <PlayPointsText nowin={nowin} color={'#231F20'}>
          {resolvedPoints}
        </PlayPointsText>
      </LatestResolvedPlayUIContainer>
    )
  } else if (resolvedType === 'Sponsor') {
    return (
      <LatestResolvedPlayUIContainer
        nowin={nowin}
        borderColor={resolvedType === 'Sponsor' ? '#ffb600' : ''}
        backgroundColor={'#000000'}
      >
        <PlayIcon
          backgroundColor={'#ffffff'}
          bordered={withBorder}
          src={PlayIcons[resolvedType]}
        />
        <SponsorActiveTokensWrapper>
          <ActivePoints nowin={nowin} color={'#ffb600'}>
            {resolvedPoints}
          </ActivePoints>
          <TokenWrapper style={{ marginTop: responsiveDimension(0.5) }}>
            <TokenImg src={TokenIcon} size={2} index={3} />
            <Faded index={2} size={2} color={'#6d6c71'} left={-1.8} />
            <Faded index={1} size={2} color={'#33342f'} left={-1.8} />
          </TokenWrapper>
        </SponsorActiveTokensWrapper>
      </LatestResolvedPlayUIContainer>
    )
  } else {
    return (
      <LatestResolvedPlayUIContainer
        nowin={nowin}
        backgroundColor={PlayTypeColor[resolvedType]}
      >
        <PlayIcon backgroundColor={'#ffffff'} src={PlayIcons[resolvedType]} />
        <PlayPointsText nowin={nowin}>{resolvedPoints}</PlayPointsText>
      </LatestResolvedPlayUIContainer>
    )
  }
}
