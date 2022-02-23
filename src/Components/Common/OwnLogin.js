import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax } from 'gsap'
import FieldDecorator from '@/Components/Signup/FieldDecorator'
import BeginButton from '@/Components/Button'
import { vhToPx, validEmail } from '@/utils'
import agent from '@/Agent'

@inject('AuthStore', 'ProfileStore', 'GameStore', 'CommandHostStore')
@observer
export default class SuperbowlLoginFirst extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      isAuthenticating: false,
      textAttr: {},
      formInputAttr: {},
      error: null,
    })

    this.props.AuthStore.resetValues()
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

  login__() {
    this.isAuthenticating = true
    this.props.AuthStore.login()
      .then(d => {
        this.valid = true
        this.props.ProfileStore.profile = d
        this.props.handleIsLoggedIn(true)
      })
      .catch(e => {
        console.log(e)
        this.error = e
        this.props.handleIsLoggedIn(false)
      })
  }

  componentWillMount() {
    this.textAttr['fontSize'] = vhToPx(6)

    this.formInputAttr['borderRadius'] = vhToPx(0.5)
    this.formInputAttr['height'] = vhToPx(7)
    this.formInputAttr['marginBottom'] = vhToPx(1.5)
    this.formInputAttr['fontSize'] = vhToPx(3)
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <Section>
            <TextWrapper>
              <Text font={'pamainlight'} color={'#ffffff'} attr={this.textAttr}>
                please&nbsp;
              </Text>
              <Text font={'pamainbold'} color={'#17c5ff'} attr={this.textAttr}>
                sign-in
              </Text>
            </TextWrapper>
          </Section>
          <Section marginTop={2}>
            <Errors>{this.error}</Errors>
            <FormWrapper
              onSubmit={e => {
                e.preventDefault()
              }}
            >
              <FormFieldSet attr={this.formInputAttr}>
                <FormInput
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

              <ButtonWrapper>
                <BeginButton
                  text="BEGIN"
                  height={10}
                  handleButtonClick={this.handleButtonClick.bind(this)}
                  disabled={
                    !validEmail(this.props.AuthStore.values.email) ||
                    this.isAuthenticating
                  }
                  padding={{ top: 0.8, bottom: 0.8, left: 6, right: 6 }}
                  arrowSize={3.5}
                />
              </ButtonWrapper>
            </FormWrapper>
          </Section>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  position: absolute;
  z-index: 201;
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Section = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
`

const TextWrapper = styled.div`
  text-align: center;
  line-height: 1;
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => props.attr.fontSize};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
`

const FormWrapper = styled.form`
  position: relative;
  margin-bottom: 15%;
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const FormFieldSet = styled.fieldset`
  width: 70%;
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  height: ${props => props.attr.height};
  position: relative;
  margin-bottom: ${props => props.attr.marginBottom};
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
  text-transform: uppercase;
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
  margin-top: 5%;
`
