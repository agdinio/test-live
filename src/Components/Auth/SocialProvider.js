import React, { Component } from 'react'
import {
  auth,
  googleProvider,
  facebookAuthProvider,
  appleAuthProvider,
} from '../../Firebase'
import styled from 'styled-components'
import { extendObservable } from 'mobx'
import { observer, inject } from 'mobx-react'
import agent from '@/Agent'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
@inject('AuthStore', 'ProfileStore')
@observer
export default class SocialProvider extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      //errors: null,
      errorMessage: null,
      errorLocation: 0,
      touched: {
        userName: false,
        email: false,
        password: false,
        confirmPassword: false,
        firstName: false,
        lastName: false,
        phone: false,
      },
      textAttr: {},
      formInputAttr: {},
    })
  }
  componentWillMount() {
    this.textAttr['fontSize'] = responsiveDimension(7)
    this.textAttr['subTextFontSize'] = responsiveDimension(5)

    this.formInputAttr['borderRadius'] = responsiveDimension(0.5)
    this.formInputAttr['height'] = responsiveDimension(7)
    this.formInputAttr['marginBottom'] = responsiveDimension(1.5)
    this.formInputAttr['fontSize'] = responsiveDimension(3)
  }
  // Sign in with google
  signin(authType) {
    if (authType === 'google') {
      auth
        .signInWithPopup(googleProvider)
        .then(response => {
          console.log('Google - response', response)
          /* let getDetails = response.additionalUserInfo
            ? response.additionalUserInfo.profile
            : null
          this.props.AuthStore.values.email = getDetails
            ? getDetails.email
            : null
          this.props.AuthStore.values.password = getDetails
            ? getDetails.id
            : null
          this.props.AuthStore.values.firstName = getDetails
            ? getDetails.given_name
            : null
          this.props.AuthStore.values.lastName = getDetails
            ? getDetails.family_name
            : null
          this.props.AuthStore.values.phone = '564654'
          console.log(this.props.AuthStore.values)
          this.props.AuthStore.signup()
            .then(next => {
              if (next) {
                localStorage.removeItem('ANONYMOUS_USER')
                this.props.handleIsLoggedIn(true)
              }
            })
            .catch(err => {
              console.log('error', err)
            }) */
        })
        .catch(err => {
          this.props.statusMessage(true)
          console.log('error - Google', err)
        })
    } else if (authType === 'facebook') {
      auth
        .signInWithPopup(facebookAuthProvider)
        .then(response => {
          console.log('facebook - response', response)
        })
        .catch(err => {
          this.props.statusMessage(true)
          console.log('error - Google', err)
        })
    } else {
      auth
        .signInWithPopup(appleAuthProvider)
        .then(response => {
          console.log('apple - response', response)
        })
        .catch(err => {
          this.props.statusMessage(err)
          console.log('error - Google', err)
        })
    }
  }

  render() {
    return (
      <InnerSection
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: vhToPx(2),
        }}
      >
        <NotifyIcon
          src={evalImage(`socialproviders/google-icon-transparent.png`)}
          size={6}
          onClick={() => this.signin('google')}
          title="Google"
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <NotifyIcon
          src={evalImage(`socialproviders/facebook-icon-transparent.png`)}
          size={6}
          onClick={() => this.signin('facebook')}
          title="Facebook"
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <NotifyIcon
          src={evalImage(`socialproviders/apple-icon-transparent.png`)}
          size={6}
          onClick={() => this.signin('apple')}
          title="Apple"
        />
      </InnerSection>
    )
  }
}

const NotifyIcon = styled.img`
  height: ${props => responsiveDimension(props.size)};
  &:hover {
    cursor: pointer;
  }
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
