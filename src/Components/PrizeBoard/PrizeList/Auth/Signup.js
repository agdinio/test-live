import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax } from 'gsap'
import { vhToPx } from '@/utils'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import ArrowIconBlueGreen from '@/assets/images/icon-arrow-bluegreen.svg'
import FieldDecorator from '@/Components/PrizeBoard/PrizeList/Auth/FieldDecorator'
import ClaimButton from '@/Components/Button'

@inject('AuthStore', 'ProfileStore')
@observer
export default class Signup extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      errors: null,
      errorLocation: 0,
      touched: {
        name: false,
        email: false,
        phone: false,
      },
    })

    this.textAttr = {
      fontSize: vhToPx(7),
      subTextFontSize: vhToPx(5),
      iHaveFontSize: vhToPx(4),
    }
    this.inputAttr = {
      fontSize: vhToPx(3),
      height: vhToPx(7),
      borderRadius: vhToPx(0.5),
    }
  }

  handleNameChange = e => {
    this.touched.name = true
    this.props.AuthStore.setName(e.target.value)
  }

  handleEmailChange = e => {
    // if(this.errors && this.errors.Email){
    //   delete this.errors.Email
    // }
    this.touched.email = true
    this.props.AuthStore.setEmail(e.target.value)
  }

  handlePhoneChange = e => {
    // if(this.errors && this.errors.Password){
    //   delete this.errors.Password
    // }
    let phone = e.target.value.replace(/[^0-9]/g, '')
    if (phone) {
      this.touched.phone = true
    }
    if (/[0-9]*/.test(phone) && phone.length <= 10) {
      if (phone.length >= 4) {
        phone = `${phone.slice(0, 3)}-${phone.slice(3)}`
      }
      if (phone.length >= 8) {
        phone = `${phone.slice(0, 7)}-${phone.slice(7)}`
      }
      this.props.AuthStore.setPhone(phone)
    }
  }

  validName(name) {
    if (!this.touched.name) {
      return undefined
    }
    return !!name
  }

  validEmail(email) {
    if (!this.touched.email) {
      return undefined
    }
    const reg = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
    return !!email && !!email.match(reg)
  }

  validPhone(phone) {
    if (!this.touched.phone) {
      return undefined
    }
    const trimmedPhone = phone.replace(/-/g, '')
    const reg = /[0-9]{10}/
    return (
      !!trimmedPhone && !!reg.test(trimmedPhone) && trimmedPhone.length <= 10
    )
  }

  formSubmit() {
    let remaingCurrencies = { points: 0, tokens: 0, stars: 0 }
    if (
      this.props.ProfileStore.profile &&
      this.props.ProfileStore.profile.currencies
    ) {
      remaingCurrencies = this.props.ProfileStore.profile.currencies
    }

    const { email, name, phone } = this.props.AuthStore.values
    this.props.AuthStore.values.password = 'AmbassadorPass.v1'
    if (name && (email || phone)) {
      this.errors = undefined
      this.props.AuthStore.register()
        .then(d => {
          this.props.ProfileStore.profile = d
          this.props.ProfileStore.profile.currencies = remaingCurrencies
          this.props.handleIsLoggedIn(true)
        })
        .catch(e => {
          this.errors = e
        })
    }
  }

  handleGotoLoginClick() {
    this.props.refGotoLogin()
  }

  handleGotoKeyClick() {
    this.props.refGotoKey()
  }

  componentDidMount() {
    this.errorLocation =
      ReactDOM.findDOMNode(this.lastField).offsetTop +
      ReactDOM.findDOMNode(this.lastField).offsetHeight +
      5
  }

  render() {
    const { values } = this.props.AuthStore

    return (
      <Container>
        <Wrapper>
          <Section marginBottom={3}>
            <TextWrapper marginBottom={1}>
              <Text
                font={'pamainbold'}
                color={'#17c5ff'}
                size={this.textAttr.fontSize}
              >
                sign-up
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
          </Section>
          <Section marginBottom={6}>
            <FormWrapper onSubmit={this.formSubmit.bind(this)}>
              <FormFieldSet marginBottom={1.5}>
                <FormInput
                  type="text"
                  placeholder="FULL NAME *"
                  value={values.name}
                  onChange={this.handleNameChange}
                  valid={this.validName(values.name)}
                  size={this.inputAttr.fontSize}
                  height={this.inputAttr.height}
                  borderRadius={this.inputAttr.borderRadius}
                />
                <FieldDecorator valid={this.validName(values.name)} />
              </FormFieldSet>
              <FormFieldSet marginBottom={1.5}>
                <FormInput
                  type="email"
                  placeholder="E-MAIL *"
                  value={values.email}
                  onChange={this.handleEmailChange}
                  valid={this.validEmail(values.email)}
                  size={this.inputAttr.fontSize}
                  height={this.inputAttr.height}
                  borderRadius={this.inputAttr.borderRadius}
                />
                <FieldDecorator valid={this.validEmail(values.email)} />
              </FormFieldSet>
              <FormFieldSet innerRef={ref => (this.lastField = ref)}>
                <FormInput
                  type="text"
                  placeholder="PHONE"
                  value={values.phone}
                  onChange={this.handlePhoneChange}
                  valid={this.validPhone(values.phone)}
                  size={this.inputAttr.fontSize}
                  height={this.inputAttr.height}
                  borderRadius={this.inputAttr.borderRadius}
                />
                <FieldDecorator valid={this.validPhone(values.phone)} />
              </FormFieldSet>
              <Errors notError top={this.errorLocation}>
                <div>OPTIONAL</div>
              </Errors>
            </FormWrapper>
          </Section>
          <Section marginBottom={5}>
            <ButtonWrapper>
              <ClaimButton
                text="CLAIM"
                height={10}
                handleButtonClick={this.formSubmit.bind(this)}
                disabled={
                  !(
                    this.validName(values.name) &&
                    this.validEmail(values.email) &&
                    (!values.phone || this.validPhone(values.phone))
                  )
                }
                padding={{ top: 0.8, bottom: 0.8, left: 5, right: 5 }}
                arrowSize={3.5}
                marginLeftBtnIcon={3}
              />
            </ButtonWrapper>
          </Section>
          <Section>
            <IHaveWrapper
              marginBottom={2}
              onClick={this.handleGotoLoginClick.bind(this)}
            >
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.textAttr.iHaveFontSize}
              >
                i have an account&nbsp;
              </Text>
              <Arrow src={ArrowIcon} />
            </IHaveWrapper>
            <IHaveWrapper onClick={this.handleGotoKeyClick.bind(this)}>
              <Text
                font={'pamainregular'}
                color={'#19d1be'}
                size={this.textAttr.iHaveFontSize}
              >
                i have a key&nbsp;
              </Text>
              <Arrow src={ArrowIconBlueGreen} />
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

const TextWrapper = styled.div`
  text-align: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => props.size};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  letter-spacing: ${props => vhToPx(0.1)};
  line-height: 1;
`

const FormWrapper = styled.form`
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  position: relative;
`

const FormFieldSet = styled.fieldset`
  position: relative;
  width: 70%;
  border: none;
  margin-top: ${props => vhToPx(props.marginTop) || 0};
  margin-bottom: ${props => vhToPx(props.marginBottom) || 0};
`

const FormInput = styled.input`
  font-family: pamainbold;
  font-size: ${props => props.size};
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color:#${props.valid ? '2fc12f' : 'ed1c24'}`};
  text-transform: uppercase;
  width: 100%;
  height: ${props => props.height};
  padding-left: 10%;
  border-radius: ${props => props.borderRadius};
  border: none;
  outline: none;
`

const Errors = styled.div`
  padding-left: 17%;
  font-family: ${props => (props.notError ? 'pamainlight' : 'pamainbold')};
  ${props =>
    props.notError ? '' : 'text-align:center;text-transform:uppercase;'}
  font-size: ${props => (props.notError ? vhToPx(2) : vhToPx(2.5))};
  position: absolute;
  color:${props => (props.notError ? 'white' : '#ed1c24')};
  top: ${props => props.top}px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ButtonWrapper = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
`

const IHaveWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const Arrow = styled.img`
  height: ${props => vhToPx(2.7)};
  margin-bottom: ${props => vhToPx(0.4)};
`
