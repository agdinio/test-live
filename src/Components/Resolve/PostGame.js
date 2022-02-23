import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Back, Linear } from 'gsap'
import styled, { keyframes } from 'styled-components'
import { vhToPx } from '@/utils'
import { PointsAndTokens } from '@/Components/PrePick/PicksPointsTokens'
import WinStreak from './WinStreak'
import PostPre from './PostPre'
import PostPlay from './PostPlay'

@inject('PrePickStore', 'ProfileStore')
@observer
export default class PostGame extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      screen: null,
      show: false,
      showIntro: false,
      showPostPre: false,
      showPostPlay: false,
      showWinstreak: false,
      isStartedPostGame: false,
    })
  }

  notifyShow(response) {
    switch (response) {
      case 'postplay':
        this.showPostPre = false
        this.showPostPlay = true
        TweenMax.to(this.PostPre, 0.3, { opacity: 0 })
        break
      case 'winstreak':
        this.showPostPlay = false
        this.showWinstreak = true
        TweenMax.to(this.refContent, 0.75, { top: '-15%' })
        TweenMax.to(this.refNextContent, 0.75, { top: '0%' })
        TweenMax.to(this.refPostPlayFooter, 0.3, { opacity: 0 })
        break
    }
  }

  toggleIntro() {
    TweenMax.to(this.Intro, 0.3, {
      opacity: 0,
      delay: 3,
      onComplete: () => {
        this.showPostPre = true
      },
    })
  }

  toggleIntro_() {
    this.showIntro = true
    setTimeout(() => {
      this.showIntro = false
      this.showPostPre = true
    }, 3000)
  }

  componentDidUpdate() {
    if (!this.props.isLoading && !this.isStartedPostGame) {
      this.isStartedPostGame = true
      this.toggleIntro()

      // this.showWinstreak = true
      // TweenMax.to(this.refContent, 0.5, {top: '-15%'})
      // TweenMax.to(this.refNextContent, 0.5, {top: '0%'})
    }
  }

  componentWillReceiveProps_(nextProps) {
    if (!nextProps.isLoading && !this.isStartedPostGame) {
      this.isStartedPostGame = true
      console.log('ABAC')
      this.toggleIntro()

      // this.showWinstreak = true
      // TweenMax.to(this.refContent, 0.5, {top: '-15%'})
      // TweenMax.to(this.refNextContent, 0.5, {top: '0%'})
    }
  }

  render() {
    debugger
    let { isLoading, questions, preAnswers } = this.props
    //RELLY
    let sessionCurrencies = null
    try {
      sessionCurrencies = sessionStorage.getItem('CURRENCIES')
    } catch (e) {}
    let stokens = 0,
      spoints = 0
    if (sessionCurrencies) {
      //let obj = JSON.parse(sessionCurrencies.obj)
      //   stokens = obj.tokens
      //   spoints = obj.points
    }

    if (!isLoading) {
      return (
        <Container>
          <Content
            hasLoaded={!this.props.isLoading}
            innerRef={c => (this.refContent = c)}
          >
            <HeaderOuter>
              <Header hasLoaded={!this.props.isLoading}>
                <HeaderLeft>
                  <TextWrapper>
                    <Text
                      font={'pamainbold'}
                      size={2.5}
                      lineHeight={1.1}
                      letterSpacing={vhToPx(0.2)}
                      uppercase
                    >
                      winnings
                    </Text>
                  </TextWrapper>
                </HeaderLeft>
                <HeaderRight>
                  <PointsAndTokens
                    //totalPoints={this.props.PrePickStore.totalPoints}
                    //totalTokens={this.props.PrePickStore.totalTokens}
                    totalPoints={
                      spoints ||
                      this.props.ProfileStore.profile.currencies['points']
                    }
                    totalTokens={
                      stokens ||
                      this.props.ProfileStore.profile.currencies['tokens']
                    }
                  />
                </HeaderRight>
              </Header>
              <Line hasLoaded={!this.props.isLoading} />
            </HeaderOuter>
            <Body>
              <Intro
                show={this.showIntro}
                reference={ref => (this.Intro = ref)}
              />
              <PostPre
                show={this.showPostPre}
                questions={questions}
                preAnswers={preAnswers}
                handleNotifyShow={this.notifyShow.bind(this)}
                reference={ref => (this.PostPre = ref)}
              />
              <PostPlay
                show={this.showPostPlay}
                handleNotifyShow={this.notifyShow.bind(this)}
                refPostPlayFooter={c => (this.refPostPlayFooter = c)}
                preAnswers={preAnswers}
              />
            </Body>
          </Content>

          <NextContent innerRef={c => (this.refNextContent = c)}>
            <WinStreak
              show={this.showWinstreak}
              toGameState={this.props.toGameState}
            />
          </NextContent>
        </Container>
      )
    } else {
      return null
    }
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  position: absolute;
`
const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  top: 85%;
  position: absolute;
  animation: ${props => slideLeft} 0.5s forwards
    ${props => (props.hasLoaded ? `, ${slideUp} 0.75s forwards` : '')};
`

const NextContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  top: 100%;
`

const slideLeft = keyframes`
  0%{
    transform: translateX(100%);
  }
  100%{
    transform: translateX(0%);
  }
`
const slideUp = keyframes`
  0%{
    transform: translateY(0%);
  }
  100%{
    transform: translateY(-85%);
  }
`

const HeaderOuter = styled.div`
  width: 100%;
  height: 16%;
  display: flex;
  flex-direction: column;
  padding: 0 5% 0 5%;
`

const Header = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
/*
  ${props =>
    props.hasLoaded ? `border-bottom: ${vhToPx(0.1)} solid #ffffff` : ``};
  }
*/
`

const Line = styled.div`
  width: 100%;
  height: ${props => vhToPx(0.1)};
  background-color: #ffffff;
`

const HeaderLeft = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const HeaderRight = styled.div`
  width: 100%;
  height: inherit;
  display: flex;
  align-items: center;
  margin-top: ${props => vhToPx(1)};
`
const PointsAndTokensWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(66, 134, 244, 0.5);
  display: flex;
  position: absolute;
`

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
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

const Intro = props => {
  return (
    <IntroContainer show={props.show} innerRef={props.reference}>
      <TextWrapper center>
        <Text font={'pamainextrabold'} size={10} color={'#2fc12f'} uppercase>
          pre-pick
        </Text>
      </TextWrapper>
      <TextWrapper center>
        <Text font={'pamainextrabold'} size={10} color={'#2fc12f'} uppercase>
          results
        </Text>
      </TextWrapper>
    </IntroContainer>
  )
}

const IntroContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 20%;
/*
  ${props =>
    props.show ? `opacity: 1` : `animation: ${fadeOut} 0.3s forwards`};
*/
  position: absolute;
`
const fadeOut = keyframes`
  0%{opacity: 1;}
  100%{opacity: 0;}
`
