import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import ReactDOM from 'react-dom'

export default class ShareKey extends Component {
  constructor(props) {
    super(props)
  }

  handleCopyClick() {
    if (this.refCodeWrapper) {
      ReactDOM.unmountComponentAtNode(this.refCodeWrapper)
      const input = (
        <ReferralCodeInput
          value={this.props.referralCode}
          id="referralCodeInput"
          readOnly
        />
      )
      ReactDOM.render(input, this.refCodeWrapper, () => {
        const ref = document.getElementById('referralCodeInput')
        ref.focus()
        ref.setSelectionRange(0, 99999)
        document.execCommand('copy')
        ReactDOM.unmountComponentAtNode(this.refCodeWrapper)
      })
    }

    this.props.refCopyKey()
  }

  handleShareClick() {
    this.props.refShareKey()
  }

  render() {
    return (
      <Container>
        <InnerSection>
          <Text font="pamainlight" size="3.5" color={'#ffffff'} uppercase>
            every&nbsp;
          </Text>
          <Text font="pamainextrabold" size="3.5" color={'#19d1be'} uppercase>
            key
          </Text>
          <Text font="pamainlight" size="3.5" color={'#ffffff'} uppercase>
            &nbsp;used grants you & your
          </Text>
        </InnerSection>
        <InnerSection>
          <Text
            font="pamainlight"
            size="3.5"
            color={'#ffffff'}
            uppercase
            nospacing
          >
            friend&nbsp;
          </Text>
          <Text
            font="pamainbold"
            size="3.5"
            color={'#ffffff'}
            uppercase
            nospacing
          >
            bonus
          </Text>
          <Text
            font="pamainlight"
            size="3.5"
            color={'#ffffff'}
            uppercase
            nospacing
          >
            &nbsp;used&nbsp;
          </Text>
          <Text
            font="pamainextrabold"
            size="3.5"
            color={'#ffb600'}
            uppercase
            nospacing
          >
            tokens
          </Text>
          <Text
            font="pamainlight"
            size="3.5"
            color={'#ffffff'}
            uppercase
            nospacing
          >
            &nbsp;&&nbsp;
          </Text>
          <Text
            font="pamainextrabold"
            size="3.5"
            color={'#16c5ff'}
            uppercase
            nospacing
          >
            points
          </Text>
        </InnerSection>
        <InnerSection marginTop="5" marginBottom="3">
          <Text font={'pamainextrabold'} size={8} color={'#ffffff'} nospacing>
            {this.props.referralCode}
          </Text>
          <ReferralCodeInputWrapper
            innerRef={ref => (this.refCodeWrapper = ref)}
          />
        </InnerSection>
        <InnerSection
          widthInPct="50"
          justifyContent="space-between"
          marginBottom="3"
        >
          <EventWrap>
            <Text
              font={'pamainregular'}
              size={2.7}
              color={'#19d1be'}
              uppercase
              style={{ marginBottom: vhToPx(1.5) }}
            >
              copy
            </Text>
            <CircleButton
              src={evalImage(`playalongnow-icon-copy.svg`)}
              sizeInPct={50}
              iconBackgroundColor={'#19d1be'}
              onClick={this.handleCopyClick.bind(this)}
            />
          </EventWrap>
          <EventWrap>
            <Text
              font={'pamainregular'}
              size={2.7}
              color={'#a7a9ac'}
              uppercase
              style={{ marginBottom: vhToPx(1.5) }}
            >
              or
            </Text>
          </EventWrap>
          <EventWrap>
            <Text
              font={'pamainregular'}
              size={2.7}
              color={'#ffffff'}
              uppercase
              style={{ marginBottom: vhToPx(1.5) }}
            >
              share
            </Text>
            <CircleButton
              src={evalImage(`playalongnow-icon-share.svg`)}
              sizeInPct={65}
              iconBackgroundColor={'#000000'}
              onClick={this.handleShareClick.bind(this)}
            />
          </EventWrap>
        </InnerSection>
        <InnerSection>
          <Text font="pamainextrabold" size="3.5" color={'#19d1be'} uppercase>
            {10}
          </Text>
          <Text font="pamainlight" size="3.5" color={'#ffffff'} uppercase>
            &nbsp;have used your&nbsp;
          </Text>
          <Text font="pamainextrabold" size="3.5" color={'#19d1be'} uppercase>
            key
          </Text>
          <Text font="pamainlight" size="3.5" color={'#ffffff'} uppercase>
            , you earned
          </Text>
        </InnerSection>
        <InnerSection>
          <Text font="pamainextrabold" size="3.5" color={'#ffb600'} uppercase>
            {500}
          </Text>
          <Text font="pamainlight" size="3.5" color={'#ffb600'} uppercase>
            &nbsp;tokens
          </Text>
          <Text font="pamainlight" size="3.5" color={'#ffffff'} uppercase>
            &nbsp;{'&'}&nbsp;
          </Text>
          <Text font="pamainextrabold" size="3.5" color={'#16c5ff'} uppercase>
            {50000}
          </Text>
          <Text font="pamainlight" size="3.5" color={'#16c5ff'} uppercase>
            &nbsp;points
          </Text>
        </InnerSection>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: ${props => vhToPx(60)};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const EventWrap = styled.div`
  display: flex;
  flex-direction: column;
`

const CircleButton = styled.div`
  width: ${props => responsiveDimension(12)};
  height: ${props => responsiveDimension(12)};
  border-radius: 50%;
  background-color: #ffffff;
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

const ReferralCodeInputWrapper = styled.div`
  width: 50%;
  height: ${props => responsiveDimension(8)};
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 0;
`

const ReferralCodeInput = styled.input`
  background-color: transparent;
  border: none;
  text-align: center;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(8)};

  height: ${props => responsiveDimension(8)};
  color: transparent;
`
