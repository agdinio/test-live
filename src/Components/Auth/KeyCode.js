import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { vhToPx, responsiveDimension } from '@/utils'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import Button from '@/Components/Button'
import FieldDecorator from './FieldDecorator'

@inject('AuthStore')
@observer
export default class KeyCode extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
    })

    this.textAttr = {
      titleFontSize: responsiveDimension(5),
      waitMessageFontSize: responsiveDimension(2),
      iHaveFontSize: responsiveDimension(4),
    }

    this.inputAttr = {
      fontSize: responsiveDimension(3),
      height: responsiveDimension(7),
      borderRadius: responsiveDimension(0.5),
    }

    this.iHaveAttr = {
      top: vhToPx(70),
    }
  }

  handleCodeChange(e) {
    this.props.AuthStore.setToken(e.target.value)
    this.valid = undefined
  }

  handleContinueClick() {
    this.props.AuthStore.validateKey(
      this.props.AuthStore.values.token.trim().toUpperCase()
    ).then(positive => {
      if (positive && positive.valid) {
        this.valid = true
        setTimeout(() => {
          this.props.refGotoKeyEmail(true)
        }, 1000)
      } else {
        this.valid = false
      }
    })
  }

  handleGotoLoginClick() {
    this.props.refGotoLogin()
  }

  render() {
    return (
      <Container>
        <Wrapper innerRef={ref => (this.refKey = ref)}>
          <Section marginBottom={2}>
            <TextWrapper>
              <Text
                font={'pamainlight'}
                size={this.textAttr.titleFontSize}
                color={'#ffffff'}
              >
                insert the&nbsp;
              </Text>
              <Text
                font={'pamainextrabold'}
                size={this.textAttr.titleFontSize}
                color={'#19d1be'}
              >
                key code
              </Text>
            </TextWrapper>
          </Section>
          <Section marginBottom={3}>
            <FormWrapper
              onSubmit={e => {
                e.preventDefault()
              }}
            >
              <FormFieldSet>
                <FormInput
                  id={`text-keycode`}
                  onChange={this.handleCodeChange.bind(this)}
                  valid={this.valid}
                  value={this.props.AuthStore.values.token}
                  type="text"
                  placeholder="EXAMPLE: AMB000"
                  height={this.inputAttr.height}
                  borderRadius={this.inputAttr.borderRadius}
                  size={this.inputAttr.fontSize}
                />
                <FieldDecorator valid={this.valid} />
              </FormFieldSet>
            </FormWrapper>
          </Section>
          <Section marginBottom={10}>
            <ButtonWrapper>
              <Button
                refId={`button-keycode-continue`}
                text="CONTINUE"
                handleButtonClick={this.handleContinueClick.bind(this)}
                padding={{ top: 0.8, bottom: 0.8 }}
                arrowSize={3.5}
              />
            </ButtonWrapper>
          </Section>

          <Section style={{ position: 'absolute', top: this.iHaveAttr.top }}>
            <IHaveWrapper onClick={this.handleGotoLoginClick.bind(this)}>
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.textAttr.iHaveFontSize}
              >
                no key?&nbsp;
              </Text>
              <Text
                font={'pamainregular'}
                color={'#ffffff'}
                size={this.textAttr.iHaveFontSize}
              >
                sign-in&nbsp;
              </Text>
              <Arrow src={ArrowIcon} />
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
  width: 70%;
  border: none;
  margin-top: ${props => responsiveDimension(props.marginTop) || 0};
  margin-bottom: ${props => responsiveDimension(props.marginBottom) || 0};
`

const FormInput = styled.input`
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color:#${props.valid ? '2fc12f' : 'ed1c24'}`};
  font-family: pamainbold;
  width: 100%;
  height: ${props => props.height};
  text-align: center;
  border-radius: ${props => props.borderRadius};
  border: none;
  outline: none;
  font-size: ${props => props.size};
  text-transform: uppercase;
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
