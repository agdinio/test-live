import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import Footer from '@/Components/Common/Footer'
import { vhToPx, responsiveDimension, evalImage, formatPhone } from '@/utils'
import { TimelineMax } from 'gsap'
import MenuBanner from '@/Components/Common/MenuBanner'
import Edit from '@/Components/Profile/Edit'
import SubMenu from '@/Components/Profile/SubMenu'
import CopyLayover from '@/Components/Profile/CopyLayover'
import ShareKey from '@/Components/Profile/ShareKey'
import Loadable from 'react-loadable'
import ActivityLoader from '@/Components/Common/ActivityLoader'
import parsePhoneNumber from 'libphonenumber-js'
import AuthSequence from '@/Components/Auth'

@inject('ProfileStore', 'NavigationStore', 'AnalyticsStore')
@observer
export default class Profile extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      isLoggedIn: false,
      activityIndicator: null,
      popupComponent: null,
    })

    this.showThis = false
    this.referralCode = this.props.ProfileStore.shareKey
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handleEditProfile() {
    this.popupComponent = (
      <Edit cancelChanges={this.handleCancelChanges.bind(this)} />
    )
  }

  handleAddPhone() {
    this.popupComponent = (
      <Edit cancelChanges={this.handleCancelChanges.bind(this)} />
    )
  }

  handleCancelChanges() {
    this.popupComponent = null
  }

  updateNotifications() {
    this.props.ProfileStore.updateProfile({
      userId: this.props.ProfileStore.tempProfile.userId,
      firstName: this.props.ProfileStore.tempProfile.firstName,
      lastName: this.props.ProfileStore.tempProfile.lastName,
      countryCode: this.props.ProfileStore.tempProfile.countryCode,
      mobile: this.props.ProfileStore.tempProfile.mobile,
      notifyEmail: this.props.ProfileStore.tempProfile.notifyByEmail,
      notifyMobile: this.props.ProfileStore.tempProfile.notifyByPhone,
    })
  }

  handleNotifyByPhone(event, val) {
    if (this.props.ProfileStore.tempProfile.mobile) {
      this.props.ProfileStore.tempProfile.notifyByPhone = val
    } else {
      this.props.ProfileStore.tempProfile.notifyByPhone = false
      new TimelineMax({ repeat: 0 })
        .to(this.PromptPhone, 0.2, { visibility: 'visible', opacity: 1 })
        .to(this.PromptPhone, 0.2, {
          visibility: 'hidden',
          opacity: 0,
          delay: 3,
        })
      //      TweenMax.fromTo(this.PromptPhone, 5.3, {visibility: 'visible', opacity: 1}, {visibility: 'hidden', opacity: 0})
    }

    if (event === 'CLICK') {
      this.updateNotifications()
    }
  }

  handleCancel(key) {
    this.props.NavigationStore.removeSubScreen(key, true)
  }

  handleCopyKey() {
    this.popupComponent = (
      <CopyLayover
        referralCode={this.referralCode}
        close={this.handleCancelChanges.bind(this)}
      />
    )
  }

  handleShareKey() {
    let Comp = Loadable({
      loader: () => import('@/Components/ShareThrough'),
      loading: ActivityLoader,
    })

    const _analyticsPageName = 'Profile-ShareThrough'
    this.props.NavigationStore.addSubScreen(
      <Comp
        referralCode={this.referralCode}
        cancel={this.handleCancel.bind(this, 'ShareThrough')}
        analyticsPageName={_analyticsPageName}
        //timeStart={this.handleTimeStart.bind(this, `Profile-ShareThrough`)}
        //timeStop={this.handleTimeStop.bind(this, `Profile-ShareThrough`)}
      />,
      'ShareThrough',
      true,
      false,
      true
    )
  }

  componentDidUpdate() {
    this.props.ProfileStore.copyProfileToTemp()
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({ page: 'Profile', isMainPage: true })
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({ page: 'Profile', isMainPage: true })
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'Profile',
      isMainPage: true,
      isUnload: true,
    })
  }

  handleSignout() {
    try {
      this.props.ProfileStore.getsignout()
    } catch (error) {
      console.log('error', error)
    }
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.componentDidMount()
      this.forceUpdate()
    }
  }

  render() {
    let { ProfileStore } = this.props

    if (!ProfileStore.profile.userId) {
      return (
        <Container>
          <AuthSequence mainHandleLoggedIn={this.handleIsLoggedIn.bind(this)} />
        </Container>
      )
    }

    const isLocked = ProfileStore.profile.userId ? false : true

    /*
    const mobile = ProfileStore.profile.mobile
      ? parsePhoneNumber(
          ProfileStore.profile.mobile,
          'US'
        ).formatInternational()
      : ''
*/

    const mobile = ProfileStore.profile.mobile
      ? `+${
          ProfileStore.profile.countryCode
            ? ProfileStore.profile.countryCode
            : 1
        } ${formatPhone(ProfileStore.profile.mobile)}`
      : ''
    console.log(ProfileStore.profile.countryCode)
    return (
      <Container>
        {this.props.NavigationStore.subScreens.map(comp => comp)}
        {this.popupComponent}

        <Scrolling>
          <MenuBanner
            backgroundColor={'#16b1e7'}
            icon={`menu-profile-icon.svg`}
            iconBackgroundColor={'#16b1e7'}
            sizeInPct="80"
            text={ProfileStore.profile.displayName}
            textColor={'#16b1e7'}
          />
          <Section height={9} alignItems={'center'}>
            <FriendsCounter>
              <FriendsCounterValue>100</FriendsCounterValue>
              <FriendsCounterIcon />
            </FriendsCounter>
          </Section>
          <Section
            height={46}
            justifyContent="center"
            alignItems="center"
            direction="column"
            style={{ position: 'relative' }}
          >
            <InnerSection>
              <ProfileImage src={evalImage(`profiles/icon-menu-profile.svg`)}>
                {ProfileStore.profile.userId ? (
                  <PencilIcon
                    src={evalImage(`input_feld-edit-profile.svg`)}
                    onClick={this.handleEditProfile.bind(this)}
                  />
                ) : null}
              </ProfileImage>
            </InnerSection>
            <InnerSection style={{ marginTop: vhToPx(2) }}>
              <Text
                font="pamainregular"
                color={'#ffffff'}
                size={5}
                nospacing
                uppercase
              >
                {ProfileStore.profile.displayName}
              </Text>
            </InnerSection>
            <InnerSection style={{ marginTop: vhToPx(0.5) }}>
              <Text
                font="pamainregular"
                color={'#a7a9ac'}
                size={4}
                nospacing
                uppercase
              >
                {ProfileStore.profile.email}
              </Text>
            </InnerSection>
            <InnerSection style={{ marginTop: vhToPx(2) }}>
              {isLocked ? null : mobile ? (
                <Text
                  font="pamainregular"
                  color={'#ffffff'}
                  size={5}
                  nospacing
                  uppercase
                >
                  {mobile}
                </Text>
              ) : (
                <AddIcon
                  src={evalImage(`input_feld-save-profile.svg`)}
                  onClick={this.handleAddPhone.bind(this)}
                />
              )}
            </InnerSection>
            {localStorage.getItem('jwt') ? (
              <Section
                style={{ marginTop: vhToPx(2) }}
                onClick={this.handleSignout.bind(this)}
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  font="pamainlight"
                  color={'#ffffff'}
                  size="3.5"
                  style={{ cursor: 'pointer' }}
                  uppercase
                >
                  Sign Out
                </Text>
              </Section>
            ) : null}
            <Divider />
          </Section>

          <Section
            height={23}
            justifyContent="center"
            alignItems="center"
            direction="column"
            style={{ position: 'relative' }}
          >
            <InnerSection>
              <Text
                font="pamainlight"
                color={'#ffffff'}
                size={4.2}
                nospacing
                uppercase
              >
                notify me about updates &
              </Text>
            </InnerSection>
            <InnerSection>
              <Text
                font="pamainlight"
                color={'#ffffff'}
                size={4.2}
                nospacing
                uppercase
              >
                the
              </Text>
              <Text
                font="pamainextrabold"
                color={'#ed1c24'}
                size={4.2}
                nospacing
                uppercase
              >
                &nbsp;live events&nbsp;
              </Text>
              <Text
                font="pamainlight"
                color={'#ffffff'}
                size={4.2}
                nospacing
                uppercase
              >
                by:
              </Text>
            </InnerSection>
            <InnerSection
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: vhToPx(2),
              }}
            >
              <NotifyText color={'#17c5ff'} content={'e-mail'}>
                <NotifyIcon
                  src={evalImage(`input_feld-verified-profile.svg`)}
                  size={4}
                />
              </NotifyText>
              <Spacer widthInPct="15" />
              <NotifyText
                color={
                  this.props.ProfileStore.tempProfile.notifyByPhone
                    ? '#17c5ff'
                    : '#ffffff'
                }
                content={'phone'}
              >
                {this.props.ProfileStore.tempProfile.notifyByPhone ? (
                  <NotifyIcon
                    src={evalImage(`input_feld-verified-profile.svg`)}
                    size={4}
                    onClick={
                      isLocked
                        ? null
                        : ProfileStore.isUpdating
                        ? null
                        : this.handleNotifyByPhone.bind(this, 'CLICK', false)
                    }
                  />
                ) : (
                  <NotifyEmpty
                    size={4}
                    onClick={
                      isLocked
                        ? null
                        : ProfileStore.isUpdating
                        ? null
                        : this.handleNotifyByPhone.bind(this, 'CLICK', true)
                    }
                  >
                    <Prompt innerRef={ref => (this.PromptPhone = ref)}>
                      Phone number is required
                    </Prompt>
                  </NotifyEmpty>
                )}
              </NotifyText>
            </InnerSection>

            <Divider />
          </Section>

          <SubMenu />
          <ShareKey
            referralCode={this.referralCode}
            refCopyKey={this.handleCopyKey.bind(this)}
            refShareKey={this.handleShareKey.bind(this)}
          />
        </Scrolling>
        <Bottom>
          <Footer />
        </Bottom>
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

const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => vhToPx(1.4)};
  display: flex;
  flex-direction: row;
`
const BannerText = styled.div`
  margin-top: ${props => vhToPx(1)};
  font-size: ${props => responsiveDimension(5)};
  font-family: pamainlight;
  color: #16b1e7;
  text-transform: uppercase;
  &:before {
    content: '${props => props.text}';
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
`

const Icon = styled.div`
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  border-radius: ${props => responsiveDimension(4.5)};
  background-color: ${props => props.backgroundColor};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;

  margin-left: ${props => responsiveDimension(0.1)};
  margin-bottom: ${props => responsiveDimension(0.3)};
  border: ${props => `${responsiveDimension(0.4)} solid #ffffff`};
`

const backBanner = keyframes`
  0%{height: ${responsiveDimension(1)};}
  50%{height: ${responsiveDimension(9.5)};}
  100%{height: ${props => responsiveDimension(8.5)};}
`

const Scrolling = styled.div`
  width: 100%;
  height: ${props => vhToPx(84)};
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0)};
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
`

const Divider = styled.div`
  width: 100%;
  height: ${props => vhToPx(0.1)};
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  &:after {
    content: '';
    width: 80%
    height: inherit;
    background-color: grey;
  }
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

const NotifyText = styled.div`
  width: 100%;
  &:before {
    content: '${props => props.content}';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(4)};
    color: ${props => props.color};
    text-transform: uppercase;
    margin-right: ${props => responsiveDimension(1)};
    white-space:nowrap;
  }
  display: flex;
  align-items: center;
`

const NotifyIcon = styled.img`
  height: ${props => responsiveDimension(props.size)};
  &:hover {
    cursor: pointer;
  }
`

const NotifyEmpty = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: #ffffff;
  &:hover {
    cursor: pointer;
  }
  position: relative;
`

const Prompt = styled.span`
  visibility: hidden;
  width: ${props => responsiveDimension(16)};
  background-color: #17c5ff;
  text-align: center;
  border-radius: ${props => responsiveDimension(0.5)};
  padding: ${props => responsiveDimension(0.5)}
    ${props => responsiveDimension(0.5)};
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: ${props => responsiveDimension(-8)};
  opacity: 0;
  transition: opacity 0.3s;
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(2.5)};
  color: #000000;

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: ${props => responsiveDimension(-0.8)};
    border-width: ${props => responsiveDimension(0.8)};
    border-style: solid;
    border-color: #17c5ff transparent transparent transparent;
  }
`

const Spacer = styled.div`
  width: ${props => props.widthInPct}%;
  min-width: ${props => props.widthInPct}%;
  display: flex;
`

const ProfileImage = styled.div`
  width: ${props => responsiveDimension(21)};
  height: ${props => responsiveDimension(21)};
  min-width: ${props => responsiveDimension(21)};
  min-height: ${props => responsiveDimension(21)};
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border: ${props => `${responsiveDimension(0.9)} solid #ffffff`};
  position: relative; /*For PencilIcon*/
`

const PencilIcon = styled.img`
  height: ${props => responsiveDimension(5)};
  position: absolute;
  top: 82%;
  left: 72%;
  cursor: pointer;
`

const AddIcon = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  &:before {
    content: 'add phone';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(4)};
    color: #17c5ff;
    text-transform: uppercase;
  }
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(5)};
    height: ${props => responsiveDimension(5)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    margin-top: 0.5%;
  }
`

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  height: 10%;
  bottom: 0;
`

const FriendsCounter = styled.div`
  width: 18%;
  height: ${props => vhToPx(4.5)};
  border-top-right-radius: ${props => vhToPx(4.5)};
  border-bottom-right-radius: ${props => vhToPx(4.5)};
  background-color: #0b7ecc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`

const FriendsCounterValue = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(4.5)};
  color: #ffffff;
  line-height: 1;
  height: ${props => responsiveDimension(4.5 * 0.9)};
`

const FriendsCounterIcon = styled.div`
  width: ${props => vhToPx(4)};
  height: ${props => vhToPx(4)};
  min-width: ${props => vhToPx(4)};
  min-height: ${props => vhToPx(4)};
  border-radius: 50%;
  background: white;
  margin-right: 1%;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${evalImage(`menu-social-icon.svg`)});
    background-repeat: no-repeat;
    background-size: 75%;
    background-position: center;
  }
`

const SubMenuBarWrap = styled.div`
  width: 90%;
  height: ${props => responsiveDimension(9)};
  border-top-right-radius: ${props => responsiveDimension(9)};
  border-bottom-right-radius: ${props => responsiveDimension(9)};
  background-color: #939598;
  margin-top: ${props => vhToPx(0.5)};
  margin-bottom: ${props => vhToPx(0.5)};
  display: flex;
  justify-content: flex-end;
`

const SubMenuBarTransparent = styled.div`
  width: 80%;
  height: ${props => responsiveDimension(9)};
  border-radius: ${props => responsiveDimension(9)};
  position: relative;
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
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(4)};
    color: #ffffff;
    text-transform: uppercase;
    line-height: 0.9;
    height: ${props => responsiveDimension(4 * 0.8)};
    padding-left: 25%;
  }
`

const SubMenuIcon = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(9)};
  height: ${props => responsiveDimension(9)};
  border-radius: 50%;
  border: ${props => `${responsiveDimension(0.8)} solid #ffffff`};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;
`
