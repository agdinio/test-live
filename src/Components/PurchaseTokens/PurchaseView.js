import React, { Component } from 'react'
import { inject } from 'mobx-react'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import PurchaseNow from '@/Components/PurchaseTokens/PurchaseNow'
import { getPurchaseToken } from '../Auth/GoogleAnalytics'
@inject('NavigationStore', 'AnalyticsStore')
export default class PurchaseView extends Component {
  handleCancel() {
    this.props.NavigationStore.removeSubScreen('PurchaseTokens-PurchaseView')
  }

  handleContinueClick() {
    let comp = <PurchaseNow item={this.props.item} />
    this.props.NavigationStore.addSubScreen(
      comp,
      'PurchaseTokens-PurchaseNow',
      true
    )
    this.props.NavigationStore.removeSubScreen(
      'PurchaseTokens-PurchaseView',
      true
    )
    getPurchaseToken('view_item', this.props.item)
  }

  componentWillUnmount() {
    this.props.AnalyticsStore.timeStop({ page: 'PurchaseTokens-PurchaseView' })
  }

  componentDidMount() {
    this.props.AnalyticsStore.timeStart({ page: 'PurchaseTokens-PurchaseView' })
  }

  render() {
    let { item } = this.props

    return (
      <Container>
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
        <Section justifyContent="center" marginTop="5">
          <TextWrapperRow>
            <Text font="pamainregular" color={'#000000'} size="7.5">
              ${item.price}
            </Text>
          </TextWrapperRow>
        </Section>
        <Section justifyContent="center" marginTop={6}>
          <Button
            onClick={this.handleContinueClick.bind(this)}
            id={`purchasetokens-button-continue`}
          >
            <ButtonArrow src={evalImage(`icon-arrow-black.svg`)} />
          </Button>
        </Section>
        <Section marginTop={8} justifyContent="center">
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
  //text-align: center;
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
  border: ${props => `${responsiveDimension(0.4)} solid #000000`};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:before {
    content: 'continue';
    text-transform: uppercase;
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(10 * 0.4)};
    color: #000000;
    line-height: 0.9;
    height: ${props => responsiveDimension(10 * 0.4 * 0.8)};
    letter-spacing: ${props => responsiveDimension(0.1)};
  }
`

const ButtonArrow = styled.img`
  height: 40%;
  margin-left: 7%;
`
