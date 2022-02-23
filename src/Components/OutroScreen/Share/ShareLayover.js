import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax } from 'gsap'
import ArrowImg from '@/assets/images/icon-arrow.svg'
import EmailIcon from '@/assets/images/email-icon.svg'
import ShareIcon from '@/assets/images/share-icon.svg'
import FacebookIcon from '@/assets/images/facebook-icon.svg'
import TwitterIcon from '@/assets/images/twitter-icon.svg'
import EmailSentIcon from '@/assets/images/email_sent-icon.svg'
import InstagramIcon from '@/assets/images/instagram-icon.svg'
import { vhToPx, responsiveDimension } from '@/utils'
import { eventCapture } from '../../Auth/GoogleAnalytics'
function validEmail(email) {
  const reg = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  return !!email && !!email.match(reg)
}

@inject('ShareStatusStore')
@observer
export default class ShareLayover extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      emails: '',
      sharedEmails: [],
    })
  }

  componentDidMount() {
    TweenMax.set(this.top, {
      opacity: 1,
      zIndex: 1,
    })
  }

  email() {
    TweenMax.to(this.top, 0.5, { opacity: 0, zIndex: -1 })
    TweenMax.to(this.bottom, 0.5, { opacity: 1, zIndex: 100 })
  }

  returnEmail() {
    new TimelineMax({ repeat: 0 })
      .to(this.bottom, 0.5, {
        opacity: 0,
      })
      .set(this.bottom, {
        zIndex: -1,
      })
    TweenMax.to(this.top, 0.5, {
      opacity: 1,
      zIndex: 1,
    })
  }

  facebook() {
    console.error('need app  id')
  }

  instagram() {
    const device = navigator.userAgent
    if (/Android/i.test(device)) {
      window.open('instagram://media?id=434784289393782000_15903882')
    } else if (/iPhone|iPad|iPod/i.test(device)) {
    } else {
      window.open('https://www.instagram.com')
    }
  }

  twitter() {
    window.open(
      `https://twitter.com/home?status=Checkout PlayAlong sports now made by www.sportoco.com. Use my reference code "${this.props.referralCode}"`
    )
  }

  shareViaEmail() {
    if (this.sharedEmails.length) {
      console.error('send emails here')
      let emails = []
      this.sharedEmails.forEach(email => {
        emails.push(email.trim())
      })
      /*OLD
      let params = {
        key: this.props.referralCode,
        list: emails,
      }
*/
      let params = {
        email: emails,
      }

      this.props.ShareStatusStore.shareViaEmail(params)
      eventCapture('share_email', params)
      new TimelineMax({ repeat: 0 })
        .to(this.bottom, 0.5, {
          opacity: 0,
        })
        .set(this.bottom, {
          zIndex: -1,
        })
      TweenMax.to(this.after, 0.5, {
        opacity: 1,
        zIndex: 1,
      })
    }
  }

  changeEmails(e) {
    this.emails = e.target.value
    this.sharedEmails = this.emails.split(',').filter(validEmail)
  }

  return() {
    this.props.return(() => {
      this.emails = ''
      this.sharedEmails = []
      TweenMax.set(this.top, {
        opacity: 1,
        zIndex: 1,
      })
      TweenMax.set(this.bottom, {
        opacity: 0,
        zIndex: -1,
      })
      TweenMax.set(this.after, {
        opacity: 0,
        zIndex: -1,
      })
    })
  }

  render() {
    return (
      <Container innerRef={this.props.reference}>
        <InnerContainer innerRef={ref => (this.top = ref)}>
          <Content center column>
            <Icon src={ShareIcon} />
            <Text font={'pamainlight'} size={6} lineHeight={2} uppercase>
              share through:
            </Text>
          </Content>
          <Content center column>
            <Icon
              src={EmailIcon}
              margin={2}
              click
              onClick={this.email.bind(this)}
            />
            <Icon
              src={FacebookIcon}
              margin={2}
              click
              onClick={this.facebook.bind(this)}
            />
            <Icon
              src={TwitterIcon}
              margin={2}
              click
              onClick={this.twitter.bind(this)}
            />
            <Icon
              src={InstagramIcon}
              margin={2}
              click
              onClick={this.instagram.bind(this)}
            />
          </Content>
          <Content center marginTop={6}>
            <Text
              font={'pamainlight'}
              size={4}
              uppercase
              onClick={this.return.bind(this)}
            >
              tap here to cancel
            </Text>
          </Content>
        </InnerContainer>

        <InnerContainer innerRef={ref => (this.bottom = ref)}>
          <Content column height={69}>
            <InputWrapper paddingTop={15}>
              <Icon src={EmailIcon} />
              <Text font={'pamainlight'} size={6} lineHeight={1.5} uppercase>
                insert e-mail(s)
              </Text>
              <FormWrapper
                onSubmit={e => {
                  e.preventDefault()
                  this.shareViaEmail()
                }}
              >
                <FormInput
                  type="text"
                  value={this.emails}
                  onChange={this.changeEmails.bind(this)}
                  placeholder="COMMA SEPARATED"
                />
              </FormWrapper>
              <ShareKeyButton
                disabled={!this.sharedEmails.length}
                onClick={this.shareViaEmail.bind(this)}
              >
                <TextWrapper>
                  <Text
                    font={'pamainregular'}
                    size={3.7}
                    color={'black'}
                    uppercase
                  >
                    share&nbsp;
                  </Text>
                  <Text
                    font={'pamainextrabold'}
                    size={3.7}
                    color={'black'}
                    uppercase
                  >
                    key
                  </Text>
                </TextWrapper>
                <Arrow src={ArrowImg} />
              </ShareKeyButton>
            </InputWrapper>
          </Content>
          <Content center>
            <Text
              font={'pamainlight'}
              size={4}
              uppercase
              onClick={this.returnEmail.bind(this)}
            >
              tap here to cancel
            </Text>
          </Content>
        </InnerContainer>

        <InnerContainer
          onClick={this.return.bind(this)}
          innerRef={ref => (this.after = ref)}
        >
          <Content column height={69}>
            <InputWrapper paddingTop={25}>
              <Icon big src={EmailSentIcon} />
              <Text font={'pamainlight'} size={6} lineHeight={1.5} uppercase>
                e-mail(s) sent!
              </Text>
            </InputWrapper>
          </Content>
          <Content center>
            <Text
              font={'pamainlight'}
              size={3.5}
              uppercase
              onClick={this.returnEmail.bind(this)}
            >
              tap anywhere to return
            </Text>
          </Content>
        </InnerContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  position: absolute;
  opacity: 0;
  z-index: -1;
  width: inherit;
  height: inherit;
`
const InnerContainer = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  margin-top: ${props => vhToPx(10)};
  position: absolute;
  opacity: 0;

  color: white;
`
const Content = styled.div`
  width: 100%;
  height: ${props => `${props.height}vh` || 'auto'};
  display: flex;
  ${props =>
    props.center ? `justify-content: center; align-items: center;` : ``}
  ${props => (props.column ? `flex-direction: column;` : ``)}
  ${props => (props.marginTop ? `margin-top: ${vhToPx(props.marginTop)};` : ``)}
  ${props =>
    props.marginBottom ? `margin-bottom: ${vhToPx(props.marginTop)};` : ``}

`

const Icon = styled.img`
  width: ${props =>
    props.big ? responsiveDimension(14) : responsiveDimension(7)};
  height: ${props => responsiveDimension(7)};
  ${props =>
    props.margin
      ? `margin: ${responsiveDimension(props.margin)};`
      : ``} ${props =>
    props.click
      ? `
      &:hover {
        cursor: pointer;
      }
    `
      : ''};
`

const TextWrapper = styled.div`
  text-align: center;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
`

const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${props => props.paddingTop || '0'}%;
`
const FormWrapper = styled.form`
  position: relative;
  width: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const FormInput = styled.input`
  font-family: pamainregular;
  width: 60%;
  height: ${props => responsiveDimension(7)};
  border-radius: ${props => responsiveDimension(0.5)};
  text-align: center;
  border: none;
  outline: none;
  font-size: ${props => responsiveDimension(3.5)};
  color: #000000;
  text-transform: uppercase;
`
const ShareKeyButton = styled.div`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  width: 40%;
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(0.5)};
  background-color: #18c5ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${props => vhToPx(3)} 0 ${props => vhToPx(3)} 0;
`
const Arrow = styled.img`
  height: 30px;
  margin-left: 10px;
`
