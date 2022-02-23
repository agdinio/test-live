import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { intercept, observe } from 'mobx'
import { inject } from 'mobx-react'
import { TweenMax, TimelineMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import StarIconWhite from '@/assets/images/star-icon-white.svg'
import StarIconDark from '@/assets/images/star-icon-dark.svg'
import StarIconDarkGrayBorder from '@/assets/images/star-icon-dark-gray-border.svg'
import StarIconDarkGrayBorderThick from '@/assets/images/star-icon-dark-gray-border-thick.svg'
import PlusSignIcon from '@/assets/images/add-icon-black.svg'
import StarRedeem from '@/Components/StarBoard/StarRedeem'
import DefaultIcon from '@/assets/images/starboard/default.png'
import {
  vhToPx,
  evalImage,
  numberFormat,
  hex2rgb,
  isEqual,
  vwToPx,
  loadImagesSelectedUponPageLoad,
  responsiveDimension,
} from '@/utils'
import StarRedeemTerms from '@/Components/StarBoard/StarRedeemTerms'
import AuthSequence from '@/Components/PrizeBoard/PrizeList/Auth'
import Circle from '@/Components/Common/Circle'
import { starboardView, addStarForStarboard } from '../Auth/GoogleAnalytics'
@inject(
  'PrizeBoardStore',
  'StarBoardStore',
  'NavigationStore',
  'ProfileStore',
  'AnalyticsStore'
)
export default class StarCategoryPrizeType extends Component {
  constructor(props) {
    super(props)
    this.animRefs = {
      refThisToggle: null,
      refViewButtonToggle: null,
      refClaimButtonToggle: null,
      refPrizeContainerToggle: null,
      refSlideItemInfoToggle: null,
      refPrizeImageToggle: null,
      refMovingCircleToggle: null,
      refStarCounterToggle: null,
    }

    this._isMounted = false
    this.entry = null
    this.userPrize = this.props.userPrize
    this.uniqueIdentifier = null
    this.check = null
    this.prizeAvailable = true
    this.prizeForRedeem = false
    this.flagUsed = 0
    this.handlePrizeImageClick = this.handlePrizeImageClick.bind(this)

    this.disposeActiveSlidingItem = intercept(
      this.props.StarBoardStore,
      'activeSlidingItem',
      change => {
        if (change.newValue) {
          if (
            this.uniqueIdentifier &&
            change.newValue != this.uniqueIdentifier
          ) {
            this.reverseActiveItem()
          } else {
            this.executeActiveItem()
          }
        }
        return change
      }
    )
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page, pItem) {
    let _args = { page: page }

    if (pItem && Object.keys(pItem).length > 0) {
      _args.categoryId = pItem.prizeBoardId
      _args.productId = pItem.prizeBoardPrizeId
      _args.type = pItem.currencyType
      _args.value = pItem.value
    }

    this.props.AnalyticsStore.timeStop(_args)
  }

  handlePrizeImageClick(e) {
    e.stopPropagation()
    this.reverseActiveItem()
  }

  executeActiveItem() {
    const refThis = this[`refPrizeContainer-${this.uniqueIdentifier}`]
    const refPrizeContainer = this[`refPrizeContainer-${this.uniqueIdentifier}`]
    const refSlideItemInfo = this[`refSlideItemInfo-${this.uniqueIdentifier}`]
    const refViewButton = this[`refViewButton-${this.uniqueIdentifier}`]
    const refClaimButton = this[`refClaimButton-${this.uniqueIdentifier}`]
    const refPrizeImage = this[`refPrizeImage-${this.uniqueIdentifier}`]
    const refMovingCircle = this[`refMovingCircle-${this.uniqueIdentifier}`]
    const refStarCounter = this[`refStarCounter-${this.uniqueIdentifier}`]

    if (refPrizeContainer && refSlideItemInfo && refPrizeImage) {
      if (!this.prizeAvailable) {
        this.animRefs.refThisToggle = TweenMax.to(refThis, 0.3, {
          backgroundColor: '#202020',
          ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
        })
      }
      this.animRefs.refViewButtonToggle = TweenMax.set(refViewButton, {
        pointerEvents: 'auto',
        visibility: 'visible',
      })
      this.animRefs.refClaimButtonToggle = TweenMax.set(refClaimButton, {
        pointerEvents: 'auto',
        visibility: 'visible',
      })
      this.animRefs.refPrizeContainerToggle = TweenMax.set(refPrizeContainer, {
        pointerEvents: 'none',
      })
      this.animRefs.refSlideItemInfoToggle = TweenMax.to(
        refSlideItemInfo,
        0.3,
        { x: '0%', ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)) }
      )
      this.animRefs.refPrizeImageToggle = TweenMax.set(refPrizeImage, {
        borderRadius: '50%',
        pointerEvents: 'auto',
        visibility: 'visible',
      })
      if (refMovingCircle) {
        if (this.prizeForRedeem) {
          this.animRefs.refMovingCircleToggle = TweenMax.to(
            refMovingCircle,
            0.17,
            { x: '195%', delay: 0.13 }
          )
        } else {
          this.animRefs.refMovingCircleToggle = TweenMax.to(
            refMovingCircle,
            0,
            { opacity: 0, delay: 0.13 }
          )
        }
      }
      if (refStarCounter) {
        if (this.prizeForRedeem) {
          this.animRefs.refStarCounterToggle = TweenMax.to(
            refStarCounter,
            0.17,
            {
              opacity: 0,
            }
          )
        } else {
          this.animRefs.refStarCounterToggle = TweenMax.to(
            refStarCounter,
            0.17,
            {
              zIndex: 10,
            }
          )
        }
      }
      refPrizeImage.addEventListener('click', this.handlePrizeImageClick, true)

      this.setAnimTimeout()
    }
  }

  setAnimTimeout() {
    const refPrizeImage = this[`refPrizeImage-${this.uniqueIdentifier}`]

    this.check = setTimeout(() => {
      if (this.animRefs.refThisToggle) {
        this.animRefs.refThisToggle.reverse()
      }
      if (this.animRefs.refViewButtonToggle) {
        this.animRefs.refViewButtonToggle.reverse()
      }
      if (this.animRefs.refClaimButtonToggle) {
        this.animRefs.refClaimButtonToggle.reverse()
      }
      if (this.animRefs.refPrizeContainerToggle) {
        this.animRefs.refPrizeContainerToggle.reverse()
      }
      if (this.animRefs.refSlideItemInfoToggle) {
        this.animRefs.refSlideItemInfoToggle.reverse()
      }
      if (this.animRefs.refPrizeImageToggle) {
        this.animRefs.refPrizeImageToggle.reverse()
      }
      if (this.animRefs.refMovingCircleToggle) {
        this.animRefs.refMovingCircleToggle.reverse()
      }
      if (this.animRefs.refStarCounterToggle) {
        this.animRefs.refStarCounterToggle.reverse()
      }
      refPrizeImage.removeEventListener(
        'click',
        this.handlePrizeImageClick,
        true
      )

      clearTimeout(this.check)
      this.animRefs = {
        refThisToggle: null,
        refViewButtonToggle: null,
        refClaimButtonToggle: null,
        refPrizeContainerToggle: null,
        refSlideItemInfoToggle: null,
        refPrizeImageToggle: null,
        refMovingCircleToggle: null,
        refStarCounterToggle: null,
      }
    }, 10000)
  }

  reverseActiveItem() {
    if (this.check) {
      clearTimeout(this.check)
    }

    if (this.animRefs.refThisToggle) {
      this.animRefs.refThisToggle.reverse()
    }
    if (this.animRefs.refViewButtonToggle) {
      this.animRefs.refViewButtonToggle.reverse()
    }
    if (this.animRefs.refClaimButtonToggle) {
      this.animRefs.refClaimButtonToggle.reverse()
    }
    if (this.animRefs.refPrizeContainerToggle) {
      this.animRefs.refPrizeContainerToggle.reverse()
    }
    if (this.animRefs.refSlideItemInfoToggle) {
      this.animRefs.refSlideItemInfoToggle.reverse()
    }
    if (this.animRefs.refPrizeImageToggle) {
      this.animRefs.refPrizeImageToggle.reverse()
    }
    if (this.animRefs.refMovingCircleToggle) {
      this.animRefs.refMovingCircleToggle.reverse()
    }
    if (this.animRefs.refStarCounterToggle) {
      this.animRefs.refStarCounterToggle.reverse()
    }

    const refPrizeImage = this[`refPrizeImage-${this.uniqueIdentifier}`]
    if (refPrizeImage) {
      refPrizeImage.removeEventListener(
        'click',
        this.handlePrizeImageClick.bind(this),
        true
      )
    }

    this.animRefs = {
      refThisToggle: null,
      refViewButtonToggle: null,
      refClaimButtonToggle: null,
      refPrizeContainerToggle: null,
      refSlideItemInfoToggle: null,
      refPrizeImageToggle: null,
      refMovingCircleToggle: null,
      refStarCounterToggle: null,
    }
  }

  handlePrizeItemClick(entry, userPrize) {
    this.uniqueIdentifier = `${entry.prizeBoardId}${entry.prizeBoardPrizeId}`

    if (this[`refPrizeContainer-${this.uniqueIdentifier}`]) {
      this[`refPrizeContainer-${this.uniqueIdentifier}`].pointerEvents = 'none'

      setTimeout(() => this[`refPrizeContainer-${this.uniqueIdentifier}`].pointerEvents = 'auto', 3000)
    }

    this.prizeAvailable = entry.qty > 0 ? true : false
    this.prizeForRedeem = userPrize
      ? userPrize.used === entry.value
        ? true
        : false
      : false
    this.props.StarBoardStore.setActiveSlidingItem(this.uniqueIdentifier)
  }

  handleClosePanel(displayName) {
    this.props.NavigationStore.removeSubScreen(displayName)
  }

  loginFirst(item) {
    let comp = (
      <AuthSequence
        item={item}
        refGotoPrizeTermClaims={this.gotoStarRedeemTerms.bind(this)}
      />
    )

    this.props.NavigationStore.addSubScreen(comp, 'AuthSequence', true)
  }

  handleRedeemClick(item) {
    if (!this.props.ProfileStore.profile.userId) {
      this.loginFirst(item)
      return
    }

    this.gotoStarRedeemTerms()
  }

  handleViewButtonClick(entry, e) {
    e.stopPropagation()

    let comp = (
      <StarRedeem
        //item={entry}
        userPrize={this.userPrize || entry}
        // key={`view-${entry.shortName}${entry.seasonId}${entry.boardTypeId}`}
        key={`view-${entry.prizeBoardId}${entry.prizeBoardPrizeId}`}
        refClosePanel={this.handleClosePanel.bind(this, 'StarBoard-StarRedeem')}
        refRedeem={this.handleRedeemClick.bind(this, entry)}
        refHandleAddStarClick={this.handleAddStarClick.bind(this, entry)}
        timeStart={this.handleTimeStart.bind(
          this,
          `StarBoard-PrizeView-${entry.title.replace(/\s+/g, '')}`
        )}
        timeStop={this.handleTimeStop.bind(
          this,
          `StarBoard-PrizeView-${entry.title.replace(/\s+/g, '')}`,
          entry
        )}
      />
    )
    this.props.NavigationStore.addSubScreen(comp, 'StarBoard-StarRedeem')

    this.reverseActiveItem()

    starboardView('view_starboard_category', entry) // get the details GA
  }

  handleUpdatedUserPrize(updatedUserPrize) {
    this.userPrize = updatedUserPrize
    setTimeout(() => this.forceUpdate())
  }

  handleAddStarClick(entry, e) {
    e.stopPropagation()

    if (this.check) {
      clearTimeout(this.check)
    }
    this.setAnimTimeout()

    if (this.prizeForRedeem) {
      if (this.entry.qty > 0) {
        if (!this.props.ProfileStore.profile.userId) {
          this.loginFirst(entry)
        } else {
          this.gotoStarRedeemTerms()
          this.reverseActiveItem()
        }
      } else {
        console.log('SOLD OUT')
      }
    } else {
      if (this.props.ProfileStore.profile.currencies.stars > 0) {
        const amt = 1
        this.flagUsed = this.flagUsed + 1

        this.props.StarBoardStore.addStarLocally(entry, amt).then(response => {
          if (response) {
            this.entry = response
            this.userPrize = response
            this.props.StarBoardStore.debitStar(amt)

            this.props.refHandleStarCounterPos(entry, next => {
              if (next) {
                this.prizeForRedeem = this.userPrize
                  ? this.userPrize.used >= entry.value
                    ? true
                    : false
                  : false
                if (this.prizeForRedeem) {
                  this.saveToServer()
                }
                this.forceUpdate()
              }
            })
          }
        })
      } else {
        console.log('NEED MORE STARS')
      }
    }
    addStarForStarboard('add_star_for_starboard', entry)
  }

  async handleAddAllStarsClick(entry, e) {
    e.stopPropagation()

    if (this.props.ProfileStore.profile && this.props.ProfileStore.profile.userId) {
      const starsToAdd = entry.value - ((this.userPrize && this.userPrize.used) || 0)
      console.log('BBB',starsToAdd)
      if (this.props.ProfileStore.profile.currencies.stars && this.props.ProfileStore.profile.currencies.stars >= starsToAdd) {
        this.flagUsed = await starsToAdd;


        this.props.StarBoardStore.addStarLocally(entry, starsToAdd).then(response => {
          if (response) {
            this.entry = response
            this.userPrize = response
            this.props.StarBoardStore.debitStar(starsToAdd)

            this.props.refHandleStarCounterPos(entry, next => {
              if (next) {
                this.prizeForRedeem = this.userPrize
                  ? this.userPrize.used >= entry.value
                    ? true
                    : false
                  : false
                if (this.prizeForRedeem) {
                  this.saveToServer()
                }
                this.forceUpdate()
              }
            })
          }
        })

      }
    }
  }

  saveToServer(args) {
    const used = this.flagUsed
    if (args && args.isUnload) {
      this.entry.isUnload = true
    }
    this.props.StarBoardStore.addStarUsed(this.entry, used).then(
      updatedStarPrize => {
        if (updatedStarPrize) {
          this.userPrize = updatedStarPrize
          this.flagUsed = 0
        }
      }
    )
  }

  saveToServerXXX() {
    const used = this.flagUsed
    this.props.StarBoardStore.addStarUsedXXX(this.entry, used).then(
      response => {
        if (response) {
          this.props.ProfileStore.debitCurrencies({
            currency: 'stars',
            amount: used,
          })
          this.userPrize = response
          this.flagUsed = 0
        }
      }
    )
  }

  gotoStarRedeemTerms() {
    const isPendingRedeem =
      this.userPrize &&
      !this.userPrize.claimed &&
      this.userPrize.forRedeem &&
      this.userPrize.used === this.entry.value
        ? true
        : false
    if (isPendingRedeem) {
      console.log('ALREADY IN THE PRIZECHEST')
    } else {
      this.props.StarBoardStore.changeUserIdOnUserPrize()
      this.props.NavigationStore.removeSubScreen('AuthSequence')
      this.props.NavigationStore.removeSubScreen('StarBoard-StarRedeem')
      this.props.StarBoardStore.setForRedeem(this.userPrize).then(response => {
        if (response) {
          this.userPrize = response
          this.forceUpdate()

          this.props.AnalyticsStore.addFlag({
            productId: this.userPrize.prizeBoardPrizeId,
            addedToPrizeChest: true,
            prizeChestType: this.userPrize.currencyType,
          })
          let comp = (
            <StarRedeemTerms
              item={this.userPrize}
              refHideBanner={this.props.refHideBanner}
              refUpdatedUserPrize={this.handleUpdatedUserPrize.bind(this)}
            />
          )
          this.props.NavigationStore.addSubScreen(
            comp,
            'StarBoard-StarRedeemTerms'
          )
        }
      })
    }
  }
  // gotoStarRedeemTermsXXX() {
  //   this.props.StarBoardStore.changeUserIdOnUserPrize()
  //   this.props.NavigationStore.removeSubScreen('AuthSequence')
  //   this.props.NavigationStore.removeSubScreen('StarBoard-StarRedeem')
  //   this.props.StarBoardStore.setForRedeem(this.userPrize, true).then(
  //     response => {
  //       if (response) {
  //         let comp = (
  //           <StarRedeemTerms
  //             item={this.userPrize}
  //             refHideBanner={this.props.refHideBanner}
  //             refUpdatedUserPrize={this.handleUpdatedUserPrize.bind(this)}
  //           />
  //         )
  //         this.props.NavigationStore.addSubScreen(
  //           comp,
  //           'StarBoard-StarRedeemTerms'
  //         )
  //       }
  //     }
  //   )
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  handleUnload(e) {
    e.preventDefault()
    if (this.flagUsed > 0 && this.userPrize) {
      if (this.userPrize.used > 0 && this.userPrize.used < this.entry.value) {
        this.saveToServer({ isUnload: true })
      }
    }
  }

  componentWillUnmount() {
    if (this.flagUsed > 0 && this.userPrize) {
      if (this.userPrize.used > 0 && this.userPrize.used < this.entry.value) {
        this.saveToServer()
      }
    }
    this._isMounted = false
    this.disposeActiveSlidingItem()
    window.removeEventListener('beforeunload', this.handleUnload, true)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)

    this._isMounted = true
    let { entry } = this.props

    try {
      const imageName = evalImage(
        `starboard/${entry.shortName}-${entry.seasonId}${entry.boardTypeId}_${entry.images[0]}`
      )
      if (imageName) {
        loadImagesSelectedUponPageLoad([imageName], next => {
          if (next) {
            this.entry = entry
            if (this._isMounted) {
              this.forceUpdate()
            }
          }
        })
      } else {
        this.entry = entry
        if (this._isMounted) {
          this.forceUpdate()
        }
      }
    } catch (err) {
      this.entry = entry
      if (this._isMounted) {
        this.forceUpdate()
      }
    }
  }

  render() {
    if (!this.entry) {
      return <Container height={consHeight} />
    }

    let { entry, userPrize } = this
    let Tag = Cons
    let { profile } = this.props.ProfileStore

    const circleBorderColor = '#eede16'
    const circleColor = ''
    const circleBackgroundColor = '#231f20'
    const leftSubContainerBG = '#ffffff'
    const titleColor = '#000000'
    const pointsColor = '#ffffff'
    // const uid = `${entry.shortName}${entry.seasonId}${entry.boardTypeId}`
    const uid = `${entry.prizeBoardId}${entry.prizeBoardPrizeId}`

    return (
      <Tag
        entry={entry}
        userPrize={userPrize}
        remainingStars={this.props.ProfileStore.profile.currencies.stars || 0}
        circleBorderColor={circleBorderColor}
        circleColor={circleColor}
        leftSubContainerBG={leftSubContainerBG}
        titleColor={titleColor}
        circleBackgroundColor={circleBackgroundColor}
        pointsColor={pointsColor}
        handleClick={
          userPrize && userPrize.claimed
            ? null
            : this.handlePrizeItemClick.bind(this, entry, userPrize)
        }
        refThis={ref => (this[`refPrizeContainer-${uid}`] = ref)}
        refViewButton={ref => (this[`refViewButton-${uid}`] = ref)}
        refClaimButton={ref => (this[`refClaimButton-${uid}`] = ref)}
        refSlideItemInfo={ref => (this[`refSlideItemInfo-${uid}`] = ref)}
        refPrizeImage={ref => (this[`refPrizeImage-${uid}`] = ref)}
        refHandleViewButtonClick={this.handleViewButtonClick.bind(this, entry)}
        refHandleClaimButtonClick={this.handleAddStarClick.bind(this, entry)}
        refMovingCircle={ref => (this[`refMovingCircle-${uid}`] = ref)}
        refStarCounter={ref => (this[`refStarCounter-${uid}`] = ref)}
        addAllStars={this.handleAddAllStarsClick.bind(this, entry)}
      />
    )
  }
}

const Cons = props => {
  let icon = ''
  try {
    //const imageName = `starboard/${props.entry.shortName}-${props.entry.seasonId}${props.entry.boardTypeId}_${props.entry.images[0]}`
    //icon = evalImage(imageName)
    icon = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${props.entry.image}`
    if (!icon) {
      icon = DefaultIcon
    }
  } catch (e) {
    icon = DefaultIcon
  }

  // const uid = `${props.entry.shortName}${props.entry.seasonId}${props.entry.boardTypeId}`
  const uid = `${props.entry.prizeBoardId}${props.entry.prizeBoardPrizeId}`
  const isAvailable = props.entry.qty > 0 ? true : false
  const forRedeem = props.userPrize
    ? !props.userPrize.forRedeem && props.userPrize.used === props.entry.value
      ? true
      : false
    : false
  const isRedeemed = props.userPrize && props.userPrize.claimed ? true : false
  const enoughStars = props.remainingStars > 0 ? true : false
  const isPendingRedeem =
    props.userPrize &&
    !props.userPrize.claimed &&
    props.userPrize.forRedeem &&
    props.userPrize.used === props.entry.value
      ? true
      : false

  let viewBackgroundColor = '#ffffff'
  let viewColor = isAvailable ? '#000000' : '#ffffff'
  let viewBorderColor = isAvailable ? '#000000' : '#ffffff'

  let claimBackgroundColor = '#000000'
  let claimColor = '#eede16'
  let claimBorderColor = '#000000'

  let starCounterFont = 'pamainextrabold'
  if (props.userPrize) {
    starCounterFont =
      props.userPrize && props.userPrize.used
        ? props.userPrize.used.toString().length == 1
          ? 'pamainextrabold'
          : props.userPrize.used.toString().length == 2
          ? 'pamainbold'
          : props.userPrize.used.toString().length == 3
          ? 'pamainregular'
          : 'pamainlight'
        : 'pamainextrabold'
  }

  let reqBalance =
    props.entry.value - ((props.userPrize && props.userPrize.used) || 0)

  const title1 = (props.entry.title || '').substr(0, 22)
  const title2 = (props.entry.title || '').substr(22, 44)

  return (
    <Container
      id={`starboard-prize-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
      height={consHeight}
      onClick={isAvailable ? props.handleClick : null}
      innerRef={props.refThis}
      forRedeem={forRedeem}
      backgroundColor={
        isRedeemed
          ? 'linear-gradient(to right, rgba(0,0,0,1)50%, rgba(33,33,33, 1))'
          : forRedeem || isPendingRedeem
          ? '#eede16'
          : 'linear-gradient(to right, rgba(0,0,0,1)50%, rgba(33,33,33, 1))'
      }
      available={isAvailable}
    >
      <MovingCircle innerRef={props.refMovingCircle}>
        {isRedeemed ? null : (
          <Circle
            size={100}
            borderColor={props.circleBorderColor}
            borderWidth={0.3}
            color={'#000000'}
            backgroundColor={props.circleBackgroundColor}
            src={{
              text: isNaN(props.entry.discount)
                ? props.entry.discount
                : props.entry.discount
                ? `${props.entry.discount}%`
                : '',
              font: 'pamainregular',
              color: '#ffffff',
              size: 3,
            }}
          />
        )}
      </MovingCircle>

      <SlideItemInfo
        innerRef={props.refSlideItemInfo}
        height={grandHeight}
        backgroundColor={forRedeem ? '#ffffff' : '#d8d8d8'}
      >
        <ViewOrClaimButtonWrapper
          innerRef={props.refViewOrClaimButtonContainer}
        >
          <ViewOrClaimButton
            text={'view'}
            color={viewColor}
            borderColor={viewBorderColor}
            onClick={props.refHandleViewButtonClick}
            innerRef={props.refViewButton}
            id={`button-starboard-prize-view-${props.entry.prizeBoardPrizeId}`}
          />
          <ViewOrClaimButton
            // text={
            //   forRedeem
            //     ? 'redeem'
            //     : enoughStars
            //     ? 'add star'
            //     : 'need more stars'
            // }
            // text={
            //   isPendingRedeem
            //     ? 'added to prizechest'
            //     : forRedeem
            //     ? 'redeem'
            //     : enoughStars
            //     ? 'add star'
            //     : 'need more stars'
            // }
            text={
              forRedeem
                ? 'redeem'
                : isPendingRedeem
                ? 'added to prizechest'
                : enoughStars
                ? 'add star'
                : 'need more stars'
            }
            font={forRedeem || isPendingRedeem ? 'pamainregular' : 'pamainbold'}
            //fontSize={forRedeem ? 0.2 : enoughStars ? 0.2 : 0.19}
            fontSize={
              isPendingRedeem
                ? 0.18
                : forRedeem
                ? 0.2
                : enoughStars
                ? 0.2
                : 0.19
            }
            backgroundColor={
              forRedeem || isPendingRedeem
                ? claimBackgroundColor
                : enoughStars
                ? claimBackgroundColor
                : '#a0a0a0'
            }
            color={
              forRedeem || isPendingRedeem
                ? claimColor
                : enoughStars
                ? '#ffffff'
                : '#ffffff'
            }
            onClick={props.refHandleClaimButtonClick}
            innerRef={props.refClaimButton}
            noEnoughStars={!forRedeem && isPendingRedeem}
            //id={`prizetype-addstar-button-${uid}`}
            id={`button-starboard-prize-addstar-${props.entry.prizeBoardPrizeId}`}
          >
            {/*{forRedeem ? null : enoughStars ? <AddStarIcon /> : null}*/}
            {forRedeem || isPendingRedeem ? null : enoughStars ? (
              <AddStarIcon />
            ) : null}
          </ViewOrClaimButton>
        </ViewOrClaimButtonWrapper>
        <ViewOrClaimSlidingImage
          height={consHeight}
          src={icon}
          innerRef={props.refPrizeImage}
        />
      </SlideItemInfo>
      <PrizeInnerLeft
        backgroundColor={
          isRedeemed
            ? 'linear-gradient(to right, #eede16 0%, #eede16 30%, rgba(16,16,16,1) 90%)'
            : forRedeem
            ? props.leftSubContainerBG
            : '#d8d8d8'
        }
        redeemed={isRedeemed}
      >
        <CommonItemInnerLeft>
          <CommonItemNameWrap>
            <CommonItemName color={isAvailable ? props.titleColor : '#bbbfc2'}>
              {title1.toUpperCase()}
            </CommonItemName>
            <CommonItemName color={isAvailable ? props.titleColor : '#bbbfc2'}>
              {title2.toUpperCase()}
            </CommonItemName>
          </CommonItemNameWrap>
          <CommonItemSmallDesc
            color={isAvailable ? props.titleColor : '#bbbfc2'}
            smallDesc={props.entry.preTitle}
          >
            {(props.entry.preTitle || '').toUpperCase()}
          </CommonItemSmallDesc>
          <CommonItemDesc color={isAvailable ? props.titleColor : '#bbbfc2'}>
            {(props.entry.subTitle || '').toUpperCase()}
          </CommonItemDesc>
          {props.entry.qty > 0 ? (
            isRedeemed ? null : (
              <CommonItemQty color={'#c61818'}>
                {props.entry.qty}
                &nbsp;available this week
              </CommonItemQty>
            )
          ) : null}
        </CommonItemInnerLeft>
      </PrizeInnerLeft>

      <ItemPrizeInnerRight>
        {isRedeemed ? (
          <RedeemedText color={'#eede16'} />
        ) : (
          <StarCounter
            src={
              forRedeem ? StarIconDarkGrayBorderThick : StarIconDarkGrayBorder
            }
            size={7}
            marginRight={1}
            innerRef={props.refStarCounter}
            font={starCounterFont}
            color={forRedeem ? '#eede16' : '#a0a0a0'}
            id={`prizetype-starcounter-${uid}`}
            onClick={isAvailable ? props.addAllStars : null}
          >
            {reqBalance || ''}
          </StarCounter>
        )}
      </ItemPrizeInnerRight>
    </Container>
  )
}

const grandHeight = 13.6
const consHeight = 13 //10.8
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${props => responsiveDimension(props.height || consHeight)};
  margin: 0 0 ${props => responsiveDimension(0.3)} 0;
  position: relative;
  background: ${props => props.backgroundColor};
  opacity: 0;
  animation: ${props => fadeIn} 0.5s forwards;
  cursor: ${props => (props.available ? 'pointer' : 'not-allowed')};
`
const fadeIn = keyframes`
  0%{ opacity: 0; }
  100%{ opacity: 1; }
`

const PrizeInnerLeft = styled.div`
  width: 100%;
  height: 100%;
  border-top-right-radius: ${props =>
    props.redeemed ? 0 : responsiveDimension(grandHeight)};
  border-bottom-right-radius: ${props =>
    props.redeemed ? 0 : responsiveDimension(grandHeight)};
  display: flex;
  align-items: center;
  background: ${props => props.backgroundColor};
`
const SlideItemInfo = styled.div`
  position: absolute;
  width: 93%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.backgroundColor};
  border-top-right-radius: ${props => responsiveDimension(props.height)};
  border-bottom-right-radius: ${props => responsiveDimension(props.height)};
  z-index: 1;
  transform: translateX(-85%);
`
const ViewOrClaimButtonWrapper = styled.div`
  width: 80%;
  height: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4% 0 4%;
`
const ViewOrClaimSlidingImage = styled.div`
  width: 20%;
  min-width: ${props => responsiveDimension(props.height)};
  max-width: ${props => responsiveDimension(props.height)};
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(grandHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(grandHeight)};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  cursor: pointer;
`

const InnerLeftIcon = styled.div`
  width: 20%;
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(grandHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(grandHeight)};
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

const Buttons = styled.div`
  width: 100%;
`

const ViewOrClaimButton = styled.div`
  width: calc(95% / 2);
  height: 70%;
  ${props =>
    props.backgroundColor
      ? `background: linear-gradient(to right, ${
          props.backgroundColor
        }, ${hex2rgb(props.backgroundColor, 0.9)})`
      : ``};
  border: ${props =>
    props.borderColor
      ? `${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ``};
  color: ${props => props.color};
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props =>
    props.fontSize
      ? responsiveDimension(grandHeight * props.fontSize)
      : responsiveDimension(grandHeight * 0.2)};
  letter-spacing: ${props => responsiveDimension(0.1)};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => (props.noEnoughStars ? 'not-allowed' : 'pointer')};
  &:before {
    content: '${props => props.text}';
    padding-top: ${props => responsiveDimension(0.3)};
  }
`

const AddStarIcon = styled.div`
  width: 20%;
  padding-bottom: 20%;
  background-image: url(${StarIconWhite});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  margin-left: 6%;
  margin-bottom: 1%;
  position: relative;
  &:after {
    position: absolute;
    width: 65%;
    height: 65%;
    content: '';
    display: inline-block;
    background-image: url(${PlusSignIcon});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -45%);
  }
`

const InnerLeftIconRank = styled.div`
  display: flex;
  width: ${props => responsiveDimension(4.9)};
  height: ${props => responsiveDimension(4.9)};
  border-radius: ${props => responsiveDimension(4.9)};
  background-color: #ffffff;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.1)};
  font-weight: bold;
  color: ${props => props.color};
  justify-content: center;
  align-items: center;
`
const ItemPrizeInnerRight = styled.div`
  width: 34%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 2%;
`
const ItemPrizePoints = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.5)};
  color: ${props => props.color};
`
const ItemPrizeInnerCenter = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-left: ${props => responsiveDimension(30)};
`
const ItemPrizeInnerCenterQty = styled.div`
  width: ${props => responsiveDimension(6)};
  min-width: ${props => responsiveDimension(6)};
  height: ${props => responsiveDimension(6)};
  min-height: ${props => responsiveDimension(6)};
  border-radius: 50%
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => responsiveDimension(0.5)} solid ${props =>
  props.borderColor};
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
`

const CommonItemInnerLeft = styled.div`
  text-align: left;
  width: 100%;
  padding-left: 23%;
`
const CommonItemNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`
const CommonItemName = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.5)};
  // line-height: ${props => responsiveDimension(3.5)};
  line-height: 0.9;
  color: ${props => props.color};
`
const CommonItemSmallDesc = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(1.8)};
  height: ${props => responsiveDimension(!!props.smallDesc ? 1.8 * 0.8 : 0)};
  line-height: ${props => responsiveDimension(1.8)};
  color: ${props => props.color};
`
const CommonItemDesc = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.5)};
  line-height: ${props => responsiveDimension(2)};
  padding-top: ${props => responsiveDimension(0.5)};
  color: ${props => props.color};
`

const CommonItemQty = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(2.3)};
  line-height: ${props => responsiveDimension(2)};
  padding-top: ${props => responsiveDimension(0.3)};
  color: ${props => props.color};
  text-transform: uppercase;
`

const SoldOut = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  color: ${props => props.color};
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const ArrowRight = styled.div`
  width: inherit;
  height: inherit;
  background-image: url(${props => ArrowIcon});
  background-repeat: no-repeat;
  background-size: 35%;
  background-position: center;
  margin-left: 10%;
`

const StarCounter = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size * 0.5)};
  color: ${props => props.color || '#a0a0a0'};
  padding-top: ${props => responsiveDimension(1)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  margin-bottom: ${props => responsiveDimension(props.marginBottom) || 0};
  margin-right: ${props => responsiveDimension(props.marginRight) || 0};
`

const StarAvailable = styled.img`
  position: absolute;
  height: ${props => props.size};
  margin-bottom: ${props => props.marginBottom};
  z-index: 200;
`

const MovingCircle = styled.div`
  position: absolute;
  height: inherit;
  width: 9%;
  display: flex;
  align-items: center;
  z-index: 2;
  left: 69%;
`

const RedeemedText = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(consHeight * 0.35)};
  color: ${props => props.color};
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
  line-height: 1;
  &:after {
    content: 'redeemed';
  }

  margin-top: ${props => responsiveDimension(0.5)};
  margin-right: ${props => responsiveDimension(1)};
`

/**
 * Dummy container
 * @constructor
 */
export const Dummy = props => {
  return <DummyContainer />
}

const DummyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${props => responsiveDimension(11)};
  position: relative;
`

// PrizeBoardNavType.propTypes = {
//   entry: PropTypes.shape({
//     sequence: PropTypes.number.isRequired,
//     parentId: PropTypes.number.isRequired,
//     name: PropTypes.string.isRequired,
//     quantity: PropTypes.number.isRequired,
//     points: PropTypes.number.isRequired,
//   }),
// }
