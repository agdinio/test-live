import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import PrizeBoardNav from '@/Components/PrizeBoard/PrizeList/PrizeBoardNav'
import { TweenMax } from 'gsap'
import bg_default from '@/assets/images/playalong-default.jpg'
import { vhToPx, maxWidth } from '@/utils'
import PrizeView from '@/Components/PrizeBoard/PrizeList/PrizeView'
import PrizeClaim from '@/Components/PrizeBoard/PrizeList/PrizeClaim'
import PrizeClaimTerms from '@/Components/PrizeBoard/PrizeList/PrizeClaimTerms'
import AuthSequence from '@/Components/PrizeBoard/PrizeList/Auth'
import UserCreatePrizeType from '@/types/UserCreatePrizeType'

@inject('PrizeBoardStore', 'NavigationStore', 'ProfileStore', 'AnalyticsStore')
@observer
export default class PrizeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      prizeViewOrClaimScreen: null,
      lightboxScreen: null,
    }

    this.activeItem = this.props.currentItem
  }

  analyticTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  analyticTimeStop(page, pItem) {
    let _args = { page: page }

    if (pItem && Object.keys(pItem).length > 0) {
      _args.categoryId = pItem.prizeBoardId
      _args.productId = pItem.prizeBoardPrizeId
      _args.type = pItem.currencyType
      _args.value = pItem.value
    }

    this.props.AnalyticsStore.timeStop(_args)
  }

  slideEventDesktop() {
    let startX
    let isDown = false

    if (!this.refViewOrClaimWrapper) {
      return
    }

    this.refViewOrClaimWrapper.addEventListener('mousedown', e => {
      e.stopPropagation()
      isDown = true
      startX = e.screenX + this.refViewOrClaimWrapper.offsetLeft
    })

    this.refViewOrClaimWrapper.addEventListener('mousemove', e => {
      e.stopPropagation()
      if (!isDown) {
        return false
      }

      let change = startX - e.screenX
      if (change > 0) {
        return
      }

      TweenMax.to(this.refViewOrClaimWrapper, 0, { x: -change })
    })

    this.refViewOrClaimWrapper.addEventListener('mouseup', e => {
      e.stopPropagation()
      isDown = false

      let x = this.refViewOrClaimWrapper.offsetWidth
      let change = startX - e.screenX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.refViewOrClaimWrapper.offsetWidth / 2
      } else {
        threshold = x - this.refViewOrClaimWrapper.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, {
          x: '100%',
          onComplete: () => {
            this.resetLightbox()
            this.props.hideBanner(false)
            this.setState({ prizeViewOrClaimScreen: null })
          },
        })
      } else {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, { x: '0%' })
      }
    })

    this.refViewOrClaimWrapper.addEventListener('mouseleave', e => {
      e.stopPropagation()

      if (!isDown) {
        return false
      }

      isDown = false

      let x = this.refViewOrClaimWrapper.offsetWidth
      let change = startX - e.screenX

      let threshold = 0
      let distX = x + (e.screenX - startX)
      if (distX < 0) {
        threshold = x + this.refViewOrClaimWrapper.offsetWidth / 2
      } else {
        threshold = x - this.refViewOrClaimWrapper.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, {
          x: '100%',
          onComplete: () => {
            this.resetLightbox()
            this.props.hideBanner(false)
            this.setState({ prizeViewOrClaimScreen: null })
          },
        })
      } else {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, { x: '0%' })
      }
    })
  }

  slideEventMobile() {
    let startX

    if (!this.refViewOrClaimWrapper) {
      return
    }

    this.refViewOrClaimWrapper.addEventListener('touchstart', e => {
      e.stopPropagation()
      startX = e.touches[0].clientX + this.refViewOrClaimWrapper.offsetLeft
    })

    this.refViewOrClaimWrapper.addEventListener('touchmove', e => {
      e.stopPropagation()
      let change = startX - e.touches[0].clientX
      if (change > 0) {
        return
      }
      TweenMax.to(this.refViewOrClaimWrapper, 0, { x: -change })
    })

    this.refViewOrClaimWrapper.addEventListener('touchend', e => {
      e.stopPropagation()
      let x = this.refViewOrClaimWrapper.offsetWidth
      let change = startX - e.changedTouches[0].clientX

      let threshold = 0
      let distX = x + (e.changedTouches[0].clientX - startX)
      if (distX < 0) {
        threshold = x + this.refViewOrClaimWrapper.offsetWidth / 2
      } else {
        threshold = x - this.refViewOrClaimWrapper.offsetWidth / 2
      }

      if (Math.abs(change) > threshold) {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, {
          x: '100%',
          onComplete: () => {
            this.resetLightbox()
            this.props.hideBanner(false)
            this.setState({ prizeViewOrClaimScreen: null })
          },
        })
      } else {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, { x: '0%' })
      }
    })
  }

  activeTab(key, init) {
    if (key >= this.props.prizeBoards.length) {
      this.props.NavigationStore.removeSubScreen('PrizeBoard-PrizeList')

      try {
        const prevBoardName = this.props.prizeBoards[key - 1].boardName
        this.analyticTimeStop(`PrizeBoard-${prevBoardName.replace(/\s+/g, '')}`)
      } catch (e) {}

      return
    }

    const tab = this['tab' + key]
    if (tab) {
      let tabWidth = tab.offsetWidth
      if (init) {
        TweenMax.set(this.TabWrapper, { left: -(tabWidth * key) })
      } else {
        TweenMax.to(this.TabWrapper, 0.3, { left: -(tabWidth * key) })
      }
    }

    let prevBoardName = null
    let currBoardName = null
    try {
      prevBoardName = this.props.prizeBoards[key - 1].boardName
      this.analyticTimeStop(`PrizeBoard-${prevBoardName.replace(/\s+/g, '')}`)
    } catch (e) {}
    try {
      this.activeItem = this.props.prizeBoards[key]
      currBoardName = this.props.prizeBoards[key].boardName
      this.analyticTimeStart(`PrizeBoard-${currBoardName.replace(/\s+/g, '')}`)
    } catch (e) {}
  }

  showActiveTab() {
    // if (this.props.currentItem) {
    //   const idx = this.props.prizeBoards.findIndex(
    //     o =>
    //       o.boardTypeId.toLowerCase() === this.props.currentItem.toLowerCase()
    //   )
    //   if (idx > -1) {
    //     this.activeTab(idx, true)
    //   }
    // }
    if (this.props.currentItem && this.props.currentItem.prizeBoardId) {
      const idx = this.props.prizeBoards.findIndex(
        o => o.prizeBoardId === this.props.currentItem.prizeBoardId
      )
      if (idx > -1) {
        this.activeTab(idx, true)
      }
    }
  }

  handleClosePrizeViewOrClaim(displayName) {
    this.props.NavigationStore.removeSubScreen(displayName)
  }

  handlePrizeViewOrClaimHasLoaded(next) {
    if (next) {
      if (this.refViewOrClaimWrapper) {
        TweenMax.to(this.refViewOrClaimWrapper, 0.3, { x: '0%' })
      }
    }
  }

  handleHideBanner(res) {
    this.props.hideBanner(res)
  }

  handlePrizeView(item) {
    let comp = (
      <PrizeView
        item={item}
        key={`view-${item.shortName}${item.seasonId}${item.boardTypeId}`}
        refClosePanel={this.handleClosePrizeViewOrClaim.bind(
          this,
          'PrizeBoard-PrizeView'
        )}
        refUsePoints={this.handleUsePoints.bind(this)}
        hideBanner={this.handleHideBanner.bind(this)}
        timeStart={this.analyticTimeStart.bind(
          this,
          `PrizeBoard-PrizeView-${item.title.replace(/\s+/g, '')}`
        )}
        timeStop={this.analyticTimeStop.bind(
          this,
          `PrizeBoard-PrizeView-${item.title.replace(/\s+/g, '')}`,
          item
        )}
      />
    )
    this.props.NavigationStore.addSubScreen(comp, 'PrizeBoard-PrizeView')
  }

  handleClaimView(item) {
    let comp = (
      <PrizeClaim
        item={item}
        key={`claim-${item.shortName}${item.seasonId}${item.boardTypeId}`}
        refClosePanel={this.handleClosePrizeViewOrClaim.bind(
          this,
          'PrizeBoard-PrizeClaim'
        )}
        refUsePoints={this.handleUsePoints.bind(this)}
        refPrizeViewOrClaimContainer={ref =>
          (this.refPrizeViewOrClaimContainer = ref)
        }
        timeStart={this.analyticTimeStart.bind(
          this,
          `PrizeBoard-PrizeClaim-${item.title.replace(/\s+/g, '')}`
        )}
        timeStop={this.analyticTimeStop.bind(
          this,
          `PrizeBoard-PrizeClaim-${item.title.replace(/\s+/g, '')}`,
          item
        )}
      />
    )
    this.props.NavigationStore.addSubScreen(comp, 'PrizeBoard-PrizeClaim')
  }

  gotoPrizeClaimTerms(item) {
    this.props.PrizeBoardStore.prizeClaimTerms(item).then(updatedPrize => {
      if (updatedPrize) {
        this.props.AnalyticsStore.addFlag({
          productId: updatedPrize.prizeBoardPrizeId,
          addedToPrizeChest: true,
          prizeChestType: updatedPrize.currencyType,
        })
        this.props.NavigationStore.removeSubScreen('AuthSequence')
        this.props.NavigationStore.removeSubScreen('PrizeBoard-PrizeView')
        this.props.NavigationStore.removeSubScreen('PrizeBoard-PrizeClaim')

        console.log(
          '====================prizeclaimterms',
          item.id,
          updatedPrize.id
        )

        let comp = (
          <PrizeClaimTerms
            item={updatedPrize}
            refHideBanner={this.handleHideBanner.bind(this)}
            timeStart={this.analyticTimeStart.bind(
              this,
              `PrizeBoard-PrizeClaimTerms-${updatedPrize.title.replace(
                /\s+/g,
                ''
              )}`
            )}
            timeStop={this.analyticTimeStop.bind(
              this,
              `PrizeBoard-PrizeClaimTerms-${updatedPrize.title.replace(
                /\s+/g,
                ''
              )}`
            )}
          />
        )
        this.props.NavigationStore.addSubScreen(
          comp,
          'PrizeBoard-PrizeClaimTerms'
        )
      }
    })
  }

  gotoPrizeClaimTermsXXX(item) {
    this.props.PrizeBoardStore.debitPrize(item)
      .then(res => {
        if (res) {
          if (this.props.ProfileStore.profile.userId) {
            this.props.NavigationStore.removeSubScreen('AuthSequence')
            this.props.NavigationStore.removeSubScreen('PrizeBoard-PrizeView')
            this.props.NavigationStore.removeSubScreen('PrizeBoard-PrizeClaim')

            this.props.PrizeBoardStore.addUserPrizes(item)

            let comp = (
              <PrizeClaimTerms
                item={item}
                refHideBanner={this.handleHideBanner.bind(this)}
              />
            )
            this.props.NavigationStore.addSubScreen(
              comp,
              'PrizeBoard-PrizeClaimTerms'
            )
          } else {
            this.loginFirst(item)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  resetLightbox() {
    this.setState({ lightboxScreen: null })
    if (this.refLightboxWrapper) {
      this.refLightboxWrapper.style.zIndex = -151
    }
  }

  loginFirst(item) {
    let comp = (
      <AuthSequence
        item={item}
        refGotoPrizeTermClaims={this.gotoPrizeClaimTerms.bind(this, item)}
      />
    )

    this.props.NavigationStore.addSubScreen(comp, 'AuthSequence', true)
  }

  handleUsePoints(item) {
    this.props.hideBanner(true)

    if (!this.props.ProfileStore.profile.userId) {
      this.loginFirst(item)
      return
    }

    this.gotoPrizeClaimTerms(item)
  }

  componentDidUpdate(nextProps) {
    if (
      nextProps.currentItem.prizeBoardId !== this.props.currentItem.prizeBoardId
    ) {
      this.showActiveTab()
    }
  }

  XXXshouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.prizeViewOrClaimScreen !== this.state.prizeViewOrClaimScreen
    ) {
      return true
    }

    if (nextState.lightboxScreen !== this.state.lightboxScreen) {
      return true
    }

    return false
  }

  componentWillUnmount() {
    try {
      const currBoard = this.props.prizeBoards.filter(
        o => o.prizeBoardId === this.activeItem.prizeBoardId
      )[0]
      if (currBoard) {
        this.analyticTimeStop(
          `PrizeBoard-${(currBoard.boardName || '').replace(/\s+/g, '')}`
        )
      }
    } catch (e) {}
  }

  componentDidMount() {
    this.showActiveTab()
  }

  render() {
    let { prizeBoards, prizes } = this.props

    return (
      <Container>
        <TabWrapper
          count={prizeBoards.length}
          innerRef={ref => (this.TabWrapper = ref)}
        >
          {prizeBoards.map((item, key) => {
            let prizeboardPrizes = prizes.filter(
              o =>
                //o.boardTypeId.toLowerCase() === item.boardTypeId.toLowerCase() &&
                //o.seasonId.toLowerCase() === item.seasonGroup.toLowerCase() &&
                o.prizeBoardId === item.prizeBoardId
            )

            return (
              <Tab
                pos={'absolute'}
                key={key}
                tabindex={key}
                innerRef={c => (this['tab' + key] = c)}
                mWidth={window.innerWidth}
              >
                <PrizeBoardNav
                  profile={this.props.profile}
                  index={key}
                  item={item}
                  prizeboardPrizes={prizeboardPrizes}
                  itemCount={prizeBoards.length}
                  handleClickNextTabFromPrizeBoard={this.activeTab.bind(this)}
                  refPrizeView={this.handlePrizeView.bind(this)}
                  refPrizeClaim={this.handleClaimView.bind(this)}
                />
              </Tab>
            )
          })}
        </TabWrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: inherit;
  height: inherit;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0 auto;
  background-image: url(${bg_default});
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
`
const TabWrapper = styled.div`
  width: calc(100.1% * ${props => props.count});
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
`
const Tab = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`
