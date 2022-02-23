import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable, intercept, runInAction } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, Ease } from 'gsap'
import {
  vhToPx,
  maxWidth,
  loadImagesUponPageLoad,
  vwToPx,
  responsiveDimension,
  dateTimeZone,
} from '@/utils'
import BannerIcon from '@/assets/images/menu-prize_boards-icon.svg'
//import Background from '@/assets/images/playalong-default.jpg'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import TokenIcon from '@/assets/images/playalong-token.svg'
import BigPrizeBoard from './BigPrizeBoard'
//import StarBoardFile from '@/Components/PrizeBoard/StarBoardFile'
import StarBoard from '@/Components/StarBoard'
import PrizeBoardIntro from './PrizeBoardIntro'
import Simple from '@/Components/PrizeBoard/Items/Simple'
import TokensIncluded from '@/Components/PrizeBoard/Items/TokensIncluded'
import PrizeList from '@/Components/PrizeBoard/PrizeList'
//import StarBannerIcon from '@/assets/images/star-icon-gold.svg'
import AuthSequence from '@/Components/PrizeBoard/PrizeList/Auth'
//import OwnLogin from '@/Components/Common/OwnLogin'
import MenuBanner from '@/Components/Common/MenuBanner'
import { eventCapture } from '../Auth/GoogleAnalytics'
@inject(
  'PrizeBoardStore',
  'NavigationStore',
  'ProfileStore',
  'StarBoardStore',
  'CommandHostStore',
  'GameStore',
  'AnalyticsStore'
)
@observer
export default class PrizeBoard extends Component {
  constructor(props) {
    super(props)

    //static only. local value only
    this.props.PrizeBoardStore.getBigPrizeBoardItems()

    //this.props.ProfileStore.getProfile()
    this.bannerType = null
  }

  handleMenuClick(menu) {
    this.MenuOptions(menu)
    eventCapture('prizeboard_menu', menu)
  }

  executeAnim() {
    if (this.Intro) {
      TweenMax.to(this.Intro, 0.3, {
        opacity: 0,
        zIndex: -100,
        delay: 1.5,
        onComplete: () => {
          if (this.Boards) {
            TweenMax.to(this.Boards, 0.3, { opacity: 1 })
          }
        },
      })
    }
  }

  initialize() {
    /*
    if (window.addEventListener) {
      window.addEventListener('beforeunload', (event) => {
        //event.returnValue = 'There is pending work. Sure you want to leave?';
        this.props.GameStore.analyticsTimeStop({page: 'PrizeBoard'})
      });
    } else if (window.attachEvent) {
      window.attachEvent('onbeforeunload', (event) => {
        //event.returnValue = 'There is pending work. Sure you want to leave?';
        this.props.GameStore.analyticsTimeStop({page: 'PrizeBoard'})
      })
    }
*/

    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )
    this.props.PrizeBoardStore.getPrizeBoards({
      userId: this.props.ProfileStore.profile.userId,
    }).then(next => {
      if (next) {
        loadImagesUponPageLoad(this.refMainContainer, next => {
          if (next) {
            this.executeAnim()
          }
        })

        //TEMPORARY - CODE_SERVER.JS
        // if (
        //   (!this.props.StarBoardStore.userPrize ||
        //     (this.props.StarBoardStore.userPrize &&
        //       !this.props.StarBoardStore.userPrize.prizes)) &&
        //   this.props.ProfileStore.profile.currencies &&
        //   this.props.ProfileStore.profile.currencies.stars <= 0
        // ) {
        //   runInAction(
        //     () => (this.props.ProfileStore.profile.currencies.stars = 20)
        //   )
        // }
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({ page: 'PrizeBoard', isMainPage: true })
    this.props.NavigationStore.setActiveMenu(null)
    this.props.NavigationStore.resetSubScreens()
    if (this.props.toGameState) {
      this.props.toGameState()
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({
      page: 'PrizeBoard',
      isMainPage: true,
    })
    this.initialize()
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'PrizeBoard',
      isMainPage: true,
      isUnload: true,
    })
  }

  componentDidUpdate(nextProps) {
    if (
      (!this.props.ProfileStore.isLoading && !this.props.ProfileStore.err) ||
      !this.props.PrizeBoardStore.isLoading
    ) {
      if (this.Intro) {
        TweenMax.to(this.Intro, 0.3, {
          opacity: 0,
          zIndex: -100,
          delay: 3,
          onComplete: () => {
            if (this.Boards) {
              TweenMax.to(this.Boards, 0.3, { opacity: 1 })
            }
          },
        })
      }
    }

    if (
      this.props.PrizeBoardStore.prizeBoards &&
      this.props.PrizeBoardStore.prizeBoards.length > 0 &&
      !this.props.PrizeBoardStore.isLoading
    ) {
      if (this.Boards && this.RefBoardsInner) {
        if (this.Boards.clientHeight > this.RefBoardsInner.clientHeight) {
          TweenMax.set(this.RefBoardsInner, { bottom: 0 })
        } else {
          TweenMax.set(this.RefBoardsInner, { top: 0 })
        }
      }
    }

    this.changeBanner()
  }

  changeBanner() {
    let banner = document.getElementById('prizeboard-banner')
    let banner_icon = document.getElementById('prizeboard-banner-icon')
    if (banner && banner_icon) {
      if (this.bannerType) {
        if ('StarBoard' === this.bannerType) {
          if (
            this.props.NavigationStore.subScreens &&
            this.props.NavigationStore.subScreens.length > 0
          ) {
            banner.style.backgroundColor = '#eede16'
            banner_icon.style.backgroundColor = '#231f20'
            banner_icon.style.backgroundImage = `url(${StarIcon})`
          } else {
            this.bannerType = null
            banner.style.backgroundColor = '#7736dd'
            banner_icon.style.backgroundColor = '#ffffff'
            banner_icon.style.backgroundImage = `url(${BannerIcon})`
          }
        } else {
          this.bannerType = null
          banner.style.backgroundColor = '#7736dd'
          banner_icon.style.backgroundColor = '#ffffff'
          banner_icon.style.backgroundImage = `url(${BannerIcon})`
        }
      } else {
        banner.style.backgroundColor = '#7736dd'
        banner_icon.style.backgroundColor = '#ffffff'
        banner_icon.style.backgroundImage = `url(${BannerIcon})`
      }
    }
  }

  loginFirst() {
    let comp = (
      <AuthSequence refGotoPrizeTermClaims={this.handleLoggedIn.bind(this)} />
    )
    this.props.NavigationStore.addSubScreen(comp, 'AuthSequence', true)
  }

  handleLoggedIn() {
    this.props.NavigationStore.removeSubScreen('AuthSequence')

    this.bannerType = 'StarBoard'
    let comp = (
      <StarBoard
        refHideBanner={this.handleHideBanner.bind(this)}
        isSubScreen
        key={`prizeboard-starboard-1`}
      />
    )
    this.props.NavigationStore.addSubScreen(comp, 'StarBoard')
  }

  handleIsLoggedInX(response) {
    if (response) {
      setTimeout(() => {
        this.props.PrizeBoardStore.getBigPrizeBoardItems()
        this.props.ProfileStore.getProfile()
      }, 1000)
    }
  }

  closeSlidingContentMenu() {
    this.props.NavigationStore.removeSubScreen('PrizeBoard-PrizeList')
  }

  handleHideBanner(next) {
    const banner = document.getElementById('prizeboard-banner')
    if (banner) {
      if (next) {
        banner.style.zIndex = 0
      } else {
        banner.style.zIndex = 200
      }
    }
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.initialize()
    }
  }

  MenuOptions(currentItem) {
    let comp = null
    const excludedItems = 'bb, sr'

    if (!currentItem.boardTypeId) {
      return
    }

    if ('bb' === currentItem.boardTypeId.toLowerCase()) {
      comp = (
        <BigPrizeBoard
          items={this.props.PrizeBoardStore.prizeBoardItems}
          profile={this.props.ProfileStore.profile}
          closeSlidingPanel={this.closeSlidingContentMenu.bind(this)}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'PrizeBoard-BigPrizeBoard')
    } else if ('sr' === currentItem.boardTypeId.toLowerCase()) {
      // comp = (
      //   <StarBoardFile
      //     profile={this.props.ProfileStore.profile}
      //     closeStarBoard={this.closeSlidingContentMenu.bind(this)}
      //   />
      // )

      // if (!this.props.ProfileStore.profile.userId) {
      //   this.loginFirst()
      // } else {
      //   this.bannerType = 'StarBoard'
      //   comp = <StarBoard refHideBanner={this.handleHideBanner.bind(this)} />
      //   this.props.NavigationStore.addSubScreen(comp, 'StarBoard')
      // }
      this.bannerType = 'StarBoard'
      comp = (
        <StarBoard
          refHideBanner={this.handleHideBanner.bind(this)}
          isSubScreen
          key={`prizeboard-starboard-2`}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'StarBoard')
    } else {
      let prizeBoardsFiltered = this.props.PrizeBoardStore.prizeBoards.filter(
        primary => {
          return (
            this.props.PrizeBoardStore.prizes.filter(secondary => {
              return (
                // (primary.boardTypeId || '').toLowerCase() ===
                //   (secondary.boardTypeId || '').toLowerCase() &&
                (primary.seasonGroup || '').toLowerCase() ===
                  (secondary.seasonId || '').toLowerCase() &&
                !excludedItems.match(new RegExp(primary.boardTypeId, 'gi')) &&
                !primary.boardTypeId.match(new RegExp('sr', 'gi'))
              )
            }).length > 0
          )
        }
      )

      comp = (
        <PrizeList
          profile={this.props.ProfileStore.profile}
          currentItem={currentItem}
          prizeBoards={prizeBoardsFiltered}
          prizes={this.props.PrizeBoardStore.prizes}
          hideBanner={this.handleHideBanner.bind(this)}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'PrizeBoard-PrizeList')
    }
  }

  render() {
    let { prizeBoards, prizes } = this.props.PrizeBoardStore
    let { profile } = this.props.ProfileStore
    // let { CommandHostStore } = this. props

    // if (!CommandHostStore.isAuthenticated) {
    //   return (
    //     <Container>
    //       <OwnLogin handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
    //     </Container>
    //   )
    // }

    if (
      this.props.ProfileStore.isLoading &&
      !this.props.ProfileStore.err &&
      this.props.PrizeBoardStore.isLoading
    ) {
      return (
        <Container innerRef={ref => (this.refMainContainer = ref)}>
          <MenuBanner
            backgroundColor={'#7635dc'}
            icon={`menu-prize_boards-icon.svg`}
            iconBackgroundColor={'#7635dc'}
            iconBorderColor={'#ffffff'}
            sizeInPct="40"
            text="prize boards"
            textColor={'#7635dc'}
          />
          <PrizeBoardIntro reference={ref => (this.Intro = ref)} />
        </Container>
      )
    }

    return (
      <Container innerRef={ref => (this.refMainContainer = ref)}>
        <MenuBanner
          backgroundColor={'#7635dc'}
          icon={`menu-prize_boards-icon.svg`}
          iconBackgroundColor={'#7635dc'}
          iconBorderColor={'#ffffff'}
          sizeInPct="40"
          text="prize boards"
          textColor={'#7635dc'}
        />
        <ContentMenu>
          <Bottom>
            <ScrollingBoardsWrapper innerRef={ref => (this.Boards = ref)}>
              <BoardsInner innerRef={ref => (this.RefBoardsInner = ref)}>
                {prizeBoards.map((menu, key) => {
                  // const details = prizes.filter(
                  //   o =>
                  //     o.boardTypeId.toLowerCase() === menu.boardTypeId.toLowerCase() &&
                  //     o.seasonId.toLowerCase() ===
                  //       menu.seasonGroup.toLowerCase()
                  // )
                  const details = prizes.filter(
                    o =>
                      o.prizeBoardId === menu.prizeBoardId &&
                      (o.seasonId || '').toLowerCase() ===
                        (menu.seasonGroup || '').toLowerCase()
                  )
                  if (
                    (details &&
                      details.length > 0 &&
                      !menu.boardTypeId.match(new RegExp('sr', 'gi'))) ||
                    (menu.boardTypeId || '').toUpperCase() === 'SR'
                  ) {
                    return menu.tokensUpgrade > 0 ? (
                      <TokensIncluded
                        key={key}
                        menu={menu}
                        refOnClick={this.handleMenuClick.bind(this, menu)}
                      />
                    ) : (
                      <Simple
                        key={key}
                        menu={menu}
                        refOnClick={this.handleMenuClick.bind(this, menu)}
                      />
                    )
                  }
                })}
              </BoardsInner>
            </ScrollingBoardsWrapper>

            <SummaryWrapper>
              <SummarySection>
                <StarCounter />
              </SummarySection>

              <SummarySection>
                <SummaryInner>
                  <Text font={'pamainextrabold'} size={5} color={'#ffffff'}>
                    {profile.currencies['points']}
                  </Text>
                  <PointLabelWrapper>
                    <Text font={'pamainregular'} size={3} color={'#17c5ff'}>
                      &nbsp;PTS
                    </Text>
                  </PointLabelWrapper>
                </SummaryInner>
                <SummaryInner style={{ marginLeft: responsiveDimension(5) }}>
                  <TokensLabelWrapper>
                    <Text font={'pamainextrabold'} size={3} color={'#edbf00'}>
                      {profile.currencies['tokens']}
                      &nbsp;
                    </Text>
                    <TokenWrapper>
                      <Token src={TokenIcon} size={2.9} index={3} />
                      <Faded
                        index={2}
                        size={2.9}
                        color={'#6d6c71'}
                        left={-2.6}
                      />
                      <Faded
                        index={1}
                        size={2.9}
                        color={'#33342f'}
                        left={-2.6}
                      />
                    </TokenWrapper>
                  </TokensLabelWrapper>
                </SummaryInner>
              </SummarySection>
            </SummaryWrapper>
          </Bottom>
        </ContentMenu>

        <PrizeBoardIntro reference={ref => (this.Intro = ref)} />

        {this.props.NavigationStore.subScreens.map(comp => {
          return comp
        })}
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const ContentMenu = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`

const ScrollingBoardsWrapper = styled.div`
  opacity: 0;

  position: relative;
  width: 100%;
  height: ${props => responsiveDimension(75)};
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0.1)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const BoardsInner = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const SummaryWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(9)};
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 3%;
  padding-right: 3%;

  position: relative;
`

const SummarySection = styled.div`
  display: flex;
  flex-direction: row;
`

const SummaryInner = styled.div`
  display: flex;
  flex-direction: row;
`

const Star = styled.div`
  width: ${props => responsiveDimension(9)};
  height: ${props => responsiveDimension(9)};
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: ${props => props.font};
  // font-size: ${props => responsiveDimension(4.3)};
  font-size: ${props => responsiveDimension(props.fontSize || 4.3)};
  color: ${props => props.color};
  padding-top: ${props => responsiveDimension(1)};

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 75%;
  background-position: center;

  margin-right: ${props => responsiveDimension(1)};
`

const PointLabelWrapper = styled.div`
  padding-top: ${props => responsiveDimension(2)};
`

const TokensLabelWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 7%;
`
const TokenWrapper = styled.div`
  height: 100%;
  margin-right: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.1)};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Token = styled.div`
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

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
`

@inject('ProfileStore')
@observer
class StarCounter extends Component {
  render() {
    let { profile } = this.props.ProfileStore

    if (
      !profile.currencies ||
      (profile.currencies && profile.currencies.stars == 'undefined') ||
      (profile.currencies && profile.currencies.stars == null)
    ) {
      return (
        <Star src={StarIcon} font={'pamainextrabold'}>
          {0}
        </Star>
      )
    }

    return (
      <Star
        src={StarIcon}
        color={'#231f20'}
        font={
          profile.currencies.stars.toString().length == 1
            ? 'pamainextrabold'
            : profile.currencies.stars.toString().length == 2
            ? 'pamainbold'
            : profile.currencies.stars.toString().length == 3
            ? 'pamainregular'
            : 'pamainregular'
        }
        fontSize={
          profile.currencies.stars.toString().length == 1
            ? 4.3
            : profile.currencies.stars.toString().length == 2
            ? 4
            : profile.currencies.stars.toString().length == 3
            ? 3.5
            : 2.5
        }
      >
        {profile.currencies['stars']}
      </Star>
    )
  }
}
