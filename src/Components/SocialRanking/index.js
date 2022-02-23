import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax, Ease } from 'gsap'
import bgDefault from '@/assets/images/playalong-default.jpg'
import GlobeIcon from '@/assets/images/icon-globe.svg'
import GlobalPlacementIcon from '@/assets/images/icon-globalplacement.svg'
import { vhToPx, hex2rgb, pxToVh } from '@/utils'
import StatusPanel from '@/Components/LiveGame/StatusPanel/StatusPanel'
import Continue from '@/Components/Button'
import Initial from '@/Components/SocialRanking/Initial'
import RankingItem from './RankingItem'
import GlobalRankingItem from './GlobalRankingItem'
import BezierEasing from '@/bezier-easing'

@inject('LiveGameStore', 'NavigationStore')
@observer
export default class SocialRanking extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      isLoading: true,
      isClearInnerLeft: false,
      isGlobal: false,
      globalTopNumber: '',
      globalPointsNumber: 0,
      globalTopNumberFooter: '',
      people: [
        {
          name: 'Stewart Fredericks',
          id: 2,
          isMe: true,
          globalRank: 0.65,
          place: 10,
          picture: 'profile-image.jpg',
          points: 8800,
        },
        {
          name: 'First Lastname',
          id: 3,
          picture: 'socialrank-profile-1.jpg',
          points: 8568,
          place: 11,
        },
        {
          name: 'First Lastname',
          id: 4,
          picture: 'socialrank-profile-2.jpg',
          points: 8336,
          place: 12,
        },
        {
          name: 'First Lastname',
          id: 5,
          picture: 'socialrank-profile-3.jpg',
          points: 8104,
          place: 13,
        },
        {
          name: 'First Lastname',
          id: 6,
          picture: 'socialrank-profile-4.jpg',
          points: 7872,
          place: 14,
        },
        {
          name: 'First Lastname',
          id: 7,
          picture: 'socialrank-profile-5.jpg',
          points: 7640,
          place: 15,
        },
        {
          name: 'First Lastname',
          id: 8,
          picture: 'socialrank-profile-6.jpg',
          points: 7408,
          place: 16,
        },
        {
          name: 'First Lastname',
          id: 9,
          picture: 'socialrank-profile-7.jpg',
          points: 7176,
          place: 17,
        },
        {
          name: 'First Lastname',
          id: 10,
          picture: 'profile-image.jpg',
          points: 6944,
          place: 18,
        },
        {
          name: 'First Lastname',
          id: 11,
          picture: 'icon-menu-profile.svg',
          points: 6573,
          place: 19,
        },
        {
          name: 'First Lastname',
          id: 12,
          picture: 'icon-menu-profile.svg',
          points: 5210,
          place: 20,
        },
        {
          name: 'First Lastname',
          id: 13,
          picture: 'icon-menu-profile.svg',
          points: 3100,
          place: 21,
        },
        {
          name: 'First Lastname',
          id: 14,
          picture: 'icon-menu-profile.svg',
          points: 3100,
          place: 22,
        },
        {
          name: 'First Lastname',
          id: 15,
          picture: 'icon-menu-profile.svg',
          points: 3100,
          place: 23,
        },
        {
          name: 'First Lastname',
          id: 16,
          picture: 'icon-menu-profile.svg',
          points: 3100,
          place: 24,
        },
      ],
      globalRanks: [
        {
          id: 0,
          points: 9884,
        },
        {
          id: 0,
          points: 9856,
        },
        {
          id: 0,
          points: 9828,
        },
        {
          id: 18,
          points: 9622,
        },
        {
          id: 19,
          points: 9594,
        },
        {
          id: 20,
          points: 9566,
        },
        {
          id: 21,
          points: 9538,
        },
        {
          id: 22,
          points: 9510,
        },
        {
          id: 2,
          points: 9482,
        },
        {
          id: 24,
          points: 9454,
        },
        {
          id: 25,
          points: 9453,
        },
        {
          id: 0,
          points: '????',
        },
        {
          id: 0,
          points: '????',
        },
        {
          id: 0,
          points: '????',
        },
        {
          id: 0,
          points: '????',
        },
        {
          id: 0,
          points: '????',
        },
        {
          id: 0,
          points: '???',
        },
        {
          id: 0,
          points: '????',
        },
        {
          id: 0,
          points: '????',
        },
      ],
    })

    this.itemWrapperPos = 0
    this.itemMarker = 0
    this.indicatorMarker = 0
  }

  renderButton() {
    if (this.refButton) {
      ReactDOM.unmountComponentAtNode(this.refButton)
      let button = <Continue handleButtonClick={this.handleClick.bind(this)} />
      ReactDOM.render(button, this.refButton)
    }
  }

  renderGlobalButton() {
    if (this.refButtonGlobal) {
      ReactDOM.unmountComponentAtNode(this.refButtonGlobal)
      let button = <Continue handleButtonClick={this.handleClick.bind(this)} />
      ReactDOM.render(button, this.refButtonGlobal)
    }
  }

  slideRankingItemUp() {
    let me = this.people.find(o => o.isMe)

    for (let i = 0; i < this.people.length; i++) {
      if (this.people[i].id !== me.id) {
        TweenMax.to(this[`refItem-${this.people[i].id}`], 1.5, {
          y: -(window.innerHeight * 1.5),
        })
      }
    }

    TweenMax.to(this.refGlobalSidebar, 0.3, {
      left: 0,
      delay: 0.5,
      zIndex: 9,
      onStart: () => {
        this.globalTopNumberFooter = `TOP ${(me.globalRank * 100).toFixed(0)}%`
      },
      onComplete: () => {
        this.renderGlobalButton()
        TweenMax.to(this.refFooterGlobal, 0.5, { opacity: 1 })
      },
    })

    if (this.refGlobalRankingItemWrapper) {
      TweenMax.to(this.refGlobalRankingItemWrapper, 1.5, {
        top: vhToPx(this.itemWrapperPos),
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
        onStart: () => {
          TweenMax.to(this[`refItem-${me.id}`], 1.5, { top: this.itemMarker })
          TweenMax.to(this.refIndicator, 1.5, { top: this.indicatorMarker })
        },
        onComplete: () => {
          this.globalTopNumber = `TOP ${(me.globalRank * 100).toFixed(0)}%`
          this.globalPointsNumber = this.globalRanks.filter(
            o => o.id === me.id
          )[0].points
        },
        /*
        onUpdate: () => {
          TweenMax.to(this[`refItem-${me.id}`], 1.5, { top: '50%' })
          TweenMax.to(this.refIndicator, 1.5, { top: '50%' })
        },
        onComplete: () => {

          console.log('WRAPPER TOP DAW', this.refGlobalRankingItemWrapper.offsetTop)
          console.log('ITEM TOP DAW', this[`refGlobalRankingItem-${me.id}`].getBoundingClientRect().top)

          const itemMarker = this[`refGlobalRankingItem-${me.id}`].getBoundingClientRect().top - (window.innerHeight * 0.17)
          //y const itemMarker = this[`refGlobalRankingItem-${me.id}`].getBoundingClientRect().top - (window.innerHeight * 0.82)
          const indicatorMarker = this[`refGlobalRankingItem-${me.id}`].getBoundingClientRect().top - (window.innerHeight * 0.122)
          TweenMax.to(this[`refItem-${me.id}`], 1,
            {
              top: itemMarker,
              onStart: () => {
                TweenMax.to(this.refIndicator, 1, { top: indicatorMarker })
              },
              onComplete: () => {
                this.globalTopNumber = `TOP ${(me.globalRank * 100).toFixed(0)}%`
                this.globalPointsNumber = this.globalRanks.filter(
                  o => o.id === me.id
                )[0].points
              }
           })
        }
*/
      })
    }

    /*
    let marker = this[`refGlobalRankingItem-${me.id}`].offsetTop - 15
    let globalRankingItemHeight = this[`refGlobalRankingItem-${me.id}`]
      .offsetHeight
    TweenMax.to(this[`refItem-${me.id}`], 2, {
      y: marker,
      onStart: () => {
        TweenMax.to(this.refIndicator, 2, {
          top: marker + (globalRankingItemHeight - 10),
        })
      },
      onComplete: () => {
        this.globalTopNumber = `TOP ${(me.globalRank * 100).toFixed(0)}%`
        this.globalPointsNumber = this.globalRanks.filter(
          o => o.id === me.id
        )[0].points
      },
    })
*/

    this.isClearInnerLeft = true
    this.isGlobal = true
  }

  handleClick() {
    if (this.isGlobal) {
      this.props.NavigationStore.setCurrentView('/prizeboard')
    } else {
      this.slideRankingItemUp()
    }
  }

  initGlobalItemPosition(wrapperPos) {
    let me = this.people.find(o => o.isMe)

    TweenMax.set(this.refGlobalRankingItemWrapper, {
      top: vhToPx(wrapperPos),
      opacity: 0,
      onComplete: () => {
        const globalItemPos = this[
          `refGlobalRankingItem-${me.id}`
        ].getBoundingClientRect().top
        if (
          globalItemPos <
          this.refStatusPanelWrapper.getBoundingClientRect().top +
            window.innerHeight * 0.09
        ) {
          const newPos = -Math.abs(
            this.refStatusPanelWrapper.getBoundingClientRect().top +
              window.innerHeight * 0.16
          )
          this.initGlobalItemPosition(pxToVh(newPos))
        } else if (
          window.innerHeight - globalItemPos <=
          this.refFooter.offsetHeight
        ) {
          const newPos = -Math.abs(
            this.refFooter.offsetHeight - (window.innerHeight - globalItemPos)
          )
          this.initGlobalItemPosition(pxToVh(newPos + -35))
        } else {
          this.itemWrapperPos = wrapperPos
          this.itemMarker = globalItemPos - window.innerHeight * 0.17
          this.indicatorMarker = globalItemPos - window.innerHeight * 0.122
          TweenMax.set(this.refGlobalRankingItemWrapper, {
            top: '100%',
            opacity: 1,
          })
        }
      },
    })
  }

  componentWillMount() {
    this.props.LiveGameStore.gameSocialRanking()
  }

  componentDidMount() {
    setTimeout(() => {
      this.isLoading = false
      this.renderButton()
      this.globalPointsNumber = this.people.filter(o => o.isMe)[0].points
    }, 3000)

    this.initGlobalItemPosition(0)
  }

  render() {
    return (
      <Container bg={bgDefault}>
        <StatusPanelWrapper
          innerRef={ref => (this.refStatusPanelWrapper = ref)}
        >
          <StatusPanel />
        </StatusPanelWrapper>
        <ContentWrapper>
          <Content innerRef={c => (this.refContent = c)}>
            <Initial isLoading={this.isLoading} />

            <GlobalSidebar innerRef={c => (this.refGlobalSidebar = c)}>
              <GlobeWrapper>
                <Globe src={GlobeIcon} />
              </GlobeWrapper>

              <SidebarIndicatorWrapper innerRef={c => (this.refIndicator = c)}>
                <PlacementImage src={GlobalPlacementIcon} />
                <PlacementWrapper />
              </SidebarIndicatorWrapper>
            </GlobalSidebar>

            <GlobalRankingItemWrapper
              hasLoaded={this.isGlobal}
              innerRef={c => (this.refGlobalRankingItemWrapper = c)}
            >
              {this.globalRanks.map((item, index) => {
                return (
                  <GlobalRankingItem
                    key={index}
                    rank={item}
                    reference={c =>
                      (this[`refGlobalRankingItem-${item.id}`] = c)
                    }
                  />
                )
              })}
            </GlobalRankingItemWrapper>

            <RankingItemsWrapper hasLoaded={!this.isLoading}>
              {this.people.map((person, index) => {
                return (
                  <RankingItem
                    key={person.id}
                    index={index}
                    reference={c => (this[`refItem-${person.id}`] = c)}
                    isClearInnerLeft={this.isClearInnerLeft}
                    isGlobal={this.isGlobal}
                    globalTopNumber={this.globalTopNumber}
                    globalPointsNumber={this.globalPointsNumber}
                    person={person}
                  />
                )
              })}
            </RankingItemsWrapper>
          </Content>

          <Footer
            hasLoaded={!this.isLoading}
            innerRef={ref => (this.refFooter = ref)}
          >
            {this.isGlobal ? (
              <FooterRankGlobal
                isGlobal={this.isGlobal}
                innerRef={c => (this.refFooterGlobal = c)}
              >
                <RankWrapper>
                  <CenterText>
                    <RankLabel>
                      <White>You ranked {this.globalTopNumberFooter}</White>{' '}
                      this game
                    </RankLabel>
                  </CenterText>
                </RankWrapper>
                <ButtonWrapper innerRef={ref => (this.refButtonGlobal = ref)} />
              </FooterRankGlobal>
            ) : (
              <FadeInRank hasLoaded={!this.isLoading}>
                <RankWrapper>
                  <RankInner>
                    <RankLabel>You ranked top 20%</RankLabel>
                    <Points>+1000</Points>
                  </RankInner>
                </RankWrapper>
                <ButtonWrapper innerRef={ref => (this.refButton = ref)} />
              </FadeInRank>
            )}
          </Footer>
        </ContentWrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;

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
`

const StatusPanelWrapper = styled.div``

const ContentWrapper = styled.div`
  width: 100%;
  //height: -webkit-fill-available;
  height: 100%;
  border-top: ${props => vhToPx(0.5)} solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`

const Footer = styled.div`
  width: 100%;
  height: 28%;
  background: #000000;
  display: flex;
  flex-direction: column;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%);
  position: absolute;
  bottom: 0;
  padding: 10% 5% 0 5%;
  ${props =>
    props.hasLoaded
      ? `animation: ${footerSlideUp} 1s forwards;`
      : `opacity: 0;`} z-index: 10;
`

const RankWrapper = styled.div`
  width: 100%;
`
const RankInner = styled.div`
  width: inherit;
  display: flex;
  justify-content: space-between;
`

const RankLabel = styled.div`
  font-family: pamainregular;
  font-size: ${props => vhToPx(4.1)};
  color: #18c5ff;
  text-transform: uppercase;
`

const Points = styled.div`
  display: flex;
  flex-direction: row;
  font-family: pamainregular;
  font-size: ${props => vhToPx(4)};
  color: #ffffff;
  &:after {
    content: 'PTS';
    font-family: pamainregular;
    font-size: ${props => vhToPx(2.7)};
    color: #18c5ff;
    align-self: flex-end;
    line-height: ${props => vhToPx(5.1)};
  }
`

const CenterText = styled.div`
  text-align: center;
`
const White = styled.span`
  color: #ffffff;
`

const ButtonWrapper = styled.div`
  width: 100%;
  //height: 100%;
  display: flex;
  justify-content: center;
  //align-items: center;
  transform: scale(0.8);
`

const RankingItemsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  //-- 1top: ${props => vhToPx(100 - 15)};
  //-- 1 overflow: hidden;
  top: ${props => vhToPx(76.2)};
  animation: ${props => `${slideLeft} 0.5s forwards`}
    ${props =>
      props.hasLoaded
        ? `,${rankingItemSlideUp} 1.5s forwards cubic-bezier(0.77, 0, 0.175, 1)`
        : ''};
`

const GlobalRankingItemWrapper = styled.div`
  position: absolute;
  width: 100%;
  //--height: 100%;
  top: 100%;
  //--overflow: hidden;
/*
  ${props =>
    props.hasLoaded
      ? `animation: ${globalRankingItemSlideUp} 1.5s forwards cubic-bezier(0.77, 0, 0.175, 1);`
      : ``};
*/
  display: flex;
  flex-direction: column;
`

const FadeInRank = styled.div`
  opacity: 0;
  ${props =>
    props.hasLoaded
      ? `animation: ${fadeInRank} 0.5s forwards; animation-delay: 1s;`
      : ``};
`

const footerSlideUp = keyframes`
  0%{
    opacity: 0;
    transform: translateY(100%);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
`

const fadeInRank = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const rankingItemSlideUp = keyframes`
  0%{
    opacity: 1;
    transform: translateY(0);
  }
  100%{
    opacity: 1;
    transform: translateY(${vhToPx(-76)});
  }
`

const globalRankingItemSlideUp = keyframes`
  0%{
    opacity: 1;
    transform: translateY(0);
  }
  100%{
    opacity: 1;
    transform: translateY(${vhToPx(-85)});
  }
`

const slideLeft = keyframes`
  0%{
    opacity: 1;
    transform: translateX(100%);
  }
  100%{
    opacity: 1;
    transform: translateX(0);
  }
`

const GlobalSidebar = styled.div`
  width: ${props => vhToPx(4)};
  height: 100%;
  background-color: #9368aa;
  left: ${props => vhToPx(-9)};

  position: absolute;
  display: flex;
  flex-direction: column;
`

const GlobeWrapper = styled.div`
  //--position: absolute;
  width: ${props => vhToPx(9)};
  height: ${props => vhToPx(6.2)};
  border-radius: ${props => vhToPx(6.2)};
  background-color: #9368aa;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: ${props => vhToPx(0.6)};
`

const Globe = styled.div`
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(5)};
  border-radius: ${props => vhToPx(5)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
`

const SidebarIndicatorWrapper = styled.div`
  width: 100%;
  height: auto;
  bottom: 0;
  position: absolute;
`

const PlacementWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #18c5ff;
  //position: absolute;
  //display: flex;
`
const PlacementImage = styled.div`
  width: ${props => vhToPx(6)};
  height: ${props => vhToPx(6)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  margin-top: ${props => vhToPx(-3)};
`
const FooterRankGlobal = styled.div`
  opacity: 0;
`
