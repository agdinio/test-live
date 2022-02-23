import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax, Ease, Power4, Linear } from 'gsap'
import ArrowIcon from '@/assets/images/icon-arrow-black.svg'
import HandIcon from '@/assets/images/hand-icon.svg'
import SwipingLineAnimation from '@/Components/Common/SwipingLineAnimation'
import {
  vhToPx,
  evalImage,
  ordinalSuffix,
  numberFormat,
  responsiveDimension,
} from '@/utils'

@observer
export default class BigPrizeBoardDetail extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      idleTime: 0,
      check: null,
    })
  }

  componentWillUnmount() {
    if (this.props.timeStop) {
      this.props.timeStop()
    }
    clearInterval(this.check)
  }

  componentDidMount() {
    if (this.props.timeStart) {
      this.props.timeStart()
    }
    //////////////this.handleIdleTime()
    this.handleMiddleEvent()

    if (this.ArrowDownIconWrapper && this.ArrowDownIcon) {
      setTimeout(() => {
        /*
        new TimelineMax({ repeat: -1 })
          .to(this.ArrowDownIcon, 1, {
            opacity: 1,
            y: '0%',
            easing: Linear.easeIn,
          })
          .to(this.ArrowDownIcon, 1, {
            opacity: 0,
            y: '300%',
            easing: Linear.easeOut,
          })
*/

        if (this.Middle && this.MiddleScrolling) {
          if (this.Middle.offsetHeight && this.MiddleScrolling.offsetHeight) {
            if (this.Middle.offsetHeight > this.MiddleScrolling.offsetHeight) {
              TweenMax.set(this.ArrowDownIconWrapper, { opacity: 1 })
            } else {
              TweenMax.set(this.ArrowDownIconWrapper, { opacity: 0 })
            }
          }
        }
      }, 100)
    }
  }

  componentDidUpdate__(nextProps) {
    this.handleIdleTime()
    setTimeout(() => {
      if (this.Middle.offsetHeight && this.MiddleScrolling.offsetHeight) {
        if (this.Middle.offsetHeight > this.MiddleScrolling.offsetHeight) {
          TweenMax.set(this.ArrowDownIconWrapper, { opacity: 1 })
        } else {
          TweenMax.set(this.ArrowDownIconWrapper, { opacity: 0 })
        }
      }
    }, 1000)
  }

  animBarSwipeRight() {
    new TimelineMax({ repeat: -1 }).to(this.SwipeLineRightBall, 2, {
      x: responsiveDimension(16),
      backfaceVisibility: 'hidden',
    })
    new TimelineMax({ repeat: -1 }).to(this.SwipeLineRightAnim, 2, {
      width: '70%',
      backfaceVisibility: 'hidden',
    })
  }

  handleIdleTime() {
    if (this.check) {
      clearInterval(this.check)
    }

    this.check = setInterval(() => {
      this.idleTime++
      if (this.idleTime >= 7) {
        clearInterval(this.check)
        this.showIdleScreen()
      }
    }, 1000)
  }

  hideIdleScreen() {
    TweenMax.to(this.Idle, 0.3, {
      opacity: 0,
      zIndex: -100,
      onComplete: () => {
        if (this.SectionSwipeUp && this.SectionSwipeRight) {
          TweenMax.set(this.SectionSwipeUp, { opacity: 0 })
          TweenMax.set(this.SectionSwipeRight, { opacity: 0 })
        }
      },
    })
  }

  showIdleScreen() {
    TweenMax.to(this.Idle, 0.3, { opacity: 1, zIndex: 100 })
    this.animSwipeUp(response => {
      if (response) {
        TweenMax.to(this.SectionSwipeUp, 0.3, { opacity: 0 })
        setTimeout(() => {
          this.animSwipeRight(responseright => {
            if (responseright) {
              this.idleTime = 0
              this.hideIdleScreen()
            }
          })
        }, 1000)
      }
    })
  }

  handleMiddleEvent() {
    /**
     * Desktop Browser
     */

    // IE9, Chrome, Safari, Opera
    this.Middle.addEventListener('mousewheel', e => {
      let middleHeight = this.Middle.offsetHeight
      let scrollHeight = this.MiddleScrolling.offsetHeight
      if (this.MiddleScrolling.scrollTop > 0) {
        TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 0 })
      } else {
        if (middleHeight > scrollHeight) {
          TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 1 })
        } else {
          TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 0 })
        }
      }
    })
    // Firefox
    this.Middle.addEventListener('DOMMouseScroll', e => {
      let middleHeight = this.Middle.offsetHeight
      let scrollHeight = this.MiddleScrolling.offsetHeight
      if (this.MiddleScrolling.scrollTop > 0) {
        TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 0 })
      } else {
        if (middleHeight > scrollHeight) {
          TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 1 })
        } else {
          TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 0 })
        }
      }
    })

    this.Container.addEventListener('mousemove', e => {
      this.idleTime = 0
      this.hideIdleScreen()
    })

    /**
     * Mobile Browser
     */
    this.Middle.addEventListener('touchmove', e => {
      this.idleTime = 0
      this.hideIdleScreen()

      let middleHeight = this.Middle.offsetHeight
      let scrollHeight = this.MiddleScrolling.offsetHeight
      if (this.MiddleScrolling.scrollTop > 0) {
        TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 0 })
      } else {
        if (middleHeight > scrollHeight) {
          TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 1 })
        } else {
          TweenMax.to(this.ArrowDownIconWrapper, 0, { opacity: 0 })
        }
      }
    })
  }

  animSwipeUp(callback) {
    let ctr = 2

    TweenMax.to(this.SectionSwipeUp, 0.3, { opacity: 1 })

    let handler = count => {
      if (count < ctr) {
        TweenMax.set(this.SwipeHandContainer, { y: '0%' })
        TweenMax.set(this.SwipeLine, { height: 0 })
        TweenMax.to(this.SwipeHandContainer, 1.5, { y: '150%' })
        TweenMax.to(this.SwipeLine, 1.5, {
          height: '70%',
          onComplete: () => {
            handler(count + 1)
          },
        })
      } else {
        callback(true)
      }
    }

    handler(0)
  }

  animSwipeRight(callback) {
    let ctr = 2

    TweenMax.to(this.SectionSwipeRight, 0.3, { opacity: 1 })

    let handler = count => {
      if (count < ctr) {
        TweenMax.set(this.SwipeHandContainerRight, { x: '0%' })
        TweenMax.set(this.SwipeLineRight, { width: 0 })
        TweenMax.to(this.SwipeHandContainerRight, 1.5, { x: '80%' })
        TweenMax.to(this.SwipeLineRight, 1.5, {
          width: '90%',
          onComplete: () => {
            handler(count + 1)
          },
        })
      } else {
        callback(true)
      }
    }

    handler(0)
    /*
    TweenMax.to(this.SectionSwipeRight, 0.3, {opacity: 1})
    new TimelineMax({repeat: 1})
      .to(this.SwipeHandContainerRight, 1.5, { x: '80%' })

    new TimelineMax({repeat: 1})
      .to(this.SwipeLineRight, 1.5, { width: '90%' })
*/
  }

  handleSwipeHandClick() {
    /*
    new TimelineMax({repeat: 1})
      .to(this.SwipeHandContainer, 1, { y: '150%' })

    new TimelineMax({repeat: 1})
      .to(this.SwipeLine, 1, {height: '70%' })
*/
  }

  render() {
    let x = '<b>orginal<b>'
    //let y = x.replace("\{([^}]*)\}/g", 'ako')
    let y = x.replace(/(\<b>).+?(\<b>)/g, 'changed')

    let { item } = this.props
    let { prizeInfo } = item

    return (
      <Container innerRef={ref => (this.Container = ref)}>
        <Wrapper>
          {/*<div style={{width:'100%', backgroundColor:'red'}}>{this.idleTime}</div>*/}
          <Top>
            <Board>
              <BoardImage
                src={evalImage('prizeboard/' + item.image)}
                pos={item.pos}
              >
                {item.isLuxury ? (
                  <LuxuryHotelImage
                    height={36}
                    src={evalImage(
                      'prizeboard/playalongnow-bigprizeboards_logo-small_luxury_hotels.png'
                    )}
                  />
                ) : null}
              </BoardImage>
              <BoardDesc>
                <OuterTextWrapper>
                  {item.headers.map((header, headerkey) => {
                    return (
                      <TextWrapper key={headerkey}>
                        <Text font={'pamainbold'} size={4} uppercase>
                          {header.value}
                        </Text>
                      </TextWrapper>
                    )
                  })}
                  {item.details.map((detail, detailkey) => {
                    return (
                      <TextWrapper key={detailkey}>
                        <Text font={'pamainregular'} size={2.3} uppercase>
                          {detail.value}
                        </Text>
                      </TextWrapper>
                    )
                  })}
                </OuterTextWrapper>
              </BoardDesc>
            </Board>
          </Top>

          <MiddleScrolling innerRef={ref => (this.MiddleScrolling = ref)}>
            <Middle innerRef={ref => (this.Middle = ref)}>
              <TopLower />
              <MiddleInner>
                <TopTextSmall>{prizeInfo.topTextSmall || ''}</TopTextSmall>
                <TopTextBig>{prizeInfo.topTextBig || ''}</TopTextBig>
                {prizeInfo.desc.map((info, i) => {
                  return info.image ? (
                    <InfoImage
                      src={evalImage(
                        'prizeboard/' + prizeInfo.images[info.index]
                      )}
                      key={i}
                    >
                      {item.isLuxury ? (
                        <LuxuryHotelImage
                          key={i}
                          src={evalImage(
                            'prizeboard/playalongnow-bigprizeboards_logo-small_luxury_hotels.png'
                          )}
                        />
                      ) : null}
                    </InfoImage>
                  ) : info.break ? (
                    <br key={i} />
                  ) : (
                    <BottomTextSmall
                      fontWeight={info.fontWeight}
                      fontStyle={info.fontStyle}
                      key={i}
                    >
                      {info.value}
                    </BottomTextSmall>
                  )
                })}

                {/*
              <TopTextSmall>{prizeInfo.topTextSmall || ''}</TopTextSmall>
              <TopTextBig>{prizeInfo.topTextBig || ''}</TopTextBig>
              <InfoImage src={evalImage('prizeboard/' + prizeInfo.images[0])} />
              <BottomTextBig>{prizeInfo.bottomTextBig || ''}</BottomTextBig>
              <BottomTextSmall>
                {prizeInfo.bottomTextSmall || ''}
              </BottomTextSmall>
*/}
              </MiddleInner>
            </Middle>
            <MiddleArrowDown
              innerRef={ref => (this.ArrowDownIconWrapper = ref)}
            >
              <ArrowDownIcon
                src={ArrowIcon}
                innerRef={ref => (this.ArrowDownIcon = ref)}
              />
            </MiddleArrowDown>
          </MiddleScrolling>

          <Bottom
            backgroundColor={this.props.footerBackgroundColor || '#7635dc'}
          >
            <TapToReturn>
              {/*<TapToReturnText>*/}
              <Text
                id={`button-tap-to-return`}
                font={'pamainlight'}
                size={3.7}
                color={'#ffffff'}
                onClick={this.props.closePanel.bind(this)}
                style={{ whiteSpace: 'nowrap' }}
              >
                TAP TO RETURN OR SWIPE RIGHT
              </Text>
              {/*</TapToReturnText>*/}
              <SwipeRightAnim>
                <SwipingLineAnimation />
              </SwipeRightAnim>
              {/*
              <TapToReturnIcon src={ArrowIcon} />
*/}
            </TapToReturn>
            {/*
            <Text font={'pamainregular'} size={4} color={'#ffffff'}>
              BIG PRIZE BOARDS
            </Text>
*/}
          </Bottom>
        </Wrapper>

        <Idle innerRef={ref => (this.Idle = ref)}>
          <SectionSwipeUp innerRef={ref => (this.SectionSwipeUp = ref)}>
            <Text font={'pamainregular'} size={4} color={'#ffffff'}>
              SWIPE UP OR DOWN TO SCROLL
            </Text>
            <SwipeHandWrapper>
              <SwipeLinePanel>
                <SwipeLine innerRef={ref => (this.SwipeLine = ref)} />
              </SwipeLinePanel>
              <SwipeHandPanel
                innerRef={ref => (this.SwipeHandContainer = ref)}
                onClick={this.handleSwipeHandClick.bind(this)}
              >
                <SwipeHandCircle />
                <SwipeHandIcon src={HandIcon} />
              </SwipeHandPanel>
            </SwipeHandWrapper>
          </SectionSwipeUp>

          <SectionSwipeRight innerRef={ref => (this.SectionSwipeRight = ref)}>
            <Text font={'pamainregular'} size={4} color={'#ffffff'}>
              SWIPE RIGHT TO RETURN
            </Text>
            <SwipeHandWrapperRight>
              <SwipeLinePanelRight>
                <SwipeLineRight innerRef={ref => (this.SwipeLineRight = ref)} />
              </SwipeLinePanelRight>
              <SwipeHandPanelRight
                innerRef={ref => (this.SwipeHandContainerRight = ref)}
                onClick={this.handleSwipeHandClick.bind(this)}
              >
                <SwipeHandCircle />
                <SwipeHandIconRight src={HandIcon} />
              </SwipeHandPanelRight>
            </SwipeHandWrapperRight>
          </SectionSwipeRight>
        </Idle>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #ffffff;
`

const Wrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(17)};
  background-color: #ffffff;
`

const TopLower = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(1.8)};
/*
  background-image: linear-gradient(
    rgba(232, 232, 232, 0.8) 50%,
    rgba(232, 232, 232, 0.3) 100%
  );
*/
  background-image linear-gradient(rgba(232, 232, 232, 1), transparent);
`

const MiddleScrolling = styled.div`
  position: relative;
  width: 100%;
  //height: ${props => responsiveDimension(72)};
  height: 100%;
  display: flex;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.3vh rgba(0, 0, 0, 0.3);
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
const Middle = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`
const MiddleInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5% 8% 5% 8%;
`
const MiddleArrowDown = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => responsiveDimension(6)};
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding-right: 3%;
  height: 25%;
`
const ArrowDownIcon = styled.div`
  width: ${props => responsiveDimension(2.7)};
  height: ${props => responsiveDimension(2.7)};

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;

/*
  background-color: #000000;
  -webkit-mask-image: url(${props => props.src});
  -webkit-mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: url(${props => props.src});
  mask-size: 100%;
  mask-repeat: no-repeat;
  mask-position: center;
*/

  transform: rotate(90deg);

  -webkit-animation: ${props =>
    arrowDownIconSlideUpDown} 2s ease-in forwards infinite;
  -moz-animation: ${props =>
    arrowDownIconSlideUpDown} 2s ease-in forwards infinite;
  -o-animation: ${props =>
    arrowDownIconSlideUpDown} 2s ease-in forwards infinite;
  animation: ${props => arrowDownIconSlideUpDown} 2s ease-in forwards infinite;
`
const arrowDownIconSlideUpDown = keyframes`
  0% {
    opacity: 1;
    transform: rotate(90deg) translateX(0%);
  }
  100% {
    opacity: 0;
    transform: rotate(90deg) translateX(300%);
  }
`
const TopTextSmall = styled.div`
  width: 100%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.5)};
  color: #7736dd;
  line-height: 1;
  text-transform: uppercase;
`
const TopTextBig = styled.div`
  width: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.4)};
  color: #000000;
  line-height: 1;
  text-transform: uppercase;
  margin-top: ${props => responsiveDimension(1)};
  margin-bottom: ${props => responsiveDimension(1.5)};
`
const InfoImage = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(33)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`
const BottomTextBig = styled.div`
  width: 100%;
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(5.5)};
  color: #7736dd;
  line-height: 1;
  text-transform: uppercase;
  margin-top: ${props => responsiveDimension(2)};
`

const BottomTextSmallWrapper = styled.div``
const BottomTextSmall = styled.div`
  width: 100%;
  font-family: ${props =>
    props.fontWeight === 'bold' ? 'pamainbold' : 'pamainlight'};
  font-size: ${props => responsiveDimension(3)};
  color: #000000;
  line-height: 1.1;
  text-transform: uppercase;
  ${props => (props.fontStyle ? `font-style:${props.fontStyle};` : ``)};
`

const Bottom = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(10)};
  background-color: ${props => props.backgroundColor || '#7635dc'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
`

const TapToReturn = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const TapToReturnText = styled.div`
  width: 64%;
  height: 100%;
  display: flex;
  align-items: center;
  //justify-content: flex-end;
  background: red;
`

const SwipeRightAnim = styled.div`
  width: 36%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 3%;
  padding-right: 3%;
`

const SwipeLineRightBall = styled.div`
  //position: absolute;
  width: ${props => responsiveDimension(3)};
  height: ${props => responsiveDimension(3)};
  border-radius: ${props => responsiveDimension(3)};
  background-color: #ffffff;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`

const SwipeLineRightAnim = styled.div`
  width: 0;
  height: ${props => responsiveDimension(1)};
  background: linear-gradient(to right, transparent, white);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`

const TapToReturnIcon = styled.div`
  width: ${props => responsiveDimension(2.7)};
  height: ${props => responsiveDimension(2.7)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin-bottom: 2%;
`

const Board = styled.div`
  width: 93%;
  height: ${props => responsiveDimension(17)};
  border-top-right-radius: ${props => responsiveDimension(17)};
  border-bottom-right-radius: ${props => responsiveDimension(17)};
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
`

const BoardImage = styled.div`
  width: ${props => responsiveDimension(35)};
  height: ${props => responsiveDimension(17)};
  border-top-right-radius: ${props => responsiveDimension(17)};
  border-bottom-right-radius: ${props => responsiveDimension(17)};
  border: ${props => responsiveDimension(0.4)} solid #212121;

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: ${props => props.pos};
`
const LuxuryHotelImage = styled.img`
  height: ${props => props.height || 30}%
  padding-top: 5%;
  padding-left: 5%;
`

const BoardDesc = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const OuterTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-left: 7%;
  padding-right: 7%;
`

const TextWrapper = styled.div`
  line-height: 0.9;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
`

const Idle = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
  z-index: -100;
`

const SectionSwipeUp = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  z-index: 102;
`
const SectionSwipeRight = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  z-index: 101;
`

const SwipeHandWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(35)};
  position: relative;
`
const SwipeLinePanel = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`
const SwipeLine = styled.div`
  width: ${props => responsiveDimension(0.9)};
  height: 0;
  background: linear-gradient(transparent, white);
`
const SwipeHandPanel = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const SwipeHandCircle = styled.div`
  //position: absolute;
  width: ${props => responsiveDimension(6.7)};
  height: ${props => responsiveDimension(6.7)};
  border-radius: ${props => responsiveDimension(6.7)};
  background-color: #7736dd;
  border: ${props => responsiveDimension(0.5)} solid #ffffff;
`
const SwipeHandIcon = styled.div`
  //  position: absolute;
  width: ${props => responsiveDimension(12)};
  height: ${props => responsiveDimension(12)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  transform: rotate(18deg);
  margin-top: -7%;
  margin-left: -3%;
`

const SwipeHandWrapperRight = styled.div`
  width: 60%;
  //height: ${props => responsiveDimension(35)};
  //position: relative;
  ///display: flex;
  ///justify-content: center;
`
const SwipeHandPanelRight = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  // margin-left: 25%;
  //margin-right: 25%;
  margin-top: 5%;
  position: relative;
`
const SwipeLinePanelRight = styled.div`
  position: absolute;
  width: inherit;
  margin-top: 7%;
`
const SwipeLineRight = styled.div`
  width: 0;
  height: ${props => responsiveDimension(1)};
  background: linear-gradient(to right, transparent, white);
`

const SwipeHandIconRight = styled.div`
  //  position: absolute;
  width: ${props => responsiveDimension(12)};
  height: ${props => responsiveDimension(12)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  transform: rotate(10deg);
  margin-top: -11%;
  margin-left: -7%;
`
