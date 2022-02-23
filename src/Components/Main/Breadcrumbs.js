import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, responsiveDimension, IsMobile } from '@/utils'

const breadcrumbsColor = {
  outro: '#19d1bf',
  purchasetokens: '#ffb200',
  prizechest: '#946fa8',
  prizeboard: '#7736dd',
  leaderboard: '#353773',
  sharestatus: '#0a69b8',
  //friendslist: '#0b7ecc',
  profile: '#06b7ff',
  starboard: '#eede16',
  followedgames: '#c61818',
  instructions: '#414042',
  default: '#ffffff',
  sharethrough: '#19d1be',
  gamehistory: '#ffffff',
}

@inject('NavigationStore')
@observer
export default class Breadcrumbs extends Component {
  constructor(props) {
    super(props)
  }

  async handleCloseCurrentSubScreen(activeSubScreen) {
    /**
     * BACK BUTTON LONG.
     * IF YOU WANT A ONE-BY-ONE BACK ON BREADCRUMBS.
     */
    this.props.NavigationStore.removeSubScreen(activeSubScreen.key)

    /**
     * BACK BUTTON SHORTCUT.
     * IF YOU WANT TO GO BACK TO THE MAIN SCREEN IMMEDIATELY.
     */
    // await this.props.NavigationStore.closeAllSubscreens()
    // this.props.NavigationStore.setLocationWhileOnGameState(null)
  }

  render() {
    let page = this.props.NavigationStore.locationWhileOnGameState
      ? this.props.NavigationStore.locationWhileOnGameState.replace('/', '')
      : null
    let subpage = null
    let currLoc = this.props.NavigationStore.routes.filter(
      o => o.route === this.props.NavigationStore.location
    )[0]
    if (!currLoc) {
      return null
    }

    if (!page) {
      page = currLoc.route.replace('/', '')
    }

    let { subScreens } = this.props.NavigationStore

    if (subScreens && subScreens.length > 0) {
      const activeSubScreen = subScreens[subScreens.length - 1]
      return (
        <Container>
          <BreadcrumbItemsWrapper>
            {subScreens.map((ss, idx) => {
              console.log('TT', ss.key)
              subpage = ss.key.split('-')[0]
              if (subpage) {
                subpage = subpage.toLowerCase()
              } else {
                subpage = null
              }

              const bg = this.props.NavigationStore.routes.filter(
                o => o.route.replace('/', '') === page
              )[0]
              let sbg = this.props.NavigationStore.routes.filter(
                o => o.route.replace('/', '') === subpage
              )[0]

              if (!sbg) {
                sbg = this.props.NavigationStore.routes.filter(
                  o => o.route.replace('/', '') === page
                )[0]
              }

              return idx === 0 ? (
                <BreadcrumbItem
                  //backgroundColor={breadcrumbsColor[page]}
                  backgroundColor={bg.backButtonColor || '#fff'}
                  key={ss.key}
                />
              ) : (
                <BreadcrumbItem
                  //backgroundColor={subpage ? breadcrumbsColor[subpage] : null}
                  backgroundColor={sbg.backButtonColor || '#fff'}
                  key={ss.key}
                />
              )
            })}
            <BreadcrumbItem
              backgroundColor={subpage ? breadcrumbsColor[subpage] : '#fff'}
              key={subScreens.length}
              active
            />
          </BreadcrumbItemsWrapper>
          <BackButtonActiveWrapper
            backgroundColor={currLoc.backButtonColor}
            innerRef={ref => (this.refBackButtonActive = ref)}
          >
            <ArrowBackImageWrapper
              onClick={this.handleCloseCurrentSubScreen.bind(
                this,
                activeSubScreen
              )}
            >
              <ArrowBackImage src={currLoc.icon} />
            </ArrowBackImageWrapper>
          </BackButtonActiveWrapper>

          <BackButtonActiveWrapperLong
            backgroundColor={currLoc.backButtonColor}
            innerRef={ref => (this.refBackButtonActiveLong = ref)}
          >
            <BackButtonText color={currLoc.backButtonTextColor || '#fff'}>
              {currLoc.backButtonText}
            </BackButtonText>
            <ArrowBackImageWrapper
              onClick={this.handleCloseCurrentSubScreen.bind(
                this,
                activeSubScreen
              )}
            >
              <ArrowBackImage src={currLoc.icon} />
            </ArrowBackImageWrapper>
          </BackButtonActiveWrapperLong>
        </Container>
      )
    }

    if (this.props.NavigationStore.locationWhileOnGameState) {
      TweenMax.to(this.props.MenuItemViewInterrupt, 0.3, { x: '0%' })
      return (
        <Container>
          <BreadcrumbItemsWrapper>
            <BreadcrumbItem
              backgroundColor={breadcrumbsColor[page]}
              key={subScreens.length}
              active
            />
          </BreadcrumbItemsWrapper>
          <BackButtonActiveWrapper
            backgroundColor={currLoc.backButtonColor}
            innerRef={ref => (this.refBackButtonActive = ref)}
          >
            <ArrowBackImageWrapper onClick={this.props.toGameState}>
              <ArrowBackImage src={currLoc.icon} />
            </ArrowBackImageWrapper>
          </BackButtonActiveWrapper>

          <BackButtonActiveWrapperLong
            backgroundColor={currLoc.backButtonColor}
            innerRef={ref => (this.refBackButtonActiveLong = ref)}
          >
            <BackButtonText color={currLoc.backButtonTextColor || '#fff'}>
              {currLoc.backButtonText}
            </BackButtonText>
            <ArrowBackImageWrapper onClick={this.props.toGameState}>
              <ArrowBackImage src={currLoc.icon} />
            </ArrowBackImageWrapper>
          </BackButtonActiveWrapperLong>
        </Container>
      )
    } else {
      if (this.props.MenuItemViewInterrupt) {
        TweenMax.to(this.props.MenuItemViewInterrupt, 0.3, { x: '101%' })
      }
      return null
    }

    return null
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const BackButtonActiveWrapper = styled.div`
  position: absolute;
  width: ${props => (IsMobile ? 20 : 15)}%;
  height: 99%;
  border-top-right-radius: ${props => responsiveDimension(6.8)};
  border-bottom-right-radius: ${props => responsiveDimension(6.8)};
  background-color: ${props => props.backgroundColor};
  display: flex;
`

const BackButtonActiveWrapperLong = styled.div`
  position: absolute;
  height: 99%;
  border-top-right-radius: ${props => responsiveDimension(6.8)};
  border-bottom-right-radius: ${props => responsiveDimension(6.8)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  flex-direction: row;
  transform: translateX(-101%);
`

const BackButtonText = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.8)};
  color: ${props => props.color};
  line-height: 1;
  letter-spacing: ${props => responsiveDimension(0.1)};
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding-left: 1vh;
  padding-right: 1vh;
`

const ArrowBackImageWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const ArrowBackImage = styled.img`
  width: 100%;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  //margin-right: ${props => props.marginRightInPct || 0}%;
  padding-right: 20%;
`

const BreadcrumbItemsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${props => (IsMobile ? 20 : 15)}%;
`

const BreadcrumbItem = styled.div`
  width: ${props => responsiveDimension(2)};
  max-width: ${props => responsiveDimension(2)};
  height: ${props => responsiveDimension(2)};
  max-height: ${props => responsiveDimension(2)};
  border-radius: 50%;
  margin-left: 3%;
  ${props =>
    props.active
      ? `border: ${responsiveDimension(0.4)} solid ${
          props.backgroundColor
        };opacity:0;animation: ${fadeIn} 0.1s forwards;animation-delay:0.2s;`
      : `background-color: ${props.backgroundColor};`};
`

const fadeIn = keyframes`
  0%{opacity:0;}
  100%{opacity:1;}
`
