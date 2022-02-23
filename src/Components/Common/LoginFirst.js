import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax } from 'gsap'
import FieldDecorator from '@/Components/Signup/FieldDecorator'
import BeginButton from '@/Components/Button'
import { vhToPx, validEmail } from '@/utils'
import agent from '@/Agent'

@inject('AuthStore', 'ProfileStore')
@observer
export default class SuperbowlLoginFirst extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
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
    this.login()
  }

  login() {
    this.isAuthenticating = true
    this.props.AuthStore.login()
      .then(d => {
        this.valid = true
        this.props.ProfileStore.profile = d

        let _tokens = 0,
          _points = 0,
          _stars = 0
        const localStorageItem = agent.Storage.getItem(d.userId)

        if (localStorageItem) {
          if (localStorageItem.currencies) {
            if (localStorageItem.currencies.tokens) {
              _tokens = localStorageItem.currencies.tokens
            } else {
              _tokens = 500
              agent.Storage.creditCurrencies('tokens', _tokens)
            }
            if (localStorageItem.currencies.points) {
              _points = localStorageItem.currencies.points
            } else {
              _points = 0
              agent.Storage.creditCurrencies('points', _points)
            }
            if (localStorageItem.currencies.stars) {
              _stars = localStorageItem.currencies.stars
            } else {
              _stars = 0
              agent.Storage.creditCurrencies('stars', _stars)
            }
          } else {
            _tokens = 500
            _points = 0
            _stars = 0
            agent.Storage.creditCurrencies('tokens', _tokens)
            agent.Storage.creditCurrencies('points', _points)
            agent.Storage.creditCurrencies('stars', _stars)
          }
        } else {
          _tokens = 500
          _points = 0
          _stars = 0
          agent.Storage.creditCurrencies('tokens', _tokens)
          agent.Storage.creditCurrencies('points', _points)
          agent.Storage.creditCurrencies('stars', _stars)
        }

        this.props.ProfileStore.debitCurrenciesAtLaunch({
          currency: 'tokens',
          amount: d.currencies.tokens,
        })
        this.props.ProfileStore.creditCurrencies({
          currency: 'tokens',
          amount: _tokens,
        })

        this.props.ProfileStore.debitCurrenciesAtLaunch({
          currency: 'points',
          amount: d.currencies.points,
        })
        this.props.ProfileStore.creditCurrencies({
          currency: 'points',
          amount: _points,
        })

        this.props.ProfileStore.debitCurrenciesAtLaunch({
          currency: 'stars',
          amount: d.currencies.stars,
        })
        this.props.ProfileStore.creditCurrencies({
          currency: 'stars',
          amount: _stars,
        })

        this.props.handleIsLoggedIn(true)
      })
      .catch(e => {
        console.log(e)
        this.error = e
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
              <Text
                font={'pamainlight'}
                size={6}
                color={'white'}
                attr={this.textAttr}
              >
                log-in with your&nbsp;
              </Text>
              <Text
                font={'pamainbold'}
                size={6}
                color={'#17c5ff'}
                attr={this.textAttr}
              >
                e-mail
              </Text>
            </TextWrapper>
          </Section>
          <Section marginTop={2}>
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

              <Errors>{this.error}</Errors>
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
  z-index: 100;
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
  font-size: ${props => vhToPx(1.75)};
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
