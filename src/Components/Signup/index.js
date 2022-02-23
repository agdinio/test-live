import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import Button from '@/Components/Button/GlowingButton'
import { TweenMax } from 'gsap'
import { BaseContainer } from '@/Containers/Placeholder'
import { vhToPx, maxHeight } from '@/utils'

@inject('NavigationStore')
@observer
class Singup extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      contentDom: null,
    })
  }

  componentDidMount() {
    TweenMax.to(this.contentDom, 0.4, {
      opacity: 1,
      delay: 0.1,
    })
  }

  goToSignin() {
    TweenMax.to(this.contentDom, 0.25, {
      opacity: 0,
      onComplete: () => {
        this.props.NavigationStore.setCurrentView('/login')
      },
    })
  }

  goToKeyPage() {
    TweenMax.to(this.contentDom, 0.25, {
      opacity: 0,
      onComplete: () => {
        this.props.NavigationStore.setCurrentView('/keycode')
      },
    })
  }

  render() {
    return (
      <RegisterContainer>
        <LogoWrapper top={7}>
          <LogoImg src={sportocoLogo} width={25} alt="sportoco logo" top={7} />
          <LogoImg
            src={playalongLogo}
            width={45}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>
        <FadeInSection innerRef={ref => (this.contentDom = ref)}>
          <Section marginBottom={3}>
            <TextWrapper>
              <Text font={'pamainlight'} size={4.7}>
                sign-in to use your
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainextrabold'} size={4.7} color={'#ffb600'}>
                tokens&nbsp;
              </Text>
              <Text font={'pamainlight'} size={4.7}>
                &&nbsp;
              </Text>
              <Text font={'pamainextrabold'} size={4.7} color={'#17c5ff'}>
                points
              </Text>
            </TextWrapper>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainlight'} size={4.7}>
                  at the&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={4.7} color={'#ed1c24'}>
                  live&nbsp;
                </Text>
                <Text font={'pamainlight'} size={4.7}>
                  events
                </Text>
              </TextAlign>
            </TextWrapper>
          </Section>
          <Section marginBottom={3}>
            <TextWrapper>
              <Text font={'pamainlight'} size={4.7}>
                top point earners
              </Text>
            </TextWrapper>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainregular'} size={6.2}>
                  win lavish&nbsp;
                </Text>
                <Text font={'pamainbold'} size={6.2} color={'#9368aa'}>
                  prizes
                </Text>
              </TextAlign>
            </TextWrapper>
          </Section>
          <Section>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainbold'} size={4.7} color={'#ed1c24'}>
                  share&nbsp;
                </Text>
                <Text font={'pamainlight'} size={4.7}>
                  your&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={4.7} color={'#19d1bf'}>
                  key&nbsp;
                </Text>
                <Text font={'pamainlight'} size={4.7}>
                  for
                </Text>
              </TextAlign>
            </TextWrapper>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainregular'} size={3.7}>
                  bonus&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={3.7} color={'#ffb600'}>
                  tokens&nbsp;
                </Text>
                <Text font={'pamainlight'} size={3.7}>
                  &&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={3.7} color={'#17c5ff'}>
                  points
                </Text>
              </TextAlign>
            </TextWrapper>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainregular'} size={3.9}>
                  for you and your friends
                </Text>
              </TextAlign>
            </TextWrapper>
          </Section>
          {/*
          <TextWrapper>
            <Top>
              <Text size={5}>
                Top <Blue>Point</Blue> Earners win
              </Text>
              <Text size={5.5}>
                <Bold>
                  lavish <Purple>prizes</Purple>
                </Bold>
              </Text>
            </Top>
            <Bottom>
              <Text>
                Exclusive To <Yellow>Ambassadors</Yellow>
              </Text>
              <Text size={4.9}>for playing in our</Text>
              <Text size={4.9}>
                upcoming <Red>live events</Red>
              </Text>
            </Bottom>
          </TextWrapper>
*/}
          <Section>
            <ButtonWrapper>
              <Button
                inherit
                text="SIGN-IN"
                handleButtonClick={this.goToSignin.bind(this)}
              />
              <KeyButton onClick={this.goToKeyPage.bind(this)}>
                Or use your <Bold inside> key</Bold>
              </KeyButton>
            </ButtonWrapper>
          </Section>
        </FadeInSection>
        <Footer>Ambassador Demo 1.0v</Footer>
      </RegisterContainer>
    )
  }
}
export default Singup

const FadeInSection = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  z-index: 1;
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  ${props =>
    props.marginBottom ? `margin-bottom: ${vhToPx(props.marginBottom)};` : ``};
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => vhToPx(props.size || 4)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: ${props => props.lineHeight || 1};
`

const TextAlign = styled.div`
  text-align: center;
  line-height: ${props => props.lineHeight || 1};
`

const Top = styled.div`
  margin-bottom: 7%;
`
const Bottom = styled.div``
const Purple = styled.span`
  color: #9368aa;
  font-family: pamainbold;
`

const Blue = styled.span`
  color: #17c5ff;
  font-family: pamainbold;
`
const Red = styled.span`
  color: #ed1c24;
  font-family: pamainextrabold;
`
const Yellow = styled.span`
  color: #efdf18;
  font-family: pamainbold;
`

const KeyButton = styled.div`
  border-radius: ${props => vhToPx(0.5)};
  width: 100%;
  padding: 5%;
  margin-top: ${props => vhToPx(3)};
  cursor: pointer;
  text-transform: uppercase;
  background-color: white;
  color: #19d1be;
  height: ${props => vhToPx(10)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => vhToPx(3.5)};
  transition: 0.5s;
  &: hover {
    background-color: #19d1be;
    color: white;
    transition: 0.5s;
  }
`

const ButtonWrapper = styled.div`
  width: 45%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0.8);
`

const Bold = styled.span`
  font-family: pamainbold;
  ${props => (props.inside ? 'margin-left:5px;' : '')};
`
const TextWrapper__ = styled.div`
  color: white;
  text-align: center;
  text-transform: uppercase;
  font-family: pamainlight;
  font-size: ${props => vhToPx(9)};
  line-height: 0.9;
  margin-bottom: ${props => vhToPx(5)};
`

const Text__ = styled.div`
  font-size: ${props => (props.size ? vhToPx(props.size) : vhToPx(5))};
  ${props => (props.family ? `font-family:${props.family};` : '')};
  line-height: ${props => vhToPx(5.1)};
`

const LogoWrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.top}%;
`

const LogoImg = styled.img`
  width: ${props => props.width}%;
  margin-bottom: ${props => vhToPx(2)};
  max-width: ${props => props.width / 0.2}px;
`

const RegisterContainer = styled.div`
  width: 100%;
  height: ${props => maxHeight};
  z-index: 10;
  font-family: pamainregular;
  position: absolute;
`

const Footer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  position: absolute;
  bottom: 5%;
  font-size: ${props => vhToPx(1.5)};
  color: white;
`
