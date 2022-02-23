import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import MenuBanner from '@/Components/Common/MenuBanner'
import ThroughEmail from '@/Components/ShareThrough/ThroughEmail'

@inject('NavigationStore', 'ProfileStore', 'AnalyticsStore')
@observer
export default class ShareThrough extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      componentShareThrough: null,
    })

    this.referralCode =
      this.props.referralCode || this.props.ProfileStore.shareKey
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handleCancelPage() {
    this.props.cancel()
  }

  handleClosePopupClick() {
    if (this.refPopupWrapper) {
      this.refPopupWrapper.style.zIndex = -10
      this.refPopupWrapper.style.opacity = 0
      ReactDOM.unmountComponentAtNode(this.refPopupWrapper)
    }

    this.componentShareThrough = null
  }

  handleShareKeyThroughEmail(sharedEmails) {
    let emails = []
    sharedEmails.forEach(email => {
      emails.push(email.trim())
    })

    console.log(emails)

    if (this.refPopupWrapper) {
      this.refPopupWrapper.style.zIndex = 10
      this.refPopupWrapper.style.opacity = 1
      ReactDOM.render(
        <PopupEmailsSent close={this.handleClosePopupClick.bind(this)} />,
        this.refPopupWrapper
      )
    }
  }

  handleEmailClick() {
    // if (this.refPopupWrapper) {
    //   this.refPopupWrapper.style.zIndex = 10
    //   this.refPopupWrapper.style.opacity = 1
    //   ReactDOM.render(
    //     <ThroughEmail
    //       referralCode={this.referralCode}
    //       shareKey={this.handleShareKeyThroughEmail.bind(this)}
    //       close={this.handleClosePopupClick.bind(this)}
    //       analyticsPageName={`${this.props.analyticsPageName}-Email`}
    //       timeStart={this.handleTimeStart.bind(this, `${this.props.analyticsPageName}-Email`)}
    //       timeStop={this.handleTimeStop.bind(this, `${this.props.analyticsPageName}-Email`)}
    //     />,
    //     this.refPopupWrapper
    //   )
    // }

    this.componentShareThrough = (
      <ThroughEmail
        referralCode={this.referralCode}
        shareKey={this.handleShareKeyThroughEmail.bind(this)}
        close={this.handleClosePopupClick.bind(this)}
        analyticsPageName={`${this.props.analyticsPageName}-Email`}
        timeStart={this.handleTimeStart.bind(
          this,
          `${this.props.analyticsPageName}-Email`
        )}
        timeStop={this.handleTimeStop.bind(
          this,
          `${this.props.analyticsPageName}-Email`
        )}
      />
    )
  }

  handleCopyToClipboardClick() {
    if (this.refCodeWrapper) {
      if (this.refPopupWrapper) {
        this.refPopupWrapper.style.zIndex = 10
        this.refPopupWrapper.style.opacity = 1
        ReactDOM.render(
          <PopupCopyToClipboard
            referralCode={this.referralCode}
            close={this.handleClosePopupClick.bind(this)}
          />,
          this.refPopupWrapper
        )
      }

      ReactDOM.unmountComponentAtNode(this.refCodeWrapper)
      const input = (
        <ReferralCodeInput
          value={this.referralCode}
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
  }

  componentWillUnmount() {
    if (this.props.analyticsPageName) {
      this.handleTimeStop(this.props.analyticsPageName)
    }

    this.unmounted = true
  }

  componentDidMount() {
    if (this.props.analyticsPageName) {
      this.handleTimeStart(this.props.analyticsPageName)
    }
  }

  render() {
    return (
      <Container>
        <MenuBanner
          backgroundColor={
            (this.props.banner && this.props.banner.backgroundColor) ||
            '#19d1bf'
          }
          icon={
            (this.props.banner && this.props.banner.icon) || `menu-key-icon.svg`
          }
          iconBackgroundColor={
            (this.props.banner && this.props.banner.iconBackgroundColor) ||
            '#000'
          }
          iconMaskColor={
            (this.props.banner && this.props.banner.iconMaskColor) || ''
          }
          sizeInPct={(this.props.banner && this.props.banner.sizeInPct) || '80'}
          text={(this.props.banner && this.props.banner.text) || ''}
        />
        <PopupWrapper innerRef={ref => (this.refPopupWrapper = ref)} />
        {this.componentShareThrough}
        <Content>
          <Section
            height="25"
            direction="column"
            alignItems="center"
            justifyContent="flex-end"
          >
            <CircleButton
              src={evalImage(`playalongnow-icon-share.svg`)}
              sizeInPct={60}
              backgroundColor={'#ffffff'}
              iconBackgroundColor={'#000000'}
            />
            <TextWrapper marginTop="3" marginBottom="1">
              <Text font={'pamainlight'} size={5} color={'#ffffff'} uppercase>
                {this.props.headerText || 'share through'}
              </Text>
            </TextWrapper>
          </Section>
          <Section height="50" direction="column" justifyContent="center">
            <SubMenuBarWrap>
              <SubMenuBarTransparent onClick={this.handleEmailClick.bind(this)}>
                <SubMenuBarInner
                  backgroundColor={'#211d1e'}
                  borderColor={'#ffffff'}
                  text="e-mail contacts"
                />
                <SubMenuIcon
                  src={evalImage(`playalongnow-icon-email.svg`)}
                  sizeInPct="60"
                />
              </SubMenuBarTransparent>
            </SubMenuBarWrap>
            <SubMenuBarWrap>
              <SubMenuBarTransparent>
                <SubMenuBarInner
                  backgroundColor={'#211d1e'}
                  borderColor={'#ffffff'}
                  text="facebook"
                />
                <SubMenuIcon
                  src={evalImage(`playalongnow-icon-facebook.svg`)}
                  sizeInPct="35"
                  backgroundColor={'#0a85ee'}
                />
              </SubMenuBarTransparent>
            </SubMenuBarWrap>
            <SubMenuBarWrap>
              <SubMenuBarTransparent>
                <SubMenuBarInner
                  backgroundColor={'#211d1e'}
                  borderColor={'#ffffff'}
                  text="twitter"
                />
                <SubMenuIcon
                  src={evalImage(`playalongnow-icon-twitter.svg`)}
                  sizeInPct="60"
                  backgroundColor={'#20a1f1'}
                />
              </SubMenuBarTransparent>
            </SubMenuBarWrap>
            <SubMenuBarWrap>
              <SubMenuBarTransparent>
                <SubMenuBarInner
                  backgroundColor={'#211d1e'}
                  borderColor={'#ffffff'}
                  text="instagram"
                />
                <SubMenuIcon
                  src={evalImage(`playalongnow-icon-instagram.svg`)}
                  sizeInPct="60"
                  backgroundColor={
                    'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);'
                  }
                />
              </SubMenuBarTransparent>
            </SubMenuBarWrap>
            <SubMenuBarWrap>
              <SubMenuBarTransparent
                onClick={this.handleCopyToClipboardClick.bind(this)}
              >
                <SubMenuBarInner
                  backgroundColor={'#211d1e'}
                  borderColor={'#ffffff'}
                >
                  <InnerSection
                    direction="row"
                    widthInPct="100"
                    paddingLeftInPct="30"
                    style={{
                      transform: 'scaleX(0.8)',
                      transformOrigin: 'left',
                    }}
                  >
                    <ReferralCodeInputWrapper
                      innerRef={ref => (this.refCodeWrapper = ref)}
                    />
                    <SubMenuText font="pamainregular" color={'#ffffff'}>
                      or&nbsp;
                    </SubMenuText>
                    <SubMenuText font="pamainextrabold" color={'#19d1be'}>
                      copy
                    </SubMenuText>
                    <SubMenuText font="pamainregular" color={'#ffffff'}>
                      &nbsp;to clipboard
                    </SubMenuText>
                  </InnerSection>
                </SubMenuBarInner>
                <SubMenuIcon
                  src={evalImage(`playalongnow-icon-copy.svg`)}
                  sizeInPct="50"
                />
              </SubMenuBarTransparent>
            </SubMenuBarWrap>
          </Section>
          <Section height="19" alignItems="center" justifyContent="center">
            <Text
              font={'pamainlight'}
              size={3.6}
              color={'#ffffff'}
              uppercase
              style={{ cursor: 'pointer' }}
              onClick={this.handleCancelPage.bind(this)}
            >
              tap here to cancel
            </Text>
          </Section>
        </Content>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.95);
`

const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => vhToPx(1.4)};
  display: flex;
  flex-direction: row;
`
const BannerText = styled.div`
  margin-top: ${props => vhToPx(1)};
  font-size: ${props => vhToPx(5)};
  font-family: pamainlight;
  color: #19d1bf;
  text-transform: uppercase;
  &:before {
    content: '';
  }
`

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(8.5)};
  background-color: ${props => props.backgroundColor};
  margin-left: ${props => responsiveDimension(1.5)};
  position: relative;
  border-bottom-left-radius: ${props => responsiveDimension(5)};
  border-bottom-right-radius: ${props => responsiveDimension(5)};
  animation: ${props => backBanner} 0.75s forwards;
  z-index: 10;
`

const backBanner = keyframes`
  0%{height: ${vhToPx(1)};}
  50%{height: ${vhToPx(9.5)};}
  100%{height: ${props => vhToPx(8.5)};}
`

const Icon = styled.div`
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: ${props => props.sizeInPct || '40'}%;
  background-position: center;

  margin-left: ${props => responsiveDimension(0.1)};
  margin-bottom: ${props => responsiveDimension(0.3)};
  ${props =>
    props.borderColor
      ? `${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ``};
`

const Content = styled.div`
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
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
  ${props =>
    props.paddingLeftInPct ? `padding-left:${props.paddingLeftInPct}%` : ``};
`

const SubMenuBarWrap = styled.div`
  width: 90%;
  height: ${props => responsiveDimension(9)};
  border-top-right-radius: ${props => responsiveDimension(9)};
  border-bottom-right-radius: ${props => responsiveDimension(9)};
  background-color: #939598;
  margin-top: ${props => vhToPx(0.3)};
  margin-bottom: ${props => vhToPx(0.3)};
  display: flex;
  justify-content: flex-end;
`

const SubMenuBarTransparent = styled.div`
  width: 80%;
  height: ${props => responsiveDimension(9)};
  border-radius: ${props => responsiveDimension(9)};
  position: relative;
  cursor: pointer;
`

const SubMenuBarInner = styled.div`
  width 100%;
  height: ${props => responsiveDimension(9)};
  border-radius: ${props => responsiveDimension(9)}};
  background-color: ${props => props.backgroundColor || '#000000'};
  ${props =>
    props.borderColor
      ? `border: ${responsiveDimension(0.6)} solid ${props.borderColor}`
      : ``};
  position: absolute;
  display: flex;
  align-items: center;
  &:after {
    content: '${props => props.text}';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(4)};
    color: #ffffff;
    text-transform: uppercase;
    line-height: 0.9;
    height: ${props => responsiveDimension(4 * 0.8)};
    padding-left: 30%;
    letter-spacing: ${props => responsiveDimension(0.1)};
    transform: scaleX(0.8);
    transform-origin: left;
  }
`

const SubMenuIcon = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(9)};
  height: ${props => responsiveDimension(9)};
  border-radius: 50%;
  border: ${props => `${responsiveDimension(0.8)} solid #ffffff`};
  ${props =>
    props.backgroundColor ? `background: ${props.backgroundColor}` : ``};
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: ${props => props.sizeInPct || 80}%;
    background-position: center;
  }
`

const SubMenuText = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(4)};
  color: ${props => props.color || '#000000'};
  line-height: 0.9;
  height: ${props => responsiveDimension(4 * 0.8)};
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const ReferralCodeInputWrapper = styled.div`
  width: 50%;
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
  font-size: ${props => responsiveDimension(1)};
  color: transparent;
`

const PopupWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  opacity: 0;
  z-index: -10;
`

const PopupContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const TextWrapper = styled.div`
  text-align: center;
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

const CircleButton = styled.div`
  position: relative;
  width: ${props => responsiveDimension(10)};
  height: ${props => responsiveDimension(10)};
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

const CommonIcon = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(4)};
  height: ${props => responsiveDimension(4)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 50%;
  top: 50%;
  transform: translate(150%, -50%);
`

const PopupEmailsSent = props => {
  return (
    <PopupContainer onClick={props.close}>
      <Section
        height="80"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <CircleButton
          src={evalImage(`playalongnow-icon-email.svg`)}
          sizeInPct={50}
          backgroundColor={'#19d1be'}
          iconBackgroundColor={'#ffffff'}
        >
          <CommonIcon src={evalImage(`icon-arrow-emailsent.svg`)} />
        </CircleButton>
        <InnerSection widthInPct="100" direction="column" alignItems="center">
          <TextWrapper marginTop="3">
            <Text font={'pamainlight'} size={4.2} color={'#ffffff'} uppercase>
              e-mail(s) sent!
            </Text>
          </TextWrapper>
        </InnerSection>
      </Section>
      <Section height="14" justifyContent="center">
        <TextWrapper>
          <Text font={'pamainlight'} size={3.6} color={'#ffffff'} uppercase>
            tap anywhere to return
          </Text>
        </TextWrapper>
      </Section>
    </PopupContainer>
  )
}

const PopupCopyToClipboard = props => {
  return (
    <PopupContainer onClick={props.close}>
      <Section
        height="80"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <CircleButton
          src={evalImage(`playalongnow-icon-copy.svg`)}
          sizeInPct={50}
          backgroundColor={'#19d1be'}
          iconBackgroundColor={'#ffffff'}
        />
        <InnerSection widthInPct="100" direction="column" alignItems="center">
          <TextWrapper marginTop="3">
            <Text font={'pamainlight'} size={4.2} color={'#ffffff'} uppercase>
              your&nbsp;
            </Text>
            <Text
              font={'pamainextrabold'}
              size={4.2}
              color={'#19d1be'}
              uppercase
            >
              key
            </Text>
            <Text font={'pamainlight'} size={4.2} color={'#ffffff'} uppercase>
              &nbsp;has been copied
            </Text>
          </TextWrapper>
          <TextWrapper marginTop="1">
            <Text
              font={'pamainextrabold'}
              size={8}
              color={'#ffffff'}
              uppercase
              nospacing
            >
              {props.referralCode}
            </Text>
          </TextWrapper>
          <TextWrapper marginTop="1">
            <Text font={'pamainlight'} size={4.2} color={'#19d1be'} uppercase>
              use it on your favorite platform
            </Text>
          </TextWrapper>
        </InnerSection>
      </Section>
      <Section height="14" justifyContent="center">
        <TextWrapper>
          <Text font={'pamainlight'} size={3.6} color={'#ffffff'} uppercase>
            tap anywhere to return
          </Text>
        </TextWrapper>
      </Section>
    </PopupContainer>
  )
}
