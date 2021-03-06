import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { vhToPx, responsiveDimension, evalImage, validEmail } from '@/utils'
import styled from 'styled-components'

@observer
export default class ThroughEmail extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      emails: '',
    })
    //this.formInputAttr['emailSectionMarginTop'] = responsiveDimension(1)
    //this.formInputAttr['emailSectionPaddingTop'] = responsiveDimension(1.5)
    //this.formInputAttr['emailSectionPaddingBottom'] = responsiveDimension(1.5)

    this.attr = {
      formInput: {
        borderRadius: responsiveDimension(0.4),
        height: responsiveDimension(7),
        marginBottom: responsiveDimension(1.5),
        fontSize: responsiveDimension(3.5),
      },
      button: {
        width: responsiveDimension(28),
        height: responsiveDimension(9),
        borderWidth: responsiveDimension(0.4),
        borderRadius: responsiveDimension(0.4),
        beforeFontSize: responsiveDimension(9 * 0.4),
        beforeHeight: responsiveDimension(9 * 0.4 * 0.8),
        beforeLetterSpacing: responsiveDimension(0.1),
      },
      circleButton: {
        width: responsiveDimension(10),
        height: responsiveDimension(10),
      },
      labelText: {
        fontSize: responsiveDimension(4.2),
      },
      cancelText: {
        fontSize: responsiveDimension(3.6),
      },
      innerSection: {
        marginTop1: vhToPx(1),
        marginTop2: vhToPx(2),
        marginTop3: vhToPx(3),
      },
    }
  }

  handleInputChange(e) {
    this.emails = e.target.value
    this.sharedEmails = this.emails.split(',').filter(validEmail)
  }

  handleKeyShareClick() {
    if (
      !this.sharedEmails ||
      (this.sharedEmails && this.sharedEmails.length < 1)
    ) {
      alert('EMAIL(S) SHOULD NOT BE EMPTY!')
    } else {
      this.props.shareKey(this.sharedEmails)
    }
  }

  componentWillUnmount() {
    if (this.props.timeStop) {
      this.props.timeStop()
    }
  }

  componentDidMount() {
    if (this.props.timeStart) {
      this.props.timeStart()
    }
  }

  render() {
    return (
      <Container>
        <Section
          height="80"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <CircleButton
            attr={this.attr.circleButton}
            src={evalImage(`playalongnow-icon-email.svg`)}
            sizeInPct={60}
            backgroundColor={'#19d1be'}
            iconBackgroundColor={'#ffffff'}
          />
          <InnerSection marginTop={this.attr.innerSection.marginTop3}>
            <ThisText
              font={'pamainlight'}
              size={this.attr.labelText.fontSize}
              color={'#ffffff'}
              uppercase
            >
              insert e-mail(s)
            </ThisText>
          </InnerSection>
          <InnerSection
            widthInPct="70"
            marginTop={this.attr.innerSection.marginTop2}
          >
            <FormInput
              type="text"
              placeholder="COMMA SEPARATED"
              attr={this.attr.formInput}
              value={this.emails}
              onChange={this.handleInputChange.bind(this)}
            />
          </InnerSection>
          <InnerSection marginTop={this.attr.innerSection.marginTop1}>
            <Button
              backgroundColor="#19d1be"
              attr={this.attr.button}
              onClick={this.handleKeyShareClick.bind(this)}
            >
              <TextWrapper>
                <ThisText
                  font={'pamainlight'}
                  size={this.attr.labelText.fontSize}
                  color={'#ffffff'}
                  uppercase
                >
                  share&nbsp;
                </ThisText>
                <ThisText
                  font={'pamainextrabold'}
                  size={this.attr.labelText.fontSize}
                  color={'#ffffff'}
                  uppercase
                >
                  key
                </ThisText>
              </TextWrapper>
              <ButtonArrow src={evalImage(`icon-arrow.svg`)} />
            </Button>
          </InnerSection>
        </Section>
        <Section height="14" justifyContent="center">
          <TextWrapper>
            <ThisText
              font={'pamainlight'}
              size={this.attr.cancelText.fontSize}
              color={'#ffffff'}
              uppercase
              style={{ cursor: 'pointer' }}
              onClick={this.props.close}
            >
              tap here to cancel
            </ThisText>
          </TextWrapper>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
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
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`

const InnerSection = styled.div`
  text-align: center;
  display: flex;
  ${props => (props.widthInPct ? `width:${props.widthInPct}%` : ``)};
  ${props => (props.height ? `height:${props.height}` : ``)};
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${props.marginTop}` : ``)};
  ${props => (props.marginBottom ? `margin-bottom:${props.marginBottom}` : ``)};
  ${props =>
    props.paddingLeftInPct ? `padding-left:${props.paddingLeftInPct}%` : ``};
`

const TextWrapper = styled.div`
  text-align: center;
  ${props => (props.center ? `justify-content: center;` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`
const ThisText = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => props.size};
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

const CircleButton = styled.div`
  width: ${props => props.attr.width};
  height: ${props => props.attr.height};
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

const FormInput = styled.input`
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color: ${props.valid ? '#2fc12f' : '#ed1c24'}`};
  font-family: pamainregular;
  width: 100%;
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

const Button = styled.div`
  width: ${props => props.attr.width};
  height: ${props => props.attr.height};
  ${props =>
    props.borderColor
      ? `border:${props.attr.borderWidth} solid ${props.borderColor}`
      : ''};
  border-radius: ${props => props.attr.borderRadius};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ''};
`

const ButtonArrow = styled.img`
  height: 40%;
  margin-left: 7%;
`
