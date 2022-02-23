import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax } from 'gsap'
import FieldDecorator from './FieldDecorator'
import ClaimButton from '@/Components/Button'
import { vhToPx, validEmail, responsiveDimension } from '@/utils'

@inject('AuthStore', 'ProfileStore')
@observer
export default class KeyEmail extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      error: null,
      isAuthenticating: false,
      textAttr: {},
      formInputAttr: {},
    })

    this.props.AuthStore.resetValues()
  }

  handleEmailChange(e) {
    this.props.AuthStore.setEmail(e.target.value)
    this.valid = undefined
  }

  handleEnterKey(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.login()
    }
  }

  handleButtonClick() {
    this.registerAndLogin()
  }

  registerAndLogin() {
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
        this.props.ProfileStore.profile = d
        this.props.ProfileStore.profile.currencies = remaingCurrencies
        this.props.handleIsLoggedIn(true)
      })
      .catch(e => {
        this.error = e
      })
  }

  componentWillMount() {
    this.textAttr['fontSize'] = responsiveDimension(7)
    this.textAttr['subTextFontSize'] = responsiveDimension(5)

    this.formInputAttr['borderRadius'] = responsiveDimension(0.5)
    this.formInputAttr['height'] = responsiveDimension(7)
    this.formInputAttr['marginBottom'] = responsiveDimension(1.5)
    this.formInputAttr['fontSize'] = responsiveDimension(3)
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <Section>
            <TextWrapper>
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.textAttr.subTextFontSize}
              >
                insert your email
              </Text>
            </TextWrapper>
          </Section>
          <Section marginTop={2} marginBottom={2}>
            <FormWrapper
              onSubmit={e => {
                e.preventDefault()
              }}
            >
              <FormFieldSet attr={this.formInputAttr}>
                <FormInput
                  onChange={this.handleEmailChange.bind(this)}
                  valid={this.valid}
                  value={this.props.AuthStore.values.email}
                  type="email"
                  placeholder="E-MAIL"
                  readOnly={this.isAuthenticating ? true : false}
                  attr={this.formInputAttr}
                />
                <FieldDecorator valid={this.valid} />
              </FormFieldSet>

              <Errors>{this.error}</Errors>
            </FormWrapper>
          </Section>
          <Section>
            <ButtonWrapper>
              <ClaimButton
                text="CLAIM"
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
  transform: translateX(100%);
  animation: ${props => slideIn} 0.75s forwards;
`

const slideIn = keyframes`
  0%{transform: translateX(100%);}
  100%{transform: translateX(0%);}
`

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
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
  width: 70%;
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  height: ${props => props.attr.height};
  position: relative;
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
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(1.75)};
  color: #ed1c24;
  text-align: center;
  text-transform: uppercase;
`
const ButtonWrapper = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
`
