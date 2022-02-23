import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled from 'styled-components'
import Button from '@/Components/Button'
import { PACircle } from '@/Components/PACircle/index'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('LiveGameStore', 'PrePickStore', 'NavigationStore')
@observer
export default class GetReady extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: this.props.timer,
      check: undefined,
    })

    this.props.LiveGameStore.resetCurrentLivePlayCount()
    this.props.LiveGameStore.resetCurrentStarCount()

    intercept(this.props.LiveGameStore, 'proceedToVideoScreen', change => {
      if (change.newValue) {
        clearInterval(this.check)
        let ref = document.getElementById('livegame-getreadycontent')
        TweenMax.to(ref, 0.5, {
          y: '100%',
          onComplete: () => {
            this.props.answered()
            this.props.proceedToVideoScreen()
          },
        })
      }
      return change
    })
  }

  componentWillUnmount() {
    clearInterval(this.check)
  }

  componentDidMount() {
    this.props.LiveGameStore.setGetReadyDone(true)
    new TimelineMax({ repeat: 0 })
      .set(this.refContainer, { y: '-100%' })
      .to(this.refContainer, 0.5, {
        y: '0%',
        onComplete: () => {
          this.countdown()
        },
      })
  }

  countdown() {
    this.check = setInterval(() => {
      if (this.timer) {
        this.timer = this.timer - 1
      }

      if (!this.timer) {
        setTimeout(() => {
          this.timeIsUp()
        }, 500)
      }
    }, 1000)
  }

  timeIsUp() {
    clearInterval(this.check)
    TweenMax.to(this.refContainer, 0.5, {
      y: '100%',
      onComplete: () => {
        // this.props.isTimeUp(true)
        // this.props.proceedToVideoScreen()
        if (!this.props.LiveGameStore.proceedToVideoScreen) {
          this.props.LiveGameStore.setProceedToVideoScreen(true)
        }
      },
    })
  }

  handleButtonClick() {
    /*
    clearInterval(this.check)
    TweenMax.to(this.refContainer, 0.5, {
      y: '100%',
      onComplete: () => {
        this.props.answered()
        this.props.proceedToVideoScreen()
      },
    })
*/
    if (!this.props.LiveGameStore.proceedToVideoScreen) {
      this.props.LiveGameStore.setProceedToVideoScreen(true)
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props.gotoKickOff) {
      clearInterval(this.check)
      TweenMax.to(this.refContainer, 0.5, {
        y: '100%',
        onComplete: () => {
          this.props.answered()
          this.props.proceedToVideoScreen()
        },
      })
    }
  }

  render() {
    return (
      <Content
        innerRef={c => (this.refContainer = c)}
        id="livegame-getreadycontent"
      >
        <Wrapper>
          <ContentTop>START LIVE GAME</ContentTop>
          <ContentMiddle>GET READY!</ContentMiddle>
          <ContentPA>
            <PACircle value={true} size={9}>
              {this.timer}s
            </PACircle>
          </ContentPA>
          <ContentBottom>PRESS TO</ContentBottom>
          <ButtonWrapper>
            <Button
              text={'BEGIN LIVE PLAY'}
              handleButtonClick={this.handleButtonClick.bind(this)}
            />
          </ButtonWrapper>
        </Wrapper>
      </Content>
    )
  }
}

const ButtonWrapper = styled.div`
  width: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Content = styled.div`
  width: 100%;
  height: 100%;
  //background-color: #06b7ff;
  background-color: #18c5ff;
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
`
const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ContentTop = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4.5)};
  color: #ffffff;
  line-height: 1;
`
const ContentMiddle = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(5.5)};
  color: #ffffff;
  line-height: 1;
`
const ContentBottom = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4.5)};
  color: #ffffff;
  line-height: 1;
  margin-bottom: ${props => vhToPx(1)};
`
const ContentPA = styled.div`
  margin-top: ${props => vhToPx(1.8)};
  margin-bottom: ${props => vhToPx(1.8)};
`
