import React, { PureComponent } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { withRouter } from 'react-router-dom'
import BackgroundDefault from '@/assets/images/playalong-default.jpg'
import background from '@/assets/images/playalong-begin.jpg'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
//import Button from '@/Components/Button/GlowingButton'
import Button from '@/Components/Button'
import { BaseContainer } from '@/Containers/Placeholder'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import { vhToPx, maxHeight } from '@/utils'

@inject('PrePickStore', 'NavigationStore')
@observer
export default class PreBegin extends PureComponent {
  constructor(props) {
    super(props)
    this.props.PrePickStore.pullData()
  }

  goToPrePick() {
    this.props.NavigationStore.setCurrentView('/prepick')
  }

  render() {
    let { teams, isLoading } = this.props.PrePickStore
    if (!isLoading) {
      return (
        <Wrapper>
          <Content />
          <LogoWrapper top={7}>
            <LogoImg
              src={sportocoLogo}
              width={25}
              alt="sportoco logo"
              top={7}
            />
            <LogoImg
              src={playalongLogo}
              width={45}
              alt="playalong logo"
              top={12}
            />
          </LogoWrapper>
          <ContentWrapper>
            <TextWrapper>
              <TextTop>FOOTBALL EXPERIENCE</TextTop>
              <TextMiddle>
                <White>BEGIN YOUR</White>
                &nbsp;
                <Green>PRE-PICKS</Green>
              </TextMiddle>
              <TextBottom>PLAYOFF GAME</TextBottom>
            </TextWrapper>

            <TeamWrapper>
              <TLeft>
                <Team teamInfo={teams[0]} size={5} abbrSize={3} />
              </TLeft>
              <TMiddle>
                <TMNameOne>{teams[0].teamName}</TMNameOne>
                <TMVs>VS</TMVs>
                <TMNameTwo>{teams[1].teamName}</TMNameTwo>
              </TMiddle>
              <TRight>
                <Team teamInfo={teams[1]} size={5} abbrSize={3} />
              </TRight>
            </TeamWrapper>

            <ButtonWrapper>
              <Button
                handleButtonClick={this.goToPrePick.bind(this)}
                text={'START'}
                padding={{ left: 5, right: 5 }}
              />
            </ButtonWrapper>
          </ContentWrapper>
          <Footer>Ambassador Demo 1.0v</Footer>
        </Wrapper>
      )
    } else {
      return (
        <Wrapper>
          <Content />
        </Wrapper>
      )
    }
  }
}
const Content = styled.div`
  background-image: url(${props => props.background || background});
  background-size: cover;
  position: absolute;
  width: inherit;
  height: inherit;
  -webkit-filter: grayscale(0.8);
  animation: 1.5s ${props => fadeIn} forwards;
  opacity: 0;
  z-index: 1;
`
const Wrapper = styled.div`
  background-image: url(${BackgroundDefault});
  background-size: cover;
  width: 100%;
  height: ${props => maxHeight};
  font-family: pamainregular;
  position: absolute;
`
const LogoWrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.top}%;
  z-index: 2;
`

const LogoImg = styled.img`
  width: ${props => props.width}%;
  margin-bottom: ${props => vhToPx(2)};
  max-width: ${props => props.width / 0.2}px;
`

const ContentWrapper = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
`
const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
`
const TextTop = styled.span`
  font-family: pamainlight;
  font-size: ${props => vhToPx(5)};
  color: #ffffff;
  height: ${props => vhToPx(4.5)};
  text-transform: uppercase;
`
const TextMiddle = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => vhToPx(4.6)};
  text-transform: uppercase;
`
const TextBottom = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => vhToPx(3.5)};
  color: #17c5ff;
  text-transform: uppercase;
`
const White = styled.span`
  color: #ffffff;
`
const Green = styled.span`
  color: #0fbc1c;
`

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity:1;
  }
`

const TeamWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10%;
  animation: 1.5s ${props => fadeIn} forwards;
  animation-delay: 1s;
  opacity: 0;
`

const TLeft = styled.div`
  align-self: flex-start;
`
const TMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  height: ${props => vhToPx(20)};
  padding: 0 ${props => vhToPx(3)} 0 ${props => vhToPx(3)};
`
const TMNameOne = styled.div`
  font-family: pamainbold;
  font-size: ${props => vhToPx(5.5)};
  color: #ffffff;
  line-height: ${props => vhToPx(5.5)};
`
const TMVs = styled.div`
  font-family: pamainlight;
  font-size: ${props => vhToPx(6.5)};
  color: #ffffff;
`
const TMNameTwo = styled.div`
  font-family: pamainbold;
  font-size: ${props => vhToPx(5.5)};
  color: #ffffff;
  line-height: ${props => vhToPx(5.5)};
`

const TRight = styled.div`
  align-self: flex-end;
`

const ButtonWrapper = styled.div`
  width: 45%;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;

  animation: 1.5s ${props => fadeIn} forwards;
  animation-delay: 1s;
  opacity: 0;
`

const Footer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  position: absolute;
  bottom: 5%;
  font-size: ${props => vhToPx(1.5)};
  color: white;
  z-index: 2;
`
