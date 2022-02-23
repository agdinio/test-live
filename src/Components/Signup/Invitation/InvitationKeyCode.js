import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import icon_arrow_right from '@/assets/images/icon-arrow.svg'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { extendObservable } from 'mobx'
import Background from '@/assets/images/playalong-default.jpg'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import { PACircle } from '@/Components/PACircle'
import FieldDecorator from '@/Components/Signup/FieldDecorator'
import SignInButton from '@/Components/Button'
import InvitationEmail from './InvitationEmail'
import { vhToPx, maxHeight } from '@/utils'

@inject('NavigationStore', 'AuthStore', 'ProfileStore', 'CommonStore')
@withRouter
@observer
class InvitationKeyCode extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      userDisplayName: undefined,
    })

    this.props.AuthStore.values.token = this.props.ProfileStore.invitationKey
  }

  showHideLoader(show) {
    if (show) {
      if (this.refLoader) {
        TweenMax.set(this.refLoader, { opacity: 1, zIndex: 100 })
        ReactDOM.unmountComponentAtNode(this.refLoader)
        ReactDOM.render(<PACircle size={8.5} />, this.refLoader)
      }
    } else {
      if (this.refLoader) {
        TweenMax.set(this.refLoader, { opacity: 0, zIndex: -100 })
        ReactDOM.unmountComponentAtNode(this.refLoader)
      }
    }
  }

  handleCodeChange(e) {
    this.props.AuthStore.setToken(e.target.value)
    this.valid = undefined
  }

  validateKey() {
    this.showHideLoader(true)
    this.props.AuthStore.validateKey(
      this.props.AuthStore.values.token.toUpperCase()
    )
      .then(response => {
        debugger
        this.valid = response.valid
        this.userDisplayName = response.userDisplayName
      })
      .finally(_ => {
        this.showHideLoader(false)
      })
  }

  handleSignInClick() {
    if (this.valid) {
      TweenMax.to(this.KeyCodeSection, 0.5, { x: '-100%' })
      TweenMax.to(this.EmailSection, 0.5, { x: '0%' })
    } else {
      //REGISTER EMAIL
      TweenMax.to(this.KeyCodeSection, 0.5, { x: '-100%' })
      TweenMax.to(this.EmailSection, 0.5, { x: '0%' })
    }
  }

  componentDidMount() {
    this.validateKey()
  }

  render() {
    return (
      <Container innerRef={this.props.reference}>
        <LogoWrapper top={7}>
          <LogoImg src={sportocoLogo} width={25} alt="sportoco logo" top={7} />
          <LogoImg
            src={playalongLogo}
            width={45}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>

        <Loader innerRef={ref => (this.refLoader = ref)} />
        <FadeInSection innerRef={ref => (this.KeyCodeSection = ref)}>
          <TextWrapper>
            <Text font={'pamainlight'} size={4} color={'#fff'}>
              your <Teal>Key code</Teal>
            </Text>
          </TextWrapper>
          <FormWrapper
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormFieldSet>
              <FormInput
                onChange={this.handleCodeChange.bind(this)}
                valid={this.valid}
                value={this.props.AuthStore.values.token}
                type="text"
                placeholder="EXAMPLE: AMB000"
              />
              <FieldDecorator valid={this.valid} />
            </FormFieldSet>
            {this.valid !== undefined && !this.valid ? <ErrorText /> : null}
          </FormWrapper>

          {this.valid ? (
            <ValidationStatus>
              <TextWrapper>
                <Text font={'pamainlight'} size={4} color={'#fff'}>
                  you've been invited by
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text font={'pamainextrabold'} size={4} color={'#19d1be'}>
                  {this.userDisplayName}
                </Text>
              </TextWrapper>

              <div style={{ marginTop: vhToPx(3), textAlign: 'center' }}>
                <TextWrapper>
                  <Text font={'pamainregular'} size={4} color={'#fff'}>
                    & have been granted bonus
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainextrabold'} size={4} color={'#ffb600'}>
                    tokens&nbsp;
                  </Text>
                  <Text font={'pamainextrabold'} size={4} color={'#17c5ff'}>
                    points
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainlight'} size={4} color={'#fff'}>
                    to&nbsp;
                  </Text>
                  <Text font={'pamainbold'} size={4} color={'#fff'}>
                    you&nbsp;
                  </Text>
                  <Text font={'pamainlight'} size={4} color={'#fff'}>
                    and your&nbsp;
                  </Text>
                  <Text font={'pamainbold'} size={4} color={'#fff'}>
                    friend
                  </Text>
                </TextWrapper>
                <ButtonWrapper>
                  <SignInButton
                    padding={{ top: 1, bottom: 1, left: 5, right: 5 }}
                    arrowSize={3.4}
                    text={'SIGN-IN'}
                    disabled={!this.valid}
                    handleButtonClick={this.handleSignInClick.bind(this)}
                  />
                </ButtonWrapper>
              </div>
            </ValidationStatus>
          ) : (
            <ValidationStatus>
              <TextWrapper>
                <Text font={'pamainlight'} size={4} color={'#fff'}>
                  you've been invited
                </Text>
              </TextWrapper>
              <div style={{ marginTop: vhToPx(8), textAlign: 'center' }}>
                <TextWrapper>
                  <Text font={'pamainregular'} size={4} color={'#fff'}>
                    but your keycode is
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainregular'} size={4} color={'#fff'}>
                    incorrect,&nbsp;please check again
                  </Text>
                </TextWrapper>
              </div>
              <Underline onClick={this.handleSignInClick.bind(this)}>
                <Text
                  font={'pamainlight'}
                  size={3.5}
                  color={'#2abff4'}
                  uppercae
                >
                  or register with your email
                </Text>
              </Underline>
            </ValidationStatus>
          )}

          {/*
          <Back onClick={this.goToSignIn.bind(this)}>
            <BackText> No Key? </BackText>
            <BackText> Sign-in</BackText>
            <BackArrow>
              <Arrow src={icon_arrow_right} alt="" />
            </BackArrow>
          </Back>
*/}
        </FadeInSection>

        <EmailSection innerRef={ref => (this.EmailSection = ref)}>
          <InvitationEmail />
        </EmailSection>

        <Footer>Ambassador Demo 1.0v</Footer>
      </Container>
    )
  }
}

export default withRouter(InvitationKeyCode)

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const ErrorText = styled.div`
  width: 100%;
  position: absolute;
  top: 7vh;
  font-size: 2vh;
  text-transform: uppercase;
  color: #ed1c24;
  font-family: pamainbold;
  text-align: center;
  &:before {
    content: 'incorrect key code';
  }
`

const Arrow = styled.img`
  height: 2.5vh;
`

const BackArrow = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5px;
`

const Back = styled.div`
  animation: 1s ${FadeIn} forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 3.5vh;
  text-transform: uppercase;
  margin-top: 5%;
  margin-bottom: 5%;
  cursor: pointer;
  &:hover {
    transition-duration: 0.5s;
    opacity: 0.6;
  }
`

const BackText = styled.span`
  margin-left: 1vh;
  margin-right: 1vh;
`

const Teal = styled.span`
  color: #19d1be;
  font-family: pamainextrabold;
`
const Gold = styled.span`
  color: #ffb600;
  font-family: pamainextrabold;
`
const Blue = styled.span`
  color: #17c5ff;
  font-family: pamainextrabold;
`

const FormInput = styled.input`
  ${props =>
    props.valid === undefined
      ? ''
      : `color:#${props.valid ? '2fc12f' : 'ed1c24'};`} font-family: pamainbold;
  width: 100%;
  margin-bottom: 10px;
  height: ${props => vhToPx(7)};
  text-align: center;
  border-radius: ${props => vhToPx(0.5)};
  border: none;
  outline: none;
  font-size: ${props => vhToPx(3)};
  text-transform: uppercase;
`

const FormFieldSet = styled.fieldset`
  width: 70%;
  border-radius: ${props => vhToPx(0.5)};
  border: none;
  height: ${props => vhToPx(4)};
  position: relative;
`

const FormWrapper = styled.form`
  position: relative;
  margin-bottom: 15%;
  animation: 1s ${FadeIn} forwards;
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  margin-top: ${props => vhToPx(1)};
`

const Bold = styled.span`
  font-family: pamainbold;
  ${props => (props.inside ? 'margin-left:5px;' : '')};
`
const TextWrapper_ = styled.div`
  ${props => (props.top ? 'margin-top:25%;' : '')}
  animation: 1s ${FadeIn} forwards;
  color: white;
  text-align: center;
  text-transform: uppercase;
  font-family: pamainlight;
  font-size: 4vh;
  line-height: 1;
  margin-bottom: 15px;
`

const Text_ = styled.div`
  font-size: ${props => props.size || 4}vh;
  ${props => (props.family ? `font-family:${props.family};` : '')};
`

const TextWrapper = styled.div`
  line-height: 1;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => vhToPx(props.size || 4)};
  color: ${props => props.color || '#fff'};
  text-transform: uppercase;
`

const Underline = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  margin-top: ${props => vhToPx(8)};
  &:after {
    content: '';
    height: ${props => vhToPx(0.1)};
    width: inherit;
    background-color: #2abff4;
  }
  cursor: pointer;
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
  //max-width: ${props => props.width / 0.2}px;
`

const Container = styled.div`
/*
  width: 100%;
  height: ${props => maxHeight};
  z-index: 10;
  font-family: pamainregular;
  position: absolute;
*/

  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;

`

const FadeInSection = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  margin-top: 40%;
`

const EmailSection = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  transform: translateX(100%);
`

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${props => vhToPx(5)};
`

const ValidationStatus = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Footer = styled.div`
  font-family: pamainlight;
  width: 100%;
  justify-content: center;
  display: flex;
  position: absolute;
  bottom: 5%;
  font-size: 1.5vh;
  animation: 1s ${FadeIn} forwards;
  color: white;
`

const Loader = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -100;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0;
`
