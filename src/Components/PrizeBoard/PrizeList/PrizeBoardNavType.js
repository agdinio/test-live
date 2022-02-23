import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { intercept } from 'mobx'
import { inject, observer } from 'mobx-react'
import { TweenMax, TimelineMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import Circle from '@/Components/Common/Circle'
import {
  vhToPx,
  vwToPx,
  evalImage,
  numberFormat,
  hex2rgb,
  responsiveDimension,
  IsMobile,
} from '@/utils'
import { eventCapture } from '../../Auth/GoogleAnalytics'
@inject('PrizeBoardStore', 'ProfileStore')
export default class PrizeBoardNavType extends Component {
  constructor(props) {
    super(props)
    this.animRefs = {
      refThisToggle: null,
      refViewButtonToggle: null,
      refClaimButtonToggle: null,
      refPrizeContainerToggle: null,
      refSlideItemInfoToggle: null,
      refPrizeImageToggle: null,
    }

    this.entry = this.props.entry
    this.uniqueIdentifier = null
    this.check = null
    this.prizeAvailable = true
    this.handlePrizeImageClick = this.handlePrizeImageClick.bind(this)

    this.destroyActivitySlidingItem = intercept(
      this.props.PrizeBoardStore,
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

    this.destroyNewClaimedUserPrize = intercept(
      this.props.PrizeBoardStore,
      'newClaimedUserPrize',
      change => {
        if (change.newValue) {
          if (
            this.entry.prizeBoardId === change.newValue.prizeBoardId &&
            this.entry.prizeBoardPrizeId === change.newValue.prizeBoardPrizeId
          ) {
            this.entry = change.newValue
            this.forceUpdate()
          }
        }
        return change
      }
    )
  }

  componentWillUnmount() {
    this.destroyActivitySlidingItem()
    this.destroyNewClaimedUserPrize()
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
      refPrizeImage.addEventListener('click', this.handlePrizeImageClick, true)

      this.check = setTimeout(() => {
        if (this.animRefs.refThisToggle) {
          this.animRefs.refThisToggle.reverse()
        }
        this.animRefs.refViewButtonToggle.reverse()
        this.animRefs.refClaimButtonToggle.reverse()
        this.animRefs.refPrizeContainerToggle.reverse()
        this.animRefs.refSlideItemInfoToggle.reverse()
        this.animRefs.refPrizeImageToggle.reverse()
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
        }
      }, 10000)
    }
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
    }
  }

  handlePrizeItemClick(entry) {
    // this.uniqueIdentifier = `${entry.shortName}${entry.seasonId}${entry.boardTypeId}`
    this.uniqueIdentifier = `${entry.prizeBoardId}${entry.prizeBoardPrizeId}`
    this.prizeAvailable = entry.qty > 0 ? true : false
    this.props.PrizeBoardStore.setActiveSlidingItem(this.uniqueIdentifier)
    console.log('select instadium', entry)
    eventCapture('select_instadium_menu', entry)
  }

  handleViewButtonClick(entry, e) {
    e.stopPropagation()
    this.reverseActiveItem()
    this.props.refView(entry)
    eventCapture('instadium_view', entry)
  }

  async handleClaimButtonClick(entry, e) {
    delete entry.id
    delete entry.agreed
    delete entry.claimed
    delete entry.forRedeem
    delete entry.used
    e.stopPropagation()
    this.reverseActiveItem()
    if (entry.qty > 0) {
      this.props.refClaim(entry)
    }
    eventCapture('instadium_claim', entry)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.entry.qty !== this.props.entry.qty) {
      return true
    }

    return false
  }

  render() {
    let { entry } = this
    let Tag = entry.boardOrder <= 2 ? Grand : Cons

    const circleBorderColor =
      entry.boardOrder <= 3
        ? '#d32813'
        : entry.boardOrder === 4
        ? '#e16a00'
        : '#e8e8e8'
    // : '#231f20';
    const circleColor =
      entry.boardOrder <= 3
        ? '#d32813'
        : entry.boardOrder === 4
        ? '#e16a00'
        : '#ffffff'
    const circleBackgroundColor =
      entry.boardOrder <= 3
        ? '#ffffff'
        : entry.boardOrder === 4
        ? '#ffffff'
        : '#231f20'
    const leftSubContainerBG = '#e9e9e9'
    const titleColor = '#000000'
    const pointsColor = '#ffffff'
    // const uid = `${entry.shortName}${entry.seasonId}${entry.boardTypeId}`
    const uid = `${entry.prizeBoardId}${entry.prizeBoardPrizeId}`

    return (
      <Tag
        entry={entry}
        circleBorderColor={circleBorderColor}
        circleColor={circleColor}
        leftSubContainerBG={leftSubContainerBG}
        titleColor={titleColor}
        circleBackgroundColor={circleBackgroundColor}
        pointsColor={pointsColor}
        handleClick={this.handlePrizeItemClick.bind(this, entry)}
        refThis={ref => (this[`refPrizeContainer-${uid}`] = ref)}
        refViewButton={ref => (this[`refViewButton-${uid}`] = ref)}
        refClaimButton={ref => (this[`refClaimButton-${uid}`] = ref)}
        refSlideItemInfo={ref => (this[`refSlideItemInfo-${uid}`] = ref)}
        refPrizeImage={ref => (this[`refPrizeImage-${uid}`] = ref)}
        refHandleViewButtonClick={this.handleViewButtonClick.bind(this, entry)}
        refHandleClaimButtonClick={this.handleClaimButtonClick.bind(
          this,
          entry
        )}
      />
    )
  }
}

const Grand = props => {
  let icon = ''
  try {
    //const imageName = `prizeboard/${props.entry.shortName}-${props.entry.seasonId}${props.entry.boardTypeId}_${props.entry.images[0]}`
    //icon = evalImage(imageName)
    icon = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${props.entry.image}`
  } catch (e) {
    icon = ''
  }

  const isAvailable = props.entry.qty > 0 ? true : false

  let viewBackgroundColor = '#ffffff'
  let viewColor = isAvailable ? '#000000' : '#ffffff'
  let viewBorderColor = isAvailable ? '#000000' : '#ffffff'

  let claimBackgroundColor = '#000000'
  let claimColor = '#ffffff'
  let claimBorderColor = '#000000'

  const title1 = (props.entry.title || '').substr(0, 22)
  const title2 = (props.entry.title || '').substr(22, 44)

  return (
    <Container
      id={`prizeboard-prize-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
      height={grandHeight}
      onClick={props.handleClick}
      innerRef={props.refThis}
      available={isAvailable}
    >
      <SlideItemInfo
        innerRef={props.refSlideItemInfo}
        height={grandHeight}
        backgroundColor={isAvailable ? '#ffffff' : '#c61818'}
      >
        <ViewOrClaimButtonWrapper>
          <ViewOrClaimButton
            id={`button-prizeboard-prize-view-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
            text={'view'}
            color={viewColor}
            borderColor={viewBorderColor}
            onClick={props.refHandleViewButtonClick}
            innerRef={props.refViewButton}
          />
          <ViewOrClaimButton
            id={`button-prizeboard-prize-claim-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
            text={'claim'}
            backgroundColor={claimBackgroundColor}
            color={claimColor}
            onClick={props.refHandleClaimButtonClick}
            innerRef={props.refClaimButton}
            soldout={!isAvailable}
          />
        </ViewOrClaimButtonWrapper>
        <ViewOrClaimSlidingImage
          height={grandHeight}
          src={icon}
          innerRef={props.refPrizeImage}
        />
      </SlideItemInfo>
      <ItemPrizeInnerCenter>
        {/*
        <ItemPrizeInnerCenterQty
          borderColor={isAvailable ? props.circleBorderColor : '#ffffff'}
          color={isAvailable ? props.circleColor : null}
          backgroundColor={
            isAvailable ? props.circleBackgroundColor : '#231f20'
          }
        >
          {isAvailable ? (
            numberFormat(props.entry.qty, 0, '')
          ) : (
            <ArrowRight />
          )}
        </ItemPrizeInnerCenterQty>
*/}
        <Circle
          size={8.5}
          borderColor={isAvailable ? props.circleBorderColor : '#ffffff'}
          borderWidth={0.5}
          color={isAvailable ? props.circleColor : null}
          backgroundColor={
            isAvailable ? props.circleBackgroundColor : '#231f20'
          }
          src={
            isAvailable
              ? {
                  text: numberFormat(props.entry.qty, 0, ''),
                  font: 'pamainbold',
                  size: 3,
                  color: props.circleColor,
                }
              : { image: ArrowIcon, size: '35%', marginLeft: '10%' }
          }
        />
      </ItemPrizeInnerCenter>

      <PrizeInnerLeft
        backgroundColor={isAvailable ? props.leftSubContainerBG : '#414042'}
      >
        {/*<InnerLeftIcon style={{ backgroundImage: 'url(' + icon + ')' }} />*/}
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
        </CommonItemInnerLeft>
      </PrizeInnerLeft>

      <ItemPrizeInnerRight>
        {isAvailable ? (
          <ItemPrizePoints color={props.pointsColor}>
            {numberFormat(props.entry.value, 0, '')}
          </ItemPrizePoints>
        ) : (
          <SoldOut color={props.pointsColor}>SOLDOUT</SoldOut>
        )}
      </ItemPrizeInnerRight>
    </Container>
  )
}

const Cons = props => {
  let icon = ''
  try {
    //const imageName = `prizeboard/${props.entry.shortName}-${props.entry.seasonId}${props.entry.boardTypeId}_${props.entry.images[0]}`
    //icon = evalImage(imageName)
    icon = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${props.entry.image}`
  } catch (e) {
    icon = ''
  }

  const isAvailable = props.entry.qty > 0 ? true : false

  let viewBackgroundColor = '#ffffff'
  let viewColor = isAvailable ? '#000000' : '#ffffff'
  let viewBorderColor = isAvailable ? '#000000' : '#ffffff'

  let claimBackgroundColor = '#000000'
  let claimColor = '#ffffff'
  let claimBorderColor = '#000000'

  const title1 = (props.entry.title || '').substr(0, 22)
  const title2 = (props.entry.title || '').substr(22, 44)

  return (
    <Container
      id={`prizeboard-prize-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
      height={consHeight}
      onClick={props.handleClick}
      innerRef={props.refThis}
      available={isAvailable}
    >
      <SlideItemInfo
        innerRef={props.refSlideItemInfo}
        height={grandHeight}
        backgroundColor={isAvailable ? '#ffffff' : '#c61818'}
      >
        <ViewOrClaimButtonWrapper
          innerRef={props.refViewOrClaimButtonContainer}
        >
          <ViewOrClaimButton
            id={`button-prizeboard-prize-view-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
            text={'view'}
            color={viewColor}
            borderColor={viewBorderColor}
            onClick={props.refHandleViewButtonClick}
            innerRef={props.refViewButton}
          />
          <ViewOrClaimButton
            id={`button-prizeboard-prize-claim-${props.entry.prizeBoardId}-${props.entry.prizeBoardPrizeId}`}
            text={'claim'}
            backgroundColor={claimBackgroundColor}
            color={claimColor}
            onClick={props.refHandleClaimButtonClick}
            innerRef={props.refClaimButton}
            soldout={!isAvailable}
          />
        </ViewOrClaimButtonWrapper>
        <ViewOrClaimSlidingImage
          height={consHeight}
          src={icon}
          innerRef={props.refPrizeImage}
        />
      </SlideItemInfo>

      <ItemPrizeInnerCenter>
        {/*
        <ItemPrizeInnerCenterQty
          borderColor={isAvailable ? props.circleBorderColor : '#ffffff'}
          color={isAvailable ? props.circleColor : null}
          backgroundColor={
            isAvailable ? props.circleBackgroundColor : '#231f20'
          }
        >
          {isAvailable ? (
            numberFormat(props.entry.qty, 0, '')
          ) : (
            <ArrowRight />
          )}
        </ItemPrizeInnerCenterQty>
*/}
        <Circle
          size={8.5}
          borderColor={isAvailable ? props.circleBorderColor : '#ffffff'}
          borderWidth={0.5}
          color={isAvailable ? props.circleColor : null}
          backgroundColor={
            isAvailable ? props.circleBackgroundColor : '#231f20'
          }
          src={
            isAvailable
              ? {
                  text: numberFormat(props.entry.qty, 0, ''),
                  font: 'pamainbold',
                  size: 3,
                  color: props.circleColor,
                }
              : { image: ArrowIcon, size: '35%', marginLeft: '10%' }
          }
        />
      </ItemPrizeInnerCenter>

      <PrizeInnerLeft
        backgroundColor={isAvailable ? props.leftSubContainerBG : '#414042'}
      >
        {/*<InnerLeftIcon style={{ backgroundImage: 'url(' + icon + ')' }} />*/}
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
        </CommonItemInnerLeft>
      </PrizeInnerLeft>

      <ItemPrizeInnerRight>
        {isAvailable ? (
          <ItemPrizePoints color={props.pointsColor}>
            {numberFormat(props.entry.value, 0, '')}
          </ItemPrizePoints>
        ) : (
          <SoldOut color={props.pointsColor}>SOLDOUT</SoldOut>
        )}
      </ItemPrizeInnerRight>
    </Container>
  )
}

const grandHeight = 13.6
const consHeight = 10.8
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${props => responsiveDimension(props.height || consHeight)};
  margin: 0 0 ${props => responsiveDimension(0.3)} 0;
  position: relative;
  background: ${props =>
    props.available
      ? 'linear-gradient(to right, rgba(0,0,0,1)50%, rgba(33,33,33, 1))'
      : '#c61818'};
`
const PrizeInnerLeft = styled.div`
  width: 100%;
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(grandHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(grandHeight)};
  display: flex;
  align-items: center;
  background-color: ${props => props.backgroundColor};
`
const SlideItemInfo = styled.div`
  position: absolute;
  width: 96%;
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
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(grandHeight * 0.2)};
  letter-spacing: ${props => responsiveDimension(0.1)};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => (props.soldout ? 'default' : 'pointer')};
  opacity: ${props => (props.soldout ? 0.2 : 1)};
  &:after {
    content: '${props => props.text}';
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
  padding-right: ${props => responsiveDimension(3)};
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
  //padding-left: ${props => vhToPx(30)};
  margin-left: ${props => (IsMobile ? vwToPx(22.5) : vhToPx(15))};
`
const ItemPrizeInnerCenterQty = styled.div`
  width: ${props => responsiveDimension(6)};
  height: ${props => responsiveDimension(6)};
  border-radius: ${props => responsiveDimension(6)};
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => responsiveDimension(0.5)} solid
    ${props => props.borderColor};
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
`

const CommonItemInnerLeft = styled.div`
  text-align: left;
  /////////////////padding-left: 1.7vh;
  /////////////////width: 80%;
  width: 100%;
  padding-left: 23%;
`
const CommonItemNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`
const CommonItemName = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.2)};
  line-height: ${props => responsiveDimension(3.2)};
  color: ${props => props.color};
`
const CommonItemSmallDesc = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(1.8)};
  height: ${props => (!!props.smallDesc ? 1.5 : 0)}vh;
  color: ${props => props.color};
`
const CommonItemDesc = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.7)};
  line-height: ${props => responsiveDimension(2.3)};
  padding-top: ${props => responsiveDimension(0.9)};
  color: ${props => props.color};
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

// PrizeBoardNavType.propTypes = {
//   entry: PropTypes.shape({
//     sequence: PropTypes.number.isRequired,
//     parentId: PropTypes.number.isRequired,
//     name: PropTypes.string.isRequired,
//     quantity: PropTypes.number.isRequired,
//     points: PropTypes.number.isRequired,
//   }),
// }
