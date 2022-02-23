import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import Payment from '@/Components/Payment'
import { getPurchaseToken } from '../Auth/GoogleAnalytics'
@inject('NavigationStore', 'ProfileStore', 'AnalyticsStore')
@observer
export default class PurchaseNow extends Component {
  constructor() {
    super()
    extendObservable(this, {
      popupMessage: null,
    })

    this.paymentDetails = null
  }
  handleCancel() {
    this.props.NavigationStore.removeSubScreen('PurchaseTokens-PurchaseNow')
  }

  handleGoBackToMain() {
    this.props.NavigationStore.resetSubScreens()
  }

  async handleSuccess(pDetails) {
    this.paymentDetails = pDetails
    this.props.NavigationStore.removeSubScreen('PurchaseTokens-Payment', true)
    const tokens = (await this.props.item.tokens)
      ? isNaN(this.props.item.tokens.toString())
        ? 0
        : parseInt(this.props.item.tokens)
      : 0
    const bonusTokens = (await this.props.item.bonusTokens)
      ? isNaN(this.props.item.bonusTokens.toString())
        ? 0
        : parseInt(this.props.item.bonusTokens)
      : 0
    this.props.ProfileStore.profile.currencies.tokens += await (tokens +
      bonusTokens)

    this.popupMessage = (
      <TokenPurchased
        item={this.props.item}
        profile={this.props.ProfileStore.profile}
        goBackToMain={this.handleGoBackToMain.bind(this)}
      />
    )

    if (this.paymentDetails && this.paymentDetails.productId) {
      this.props.AnalyticsStore.addFlag({
        productId: this.paymentDetails.productId,
        purchase: true,
        purchaseType: 'tokens',
      })
    }
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handlePurchaseNowClick() {
    let comp = (
      <Payment
        item={this.props.item}
        success={this.handleSuccess.bind(this)}
        timeStart={this.handleTimeStart.bind(
          this,
          'PurchaseTokens-FillPaymentDetails'
        )}
        timeStop={this.handleTimeStop.bind(
          this,
          'PurchaseTokens-FillPaymentDetails'
        )}
      />
    )
    this.props.NavigationStore.addSubScreen(
      comp,
      'PurchaseTokens-Payment',
      true,
      false,
      true
    )

    getPurchaseToken('ADD_TO_CART', this.props.item)
  }

  render() {
    let { item } = this.props

    return (
      <Container>
        {this.popupMessage}

        <Section height="32" justifyContent="center" alignItems="flex-end">
          <TokenImage src={item.image} height={item.height} />
        </Section>
        <Section justifyContent="center" marginTop="1">
          <CenterRow>
            <TextWrapperRow marginBottom="-0.5">
              <Text font="pamainextrabold" color={'#000000'} size="7" nospacing>
                {item.tokens}
              </Text>
              <Text font="pamainlight" color={'#ffb600'} size="7" nospacing>
                &nbsp;TOKENS
              </Text>
            </TextWrapperRow>
            <TextWrapperRow>
              <Text
                font="pamainextrabold"
                color={'#000000'}
                size="4.6"
                nospacing
              >
                +{item.bonusTokens}
              </Text>
              <Text font="pamainlight" color={'#000000'} size="4.6" nospacing>
                &nbsp;BONUS TOKENS
              </Text>
            </TextWrapperRow>
          </CenterRow>
        </Section>
        <Section justifyContent="center" marginTop="3">
          <TextWrapperRow>
            <Text font="pamainregular" color={'#000000'} size="7.5">
              ${item.price}
            </Text>
          </TextWrapperRow>
        </Section>
        <Section justifyContent="center" marginTop={3}>
          <Button
            id={`purchasetokens-button-purchasenow`}
            text="purchase now"
            color="#ffffff"
            backgroundColor="#19c5ff"
            onClick={this.handlePurchaseNowClick.bind(this)}
          />
        </Section>
        <Section justifyContent="center" marginTop={1.5}>
          <Button
            id={`purchasetokens-button-addnewcard`}
            text="add new card"
            borderColor="#000000"
            onClick={this.handlePurchase}
          />
        </Section>
        <Section marginTop={5} justifyContent="center">
          <TextWrapperRow>
            <Text
              font="pamainlight"
              color={'#000000'}
              size="3.5"
              uppercase
              onClick={this.handleCancel.bind(this)}
            >
              tap here to go back
            </Text>
          </TextWrapperRow>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  width: 100%;
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
`

const TokenImage = styled.img`
  height: ${props => responsiveDimension(props.height || 0)};
  pointer-events: none;
`

const TextWrapperRow = styled.div`
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const CenterRow = styled.div`
  display: flex;
  flex-direction: column;
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
    font-size: ${props => responsiveDimension(10 * 0.4)};
    color: ${props => props.color || '#000000'};
    line-height: 0.9;
    height: ${props => responsiveDimension(10 * 0.4 * 0.8)};
    letter-spacing: ${props => responsiveDimension(0.1)};
  }
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

const TextWrapper = styled.div`
  text-align: center;
`

const TokenWrapper = styled.div`
  height: ${props => responsiveDimension(props.height)};
  margin-right: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.1)};
  display: flex;
  align-items: center;
  width: ${props => responsiveDimension(7)};
`

const Token = styled.div`
  position: absolute;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props =>
    props.adjustWidth
      ? responsiveDimension(props.size + 0.1)
      : responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
`

const Faded = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left || 0)};
  z-index: ${props => props.index};
`

const TokenPurchased = props => {
  const totalQty = props.item.bonusTokens + props.item.tokens
  return (
    <MessageContainer onClick={props.goBackToMain}>
      <Top height={55}>
        <Section direction="column" justifyContent="center">
          <Section justifyContent="center" marginBottom="2">
            <TokenImage
              src={evalImage(props.item.image)}
              height={props.item.height}
            />
          </Section>
          <Section justifyContent="center" marginBottom="1">
            <TextWrapper>
              <Text font="pamainextrabold" color={'#ffffff'} size="6" nospacing>
                {totalQty}
              </Text>
              <Text font="pamainlight" color={'#ffb600'} size="6" nospacing>
                &nbsp;TOKENS
              </Text>
            </TextWrapper>
          </Section>
          <Section justifyContent="center">
            <TextWrapper>
              <Text font="pamainlight" color={'#ffffff'} size="7.5" uppercase>
                PURCHASED
              </Text>
            </TextWrapper>
          </Section>
        </Section>
      </Top>
      <Middle height={18} justifyContent="flex-start">
        <Section justifyContent="center" marginTop="1">
          <TextWrapper>
            <Text font="pamainlight" color={'#ffffff'} size="4.3" uppercase>
              YOUR NEW
            </Text>
            <Text font="pamainlight" color={'#ffb600'} size="4.3" uppercase>
              &nbsp;TOKEN&nbsp;
            </Text>
            <Text font="pamainlight" color={'#ffffff'} size="4.3" uppercase>
              TOTAL
            </Text>
          </TextWrapper>
        </Section>
        <Section justifyContent="center" alignItems="center" direction="row">
          <Text
            font="pamainextrabold"
            color={'#ffb600'}
            size="8"
            uppercase
            nospacing
          >
            {props.profile.currencies.tokens}&nbsp;
          </Text>
          <TokenWrapper height="6">
            <Token
              src={evalImage(`playalong-token.svg`)}
              size={5.5}
              index={3}
            />
            <Faded index={2} size={5.5} color={'#6d6c71'} left={0.5} />
            <Faded index={1} size={5.5} color={'#33342f'} left={1} />
          </TokenWrapper>
        </Section>
      </Middle>
      <Bottom height="21">
        <Text font="pamainlight" color={'#ffffff'} size="3.5" uppercase>
          tap anywhere to return
        </Text>
      </Bottom>
    </MessageContainer>
  )
}
