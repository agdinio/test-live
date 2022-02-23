import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import token from '@/assets/images/playalong-token.svg'
import { vhToPx, responsiveDimension } from '@/utils'
import { TweenMax } from 'gsap'
import agent from '@/Agent'

@inject('PrePickStore', 'ProfileStore')
@observer
export default class PicksPointsTokens extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      animSpeed: 0.3,
    })
  }

  animFallingCoins() {
    if (!this.CoinsContainer) {
      return
    }
    ReactDOM.unmountComponentAtNode(this.CoinsContainer)
    let coins = []
    let density = Math.floor(Math.random() * (6 - 5) + 5)

    for (let i = 0; i < density; i++) {
      let delayThis = Math.floor(Math.random() * (600 - 200) + 200)
      let min = 42,
        max = 52
      let randomPos = Math.floor(Math.random() * (max - min) + min) + 35

      coins.push(
        <Coin
          src={token}
          key={`coin-${i}`}
          left={randomPos}
          delay={delayThis}
        />
      )
    }

    ReactDOM.render(coins, this.CoinsContainer)
  }

  animFallingPoints() {
    if (!this.PointsContainer) {
      return
    }

    ReactDOM.unmountComponentAtNode(this.PointsContainer)
    let point = (
      <Points scale={1.4} top={20}>
        {this.props.question.points}
      </Points>
    )
    ReactDOM.render(point, this.PointsContainer)
  }

  animFallingTokens() {
    if (!this.TokensContainer) {
      return
    }

    ReactDOM.unmountComponentAtNode(this.TokensContainer)
    let tokens = (
      <Tokens scale={1.4} top={20}>
        {this.props.question.tokens}
      </Tokens>
    )
    ReactDOM.render(tokens, this.TokensContainer)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isNotified) {
      this.prevTotalPoints = this.props.ProfileStore.profile.currencies[
        'points'
      ]
      this.prevTotalTokens = this.props.ProfileStore.profile.currencies[
        'tokens'
      ]
      this.animStart()
      this.animScaleBigTotalContainer()
    }
  }

  animStart() {
    setTimeout(() => {
      this.animFallingPoints()
      this.animFallingCoins()
    }, 0.1)

    setTimeout(() => {
      this.animFallingTokens()
    }, 300)
  }

  calculateTotalTokens() {
    TweenMax.to(this.token1, 1, {
      display: 'none',
      onComplete: this.evaluateTotalTokens.bind(this),
    })
  }

  animScaleBigTotalContainer() {
    TweenMax.to(this.refTotalContainer, this.animSpeed, {
      scale: 1.3,
      transformOrigin: 'right',
      onStart: this.evaluateTotalPoints.bind(this),
    })
  }

  evaluateTotalPoints() {
    let subtrahend =
      this.props.question.points <= 15 ? this.props.question.points : 15
    let currPts = this.prevTotalPoints + this.props.question.points
    let ctr = 0

    if (Math.floor(this.props.question.points / 15) === 0) {
      ctr = 1
      this.props.ProfileStore.profile.currencies['points'] =
        currPts - subtrahend
    } else {
      ctr = Math.floor(this.props.question.points / 15)
    }

    let check = setInterval(() => {
      this.props.ProfileStore.profile.currencies['points'] += ctr
      if (this.props.ProfileStore.profile.currencies['points'] >= currPts) {
        clearInterval(check)
        this.props.ProfileStore.profile.currencies['points'] = currPts
        this.creditPointsInServer()
      }
    }, 50)

    this.calculateTotalTokens()
  }

  evaluateTotalTokens() {
    let subtrahend =
      this.props.question.tokens <= 15 ? this.props.question.tokens : 15
    let currTks = this.prevTotalTokens + this.props.question.tokens
    let ctr = 0

    if (Math.floor(this.props.question.tokens / 15) === 0) {
      ctr = 1
      this.props.ProfileStore.profile.currencies['tokens'] =
        currTks - subtrahend
    } else {
      ctr = Math.floor(this.props.question.tokens / 15)
    }

    this.props.picksPointsTokensCallback(true)
    let check = setInterval(() => {
      this.props.ProfileStore.profile.currencies['tokens'] += ctr
      if (this.props.ProfileStore.profile.currencies['tokens'] >= currTks) {
        clearInterval(check)
        this.props.ProfileStore.profile.currencies['tokens'] = currTks
        this.creditTokensInServer()

        this.animScaleSmallTotalContainer()
      }
    }, 50)
  }

  animScaleSmallTotalContainer() {
    if (this.refTotalContainer) {
      TweenMax.to(this.refTotalContainer, this.animSpeed, {
        scale: 1,
        transformOrigin: 'right',
      })
    }
  }

  onShowAnswers() {
    if (
      this.props.ProfileStore.profile &&
      this.props.ProfileStore.profile.userId
    ) {
      console.log(
        'STORAGE: ',
        agent.Storage.getItem(this.props.ProfileStore.profile.userId)
      )
    }
    console.log(this.props.PrePickStore.answers)
  }

  creditPointsInServer() {
    this.props.ProfileStore.creditCurrencies({
      currency: 'points',
      amount: this.props.question.points,
    })
  }

  creditTokensInServer() {
    this.props.ProfileStore.creditCurrencies({
      currency: 'tokens',
      amount: this.props.question.tokens,
    })
  }

  componentDidMount() {}

  render() {
    let { totalPrePicks, currentPrePick, ProfileStore } = this.props
    let prepickLeft = totalPrePicks + 1 - currentPrePick
    let { profile } = ProfileStore

    return (
      <Container>
        <CoinsContainer innerRef={ref => (this.CoinsContainer = ref)} />
        <Token src={token} innerRef={c => (this.token1 = c)} />
        <PointsContainer innerRef={ref => (this.PointsContainer = ref)} />
        <TokensContainer innerRef={ref => (this.TokensContainer = ref)} />
        <BottomWrapper>
          <ContentWrapper>
            {prepickLeft ? (
              <PicksLeftWrapper>{prepickLeft}</PicksLeftWrapper>
            ) : null}
            <StaticPointsAndTokens
              // totalPoints={!isLoading && profile.currencies ? profile.currencies['points'] : 0}
              // totalTokens={!isLoading && profile.currencies ? profile.currencies['tokens'] : 0}
              totalPoints={profile.currencies['points']}
              totalTokens={profile.currencies['tokens']}
              handleClick={this.onShowAnswers.bind(this)}
              reference={c => (this.refTotalContainer = c)}
              refTotalPoints={c => (this.refTotalPoints = c)}
            />
          </ContentWrapper>
        </BottomWrapper>
      </Container>
    )
  }
}

@inject('ProfileStore')
@observer
export class PointsAndTokens extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      totalPoints: this.props.totalPoints,
      totalPointsCloned: this.props.totalPoints,
      totalTokens: this.props.totalTokens,
      totalTokensCloned: this.props.totalTokens,
      check: null,
    })

    this.runningTotal = 0
    this.runningPoints = 0
    this.runningTokens = 0

    /*
    intercept(this.props.ProfileStore, 'resolvePoints', change => {
      if (change.newValue > 0) {
        console.log('TOTAL POINTS', this.totalPoints)
        console.log('TOTAL POINTS CLONED', this.totalPointsCloned)
        clearInterval(this.check)

        this.runningTotal += change.newValue

        let finalPoints = (this.totalPointsCloned + this.runningTotal)
        let partialPoints = (finalPoints - 100) > 0 ? (finalPoints - 100) : finalPoints
        this.totalPoints = partialPoints

        this.check = setInterval(() => {
          if (this.totalPoints < finalPoints) {
            ++this.totalPoints
          } else {
            clearInterval(this.check)
          }
        }, 0)

      }
    })
*/
    intercept(this.props.ProfileStore, 'resolvePoints', change => {
      if (change.newValue) {
        clearInterval(this.check)

        this.runningTotal += change.newValue.bonusPoints

        let finalPoints = change.newValue.pointsCloned + this.runningTotal
        this.totalPoints =
          finalPoints - 100 > 0 ? finalPoints - 100 : finalPoints

        this.check = setInterval(() => {
          if (this.totalPoints < finalPoints) {
            ++this.totalPoints
          } else {
            clearInterval(this.check)
          }
        }, 0)
      }
      return change
    })

    intercept(this.props.ProfileStore, 'resolveWinStreak', change => {
      if (change.newValue) {
        this.resolveWinStreakPoints(change.newValue)
        this.resolveWinStreakTokens(change.newValue)
      }
      return change
    })
  }

  resolveWinStreakPoints(newValue) {
    clearInterval(this.checkP)

    this.runningPoints += newValue.points

    let finalPoints = newValue.points + this.runningPoints
    this.totalPoints = finalPoints - 100 > 0 ? finalPoints - 100 : finalPoints

    this.checkP = setInterval(() => {
      if (this.totalPoints < finalPoints) {
        ++this.totalPoints
      } else {
        clearInterval(this.checkP)
      }
    }, 0)
  }

  resolveWinStreakTokens(newValue) {
    clearInterval(this.checkT)

    this.runningTokens += newValue.tokens

    let finalTokens = newValue.tokens + this.runningTokens
    this.totalTokens = finalTokens - 100 > 0 ? finalTokens - 100 : finalTokens

    this.checkT = setInterval(() => {
      if (this.totalTokens < finalTokens) {
        ++this.totalTokens
      } else {
        clearInterval(this.checkT)
      }
    }, 0)
  }

  componentDidUpdate(nextProps) {
    if (this.props.updated) {
      this.totalPoints = this.props.ProfileStore.profile.currencies['points']
      this.totalTokens = this.props.ProfileStore.profile.currencies['tokens']
      this.totalPointsCloned = this.props.ProfileStore.profile.currencies[
        'points'
      ]
      this.totalTokensCloned = this.props.ProfileStore.profile.currencies[
        'tokens'
      ]
    }
  }

  render() {
    let { reference, handleClick } = this.props
    return (
      <TotalWrapper innerRef={reference}>
        <TotalPointsWrapper>
          <TotalPointsValue>{Math.floor(this.totalPoints)}</TotalPointsValue>
          <TotalPointsLabel onClick={handleClick} />
        </TotalPointsWrapper>
        <TotalTokenWrapper>
          <TotalTokensValue>{Math.floor(this.totalTokens)}</TotalTokensValue>
          <TotalToken src={token} />
        </TotalTokenWrapper>
      </TotalWrapper>
    )
  }
}

export const StaticPointsAndTokens = props => {
  return (
    <TotalWrapper innerRef={props.reference}>
      <TotalPointsWrapper>
        <TotalPointsValue innerRef={props.refTotalPoints}>
          {Math.floor(props.totalPoints)}
        </TotalPointsValue>

        <TotalPointsLabel onClick={props.handleClick} />
      </TotalPointsWrapper>
      <TotalTokenWrapper>
        <TotalTokensValue>{Math.floor(props.totalTokens)}</TotalTokensValue>
        <TotalToken src={token} />
      </TotalTokenWrapper>
    </TotalWrapper>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const BottomWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`
const ContentWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: ${props => vhToPx(1.5)};
`
const PicksLeftWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.4)};
  color: #2fc12f;
  margin-bottom: ${props => vhToPx(7)};

  &:after {
    content: 'PICKS LEFT';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(3.3)};
    padding-left: ${props => responsiveDimension(0.6)};
  }
`
const TotalWrapper = styled.div`
  width: 100%;
`
const TotalPointsWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  line-height: ${props => responsiveDimension(4)};
`
const TotalTokenWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const Token = styled.img`
  position: absolute;
  z-index: 1;
  display: none;
  width: ${props => responsiveDimension(4)};
`
const TotalPointsValue = styled.span`
  font-family: pamainextrabold;
  color: #ffffff;
  font-size: ${props => responsiveDimension(5)};
  margin-right: ${props => responsiveDimension(1)};
  z-index: 1; //put, for History Pending on LiveGame
`
const TotalPointsLabel = styled.span`
  font-family: pamainlight;
  color: #18c5ff;
  font-size: ${props => responsiveDimension(3.1)};
  z-index: 1; //put, for History Pending on LiveGame
  &:before {
    content: 'PTS';
  }
`

const TotalTokensValue = styled.span`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.8)};
  color: #ffb600;
  padding-right: ${props => responsiveDimension(1.5)};
  z-index: 1; //put, for History Pending on LiveGame
`
const TotalToken = styled.img`
  width: ${props => responsiveDimension(2.9)};
  z-index: 1; //put, for History Pending on LiveGame
`

const CoinsContainer = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
`
const CoinsContainerEnd = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
`
const Coin = styled.div`
  width: 5%;
  height: 5%;
  position: relative;
  background: url(${props => props.src}) no-repeat center;
  background-size: contain;
  top: 10%;
  left: ${props => props.left}%;
  z-index: 100;
  transform: scale(1), rotate(0deg);
  animation: ${props => coinFall} forwards 0.9s
    cubic-bezier(0.6, -0.28, 0.735, 0.045);
  animation-delay: ${props => props.delay}ms;
  opacity: 0;
  &:nth-of-type(1) {
    transform: rotate(30deg);
    margin-left: 3%;
  }
  &:nth-of-type(2) {
    transform: rotate(-30deg);
    margin-left: -3%;
  }
  &:nth-of-type(3) {
    transform: rotate(-10deg);
    margin-left: 4%;
  }
  &:nth-of-type(4) {
    transform: rotate(-20deg);
    margin-left: 2%;
  }
  &:nth-of-type(5) {
    transform: rotate(30deg);
    margin-left: -2%;
  }
`

const coinFall = keyframes`
  0% {opacity:0;}
  20% {opacity:1;transform:scale(1.2);}
  50%{transform:scale(1.5);opacity: 0.8;}
  70% {
    transform:scale(0.8);
  }
  100% {
    margin-left:0;
    opacity:0;
    top:90%;
    left:85%;
    transform:scale(5),rotate(0deg);
  }
`
const pointFall = keyframes`
  0% {opacity:0;}
  20% {opacity:1;transform:scale(1.4);}
  100%{
    transform:scale(1);
    top:80%;
    opacity: 0;
  }
`
const PointsContainer = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: flex-end;
`
const Points = styled.div`
  color: #fff;
  font-size: ${props => responsiveDimension(5.7)};
  font-family: pamainbold;
  &:after {
    content: 'PTS';
    color: #18c5ff;
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(5.3)};
    margin-left: ${props => responsiveDimension(0.5)};
    display: inline-block;
  }

  position: absolute;
  top: ${props => props.top}%;
  right: ${props => responsiveDimension(3)};
  animation: ${props => pointFall} forwards 0.5s
    cubic-bezier(0.6, -0.28, 0.735, 0.045);
  animation-delay: 0.2s;
`
const TokensContainer = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: flex-end;
`
const Tokens = styled.div`
  color: #fff;
  font-size: ${props => responsiveDimension(5.6)};
  font-family: pamainbold;
  color: #ffb600;
  &:before {
    content: '+';
    font-size: ${props => responsiveDimension(5)};
    margin-left: ${props => responsiveDimension(0.5)};
    display: inline-block;
  }
  position: absolute;
  top: ${props => props.top}%;
  right: ${responsiveDimension(12)};
  animation: ${props => pointFall} forwards 0.9s
    cubic-bezier(0.6, -0.28, 0.735, 0.045);
`

PicksPointsTokens.propTypes = {
  // question: PropTypes.object.isRequired,
  isNotified: PropTypes.bool.isRequired,
  picksPointsTokensCallback: PropTypes.func.isRequired,
}
