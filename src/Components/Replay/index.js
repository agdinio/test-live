import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import background from '@/assets/images/playalong-begin.jpg'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import { vhToPx } from '@/utils'

@inject(
  'PrePickStore',
  'NavigationStore',
  'ProfileStore',
  'CommonStore',
  'StarBoardStore',
  'LiveGameStore',
  'ResolveStore'
)
@observer
export default class Replay extends Component {
  constructor(props) {
    super(props)
    this.props.PrePickStore.pullTeams()
    this.props.ProfileStore.getProfile()
  }

  handlePlayAgainClick() {
    this.props.LiveGameStore.resetVars()
    this.props.StarBoardStore.setSelectedStar(null)
    this.props.ResolveStore.setResolveThrough(0)
    this.props.NavigationStore.resetBypassActiveMenu()
    this.props.PrePickStore.resetVars()

    setTimeout(() => {
      this.props.NavigationStore.setCurrentView('/prepick')
    }, 500)
  }

  render() {
    let { teams } = this.props.PrePickStore

    if (
      !this.props.PrePickStore.isLoading &&
      !this.props.ProfileStore.isLoading
    ) {
      return (
        <Container>
          <Background />
          <FadeIn>
            <Section marginTop={7} marginBottom={7}>
              <TextWrapper>
                <Text font={'pamainlight'} size={5} color={'white'} uppercase>
                  play again
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text
                  font={'pamainbold'}
                  size={5}
                  color={'white'}
                  letterSpacing={0.1}
                  uppercase
                >
                  show your friends
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text font={'pamainlight'} size={3.7} color={'white'} uppercase>
                  collect more&nbsp;
                </Text>
                <Text
                  font={'pamainbold'}
                  size={3.7}
                  color={'#efdf18'}
                  uppercase
                >
                  stars
                </Text>
              </TextWrapper>
            </Section>

            <Section>
              <TextWrapper>
                <Text font={'pamainlight'} size={6.5} color={'white'} uppercase>
                  and share your&nbsp;
                </Text>
                <Text
                  font={'pamainbold'}
                  size={6.5}
                  color={'#19d1be'}
                  uppercase
                >
                  key
                </Text>
              </TextWrapper>
            </Section>

            <Section marginTop={7} marginBottom={7}>
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
            </Section>

            <Section>
              <PlayAgainButton onClick={this.handlePlayAgainClick.bind(this)}>
                <TextWrapper>
                  <Text font={'pamainbold'} size={4} uppercase>
                    play again
                  </Text>
                </TextWrapper>
                <Arrow src={ArrowIcon} />
              </PlayAgainButton>
            </Section>

            <Footer>{this.props.CommonStore.getAppVersion()}</Footer>
          </FadeIn>
        </Container>
      )
    } else {
      return (
        <Container>
          <Background />
        </Container>
      )
    }
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const Background = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  background-image: url(${background});
  background-size: cover;
  background-repeat: no-repeat;
  -webkit-filter: grayscale(0.8);
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  position: absolute;
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  opacity: 0;
  animation: 0.5s ${props => fadeIn} forwards;
  display: flex;
  flex-direction: column;
`

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity:1;
  }
`

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
  ${props => (props.height ? `height: ${props.height}%` : ``)};
`

const TextWrapper = styled.div`
  text-align: center;
  line-height: 1;
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => vhToPx(props.size || 3)};
  color: ${props => props.color || 'white'};
  ${props => (props.uppercase ? 'text-transform:uppercase;' : '')}
  letter-spacing: ${props => vhToPx(props.letterSpacing || 0)};
`

const TeamWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
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

const Footer = styled.div`
  font-family: pamainlight;
  font-size: ${props => vhToPx(1.5)};
  letter-spacing: ${props => vhToPx(0.1)};
  color: #ffffff;
  width: 100%;
  justify-content: center;
  display: flex;
  position: absolute;
  bottom: 5%;
  z-index: 2;
`

const PlayAgainButton = styled.div`
  width: 40%;
  height: ${props => vhToPx(9)};
  border-radius: ${props => vhToPx(0.5)};
  background-color: #17c5ff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Arrow = styled.img`
  height: ${props => vhToPx(3.3)};
  margin-left: ${props => vhToPx(2)};
`
