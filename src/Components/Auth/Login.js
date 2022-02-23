import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import FieldDecorator from './FieldDecorator'
import ClaimButton from '@/Components/Button'
import { vhToPx, validEmail, responsiveDimension } from '@/utils'
import agent from '@/Agent'

import SocialProvider from './SocialProvider'
@inject('AuthStore', 'ProfileStore', 'GameStore')
@observer
export default class Login extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      isAuthenticating: false,
      textAttr: {},
      formInputAttr: {},
      error: null,
    })

    this.stateValue = null
    this.iHaveAttr = {
      top: vhToPx(70),
      fontSize: responsiveDimension(4),
    }

    this.props.AuthStore.resetValues()
  }

  handleGotoSignupClick() {
    this.props.refGotoSignup()
  }

  /* Handle Signup click */
  handleGotoForgotPasswordClick() {
    this.props.refGoToForgotPassword()
  }

  handleEmailChange(e) {
    this.props.AuthStore.setEmail(e.target.value)
    this.valid = undefined
  }

  handlePasswordChange(e) {
    this.props.AuthStore.setPassword(e.target.value)
    this.valid = undefined
  }

  handleEnterKey(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.login()
    }
  }

  handleButtonClick() {
    this.login()
  }

  login() {
    this.props.AuthStore.login({
      username: (this.props.AuthStore.values.email || '').toLowerCase(),
      password: this.props.AuthStore.values.password,
    })
      .then(next => {
        console.log('CONSOLE NEXT', next)
        if (next) {
          localStorage.removeItem('ANONYMOUS_USER')
          this.props.handleIsLoggedIn(true)
        }
      })
      .catch(err => {
        if (err) {
          if (err.errno && err.errno === 1045) {
            this.error =
              'invalid database configuration. please contact system administrator.'
          } else {
            this.error = err
          }
        } else {
          this.error = 'please contact system administrator.'
        }

        this.props.AuthStore.setPassword('')

        setTimeout(() => {
          this.error = null
        }, 3000)
      })
  }

  loginGameSparks() {
    this.props.GameStore.login({
      username: this.props.AuthStore.values.email,
      password: this.props.AuthStore.values.password,
    }) //pwd: SportocoToday.v1
      .then(() => {
        this.props.handleIsLoggedIn(true)
      })
      .catch(err => {
        if (err) {
          if (err.errno && err.errno === 1045) {
            this.error =
              'invalid database configuration. please contact system administrator.'
          } else {
            this.error = err
            this.props.AuthStore.setPassword('')
          }
        } else {
          this.error = 'please contact system administrator.'
        }

        setTimeout(() => {
          this.error = null
        }, 3000)
      })
  }

  loginX() {
    let remaingCurrencies = { points: 0, tokens: 0, stars: 0 }
    if (
      this.props.ProfileStore.profile &&
      this.props.ProfileStore.profile.currencies
    ) {
      remaingCurrencies = this.props.ProfileStore.profile.currencies
    }

    this.isAuthenticating = true
    this.props.AuthStore.login()
      .then(d => {
        console.log('console content', d)
        this.valid = true
        this.props.ProfileStore.profile = d
        this.props.ProfileStore.profile.currencies = remaingCurrencies

        setTimeout(() => this.props.handleIsLoggedIn(true), 1000)
      })
      .catch(e => {
        console.log(e)
        this.error = e
      })
  }

  componentWillMount() {
    this.textAttr['fontSize'] = responsiveDimension(5)
    this.textAttr['subTextFontSize'] = responsiveDimension(5)

    this.formInputAttr['borderRadius'] = responsiveDimension(0.4)
    this.formInputAttr['height'] = responsiveDimension(7)
    this.formInputAttr['marginBottom'] = responsiveDimension(1.5)
    this.formInputAttr['fontSize'] = responsiveDimension(3)
  }

  statusMessage(value) {
    if (value) {
      let result = { ...this }
      result.error = 'Try again '
    }
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <Section marginBottom={2}>
            <TextWrapper>
              <Text
                font={'pamainbold'}
                color={'#17c5ff'}
                size={this.textAttr.fontSize}
              >
                sign-in
              </Text>
            </TextWrapper>
            {/*
            <TextWrapper marginBottom={1}>
              <Text
                font={'pamainbold'}
                color={'#17c5ff'}
                size={this.textAttr.fontSize}
              >
                log-in
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.textAttr.subTextFontSize}
              >
                to claim your prize
              </Text>
            </TextWrapper>
*/}
          </Section>
          <Section marginBottom={2}>
            <Errors>{this.error}</Errors>
            <FormWrapper
              onSubmit={e => {
                e.preventDefault()
              }}
            >
              <FormFieldSet attr={this.formInputAttr}>
                <FormInput
                  id={`email-login`}
                  onChange={this.handleEmailChange.bind(this)}
                  onKeyPress={this.handleEnterKey.bind(this)}
                  valid={this.valid}
                  value={this.props.AuthStore.values.email}
                  type="email"
                  placeholder="E-MAIL"
                  readOnly={this.isAuthenticating ? true : false}
                  attr={this.formInputAttr}
                />
                <FieldDecorator valid={this.valid} />
              </FormFieldSet>
              <FormFieldSet attr={this.formInputAttr}>
                <FormInput
                  id={`password-login`}
                  onChange={this.handlePasswordChange.bind(this)}
                  onKeyPress={this.handleEnterKey.bind(this)}
                  valid={this.valid}
                  value={this.props.AuthStore.values.password}
                  type="password"
                  placeholder="PASSWORD"
                  readOnly={this.isAuthenticating ? true : false}
                  attr={this.formInputAttr}
                />
                <FieldDecorator valid={this.valid} />
              </FormFieldSet>
            </FormWrapper>
          </Section>
          <Section marginBottom={10}>
            <ButtonWrapper>
              <ClaimButton
                refId={`button-login`}
                text="SIGN-IN"
                height={10}
                handleButtonClick={this.handleButtonClick.bind(this)}
                disabled={
                  !validEmail(this.props.AuthStore.values.email) ||
                  this.isAuthenticating
                }
                padding={{ top: 0.8, bottom: 0.8, left: 5, right: 5 }}
                arrowSize={3.5}
                marginLeftBtnIcon={3}
              />
            </ButtonWrapper>
            <p>&nbsp;</p>
            <Text>Or sign-in with</Text>
            <p>&nbsp;</p>
            <SocialProvider statusMessage={this.statusMessage} />
          </Section>
          <Section>
            <IHaveWrapper
              onClick={this.handleGotoSignupClick.bind(this)}
              id={`link-to-signup`}
            >
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.iHaveAttr.fontSize}
              >
                no account?&nbsp;
              </Text>
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.iHaveAttr.fontSize}
              >
                sign-up
              </Text>
              <Underline backgroundColor={'#ffffff'} />
            </IHaveWrapper>
          </Section>

          <Section marginTop={5}>
            <IHaveWrapper
              onClick={this.handleGotoForgotPasswordClick.bind(this)}
              id={`link-to-forgotpassword`}
            >
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.iHaveAttr.fontSize}
              >
                Forgot Password?&nbsp;
              </Text>
              <Underline backgroundColor={'#ffffff'} />
            </IHaveWrapper>
          </Section>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: ${props => fadeIn} 0.4s forwards;
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const lineText = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #000;
  line-height: 0.1em;
  margin: 10px 0 20px;
`

const TextWrapper = styled.div`
  text-align: center;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => props.size};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
  line-height: 1;
`

const FormWrapper = styled.form`
  position: relative;
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const FormFieldSet = styled.fieldset`
  width: 75%;
  //border-radius: ${props => props.attr.borderRadius};
  border: none;
  //height: ${props => props.attr.height};
  position: relative;
  margin-top: ${props => responsiveDimension(props.marginTop) || 0};
  margin-bottom: ${props => responsiveDimension(props.marginBottom) || 0};
`

const FormInput = styled.input`
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color: ${props.valid ? '#2fc12f' : '#ed1c24'}`};
  font-family: pamainbold;
  width: 100%;
  margin-bottom: ${props => props.attr.marginBottom};
  height: ${props => props.attr.height};
  text-align: center;
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  outline: none;
  font-size: ${props => props.attr.fontSize};
`

const Errors = styled.div`
  width: 100%;
  margin-top: 2%;
  font-family: pamainregular;
  font-size: ${props => vhToPx(2)};
  color: #ed1c24;
  text-align: center;
  text-transform: uppercase;
`
const ButtonWrapper = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
`

const IHaveWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const Underline = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  left: 0;
  right: 0;
  top: 10%;
  &:after {
    content: '';
    width: 100%;
    height: ${props => responsiveDimension(0.1)};
    background-color: ${props => props.backgroundColor};
  }
`
const Divider = styled.div`
  width: 100%;
  height: ${props => vhToPx(0.1)};
  display: flex;
  justify-content: center;
  position: relative;
  
  &:after {
    content: '';
    width: 80%
    height: inherit;
    background-color: grey;
  }
`
