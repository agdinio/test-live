import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { TweenMax, Ease } from 'gsap'
import Background from '@/assets/images/playalong-default.jpg'
import BannerIcon from '@/assets/images/menu-leaderboard-icon.svg'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'
import CelebEarner from './CelebEarner'
import Earner from './Earner'

@inject('CommonStore', 'NavigationStore', 'AnalyticsStore')
//@observer
export default class LeaderBoard extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({
      page: 'LeaderBoard',
      isMainPage: true,
    })
    this._isMounted = false
    this.props.NavigationStore.setActiveMenu(null)
    if (this.props.toGameState) {
      this.props.toGameState()
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({
      page: 'LeaderBoard',
      isMainPage: true,
    })
    this._isMounted = true
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )

    this.props.CommonStore.getTopEarners().then(next => {
      if (next) {
        if (this._isMounted) {
          this.forceUpdate()
        }
      }
    })
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'LeaderBoard',
      isMainPage: true,
      isUnload: true,
    })
  }

  render() {
    let { CommonStore } = this.props

    if (CommonStore.topEarners.length < 1) {
      return (
        <Container>
          <Wrapper>
            <DropDownBannerContainer>
              <BannerText />
              <Banner backgroundColor={'#353773'}>
                <Icon src={BannerIcon} backgroundColor={'#353773'} />
              </Banner>
            </DropDownBannerContainer>
          </Wrapper>
        </Container>
      )
    }

    // if (CommonStore.topCelebEarners.length < 3) {
    //   const cnt = (3 - CommonStore.topCelebEarners.length)
    //   for (let i=0; i<cnt; i++) {
    //     CommonStore.topCelebEarners.push({
    //       userId: 0,
    //       name: '',
    //       email: '',
    //       tokens: 0,
    //       points: 0,
    //       stars: 0,
    //       isCelebrity: false
    //     })
    //   }
    // }

    // if (CommonStore.topEarners.length < 10) {
    //   const cnt = (10 - CommonStore.topEarners.length)
    //   for (let i=0; i<cnt; i++) {
    //     CommonStore.topEarners.push({
    //       userId: 0,
    //       name: '',
    //       email: '',
    //       tokens: 0,
    //       points: 0,
    //       stars: 0,
    //       isCelebrity: false
    //     })
    //   }
    // }

    return (
      <Container>
        <Wrapper>
          <DropDownBannerContainer>
            <BannerText />
            <Banner backgroundColor={'#353773'}>
              <Icon src={BannerIcon} backgroundColor={'#353773'} />
            </Banner>
          </DropDownBannerContainer>
          <Content>
            <Bottom>
              <EarnerOuter>
                <EarnerHeader>CELEBRITIES PLAYING</EarnerHeader>
              </EarnerOuter>
              <CelebPointEarners>
                {CommonStore.topCelebEarners.map((celeb, key) => {
                  return <CelebEarner item={celeb} key={key} />
                })}
              </CelebPointEarners>
              <PointEarners>
                <EarnerOuter>
                  <EarnerHeader>TOP 10 POINT EARNERS</EarnerHeader>
                </EarnerOuter>

                {CommonStore.topEarners.map((earner, key) => {
                  return <Earner item={earner} key={key} rank={key + 1} />
                })}
              </PointEarners>
            </Bottom>
          </Content>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
`

const Wrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  background: linear-gradient(rgba(21, 21, 21, 0.8) 20%, rgba(21, 21, 21, 0));
`

const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => vhToPx(1.4)};
  display: flex;
  flex-direction: row;
`
const BannerText = styled.div`
  margin-top: ${props => vhToPx(1)};
  font-size: ${props => vhToPx(5)};
  font-family: pamainlight;
  color: #444693;
  text-transform: uppercase;
  &:before {
    content: 'Leaderboard';
  }
`

const Bannerxxx = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(8.5)};
  background-color: #353773;
  margin-left: ${props => vhToPx(1.5)};
  position: relative;
  border-bottom-left-radius: ${props => vhToPx(5)};
  border-bottom-right-radius: ${props => vhToPx(5)};
  animation: ${props => backBanner} 0.75s forwards;
  z-index: 10;
`

const backBanner = keyframes`
  0%{height: ${vhToPx(1)};}
  50%{height: ${vhToPx(9.5)};}
  100%{height: ${props => vhToPx(8.5)};}
`

const Iconxxx = styled.div`
  width: ${props => vhToPx(4.5)};
  height: ${props => vhToPx(4.5)};
  border-radius: ${props => vhToPx(4.5)};
  background-color: #ffffff;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;

  margin-left: ${props => vhToPx(0.1)};
  margin-bottom: ${props => vhToPx(0.3)};
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
  z-index: 10;
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

const Content = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  animation: ${props => fadeincontents} forwards 0.75s;
  opacity: 0;
`

const fadeincontents = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
`

const CelebPointEarners = styled.div`
  width: 100%;
  border-bottom: ${props => vhToPx(0.15)} solid #414042;
`

const PointEarners = styled.div`
  width: 100%;
  ///////////////background-color: #353773;

  background: linear-gradient(#2d2f62, rgba(11, 11, 23, 1));
`

const EarnerHeader = styled.div`
  width: 100%;
  height: ${props => vhToPx(6.5)};
  background: ${props => props.bgcolor || 'transparent'};

  font-family: pamainregular;
  font-size: ${props => vhToPx(3)};
  color: #ffffff;
  letter-spacing: ${props => vhToPx(0.1)};
  display: flex;
  align-items: center;
  padding-left: 5%;
`

const EarnerOuter = styled.div`
  width: 100%;
  background: ${props => props.bgcolor || 'transparent'};
`
