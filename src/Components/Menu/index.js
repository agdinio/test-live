import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import bgDefault from '@/assets/images/playalong-default.jpg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import MenuItem from './MenuItem'
import { vhToPx, responsiveDimension } from '@/utils'

const items = [
  {
    label: 'PURCHASE TOKENS',
    labelColor: '#000000',
    backgroundColor: '#ffb200',
    iconCircleBackgroundColor: '#000000',
    iconBorderColor: '#ffffff',
    icon: 'playalongnow-icon-tokens_menu.svg',
    iconHeight: '65%',
    route: '/purchasetokens',
  },
  /*
  {
    label: 'YOUR KEY',
    labelColor: '#000000',
    backgroundColor: '#19d1bf',
    bold: true,
    iconCircleBackgroundColor: '#000000',
    icon: 'menu-key-icon.svg',
    iconHeight: '65%',
    route: '/outro',
  },
*/
  /*
  {
    label: 'TOKENS & POINTS',
    labelColor: '#000000',
    backgroundColor: '#ffb200',
    iconCircleBackgroundColor: '#ffffff',
    icon: 'menu-token-icon.svg',
    iconHeight: '65%',
    route: '/wallet',
  },
*/
  {
    label: 'PRIZE CHEST',
    labelColor: '#FFFFFF',
    backgroundColor: '#946fa8',
    iconCircleBackgroundColor: '#946fa8',
    iconBorderColor: '#ffffff',
    icon: 'menu-prize_chest-icon.svg',
    iconHeight: '65%',
    route: '/prizechest',
  },
  {
    label: 'PRIZE BOARDS',
    labelColor: '#FFFFFF',
    backgroundColor: '#7635dc',
    iconCircleBackgroundColor: '#7635dc',
    iconBorderColor: '#ffffff',
    icon: 'menu-prize_boards-icon.svg',
    iconHeight: '65%',
    route: '/prizeboard',
  },
  {
    label: 'STAR BOARDS',
    labelColor: '#000000',
    backgroundColor: '#eede16',
    iconCircleBackgroundColor: '#000000',
    iconBorderColor: '#ffffff',
    icon: 'star-icon-gold.svg',
    iconHeight: '65%',
    route: '/starboard',
  },
  {
    label: 'LEADER BOARDS',
    labelColor: '#FFFFFF',
    backgroundColor: '#353773',
    iconCircleBackgroundColor: '#353773',
    iconBorderColor: '#ffffff',
    icon: 'menu-leaderboard-icon.svg',
    iconHeight: '65%',
    route: '/leaderboard',
  },

  {
    label: 'SOCIAL',
    labelColor: '#FFFFFF',
    backgroundColor: '#0a69b8',
    iconCircleBackgroundColor: '#0a69b8',
    iconBorderColor: '#ffffff',
    icon: 'menu-social-icon-white.svg',
    iconHeight: '65%',
    route: '/sharestatus',
  },

  {
    label: 'PROFILE AND SETTINGS',
    labelColor: '#FFFFFF',
    backgroundColor: '#16b1e7',
    iconCircleBackgroundColor: '#16b1e7',
    iconBorderColor: '#ffffff',
    icon: 'menu-profile-icon.svg',
    iconHeight: '65%',
    route: '/profile',
  },
  {
    label: 'FOLLOWED GAMES',
    labelColor: '#FFFFFF',
    backgroundColor: '#c61618',
    iconCircleBackgroundColor: '#c61618',
    iconBorderColor: '#ffffff',
    icon: 'menu-followed_games-icon.svg',
    iconHeight: '65%',
    route: '/followedgames',
  },
  {
    label: 'HOW TO PLAY',
    labelColor: '#FFFFFF',
    backgroundColor: '#414042',
    iconCircleBackgroundColor: '#414042',
    iconBorderColor: '#ffffff',
    icon: 'menu-how_to_play-icon.svg',
    iconHeight: '65%',
    route: '/instructions',
  },
  /*
  {
    label: 'SCHEDULE',
    labelColor: '#FFFFFF',
    backgroundColor: '#ff1a1a',
    iconCircleBackgroundColor: '#ffffff',
    icon: 'menu-schedule-icon.svg',
    iconHeight: '65%',
    route: '/livegameschedule'
  },
  {
    label: 'TERMS & PRIVACY ',
    labelColor: '#FFFFFF',
    backgroundColor: '#555858',
    iconCircleBackgroundColor: '#ffffff',
    icon: 'menu-privacy-icon.svg',
    iconHeight: '65%',
  },
*/
]

@inject('NavigationStore')
@observer
export default class Menu extends Component {
  componentDidMount() {
    //this.initSlideEventMenuDesktop()
  }

  initSlideEventMenuDesktop() {
    let startX
    let isDown = false

    this.refMenu.addEventListener('mousedown', e => {
      isDown = true
      startX = e.screenX + this.refMenu.offsetLeft
    })

    this.refMenu.addEventListener('mousemove', e => {
      if (!isDown) {
        return false
      }

      let change = startX - e.screenX
      console.log(change)
      if (change > 0) {
        return
      }
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
        TweenMax.to(this.refMenu, 0.5, {
          x: '0%',
          onComplete: () => {
            this.show = false
          },
        })
      } else {
        this.refMenu.className += ' open'
        TweenMax.to(this.refMenu, 0.5, {
          x: '-100%',
        })
        this.show = true
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
        TweenMax.to(this.refMenu, 0.5, {
          x: '0%',
          onComplete: () => {
            this.show = false
          },
        })
      } else {
        this.refMenu.className += ' open'
        TweenMax.to(this.refMenu, 0.5, {
          x: '-100%',
        })
        this.show = true
      }
    })
  }
  getMenuClickAction(itemDetails) {
    console.log('itemDetails', itemDetails)
  }
  render() {
    return (
      <Container bg={bgDefault} innerRef={ref => (this.refMenu = ref)}>
        <InitCoat />
        <FinalCoat>
          <Top>
            <TopLogo src={sportocoLogo} />
          </Top>
          <MenuItemWrapper>
            {items.map((item, key) => {
              return (
                <MenuItem
                  show={this.props.show}
                  close={this.props.close}
                  item={item}
                  onChange={() => this.getMenuClickAction(item)}
                  key={key}
                />
              )
            })}
          </MenuItemWrapper>
        </FinalCoat>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`
const InitCoat = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-left: ${props => responsiveDimension(1.2)} solid
    rgba(255, 255, 255, 0.5);
  background-color: rgba(33, 35, 31, 0.9);
`
const FinalCoat = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`
const Top = styled.div`
  width: 100%;
  height: 6.4%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(33, 35, 31, 0.5);

  z-index: 100;
  &:before {
    content: 'POWERED BY';
    padding-right: 1%;
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(1.8)};
    color: #ffffff;
    padding-top: 0.8%;
  }
`
const TopLogo = styled.img`
  height: 30%;
  padding-right: 5%;
`
const MenuItemWrapper = styled.div`
  width: 100%;
  height: 100%;
`
