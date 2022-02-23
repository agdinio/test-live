import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Back, Linear } from 'gsap'
import styled, { keyframes } from 'styled-components'
import StarIconGold from '@/assets/images/star-icon-gold.svg'
import tokenIcon from '@/assets/images/playalong-token.svg'
import { PointsAndTokens } from '@/Components/PrePick/PicksPointsTokens'
import { vhToPx } from '@/utils'

@inject('PrePickStore', 'LiveGameStore', 'ResolveStore', 'ProfileStore')
@observer
export default class PostPlay extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      showThis: false,
      totalPoints: 0,
      totalTokens: 0,
      footerTotalPoints: 0,
      footerTotalTokens: 0,
      subTotalLabel: 'subtotal',
    })

    this.animateOnce = false
  }

  renderPlayItemPoints(key, item) {
    if (this[`playpoints-${key}`]) {
      ReactDOM.unmountComponentAtNode(this[`playpoints-${key}`])

      let comp = null

      switch (item.keyword) {
        case 'prepicks':
          let quadra = this.props.ResolveStore.quadraFectas.filter(
            o => o.keyword === item.keyword
          )[0]
          if (quadra) {
          }
          comp = this.renderTotalPrePicks(item)
          break
        case 'liveplay':
          comp = this.renderTotalLivePlay(item)
          break
        case 'gamemaster':
          comp = this.renderTotalGameMaster(item)
          break
        case 'sponsor':
          comp = this.renderTotalSponsor(item)
          break
        case 'prize':
          comp = this.renderTotalPrize(item)
          break
        case 'stars':
          comp = this.renderStars(item)
          break
      }

      ReactDOM.render(comp, this[`playpoints-${key}`])
    }
  }

  renderTotalPrePicks(item) {
    debugger
    let correctAns = 0
    let totalQuestions = this.props.preAnswers.length
    for (let i = 0; i < totalQuestions; i++) {
      let ans = this.props.preAnswers[i]
      if (ans.answer === ans.correctAnswer) {
        correctAns++
      }
    }

    let { correctPrePick, totalPrePick } = this.props.ResolveStore
    let perfect = correctAns === (totalQuestions || totalPrePick)
    //let perfect = (correctPrePick === totalPrePick)

    let quadra = this.props.ResolveStore.quadraFectas.filter(
      o => o.keyword === item.keyword
    )[0]
    if (quadra) {
      quadra.percentage = (correctAns / (totalQuestions || totalPrePick)) * 100
    }
    return (
      <TotalCommonWrapper>
        <TextWrapper>
          <Text
            font={'pamainregular'}
            size={4.5}
            color={perfect ? item.backgroundColor : 'rgba(255,255,255, 0.6)'}
            letterSpacing={vhToPx(0.8)}
          >
            {correctAns}
          </Text>
          <Text
            font={'pamainlight'}
            size={4.5}
            color={perfect ? item.backgroundColor : '#ffffff'}
            letterSpacing={vhToPx(0.8)}
          >
            /
          </Text>
          <Text
            font={'pamainregular'}
            size={4.5}
            color={perfect ? item.backgroundColor : '#ffffff'}
          >
            {totalQuestions || totalPrePick}
          </Text>
        </TextWrapper>
      </TotalCommonWrapper>
    )
  }

  renderTotalLivePlay(item) {
    let correctAns = this.props.PrePickStore.correctLivePlayAnswers.length
    //    let totalQuestions = this.props.PrePickStore.livePlayAnswers
    let { correctLivePlay, totalLivePlay } = this.props.ResolveStore

    let perfect = correctAns === totalLivePlay

    let quadra = this.props.ResolveStore.quadraFectas.filter(
      o => o.keyword === item.keyword
    )[0]
    if (quadra) {
      quadra.percentage = (correctAns / totalLivePlay) * 100
    }

    return (
      <TotalCommonWrapper>
        <TextWrapper>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : 'rgba(255,255,255, 0.6)'}
            letterSpacing={vhToPx(0.8)}
          >
            {correctAns}
          </Text>
          <Text
            font={'pamainlight'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
            letterSpacing={vhToPx(0.8)}
          >
            /
          </Text>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
          >
            {totalLivePlay}
          </Text>
        </TextWrapper>
      </TotalCommonWrapper>
    )
  }

  renderTotalGameMaster(item) {
    let correctAns = this.props.PrePickStore.correctGameMasterAnswers.length

    let { correctGameMaster, totalGameMaster } = this.props.ResolveStore
    let perfect = correctAns === totalGameMaster

    let quadra = this.props.ResolveStore.quadraFectas.filter(
      o => o.keyword === item.keyword
    )[0]
    if (quadra) {
      quadra.percentage = (correctAns / totalGameMaster) * 100
    }

    return (
      <TotalCommonWrapper>
        <TextWrapper>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : 'rgba(255,255,255, 0.6)'}
            letterSpacing={vhToPx(0.8)}
          >
            {correctAns}
          </Text>
          <Text
            font={'pamainlight'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
            letterSpacing={vhToPx(0.8)}
          >
            /
          </Text>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
          >
            {totalGameMaster}
          </Text>
        </TextWrapper>
      </TotalCommonWrapper>
    )
  }

  renderTotalSponsor(item) {
    let correctAns = this.props.PrePickStore.correctSponsorAnswers.length

    let { correctSponsor, totalSponsor } = this.props.ResolveStore
    let perfect = correctAns === totalSponsor

    let quadra = this.props.ResolveStore.quadraFectas.filter(
      o => o.keyword === item.keyword
    )[0]
    if (quadra) {
      quadra.percentage = (correctAns / totalSponsor) * 100
    }

    return (
      <TotalCommonWrapper>
        <TextWrapper>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : 'rgba(255,255,255, 0.6)'}
            letterSpacing={vhToPx(0.8)}
          >
            {correctAns}
          </Text>
          <Text
            font={'pamainlight'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
            letterSpacing={vhToPx(0.8)}
          >
            /
          </Text>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
          >
            {totalSponsor}
          </Text>
        </TextWrapper>
      </TotalCommonWrapper>
    )
  }

  renderTotalPrize(item) {
    debugger
    let correctAns = this.props.PrePickStore.correctPrizeAnswers.length

    let { correctPrize, totalPrize } = this.props.ResolveStore
    let perfect = correctAns === totalPrize

    return (
      <TotalCommonWrapper>
        <TextWrapper>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : 'rgba(255,255,255, 0.6)'}
            letterSpacing={vhToPx(0.8)}
          >
            {correctAns}
          </Text>
          <Text
            font={'pamainlight'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
            letterSpacing={vhToPx(0.8)}
          >
            /
          </Text>
          <Text
            font={'pamainregular'}
            size={4.3}
            color={perfect ? item.backgroundColor : '#ffffff'}
          >
            {totalPrize}
          </Text>
        </TextWrapper>
      </TotalCommonWrapper>
    )
  }

  renderStars(item) {
    let stars = 0
    if (this.props.ProfileStore.profile) {
      stars = this.props.ProfileStore.profile.currencies['stars']
    }

    return (
      <TotalCommonWrapper>
        <Star src={StarIconGold}>
          <StarText>{stars}</StarText>
        </Star>
      </TotalCommonWrapper>
    )
  }

  renderPlayItemPoints_(key, item) {
    if (this[`playpoints-${key}`]) {
      ReactDOM.unmountComponentAtNode(this[`playpoints-${key}`])
      if (item.isMultiplier) {
        let comp = <PlayItemPoints item={item} />
        ReactDOM.render(comp, this[`playpoints-${key}`])
      } else if (item.text.toUpperCase() === 'GAMEMASTER') {
        this.totalPoints += item.multiplier * item.prePoints
        let comp = <PlayItemPoints item={item} />
        ReactDOM.render(comp, this[`playpoints-${key}`])
      } else {
        this.totalTokens += item.tokens
        let comp = (
          <PlayItemTokens src={tokenIcon}>+{item.tokens}</PlayItemTokens>
        )
        ReactDOM.render(comp, this[`playpoints-${key}`])
      }
    }
  }

  animate() {
    let handler = count => {
      let item = Plays[count]

      if (count < Plays.length) {
        this.caller = setTimeout(() => {
          new TimelineMax({ repeat: 0 })
            .set(this[`play-${count}`], { width: '55%' })
            .to(this[`play-${count}`], 0.3, {
              x: '90%',
            })
            .to(this[`play-${count}`], 0.3, {
              x: '100%',
              width: '50%',
              ease: Back.easeOut.config(0),
              onStart: this.renderPlayItemPoints.bind(this, count, item),
            })

          handler(count + 1)
        }, 600)
      } else {
        console.log('compute total')
        clearTimeout(this.caller)
        this.computeTotalsInFooter()
        return
      }
    }

    handler(0)
  }

  computeTotalsInFooter() {
    TweenMax.to(this.refPostPlayFooterSlideUp, 0.3, {
      opacity: 1,
      top: '0',
      delay: 0.5,
      onComplete: () => {
        compute()
      },
    })

    let compute = () => {
      let finalPoints = this.props.PrePickStore.totalPoints + this.totalPoints
      let finalTokens = this.props.PrePickStore.totalTokens + this.totalTokens

      this.props.LiveGameStore.postPlayTotalPoints += finalPoints
      this.props.LiveGameStore.postPlayTotalTokens += finalTokens

      this.footerTotalPoints =
        this.totalPoints > 150
          ? finalPoints - 150
          : finalPoints - this.totalPoints
      this.footerTotalTokens =
        this.totalTokens > 150
          ? finalTokens - 150
          : finalTokens - this.totalTokens

      TweenMax.to(this.refPointsAndTokens, 0.3, {
        scale: 1.2,
        transformOrigin: 'right',
      })

      let byIntervals = callback => {
        let ctr = 0
        this.intervalPoints = setInterval(() => {
          this.footerTotalPoints++
          if (this.footerTotalPoints >= finalPoints) {
            clearInterval(this.intervalPoints)
            ctr++
            if (ctr >= 2) {
              callback(ctr)
            }
          }
        }, 0)

        this.intervalTokens = setInterval(() => {
          this.footerTotalTokens++
          if (this.footerTotalTokens >= finalTokens) {
            clearInterval(this.intervalTokens)
            ctr++
            if (ctr >= 2) {
              callback(ctr)
            }
          }
        }, 0)
      }

      byIntervals(() => {
        TweenMax.to(this.refPointsAndTokens, 0.3, {
          scale: 1,
          ease: Back.easeOut.config(2),
        })
        this.prepareToHideThis()
      })
    }
  }

  prepareToHideThis() {
    setTimeout(() => {
      this.subTotalLabel = '4x'
      TweenMax.to(this.refSubTotalText, 0.3, {
        fontFamily: 'pamainextrabold',
        fontSize: vhToPx(6.5),
      })
      TweenMax.to(this.refPostPlayFooterRight, 0.3, {
        scale: 0.7,
        onComplete: () => {
          this.props.handleNotifyShow('winstreak')
        },
      })
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.showThis = nextProps.show
      if (!this.animateOnce) {
        this.animateOnce = true
        this.animate()
      }
    }
  }

  render() {
    if (this.showThis) {
      return (
        <PostPlayContainer show={this.showThis}>
          <SummaryHeader>
            <Text font={'pamainregular'} size={3.5} color={'#ffffff'} uppercase>
              your results summary
            </Text>
          </SummaryHeader>
          <Wrapper>
            {Plays.map((r, i) => {
              return (
                <PlaysContainer key={i}>
                  <PlayItem
                    item={r}
                    refPlayWrapper={c => (this[`play-${i}`] = c)}
                    refPostText={c => (this[`posttext-${i}`] = c)}
                  />

                  <PlayItemTotalChoicesWrapper
                    innerRef={c => (this[`playpoints-${i}`] = c)}
                  />
                </PlaysContainer>
              )
            })}
          </Wrapper>
          <PostPlayFooter innerRef={this.props.refPostPlayFooter}>
            <PostPlayFooterSlideUpOuter
              innerRef={c => (this.refPostPlayFooterSlideUp = c)}
            >
              <Line />
              <PostPlayFooterSlideUp>
                <PostPlayFooterLeft>
                  <TextWrapper>
                    <Text
                      font={'pamainlight'}
                      size={6}
                      uppercase
                      innerRef={c => (this.refSubTotalText = c)}
                    >
                      {this.subTotalLabel}
                    </Text>
                  </TextWrapper>
                </PostPlayFooterLeft>
                <PostPlayFooterRight
                  innerRef={c => (this.refPostPlayFooterRight = c)}
                >
                  <PointsAndTokens
                    reference={c => (this.refPointsAndTokens = c)}
                    // totalPoints={this.footerTotalPoints}
                    // totalTokens={this.footerTotalTokens}
                    totalPoints={
                      this.props.ProfileStore.profile.currencies['points']
                    }
                    totalTokens={
                      this.props.ProfileStore.profile.currencies['tokens']
                    }
                    updated={true}
                  />
                </PostPlayFooterRight>
              </PostPlayFooterSlideUp>
            </PostPlayFooterSlideUpOuter>
          </PostPlayFooter>
        </PostPlayContainer>
      )
    } else {
      return null
    }
  }
}

const PostPlayContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  //align-items: center;
  animation: ${props => fadeIn} 0.5s forwards
    ${props => (!props.show ? `, animation: ${slideUp} 0.5s forwards` : ``)};
`

const fadeIn = keyframes`
  0%{opacity:0;}
  100%{opacity:1;}
`

const slideUp = keyframes`
  0%{
    transform: translateY(0%);
  }
  100%{
    transform: translateY(-85%);
  }
`

const SummaryHeader = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PostPlayFooter = styled.div`
  width: 100%;
  height: 24%;
  display: flex;
  padding 0 5% 0 5%;
`

const PostPlayFooterSlideUpOuter = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  //position: relative;
`
const PostPlayFooterSlideUp = styled.div`
  width: 100%;
  height: 100%;
  //top: 100%;
  display: flex;
  justify-content: space-between;
  //position: relative;
  //border-top: ${vhToPx(0.1)} solid #ffffff;
`
const PostPlayFooterLeft = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  //margin-left: 3%;
`
const PostPlayFooterRight = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  //margin-right: 3%;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  ////margin-top: 5%;
`

const PlayItem = props => {
  return (
    <PlayWrapper
      innerRef={props.refPlayWrapper}
      backgroundColor={props.item.backgroundColor}
    >
      <Text
        font={'pamainregular'}
        size={2.5}
        letterSpacing={vhToPx(0.1)}
        color={props.item.keyword.toUpperCase() === 'STARS' ? '#000' : '#fff'}
        uppercase
      >
        {props.item.text}
      </Text>
    </PlayWrapper>
  )
}
const PlayItem__ = props => {
  return (
    <PlayWrapper
      innerRef={props.refPlayWrapper}
      backgroundColor={props.item.backgroundColor}
    >
      <PostTextWrapper
        backgroundColor={
          props.item.isMultiplier
            ? props.item.innerBackgroundColor
            : props.item.backgroundColor
        }
      >
        <PostText
          color={
            props.item.isMultiplier
              ? props.item.backgroundColor
              : props.item.innerBackgroundColor
          }
          innerRef={props.refPostText}
        >
          {props.item.text}
        </PostText>
        {props.item.isMultiplier ? (
          <PostMultiplier
            backgroundColor={props.item.backgroundColor}
            color={props.item.innerBackgroundColor}
            multiplier={props.item.multiplier}
          />
        ) : (
          ''
        )}
      </PostTextWrapper>
      {props.item.isMultiplier ? (
        <PrePoints color={props.item.innerBackgroundColor}>
          {props.item.prePoints}
        </PrePoints>
      ) : (
        ''
      )}
    </PlayWrapper>
  )
}

const PlaysContainer = styled.div`
  width: 100%;
  height: ${props => vhToPx(6.7)};
  margin: ${props => vhToPx(0.2)} 0 ${props => vhToPx(0.2)} 0;

  display: flex;
  justify-content: space-between;
`

const PlayWrapper = styled.div`
  width: 50%;
  height: ${props => vhToPx(6.7)};
  border-top-right-radius: ${props => vhToPx(6.7)};
  border-bottom-right-radius: ${props => vhToPx(6.7)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  //flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 5%;
  position: relative;
  left: -50%;
`

const PostTextWrapper = styled.div`
  width: 100%;
  height: ${props => vhToPx(6.2)};
  border-top-right-radius: ${props => vhToPx(6.2)};
  border-bottom-right-radius: ${props => vhToPx(6.2)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const PostText = styled.div`
  height: ${props => vhToPx(6.2)};
  font-family: pamainregular;
  font-size: ${props => vhToPx(2.4)};
  color: ${props => props.color};
  text-transform: uppercase;
  display: flex;
  align-items: center;
  margin-right: 10%;
`

const PostMultiplier = styled.div`
  width: ${props => vhToPx(6.2)};
  height: ${props => vhToPx(6.2)};
  border-radius: ${props => vhToPx(6.2)};
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    content: '${props => props.multiplier}x';
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background-color: ${props => props.backgroundColor};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: pamainregular;
    font-size: ${props => vhToPx(2.8)};
    color: ${props => props.color};
    text-transform: uppercase;
  }

`

const PrePoints = styled.div`
  width: 46%;
  font-family: pamainregular;
  font-size: ${props => vhToPx(2.4)};
  color: ${props => props.color};
  text-transform: uppercase;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10%;
`

const PlayItemTotalChoicesWrapper = styled.div`
  width: 30%;
  margin-right: 5%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const PlayItemsPointsWrapper = styled.div`
  width: 30%;
  margin-right: 4%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const PointsContainer = styled.div``
const PointsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const PointsNumber = styled.span`
  font-family: pamainregular;
  font-size: ${props => vhToPx(3.6)};
  color: #ffffff;

  display: flex;
  align-items: flex-end;
  line-height: 0.8;
`
const PointsLabel = styled.span`
  font-family: pamainlight;
  font-size: ${props => vhToPx(2.5)};
  color: #18c5ff;

  display: flex;
  align-items: flex-end;
  line-height: 0.9;
`

@observer
class PlayItemPoints extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      totalPoints: 0,
    })
  }

  componentDidMount() {
    let pts = this.props.item.multiplier * this.props.item.prePoints
    this.totalPoints = pts > 200 ? pts - 200 : 0
    let check = setInterval(() => {
      this.totalPoints++
      if (this.totalPoints >= pts) {
        clearInterval(check)
      }
    }, 0)
  }

  render() {
    return (
      <PointsContainer>
        <PointsWrapper>
          <PointsNumber>{this.totalPoints}</PointsNumber>
          <PointsLabel>PTS</PointsLabel>
        </PointsWrapper>
      </PointsContainer>
    )
  }
}

const PlayItemTokens = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainregular;
  font-size: ${props => vhToPx(3.6)};
  color: #ffb600;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &:after {
    content: '';
    width: ${props => vhToPx(2.8)};
    height: ${props => vhToPx(2.8)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: contain;
    margin-left: ${props => vhToPx(0.5)};
  }
  animation: ${props => tokenScale} 0.2s forwards;
`
const tokenScale = keyframes`
  0%{
    transform: scale(1);
  }
  50%{
    transform: scale(1.1);
  }
  100%{
    transform: scale(1);
  }
`

const TotalCommonWrapper = styled.div``

const Star = styled.div`
  width: ${props => vhToPx(7)};
  height: ${props => vhToPx(7)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StarText = styled.div`
  font-family: pamainbold;
  font-size: ${props => vhToPx(4.3)};
  color: #231f20;
  margin-top: ${props => vhToPx(1)};
`

const TextWrapper = styled.div`
  display: flex;
  ${props => (props.center ? `justify-content: center;` : ``)};
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
  ${props =>
    props.letterSpacing ? `letter-spacing:${props.letterSpacing};` : ``}
`

const Line = styled.div`
  width: 100%;
  height: ${props => vhToPx(0.1)};
  background-color: #ffffff;
`

const Plays = [
  {
    text: 'pre-picks',
    multiplier: 0,
    backgroundColor: '#0fbc1c',
    innerBackgroundColor: '#ffffff',
    prePoints: 1000,
    isMultiplier: true,
    keyword: 'prepicks',
  },
  {
    text: 'live plays',
    multiplier: 0,
    backgroundColor: '#c61818',
    innerBackgroundColor: '#ffffff',
    prePoints: 1000,
    isMultiplier: true,
    keyword: 'liveplay',
  },
  {
    text: 'gamemaster plays',
    multiplier: 0,
    backgroundColor: '#00aad8',
    innerBackgroundColor: '#ffffff',
    prePoints: 1000,
    isMultiplier: true,
    keyword: 'gamemaster',
  },
  {
    text: 'sponsor plays',
    multiplier: 0,
    backgroundColor: '#3533a8',
    innerBackgroundColor: '#ffffff',
    prePoints: 1000,
    isMultiplier: true,
    keyword: 'sponsor',
  },
  {
    text: 'prize plays',
    multiplier: 0,
    backgroundColor: '#9368AA',
    innerBackgroundColor: '#ffffff',
    prePoints: 1000,
    isMultiplier: true,
    keyword: 'prize',
  },
  {
    text: 'stars',
    multiplier: 0,
    backgroundColor: '#efdf18',
    innerBackgroundColor: '#ffffff',
    prePoints: 1000,
    isMultiplier: true,
    keyword: 'stars',
  },
]
