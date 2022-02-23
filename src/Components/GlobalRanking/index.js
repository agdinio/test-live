import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Quad } from 'gsap'
import { vhToPx, hex2rgb, evalImage } from '@/utils'
import bgDefault from '@/assets/images/playalong-default.jpg'
import ContinueButton from '@/Components/Button'
import Item from './Item'

@inject('NavigationStore')
@observer
export default class GlobalRanking extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      onTheBoard: false,
      isLoading: false,
      scorers: [
        {
          name: 'or e-mail before @',
          id: 1,
          place: 1,
          points: 298000,
        },
        {
          name: 'or e-mail before @',
          id: 2,
          place: 2,
          points: 284245,
        },
        {
          name: 'or e-mail before @',
          id: 3,
          place: 3,
          points: 282900,
        },
        {
          name: 'or e-mail before @',
          isMe: true,
          id: 4,
          place: 4,
          points: 279215,
        },
        {
          name: 'or e-mail before @',
          id: 5,
          place: 5,
          points: 270020,
        },
        {
          name: 'or e-mail before @',
          id: 6,
          place: 6,
          points: 254121,
        },
        {
          name: 'or e-mail before @',
          id: 7,
          place: 7,
          points: 249143,
        },
        {
          name: 'or e-mail before @',
          id: 8,
          place: 8,
          points: 175099,
        },
        {
          name: 'or e-mail before @',
          id: 9,
          place: 9,
          points: 150043,
        },
        {
          name: 'or e-mail before @',
          id: 10,
          place: 10,
          points: 117200,
        },
      ],
    })
  }

  renderButton() {
    if (this.refContinueButton) {
      ReactDOM.unmountComponentAtNode(this.refContinueButton)
      let button = (
        <ContinueButton handleButtonClick={this.onClickContinue.bind(this)} />
      )
      ReactDOM.render(button, this.refContinueButton)
    }
  }

  onClickContinue() {
    this.props.NavigationStore.setCurrentView('/outro')
  }

  componentDidMount() {
    setTimeout(() => {
      this.renderButton()
    }, 0)
  }

  render() {
    let ctr = 0
    return (
      <Container bg={bgDefault}>
        <SlideLeft>
          <Header>
            <TextWrapper>
              <Text
                font={'pamainextrabold'}
                size={4.4}
                color={'#eedf17'}
                uppercase
              >
                ambassador&nbsp;
              </Text>
              <Text
                font={'pamainregular'}
                size={4.4}
                color={'#ffffff'}
                uppercase
              >
                top 10
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text
                font={'pamainextrabold'}
                size={3}
                color={'#ffffff'}
                uppercase
              >
                leaderboard
              </Text>
            </TextWrapper>
          </Header>

          <Content>
            <div
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            >
              {this.scorers.map((item, index) => {
                if (item.isMe && ctr === 0) {
                  this.onTheBoard = true
                  ctr++
                } else if (!item.isMe && (ctr > 0 && ctr < 2)) {
                  ctr++
                } else {
                  ctr = 0
                }
                return (
                  <Item key={item.id} index={index} person={item} ctr={ctr} />
                )
              })}
            </div>
            <ContentShadow />
          </Content>

          <Footer otb={this.onTheBoard}>
            {this.onTheBoard ? <OnTheBoard /> : <NotOnTheBoard />}
            <ButtonWrapper
              hasLoaded={!this.isLoading}
              innerRef={ref => (this.refContinueButton = ref)}
            />
          </Footer>
        </SlideLeft>
      </Container>
    )
  }
}

const slideLeft = keyframes`
  0%{transform: translateX(100%);}
  100%{transform: translateX(0);}
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
`

const SlideLeft = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  animation: ${slideLeft} 0.75s forwards;
`

const Header = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3% 5% 3% 5%;
`

const Content = styled.div`
  width: 100%;
  height: auto;
  //position: relative;
`

const ContentShadow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 1) 100%);
`

const Footer = styled.div`
  width: 100%;
  height: auto;
  min-height: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000000;
  position: absolute;
  bottom: 0;
  padding-top: ${props => (props.otb ? '5%' : '3%')};
  padding-bottom: ${props => (props.otb ? '5%' : '3%')};
`

const TextWrapper = styled.div`
  line-height: 1.1;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  line-height: ${props => props.lineheight || 1};
  ${props => (props.uppercase ? `text-transform: uppercase;` : '')};
`

const OnTheBoard = props => {
  return (
    <OTBContainer>
      <TextWrapper>
        <Text font={'pamainregular'} size={3} uppercase>
          demo winnings +&nbsp;
        </Text>
        <Text font={'pamainextrabold'} size={3} color={'#19d1be'} uppercase>
          key&nbsp;
        </Text>
        <Text font={'pamainregular'} size={3} uppercase>
          bonuses
        </Text>
      </TextWrapper>
      <TextWrapper>
        <Text font={'pamainregular'} size={3.5} lineheight={1.5} uppercase>
          congratulations, you're on the board
        </Text>
      </TextWrapper>
    </OTBContainer>
  )
}

const NotOnTheBoard = props => {
  return (
    <OTBContainer>
      <TextWrapper>
        <Text font={'pamainregular'} size={3} lineheight={2} uppercase>
          demo winnings +&nbsp;
        </Text>
        <Text
          font={'pamainextrabold'}
          size={3}
          lineheight={2}
          color={'#19d1be'}
          uppercase
        >
          key&nbsp;
        </Text>
        <Text font={'pamainregular'} size={3} lineheight={2} uppercase>
          bonuses
        </Text>
      </TextWrapper>
      <TextWrapper>
        <Text font={'pamainextrabold'} size={3.5} color={'#ed1c24'} uppercase>
          share&nbsp;
        </Text>
        <Text font={'pamainregular'} size={3.5} uppercase>
          your&nbsp;
        </Text>
        <Text font={'pamainextrabold'} size={3.5} color={'#19d1be'} uppercase>
          key
        </Text>
      </TextWrapper>
      <TextWrapper>
        <Text font={'pamainlight'} size={3.5} uppercase>
          for&nbsp;
        </Text>
        <Text font={'pamainbold'} size={3.5} uppercase>
          added&nbsp;
        </Text>
        <Text font={'pamainextrabold'} size={3.5} color={'#ffb600'} uppercase>
          tokens&nbsp;
        </Text>
        <Text font={'pamainlight'} size={3.5} uppercase>
          &&nbsp;
        </Text>
        <Text font={'pamainextrabold'} size={3.5} color={'#17c5ff'} uppercase>
          points
        </Text>
      </TextWrapper>
    </OTBContainer>
  )
}

const OTBContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ButtonWrapper = styled.div`
  opacity: 0;
  transform: scale(0.8);
  ${props =>
    props.hasLoaded ? `animation: ${fadeIn} 1s forwards;` : `opacity: 0;`};
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`
