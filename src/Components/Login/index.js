import React, { Component } from 'react'
import { extendObservable } from 'mobx'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { TweenMax } from 'gsap'
import icon_arrow_right from '@/assets/images/icon-arrow.svg'
import styled, { keyframes } from 'styled-components'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import Button from '@/Components/Button'
import { PACircle } from '@/Components/PACircle'
import { vhToPx, maxHeight, validEmail } from '@/utils'

@inject('AuthStore', 'NavigationStore', 'ProfileStore')
@observer
class Login extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      error: null,
      errorLocation: 0,
      isLoggingIn: false,
      valid: undefined,
      formInputAttr: {},
      textWrapperAttr: {},
      textSignInAttr: {},
      textAmbAttr: {},
      textWrapperBottomAttr: {},
      backAttr: {},
      footerAttr: {},
    })
  }

  componentWillMount() {
    this.setAttrs()
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

  setAttrs() {
    this.formInputAttr['height'] = vhToPx(7)
    this.formInputAttr['fontSize'] = vhToPx(3)
    this.formInputAttr['marginBottom'] = vhToPx(1.5)
    this.formInputAttr['borderRadius'] = vhToPx(0.5)

    this.textWrapperAttr['marginBottom'] = vhToPx(1.5)
    this.textSignInAttr['fontSize'] = vhToPx(4.5)
    this.textAmbAttr['fontSize'] = vhToPx(6)

    this.textWrapperBottomAttr['marginTop'] = vhToPx(3)
    this.textWrapperBottomAttr['fontSize'] = vhToPx(3.2)

    this.backAttr['fontSize'] = vhToPx(3.5)
    this.backAttr['BackTextMarginLeft'] = vhToPx(1)
    this.backAttr['BackTextMarginRight'] = vhToPx(1)
    this.backAttr['arrowSize'] = vhToPx(3)

    this.footerAttr['fontSize'] = vhToPx(1.5)
  }

  showHideLoader(show) {
    if (show) {
      if (this.refLoader) {
        TweenMax.set(this.refLoader, { opacity: 1, zIndex: 100 })
        ReactDOM.unmountComponentAtNode(this.refLoader)
        ReactDOM.render(<PACircle size={8} />, this.refLoader)
      }
    } else {
      if (this.refLoader) {
        TweenMax.set(this.refLoader, { opacity: 0, zIndex: -100 })
        ReactDOM.unmountComponentAtNode(this.refLoader)
      }
    }
  }

  handleEmailChange = e => this.props.AuthStore.setEmail(e.target.value)
  handlePhoneChange = e => {
    const phone = e.target.value.replace(/[^0-9-]/g, '')
    if (/[0-9]*/.test(phone) && phone.length <= 12) {
      this.props.AuthStore.setPhone(
        phone.length === 3 || phone.length === 7 ? `${phone}-` : phone
      )
    }
  }
  formSubmit() {
    this.showHideLoader(true)
    this.isLoggingIn = true
    const { phone, email } = this.props.AuthStore.values
    if (phone || email) {
      this.error = undefined
      this.props.AuthStore.login()
        .then(d => {
          debugger
          this.props.ProfileStore.debitCurrenciesAtLaunch({
            currency: 'points',
            amount: d.currencies.points,
          })
          this.props.ProfileStore.debitCurrenciesAtLaunch({
            currency: 'stars',
            amount: d.currencies.stars,
          })
          this.props.ProfileStore.debitCurrenciesAtLaunch({
            currency: 'tokens',
            amount: d.currencies.tokens,
          })
          this.props.ProfileStore.profile = d
          this.props.NavigationStore.setCurrentView('/prebegin')
        })
        .catch(e => {
          this.error = 'Invalid email'
        })
        .finally(() => {
          this.isLoggingIn = false
          this.showHideLoader(false)
        })
    }
  }

  goToKey() {
    this.props.NavigationStore.setCurrentView('/keycode')
  }

  render() {
    const { values } = this.props.AuthStore
    return (
      <RegisterContainer>
        <Loader innerRef={ref => (this.refLoader = ref)} />
        <LogoWrapper top={7}>
          <LogoImg src={sportocoLogo} width={25} alt="sportoco logo" top={7} />
          <LogoImg
            src={playalongLogo}
            width={45}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>

        <FadeInSection>
          <TextWrapper attr={this.textWrapperAttr}>
            <Text font={'pamainlight'} attr={this.textSignInAttr}>
              Sign-In as an
            </Text>
            <Text font={'pamainbold'} color={'#efdf18'} attr={this.textAmbAttr}>
              ambassador
            </Text>
          </TextWrapper>
          <FormWrapper
            onSubmit={e => {
              e.preventDefault()
              this.formSubmit()
            }}
          >
            <FormFieldSet
              ref={ref => (this.lastField = ref)}
              attr={this.formInputAttr}
            >
              <FormInput
                type="email"
                placeholder="E-MAIL"
                value={values.email}
                onChange={this.handleEmailChange}
                attr={this.formInputAttr}
              />
            </FormFieldSet>
            {
              // <TextWrapper>
              //   <Text> or </Text>
              // </TextWrapper>
              // <FormFieldSet ref={ref => (this.lastField = ref)}>
              //   <FormInput
              //     type="text"
              //     placeholder="PHONE"
              //     value={values.phone}
              //     onChange={this.handlePhoneChange}
              //   />
              // </FormFieldSet>
            }
            <Errors top={this.errorLocation}>{this.error}</Errors>
            <ButtonWrapper>
              <Button
                handleButtonClick={this.formSubmit.bind(this)}
                text={'SIGN-IN'}
                disabled={
                  (!values.email && !values.phone) ||
                  !validEmail(values.email) ||
                  this.isLoggingIn
                }
                padding={{ left: 5, right: 5 }}
                arrowSize={3.5}
              />
            </ButtonWrapper>
          </FormWrapper>
          <TextWrapperBottom attr={this.textWrapperBottomAttr}>
            <div>
              {"We'll"} notify you by <Bold>e-mail</Bold>
            </div>
            <div>
              to play along in{' '}
              <Bold>
                <Red>live</Red> events
              </Bold>
            </div>
          </TextWrapperBottom>
          <Back onClick={this.goToKey.bind(this)} attr={this.backAttr}>
            <BackText attr={this.backAttr}> I have a Key </BackText>
            <BackArrow attr={this.backAttr}>
              <Arrow src={icon_arrow_right} alt="" attr={this.backAttr} />
            </BackArrow>
          </Back>
        </FadeInSection>
        <Footer attr={this.footerAttr}>Ambassador Demo 1.0v</Footer>
      </RegisterContainer>
    )
  }
}
export default Login

const Errors = styled.div`
  text-align: center;
  padding-left: 2%;
  font-family: pamainbold;
  font-size: 1.75vh;
  position: absolute;
  color: #ed1c24;
  top: ${props => props.top}px;
  width: 70%;
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

const TextWrapper_ = styled.div`
  animation: 1s ${FadeIn} forwards;
  color: white;
  text-align: center;
  text-transform: uppercase;
  font-family: pamainlight;
  font-size: ${props => vhToPx(6)};
  line-height: 1;
  margin-bottom: ${props => vhToPx(1.5)};
`

const TextWrapper = styled.div`
  text-align: center;
  //margin-bottom: ${props => vhToPx(1.5)};
  margin-bottom: ${props => props.attr.marginBottom};
`

const Text = styled.div`
  font-family: ${props => props.font};
  font-size: ${props => props.attr.fontSize};
  color: ${props => props.color || 'white'};
  text-transform: uppercase;
  line-height: 1;
`

const TextWrapperBottom = styled.div`
  animation: 1s ${FadeIn} forwards;
  color: white;
  text-align: center;
  text-transform: uppercase;
  font-family: pamainlight;
  //margin-top: ${props => vhToPx(3)};
  margin-top: ${props => props.attr.marginTop};
  line-height: 1;
  //font-size: ${props => vhToPx(3.2)};
  font-size: ${props => props.attr.fontSize};
`

const Text_ = styled.div`
  ${props =>
    props.bold
      ? 'color:#efdf18;font-family:pamainbold;'
      : `font-size:${vhToPx(4.5)};`};
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
  width: 100%;
  display: flex;
  justify-content: center;
`

const FormInput = styled.input`
  font-family: pamainbold;
  text-transform: uppercase;
  text-align: center;
  ${props =>
    props.valid === undefined
      ? ''
      : `color:#${props.valid ? '2fc12f' : 'ed1c24'}`};
  width: 100%;
  margin-bottom: ${props => props.attr.marginBottom};
  height: ${props => props.attr.height};
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  outline: none;
  font-size: ${props => props.attr.fontSize};
  backface-visibility: hidden;
`

const FormFieldSet = styled.fieldset`
  width: 70%;
  //border-radius: ${props => vhToPx(0.7)};
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  //height: ${props => vhToPx(6)};
  height: ${props => props.attr.height};
  margin-top: 5%;
  margin-bottom: 10%;
`

const FormWrapper = styled.form`
  animation: 1s ${FadeIn} forwards;
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  position: relative;
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
  font-size: ${props => props.attr.fontSize};
  animation: 1s ${FadeIn} forwards;
  color: white;
`

const Arrow = styled.img`
  height: ${props => props.attr.arrowSize};
`

const BackArrow = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  //margin-bottom: ${props => vhToPx(2.5)};
`

const Back = styled.div`
  animation: 1s ${FadeIn} forwards;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: ${props => props.attr.fontSize};
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
  margin-left: ${props => props.attr.BackTextMarginLeft};
  margin-right: ${props => props.attr.BackTextMarginRight};
`
