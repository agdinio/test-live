import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import FieldDecorator from './FieldDecorator'
import ClaimButton from '@/Components/Button'
import {
  vhToPx,
  validEmail,
  responsiveDimension,
  evalImage,
  formatPhone,
} from '@/utils'
import agent from '@/Agent'
import PaActivityComponent from '@/Components/Common/PaActivityComponent'
import CountryCode from '@/Components/Common/CountryCode'
@inject('AuthStore', 'ProfileStore', 'GameStore')
@observer
export default class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      isAuthenticating: false,
      textAttr: {},
      formInputAttr: {},
      error: null,
      showmessage: true,
      hidesection: false,
      showloader: false,
      showemail: true,
      showphone: false,
      showemailNotify: true,
      showphoneNotify: false,
      verificationPhone: false,
      codeValid: false,
      verificationreadonly: true,
    })

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
    this.props.AuthStore.setForgotPasswordEmail(e.target.value)
    this.valid = undefined
  }

  handlePasswordChange(e) {
    this.props.AuthStore.setPassword(e.target.value)
    this.valid = undefined
  }

  handlePhoneChange(e) {
    this.props.AuthStore.setForgotPasswordphone(e.target.value)
    this.valid = undefined
  }
  async handleverificationChange(e) {
    await this.props.AuthStore.setForgotPasswordphoneverification(
      e.target.value
    )
    if (this.props.AuthStore.forgotdetails.verificationCode.length === 6) {
      //alert(this.props.AuthStore.forgotdetails.verificationCode)
      this.showloader = true
      const updatedMobile = this.props.AuthStore.forgotdetails.forgotphone
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .replace(/-/g, '')
        .replace(/\s/g, '')
      this.props.AuthStore.codeVerification({
        username: (updatedMobile || '').toLowerCase(),
        country_code: this.props.AuthStore.forgotdetails.countryCode,
        serviceSid: this.props.AuthStore.forgotdetails.serviceSid,
        code: this.props.AuthStore.forgotdetails.verificationCode,
      })
        .then(next => {
          this.codeValid = true
          this.verificationreadonly = false
          this.showloader = false
        })
        .catch(err => {
          console.log('errror', err)
          this.showloader = false
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
          this.showloader = false
        })
    } else {
      this.codeValid = false
    }
  }
  handleverificationpasswordChange(e) {
    this.props.AuthStore.setForgotverificationpassword(e.target.value)
    this.valid = undefined
  }
  handleEnterKey(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.sendEmail()
    }
  }

  handlePhoneEnterKey(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.sendEmail()
    }
  }

  handleButtonClick(e, type) {
    if (e === 'email') {
      this.sendEmail()
    } else if (e === 'phone') {
      this.sendPhoneVerification()
    } else if (e === 'code_verify') {
      this.verifyCode()
    }
  }
  /* check email is present or not and send email */

  async sendEmail() {
    this.showloader = true
    this.props.AuthStore.forgotPassword({
      username: (
        this.props.AuthStore.forgotdetails.forgotemail || ''
      ).toLowerCase(),
      type: 'email',
    })
      .then(next => {
        this.hidesection = true
        this.showmessage = false
        this.showloader = false
      })
      .catch(err => {
        console.log('errror', err)
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
        this.showloader = false
      })
  }

  /* check phone is present or not and send verification code to user */

  async sendPhoneVerification() {
    this.showloader = true
    const updatedMobile = this.props.AuthStore.forgotdetails.forgotphone
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/-/g, '')
      .replace(/\s/g, '')
    this.props.AuthStore.forgotPassword({
      username: (updatedMobile || '').toLowerCase(),
      country_code: this.props.AuthStore.forgotdetails.countryCode,
      type: 'phone',
    })
      .then(next => {
        this.hidesection = true
        this.showloader = false
        this.verificationPhone = true
        this.showphone = false
      })
      .catch(err => {
        console.log('errror', err)
        if (err) {
          if (err.errno && err.errno === 1045) {
            this.error =
              'invalid database configuration. please contact system administrator.'
          } else if (err.message) {
            this.error = err.message
          } else {
            this.error = err
          }
        } else {
          this.error = 'please contact system administrator.'
        }
        setTimeout(() => {
          this.error = null
        }, 3000)
        this.showloader = false
      })
  }

  /* Code verify  */
  async verifyCode() {
    this.showloader = true
    const updatedMobile = this.props.AuthStore.forgotdetails.forgotphone
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/-/g, '')
      .replace(/\s/g, '')
    this.props.AuthStore.resetPassword({
      phone: (updatedMobile || '').toLowerCase(),
      country_code: this.props.AuthStore.forgotdetails.countryCode,
      password: this.props.AuthStore.forgotdetails.verificationPassword,
    })
      .then(next => {
        console.log('next', next)
        this.showloader = false
        localStorage.removeItem('ANONYMOUS_USER')
        this.props.handleIsLoggedIn(true)
        //this.props.refGotoLogin()
      })
      .catch(err => {
        this.showloader = false
        console.log('errror', err)
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
        this.showloader = false
      })
  }

  handleGotoLoginClick() {
    this.props.refGotoLogin()
  }

  componentWillMount() {
    this.textAttr['fontSize'] = responsiveDimension(5)
    this.textAttr['subTextFontSize'] = responsiveDimension(5)

    this.formInputAttr['borderRadius'] = responsiveDimension(0.4)
    this.formInputAttr['height'] = responsiveDimension(7)
    this.formInputAttr['marginBottom'] = responsiveDimension(1.5)
    this.formInputAttr['fontSize'] = responsiveDimension(3)
  }

  returncancel() {
    this.hidesection = false
    this.showmessage = true
  }
  handleCountryCodeChange(e) {
    this.props.AuthStore.forgotdetails.countryCode = e.target.value
  }
  isNumber(e) {
    let code = e.which

    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault()
    }
  }
  handleInputChange(e) {
    let val = e.target.value

    if ('mobile' === e.target.name) {
      if (
        e.target.value.length === 1 &&
        e.target.value.toString().charAt(0) === '('
      ) {
        val = ''
      }
    }

    this.props.AuthStore.forgotdetails.forgotphone = val
  }

  handleInputBlur(isInputEditing, e) {
    console.log('isInputEditing, e', isInputEditing, e)
  }
  render() {
    if (this.showloader) {
      return <PaActivityComponent size="4" withText />
    }
    let { ProfileStore, AuthStore } = this.props
    return (
      <Container>
        <Wrapper>
          {this.hidesection ? null : (
            <div style={{ width: '100%' }}>
              <Section className="top-class">
                <TextWrapper>
                  <Text
                    font={'pamainbold'}
                    color={'#17c5ff'}
                    size={this.textAttr.fontSize}
                  >
                    forgot password
                  </Text>
                </TextWrapper>
                <br />
                <br />
                <InnerSection
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: vhToPx(2),
                  }}
                >
                  <NotifyText color={'#17c5ff'} content={'e-mail'}>
                    {this.showemailNotify ? (
                      <NotifyIcon
                        src={evalImage(`input_feld-verified-profile.svg`)}
                        size={4}
                      />
                    ) : (
                      <NotifyEmpty
                        size={4}
                        onClick={e => {
                          this.showemail = true
                          this.showemailNotify = true
                          this.showphoneNotify = false
                          this.showphone = false
                        }}
                      ></NotifyEmpty>
                    )}
                  </NotifyText>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <NotifyText color={'#17c5ff'} content={'Phone'}>
                    {this.showphoneNotify ? (
                      <NotifyIcon
                        src={evalImage(`input_feld-verified-profile.svg`)}
                        size={4}
                      />
                    ) : (
                      <NotifyEmpty
                        size={4}
                        onClick={e => {
                          this.showphoneNotify = true
                          this.showemailNotify = false
                          this.showemail = false
                          this.showphone = true
                        }}
                      ></NotifyEmpty>
                    )}
                  </NotifyText>
                  <br />
                </InnerSection>
              </Section>
            </div>
          )}

          {this.showemail ? (
            this.hidesection ? null : (
              <div style={{ width: '100%' }}>
                <Section marginBottom={2} hidden={this.hidesection}>
                  <Errors>{this.error}</Errors>
                  <FormWrapper
                    onSubmit={e => {
                      e.preventDefault()
                    }}
                  >
                    <FormFieldSet attr={this.formInputAttr}>
                      <FormInput
                        id={`email-forgotpassword`}
                        onChange={this.handleEmailChange.bind(this)}
                        onKeyPress={this.handleEnterKey.bind(this)}
                        valid={this.valid}
                        value={this.props.AuthStore.forgotdetails.forgotemail}
                        type="email"
                        placeholder="E-MAIL"
                        readOnly={this.isAuthenticating ? true : false}
                        attr={this.formInputAttr}
                      />
                      <FieldDecorator valid={this.valid} />
                    </FormFieldSet>
                  </FormWrapper>
                </Section>
                <Section marginBottom={10} hidden={this.hidesection}>
                  <ButtonWrapper>
                    <ClaimButton
                      refId={`button-forgotpassword`}
                      text="RESET PASSWORD"
                      height={10}
                      handleButtonClick={this.handleButtonClick.bind(
                        this,
                        'email'
                      )}
                      disabled={
                        !validEmail(
                          this.props.AuthStore.forgotdetails.forgotemail
                        ) || this.isAuthenticating
                      }
                      padding={{ top: 0.8, bottom: 0.8, left: 5, right: 5 }}
                      arrowSize={3.5}
                      marginLeftBtnIcon={3}
                    />
                  </ButtonWrapper>
                </Section>
              </div>
            )
          ) : null}

          {this.showphone ? (
            <div style={{ width: '100%' }}>
              <Section marginBottom={2}>
                <Errors>{this.error}</Errors>
                <FormWrapper
                  onSubmit={e => {
                    e.preventDefault()
                  }}
                  style={{ width: '92%' }}
                >
                  <PhoneWrap>
                    <CountryCode
                      onChange={this.handlePhoneChange.bind(this)}
                      countryCodeValue={AuthStore.forgotdetails.countryCode}
                      countryCodeChange={this.handleCountryCodeChange.bind(
                        this
                      )}
                    />
                    <PhoneFormInput
                      id="mobile"
                      name="mobile"
                      type="text"
                      value={formatPhone(AuthStore.forgotdetails.forgotphone)}
                      placeholder="PHONE"
                      maxLength="14"
                      onChange={this.handleInputChange.bind(this)}
                      onBlur={this.handleInputBlur.bind(this, 'isPhoneEditing')}
                      onKeyPress={this.isNumber.bind(this)}
                    />
                  </PhoneWrap>
                </FormWrapper>
              </Section>
              <Section marginBottom={10} hidden={this.hidesection}>
                <ButtonWrapper>
                  <ClaimButton
                    refId={`button-forgotpassword`}
                    text="RESET PASSWORD"
                    height={10}
                    handleButtonClick={this.handleButtonClick.bind(
                      this,
                      'phone'
                    )}
                    onKeyPress={this.handleButtonClick.bind(this, 'phone')}
                    /*  disabled={
                      !validEmail(
                        this.props.AuthStore.forgotdetails.forgotemail
                      ) || this.isAuthenticating
                    } */
                    padding={{ top: 0.8, bottom: 0.8, left: 5, right: 5 }}
                    arrowSize={3.5}
                    marginLeftBtnIcon={3}
                  />
                </ButtonWrapper>
              </Section>
            </div>
          ) : null}
          {this.hidesection ? null : (
            <div>
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
                  onClick={this.handleGotoLoginClick.bind(this)}
                  id={`link-to-login`}
                >
                  <Text
                    font={'pamainregular'}
                    color={'#ffffff'}
                    size={this.iHaveAttr.fontSize}
                  >
                    I have an account &nbsp;
                  </Text>
                  <Underline backgroundColor={'#ffffff'} />
                </IHaveWrapper>
              </Section>
            </div>
          )}

          {this.showmessage ? null : (
            <Section
              hidden={this.showmessage}
              height="80"
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ marginTop: '-148px', fontSize: '22px' }}
            >
              <CircleButton
                src={evalImage(`playalongnow-icon-email.svg`)}
                sizeInPct={50}
                backgroundColor={'#19d1be'}
                iconBackgroundColor={'#ffffff'}
              >
                <CommonIcon src={evalImage(`icon-arrow-emailsent.svg`)} />
              </CircleButton>
              <TextWrapper marginTop="3">
                <Text
                  font={'pamainlight'}
                  size={4.2}
                  color={'#ffffff'}
                  uppercase
                >
                  Password reset link is sent your email!
                </Text>
              </TextWrapper>
            </Section>
          )}
          <br />
          <br />
          <br />
          <br />
          {this.showmessage ? null : (
            <Section
              height="14"
              bottom="5"
              justifyContent="center"
              hidden={this.showmessage}
              onClick={() => {
                this.hidesection = false
                this.showmessage = true
                this.props.AuthStore.forgotdetails.forgotemail = ''
              }}
            >
              <TextWrapper onClick={() => this.returncancel.bind(this)}>
                <Text
                  font={'pamainlight'}
                  size={3.6}
                  color={'#ffffff'}
                  uppercase
                  style={{ fontSize: '15.6px' }}
                >
                  click here to return
                </Text>
              </TextWrapper>
            </Section>
          )}
          {this.verificationPhone ? (
            <div style={{ marginTop: '-160px' }}>
              <Section>
                <TextWrapper>
                  <Text
                    font={'pamainbold'}
                    color={'#17c5ff'}
                    size={this.textAttr.fontSize}
                  >
                    verification
                  </Text>
                </TextWrapper>
              </Section>
              <Section marginBottom={2}>
                <Errors>{this.error}</Errors>
                <FormWrapper
                  style={{ width: '180%' }}
                  onSubmit={e => {
                    e.preventDefault()
                  }}
                >
                  <FormFieldSet attr={this.formInputAttr}>
                    <FormInput
                      id={`code-forgotpassword`}
                      onChange={this.handleverificationChange.bind(this)}
                      onKeyPress={this.handleverificationChange.bind(this)}
                      valid={this.valid}
                      value={
                        this.props.AuthStore.forgotdetails.verificationCode
                      }
                      type="number"
                      placeholder="Code"
                      attr={this.formInputAttr}
                    />
                    <FieldDecorator valid={this.codeValid ? true : undefined} />
                    <Errors>* Code is sent your registered phone number</Errors>
                  </FormFieldSet>
                  <FormFieldSet attr={this.formInputAttr}>
                    <FormInput
                      id={`password-forgotpassword`}
                      onChange={this.handleverificationpasswordChange.bind(
                        this
                      )}
                      onKeyPress={this.handleverificationpasswordChange.bind(
                        this
                      )}
                      valid={this.valid}
                      value={
                        this.props.AuthStore.forgotdetails.verificationPassword
                      }
                      type="password"
                      placeholder="Password"
                      disabled={this.codeValid ? false : true}
                      attr={this.formInputAttr}
                    />
                    <FieldDecorator valid={this.valid} />
                  </FormFieldSet>
                </FormWrapper>
              </Section>
              <Section marginBottom={10}>
                <ButtonWrapper>
                  <ClaimButton
                    refId={`button-forgotpassword`}
                    text="REST PASSWORD"
                    height={10}
                    handleButtonClick={this.handleButtonClick.bind(
                      this,
                      'code_verify'
                    )}
                    onKeyPress={this.handleButtonClick.bind(
                      this,
                      'code_verify'
                    )}
                    padding={{ top: 0.8, bottom: 0.8, left: 5, right: 5 }}
                    arrowSize={3.5}
                    disabled={this.codeValid ? false : true}
                    marginLeftBtnIcon={3}
                  />
                </ButtonWrapper>
              </Section>
              <Section
                height="14"
                bottom="5"
                justifyContent="center"
                onClick={() => {
                  this.hidesection = false
                  this.showmessage = true
                  this.props.AuthStore.forgotdetails.forgotemail = ''
                  this.props.AuthStore.forgotdetails.forgotphone = ''
                  this.verificationPhone = false
                }}
              >
                <TextWrapper onClick={() => this.returncancel.bind(this)}>
                  <Text
                    font={'pamainlight'}
                    size={3.6}
                    color={'#ffffff'}
                    uppercase
                    style={{ fontSize: '15.6px' }}
                  >
                    click here to return
                  </Text>
                </TextWrapper>
              </Section>
            </div>
          ) : null}
        </Wrapper>
      </Container>
    )
  }
}

const NotifyEmpty = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: #ffffff;
  &:hover {
    cursor: pointer;
  }
  position: relative;
`
const CircleButton = styled.div`
  position: relative;
  width: ${props => responsiveDimension(10)};
  height: ${props => responsiveDimension(10)};
  border-radius: 50%;
  background-color: ${props => props.backgroundColor || '#ffffff'};
  cursor: pointer;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: ${props => props.iconBackgroundColor};
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 50%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: ${props => props.sizeInPct || 50}%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const CommonIcon = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(4)};
  height: ${props => responsiveDimension(4)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 50%;
  top: 50%;
  transform: translate(150%, -50%);
`
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
const NotifyText = styled.div`
  width: 100%;
  &:before {
    content: '${props => props.content}';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(4)};
    color: ${props => props.color};
    text-transform: uppercase;
    margin-right: ${props => responsiveDimension(1)};
    white-space:nowrap;
  }
  display: flex;
  align-items: center;
`

const NotifyIcon = styled.img`
  height: ${props => responsiveDimension(props.size)};
  &:hover {
    cursor: pointer;
  }
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
const InnerSection = styled.div`
  text-align: center;
  display: flex;
  ${props => (props.widthInPct ? `width:${props.widthInPct}%` : ``)};
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`
const PhoneWrap = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
`
const PhoneFormInput = styled.input`
  width: 80%;
  height: ${props => responsiveDimension(7)};
  border-top-right-radius: ${props => responsiveDimension(0.4)};
  border-bottom-right-radius: ${props => responsiveDimension(0.4)};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.5)};
  text-transform: uppercase;
  padding-left: 5%;
  color: #000000;
  border: none;
  outline: none;
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
