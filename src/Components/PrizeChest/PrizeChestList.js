import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import * as util from '@/utils'
import { TweenMax, TimelineMax, Back, Ease } from 'gsap'
import PrizeChestItem from '@/Components/PrizeChest/PrizeChestItem'
import UserPrizeList from '@/Components/PrizeChest/UserPrizeList'
import UserStarPrizeList from '@/Components/PrizeChest/UserStarPrizeList'
import { eventCapture } from '../Auth/GoogleAnalytics'
@inject('NavigationStore', 'PrizeBoardStore', 'ProfileStore', 'PrizeChestStore')
export default class PrizeChestList extends Component {
  constructor(props) {
    super(props)
    //this.props.ProfileStore.getProfile()
  }

  handlePrizeChestItemClick(item) {
    switch (item.keyword) {
      case 'starboard':
        this.props.showStarBoard(item)
        break
      case 'woot':
        this.props.showWoot(item)
        break
      case 'amalfi':
        this.props.showAmalfi(item)
        break
      case 'hotel':
        this.props.showHotel(item)
        break
      case 'broadway':
        this.props.showPrizeBoardItem(item)
        break
      case 'gear':
        this.props.showPrizeBoardItem(item)
        break
      default:
        this.props.showDefaultScreen(item)

        break
    }
    console.log('item.keyword', item.keyword)
    let details = {
      price_chest: item.keyword,
    }
    eventCapture('price_chest', details)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('COMPONENT DID UPDATE SA LIST', nextProps.PrizeBoardStore.userPrize)
  //   return false
  // }

  // componentWillUpdate(nextProps) {
  //   console.log('WILL RECEIVE DAW', nextProps.PrizeBoardStore.userPrize.prizes)
  //
  // }

  shouldComponentUpdate() {
    return false
  }

  componentDidUpdate(nextProps) {
    try {
      if (
        !this.props.ProfileStore.isLoading &&
        !this.props.ProfileStore.err &&
        !this.props.PrizeChestStore.isLoading
      ) {
        this.props.PrizeBoardStore.setLockPrizeSlide(false)
        this.ItemDetailSlideEvent()
      }
    } catch (err) {}
  }

  componentWillUnmount() {
    this.props.NavigationStore.setActiveMenu(null)
  }

  componentDidMountNEW() {
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )

    this.props.PrizeChestStore.getPrizeChest()
  }

  componentDidMount() {
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )

    if (
      !this.props.ProfileStore.isLoading &&
      !this.props.ProfileStore.err &&
      !this.props.PrizeChestStore.isLoading
    ) {
      this.props.PrizeBoardStore.setLockPrizeSlide(false)
      this.ItemDetailSlideEvent()
    }

    this.props.PrizeBoardStore.setLockPrizeSlide(false)
    this.ItemDetailSlideEvent()

    // this.props.PrizeBoardStore.getPrizesByUser(this.props.ProfileStore.profile.userId).then(res => {
    //   if (res) {
    //     console.log('render', res)
    //     this.props.PrizeBoardStore.setLockPrizeSlide(false)
    //     this.ItemDetailSlideEvent()
    //   }
    // })
  }

  render() {
    let { profile, err } = this.props.ProfileStore
    let { prizeChestList } = this.props.PrizeChestStore
    let { userPrize } = this.props.PrizeBoardStore

    if (
      (this.props.ProfileStore.isLoading && !err) ||
      this.props.PrizeChestStore.isLoading ||
      this.props.PrizeBoardStore.isLoading
    ) {
      return <Container />
    }

    return (
      <Container>
        <ContentScrolling>
          <PrizeItemWrapper>
            {/**
             * Default from PrizeChest
             */
            prizeChestList.map(item => {
              return (
                <PrizeChestItem
                  key={item.keyword}
                  item={item}
                  profile={profile}
                  refHandleClick={this.handlePrizeChestItemClick.bind(
                    this,
                    item
                  )}
                />
              )
            })}

            <UserPrizeList refHideBanner={this.props.refHideBanner} />

            <UserStarPrizeList refHideBanner={this.props.refHideBanner} />
          </PrizeItemWrapper>
        </ContentScrolling>
      </Container>
    )
  }

  ItemDetailSlideEvent() {
    let startX
    let isDown = false

    /**
     * Desktop Browser
     */
    if (!this.ContentItemDetail) {
      return
    }
    this.ContentItemDetail.addEventListener('mousedown', e => {
      isDown = true
      startX = e.screenX + this.ContentItemDetail.offsetLeft
    })

    this.ContentItemDetail.addEventListener('mousemove', e => {
      // if (this.props.PrizeBoardStore.lockPrizeSlide) {
      //   return
      // }
      if (!isDown) {
        return false
      }

      /*
      if (e.screenX >= 500) {
        TweenMax.to(this.ContentItemDetail, 0.3, { x: '100%' })
        isDown = false
        return
      }
*/

      let change = startX - e.screenX
      if (change > 0) {
        return
      }
      TweenMax.to(this.ContentItemDetail, 0, { x: -change })
    })

    this.ContentItemDetail.addEventListener('mouseup', e => {
      // if (this.props.PrizeBoardStore.lockPrizeSlide) {
      //   return
      // }

      isDown = false

      let x = this.ContentItemDetail.offsetWidth
      let change = startX - e.screenX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.ContentItemDetail.offsetWidth / 2
      } else {
        threshold = x - this.ContentItemDetail.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        TweenMax.to(this.ContentItemDetail, 0.3, {
          x: '100%',
          onComplete: () => {
            this.clearDetail()
          },
        })
      } else {
        TweenMax.to(this.ContentItemDetail, 0.3, { x: '0%' })
      }
    })

    this.ContentItemDetail.addEventListener('mouseleave', e => {
      if (!isDown) {
        return false
      }

      isDown = false

      let x = this.ContentItemDetail.offsetWidth
      let change = startX - e.screenX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.ContentItemDetail.offsetWidth / 2
      } else {
        threshold = x - this.ContentItemDetail.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        TweenMax.to(this.ContentItemDetail, 0.3, {
          x: '100%',
          onComplete: () => {
            this.clearDetail()
          },
        })
      } else {
        TweenMax.to(this.ContentItemDetail, 0.3, { x: '0%' })
      }
    })

    /**
     * Mobile Browser
     */
    this.ContentItemDetail.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX + this.ContentItemDetail.offsetLeft
    })

    this.ContentItemDetail.addEventListener('touchmove', e => {
      // if (this.props.PrizeBoardStore.lockPrizeSlide) {
      //   return
      // }
      let change = startX - e.touches[0].clientX
      if (change > 0) {
        return
      }
      TweenMax.to(this.ContentItemDetail, 0, { x: -change })
    })

    this.ContentItemDetail.addEventListener('touchend', e => {
      // if (this.props.PrizeBoardStore.lockPrizeSlide) {
      //   return
      // }
      let x = this.ContentItemDetail.offsetWidth
      let change = startX - e.changedTouches[0].clientX

      let threshold = 0
      let distX = x + (e.changedTouches[0].clientX - startX)
      if (distX < 0) {
        threshold = x + this.ContentItemDetail.offsetWidth / 2
      } else {
        threshold = x - this.ContentItemDetail.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        TweenMax.to(this.ContentItemDetail, 0.3, {
          x: '100%',
          onComplete: () => {
            this.clearDetail()
          },
        })
      } else {
        TweenMax.to(this.ContentItemDetail, 0.3, { x: '0%' })
      }
    })
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`

const PrizeItemWrapper = styled.div`
  width: inherit;
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
    width: ${props => util.vhToPx(0.1)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
`
