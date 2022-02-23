import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled from 'styled-components'
import Background from '@/assets/images/playalong-default.jpg'
import { TweenMax, Power0, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import iconMenu from '@/assets/images/icon-menu.svg'
import iconMenuPlayalong from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import iOSAddIcon from '@/assets/images/icon-ios-add.png'
import iOSUploadIcon from '@/assets/images/icon-ios-upload.png'
import androidDots from '@/assets/images/icon-android-dots.svg'
import ReturnButtonDefaultIcon from '@/assets/images/return-button-default.svg'
import Menu from '@/Components/Menu'
import * as util from '@/utils'
import {
  vwToPx,
  maxWidth,
  responsiveDimension,
  IsMobile,
  IsTablet,
  IsAndroid,
  isIos,
  isInStandaloneMode,
} from '@/utils'
import BlackCurtain from '@/assets/images/playalong-default.jpg'
import background from '@/assets/images/sportoco-bg-ambassadors-basic.jpg'
import Player from '@/assets/images/sportoco-bg-ambassadors-player.png'
import ResetDatabase from '@/Components/Common/ResetDatabase'
import Breadcrumbs from '@/Components/Main/Breadcrumbs'
import OwnLogin from '@/Components/Common/OwnLogin'
import AuthSequence from '@/Components/Auth'
import PaActivityComponent from '@/Components/Common/PaActivityComponent'
import ForgotPassword from '../Auth/ForgotPassword'

@inject(
  'UserStore',
  'NavigationStore',
  'ProfileStore',
  'PrePickStore',
  'LiveGameStore',
  'StarBoardStore',
  'ResolveStore',
  'CommandHostStore',
  'CommonStore'
)
@observer
class Main extends Component {
  constructor(props) {
    super(props)

    this.props.CommandHostStore.connectSC()

    extendObservable(this, {
      show: false,
      padding: 0,
      backgroundRef: null,
      timer: 0,
      serverTimeOutError: {
        text: 'reload',
        reloading: false,
      },
      tooltipAddHomeScreen: null,
      viewKey: null,
    })

    this.tooltipAddHomeScreen = !isInStandaloneMode() ? (
      <PopupAddHomeScreenWrap
        innerRef={ref => (this.refPopupAddHomeScreen = ref)}
      >
        <Tooltip>
          <img
            key={`tooltip-img-1`}
            src={iOSAddIcon}
            height={responsiveDimension(6)}
            style={{
              marginLeft: responsiveDimension(2),
              marginRight: responsiveDimension(2),
            }}
          />
          <TooltipTextWrap key={`tooltip-wrap`}>
            <TooltipText>
              Install this webapp on your {isIos() ? 'iPhone' : 'Android'}:
              tap&nbsp;
              <img
                key={`tooltip-img-2`}
                src={isIos() ? iOSUploadIcon : androidDots}
                height={responsiveDimension(isIos() ? 3 : 2)}
                style={{
                  marginLeft: responsiveDimension(0.5),
                  marginRight: responsiveDimension(0.5),
                }}
              />
              &nbsp;and then Add to Home Screen.
            </TooltipText>
          </TooltipTextWrap>
        </Tooltip>
      </PopupAddHomeScreenWrap>
    ) : null

    this.timeoutTooltopAddToHomeScreen = setTimeout(() => {
      this.tooltipAddHomeScreen = null
    }, 10000)

    this.viewKey = `View-${Math.random()}`

    this.destroyResetDatabase = intercept(
      this.props.CommandHostStore,
      'isResetDatabase',
      change => {
        if (change.newValue) {
          if (this.refResetDatabaseContainer) {
            this.forceUpdate()
            TweenMax.set(this.refResetDatabaseContainer, {
              opacity: 1,
              zIndex: 100,
            })
          }
        } else {
          if (this.refResetDatabaseContainer) {
            TweenMax.set(this.refResetDatabaseContainer, {
              opacity: 0,
              zIndex: -100,
            })
          }
        }
        return change
      }
    )

    this.destroyUserProfile = intercept(
      this.props.CommandHostStore,
      'isAuthenticated',
      change => {
        if (change.newValue) {
          const queryString = new URLSearchParams(window.location.search)
          if (queryString.has('gameId')) {
            this.props.CommandHostStore.setAuthenticated(false)
            this.props.NavigationStore.queryString.gameId = queryString.get(
              'gameId'
            )
            if (queryString.has('stage')) {
              this.props.NavigationStore.queryString.stage = queryString.get(
                'stage'
              )
            }
            if (queryString.has('isLeap')) {
              this.props.NavigationStore.queryString.isLeap = queryString.get(
                'isLeap'
              )
            }

            this.props.NavigationStore.setCurrentView('/livegameinit')
          }
        }
        return change
      }
    )
  }

  handleMouseDown() {
    if (this.check) {
      clearInterval(this.check)
    }
    this.check = setInterval(() => {
      ++this.timer
      if (this.timer > 0) {
        clearInterval(this.check)
      }
    }, 200)
  }

  handleMouseUp() {
    clearInterval(this.check)
    if (this.timer <= 0) {
      this.show = true
    }
    this.timer = 0
  }

  closeMenu() {
    this.refMenu.className = this.refMenu.className.replace('open', '')
    TweenMax.to(this.refTopNav, 0.5, {
      x: '0%',
    })
    TweenMax.to(this.refMenu, 0.5, { x: '126%' })
    if (this.refMenuBlocker) {
      TweenMax.to(this.refMenuBlocker, 0.5, { x: '101%' })
    }
  }

  initSlideEventMenuDesktop() {
    let startX
    let isDown = false

    if (!this.refMenu) {
      return
    }

    this.refMenu.addEventListener('mousedown', e => {
      isDown = true
      startX = e.screenX + this.refMenu.offsetLeft
    })

    this.refMenu.addEventListener('mousemove', e => {
      if (!isDown) {
        return false
      }

      let over =
        e.screenX > this.MainFrame.offsetWidth
          ? e.screenX - this.MainFrame.offsetWidth
          : e.screenX
      if (over >= this.MainFrame.offsetWidth - 20) {
        isDown = false
        this.closeMenu()
      }

      let change = startX - e.screenX
      if (change > 0) {
        return false
      }

      TweenMax.to(this.refTopNav, 0, { x: -change })
      TweenMax.to(this.refMenu, 0, { x: -change })
    })

    this.refMenu.addEventListener('mouseup', e => {
      isDown = false

      let x = this.refMenu.offsetWidth
      let change = startX - e.screenX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.refMenu.offsetWidth / 2
      } else {
        threshold = x - this.refMenu.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        this.refMenu.className = this.refMenu.className.replace('open', '')
        TweenMax.to(this.refTopNav, 0.5, {
          x: '0%',
        })
        TweenMax.to(this.refMenu, 0.5, { x: '126%' })
        if (this.refMenuBlocker) {
          TweenMax.to(this.refMenuBlocker, 0.5, { x: '101%' })
        }
      } else {
        if (!this.refMenu.classList.contains('open')) {
          this.refMenu.className += ' open'
        }
        TweenMax.to(this.refTopNav, 0.5, {
          x: '-80%',
        })
        TweenMax.to(this.refMenu, 0.5, { x: '25%' })
      }
    })

    this.refMenu.addEventListener('mouseleave', e => {
      if (!isDown) {
        return false
      }

      isDown = false

      let x = this.refMenu.offsetWidth
      let change = startX - e.screenX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.refMenu.offsetWidth / 2
      } else {
        threshold = x - this.refMenu.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        this.refMenu.className = this.refMenu.className.replace('open', '')
        TweenMax.to(this.refTopNav, 0.5, {
          x: '0%',
        })
        TweenMax.to(this.refMenu, 0.5, { x: '126%' })
        if (this.refMenuBlocker) {
          TweenMax.to(this.refMenuBlocker, 0.5, { x: '101%' })
        }
      } else {
        if (!this.refMenu.classList.contains('open')) {
          this.refMenu.className += ' open'
        }
        TweenMax.to(this.refTopNav, 0.5, {
          x: '-80%',
        })
        TweenMax.to(this.refMenu, 0.5, { x: '25%' })
      }
    })
  }

  initSlideEventMenuMobile() {
    let startX
    let isDown = false

    if (!this.refMenu) {
      return
    }

    this.refMenu.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX + this.refMenu.offsetLeft
    })

    this.refMenu.addEventListener('touchmove', e => {
      let change = startX - e.touches[0].clientX
      if (change > 0) {
        return
      }
      TweenMax.to(this.refTopNav, 0, { x: -change })
      TweenMax.to(this.refMenu, 0, { x: -change })
    })

    this.refMenu.addEventListener('touchend', e => {
      isDown = false

      let x = this.refMenu.offsetWidth
      let change = startX - e.changedTouches[0].clientX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.refMenu.offsetWidth / 2
      } else {
        threshold = x - this.refMenu.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        this.refMenu.className = this.refMenu.className.replace('open', '')
        TweenMax.to(this.refTopNav, 0.5, {
          x: '0%',
        })
        TweenMax.to(this.refMenu, 0.5, { x: '126%' })
        if (this.refMenuBlocker) {
          TweenMax.to(this.refMenuBlocker, 0.5, { x: '101%' })
        }
      } else {
        if (!this.refMenu.classList.contains('open')) {
          this.refMenu.className += ' open'
        }
        TweenMax.to(this.refTopNav, 0.5, {
          x: '-80%',
        })
        TweenMax.to(this.refMenu, 0.5, { x: '25%' })
      }
    })
  }

  toggleMenu() {
    if (this.refMenu.classList.contains('open')) {
      this.refMenu.className = this.refMenu.className.replace('open', '')
      TweenMax.to(this.refTopNav, 0.5, {
        x: '0%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      TweenMax.to(this.refMenu, 0.5, {
        x: '126%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      if (this.refMenuBlocker) {
        TweenMax.to(this.refMenuBlocker, 0.5, { x: '101%' })
      }
    } else {
      this.refMenu.className += ' open'
      TweenMax.to(this.refTopNav, 0.5, {
        x: '-80%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      TweenMax.to(this.refMenu, 0.5, {
        x: '25%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      })
      if (this.refMenuBlocker) {
        TweenMax.to(this.refMenuBlocker, 0.5, { x: '0%' })
      }
    }
  }

  showMenu() {
    if (this.refMenu.classList.contains('open')) {
      this.refMenu.className = this.refMenu.className.replace('open', '')
      TweenMax.to(this.refTopNav, 0.5, {
        //right: 0
        x: '0%',
      })
      TweenMax.to(this.refMenu, 0.5, {
        //right: '-80%',
        x: '0%',
        onComplete: () => {
          this.show = false
        },
      })
    } else {
      this.refMenu.className += ' open'
      TweenMax.to(this.refTopNav, 0.5, {
        //right: '80%'
        x: '-80%',
      })
      TweenMax.to(this.refMenu, 0.5, {
        //right: 0,
        x: '-100%',
      })
      this.show = true
    }
  }

  componentDidMount() {
    const validImages = [background, Player]

    util.loadImagesSelectedUponPageLoad(validImages, next => {
      if (next) {
        setTimeout(() => this.executeAnim(), 1000)
      }
    })
  }

  executeAnim() {
    if (this.hamburger) {
      this.padding = this.hamburger.offsetWidth
    }
    this.isRunning = false
    this.props.NavigationStore.history.listen(() => {
      if (!this.isRunning) {
        this.moveBackground()
      }
    })
    this.moveBackground()
    this.initSlideEventMenuDesktop()
    this.initSlideEventMenuMobile()
  }

  moveBackground() {
    if (this.shouldMakeBackground()) {
      this.isRunning = true
      TweenMax.fromTo(
        this.PlayerImg,
        4,
        {
          left: '120%',
          height: '40%',
          top: '17vh',
        },
        {
          left: '-60%',
          height: '90%',
          ease: Power0.easeNone,
        }
      )
      TweenMax.fromTo(
        this.PlayerImg,
        1.5,
        { opacity: 0 },
        {
          opacity: 0.75,
          onComplete: () => {
            TweenMax.fromTo(
              this.PlayerImg,
              3.5,
              { opacity: 0.75 },
              { opacity: 0 }
            )
          },
        }
      )

      TweenMax.fromTo(
        this.backgroundRef,
        17,
        {
          backgroundPositionX: `100%`,
        },
        {
          backgroundPositionX: `0%`,
          ease: Power0.easeIn,
        }
      )
      TweenMax.to(this.backgroundRef, 3, { delay: 14, opacity: 0 })
    }
  }

  shouldMakeBackground() {
    return (
      [
        'init2',
        '/login',
        '/register',
        '/signup',
        '/keycode',
        '/forgotpassword',
      ].indexOf(this.props.NavigationStore.location) > -1
    )
  }

  shouldShowBannerIndex() {
    return (
      ['keysandtokens', '/prizechest', '/socialsetting', '/profile'].indexOf(
        this.props.NavigationStore.location
      ) > -1
    )
  }

  navHome = () => {
    this.toGameState()
  }

  componentWillUnmount() {
    this.destroyResetDatabase()
    if (this.timeoutTooltopAddToHomeScreen) {
      clearTimeout(this.timeoutTooltopAddToHomeScreen)
    }
    this.destroyUserProfile()
  }

  componentWillMount() {
    this.redirectToShareKey()
    this.redirectToInvitation()
    this.redirectToIntroScreen()
  }

  redirectToShareKey() {
    let shareQueryString = new URLSearchParams(window.location.search)
    if (shareQueryString.has('share')) {
      this.props.NavigationStore.setCurrentView('/outro')
      this.props.NavigationStore.setIsShareKeyScreen(true)
    }
  }

  redirectToInvitation() {
    let inviteQueryString = new URLSearchParams(window.location.search)
    if (inviteQueryString.has('key')) {
      if (inviteQueryString.get('key')) {
        this.props.ProfileStore.setInvitationKey(inviteQueryString.get('key'))
        this.props.NavigationStore.setCurrentView('/invitation')
      }
    }
  }

  redirectToIntroScreen() {
    if (this.props.NavigationStore.location === '/signup') {
      this.props.NavigationStore.setCurrentView('/init')
    }
  }

  requireLogin() {
    if (
      this.props.NavigationStore.location !== 'init' &&
      this.props.NavigationStore.location !== 'init2' &&
      this.props.NavigationStore.location !== '/signup' &&
      this.props.NavigationStore.location !== '/login' &&
      this.props.NavigationStore.location !== '/keycode'
    ) {
      if (!this.props.ProfileStore.profile.userId) {
        TweenMax.set(this.refRequireLogin, { opacity: 1, zIndex: 100 })
      }
    }
  }

  toGameState() {
    if (this.MenuItemViewInterrupt) {
      TweenMax.to(this.MenuItemViewInterrupt, 0.5, {
        x: '101%',
        onComplete: () => {
          this.props.NavigationStore.setLocationWhileOnGameState(null)
          this.props.NavigationStore.resetSubScreens()
        },
      })
    } else {
      this.props.NavigationStore.setLocationWhileOnGameState(null)
      this.props.NavigationStore.resetSubScreens()
    }
  }

  forceShowViewWhileOnGameState(response) {
    this.props.NavigationStore.setLocationWhileOnGameState(response.view)
  }

  handleCloseActiveMenuClick(elem) {
    if (elem) {
      this.props.NavigationStore.setCurrentView(elem.prev)
    }
  }

  renderHomeNav() {
    /*
    let currLocx = this.props.NavigationStore.bypassActiveMenu.filter(
      o => o.route === this.props.NavigationStore.location
    )[0]
*/
    let currLoc = this.props.NavigationStore.routes.filter(
      o => o.route === this.props.NavigationStore.location && o.canBeBypassed
    )[0]
    if (currLoc && !currLoc.through) {
      if (this.props.NavigationStore.locationWhileOnGameState) {
        TweenMax.to(this.MenuItemViewInterrupt, 0.3, { x: '0%' })
        return (
          <IconMenuPlayalong
            onClick={this.navHome}
            style={{ cursor: 'pointer' }}
            padding={this.padding}
            src={iconMenuPlayalong}
          />
        )
      } else {
        return (
          <IconMenuPlayalong
            style={{ cursor: 'default' }}
            padding={this.padding}
            src={iconMenuPlayalong}
          />
        )
      }
    } else {
      return (
        <IconMenuPlayalong
          style={{ cursor: 'default' }}
          padding={this.padding}
          src={iconMenuPlayalong}
        />
      )
    }
  }

  handleReloadClick() {
    this.serverTimeOutError.text = 'reloading...'
    if (this.refServerDisconnectedButton) {
      this.refServerDisconnectedButton.style.cursor = 'default'
      setTimeout(() => window.location.reload(true), 1000)
    }
  }

  toLogin() {
    TweenMax.set(this.refRequireLogin, { opacity: 0, zIndex: -100 })
    this.props.NavigationStore.setCurrentView('/signup')
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.viewKey = `View-${Math.random()}`
      this.forceUpdate()
    }
  }

  componentDidUpdate(nextProps) {
    //--this.requireLogin()
  }

  render() {
    let {
      ProfileStore,
      CommonStore,
      NavigationStore,
      ResolveStore,
      CommandHostStore,
    } = this.props

    /*
        if (!CommandHostStore.isAuthenticated && NavigationStore.isRequiredSocket) {
          return (
            <MainFrame>
              <AuthSequence mainHandleLoggedIn={this.handleIsLoggedIn.bind(this)} />
            </MainFrame>
          )
        }
    */
    if (!CommandHostStore.isAuthenticated && NavigationStore.isRequiredSocket) {
      return (
        <MainFrame>
          <PaActivityComponent size="4" withText />
        </MainFrame>
      )
    }

    if (
      CommonStore.isServerDisconnected &&
      this.props.NavigationStore.isRequiredSocket
    ) {
      return (
        <MainFrame>
          <ServerDisconnected
            reloadClick={
              this.serverTimeOutError.reloading
                ? null
                : this.handleReloadClick.bind(this)
            }
            text={this.serverTimeOutError.text}
            refButton={ref => (this.refServerDisconnectedButton = ref)}
          />
        </MainFrame>
      )
    }

    const View = NavigationStore.currentView
    const ViewWhileOnGameState = NavigationStore.currentViewWhileOnGameState
    const { showHeader } = NavigationStore
    const show = this.shouldMakeBackground()
    return (
      <MainFrame innerRef={ref => (this.MainFrame = ref)}>
        <ResetDatabaseContainer
          innerRef={ref => (this.refResetDatabaseContainer = ref)}
        >
          <ResetDatabase />
        </ResetDatabaseContainer>

        <ContentWrapper>
          {showHeader ? (
            <TopNav innerRef={c => (this.refTopNav = c)}>
              <TopNavContentSideBySide>
                <TopNavContentLeft>
                  <Breadcrumbs
                    MenuItemViewInterrupt={this.MenuItemViewInterrupt}
                    toGameState={this.toGameState.bind(this)}
                  />
                  {/*
                  {this.renderBackButton()
                  // <ProfileWrapper>
                  // <IconProfile src={iconProfile} />
                  // </ProfileWrapper>
                  }
*/}
                </TopNavContentLeft>
                <TopNavContentRight>
                  <IconMenuWrapper
                    innerRef={c => (this.hamburger = c)}
                    onClick={
                      this.props.ResolveStore.lockMenu
                        ? null
                        : this.toggleMenu.bind(this)
                    }
                    hidden={
                      window.location.search.includes('?forgotpassword=')
                        ? true
                        : false
                    }
                  >
                    <IconMenu
                      src={iconMenu}
                      hidden={
                        window.location.search.includes('?forgotpassword=')
                          ? true
                          : false
                      }
                    />
                  </IconMenuWrapper>
                </TopNavContentRight>
              </TopNavContentSideBySide>

              <TopNavContentMiddle>{this.renderHomeNav()}</TopNavContentMiddle>
            </TopNav>
          ) : null}
          <ContentNav>
            {/*
            {
              !CommandHostStore.isAuthenticated && NavigationStore.isRequiredSocket ? (
                <AuthSequence handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
              ) : null
            }
*/}
            <ViewWrapper>
              <MenuBlocker innerRef={c => (this.refMenuBlocker = c)} />
              <MenuItemViewInterrupt
                innerRef={ref => (this.MenuItemViewInterrupt = ref)}
              >
                {ViewWhileOnGameState ? (
                  <ViewWhileOnGameState
                    toGameState={this.toGameState.bind(this)}
                    forceShowView={this.forceShowViewWhileOnGameState.bind(
                      this
                    )}
                  />
                ) : null}
              </MenuItemViewInterrupt>
              <View
                key={this.viewKey}
                isFromMenu={this.props.NavigationStore.isFromMenu}
                toGameState={this.toGameState.bind(this)}
                isLoggedIn={CommandHostStore.isAuthenticated}
              />
              <Content background={BlackCurtain} show={show} />
              <Content
                innerRef={ref => (this.backgroundRef = ref)}
                show={show}
              />
              <PlayerImg
                innerRef={ref => (this.PlayerImg = ref)}
                src={Player}
                show={show}
              />
            </ViewWrapper>
          </ContentNav>
        </ContentWrapper>
        <MenuListWrapper
          innerRef={c => (this.refMenu = c)}
          id="menu-wrapper"
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
        >
          <Menu show={this.show} close={this.closeMenu.bind(this)} />
        </MenuListWrapper>

        {this.tooltipAddHomeScreen}
      </MainFrame>
    )
  }
}

export default Main

const Content = styled.div`
  background-image: url(${props => props.background || background});
  background-size: cover;
  background-position-x: 100%
  position: absolute;
  width: inherit;
  height: inherit;
  bottom: 0%;
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? 0 : -1)};
`

const PlayerImg = styled.img`
  height: 60%;
  position: absolute;
  top: ${props => responsiveDimension(17)};
  left: 100%;
  opacity: ${props => (props.show ? 1 : 0)};
  z-index: ${props => (props.show ? 0 : -1)};
`

const MainFrame = styled.div`
  width: ${props => (IsMobile || IsTablet ? vwToPx(100) : maxWidth)};
  height: ${props => util.maxHeight}
  position: relative;
  display: flex;
  margin: 0 auto;
  overflow: hidden;
`
const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
`
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
`
const ContentNav = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
`
const MenuBlocker = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 249;
  transform: translateX(101%);
`

const MenuListWrapper = styled.div`
  width: 80%;
  height: 100%;
  position: absolute;
  display: flex;
  z-index: 250;
  transform: translateX(126%);
  float: right;
`

const TopNav = styled.div`
  width: 100%;
  height: 6.8%;
  min-height: 6.8%;
  position: relative;
  display: flex;
  background-color: #000000;
  z-index: 201;
  div {
    flex-basis: 100%;
  }
`
const TopNavContentLeft = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  //justify-content: center;
  align-items: center;
  //padding-left: 3%;
`

const TopNavContentSideBySide = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: flex;
  width: 100%;
  height: 100%;
`
const TopNavContentMiddle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const TopNavContentRight = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`
const IconMenu = styled.img`
  width: ${props => responsiveDimension(2.7)};
`
const ProfileWrapper = styled.div`
  left: 0;
  width: ${props => responsiveDimension(5.4)};
  height: ${props => responsiveDimension(5.4)};
  border-radius: 50%;
  position: absolute;
  background: white;
  overflow: hidden;
  margin-left: 5%;
`
const IconMenuWrapper = styled.div`
  cursor: pointer;
  right: 0;
  width: ${props => responsiveDimension(5.5)};
  height: ${props => responsiveDimension(5.5)};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2%;
`
const IconProfile = styled.div`
  width: inherit;
  height: inherit;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`

const IconMenuPlayalong = styled.img`
  z-index: 1;
  height: ${props => responsiveDimension(4.5)};
`

const RequireLoginContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 0;
  z-index: -100;
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const Text = styled.span`
  color: ${props => props.color || '#ffffff'};
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
`
const TextLink = styled.div`
  color: ${props => props.color || '#ffffff'};
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  cursor: pointer;
`

const BackButtonWrapper = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  position: absolute;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-top: ${props => responsiveDimension(2)} solid transparent;
    border-bottom: ${props => responsiveDimension(2)} solid transparent;
    border-right: ${props =>
      `${responsiveDimension(2.5)} solid ${props.backgroundColor}`};
  }

  &:after {
    content: '${props => props.text}';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(2.3)};
    color: ${props => props.textColor};
    letter-spacing: ${props => responsiveDimension(0.1)};
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props => responsiveDimension(9)};
    height: ${props => responsiveDimension(4)};
    border-top-left-radius: ${props => responsiveDimension(0.1)};
    border-bottom-left-radius: ${props => responsiveDimension(0.1)};
    border-top-right-radius: ${props => responsiveDimension(0.2)};
    border-bottom-right-radius: ${props => responsiveDimension(0.2)};
    background: ${props => props.backgroundColor};
    padding-top: 1%;
  }
`

const BackButtonDefault = styled.div`
  width: ${props => responsiveDimension(12)};
  height: inherit;
  position: absolute;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;

  &:after {
    content: '${props => props.text}';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(2.3)};
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: ${props => responsiveDimension(0.1)};
    padding-top: ${props => responsiveDimension(0.3)};
    padding-right: ${props => responsiveDimension(2)};
  }
`

const BackButton = styled.div`
  width: ${props => responsiveDimension(10)};
  height: ${props => responsiveDimension(4)};
  background: blue;

  /*
    border: 1px solid yellow;
      background: blue;
      display: inline-block;
      height: 55px;
      margin-left: 20px;
      margin-top: 55px;
      position: relative;
      width: 100px;

    &:before {
      border-bottom: 35px solid red;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      content: "";
      height: 0;
      left: 0;
      position: absolute;
      top: -35px;
      width: 0;
    }
*/
`

const ViewWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`
const MenuItemViewInterrupt = styled.div`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  z-index: 100;
  transform: translateX(101%);
`

const ResetDatabaseContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 0;
  z-index: -100;
`

const ServerDisconnected = props => {
  return (
    <ServerDisconnectedContainer>
      {/*
      <ServerErrorText>disconnected</ServerErrorText>
      <ServerErrorText>please check your connection</ServerErrorText>
      <ServerErrorText>and try again</ServerErrorText>
*/}
      <ServerErrorText>connection timeout</ServerErrorText>
      <ServerErrorButton innerRef={props.refButton} onClick={props.reloadClick}>
        {props.text}
      </ServerErrorButton>
    </ServerDisconnectedContainer>
  )
}

const ServerDisconnectedContainer = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.95);
`

const ServerErrorText = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4)};
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
  line-height: 1;
`

const ServerErrorButton = styled.div`
  width: ${props => responsiveDimension(24)};
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(0.3)};
  background-color: #17c5ff;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4)};
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: ${props => responsiveDimension(2)};
`

const PopupAddHomeScreenWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 1%;
  z-index: 1000;
  ${isIos() && IsMobile
    ? `bottom: ${responsiveDimension(-2)};`
    : isIos() && IsTablet
    ? `top: ${responsiveDimension(15)};`
    : IsAndroid
    ? `top: ${responsiveDimension(18)}`
    : ''};
`

const Tooltip = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 95%;
  background-color: #e6e7e8;
  border-radius: ${props => responsiveDimension(0.5)};
  padding: 10px 0;
  position: absolute;
  z-index: 1001;
  bottom: 150%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:after {
    content: "";
    position: absolute;
    ${
      isIos() && IsMobile
        ? `top: 100%;`
        : isIos() && IsTablet
        ? `bottom: 100%;`
        : IsAndroid
        ? `bottom: 100%;`
        : ''
    }
    border-width: ${props => responsiveDimension(2.5)};
    border-style: solid;
    border-color: ${props =>
      isIos() && IsMobile
        ? '#e6e7e8 transparent transparent transparent;'
        : isIos() && IsTablet
        ? 'transparent transparent #e6e7e8 transparent;'
        : IsAndroid
        ? 'transparent transparent #e6e7e8 transparent;'
        : ''};
    ${
      isIos() && IsMobile
        ? 'left: 50%;transform: translate(-50%);'
        : isIos() && IsTablet
        ? 'left: 84.5%;'
        : IsAndroid
        ? 'left: 90%; top: -45%;'
        : ''
    };

  }
`

const TooltipTextWrap = styled.div`
  display: flex;
  flex-direction: row;
`
const TooltipText = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.5)};
  color: #000000;
  padding-right: 4%;
`

const RequireLogin = props => {
  return (
    <RequireLoginContainer innerRef={props.reference}>
      <TextWrapper>
        <Text font={'pamainbold'} size={3}>
          Unauthorized: Access is denied due to invalid credentials.
        </Text>
      </TextWrapper>
      <TextWrapper>
        <Text font={'pamainbold'} size={3}>
          Click&nbsp;
        </Text>
        <TextLink
          font={'pamainbold'}
          size={3}
          color={'#0080ff'}
          onClick={props.handleToLogin}
        >
          here
        </TextLink>
        <Text font={'pamainbold'} size={3}>
          &nbsp;to signup
        </Text>
      </TextWrapper>
    </RequireLoginContainer>
  )
}

/**
 * BackButton Component
 */
@inject('NavigationStore')
@observer
class BackButtonComponent extends Component {
  constructor(props) {
    super(props)
  }

  handleCloseActiveMenuClick(elem) {
    if (elem) {
      this.props.NavigationStore.setCurrentView(elem.prev)
      this.props.NavigationStore.resetSubScreens()
    }
  }

  handleCloseCurrentSubScreen(activeSubScreen) {
    this.props.NavigationStore.removeSubScreen(activeSubScreen.key)
  }

  render() {
    let { subScreens } = this.props.NavigationStore

    if (subScreens && subScreens.length > 0) {
      const activeSubScreen = subScreens[subScreens.length - 1]
      return (
        <BackButtonDefault
          text={'return'}
          src={ReturnButtonDefaultIcon}
          onClick={this.handleCloseCurrentSubScreen.bind(this, activeSubScreen)}
        />
      )
    }

    /*
    let currLoc = this.props.NavigationStore.bypassActiveMenu.filter(
      o => o.route === this.props.NavigationStore.location
    )[0]
*/
    let currLoc = this.props.NavigationStore.routes.filter(
      o => o.route === this.props.NavigationStore.location && o.canBeBypassed
    )[0]
    if (currLoc && !currLoc.through) {
      if (this.props.NavigationStore.locationWhileOnGameState) {
        TweenMax.to(this.props.MenuItemViewInterrupt, 0.3, { x: '0%' })
        return (
          <BackButtonWrapper
            backgroundColor={currLoc.backButtonColor}
            textColor={currLoc.backButtonTextColor || '#ffffff'}
            text={currLoc.backButtonText}
            onClick={this.props.toGameState}
          />
        )
      } else {
        return null
      }
    }

    /**
     * Once prepick and livegame are done
     */
    if (this.props.NavigationStore.activeMenu && !currLoc) {
      let elem = this.props.NavigationStore.returnLocation

      return (
        <BackButtonDefault
          text={'return'}
          src={ReturnButtonDefaultIcon}
          onClick={this.handleCloseActiveMenuClick.bind(this, elem)}
        />
      )
    }

    return null
  }
}
