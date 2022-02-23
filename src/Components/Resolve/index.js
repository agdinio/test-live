import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax, Back } from 'gsap'
import bgDefault from '@/assets/images/playalong-default.jpg'
import { vhToPx } from '@/utils'
import StatusPanel from '@/Components/LiveGame/StatusPanel/StatusPanel'
import Gathering from './Gathering'
import PostGame from './PostGame'
import LoginFirst from '@/Components/Common/LoginFirst'

@inject('PrePickStore', 'LiveGameStore', 'ProfileStore', 'ResolveStore')
@observer
export default class Resolve extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      isLoading: true,
      isStarted: false,
    })
  }

  componentWillMount() {
    this.props.LiveGameStore.gamePost()
    //this.props.PrePickStore.setPointsTemp(1000)
    //this.props.PrePickStore.setTokensTemp(200)
    this.props.PrePickStore.pullData()
    this.props.LiveGameStore.getTotals()

    if (!this.props.ProfileStore.profile.userName) {
      this.props.ProfileStore.getProfile()
    }

    /*
    if (
      this.props.PrePickStore.answers &&
      this.props.PrePickStore.answers.length < 1
    ) {
      this.props.PrePickStore.pullPreAnswers()
    }
*/
  }

  componentDidMount() {
    this.props.ResolveStore.setLockMenu(true)
    setTimeout(() => {
      this.isLoading = false
      this.isStarted = true
    }, 2000)
  }

  handleIsLoggedIn(response) {
    if (response) {
      setTimeout(() => {
        this.props.LiveGameStore.gamePost()
        this.props.PrePickStore.pullData()
        this.props.LiveGameStore.getTotals()

        if (!this.props.ProfileStore.profile.userName) {
          this.props.ProfileStore.getProfile()
        }
      }, 1000)
    }
  }

  render() {
    debugger
    let { questions, preAnswers, prePickAnswers } = this.props.PrePickStore

    if (this.props.ProfileStore.err) {
      return (
        <Container bg={bgDefault}>
          <LoginFirst handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
        </Container>
      )
    }

    if (
      (this.props.PrePickStore.isLoading ||
        this.props.LiveGameStore.isLoading ||
        (this.props.ProfileStore.isLoading && !this.props.ProfileStore.err)) &&
      !this.isStarted
    ) {
      return (
        <Container bg={bgDefault}>
          <StatusPanelWrapper>
            <StatusPanel />
          </StatusPanelWrapper>
        </Container>
      )
    }

    return (
      <Container bg={bgDefault}>
        <StatusPanelWrapper>
          <StatusPanel />
        </StatusPanelWrapper>

        <Content>
          <Gathering isLoading={this.isLoading} />
          <PostGame
            isLoading={this.isLoading}
            questions={questions}
            preAnswers={prePickAnswers}
            toGameState={this.props.toGameState}
          />
        </Content>
      </Container>
    )
  }
}

const First = styled.div`
  width: 100%;
  height: 50%;

  display: flex;
  position: absolute;
  background: rgba(5, 102, 5, 0.3);
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: column;
`

const StatusPanelWrapper = styled.div`
  width: 100%;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  border-top: ${props => vhToPx(0.5)} solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
`
