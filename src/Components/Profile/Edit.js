import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, evalImage, formatPhone } from '@/utils'
import iconNoEdit from '@/assets/images/input_feld-no_edit-profile.svg'
import iconAdd from '@/assets/images/input_feld-add-profile.svg'
import iconSave from '@/assets/images/input_feld-save-profile.svg'
import CountryCode from '@/Components/Common/CountryCode'

import { updateUserDetails } from '../../Components/Auth/GoogleAnalytics'

@inject('ProfileStore')
@observer
export default class Edit extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      tempProfile: {
        userId: 0,
        name: '',
        email: '',
        mobile: '',
        isNameEditing: false,
        isEmailEditing: false,
        isPhoneEditing: false,
        notifyByEmail: true,
        notifyByPhone: false,
      },
      errorMessage: null,
    })

    this.attr = {
      saveChangesButton: {
        width: responsiveDimension(28),
        height: responsiveDimension(9),
        borderWidth: responsiveDimension(0.4),
        borderRadius: responsiveDimension(0.4),
        beforeFontSize: responsiveDimension(9 * 0.4),
        beforeHeight: responsiveDimension(9 * 0.4 * 0.8),
        beforeLetterSpacing: responsiveDimension(0.1),
      },
    }

    this.props.ProfileStore.copyProfileToTemp()
  }

  editInputClick(isInputEditing, e) {
    this.props.ProfileStore.tempProfile[isInputEditing] = !this.props
      .ProfileStore.tempProfile[isInputEditing]
  }

  handleInputChange(e) {
    let val = e.target.value

    if ('mobile' === e.target.name) {
      if (
        e.target.value.length === 1 &&
        e.target.value.toString().charAt(0) === '('
      ) {
        val = ''
      }
    }

    this.props.ProfileStore.tempProfile[e.target.name] = val
  }

  handleInputBlur(isInputEditing, e) {
    this.props.ProfileStore.tempProfile[isInputEditing] = !this.props
      .ProfileStore.tempProfile[isInputEditing]
  }

  handleCountryCodeChange(e) {
    this.props.ProfileStore.tempProfile.countryCode = e.target.value
  }

  isNumber(e) {
    let code = e.which

    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault()
    }
  }

  handleCloseErrorMessage() {
    this.errorMessage = null
  }

  handleSaveChangesClick() {
    let { ProfileStore } = this.props

    const errors = []

    if (
      ProfileStore.tempProfile.mobile.length > 0 &&
      ProfileStore.tempProfile.mobile.length < 10
    ) {
      errors.push('phone must be at least 10 digits')
    }

    if (errors && errors.length > 0) {
      this.errorMessage = (
        <ErrorMessageComp
          items={errors}
          close={this.handleCloseErrorMessage.bind(this)}
        />
      )
      return
    }

    updateUserDetails(ProfileStore.tempProfile)

    const updatedMobile = ProfileStore.tempProfile.mobile
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/-/g, '')
      .replace(/\s/g, '')

    if (updatedMobile) {
      if (!ProfileStore.tempProfile.countryCode) {
        ProfileStore.tempProfile.countryCode = '1'
      }
    }

    ProfileStore.updateProfile({
      userId: ProfileStore.tempProfile.userId,
      firstName: ProfileStore.tempProfile.firstName,
      lastName: ProfileStore.tempProfile.lastName,
      countryCode: updatedMobile ? ProfileStore.tempProfile.countryCode : '',
      mobile: updatedMobile,
      notifyEmail: ProfileStore.tempProfile.notifyByEmail,
      notifyMobile: ProfileStore.tempProfile.mobile ? true : false,
      displayName:
        (ProfileStore.tempProfile.firstName || '') +
        ' ' +
        (ProfileStore.tempProfile.lastName || ''),
    }).then(next => {
      if (next) {
        this.props.cancelChanges()
      }
    })
  }

  render() {
    let { ProfileStore } = this.props

    return (
      <Container>
        {this.errorMessage}
        <Section
          height="35"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <InnerSection widthInPct="78" justifyContent="flex-end">
            <Text font="pamainregular" color={'#ffffff'} size="2.3" uppercase>
              edit/add
            </Text>
          </InnerSection>
          <InnerSection
            widthInPct="75"
            justifyContent="space-between"
            alignItems="center"
          >
            <ProfileImage src={evalImage(`profiles/icon-menu-profile.svg`)} />
            <PencilIcon src={evalImage(`input_feld-edit-profile.svg`)} />
          </InnerSection>
        </Section>

        <Section height="46" direction="column" alignItems="center">
          <InnerSection
            widthInPct="75"
            justifyContent="space-between"
            marginBottom="1"
          >
            {ProfileStore.tempProfile.isFirstNameEditing ? (
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                value={ProfileStore.tempProfile.firstName}
                placeholder="FIRST NAME"
                onChange={
                  ProfileStore.isUpdating
                    ? null
                    : this.handleInputChange.bind(this)
                }
                onBlur={
                  ProfileStore.isUpdating
                    ? null
                    : this.handleInputBlur.bind(this, 'isFirstNameEditing')
                }
              />
            ) : (
              <FormInputReadOnly>
                {ProfileStore.tempProfile.firstName}
              </FormInputReadOnly>
            )}
            <AddEditIcon
              src={
                ProfileStore.tempProfile.isFirstNameEditing ? iconSave : iconAdd
              }
              size={6.5}
              onClick={
                ProfileStore.isUpdating
                  ? null
                  : this.editInputClick.bind(this, 'isFirstNameEditing')
              }
            />
          </InnerSection>
          <InnerSection
            widthInPct="75"
            justifyContent="space-between"
            marginBottom="1"
          >
            {ProfileStore.tempProfile.isLastNameEditing ? (
              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                value={ProfileStore.tempProfile.lastName}
                maxLength="20"
                placeholder="LAST NAME"
                onChange={
                  ProfileStore.isUpdating
                    ? null
                    : this.handleInputChange.bind(this)
                }
                onBlur={
                  ProfileStore.isUpdating
                    ? null
                    : this.handleInputBlur.bind(this, 'isLastNameEditing')
                }
              />
            ) : (
              <FormInputReadOnly>
                {ProfileStore.tempProfile.lastName}
              </FormInputReadOnly>
            )}
            <AddEditIcon
              src={
                ProfileStore.tempProfile.isLastNameEditing ? iconSave : iconAdd
              }
              size={6.5}
              onClick={
                ProfileStore.isUpdating
                  ? null
                  : this.editInputClick.bind(this, 'isLastNameEditing')
              }
            />
          </InnerSection>
          <InnerSection
            widthInPct="75"
            justifyContent="space-between"
            marginBottom="1"
          >
            <FormInputReadOnly style={{ color: '#a7a9ac' }}>
              {ProfileStore.tempProfile.email}
            </FormInputReadOnly>
            <AddEditIcon
              src={iconNoEdit}
              size={5}
              style={{ marginTop: '2%', marginRight: '1.5%' }}
            />
          </InnerSection>
          <InnerSection
            widthInPct="75"
            justifyContent="space-between"
            marginBottom="1"
          >
            {ProfileStore.tempProfile.isPhoneEditing ? (
              <PhoneWrap>
                <CountryCode
                  countryCodeValue={ProfileStore.tempProfile.countryCode}
                  countryCodeChange={this.handleCountryCodeChange.bind(this)}
                />
                <PhoneFormInput
                  id="mobile"
                  name="mobile"
                  type="text"
                  value={formatPhone(ProfileStore.tempProfile.mobile)}
                  placeholder="PHONE"
                  maxLength="14"
                  onChange={
                    ProfileStore.isUpdating
                      ? null
                      : this.handleInputChange.bind(this)
                  }
                  onBlur={
                    ProfileStore.isUpdating
                      ? null
                      : this.handleInputBlur.bind(this, 'isPhoneEditing')
                  }
                  onKeyPress={this.isNumber.bind(this)}
                />
              </PhoneWrap>
            ) : (
              <FormInputReadOnly>
                {/*
                {ProfileStore.tempProfile.mobile
                  ? parsePhoneNumber(
                      ProfileStore.tempProfile.mobile,
                      'US'
                    ).formatInternational()
                  : ''}
*/}
                {ProfileStore.tempProfile.mobile
                  ? `+${ProfileStore.tempProfile.countryCode} ${formatPhone(
                      ProfileStore.tempProfile.mobile
                    )}`
                  : ''}
              </FormInputReadOnly>
            )}
            <AddEditIcon
              src={ProfileStore.tempProfile.isPhoneEditing ? iconSave : iconAdd}
              size={6.5}
              onClick={
                ProfileStore.isUpdating
                  ? null
                  : this.editInputClick.bind(this, 'isPhoneEditing')
              }
            />
          </InnerSection>
          <InnerSection widthInPct="75" justifyContent="center" marginTop="3">
            <Button
              text="save changes"
              color={'#ffffff'}
              borderColor="#ffffff"
              onClick={this.handleSaveChangesClick.bind(this)}
              attr={this.attr.saveChangesButton}
            >
              <ButtonArrow src={evalImage(`icon-arrow.svg`)} />
            </Button>
          </InnerSection>
        </Section>

        <Section height="13" justifyContent="center" alignItems="center">
          <Text
            font="pamainlight"
            color={'#ffffff'}
            size="3.5"
            style={{ cursor: 'pointer' }}
            uppercase
            onClick={this.props.cancelChanges}
          >
            cancel changes
          </Text>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.95);
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
`

const InputWrapper = styled.div`
  width: 100%;
  // height: 100%;
`

const FormInput = styled.input`
  width: 80%;
  height: ${props => responsiveDimension(7)};
  border-radius: ${props => responsiveDimension(0.4)};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.5)};
  text-transform: uppercase;
  padding-left: 5%;
  color: #000000;
  border: none;
  outline: none;
`

const PhoneFormInput = styled.input`
  width: 80%;
  height: ${props => responsiveDimension(7)};
  border-top-right-radius: ${props => responsiveDimension(0.4)};
  border-bottom-right-radius: ${props => responsiveDimension(0.4)};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.5)};
  text-transform: uppercase;
  padding-left: 5%;
  color: #000000;
  border: none;
  outline: none;
`

const FormInputReadOnly = styled.div`
  width: 80%;
  height: ${props => responsiveDimension(7)};
  border-radius: ${props => responsiveDimension(0.4)};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.5)};
  text-transform: uppercase;
  padding-left: 5%;
  color: #ffffff;
  display: flex;
  align-items: center;
`

const AddEditIcon = styled.img`
  height: ${props => responsiveDimension(props.size)};
  cursor: pointer;
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
  &:before {
    content: '${props => props.text}';
    text-transform: uppercase;
    font-family: pamainregular;
    font-size: ${props => props.attr.beforeFontSize};
    color: ${props => props.color || '#000000'};
    line-height: 0.9;
    height: ${props => props.attr.beforeHeight};
    letter-spacing: ${props => props.attr.beforeLetterSpacing};
  }
`

const ButtonArrow = styled.img`
  height: 40%;
  margin-left: 7%;
`

const ErrorMessageComp = props => {
  return (
    <MessageContainer onClick={props.close}>
      <Top>
        <ErrMsgSection
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '40%' }}
        >
          <TextWrapper>
            <ErrMsgText
              font={'pamainlight'}
              size={4.5}
              color={'#ffffff'}
              uppercase
            >
              there are&nbsp;
            </ErrMsgText>
            <ErrMsgText
              font={'pamainbold'}
              size={4.5}
              color={'#c61818'}
              uppercase
            >
              errors
            </ErrMsgText>
          </TextWrapper>
        </ErrMsgSection>
        <ErrMsgSection
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '65%' }}
        >
          <TextWrapper>
            <ErrMsgText
              font={'pamainregular'}
              size={4.5}
              color={'#ffffff'}
              uppercase
            >
              in your information
            </ErrMsgText>
          </TextWrapper>
        </ErrMsgSection>
      </Top>
      <Middle height={55}>
        {(props.items || []).map(error => {
          return (
            <ErrMsgText
              key={error}
              font="pamainregular"
              color={'#c61818'}
              size="3.5"
              uppercase
              style={{ marginBottom: vhToPx(1) }}
            >
              {error}
            </ErrMsgText>
          )
        })}
      </Middle>
      <Bottom height={19}>
        <ErrMsgText font="pamainlight" color={'#ffffff'} size="3.5" uppercase>
          tap anywhere to correct
        </ErrMsgText>
      </Bottom>
    </MessageContainer>
  )
}

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

const ErrMsgSection = styled.div`
  width: 100%;
  ${props => (props.heightInPct ? `height:${props.heightInPct}%` : ``)};
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

const ErrMsgText = styled.span`
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

const TextWrapper = styled.div`
  text-align: center;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const PhoneWrap = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
`
