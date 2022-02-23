import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import TokenIcon from '@/assets/images/playalong-token.svg'
import SwipingLineAnimation from '@/Components/Common/SwipingLineAnimation'
import { vhToPx, evalImage, ordinalSuffix, responsiveDimension } from '@/utils'

export default class ItemDetail extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      play: false,
    })
  }

  handleVideoPlayClick() {
    TweenMax.to(this.VideoPlayWrapper, 0.2, { opacity: 0, zIndex: -10 })
  }

  togglePlay() {
    TweenMax.to(this.VideoPlayWrapper, 0.2, { opacity: 1, zIndex: 10 })
  }

  componentWillUnmount() {
    if (this.props.timeStop) {
      this.props.timeStop()
    }
  }

  componentDidMount() {
    if (this.props.timeStart) {
      this.props.timeStart()
    }
  }

  render() {
    let { item, prize } = this.props

    return (
      <Container>
        <Wrapper>
          <TopScrolling>
            <Top>
              <Section style={{ paddingTop: '10%' }}>
                <TextWrapper>
                  <Text font={'pamainregular'} size={3} color={'#000000'}>
                    DISCOVER
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  {item.prizeChest && item.prizeChest.headers
                    ? item.prizeChest.headers.map((header, key) => {
                        return (
                          <Text
                            key={key}
                            font={'pamainbold'}
                            size={4}
                            color={'#000000'}
                          >
                            {header.value}
                            &nbsp;
                          </Text>
                        )
                      })
                    : null}
                </TextWrapper>
                <TextWrapper>
                  {item.prizeChest && item.prizeChest.details
                    ? item.prizeChest.details.map((detail, key) => {
                        return (
                          <Text
                            key={key}
                            font={'pamainregular'}
                            size={3}
                            color={'#000000'}
                          >
                            {detail.value}
                            &nbsp;
                          </Text>
                        )
                      })
                    : null}
                </TextWrapper>
              </Section>

              <Section style={{ marginTop: '5%', marginBottom: '5%' }}>
                <VideoSection>
                  <VideoArea
                    src={
                      item.prizeChest && item.prizeChest.images.length > 0
                        ? evalImage('prizeboard/' + item.prizeChest.images[0])
                        : null
                    }
                    onClick={this.togglePlay.bind(this)}
                  />
                  <VideoPlayWrapper
                    innerRef={ref => (this.VideoPlayWrapper = ref)}
                  >
                    <VideoPlay
                      src={evalImage(prize.awardIcon)}
                      onClick={this.handleVideoPlayClick.bind(this)}
                    />
                    {/*
                    <EarnInfo>
                      <TokenContainer>
                        <Text
                          font={'pamainlight'}
                          size={3.5}
                          color={'#ffffff'}
                          uppercase
                        >
                          watch & earn&nbsp;
                        </Text>
                        <Text
                          font={'pamainextrabold'}
                          size={3.5}
                          color={'#ffb600'}
                        >
                          50&nbsp;
                        </Text>
                        <TokenWrapper>
                          <Token src={TokenIcon} size={2.8} index={3} />
                          <Faded
                            size={2.8}
                            index={2}
                            color={'#6d6c71'}
                            left={0.3}
                          />
                          <Faded
                            size={2.8}
                            index={1}
                            color={'#33342f'}
                            left={0.8}
                          />
                        </TokenWrapper>
                      </TokenContainer>
                    </EarnInfo>
*/}
                  </VideoPlayWrapper>
                </VideoSection>
              </Section>

              <Section style={{ marginBottom: '5%' }}>
                <TextWrapper>
                  <Ordinal>
                    <Text
                      font={'pamainextrabold'}
                      size={5}
                      color={'#000000'}
                      uppercase
                    >
                      {item.prizeChest.rank || 'n'}
                    </Text>
                    <Text
                      font={'pamainextrabold'}
                      size={3.5}
                      color={'#000000'}
                      uppercase
                    >
                      {ordinalSuffix(item.prizeChest.rank)}
                      &nbsp;
                    </Text>
                    <Text
                      font={'pamainbold'}
                      size={5}
                      color={'#000000'}
                      uppercase
                    >
                      place&nbsp;
                    </Text>
                    <Text
                      font={'pamainlight'}
                      size={5}
                      color={'#000000'}
                      uppercase
                    >
                      top point earners
                    </Text>
                  </Ordinal>
                </TextWrapper>
                <TextWrapper>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'#000000'}
                    uppercase
                  >
                    this season when you participate in
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainextrabold'} size={3.7} color={'#000000'}>
                    PlayAlong&nbsp;
                    <i>NOW&nbsp;</i>
                  </Text>
                  <Text
                    font={'pamainextrabold'}
                    size={3.7}
                    color={'#ed1c24'}
                    uppercase
                  >
                    live events&nbsp;
                  </Text>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'#000000'}
                    uppercase
                  >
                    your
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'#17c5ff'}
                    uppercase
                  >
                    points&nbsp;
                  </Text>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'#000000'}
                    uppercase
                  >
                    can earn you a spot on the
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'#946fa8'}
                    uppercase
                  >
                    'big prize board'
                  </Text>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'#000000'}
                    uppercase
                  >
                    .
                  </Text>
                </TextWrapper>
              </Section>

              {/*
            <Section height={60} style={{ paddingTop: '8%' }}>
            </Section>
            <Section
              height={100}
              style={{
                backgroundColor: 'rgba(196,40,40,0.5)',
                marginBottom: '10%',
              }}
            >
            </Section>

            <Section height={100}>
            </Section>
*/}
            </Top>
          </TopScrolling>
          <Bottom>
            <TapToReturn>
              <Text
                id={`button-tap-to-return`}
                font={'pamainlight'}
                size={3.7}
                color={'#ffffff'}
                onClick={this.props.closePanel.bind(this)}
                nowrap
              >
                TAP TO RETURN OR SWIPE RIGHT
              </Text>
              <SwipeRightAnim>
                <SwipingLineAnimation />
              </SwipeRightAnim>
            </TapToReturn>
          </Bottom>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
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

const Top__ = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(90)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 7%;
  padding-right: 7%;
`

const Top = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 7%;
  padding-right: 7%;
`
const TopScrolling = styled.div`
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

const Bottom = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(10)};
  background-color: #946fa8;
  //background: rgba(32,91,166, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 7%;
  padding-right: 7%;
`

const TextWrapper = styled.div`
  line-height: 1.1;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
`

const Section = styled.div`
  width: 100%;
  ${props => (props.height ? `${props.height}%` : '')} display: flex;
  flex-direction: column;
  justify-content: center;
`

const VideoSection = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(35)};
  position: relative;

  background: black;
`

const VideoArea = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(35)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;
  position: absolute;
`

const VideoPlayWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(35)};
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
`

const VideoPlay = styled.div`
  width: ${props => responsiveDimension(8)};
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(8)};
  background-color: #495bdb;
  //  margin-top: 10%;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(8)};
    height: ${props => responsiveDimension(8)};
    margin-left: 6%;

    background-color: white;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 47%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 47%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const EarnInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 4%;
`

const Ordinal = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 0.8;
  margin-bottom: 1.5%;
`

const TokenContainer = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 0.9;
`

const TokenWrapper = styled.div``

const Token = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
  position: absolute;
`
const Faded = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left)};
  z-index: ${props => props.index};
  position: absolute;
`

const TapToReturn = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
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
`

const SwipeLineRightAnim = styled.div`
  width: 0;
  height: ${props => responsiveDimension(1)};
  background: linear-gradient(to right, transparent, white);
`
