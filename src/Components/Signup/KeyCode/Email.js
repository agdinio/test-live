import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import { withRouter } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import FieldDecorator from '@/Components/Signup/FieldDecorator'
import BeginButton from '@/Components/Button'
import { PACircle } from '@/Components/PACircle'
import { vhToPx, maxHeight, validEmail } from '@/utils'

@inject('NavigationStore', 'AuthStore', 'ProfileStore')
@withRouter
@observer
class Email extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      error: null,
      textAttr: {},
      formInputAttr: {},
    })
  }

  handleEmailChange(e) {
    this.props.AuthStore.setEmail(e.target.value)
    this.valid = undefined
  }

  handleButtonClick() {
    this.showHideLoader(true)
    //--re this.props.AuthStore.setToken('')
    //--re this.register()

    this.loginOrRegister()
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

  loginOrRegister() {
    debugger
    this.props.AuthStore.login()
      .then(d => {
        debugger
        this.props.ProfileStore.profile = d
        this.props.NavigationStore.setCurrentView('/prebegin')
      })
      .catch(e => {
        this.error = e
      })
      .finally(_ => {
        this.showHideLoader(false)
      })
  }

  componentWillMount() {
    this.textAttr['fontSize'] = vhToPx(4)

    this.formInputAttr['borderRadius'] = vhToPx(0.5)
    this.formInputAttr['height'] = vhToPx(7)
    this.formInputAttr['fontSize'] = vhToPx(3)
    this.formInputAttr['marginBottom'] = vhToPx(1.5)
  }

  render() {
    return (
      <Container innerRef={this.props.reference}>
        <Loader innerRef={ref => (this.refLoader = ref)} />
        {/*
        <LogoWrapper top={10}>
          <LogoImg src={sportocoLogo} width={30} alt="sportoco logo" top={7} />
          <LogoImg
            src={playalongLogo}
            width={50}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>
*/}
        <FadeInSection>
          <TextWrapper top>
            <Text attr={this.textAttr}>
              {' '}
              Insert your <Teal> E-mail </Teal>
            </Text>
          </TextWrapper>
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
                type="text"
                placeholder="E-MAIL"
                attr={this.formInputAttr}
              />
              <FieldDecorator valid={this.valid} />
            </FormFieldSet>

            <Errors>{this.error}</Errors>
            <ButtonWrapper>
              <BeginButton
                text="BEGIN"
                handleButtonClick={this.handleButtonClick.bind(this)}
                disabled={!validEmail(this.props.AuthStore.values.email)}
                padding={{ left: 6, right: 6 }}
                arrowSize={3.5}
              />
            </ButtonWrapper>
          </FormWrapper>
        </FadeInSection>
        {/*
        <Footer>Ambassador Demo 1.0v</Footer>
*/}
      </Container>
    )
  }
}
export default withRouter(Email)

const FadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`

const ErrorText = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  top: ${props => vhToPx(7)};
  font-size: ${props => vhToPx(2)};
  text-transform: uppercase;
  color: #ed1c24;
  font-family: pamainbold;
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
  margin-bottom: ${props => props.attr.marginBottom};
  height: ${props => props.attr.height};
  text-align: center;
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  outline: none;
  font-size: ${props => props.attr.fontSize};
  text-transform: uppercase;
`

const FormFieldSet = styled.fieldset`
  width: 70%;
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  height: ${props => props.attr.height};
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
`

const Bold = styled.span`
  font-family: pamainbold;
  ${props => (props.inside ? 'margin-left:5px;' : '')};
`
const TextWrapper = styled.div`
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

const Text = styled.div`
  //font-size: ${props => props.size || 4}vh;
  font-size: ${props => props.attr.fontSize};
  ${props => (props.family ? `font-family:${props.family};` : '')};
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
  margin-bottom: 2vh;
  max-width: ${props => props.width / 0.2}px;
`

const Container = styled.div`
  // width: inherit;
  // height: inherit;
  width: 100%;
  height: ${props => maxHeight};
  z-index: 10;
  font-family: pamainregular;
  position: absolute;
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
  margin-top: 5%;
`

const ButtonWrapper = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  margin-top: 5%;
`

const Footer = styled.div`
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

const Errors = styled.div`
  width: 100%;
  margin-top: 2%;
  font-family: pamainbold;
  font-size: ${props => vhToPx(1.75)};
  color: #ed1c24;
  text-align: center;
  text-transform: uppercase;
`

const Errors__ = styled.div`
  text-align: center;
  padding-left: 2%;
  font-family: pamainbold;
  font-size: ${props => vhToPx(1.75)};
  position: absolute;
  color: #ed1c24;
  margin-bottom: ${props => vhToPx(1)};
  width: 70%;
  display: flex;
  flex-direction: column;

  background: green;
`
