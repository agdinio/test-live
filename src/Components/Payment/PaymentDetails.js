import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, evalImage, validEmail } from '@/utils'
import moment from 'moment-timezone'
import { getPaymentDetails } from '../Auth/GoogleAnalytics'
@inject('ProfileStore')
@observer
export default class PaymentDetails extends Component {
  constructor(props) {
    super(props)
    this.formInputAttr = {}
    this.formInputAttr['borderRadius'] = responsiveDimension(0.4)
    this.formInputAttr['height'] = responsiveDimension(7)
    this.formInputAttr['marginBottom'] = responsiveDimension(1.5)
    this.formInputAttr['fontSize'] = responsiveDimension(3.5)
    this.formInputAttr['emailSectionMarginTop'] = responsiveDimension(1)
    this.formInputAttr['emailSectionPaddingTop'] = responsiveDimension(1.5)
    this.formInputAttr['emailSectionPaddingBottom'] = responsiveDimension(1.5)
    this.formInputAttr['letterSpacing'] = responsiveDimension(0.2)
  }

  isNumber(e) {
    let code = e.which

    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault()
    }
  }

  ccFormat(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join('-')
    } else {
      return value
    }
  }

  expireFormat(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{2,4}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 2) {
      parts.push(match.substring(i, i + 2))
    }
    if (parts.length) {
      return parts.join('/')
    } else {
      return value
    }
  }

  handleInputChange(e) {
    this.props.ProfileStore.paymentDetails[e.target.name] = e.target.value
  }

  handleInputBlur(required, e) {
    if (required) {
      if (e.target.value.trim().length < 3) {
        e.target.style.borderStyle = 'solid'
        e.target.style.borderWidth = responsiveDimension(0.5)
        e.target.style.borderColor = '#ff0000'
      } else {
        e.target.style.borderStyle = 'none'
        e.target.style.borderWidth = 0
        e.target.style.borderColor = 'transparent'
      }
    }
  }

  keepCardDetailsOnFileClick(val) {
    this.props.ProfileStore.paymentDetails.keepCardDetailsOnFile = val
  }

  handlePurchaseClick() {
    const errors = []

    for (let key in this.props.ProfileStore.paymentDetails) {
      if (this.props.ProfileStore.paymentDetails.hasOwnProperty(key)) {
        const splitted = key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1)
        let newKey = ''

        if (
          this.props.ProfileStore.paymentDetails[key] &&
          this.props.ProfileStore.paymentDetails[key].length < 3
        ) {
          for (let i = 0; i < splitted.length; i++) {
            newKey += ' ' + splitted[i]
          }
          errors.push(newKey)
        }
      }
    }

    if (
      this.props.ProfileStore.paymentDetails.expirationDate &&
      !moment(
        this.props.ProfileStore.paymentDetails.expirationDate,
        'MM/YY',
        true
      ).isValid()
    ) {
      errors.push('invalid expiration-date format')
    }

    if (errors.length > 0) {
      this.props.error(errors)
      return
    } else {
      try {
        this.props.ProfileStore.billingAddress.phone = this.props.ProfileStore.billingAddress.phone
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/-/g, '')
          .replace(/\s/g, '')

        if (this.props.ProfileStore.billingAddress.phone) {
          if (!this.props.ProfileStore.billingAddress.countryCode) {
            this.props.ProfileStore.billingAddress.countryCode = '1'
          }
        } else {
          this.props.ProfileStore.billingAddress.countryCode = ''
        }

        this.props.ProfileStore.billingAddress.country = JSON.parse(
          this.props.ProfileStore.billingAddress.country
        ).code
        this.props.ProfileStore.billingAddress.state = JSON.parse(
          this.props.ProfileStore.billingAddress.state
        ).code
      } catch (e) {
        console.log(e)
      }

      //this.props.ProfileStore.paymentDetails.profileId = this.props.ProfileStore.profile.userId

      this.props.ProfileStore.paymentDetails.cardNumber = this.props.ProfileStore.paymentDetails.cardNumber
        .toString()
        .replace(/-/g, '')

      const args = {
        userId: this.props.ProfileStore.profile.userId,
        productId: this.props.item.productId,
        billingDetails: this.props.ProfileStore.billingAddress,
        paymentDetails: this.props.ProfileStore.paymentDetails,
      }

      console.log('PAYMENT DETAILS ARGS', args)
      this.props.purchase(args)
    }

    getPaymentDetails(
      'ADD_PAYMENT_INFO',
      this.props.ProfileStore.paymentDetails
    )
  }

  render() {
    let { ProfileStore, item } = this.props

    const totalQty = item.bonusTokens + item.tokens

    return (
      <Container>
        <Scrolling>
          <HeaderLabel>fill out your payment details</HeaderLabel>
          <Form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <Section direction="column" alignItems="center" height="35">
              <InputWrap>
                <FormInput
                  id="cardName"
                  name="cardName"
                  type="text"
                  placeholder="NAME ON CARD"
                  // readOnly={this.isAuthenticating ? true : false}
                  attr={this.formInputAttr}
                  value={ProfileStore.paymentDetails.cardName}
                  onChange={this.handleInputChange.bind(this)}
                  onBlur={this.handleInputBlur.bind(this, true)}
                />
              </InputWrap>
              <InputWrap>
                <FormInput
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  placeholder="CARD NUMBER"
                  attr={this.formInputAttr}
                  maxLength="19"
                  value={this.ccFormat(ProfileStore.paymentDetails.cardNumber)}
                  onChange={this.handleInputChange.bind(this)}
                  onBlur={this.handleInputBlur.bind(this, true)}
                  onKeyPress={this.isNumber.bind(this)}
                  style={{ letterSpacing: this.formInputAttr.letterSpacing }}
                />
              </InputWrap>
              <InputWrap>
                <FormInput
                  id="expirationDate"
                  name="expirationDate"
                  type="text"
                  placeholder="EXPIRATION DATE (MM/YY)"
                  attr={this.formInputAttr}
                  value={this.expireFormat(
                    ProfileStore.paymentDetails.expirationDate
                  )}
                  onChange={this.handleInputChange.bind(this)}
                  onBlur={this.handleInputBlur.bind(this, true)}
                />
              </InputWrap>
              <InputWrap direction="row" alignItems="center">
                <Text
                  font="pamainextrabold"
                  color={'#ffffff'}
                  size="4"
                  nospacing
                  style={{ marginRight: '5%' }}
                >
                  CSV
                </Text>
                <FormInput
                  widthInPct="26"
                  id="csv"
                  name="csv"
                  type="text"
                  placeholder="_ _ _"
                  attr={this.formInputAttr}
                  maxLength="3"
                  value={ProfileStore.paymentDetails.csv}
                  onChange={this.handleInputChange.bind(this)}
                  onBlur={this.handleInputBlur.bind(this, true)}
                  onKeyPress={this.isNumber.bind(this)}
                  style={{ letterSpacing: this.formInputAttr.letterSpacing }}
                />
              </InputWrap>
            </Section>
            <Section>
              <KeepCardDetailsOnFile>
                {ProfileStore.paymentDetails.keepCardDetailsOnFile ? (
                  <CheckYes
                    id={`payment-button-paymentdetails-keepcarddetails`}
                    src={evalImage(`input_feld-verified-profile.svg`)}
                    onClick={this.keepCardDetailsOnFileClick.bind(this, false)}
                  />
                ) : (
                  <CheckNo
                    id={`payment-button-paymentdetails-keepcarddetails`}
                    onClick={this.keepCardDetailsOnFileClick.bind(this, true)}
                  />
                )}
              </KeepCardDetailsOnFile>
            </Section>
            <Section
              justifyContent="space-between"
              alignItems="center"
              height="15"
              paddingLeft="7"
              paddingRight="7"
            >
              <Button
                id={`payment-button-paymentdetails-purchase`}
                text="purchase"
                color={'#ffffff'}
                backgroundColor={'#19c5ff'}
                onClick={this.handlePurchaseClick.bind(this)}
              >
                <ButtonArrow src={evalImage(`icon-arrow.svg`)} />
              </Button>
              <Text font="pamainregular" color={'#ffffff'} size="7.5">
                ${item.price}
              </Text>
            </Section>
            <Section justifyContent="center" alignItems="center" height="15">
              <TextWrapperRow>
                <Text
                  font="pamainextrabold"
                  color={'#ffffff'}
                  size="7.5"
                  nospacing
                >
                  {totalQty}
                </Text>
                <Text font="pamainlight" color={'#ffb600'} size="7.5" nospacing>
                  &nbsp;TOKENS
                </Text>
              </TextWrapperRow>
            </Section>
          </Form>
        </Scrolling>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const HeaderLabel = styled.div`
  width: 100%;
  height: ${props => vhToPx(9)};
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(9 * 0.4)};
  color: #ffffff;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
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

const Section = styled.div`
  width: ${props => props.widthInPct || 100}%;
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.paddingLeft ? `padding-left:${props.paddingLeft}%` : ``)}
  ${props => (props.paddingRight ? `padding-right:${props.paddingRight}%` : ``)}
`

const Form = styled.form`
  position: relative;
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const InputWrap = styled.div`
  width: 70%;
  display: flex;
  justify-content: flex-end;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props => (props.alignItems ? `align-items:${props.alignItems}` : ``)};
`

const FormInput = styled.input`
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color: ${props.valid ? '#2fc12f' : '#ed1c24'}`};
  font-family: pamainregular;
  width: ${props => props.widthInPct || 100}%;
  height: ${props => props.attr.height};
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  outline: none;
  font-size: ${props => props.attr.fontSize};
  text-transform: uppercase;
  padding-left: 5%;
  margin-bottom: ${props =>
    props.noMarginBottom ? 0 : props.attr.marginBottom};
`

const KeepCardDetailsOnFile = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    content: 'keep card details on file';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3)};
    color: #ffffff;
    text-transform: uppercase;
    padding-right: ${props => responsiveDimension(1)};
  }
  margin-top: ${props => responsiveDimension(4)};
  margin-bottom: ${props => responsiveDimension(2.5)};
`

const CheckYes = styled.img`
  height: ${props => responsiveDimension(4)};
  &:hover {
    cursor: pointer;
  }
`

const CheckNo = styled.div`
  width: ${props => responsiveDimension(4)};
  height: ${props => responsiveDimension(4)};
  border-radius: 50%;
  background-color: #ffffff;
  &:hover {
    cursor: pointer;
  }
  position: relative;
`

const Button = styled.div`
  width: ${props => responsiveDimension(28)};
  height: ${props => responsiveDimension(9)};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ''};
  &:before {
    content: '${props => props.text}';
    text-transform: uppercase;
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(9 * 0.4)};
    color: ${props => props.color || '#000000'};
    line-height: 0.9;
    height: ${props => responsiveDimension(9 * 0.4 * 0.8)};
    letter-spacing: ${props => responsiveDimension(0.1)};
  }
`

const ButtonArrow = styled.img`
  height: 40%;
  margin-left: 7%;
`

const TextWrapperRow = styled.div`
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const Text = styled.span`
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
