import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import GlowingButton from '@/Components/Button'

@observer
class SocialRankingFooter extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      rank: 0.84,
      change: false,
      points: 10000,
    })
  }

  componentWillReceiveProps(np, op) {
    if (!op.global && np.global) {
      this.timeout = setTimeout(() => {
        this.change = true
        this.rank = 0.95
        this.points = 15000
      }, 700)
    } else if (op.global !== np.global) {
      this.change = false
      this.rank = 0.84
      this.points = 10000
    }
  }

  componentDidUnMount() {
    clearTimeout(this.timeout)
  }

  render() {
    return (
      <Footer global={this.props.global}>
        <TopContainer>
          <TopText center={this.change}>
            {this.change
              ? `You Ranked top ${(
                  (1 - this.props.me.globalRank) *
                  100
                ).toFixed()}% this game`
              : ` You Ranked top ${100 - this.rank * 100}%`}
          </TopText>

          {this.change ? null : (
            <TopPoints>
              + {this.points}
              <BlueTextSmall>PTS</BlueTextSmall>
            </TopPoints>
          )}
        </TopContainer>
        <BottomContainer>
          <GlowingButton
            handleButtonClick={this.props.continueClick}
            marginLeftBtnIcon={3}
          />
        </BottomContainer>
      </Footer>
    )
  }
}

export default SocialRankingFooter
const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`
const TopText = styled.div`
  text-transform: uppercase;
  color: rgb(0, 180, 255);
  font-size: 3vh;
  letter-spacing: 2px;
  ${props =>
    props.center ? 'text-align:center;width:100%' : 'margin-left: 20px;'};
`

const TopPoints = styled.div`
  margin-right: 20px;
  font-size: 3vh;
`

const BlueText = styled.span`
  color: #00b4ff;
`

const BlueTextSmall = BlueText.extend`
  font-size: 0.7em;
`

const flyOut = keyframes`
  0%{
    bottom: 0px;
  }
  50%{
    bottom: -300px;
  }
  100%{
    bottom: 0px;
  }
`

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const BottomContainer = styled.div`
  transform: scale(0.9);
  text-align: center;
`

const Footer = styled.div`
  z-index: 20;
  animation: 2s ${fadeIn} forwards;
  max-width: 69vh;
  width: 100%;
  font-family: pamainregular;
  margin-top: 10px;
  padding-top: 10px;
  position: fixed;
  bottom: 0px;
  color: white;
  padding-top: 100px;
  background: linear-gradient(transparent, black 40%);
  ${props => (props.global ? `animation: 1.25s ${flyOut} forwards` : '')};
`
