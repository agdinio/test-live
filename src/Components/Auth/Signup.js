import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { vhToPx, responsiveDimension, validEmail } from '@/utils'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import ArrowIconBlueGreen from '@/assets/images/icon-arrow-bluegreen.svg'
import FieldDecorator from './FieldDecorator'
import ClaimButton from '@/Components/Button'

@inject('AuthStore', 'ProfileStore')
@observer
export default class Signup extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      //errors: null,
      errorMessage: null,
      errorLocation: 0,
      touched: {
        userName: false,
        email: false,
        password: false,
        confirmPassword: false,
        firstName: false,
        lastName: false,
        phone: false,
      },
    })

    this.textAttr = {
      fontSize: responsiveDimension(5),
      subTextFontSize: responsiveDimension(5),
      iHaveFontSize: responsiveDimension(4),
    }
    this.inputAttr = {
      fontSize: responsiveDimension(3),
      height: responsiveDimension(7),
      borderRadius: responsiveDimension(0.4),
    }
  }

  handleInputChange = e => {
    this.touched[e.target.name] = true
    this.props.AuthStore.values[e.target.name] = e.target.value
  }

  handleEmailChange = e => {
    this.touched.email = true
    this.props.AuthStore.setEmail(e.target.value)
  }

  validInput = inputName => {
    if (inputName) {
      if ('email' === inputName) {
        if (!this.touched.email) {
          return undefined
        }
        const reg = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
        return (
          !!this.props.AuthStore.values.email &&
          !!this.props.AuthStore.values.email.match(reg)
        )
      }

      if (!this.touched[inputName]) {
        return undefined
      }
      return !!this.props.AuthStore.values[inputName]
    }
  }

  isNumber(e) {
    let code = e.which

    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault()
    }
  }

  handleCloseErrorMessage() {
    this.errorMessage = null
  }

  formSubmit() {
    const errors = []
    let pass = ''
    let confirmPass = ''

    for (let key in this.props.AuthStore.values) {
      if (this.props.AuthStore.values.hasOwnProperty(key)) {
        if (!'token'.match(new RegExp(key, 'gi'))) {
          const splitted = key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1)
          let newKey = ''
          if (this.props.AuthStore.values[key].length < 2) {
            for (let i = 0; i < splitted.length; i++) {
              newKey += ' ' + splitted[i]
            }
            errors.push(newKey)
          } else {
            if (key === 'password') {
              pass = this.props.AuthStore.values[key]
            }
            if (key === 'confirmPassword') {
              confirmPass = this.props.AuthStore.values[key]
            }
          }
        }
      }
    }

    if (!validEmail(this.props.AuthStore.values.email)) {
      errors.push('email format invalid')
    }

    if (
      this.props.AuthStore.values.phone.length > 0 &&
      this.props.AuthStore.values.phone.length < 10
    ) {
      errors.push('phone must be at least 10 digits')
    }

    if (pass && confirmPass && pass !== confirmPass) {
      errors.push('password does not match')
    }

    if (errors.length > 0) {
      this.errorMessage = (
        <ErrorMessageComp
          items={errors}
          close={this.handleCloseErrorMessage.bind(this)}
        />
      )

      return
    }

    this.props.AuthStore.signup()
      .then(next => {
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

        setTimeout(() => {
          this.error = null
        }, 3000)
      })

    /*
    let remaingCurrencies = { points: 0, tokens: 0, stars: 0 }
    if (
      this.props.ProfileStore.profile &&
      this.props.ProfileStore.profile.currencies
    ) {
      remaingCurrencies = this.props.ProfileStore.profile.currencies
    }

    const { firstName, lastName, email, phone } = this.props.AuthStore.values
    this.props.AuthStore.values.password = 'AmbassadorPass.v1'
    if (firstName && (email || phone)) {
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
*/
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
        {this.errorMessage}

        <Wrapper>
          <Scrolling>
            <Section marginTop={5} marginBottom={3}>
              {/*
              <TextWrapper marginBottom={1}>
                <Text
                  font={'pamainbold'}
                  color={'#17c5ff'}
                  size={this.textAttr.fontSize}
                >
                  sign-up
                </Text>
              </TextWrapper>
*/}
            </Section>
            <Section marginBottom={6}>
              <FormWrapper onSubmit={this.formSubmit.bind(this)}>
                <FormFieldSet marginBottom={1.5}>
                  <FormInput
                    name="email"
                    id="email"
                    type="email"
                    placeholder="E-MAIL*"
                    value={values.email}
                    onChange={this.handleInputChange}
                    valid={this.validInput('email')}
                    size={this.inputAttr.fontSize}
                    height={this.inputAttr.height}
                    borderRadius={this.inputAttr.borderRadius}
                  />
                  <FieldDecorator valid={this.validInput('email')} />
                </FormFieldSet>
                <FormFieldSet marginBottom={1.5}>
                  <FormInput
                    name="password"
                    id="password"
                    type="password"
                    placeholder="PASSWORD*"
                    value={values.password}
                    onChange={this.handleInputChange}
                    valid={this.validInput('password')}
                    size={this.inputAttr.fontSize}
                    height={this.inputAttr.height}
                    borderRadius={this.inputAttr.borderRadius}
                  />
                  <FieldDecorator valid={this.validInput('password')} />
                </FormFieldSet>
                <FormFieldSet marginBottom={1.5}>
                  <FormInput
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    placeholder="CONFIRM PASSWORD*"
                    value={values.confirmPassword}
                    onChange={this.handleInputChange}
                    valid={this.validInput('confirmPassword')}
                    size={this.inputAttr.fontSize}
                    height={this.inputAttr.height}
                    borderRadius={this.inputAttr.borderRadius}
                  />
                  <FieldDecorator valid={this.validInput('confirmPassword')} />
                </FormFieldSet>
                <FormFieldSet marginBottom={1.5}>
                  <FormInput
                    name="firstName"
                    id="firstName"
                    type="text"
                    placeholder="FIRST NAME*"
                    value={values.firstName}
                    onChange={this.handleInputChange}
                    valid={this.validInput('firstName')}
                    size={this.inputAttr.fontSize}
                    height={this.inputAttr.height}
                    borderRadius={this.inputAttr.borderRadius}
                  />
                  <FieldDecorator valid={this.validInput('firstName')} />
                </FormFieldSet>
                <FormFieldSet marginBottom={1.5}>
                  <FormInput
                    name="lastName"
                    id="lastName"
                    type="text"
                    placeholder="LAST NAME*"
                    value={values.lastName}
                    onChange={this.handleInputChange}
                    valid={this.validInput('lastName')}
                    size={this.inputAttr.fontSize}
                    height={this.inputAttr.height}
                    borderRadius={this.inputAttr.borderRadius}
                  />
                  <FieldDecorator valid={this.validInput('lastName')} />
                </FormFieldSet>
                <FormFieldSet innerRef={ref => (this.lastField = ref)}>
                  <FormInput
                    name="phone"
                    id="phone"
                    placeholder="PHONE"
                    value={values.phone}
                    onChange={this.handleInputChange}
                    valid={this.validInput('phone')}
                    size={this.inputAttr.fontSize}
                    height={this.inputAttr.height}
                    borderRadius={this.inputAttr.borderRadius}
                    onKeyPress={this.isNumber.bind(this)}
                  />
                  <FieldDecorator valid={this.validInput('phone')} />
                </FormFieldSet>
                <Errors notError top={this.errorLocation}>
                  <div>OPTIONAL</div>
                </Errors>
              </FormWrapper>
            </Section>
            <Section marginBottom={5}>
              <ButtonWrapper>
                <ClaimButton
                  refId={`button-register`}
                  text="REGISTER"
                  height={10}
                  handleButtonClick={this.formSubmit.bind(this)}
                  // disabled={
                  //   !(
                  //     this.validFirstName(values.firstName) &&
                  //     this.validLastName(values.lastName) &&
                  //     this.validEmail(values.email) &&
                  //     (!values.phone || this.validPhone(values.phone))
                  //   )
                  // }
                  disabled={!this.validInput}
                  padding={{ top: 0.8, bottom: 0.8, left: 5, right: 5 }}
                  arrowSize={3.5}
                  marginLeftBtnIcon={3}
                />
              </ButtonWrapper>
            </Section>
            <Section marginBottom={5}>
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
          </Scrolling>
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

const Scrolling = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0.1)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
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
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  position: relative;
`

const FormFieldSet = styled.fieldset`
  position: relative;
  width: 75%;
  border: none;
  margin-top: ${props => responsiveDimension(props.marginTop) || 0};
  margin-bottom: ${props => responsiveDimension(props.marginBottom) || 0};
`

const FormInput = styled.input`
  font-family: pamainbold;
  font-size: ${props => props.size};
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color:#${props.valid ? '2fc12f' : 'ed1c24'}`};
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
  font-size: ${props =>
    props.notError ? responsiveDimension(2) : responsiveDimension(2.5)};
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
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const Arrow = styled.img`
  height: ${props => responsiveDimension(2.7)};
  margin-bottom: ${props => responsiveDimension(0.4)};
`

const MessageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  position: absolute;
  z-index: 100;
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  width: 100%;
  height: ${props => vhToPx(props.height || 20)};
  display: flex;
  position: relative;
`

const Middle = styled.div`
  width: 100%;
  height: ${props => vhToPx(props.height)};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: center;
  position: relative;
`

const Bottom = styled.div`
  width: 100%;
  height: ${props => vhToPx(props.height)};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: ${props => props.alignItems || 'center'};
  position: relative;
`

const ErrMsgSection = styled.div`
  width: 100%;
  ${props => (props.heightInPct ? `height:${props.heightInPct}%` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`

const ErrMsgText = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: 1;
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
`

const ErrorMessageComp = props => {
  return (
    <MessageContainer onClick={props.close}>
      <Top>
        <ErrMsgSection
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '40%' }}
        >
          <TextWrapper>
            <ErrMsgText
              font={'pamainlight'}
              size={4.5}
              color={'#ffffff'}
              uppercase
            >
              there are&nbsp;
            </ErrMsgText>
            <ErrMsgText
              font={'pamainbold'}
              size={4.5}
              color={'#c61818'}
              uppercase
            >
              errors
            </ErrMsgText>
          </TextWrapper>
        </ErrMsgSection>
        <ErrMsgSection
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '65%' }}
        >
          <TextWrapper>
            <ErrMsgText
              font={'pamainregular'}
              size={4.5}
              color={'#ffffff'}
              uppercase
            >
              in your information
            </ErrMsgText>
          </TextWrapper>
        </ErrMsgSection>
      </Top>
      <Middle height={55}>
        {(props.items || []).map(error => {
          return (
            <ErrMsgText
              key={error}
              font="pamainregular"
              color={'#c61818'}
              size="3.5"
              uppercase
              style={{ marginBottom: vhToPx(1) }}
            >
              {error}
            </ErrMsgText>
          )
        })}
      </Middle>
      <Bottom height={19}>
        <ErrMsgText font="pamainlight" color={'#ffffff'} size="3.5" uppercase>
          tap anywhere to correct
        </ErrMsgText>
      </Bottom>
    </MessageContainer>
  )
}
