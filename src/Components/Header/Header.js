import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import iconMenuPlayalong from '@/assets/images/playalong-logo.svg'
import iconMenu from '@/assets/images/icon-menu.svg'
import iconMenuProfile from '@/assets/images/profile-image.jpg'
import { extendObservable } from 'mobx'

import TweenMax from 'gsap/TweenMax'
import Menu from '@/Components/Menu'

@inject('UserStore', 'NavigationStore')
@observer
class Header extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      show: false,
    })
  }

  showMenu() {
    if (this.refMenu.classList.contains('open')) {
      this.refMenu.className = this.refMenu.className.replace(' open', '')
      this.show = false
      TweenMax.to(this.refMenu, 0.3, {
        width: '0%',
        zIndex: -1,
      })
    } else {
      this.refMenu.className += ' open'
      this.show = true
      TweenMax.to(this.refMenu, 0.3, {
        width: '100%',
        zIndex: 1000,
      })
    }
  }

  navHome() {
    this.props.NavigationStore.setCurrentView('init')
  }

  render() {
    // if(!this.props.UserStore.currentUser){
    //   return null;
    // }
    return [
      <TopNav key="header" innerRef={c => (this.refTopNav = c)}>
        <TopNavContentLeft>
          <IconMenuProfile
            onClick={this.navHome.bind(this)}
            src={iconMenuProfile}
          />
        </TopNavContentLeft>
        <TopNavContentMiddle>
          <IconMenuPlayalong
            onClick={this.navHome.bind(this)}
            src={iconMenuPlayalong}
          />
        </TopNavContentMiddle>
        <TopNavContentRight onClick={this.showMenu.bind(this)}>
          <IconMenu src={iconMenu} />
        </TopNavContentRight>
      </TopNav>,
      <MenuContainer key="menu">
        <MenuWrapper innerRef={c => (this.refMenu = c)}>
          <Menu close={this.showMenu.bind(this)} show={this.show} />
        </MenuWrapper>
      </MenuContainer>,
    ]
  }
}

export default Header

const maxWidth = '69vh'

const MenuContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 100vh;
  max-width: 660px;
  width: 100%;
  position: absolute;
  overflow: hidden;
`
const MenuWrapper = styled.div`
  width: 0%;
  height: 100%;
  top: 6vh;
  position: relative;
  display: flex;
  z-index: 20;
  left: 0px;
`

const TopNav = styled.div`
  width: 69vh;
  height: 6vh;
  position: relative;
  display: flex;
  background-color: #000000;
  z-index: 100;
`
const TopNavContentLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1.8vh;

  @media screen and (max-width: ${props => maxWidth}) {
    margin-left: 2.7vw;
  }
`
const TopNavContentMiddle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const TopNavContentRight = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2vh 0 2vh;

  @media screen and (max-width: ${props => maxWidth}) {
    padding: 0 2.7vw 0 2.7vw;
  }
`
const IconMenu = styled.img`
  width: 2.7vh;
  @media screen and (max-width: ${props => maxWidth}) {
    width: 4vw;
  }
`
const IconMenuPlayalong = styled.img`
  cursor: pointer;
  @media screen and (max-width: ${props => maxWidth}) {
    height: 7.8vw;
  }
`
const IconMenuProfile = styled.img`
  \cursor: pointer;
  height: 5.2vh;
  width: 5.2vh;
  border-radius: 5.2vh;
  border: 0.3vh solid #ffffff;
  @media screen and (max-width: ${props => maxWidth}) {
    width: 7.5vw;
    height: 7.5vw;
  }
`
