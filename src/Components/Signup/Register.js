import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ReactDOM from 'react-dom'
import { extendObservable } from 'mobx'
import { withRouter } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import Button from '@/Components/Button/GlowingButton'
import FieldDecorator from '@/Components/Signup/FieldDecorator'
import { vhToPx, maxHeight } from '@/utils'

@inject('AuthStore', 'NavigationStore')
@withRouter
@observer
class Register extends Component {
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
  }

  componentWillUnmount() {
    this.props.AuthStore.reset()
  }

  componentDidMount() {
    this.errorLocation =
      ReactDOM.findDOMNode(this.lastField).offsetTop +
      ReactDOM.findDOMNode(this.lastField).offsetHeight +
      5
  }

  handleNameChange = e => {
    // if(this.errors && this.errors.Username){
    //   delete this.errors.Username
    // }
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
  formSubmit() {
    const { email, name, phone } = this.props.AuthStore.values
    this.props.AuthStore.values.password = 'AmbassadorPass.v1'
    if (name && (email || phone)) {
      this.errors = undefined
      this.props.AuthStore.register()
        .then(d => {
          this.props.NavigationStore.setCurrentView('/prepick')
        })
        .catch(e => {
          this.errors = e
        })
    }
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

  validEmail(email) {
    if (!this.touched.email) {
      return undefined
    }
    const reg = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
    return !!email && !!email.match(reg)
  }

  validName(name) {
    if (!this.touched.name) {
      return undefined
    }
    return !!name
  }

  render() {
    const { values } = this.props.AuthStore

    /*
    const errors = this.errors
      ? Object.keys(this.errors).map(key => {
          return {
            key: key.replace('Username', 'Phone'),
            value: this.errors[key].map(o => o.replace('Username', 'Name')),
          }
        })
      : null
*/
    return (
      <RegisterContainer>
        <LogoWrapper top={10}>
          <LogoImg src={sportocoLogo} width={30} alt="sportoco logo" top={7} />
          <LogoImg
            src={playalongLogo}
            width={50}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>
        <FadeInSection>
          <TextWrapper>
            <Text>Register as a founding</Text>
            <Text bold>ambassador</Text>
          </TextWrapper>
          <FormWrapper onSubmit={this.formSubmit.bind(this)}>
            <FormFieldSet>
              <FormInput
                type="text"
                placeholder="FULL NAME *"
                value={values.name}
                onChange={this.handleNameChange}
                valid={this.validName(values.name)}
              />
              <FieldDecorator valid={this.validName(values.name)} />
            </FormFieldSet>

            <FormFieldSet>
              <FormInput
                type="email"
                placeholder="E-MAIL *"
                value={values.email}
                onChange={this.handleEmailChange}
                valid={this.validEmail(values.email)}
              />
              <FieldDecorator valid={this.validEmail(values.email)} />
            </FormFieldSet>

            <FormFieldSet ref={ref => (this.lastField = ref)}>
              <FormInput
                type="text"
                placeholder="PHONE"
                value={values.phone}
                onChange={this.handlePhoneChange}
                valid={this.validPhone(values.phone)}
              />
              <FieldDecorator valid={this.validPhone(values.phone)} />
            </FormFieldSet>
            <Errors notError top={this.errorLocation}>
              <div>OPTIONAL</div>
            </Errors>
            {/*
            {errors ? (
              <Errors top={this.errorLocation + 30}>
                {errors[0].value.map(v => <div key={v}>{v}</div>)}
              </Errors>
            ) : null}
*/}

            <ButtonWrapper>
              <Button
                handleButtonClick={this.formSubmit.bind(this)}
                text={'BEGIN'}
                inherit
                disabled={
                  !(
                    this.validName(values.name) &&
                    this.validEmail(values.email) &&
                    (!values.phone || this.validPhone(values.phone))
                  )
                }
              />
            </ButtonWrapper>
          </FormWrapper>
          <TextWrapperBottom>
            <div>
              {"We'll"} notify you by <Bold>e-mail</Bold>{' '}
              {this.validPhone(values.phone) ? (
                <span>
                  {' '}
                  & <Bold>phone</Bold>
                </span>
              ) : null}
            </div>
            <div>
              to play along in{' '}
              <Bold>
                <Red>live</Red> events
              </Bold>
            </div>
          </TextWrapperBottom>
        </FadeInSection>
        <Footer>Ambassador Demo 1.0v</Footer>
      </RegisterContainer>
    )
  }
}
export default withRouter(Register)

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

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const Bold = styled.span`
  font-family: pamainbold;
`

const Red = styled.span`
  color: #ed1c24;
`

const TextWrapper = styled.div`
  color: white;
  animation: 1s ${FadeIn} forwards;
  text-align: center;
  text-transform: uppercase;
  font-family: pamainlight;
  font-size: ${props => vhToPx(6)};
  line-height: 1;
  margin-bottom: 15px;
`

const TextWrapperBottom = styled.div`
  color: white;
  animation: 1s ${FadeIn} forwards;
  text-align: center;
  text-transform: uppercase;
  font-family: pamainlight;
  margin-top: 20px;
  line-height: 1;
  font-size: ${props => vhToPx(4.5)};
`

const Text = styled.div`
  ${props =>
    props.bold
      ? 'color:#efdf18;font-family:pamainbold;'
      : 'font-size:' + vhToPx(4.5) + ';'};
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

const FadeInSection = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
`

const ButtonWrapper = styled.div`
  animation: 1s ${FadeIn} forwards;
  margin-top: 8%;
  width: 50%;
`

const FormInput = styled.input`
  text-transform: uppercase;
  ${props =>
    props.valid === undefined
      ? ''
      : `color:#${props.valid ? '2fc12f' : 'ed1c24'};`} font-family: pamainbold;
  width: 100%;
  margin-bottom: 10px;
  height: ${props => vhToPx(7)};
  padding-left: 10%;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: ${props => vhToPx(3)};
`

const FormFieldSet = styled.fieldset`
  position: relative;
  width: 70%;
  border-radius: 5px;
  border: none;
  height: ${props => vhToPx(7)};
  margin-bottom: 10px;
`

const FormWrapper = styled.form`
  width: inherit;
  animation: 1s ${FadeIn} forwards;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  position: relative;
`

const RegisterContainer = styled.div`
  // padding-top: 20%;
  // z-index: 10;
  // font-family: pamainregular;
  // display: flex;
  // align-items: center;
  // flex-direction: column;
  // width: 100%;
  // height: 100vh;
  // justify-content: center;

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
  animation: 1s ${FadeIn} forwards;
  color: white;
`
