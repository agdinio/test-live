import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import Background from '@/assets/images/playalong-default.jpg'
import BigPrizeBoardDetail from './BigPrizeBoardDetail'
import {
  evalImage,
  ordinalSuffix,
  numberFormat,
  responsiveDimension,
} from '@/utils'
import { eventCapture } from '../Auth/GoogleAnalytics'
@inject('PrizeBoardStore', 'NavigationStore', 'AnalyticsStore')
@observer
export default class BigPrizeBoard extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      gotoDetail: false,
      timer: 0,
      check: null,
      prizeDetail: null,
    })
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  componentWillUnmount() {
    this.handleTimeStop('PrizeBoard-BigPrizeBoard')
  }

  componentDidMount() {
    this.handleTimeStart('PrizeBoard-BigPrizeBoard')
    if (this.BoardsScrolling) {
      if (
        this.BoardsScrolling.offsetHeight < this.BoardsScrolling.scrollHeight
      ) {
        this.BoardsScrolling.style.overflowY = 'scroll'
      } else {
        this.BoardsScrolling.style.overflowY = 'hidden'
      }
    }
  }

  handleShowDetailClick(item) {
    this.prizeDetail = item
    let comp = (
      <BigPrizeBoardDetail
        key={`bigprizeboarddetail-${item.keyword}`}
        item={this.prizeDetail}
        closePanel={this.handleClosePanel.bind(
          this,
          'PrizeBoard-BigPrizeBoardDetail'
        )}
        timeStart={this.handleTimeStart.bind(
          this,
          `PrizeBoard-BigPrizeBoard-Detail-${(item.keyword || '').replace(
            /\s+/g,
            ''
          )}`
        )}
        timeStop={this.handleTimeStop.bind(
          this,
          `PrizeBoard-BigPrizeBoard-Detail-${(item.keyword || '').replace(
            /\s+/g,
            ''
          )}`
        )}
      />
    )
    this.props.NavigationStore.addSubScreen(
      comp,
      'PrizeBoard-BigPrizeBoardDetail'
    )

    eventCapture('prize_board', item)
  }

  handleClosePanel(key) {
    this.props.NavigationStore.removeSubScreen(key)
  }

  handleNotAvailableClick() {
    TweenMax.to(this.NotAvailable, 0.2, { opacity: 0, zIndex: -100 })
  }

  handleReturnClick() {
    this.props.closeSlidingPanel()
  }

  render() {
    let { items, profile } = this.props
    let isTouch =
      !!('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0

    return (
      <Container innerRef={ref => (this.Container = ref)}>
        <Wrapper>
          <DescWrapper>
            <TextWrapper>
              <Text font={'pamainbold'} size={5.5} color={'#ffffff'}>
                BIG PRIZE BOARD
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainregular'} size={3} color={'#ffffff'}>
                TOP POINT EARNERS THIS SESSION
              </Text>
            </TextWrapper>
          </DescWrapper>

          <BoardsScrolling innerRef={ref => (this.BoardsScrolling = ref)}>
            <BoardsWrapper>
              {/*<FadedBottom />*/}
              {items.map((item, key) => {
                return (
                  <BoardBack
                    key={key}
                    // onMouseDown={this.handleMouseDown.bind(this)}
                    // onMouseUp={this.handleMouseUp.bind(this, item)}
                    // onTouchStart={this.handleMouseDown.bind(this)}
                    // onTouchEnd={this.handleMouseUp.bind(this, item)}
                    onClick={this.handleShowDetailClick.bind(this, item)}
                  >
                    <Board isTouch={isTouch}>
                      <BoardImage
                        src={evalImage('prizeboard/' + item.image)}
                        pos={item.pos}
                      >
                        {item.isLuxury ? (
                          <LuxuryHotelImage
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
                                <Text font={'pamainbold'} size={4}>
                                  {header.value}
                                </Text>
                              </TextWrapper>
                            )
                          })}
                          {item.details.map((detail, detailkey) => {
                            return (
                              <TextWrapper key={detailkey}>
                                <Text
                                  font={'pamainregular'}
                                  size={2.3}
                                  uppercase
                                >
                                  {detail.value}
                                </Text>
                              </TextWrapper>
                            )
                          })}
                        </OuterTextWrapper>
                      </BoardDesc>
                      <BoardCircle>
                        <Circle color={'#7736dd'} marginLeft={0.5}>
                          {item.rank}
                          <Ordinal color={'#7736dd'}>
                            {ordinalSuffix(item.rank)}
                          </Ordinal>
                        </Circle>
                      </BoardCircle>
                    </Board>
                  </BoardBack>
                )
              })}
            </BoardsWrapper>
          </BoardsScrolling>

          <SummaryWrapper>
            <Text
              font={'pamainlight'}
              size={4}
              color={'#ffffff'}
              onClick={this.handleReturnClick.bind(this)}
            >
              TAP TO RETURN
            </Text>
            <BigPrizeWrapper>
              <Text
                font={'pamainlight'}
                size={4}
                color={'#ffffff'}
                lineHeight={1}
              >
                YOUR POINTS
              </Text>
              <div style={{ width: responsiveDimension(1) }} />
              <Text font={'pamainextrabold'} size={5} color={'#ffffff'}>
                {profile.currencies['points']}
              </Text>
              <PointLabelWrapper>
                <Text font={'pamainregular'} size={3} color={'#17c5ff'}>
                  &nbsp;PTS
                </Text>
              </PointLabelWrapper>
            </BigPrizeWrapper>
          </SummaryWrapper>
        </Wrapper>

        {/*
        <DetailSliding innerRef={ref => (this.DetailWrapper = ref)} />
*/}

        <NotAvailable
          innerRef={ref => (this.NotAvailable = ref)}
          onClick={this.handleNotAvailableClick.bind(this)}
        >
          <Text font={'pamainlight'} size={6} color={'#ffffff'}>
            INFO NOT AVAILABLE
          </Text>
          <Text font={'pamainlight'} size={6} color={'#ffffff'}>
            TAP ANYWHERE TO RETURN
          </Text>
        </NotAvailable>
      </Container>
    )
  }
}

const Container = styled.div`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  display: flex;
`
const Wrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`

const SummaryWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(12)};
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 3%;
  padding-right: 5%;
`

const SummarySection = styled.div`
  display: flex;
  flex-direction: row;
`

const BigPrizeWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PointLabelWrapper = styled.div`
  padding-top: ${props => responsiveDimension(1.1)};
`

const OuterTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-left: 7%;
`

const TextWrapper = styled.div`
  line-height: 0.9;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')};
`

const BoardsScrolling = styled.div`
  position: relative;
  width: 100%;
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

const BoardsWrapper = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`
const FadedBottom = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0) 80%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 10;
  /*
  position: relative;
  bottom: 0;
  height: 4vh;
  background-image: linear-gradient(
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 100%
    );
*/
`
const BoardBack = styled.div`
  position: relative;
  width: 100%;
  height: ${props => responsiveDimension(17)};
  margin-top: ${props => responsiveDimension(0.7)};
  display: flex;
  flex-direction: row;
  background-color: #212121;
`

const Board = styled.div`
  width: 92%;
  height: ${props => responsiveDimension(17)};
  border-top-right-radius: ${props => responsiveDimension(17)};
  border-bottom-right-radius: ${props => responsiveDimension(17)};
  display: flex;
  flex-direction: row;
  background-color: #ffffff;

  &:hover {
    cursor: pointer;
    animation: ${props => (!props.isTouch ? hoverPrizeBoard : ``)} 2s forwards;
  }

  &:hover ${props => UserPointsBar} {
    ${props => (!props.isTouch ? `background-color: #212121;` : ``)};
  }

  &:hover ${props => Text} {
    animation: ${props => (!props.isTouch ? hoverPrizeBoardText : ``)} 1s
      forwards;
  }
`

const hoverPrizeBoard = keyframes`
  0%{
      background-color: #ffffff;
  }
  100%{
    background-color: #7736dd;
  }
`
const hoverPrizeBoardText = keyframes`
  0%{
    color: #000000;
  }
  100%{
    color: #ffffff;
  }
`

const BoardImage = styled.div`
  ///////////////position: absolute;
  width: ${props => responsiveDimension(23)};
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
  height: 36%;
  padding-top: 5%;
  padding-left: 5%;
`

const UserPointsBar = styled.div`
  width: 96%;
  height: ${props => responsiveDimension(5.5)};
  border-top-right-radius: ${props => responsiveDimension(5.5)};
  border-bottom-right-radius: ${props => responsiveDimension(5.5)};
  background: #57585b;
  display: flex;
  justify-content: space-between;
`
const Username = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2)};
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const UserPoints = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  color: #ffffff;
  text-transform: uppercase;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 5%;
`

const BoardDesc = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const BoardCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => responsiveDimension(-4.5)};
`
const Circle = styled.div`
  width: ${props => responsiveDimension(9.4)};
  height: ${props => responsiveDimension(9.4)};
  border-radius: ${props => responsiveDimension(9.4)};
  border: ${props => responsiveDimension(0.7)} solid ${props => props.color};
  background-color: ${props => props.backgroundColor || '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(5)};
  color: ${props => props.color};
  padding-top: 5%;
`
const Ordinal = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3)};
  color: ${props => props.color};
  text-transform: uppercase;
  padding-bottom: 15%;
`

const DescWrapper = styled.div`
  width: 100%;
  height: 19.5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 3%;
`

const DetailSliding = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  //background: rgba(196,40,135,0.2);
  transform: translateX(100%);
`

const NotAvailable = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
  z-index: -100;
`
