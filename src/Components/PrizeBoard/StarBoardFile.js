import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax, Ease, Power4, Linear } from 'gsap'
import Background from '@/assets/images/playalong-default.jpg'
import LockIcon from '@/assets/images/icon-lock.svg'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import {
  vhToPx,
  evalImage,
  ordinalSuffix,
  numberFormat,
  responsiveDimension,
} from '@/utils'
import StarItemFile from './StarItemFile'

@inject('StarBoardStore', 'PrizeBoardStore')
@observer
export default class StarBoardFile extends Component {
  constructor(props) {
    super(props)
  }

  handleStarItemClick(item) {
    TweenMax.to(this.Unlock, 0.3, {
      opacity: 1,
      zIndex: 100,
      onComplete: () => {
        //////////////////////////////this.props.PrizeBoardStore.setLockPrizeSlide(true)
      },
    })
  }

  handleUnlockClick() {
    TweenMax.to(this.Unlock, 0.3, {
      opacity: 0,
      zIndex: -100,
      onComplete: () => {
        //////////////////////////////this.props.PrizeBoardStore.setLockPrizeSlide(false)
      },
    })
  }

  handleReturnClick() {
    this.props.closeStarBoard()
  }

  render() {
    let { stars, selectedStar } = this.props.StarBoardStore
    let selStar = selectedStar || stars[1]
    let { profile } = this.props

    return (
      <Container>
        <Wrapper>
          <Top>
            <TextWrapper>
              <Text font={'pamainbold'} size={5} color={'#ffffff'}>
                STAR BOARD
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainregular'} size={2.8} color={'#ffffff'}>
                COLLECT AND USE STARS AT THE&nbsp;
              </Text>
              <Text font={'pamainbold'} size={2.8} color={'#ed1c24'}>
                LIVE EVENTS
              </Text>
            </TextWrapper>
          </Top>

          <Middle>
            <MiddleInner>
              {stars.map((item, key) => {
                if (key > 2) {
                  return null
                }
                return (
                  <StarItemFile
                    key={key}
                    item={item}
                    selStar={selStar}
                    handleStarItemClick={this.handleStarItemClick.bind(
                      this,
                      item
                    )}
                  />
                )
              })}
            </MiddleInner>
          </Middle>

          <Bottom
            backgroundColor={this.props.footerBackgroundColor || '#000000'}
          >
            <Text
              font={'pamainlight'}
              size={4}
              color={'#ffffff'}
              onClick={this.handleReturnClick.bind(this)}
            >
              TAP TO RETURN
            </Text>
            <StarWrapper>
              <Text
                font={'pamainlight'}
                size={4}
                color={'#ffffff'}
                lineHeight={1}
              >
                YOUR STARS EARNED
              </Text>
              <Star src={StarIcon} color={'#202020'}>
                {profile.currencies['stars']}
              </Star>
            </StarWrapper>
          </Bottom>
        </Wrapper>

        <Unlock
          innerRef={ref => (this.Unlock = ref)}
          onClick={this.handleUnlockClick.bind(this)}
        >
          <TopUnlock>
            <LockCircleOuter>
              <LockCircleWrapper>
                <LockCircle src={LockIcon} />
              </LockCircleWrapper>
            </LockCircleOuter>
            <TextWrapper>
              <Text font={'pamainregular'} size={4} color={'#ffffff'}>
                STAR BOARDS ARE UNAVAILABLE
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainregular'} size={4} color={'#ffffff'}>
                THEY WILL UNLOCK AT THE
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainbold'} size={4} color={'#ed1c24'}>
                LIVE EVENTS
              </Text>
            </TextWrapper>
          </TopUnlock>
          <BottomUnlock>
            <Text font={'pamainlight'} size={4} color={'#ffffff'}>
              TAP ANYWHERE TO RETURN
            </Text>
          </BottomUnlock>
        </Unlock>
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

const Top = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(17)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 5%;
  padding-right: 5%;
`

const Middle = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(76)};
  display: flex;
  flex-direction: row;
  //justify-content: center;
  position: relative;
`

const Bottom = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(10)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
`

const MiddleInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  &:after {
    content: '';
    position: absolute;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.5) 90%
    );
    width: 100%;
    height: 3em;
    bottom: 0;
  }
`

const TextWrapper = styled.div`
  line-height: 1;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props =>
    props.lineHeight
      ? `line-height:${responsiveDimension(props.lineHeight)}`
      : ``};
`

const StarWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Star = styled.div`
  width: ${props => responsiveDimension(9)};
  height: ${props => responsiveDimension(9)};
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(4.5)};
  color: ${props => props.color};
  padding-top: ${props => responsiveDimension(1)};

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 75%;
  background-position: center;

  margin-right: ${props => responsiveDimension(1)};
`

const Unlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
  z-index: -100;
`
const TopUnlock = styled.div`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const BottomUnlock = styled.div`
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
`

const LockCircleOuter = styled.div`
  margin-bottom: 5%;
`

const LockCircleWrapper = styled.div`
  width: ${props => responsiveDimension(8)};
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(8)};
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LockCircle = styled.div`
  width: ${props => responsiveDimension(4.7)};
  height: ${props => responsiveDimension(4.7)};
  border-radius: ${props => responsiveDimension(4.7)};
  background-color: #ffffff;
  border ${props => responsiveDimension(0.4)} solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(4.4)};
    height: ${props => responsiveDimension(4.4)};
    background-color: #000000;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 80%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 70%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`
