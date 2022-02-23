import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import { vhToPx, responsiveDimension } from '@/utils'
import Login from './Login'
import Signup from './Signup'
import KeyCode from './KeyCode'
import KeyEmail from './KeyEmail'
import ForgotPassword from '../Auth/ForgotPassword'
import ResetPassword from '../Auth/ResetPassword'

export default class AuthSequence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lightboxScreen: null,
    }
  }

  handleLoggedIn() {
    this.props.mainHandleLoggedIn(true)
  }

  handleAuthClick(authType, item) {
    if (this.refIntro) {
      this.refIntro.style.display = 'none'
    }
    if (authType === 'close') {
      this.setState({
        lightboxScreen: null,
      })
    }
    if (authType === 'login') {
      this.setState({
        lightboxScreen: (
          <Login
            handleIsLoggedIn={this.handleLoggedIn.bind(this)}
            refGotoSignup={this.handleAuthClick.bind(this, 'signup')}
            refGoToForgotPassword={this.handleAuthClick.bind(
              this,
              'forgotpassword'
            )}
          />
        ),
      })
    } else if (authType === 'signup') {
      this.setState({
        lightboxScreen: (
          <Signup
            refGotoLogin={this.handleAuthClick.bind(this, 'login')}
            refGotoKey={this.handleAuthClick.bind(this, 'keycode')}
            handleIsLoggedIn={this.handleLoggedIn.bind(this)}
          />
        ),
      })
    } else if (authType === 'keycode') {
      this.setState({
        lightboxScreen: (
          <KeyCode
            refGotoLogin={this.handleAuthClick.bind(this, 'login', item)}
            refGotoKeyEmail={this.handleAuthClick.bind(this, 'keyemail', item)}
          />
        ),
      })
    } else if (authType === 'keyemail') {
      this.setState({
        lightboxScreen: (
          <KeyEmail handleIsLoggedIn={this.handleLoggedIn.bind(this, item)} />
        ),
      })
    } else if (authType === 'forgotpassword') {
      this.setState({
        lightboxScreen: (
          <ForgotPassword
            handleIsLoggedIn={this.handleLoggedIn.bind(this)}
            refGotoLogin={this.handleAuthClick.bind(this, 'login')}
            refGotoSignup={this.handleAuthClick.bind(this, 'signup')}
            refclose={this.handleAuthClick.bind(this, 'close')}
          />
        ),
      })
    }
  }

  componentDidMount() {
    if (this.refIntro) {
      this.refIntro.style.display = 'none'
    }
    if (!window.location.search.includes('?forgotpassword=')) {
      this.setState({
        lightboxScreen: (
          <Login
            handleIsLoggedIn={this.handleLoggedIn.bind(this)}
            refGotoSignup={this.handleAuthClick.bind(this, 'signup')}
            refGoToForgotPassword={this.handleAuthClick.bind(
              this,
              'forgotpassword'
            )}
          />
        ),
      })
    } else {
      this.setState({
        lightboxScreen: (
          <ResetPassword
            handleIsLoggedIn={this.handleLoggedIn.bind(this)}
            refGotoSignup={this.handleAuthClick.bind(this, 'signup')}
            refGoToForgotPassword={this.handleAuthClick.bind(
              this,
              'forgotpassword'
            )}
            refGotoLogin={this.handleAuthClick.bind(this, 'login')}
          />
        ),
      })
    }
  }

  render() {
    return (
      <Container>
        <FadeIn innerRef={ref => (this.refIntro = ref)}>
          <HeaderLabel>CLAIM YOUR PRIZE</HeaderLabel>
          <ButtonGroup>
            <Button
              backgroundColor={'#16c4fe'}
              bottom
              onClick={this.handleAuthClick.bind(
                this,
                'login',
                this.props.item
              )}
            >
              <ButtonSection>
                <Text
                  font={'pamainregular'}
                  color={'#ffffff'}
                  size={4}
                  uppercase
                >
                  log-in
                </Text>
              </ButtonSection>
              <Arrow src={ArrowIcon} />
            </Button>
            <Button
              borderColor={'#ffffff'}
              bottom
              onClick={this.handleAuthClick.bind(
                this,
                'signup',
                this.props.item
              )}
            >
              <ButtonSection>
                <Text
                  font={'pamainregular'}
                  color={'#ffffff'}
                  size={4}
                  uppercase
                >
                  register
                </Text>
              </ButtonSection>
              <Arrow src={ArrowIcon} />
            </Button>
            <Button
              backgroundColor={'#19d1be'}
              onClick={this.handleAuthClick.bind(
                this,
                'keycode',
                this.props.item
              )}
            >
              <ButtonSection>
                <Text
                  font={'pamainregular'}
                  color={'#ffffff'}
                  size={4}
                  uppercase
                >
                  use my&nbsp;
                </Text>
                <Text
                  font={'pamainextrabold'}
                  color={'#ffffff'}
                  size={4}
                  uppercase
                >
                  key
                </Text>
              </ButtonSection>
              <Arrow src={ArrowIcon} />
            </Button>
          </ButtonGroup>
        </FadeIn>
        <LightboxWrapper>{this.state.lightboxScreen}</LightboxWrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  padding-bottom: 20%;
  animation: ${props => fadeIn} 0.4s forwards;
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const HeaderLabel = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(5)};
  color: #ffffff;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${props => responsiveDimension(6)};
`

const Button = styled.div`
  width: ${props => responsiveDimension(30)};
  height: ${props => responsiveDimension(10)};
  border-radius: ${props => responsiveDimension(0.5)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  ${props =>
    props.borderColor
      ? `border: ${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: ${props => (props.bottom ? responsiveDimension(3) : 0)};
`

const ButtonSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const Arrow = styled.img`
  height: ${props => responsiveDimension(3.3)};
  margin-right: ${props => responsiveDimension(3)};
`

const LightboxWrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
`
