import React, { Component } from 'react'
import { runInAction, intercept } from 'mobx'
import { observer, inject } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import { TimelineMax, TweenMax } from 'gsap'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import PrizeClaimTerms from '@/Components/PrizeBoard/PrizeList/PrizeClaimTerms'
import StarRedeemTerms from '@/Components/StarBoard/StarRedeemTerms'
import ItemDetailWoot from './ItemDetailWoot'
import StarBoardItem from '@/Components/PrizeChest/StarBoardItem'

@inject(
  'PrizeBoardStore',
  'StarBoardStore',
  'NavigationStore',
  'ProfileStore',
  'AnalyticsStore'
)
export default class PrizeChestItem extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.item = this.props.item
    this.keyword = this.props.item.keyword

    this.state = {
      stars: this.props.ProfileStore.profile
        ? this.props.ProfileStore.profile.currencies
          ? this.props.ProfileStore.profile.currencies.stars
          : 0
        : 0,
    }

    intercept(this.props.ProfileStore, 'profile', change => {
      if (change.newValue) {
        const currencies = change.newValue.currencies
        if (currencies) {
          if (
            this.keyword &&
            this.keyword.match(new RegExp('starboard', 'gi'))
          ) {
            if (this._isMounted) {
              this.setState({ stars: currencies.stars || 0 })
            }
          }
        }
      }
      return change
    })
  }

  animTitle() {
    const uniqueId = `${this.props.item.shortName}-${this.props.item.seasonId}${this.props.item.boardTypeId}`
    const refTitle = this[`marquee-${uniqueId}`]
    const refTitleNoWrap = this[`title-${uniqueId}`]

    if (refTitle && refTitleNoWrap) {
      if (refTitleNoWrap.offsetWidth > refTitle.offsetWidth) {
        const slideLimit = refTitleNoWrap.offsetWidth - refTitle.offsetWidth + 2
        new TimelineMax({ repeat: -1 })
          .to(refTitleNoWrap, 3, { x: -slideLimit, delay: 3 })
          .to(refTitleNoWrap, 0.5, { opacity: 0, delay: 1 })
          .set(refTitleNoWrap, { x: '100%', opacity: 1 })
      }
    }
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handleUpdatedUserPrize(updatedUserPrize) {
    this.item.agreed = updatedUserPrize.agreed
    this.item.claimed = updatedUserPrize.claimed
    this.forceUpdate()
  }

  handleUpdatedAgree(val) {
    this.item.agreed = val
  }

  handleClick() {
    if (
      this.item.currencyType &&
      'stars' === this.item.currencyType.toLowerCase()
    ) {
      let comp = (
        <StarRedeemTerms
          key={`${this.item.prizeBoardPrizeId}-${this.item.seasonId}-${this.item.boardTypeId}`}
          item={this.item}
          refHideBanner={this.props.refHideBanner}
          refUpdatedUserPrize={this.handleUpdatedUserPrize.bind(this)}
          refUpdatedAgree={this.handleUpdatedAgree.bind(this)}
        />
      )
      this.props.NavigationStore.addSubScreen(comp, 'StarBoard-StarRedeemTerms')
    } else {
      let comp = (
        <PrizeClaimTerms
          item={this.item}
          refHideBanner={this.props.refHideBanner}
          refUpdatedUserPrize={this.handleUpdatedUserPrize.bind(this)}
          timeStart={this.handleTimeStart.bind(
            this,
            `PrizeChest-ItemDetail-PrizeClaimTerms-${this.item.title.replace(
              /\s+/g,
              ''
            )}`
          )}
          timeStop={this.handleTimeStop.bind(
            this,
            `PrizeChest-ItemDetail-PrizeClaimTerms-${this.item.title.replace(
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.stars != this.state.stars) {
      return true
    }
    return false
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    //-> uncomment this to animate marque this.animTitle()
  }

  render() {
    let {
      profile,
      PrizeBoardStore,
      StarBoardStore,
      ProfileStore,
      isPrizeBoard,
      index,
    } = this.props
    let { item } = this
    let { stars } = this.state

    const isStar =
      item.currencyType && 'stars' === item.currencyType.toLowerCase()
        ? true
        : false

    const awardPosition = item.awardTitle.match(new RegExp('watch', 'gi'))
    const uniqueId = `${item.shortName}-${item.seasonId}${item.boardTypeId}`
    let prizeImage = ''
    try {
      if (item.image) {
        prizeImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${item.image}`
      } else {
        prizeImage = evalImage(item.images[0])
        if (!prizeImage) {
          const imageName = isStar
            ? `${StarBoardStore.url}${uniqueId}_${item.images[0]}`
            : `${PrizeBoardStore.url}${uniqueId}_${item.images[0]}`
          prizeImage = evalImage(imageName)
        }
      }
    } catch (e) {
      prizeImage = ''
    }

    /*
    try {
      prizeImage = evalImage(item.images[0])
      if (!prizeImage) {
        const imageName = isStar
          ? `${StarBoardStore.url}${uniqueId}_${item.images[0]}`
          : `${PrizeBoardStore.url}${uniqueId}_${item.images[0]}`
        prizeImage = evalImage(imageName)
      }
    } catch (e) {
      prizeImage = ''
    }
*/

    const containerId =
      item.seasonId && item.boardTypeId
        ? `prizechest-prizeboard-prize-${item.prizeBoardId}-${item.prizeBoardPrizeId}`
        : `prizechest-${(item.title || String(index)).replace(/\s+/g, '')}`

    return (
      <Container
        id={containerId}
        backgroundColor={item.claimed ? '#414042' : item.backgroundColor}
        onClick={
          isPrizeBoard ? this.handleClick.bind(this) : this.props.refHandleClick
        }
      >
        <InnerLeft
          backgroundColor={
            item.claimed ? '#6d6e71' : item.styles.secondaryBackgroundColor
          }
        >
          <Content>
            <PrizeImageWrapper
              backgroundColor={
                item.claimed ? '#3f3f3f' : item.styles.tertiaryBackgroundColor
              }
            >
              {item.type === 'starboard' ? (
                <StarBoardItem
                  key={item.keyword}
                  item={item}
                  mainHeight={mainHeight}
                />
              ) : (
                /*
                                <PrizeImageStar
                                  color={item.claimed ? '#221e1f' : item.styles.prizeImageColor}
                                >
                                  <Star
                                    src={evalImage(item.starIcon)}
                                    color={
                                      item.claimed
                                        ? '#808285'
                                        : item.styles.secondaryBackgroundColor
                                    }
                                    font={
                                      profile.currencies.stars.toString().length == 1
                                        ? 'pamainextrabold'
                                        : profile.currencies.stars.toString().length == 2
                                        ? 'pamainbold'
                                        : profile.currencies.stars.toString().length == 3
                                          ? 'pamainregular'
                                          : 'pamainlight'
                                    }
                                    fontSize={
                                      profile.currencies.stars.toString().length == 1
                                        ? 3.5
                                        : profile.currencies.stars.toString().length == 2
                                        ? 3.2
                                        : profile.currencies.stars.toString().length == 3
                                          ? 3
                                          : 2
                                    }
                                  >
                                    {stars}
                                  </Star>
                                </PrizeImageStar>
                */

                <PrizeImage
                  keyword={item.keyword}
                  src={prizeImage}
                  color={item.claimed ? '#221e1f' : item.styles.prizeImageColor}
                >
                  {item.keyword === 'hotel' ? (
                    <LuxuryHotelTagImage
                      src={evalImage(
                        'prizeboard/playalongnow-bigprizeboards_logo-small_luxury_hotels.png'
                      )}
                    />
                  ) : null}
                </PrizeImage>
              )}
            </PrizeImageWrapper>
            <DescWrapper>
              <TitleWrapper>
                <Marquee innerRef={ref => (this[`marquee-${uniqueId}`] = ref)}>
                  <Title
                    color={
                      item.claimed
                        ? 'rgba(255,255,255, 0.8)'
                        : item.styles.titleColor
                    }
                    innerRef={ref => (this[`title-${uniqueId}`] = ref)}
                  >
                    {item.title}
                  </Title>
                </Marquee>
                <SubTitle
                  color={
                    item.claimed
                      ? 'rgba(255,255,255, 0.8)'
                      : item.styles.subTitleColor
                  }
                >
                  {item.subTitle}
                </SubTitle>
              </TitleWrapper>
            </DescWrapper>
          </Content>
        </InnerLeft>
        <InnerRight>
          <PrizeTitleWrapper>
            {item.awardTitle.split('\n').map((i, k) => {
              return (
                <PrizeTitle
                  claimed={item.claimed}
                  color={item.styles.awardTitleColor}
                  key={k}
                >
                  {item.claimed ? (isStar ? 'redeemed' : 'claimed') : i}
                </PrizeTitle>
              )
            })}
          </PrizeTitleWrapper>
          <PrizeIconWrapper>
            {item.claimed ? (
              <PrizeIcon
                src={evalImage(
                  isStar
                    ? 'star-icon-white.svg'
                    : 'menu-prizes_open-icon-white.svg'
                )}
                backgroundColor={'#c61818'}
                pos={awardPosition && awardPosition.length > 0 ? '15%' : ''}
                star={isStar}
              />
            ) : (
              <PrizeIcon
                src={evalImage(item.awardIcon)}
                backgroundColor={item.styles.awardBackgroundColor}
                pos={awardPosition && awardPosition.length > 0 ? '15%' : ''}
                star={isStar}
              />
            )}
          </PrizeIconWrapper>
          {/*
          <PrizeIcon
            srcx={evalImage(
              item.claimed ? 'menu-prizes_open-icon-white.svg' : item.awardIcon
            )}
            src={evalImage(item.claimed ? item.isStar ? 'star-icon-white.svg' : 'menu-prizes_open-icon-white.svg' : item.awardIcon)}
            backgroundColor={
              item.claimed ? '#c61818' : item.styles.awardBackgroundColor
            }
            pos={awardPosition && awardPosition.length > 0 ? '15%' : ''}
          />
*/}
        </InnerRight>
      </Container>
    )
  }
}

const mainHeight = responsiveDimension(9)
const Container = styled.div`
  width: 100%;
  height: ${props => mainHeight};
  background-color: ${props => props.backgroundColor || `#231f20`};
  margin-top: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
  }
`

const InnerLeft = styled.div`
  width: 62%;
  height: inherit;
  border-top-right-radius: ${props => mainHeight};
  border-bottom-right-radius: ${props => mainHeight};
  background-color: ${props => props.backgroundColor || `#ffffff`};
`

const InnerRight = styled.div`
  width: 38%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PrizeImageWrapper = styled.div`
  width: 30%;
  height: ${props => mainHeight};
  border-top-right-radius: ${props => mainHeight};
  border-bottom-right-radius: ${props => mainHeight};
  background-color: ${props => props.backgroundColor || `#231f20`};
  display: flex;
  justify-content: flex-end;
`
const PrizeImageStar = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  border-radius: ${props => mainHeight};
  border: ${props => responsiveDimension(0.4)} solid ${props => props.color};
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-bottom: 5%;
`
const PrizeImageXXX = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  border-radius: ${props => mainHeight};
  border: ${props => responsiveDimension(0.4)} solid ${props => props.color};
  background-color: ${props => props.color || 'transparent'};
  overflow: hidden;
  position: relative;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => mainHeight};
    height: ${props => mainHeight};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    ${props =>
      props.keyword === 'woot'
        ? `margin-left:${responsiveDimension(
            -0.5
          )};margin-top:${responsiveDimension(-0.5)};`
        : ''};
  }
`
const PrizeImage = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  border-radius: ${props => mainHeight};
  background-color: ${props => props.color || 'transparent'};
  overflow: hidden;
  position: relative;
  &:before {
    position: absolute;
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    ${props =>
  props.keyword === 'woot'
    ? `padding-left:${responsiveDimension(
    -0.5
    )};padding-top:${responsiveDimension(-0.5)};`
    : ''};
  }
  &:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%
    border-radius: 50%;
    border: ${props => responsiveDimension(0.4)} solid ${props => props.color};
  }
`

const LuxuryHotelTagImage = styled.img`
  height: ${props => responsiveDimension(4)};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const PrizeImage__ = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  border-radius: ${props => mainHeight};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border: ${props => responsiveDimension(0.4)} solid ${props => props.color};
`
const DescWrapper = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${props => responsiveDimension(2)};
  margin-right: ${props => responsiveDimension(2)};
  width: 100%;
  overflow: hidden;
`

const Title = styled.span`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(3.7)};
  color: ${props => props.color};
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`
const SubTitle = styled.span`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(1.9)};
  color: ${props => props.color};
  text-transform: uppercase;
  line-height: 1;
`
const Star = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: ${props => props.font || 'pamainextrabold'};
  font-size: ${props => responsiveDimension(props.fontSize || 3.5)};
  color: ${props => props.color};
  padding-top: ${props => responsiveDimension(1)};

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 75%;
  background-position: center;
`

const PrizeTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-right: 15%;
`

const PrizeTitle = styled.span`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(2.3)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  opacity: ${props => (props.claimed ? 0.3 : 1)};
  display: flex;
  align-self: flex-end;
  line-height: 1;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const PrizeIconWrapper = styled.div`
  margin-right: 5%;
`

const PrizeIcon = styled.div`
  width: ${props => responsiveDimension(6)};
  height: ${props => responsiveDimension(6)};
  min-width: ${props => responsiveDimension(6)};
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    width: calc(100% * 0.65);
    height: calc(100% * 0.65);
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    ${props => (props.pos ? `margin-left: ${props.pos}` : '')};
    ${props => (props.star ? 'margin-bottom: 3%' : '')};
  }
`

const Marquee = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden;
`

// PrizeChestItem.propTypes = {
//   item: PropTypes.object,
//   profile: PropTypes.object,
//   handleClick: PropTypes.func
// }
