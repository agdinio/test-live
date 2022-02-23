import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import icon_arrow_right from '@/assets/images/icon-arrow.svg'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { extendObservable } from 'mobx'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import FieldDecorator from '@/Components/Signup/FieldDecorator'
import { vhToPx, maxHeight } from '@/utils'

@inject('NavigationStore', 'AuthStore')
@withRouter
@observer
class Key extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
      textAttr: {},
      formInputAttr: {},
      backAttr: {},
    })
  }

  showHideLoader(show) {
    if (show) {
      if (this.refLoader) {
        TweenMax.set(this.refLoader, { opacity: 1, zIndex: 100 })
      }
    } else {
      if (this.refLoader) {
        TweenMax.set(this.refLoader, { opacity: 0, zIndex: -100 })
      }
    }
  }

  goToRegister() {
    this.props.NavigationStore.setCurrentView('/register')
  }

  goToSignIn() {
    this.props.NavigationStore.setCurrentView('/login')
  }

  handleCodeChange(e) {
    /*
        this.props.AuthStore.setToken(e.target.value)
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.valid = undefined
        if (this.props.AuthStore.values.token) {
          this.timeout = setTimeout(() => {
            this.props.AuthStore.checkPlayerToken()
              .then(token => {
                this.valid = !!token
                if (this.valid) {
                  this.timeout = setTimeout(() => {
                    this.goToRegister()
                  }, 1500)
                }
              })
              .catch(e => {
                this.valid = false
              })
          }, 500)
        }
    */

    this.props.AuthStore.setToken(e.target.value)
    this.valid = undefined
  }

  handleEnterKey(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.showHideLoader(true)
      this.props.AuthStore.validateKey(
        e.target.value.trim().toUpperCase()
      ).then(positive => {
        if (positive) {
          this.valid = true
          this.props.isValid(true)
        } else {
          this.valid = false
          this.props.isValid(false)
        }
        this.showHideLoader(true)
      })
    }
  }

  componentWillMount() {
    this.textAttr['fontSize'] = vhToPx(4)

    this.formInputAttr['marginBottom'] = vhToPx(1.5)
    this.formInputAttr['height'] = vhToPx(7)
    this.formInputAttr['borderRadius'] = vhToPx(0.5)
    this.formInputAttr['fontSize'] = vhToPx(3)

    this.backAttr['fontSize'] = vhToPx(3.5)
    this.backAttr['marginLeft'] = vhToPx(1)
    this.backAttr['marginRight'] = vhToPx(1)
    this.backAttr['arrowSize'] = vhToPx(2.5)
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
              Insert your <Teal> Key code </Teal>
            </Text>
          </TextWrapper>
          <FormWrapper
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormFieldSet attr={this.formInputAttr}>
              <FormInput
                onChange={this.handleCodeChange.bind(this)}
                onKeyPress={this.handleEnterKey.bind(this)}
                valid={this.valid}
                value={this.props.AuthStore.values.token}
                type="text"
                placeholder="EXAMPLE: AMB000"
                attr={this.formInputAttr}
              />
              <FieldDecorator valid={this.valid} />
            </FormFieldSet>
            {this.valid !== undefined && !this.valid ? <ErrorText /> : null}
          </FormWrapper>
          <TextWrapper>
            <Text attr={this.textAttr}>
              sharing your <Teal>Key</Teal> grants
            </Text>
            <Text family={'pamainregular'} attr={this.textAttr}>
              {' '}
              bonus <Gold>tokens</Gold> & <Blue>Points</Blue>
            </Text>
            <Text attr={this.textAttr}>
              {' '}
              to <Bold> you </Bold> and your <Bold> friends</Bold>
            </Text>
          </TextWrapper>
          <Back onClick={this.goToSignIn.bind(this)} attr={this.backAttr}>
            <BackText attr={this.backAttr}> No Key? </BackText>
            <BackText attr={this.backAttr}> Sign-in</BackText>
            <BackArrow>
              <Arrow src={icon_arrow_right} alt="" attr={this.backAttr} />
            </BackArrow>
          </Back>
        </FadeInSection>
        {/*
        <Footer>Ambassador Demo 1.0v</Footer>
*/}
      </Container>
    )
  }
}
export default withRouter(Key)

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
  height: ${props => props.attr.arrowSize};
`

const BackArrow = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  //margin-bottom: 2.5px;
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
  border-radius: ${props => vhToPx(0.5)};
  border: none;
  height: ${props => vhToPx(7)};
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
  font-size: ${props => (props.attr && props.attr.fontSize) || vhToPx(4)};
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
  background-color: transparent;
  opacity: 0;
`
