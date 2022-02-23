import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { intercept, extendObservable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { TweenMax, TimelineMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import ArrowIcon from '@/assets/images/icon-arrow-black.svg'
import SwipingLineAnimation from '@/Components/Common/SwipingLineAnimation'
import {
  vhToPx,
  hex2rgb,
  numberFormat,
  evalImage,
  responsiveDimension,
  loadImagesSelectedUponPageLoad,
} from '@/utils'
import DefaultIcon from '@/assets/images/starboard/default.png'
import StarBucket from '@/Components/StarBoard/StarBucket'
import { Dummy } from '@/Components/StarBoard/StarCategoryPrizeType'
import StarIconDark from '@/assets/images/star-icon-dark.svg'
import PlusSignIcon from '@/assets/images/add-icon-gold.svg'
import StarIconDarkGrayBorder from '@/assets/images/star-icon-dark-gray-border.svg'
import StarIconDarkGrayBorderThick from '@/assets/images/star-icon-dark-gray-border-thick.svg'
import StarIconDarkGoldBorder from '@/assets/images/star-icon-dark-gold-border.svg'
import ActivityIndicator from '@/Components/Common/ActivityIndicator'

@inject('StarBoardStore', 'ProfileStore')
@observer
export default class StarRedeem extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      reqBalance: 0,
      forRedeem: false,
      needMoreStars: false,
      // imageName: DefaultIcon,
      imageName: null,
    })
    this._isMounted = false
    this.itemPrize = this.props.userPrize
    this.starCounterFont = 'pamainextrabold'

    this.disposeForRedeemItem = intercept(
      this.props.StarBoardStore,
      'forRedeemItem',
      change => {
        if (change.newValue) {
          if (this._isMounted) {
            this.itemPrize = change.newValue
          }
        }
        return change
      }
    )

    this.disposeCurrentSinglePrice = intercept(
      this.props.StarBoardStore,
      'currentSinglePrize',
      change => {
        if (change.newValue) {
          if (this._isMounted) {
            this.itemPrize = change.newValue
          }
        }
        return change
      }
    )
  }

  handleAddStarClick(e) {
    this.props.refHandleAddStarClick(e)

    if (this.refAnimatingStarBucketWrapper) {
      ReactDOM.unmountComponentAtNode(this.refAnimatingStarBucketWrapper)
      let comp = (
        <AnimatingStarBucket
          innerRef={ref => (this.refAnimStarBucket = ref)}
          font={'pamainextrabold'}
        />
      )
      ReactDOM.render(comp, this.refAnimatingStarBucketWrapper)
    }

    // const uid = `${this.itemPrize.shortName}-${this.itemPrize.seasonId}${this.itemPrize.boardTypeId}`
    const uid = `${this.itemPrize.prizeBoardId}${this.itemPrize.prizeBoardPrizeId}`
    const el = this[`starcounter-detail-${uid}`]
    if (el) {
      let starbucket_w = el.getBoundingClientRect().width
      let starbucket_h = el.getBoundingClientRect().height

      let starbucket_pos_x =
        el.getBoundingClientRect().left -
        this.refAnimStarBucket.getBoundingClientRect().left
      starbucket_pos_x =
        starbucket_pos_x > 0
          ? starbucket_pos_x - el.getBoundingClientRect().width / 1.3
          : starbucket_pos_x

      let starbucket_pos_y =
        el.getBoundingClientRect().top -
        this.refAnimStarBucket.getBoundingClientRect().top
      starbucket_pos_y =
        starbucket_pos_y > 0
          ? starbucket_pos_y
          : starbucket_pos_y + -(el.getBoundingClientRect().height / 1.8)

      TweenMax.to(this.refAnimStarBucket, 0.5, {
        x: starbucket_pos_x,
        y: starbucket_pos_y,
        width: starbucket_w,
        height: starbucket_h,
        fontSize: starbucket_h * 0.5,
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
        onComplete: () => {
          this.evaluateData()
          ReactDOM.unmountComponentAtNode(this.refAnimatingStarBucketWrapper)
        },
      })
    }
  }

  handleUsePointsClick(item) {
    if (this.refUsePointsButton) {
      if (item.qty > 0) {
        this.props.refUsePoints(item)
      } else {
        const changeColor = TweenMax.to(this.refUsePointsButton, 0.3, {
          background: '#c61818',
          innerHTML: 'not enough points',
          pointerEvents: 'none',
        })
        setTimeout(() => changeColor.reverse(), 2000)
      }
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('SHOULD', nextProps.StarBoardStore.localStars)
  //   return true
  // }

  evaluateData() {
    this.reqBalance = this.itemPrize.value

    if (this.itemPrize && this.itemPrize.used) {
      this.forRedeem = this.itemPrize
        ? this.itemPrize.used === this.itemPrize.value
          ? true
          : false
        : false

      this.reqBalance =
        this.itemPrize.value - ((this.itemPrize && this.itemPrize.used) || 0)
    }

    this.starCounterFont =
      this.reqBalance.toString().length == 1
        ? 'pamainextrabold'
        : this.reqBalance.toString().length == 2
        ? 'pamainbold'
        : this.reqBalance.toString().length == 3
        ? 'pamainregular'
        : 'pamainlight'

    this.needMoreStars =
      this.props.ProfileStore.profile.currencies.stars - 1 > 0 ? false : true
  }

  componentWillUnmount() {
    if (this.props.timeStop) {
      this.props.timeStop()
    }
    this._isMounted = false
    this.props.StarBoardStore.setCurrentSinglePrize(null)
    this.props.StarBoardStore.setCurrentSinglePrizeForRedeem(null)
    this.disposeForRedeemItem()
    this.disposeCurrentSinglePrice()
  }

  componentDidMount() {
    if (this.props.timeStart) {
      this.props.timeStart()
    }
    this._isMounted = true
    this.evaluateData()

    const imgRemote = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${this.itemPrize.image}`
    loadImagesSelectedUponPageLoad([imgRemote], next => {
      if (next) {
        this.imageName = imgRemote
      }
    })
  }

  render() {
    let { reqBalance, starCounterFont, forRedeem } = this

    const isPendingRedeem =
      this.itemPrize &&
      !this.itemPrize.claimed &&
      this.itemPrize.forRedeem &&
      this.itemPrize.used === this.itemPrize.value
        ? true
        : false

    // const uid = `${this.itemPrize.shortName}-${this.itemPrize.seasonId}${this.itemPrize.boardTypeId}`
    const uid = `${this.itemPrize.prizeBoardId}${this.itemPrize.prizeBoardPrizeId}`

    return (
      <Container>
        <ContentScrolling>
          <Content>
            <Section>
              <TextMarquee>
                <Text
                  font={'pamainbold'}
                  size={7}
                  color={'#000000'}
                  uppercase
                  innerRef={ref => (this[`title-${uid}`] = ref)}
                >
                  {this.itemPrize.title}
                </Text>
              </TextMarquee>
              <Text
                font={'pamainregular'}
                size={4.5}
                color={'#000000'}
                uppercase
              >
                {this.itemPrize.subTitle}
              </Text>
            </Section>
            <Section marginTop={3} style={{ padding: '0 10% 0 10%' }}>
              <StarTypeImageWrap>
                {this.imageName ? (
                  <StarTypeImage src={this.imageName} />
                ) : (
                  <StarTypeImageLoading>
                    <ActivityIndicator height={7} color={'#000'} />
                  </StarTypeImageLoading>
                )}
                {/*
                <StarCounter
                  src={forRedeem ? StarIconDarkGrayBorderThick : StarIconDarkGrayBorder}
                  size={7}
                  marginRight={1}
                  //innerRef={props.refStarCounter}
                  font={starCounterFont}
                  color={forRedeem ? '#eede16' : '#a0a0a0'}
                  marginBottom={1}
                >{reqBalance || ''}</StarCounter>
              </StarTypeImageWrap>
*/}
                <StarCounter
                  src={
                    forRedeem ? StarIconDarkGoldBorder : StarIconDarkGrayBorder
                  }
                  srcInner={forRedeem ? StarIconDarkGrayBorderThick : null}
                  size={7}
                  marginRight={1}
                  innerRef={ref => (this[`starcounter-detail-${uid}`] = ref)}
                  font={starCounterFont}
                  color={forRedeem ? '#eede16' : '#a0a0a0'}
                  marginBottom={1}
                >
                  {reqBalance || ''}
                </StarCounter>
              </StarTypeImageWrap>
            </Section>
            <Section marginTop={2}>
              <Text font={'pamainlight'} size={7.5} color={'#000'}>
                {isNaN(this.itemPrize.discount)
                  ? this.itemPrize.discount
                  : `${this.itemPrize.discount}%`}
              </Text>
              <Text font={'pamainregular'} size={4.5} color={'#000'} uppercase>
                discount promo
              </Text>
              <Text
                font={'pamainextrabold'}
                size={3}
                color={'#c61818'}
                uppercase
              >
                {this.itemPrize.qty} available this week
              </Text>
            </Section>
            <Section marginTop={1}>
              <RedeemButtonWrapper>
                {this.itemPrize &&
                this.itemPrize.value === this.itemPrize.used ? (
                  <RedeemButton
                    locked={isPendingRedeem}
                    text={isPendingRedeem ? 'added to prizechest' : 'redeem'}
                    fontSize={isPendingRedeem ? 2.6 : 3.5}
                    onClick={isPendingRedeem ? null : this.props.refRedeem}
                  />
                ) : this.needMoreStars ? (
                  <NeedMoreStarsButton text={'need more stars'} />
                ) : (
                  <AddStarButton onClick={this.handleAddStarClick.bind(this)}>
                    <AddStarIcon />
                  </AddStarButton>
                )}
              </RedeemButtonWrapper>
            </Section>
            <Section
              marginTop={3}
              marginBottom={3}
              style={{ padding: '0 10% 0 10%' }}
            >
              <Text
                font={'pamainlight'}
                size={3}
                color={'#000'}
                lineHeight={1.3}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Section>
            <Dummy />
          </Content>
        </ContentScrolling>
        <Bottom>
          <StarBucket />
        </Bottom>
        <AnimatingStarBucketWrapper
          innerRef={ref => (this.refAnimatingStarBucketWrapper = ref)}
        />
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #eede16;
`

const ContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 5%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.3vh rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0.1)};
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ff0000;
  }
`

const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  height: 13%;
  display: flex;
  bottom: 0;
  z-index: 150;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const TextMarquee = styled.div`
  width: 80%;
  text-align: center;
`

const TextWrapper = styled.div`
  display: flex;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const StarTypeImageWrap = styled.div`
  display: flex;
  position: relative;
`

const StarTypeImageLoading = styled.div`
  width: 65vw;
  height: 30vh;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`

const StarTypeImage = styled.img`
  width: 100%;
  height: 30vh;
  pointer-events: none;
`

const RedeemButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const RedeemButton = styled.div`
  width: ${props => responsiveDimension(24)};
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(0.4)};
  background-color: white;
  cursor: ${props => (props.locked ? 'not-allowed' : 'pointer')};
  &:after {
    content: '${props => props.text}';
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
    height: inherit;
    background: linear-gradient(to right, #000000, rgba(0,0,0, 0.9));
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(props.fontSize)};
    letter-spacing: ${props => responsiveDimension(0.1)};
    text-transform: uppercase;
    line-height: 1;
    color: #eede16;
  }
`

const NeedMoreStarsButton = styled.div`
  width: ${props => responsiveDimension(24)};
  height: ${props => responsiveDimension(8)};
  border: ${props => responsiveDimension(0.4)} solid #c61818;
  background-color: transparent;
  &:after {
    content: '${props => props.text}';
    display: flex;
    justify-content: center;
    align-items: center;
    width: inherit;
    height: inherit;
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3)};
    letter-spacing: ${props => responsiveDimension(0.1)};
    text-transform: uppercase;
    line-height: 1;
    color: #c61818;
  }
`

const buttonBaseColor = '#231F20'
const AddStarButton = styled.div`
  width: ${props => responsiveDimension(24)};
  height: ${props => responsiveDimension(8)};
  border: ${props => responsiveDimension(0.4)} solid ${buttonBaseColor};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:before {
    content: 'add star';
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3.5)};
    color: ${buttonBaseColor};
    letter-spacing: ${props => responsiveDimension(0.1)};
    text-transform: uppercase;
    line-height: 1;
    padding-top: 1%;
  }
`

const AddStarIcon = styled.div`
  width: 30%;
  height: 100%;
  position: relative;
  &:before {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${StarIconDark});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: left;
    margin-bottom: 1%;
  }
  &:after {
    position: absolute;
    width: 45%;
    height: 45%;
    content: '';
    display: inline-block;
    background-image: url(${PlusSignIcon});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    left: 50%;
    top: 50%;
    transform: translate(-70%, -45%);
  }
`

const StarCounter = styled.div`
  position: absolute;
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
  right: 0;
  bottom: 0;
  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: ${props => (props.srcInner ? 'inline-block' : 'none')};
    background-image: url(${props => props.srcInner});
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    margin-bottom: 10%;
  }
`

const AnimatingStarBucketWrapper = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(11)};
  height: ${props => responsiveDimension(11)};
  display: flex;
  left: 50%;
  bottom: ${props => responsiveDimension(0)};
  transform: translateX(-50%);
`

const AnimatingStarBucket = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(11)};
  height: ${props => responsiveDimension(11)};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${StarIconDarkGoldBorder});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 50%;
  bottom: ${props => responsiveDimension(0)};
  transform: translateX(-50%);
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(11 * 0.5)};
  color: #eede16;
  padding-top: 5%;
  z-index: 151;
  opacity: 1;
`
