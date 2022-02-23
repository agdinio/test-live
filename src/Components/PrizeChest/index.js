import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { runInAction } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { responsiveDimension } from '@/utils'
import { TweenMax, TimelineMax, Back, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import Background from '@/assets/images/playalong-default.jpg'
import key from '@/assets/images/menu-prize_chest-icon.svg'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import LoginFirst from '@/Components/Common/LoginFirst'
import PrizeChestItem from './PrizeChestItem'
import ItemDetail from './ItemDetail'
import ItemDetailWoot from './ItemDetailWoot'
import BigPrizeBoardDetail from '@/Components/PrizeBoard/BigPrizeBoardDetail'
import StarBoardFile from '@/Components/PrizeBoard/StarBoardFile'
import PrizeClaimTerms from '@/Components/PrizeBoard/PrizeList/PrizeClaimTerms'
import PrizeChestList from '@/Components/PrizeChest/PrizeChestList'
import StarBoard from '@/Components/StarBoard'
import OwnLogin from '@/Components/Common/OwnLogin'
import MenuBanner from '@/Components/Common/MenuBanner'

@inject(
  'NavigationStore',
  'PrizeBoardStore',
  'ProfileStore',
  'PrizeChestStore',
  'StarBoardStore',
  'CommandHostStore',
  'AnalyticsStore'
)
@observer
export default class PrizeChest extends Component {
  constructor(props) {
    super(props)
    //this.props.ProfileStore.getProfile()
    //    this.props.PrizeBoardStore.getPrizesByUser(this.props.ProfileStore.profile.userId)
    this.bannerType = null

    //TEMPORARY - CODE_SERVER.JS
    /*
    if (
      (!this.props.StarBoardStore.userPrize ||
        (this.props.StarBoardStore.userPrize &&
          !this.props.StarBoardStore.userPrize.prizes)) &&
      this.props.ProfileStore.profile.currencies &&
      this.props.ProfileStore.profile.currencies.stars <= 0
    ) {
      runInAction(() => (this.props.ProfileStore.profile.currencies.stars = 20))
      //this.forceUpdate()
    }
*/
  }

  componentDidUpdate(nextProps) {
    this.changeBanner()
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({ page: 'PrizeChest', isMainPage: true })

    this.props.NavigationStore.setActiveMenu(null)
    this.props.NavigationStore.resetSubScreens()
    if (this.props.toGameState) {
      this.props.toGameState()
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({
      page: 'PrizeChest',
      isMainPage: true,
    })

    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )
    this.props.PrizeBoardStore.getPrizeBoards({
      userId: this.props.ProfileStore.profile.userId,
    })
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'PrizeChest',
      isMainPage: true,
      isUnload: true,
    })
  }

  clearDetail() {
    setTimeout(() => {
      this.props.PrizeBoardStore.setLockPrizeSlide(false)
    }, 0)

    this.setState({
      slideScreen: null,
    })
  }

  changeBanner() {
    let banner = document.getElementById('prizechest-banner')
    //let banner = this.prizechestBanner
    let banner_icon = document.getElementById('prizechest-banner-icon')
    //let banner_icon = this.prizechestBannerIcon
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
            banner.style.backgroundColor = '#946fa8'
            banner_icon.style.backgroundColor = '#ffffff'
            banner_icon.style.backgroundImage = `url(${key})`
          }
        } else {
          this.bannerType = null
          banner.style.backgroundColor = '#946fa8'
          banner_icon.style.backgroundColor = '#946fa8'
          banner_icon.style.backgroundImage = `url(${key})`
        }
      } else {
        banner.style.backgroundColor = '#946fa8'
        banner_icon.style.backgroundColor = '#946fa8'
        banner_icon.style.backgroundImage = `url(${key})`
      }
    }
  }

  handleHideBanner(isHide) {
    const banner = document.getElementById('prizechest-banner')
    //const banner = this.prizechestBanner
    if (banner) {
      if (isHide) {
        banner.style.zIndex = 5
      } else {
        banner.style.zIndex = 150
      }
    }
  }

  closePanel(displayName) {
    this.props.NavigationStore.removeSubScreen(displayName)
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  showStarBoard(prize) {
    /*
    let comp = (
      <StarBoardFile
        profile={this.props.ProfileStore.profile}
        closeStarBoard={this.closePanel.bind(this, 'StarBoard')}
      />
    )
    this.props.NavigationStore.addSubScreen(comp, 'StarBoard')
*/
    this.bannerType = 'StarBoard'
    let comp = (
      <StarBoard
        refHideBanner={this.handleHideBanner.bind(this)}
        isSubScreen
        key={`prizechest-starboard`}
      />
    )
    this.props.NavigationStore.addSubScreen(comp, 'StarBoard')
  }

  showWoot(prize) {
    let selectedItem = this.props.PrizeChestStore.prizeChestList.filter(
      o => o.keyword === prize.keyword
    )[0]

    if (selectedItem) {
      let comp = (
        <ItemDetailWoot
          item={prize}
          prize={prize}
          closePanel={this.closePanel.bind(this, 'PrizeChest-ItemDetailWoot')}
          timeStart={this.handleTimeStart.bind(
            this,
            'PrizeChest-ItemDetail-Woot'
          )}
          timeStop={this.handleTimeStop.bind(
            this,
            'PrizeChest-ItemDetail-Woot'
          )}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'PrizeChest-ItemDetailWoot')
    }
  }

  showAmalfi(prize) {
    let selectedItem = this.props.PrizeBoardStore.prizeBoardItems.filter(
      o => o.keyword === prize.keyword
    )[0]

    if (selectedItem) {
      let comp = (
        <ItemDetail
          item={selectedItem}
          prize={prize}
          closePanel={this.closePanel.bind(this, 'PrizeChest-ItemDetail')}
          timeStart={this.handleTimeStart.bind(
            this,
            `PrizeChest-ItemDetail-${Capitalize(prize.keyword)}`
          )}
          timeStop={this.handleTimeStop.bind(
            this,
            `PrizeChest-ItemDetail-${Capitalize(prize.keyword)}`
          )}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'PrizeChest-ItemDetail')
    }
  }

  showHotel(prize) {
    let selectedItem = this.props.PrizeBoardStore.prizeBoardItems.filter(
      o => o.keyword === prize.keyword
    )[0]

    if (selectedItem) {
      let comp = (
        <ItemDetail
          item={selectedItem}
          prize={prize}
          closePanel={this.closePanel.bind(this, 'PrizeChest-ItemDetail')}
          timeStart={this.handleTimeStart.bind(
            this,
            `PrizeChest-ItemDetail-${Capitalize(prize.keyword)}`
          )}
          timeStop={this.handleTimeStop.bind(
            this,
            `PrizeChest-ItemDetail-${Capitalize(prize.keyword)}`
          )}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'PrizeChest-ItemDetail')
    }
  }

  showPrizeBoardItem(prize) {
    let selectedItem = this.props.PrizeBoardStore.prizeBoardItems.filter(
      o => o.keyword === prize.keyword
    )[0]
    if (selectedItem) {
      // if (prize.keyword === 'gear') {
      //   selectedItem.headers[0].value = 'TRAINING, GEAR & MORE...'
      //   selectedItem.headers[1].value = ''
      //   selectedItem.details[0].value = 'SKLZ® EXOS®'
      // }
      let comp = (
        <BigPrizeBoardDetail
          item={selectedItem}
          footerBackgroundColor={'#946fa8'}
          closePanel={this.closePanel.bind(
            this,
            'PrizeChest-BigPrizeBoardDetail'
          )}
          timeStart={this.handleTimeStart.bind(
            this,
            `PrizeChest-ItemDetail-${Capitalize(prize.keyword)}`
          )}
          timeStop={this.handleTimeStop.bind(
            this,
            `PrizeChest-ItemDetail-${Capitalize(prize.keyword)}`
          )}
        />
      )
      this.props.NavigationStore.addSubScreen(
        comp,
        'PrizeChest-BigPrizeBoardDetail'
      )
    }
  }

  showDefaultScreen(item) {
    // let comp = (
    //   <PrizeClaimTerms
    //     item={item}
    //     refHideBanner={this.handleHideBanner.bind(this)}
    //   />
    // )
    // this.props.NavigationStore.addSubScreen(comp, 'PrizeClaimTerms')
    this.handleHideBanner(true)
  }

  handleLoggedIn() {
    this.props.ProfileStore.getProfile()
  }

  handleIsLoggedIn(next) {
    if (next) {
      //TODO
    }
  }

  render() {
    // let { CommandHostStore } = this.props

    // if (!CommandHostStore.isAuthenticated) {
    //   return (
    //     <Container>
    //       <OwnLogin handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
    //     </Container>
    //   )
    // }

    return (
      <Container>
        <DropDownBannerContainer>
          <BannerText />
          <Banner id="prizechest-banner" backgroundColor={'#946fa8'}>
            <Icon
              src={key}
              id={'prizechest-banner-icon'}
              backgroundColor={'#946fa8'}
            />
          </Banner>
        </DropDownBannerContainer>
        {/*
        <MenuBanner
          backgroundColor={'#946fa8'}
          icon={`menu-prize_chest-icon.svg`}
          iconBackgroundColor={'#946fa8'}
          iconBorderColor={'#ffffff'}
          sizeInPct="40"
          text="prize chest"
          textColor={'#946fa8'}
          bannerId={ref => this.prizechestBanner = ref}
          iconId={ref => this.prizechestBannerIcon = ref}
        />
*/}
        <Contents marginTop={10}>
          <Section height={60}>
            <PrizeChestList
              showStarBoard={this.showStarBoard.bind(this)}
              showWoot={this.showWoot.bind(this)}
              showAmalfi={this.showAmalfi.bind(this)}
              showHotel={this.showHotel.bind(this)}
              showPrizeBoardItem={this.showPrizeBoardItem.bind(this)}
              showDefaultScreen={this.showDefaultScreen.bind(this)}
              refHideBanner={this.handleHideBanner.bind(this)}
            />
            {/*
            <ArrowWrapper>
              <Arrow src={ArrowIcon} />
              <TextWrapper>
                <Text
                  font={'pamainregular'}
                  fontSize={3.7}
                  color={'rgba(255,255,255,0.5)'}
                  letterSpacing={0.1}
                >
                  your stars & prizes
                </Text>
              </TextWrapper>
            </ArrowWrapper>
*/}
          </Section>

          <Section
            height={30}
            style={{ backgroundColor: '#212121', justifyContent: 'center' }}
          >
            <SubSection style={{ marginBottom: '4%' }}>
              <TextWrapper>
                <Text font={'pamainregular'} fontSize={3.7} letterSpacing={0.1}>
                  collect&nbsp;
                </Text>
                <Text
                  font={'pamainextrabold'}
                  fontSize={3.7}
                  color={'#efdf18'}
                  letterSpacing={0.1}
                >
                  stars&nbsp;
                </Text>
                <Text font={'pamainregular'} fontSize={3.7} letterSpacing={0.1}>
                  for prizes
                </Text>
              </TextWrapper>
            </SubSection>
            <SubSection>
              <TextWrapper>
                <Text font={'pamainlight'} fontSize={5.2}>
                  top&nbsp;
                </Text>
                <Text font={'pamainbold'} fontSize={5.2} color={'#17c5ff'}>
                  point&nbsp;
                </Text>
                <Text font={'pamainlight'} fontSize={5.2}>
                  earners
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text font={'pamainbold'} fontSize={6.7}>
                  win lavish&nbsp;
                </Text>
                <Text font={'pamainbold'} fontSize={6.7} color={'#946fa8'}>
                  prizes
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text font={'pamainregular'} fontSize={4}>
                  at the&nbsp;
                </Text>
                <Text font={'pamainextrabold'} fontSize={4} color={'#ed1c24'}>
                  live events
                </Text>
              </TextWrapper>
            </SubSection>
          </Section>
        </Contents>

        {this.props.NavigationStore.subScreens.map(comp => {
          return comp
        })}
      </Container>
    )
  }
}

const Container = styled.div`
  // background-image: url(${Background});
  // background-repeat: no-repeat;
  // background-size: cover;
  height: 100%;
  width: 100%;
  display: flex;
 flex-direction: column;
  position: relative;
`

const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => responsiveDimension(1.4)};
  display: flex;
  flex-direction: row;
`
const BannerText = styled.div`
  margin-top: ${props => responsiveDimension(1)};
  font-size: ${props => responsiveDimension(5)};
  font-family: pamainlight;
  color: #946fa8;
  text-transform: uppercase;
  &:before {
    content: 'Prize Chest';
  }
`

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(8.5)};
  background-color: ${props => props.backgroundColor};
  margin-left: ${props => responsiveDimension(1.5)};
  position: relative;
  border-bottom-left-radius: ${props => responsiveDimension(5)};
  border-bottom-right-radius: ${props => responsiveDimension(5)};
  animation: ${props => backBanner} 0.75s forwards;
  z-index: 150;
`

const Icon = styled.div`
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 40%;
  background-position: center;

  margin-left: ${props => responsiveDimension(0.1)};
  margin-bottom: ${props => responsiveDimension(0.3)};
  border: ${props => `${responsiveDimension(0.4)} solid #ffffff`};
`

const backBanner = keyframes`
  0%{height: ${responsiveDimension(1)};}
  50%{height: ${responsiveDimension(9.5)};}
  100%{height: ${props => responsiveDimension(8.5)};}
`

const Contents = styled.div`
  opacity: 0;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  animation: ${props => fadeincontents} forwards 0.75s;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};

  position: absolute;
`
const fadeincontents = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Top = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  margin-top: ${props => responsiveDimension(props.marginTop)};
`

const PrizeItemWrapper = styled.div`
  width: inherit;
`

const Middle = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Bottom = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TextWrapper = styled.div`
  line-height: 1;
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.fontSize)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  ${props =>
    props.letterSpacing
      ? `letter-spacing: ${responsiveDimension(props.letterSpacing)};`
      : ``};
`

const Section = styled.div`
  width: 100%;
  height: ${props => props.height || 100}%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SubSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ArrowWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Arrow = styled.img`
  transform: rotate(-90deg);
  opacity: 0.5;
  margin-bottom: 2%;
`

const ContentItemDetail = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
`

const ContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
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

const Capitalize = s => {
  return s && s[0].toUpperCase() + s.slice(1)
}
