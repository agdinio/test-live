import { observable, action, computed } from 'mobx'
import CryptoJS from 'crypto-js'
import createHistory from 'history/createBrowserHistory'
import LiveGameStore from '@/stores/LiveGameStore'
import PrePickStore from '@/stores/PrePickStore'
import StarBoardStore from '@/stores/StarBoardStore'
import ResolveStore from '@/stores/ResolveStore'
import CommandHostStore from '@/stores/CommandHostStore'
import React from 'react'
import { attachSlidingPanelEvent } from '@/Components/PrizeBoard/Helper'
import { TweenMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import Background from '@/assets/images/playalong-default.jpg'
import agent from '@/Agent'
import ArrowBackIconBlack from '@/assets/images/header-icon-arrow-black.svg'
import ArrowBackIconWhite from '@/assets/images/header-icon-arrow-white.svg'
import Loadable from 'react-loadable'
import ActivityLoader from '@/Components/Common/ActivityLoader'
import { pageViewDetails } from '../Components/Auth/GoogleAnalytics'
class NavigationStore {
  defaultScreen = {
    route: '/followedgames',
    screen: Loadable({
      loader: () => import('@/Components/FollowedGames'),
      loading: () => null,
    }),
  }
  forgotScreen = {
    route: '/purchasetokens',
    screen: Loadable({
      loader: () => import('@/Components/PurchaseTokens'),
      loading: () => null,
    }),
  }
  @observable
  isFromMenu
  @observable
  history = createHistory()
  @observable
  location = sessionStorage.getItem('currentLocation')
    ? CryptoJS.AES.decrypt(
        sessionStorage.getItem('currentLocation').toString(),
        'NavigationStore'
      ).toString(CryptoJS.enc.Utf8)
    : window.location.search.includes('?forgotpassword=')
    ? this.forgotScreen.route
    : this.defaultScreen.route
  listen = this.history.listen(location => {
    if (location && location.state && location.state.path !== this.location) {
      console.log('location history', location)
      this.setCurrentView(location.state.path)
      /*
       * commented out. it causes iphone chrome crash
       */
      //this.history.goBack()
    }
  })

  authRoutes = [
    '/livegame',
    '/prepick',
    '/socialranking',
    '/prizeboard',
    '/outro',
    '/prizechest',
    '/keyreview',
    '/profile',
    '/sharestatus',
    '/wallet',
    '/resolve',
    '/starprize',
    '/globalranking',
    '/leaderboard',
  ]
  freeRoutes = ['/login', '/register', '/signup', '/keycode', '/prebegin']

  @computed
  get currentView() {
    let getloginUser = sessionStorage.getItem('email')
      ? sessionStorage.getItem('email')
      : sessionStorage.getItem('visitor')
    pageViewDetails(
      this.location.substring(1),
      this.location,
      this.location.substring(1),
      getloginUser
    )
    const route = this.routes.filter(
      o => o.route === this.location.toLocaleLowerCase()
    )[0]
    if (route && route.component) {
      return route.component
    } else {
      return this.defaultScreen.screen
    }
  }

  @computed
  get currentViewWhileOnGameState() {
    const route = this.routes.filter(
      o => o.route === (this.locationWhileOnGameState || '').toLocaleLowerCase()
    )[0]
    if (route && route.component) {
      return route.component
    } else {
      return null
    }
  }

  @computed
  get showHeader() {
    const screens = [
      'init',
      'init2',
      '/login',
      '/register',
      '/signup',
      '/keycode',
      '/prebegin',
      '/invitation',
    ]

    /*
    if (this.isRequiredSocket) {
      agent.GameServer.connectSC()
    }
*/

    return screens.indexOf(this.location.toLocaleLowerCase()) === -1
  }

  @computed
  get isRequiredSocket() {
    const socketRequired = this.routes.filter(
      o => o.route === this.location.toLowerCase() && o.isSocketRequired
    )[0]
    if (socketRequired) {
      return true
    }

    return false
  }

  setFreeRoute(name, isFromMenu) {
    this.resetSubScreens()
    this.locationWhileOnGameState = null

    this.isFromMenu = isFromMenu
    this.location = name
    this.history.push('', { path: name.toLocaleLowerCase() })
    try {
      sessionStorage.setItem(
        'currentLocation',
        CryptoJS.AES.encrypt(name.toLocaleLowerCase(), 'NavigationStore')
      )
    } catch (e) {}
  }

  @action
  setCurrentView(name, isFromMenu = false) {
    let currLoc = this.routes.filter(
      o => o.route === this.location && o.canBeBypassed
    )[0]

    if (currLoc) {
      if (currLoc.exemptedRoutes && currLoc.exemptedRoutes.length > 0) {
        const exemptedRoute = currLoc.exemptedRoutes.filter(o => o === name)[0]
        if (exemptedRoute) {
          this.setFreeRoute(name, isFromMenu)
          return
        }
      }

      this.locationWhileOnGameState = name === currLoc.route ? null : name
      return
    } else {
      this.setFreeRoute(name, isFromMenu)
    }
  }

  @observable
  isShareKeyScreen = false
  @action
  setIsShareKeyScreen(val) {
    this.isShareKeyScreen = val
  }

  @observable
  backScreen = ''
  @action
  setBackScreen(val) {
    this.backScreen = val
  }

  @observable
  locationWhileOnGameState = null
  @action
  setLocationWhileOnGameState(val) {
    this.locationWhileOnGameState = val
  }

  @observable
  activeMenu = null
  @action
  setActiveMenu(val) {
    this.activeMenu = val
  }

  @observable
  returnLocations = []

  @computed
  get returnLocation() {
    return this.returnLocations.filter(o => o.curr === this.activeMenu)[0]
  }

  @action
  pushReturnLocation(name) {
    let elemToRemove = this.returnLocations.filter(o => o.curr === name)[0]
    if (elemToRemove) {
      let idx = this.returnLocations.indexOf(elemToRemove)
      if (idx !== -1) {
        this.returnLocations.splice(idx, 1)
        let exists = this.returnLocations.filter(o => o.curr === name)[0]
        if (!exists) {
          this.returnLocations.push({ prev: this.location, curr: name })
        }
      } else {
        let exists = this.returnLocations.filter(o => o.curr === name)[0]
        if (!exists) {
          this.returnLocations.push({ prev: this.location, curr: name })
        }
      }
    } else {
      let exists = this.returnLocations.filter(o => o.curr === name)[0]
      if (!exists) {
        this.returnLocations.push({ prev: this.location, curr: name })
      }
    }
  }

  routes = [
    {
      route: '/outro',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#19d1bf',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/OutroScreen'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/wallet',
      backButtonText: '',
      backButtonTextColor: '#000000',
      backButtonColor: '#ffb200',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/Wallet'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/prizechest',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#946fa8',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/PrizeChest'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/prizeboard',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#7736dd',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/PrizeBoard'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/leaderboard',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#353773',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/LeaderBoard'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/sharestatus',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#0a69b8',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/ShareStatus'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/profile',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#06b7ff',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/Profile'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/starboard',
      backButtonText: '',
      backButtonTextColor: '#000000',
      backButtonColor: '#eede16',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/StarBoard'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/prepick',
      backButtonText: 'PRE PICKS',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#22ba2c',
      icon: ArrowBackIconWhite,
      through: false,
      isSocketRequired: true,
      canBeBypassed: true,
      exemptedRoutes: ['/followedgames', '/livegame'],
      component: Loadable({
        loader: () => import('@/Components/PrePick/PrePick'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/livegame',
      backButtonText: 'LIVE GAME',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#c61818',
      icon: ArrowBackIconWhite,
      through: false,
      isSocketRequired: true,
      exemptedRoutes: ['/followedgames'],
      canBeBypassed: true,
      component: Loadable({
        loader: () => import('@/Components/LiveGame'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/followedgames',
      backButtonText: 'FOLLOWED GAMES',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#c61818',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/FollowedGames'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/starprize',
      backButtonText: 'STAR',
      backButtonTextColor: '#000000',
      backButtonColor: '#eedf17',
      icon: ArrowBackIconBlack,
      through: false,
      canBeBypassed: true,
      component: Loadable({
        loader: () => import('@/Components/StarPrize'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/resolve',
      backButtonText: 'RESOLVE',
      backButtonColor: '#22ba2c',
      icon: ArrowBackIconWhite,
      through: false,
      canBeBypassed: true,
      component: Loadable({
        loader: () => import('@/Components/Resolve'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/purchasetokens',
      backButtonText: '',
      backButtonTextColor: '#000000',
      backButtonColor: '#ffb200',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/PurchaseTokens'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/instructions',
      backButtonText: '',
      backButtonTextColor: '#ffffff',
      backButtonColor: '#414042',
      icon: ArrowBackIconWhite,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/Instructions'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/gamehistory',
      backButtonText: '',
      backButtonTextColor: '#000000',
      backButtonColor: '#ffffff',
      icon: ArrowBackIconBlack,
      through: true,
      isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/GameHistory'),
        loading: ActivityLoader,
      }),
    },
    {
      route: '/livegameinit',
      backButtonText: '',
      backButtonTextColor: '#000000',
      backButtonColor: '#ffffff',
      icon: ArrowBackIconBlack,
      through: true,
      //isSocketRequired: true,
      component: Loadable({
        loader: () => import('@/Components/LiveGameInit'),
        loading: ActivityLoader,
      }),
    },
  ]

  @action
  resetBypassActiveMenu() {
    /*
    for (let i = 0; i < this.bypassActiveMenu.length; i++) {
      let elem = this.bypassActiveMenu[i]
      elem.through = false
    }
*/
    for (let i = 0; i < this.routes.length; i++) {
      let elem = this.routes[i]
      elem.through = false
    }
  }

  @action
  setPlayThroughOnActiveMenu(activeMenu) {
    let currRoute = this.routes.filter(
      o => o.route === activeMenu && o.canBeBypassed
    )[0]
    if (currRoute) {
      currRoute.through = true
    }
  }

  @observable
  subScreens = []
  @action
  addSubScreen(
    comp = this.isRequired('component'),
    displayName = this.isRequired('key'),
    noSlide,
    hasBackground,
    lockUserSwipe
  ) {
    new Promise(resolve => {
      let itemToAdd = React.createElement(
        'div',
        {
          id: displayName,
          key: displayName,
          style: {
            position: 'absolute',
            width: 'inherit',
            height: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            overflow: 'hidden',
            zIndex: 100 + this.subScreens.length,
            transform: noSlide ? 'translateX(0%)' : 'translateX(101%)',
            backgroundImage: hasBackground ? 'url(' + Background + ')' : null,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          },
        },
        comp
      )

      let items = []
      this.subScreens.forEach(item => {
        items.push(item)
      })

      items.push(itemToAdd)
      this.subScreens = items

      resolve(itemToAdd.key)
    }).then(key => {
      const el = document.getElementById(key)
      if (el) {
        if (!lockUserSwipe) {
          if (noSlide) {
            attachSlidingPanelEvent(el, key)
          } else {
            attachSlidingPanelEvent(el, key)
            TweenMax.to(el, 0.3, {
              x: '0%',
              ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
            })
          }
        }
      }
    })
  }
  @action
  removeSubScreen(key = this.isRequired('key'), noSlide) {
    if (!key) {
      return
    }

    let funcRemove = () => {
      const idx = this.subScreens.findIndex(o => o.key === key)
      if (idx > -1) {
        let items = []
        this.subScreens.forEach(item => {
          items.push(item)
        })

        items.splice(idx, 1)
        this.subScreens = items
      }
    }

    if (noSlide) {
      funcRemove()
    } else {
      const el = document.getElementById(key)
      if (el) {
        TweenMax.to(el, 0.3, {
          x: '100%',
          ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
          onComplete: () => {
            funcRemove()
          },
        })
      }
    }
  }
  @action
  closeAllSubscreens() {
    for (let i = 0; i < this.subScreens.length; i++) {
      this.removeSubScreen(this.subScreens[i].key)
    }
  }
  @action
  resetSubScreens() {
    this.subScreens = []
  }

  isRequired(p) {
    throw new Error('param ' + p + ' is required')
  }

  queryString = {
    userId: 0,
    gameId: '',
    stage: '',
    isLeap: false,
  }
}

export default new NavigationStore()
