import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import {
  vhToPx,
  responsiveDimension,
  evalImage,
  validEmail,
  formatPhone,
} from '@/utils'
import CountryCode from '@/Components/Common/CountryCode'
import { eventCapture } from '../Auth/GoogleAnalytics'

@inject('ProfileStore', 'CommonStore')
@observer
export default class BillingDetails extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      filterCountry: {
        isShow: false,
        countries: this.props.CommonStore.countries || [],
        countryName: [],
      },
      filterZone: {
        isShow: false,
        zones: this.props.CommonStore.zones || [],
        zoneName: [],
      },
      filterCity: {
        isShow: false,
        cities: this.props.CommonStore.cities || [],
        cityName: [],
      },
    })

    this.formInputAttr = {}
    this.formInputAttr['borderRadius'] = responsiveDimension(0.4)
    this.formInputAttr['height'] = responsiveDimension(7)
    this.formInputAttr['heightRow'] = 7
    this.formInputAttr['marginBottom'] = responsiveDimension(1.5)
    this.formInputAttr['fontSize'] = responsiveDimension(3.5)
    this.formInputAttr['emailSectionMarginTop'] = responsiveDimension(1)
    this.formInputAttr['emailSectionPaddingTop'] = responsiveDimension(1.5)
    this.formInputAttr['emailSectionPaddingBottom'] = responsiveDimension(1.5)

    this.attr = {
      headerLabel: {
        height: vhToPx(9),
        fontSize: responsiveDimension(9 * 0.4),
      },
      useShippingAddress: {
        fontSize: responsiveDimension(3),
        paddingRight: responsiveDimension(1),
        marginTop: responsiveDimension(2.5),
        marginBottom: responsiveDimension(2.5),
      },
      check: {
        width: responsiveDimension(4),
        height: responsiveDimension(4),
      },
      paymentButton: {
        width: responsiveDimension(28),
        height: responsiveDimension(9),
        borderWidth: responsiveDimension(0.4),
        borderRadius: responsiveDimension(0.4),
        beforeFontSize: responsiveDimension(9 * 0.4),
        beforeHeight: responsiveDimension(9 * 0.4 * 0.8),
        beforeLetterSpacing: responsiveDimension(0.1),
      },
    }
  }

  handleCountryCodeChange(e) {
    this.props.ProfileStore.billingAddress.countryCode = e.target.value
  }

  handleInputChange(e) {
    if (
      'country' !== e.target.name &&
      'state' !== e.target.name &&
      'city' !== e.target.name &&
      'phone' !== e.target.name
    ) {
      this.props.ProfileStore.billingAddress[e.target.name] = e.target.value
    }

    if ('country' === e.target.name) {
      this.filterCountry.countryName = e.target.value
    }

    if ('state' === e.target.name) {
      this.filterZone.zoneName = e.target.value
    }

    if ('city' === e.target.name) {
      this.filterCity.cityName = e.target.value
    }

    if ('phone' === e.target.name) {
      let val = e.target.value
      if (
        e.target.value.length === 1 &&
        e.target.value.toString().charAt(0) === '('
      ) {
        val = ''
      }
      this.props.ProfileStore.billingAddress[e.target.name] = val
    }
  }

  handleInputBlur(required, e) {
    const isEmail = new RegExp('email', 'gi').test(e.target.name)

    const val =
      Object.keys(e.target.value).length > 0
        ? JSON.stringify(e.target.value)
        : e.target.value

    if (required) {
      if (val.length < 2) {
        e.target.style.borderStyle = 'solid'
        e.target.style.borderWidth = responsiveDimension(0.5)
        e.target.style.borderColor = '#ff0000'
      } else {
        if (isEmail) {
          if (validEmail(e.target.value)) {
            e.target.style.borderStyle = 'none'
            e.target.style.borderWidth = 0
            e.target.style.borderColor = 'transparent'
          } else {
            e.target.style.borderStyle = 'solid'
            e.target.style.borderWidth = responsiveDimension(0.5)
            e.target.style.borderColor = '#ff0000'
          }
        } else {
          e.target.style.borderStyle = 'none'
          e.target.style.borderWidth = 0
          e.target.style.borderColor = 'transparent'
        }
      }
    }
  }

  async handleFilterKeyUp(e) {
    if ('country' === e.target.name) {
      try {
        if (e.target.value && e.target.value.trim()) {
          this.filterCountry.countries = await this.props.CommonStore.countries.filter(
            o =>
              /^.{2,}$/.test(e.target.value) &&
              e.target.value.toLowerCase() ===
                o.name.toLowerCase().substring(0, e.target.value.length)
          )
          if (
            this.filterCountry.countries &&
            this.filterCountry.countries.length > 0
          ) {
            this.filterCountry.isShow = true
          } else {
            this.filterCountry.isShow = false
          }
        } else {
          this.filterCountry.countries = []
          this.filterCountry.isShow = false
        }
      } catch (e) {
        this.filterCountry.isShow = false
      }
    } else if ('state' === e.target.name) {
      try {
        if (e.target.value && e.target.value.trim()) {
          this.filterZone.zones = await this.props.CommonStore.zones.filter(
            o =>
              e.target.value.toLowerCase() ===
              o.name.toLowerCase().substring(0, e.target.value.length)
          )
          if (this.filterZone.zones && this.filterZone.zones.length > 0) {
            this.filterZone.isShow = true
          } else {
            this.filterZone.isShow = false
          }
        } else {
          this.filterZone.isShow = false
        }
      } catch (e) {
        this.filterZone.zones = []
        this.filterZone.isShow = false
      }
    } else if ('city' === e.target.name) {
      try {
        if (e.target.value && e.target.value.trim()) {
          this.filterCity.cities = await this.props.CommonStore.cities.filter(
            o =>
              e.target.value.toLowerCase() ===
              o.name.toLowerCase().substring(0, e.target.value.length)
          )
          if (this.filterCity.cities && this.filterCity.cities.length > 0) {
            this.filterCity.isShow = true
          } else {
            this.filterCity.isShow = false
          }
        } else {
          this.filterCity.isShow = false
        }
      } catch (e) {
        this.filterCity.cities = []
        this.filterCity.isShow = false
      }
    }
  }

  handleFilteredItem(key, val, isInit) {
    if ('country' === key) {
      this.filterCountry.isShow = false
      this.filterCountry.countries = []

      this.props.ProfileStore.billingAddress['country'] = JSON.stringify(val)

      if (!isInit) {
        this.props.ProfileStore.billingAddress['state'] = ''
        this.props.ProfileStore.billingAddress['city'] = ''
        this.filterZone.zoneName = ''
        this.filterCity.cityName = ''
      }

      const _country = val
      this.filterCountry.countryName = _country.name
      this.props.CommonStore.readZonesByCountry({
        countryId: _country.countryId,
        countryCode: _country.code,
      }).then(async next => {
        if (next) {
          const _state = await this.props.CommonStore.zones.filter(
            o =>
              o.code.toLowerCase() ===
              (this.props.ProfileStore.billingAddress.state || '').toLowerCase()
          )[0]
          if (_state) {
            this.handleFilteredItem('state', _state, true)
          }
        }
      })
    }
    if ('state' === key) {
      this.filterZone.isShow = false
      this.filterZone.zones = []

      if (!isInit) {
        this.props.ProfileStore.billingAddress['city'] = ''
        this.filterCity.cityName = ''
      }

      if (val.hasOwnProperty('name')) {
        this.props.ProfileStore.billingAddress['state'] = JSON.stringify(val)
        const _state = val
        this.filterZone.zoneName = _state.name
        this.props.CommonStore.readCitiesByZone({
          zoneId: _state.zoneId,
          countryId: _state.countryId,
        }).then(async next => {
          if (next) {
            const _city = await this.props.CommonStore.cities.filter(
              o =>
                o.name.toLowerCase() ===
                (
                  this.props.ProfileStore.billingAddress.city || ''
                ).toLowerCase()
            )[0]
            if (_city) {
              this.filterCity.cityName = _city.name
              this.props.ProfileStore.billingAddress['city'] = _city.name
            }
          }
        })
      } else {
        this.props.ProfileStore.billingAddress['state'] = JSON.stringify({
          zoneId: 0,
          countryId: 0,
          code: val,
          name: val,
        })
      }
    }
    if ('city' === key) {
      this.filterCity.isShow = false
      this.filterCity.cities = []
      this.filterCity.cityName = val.name
      this.props.ProfileStore.billingAddress['city'] = val.name
    }
  }

  handleFilteredItemClick(key, val) {
    this.handleFilteredItem(key, val)
  }

  handleUseAsShipAddr(val) {
    this.props.ProfileStore.billingAddress.useAsShippingAddress = val
  }

  handlePaymentDetailsClick() {
    const errors = []
    let email = ''
    let confirmEmail = ''

    for (let key in this.props.ProfileStore.billingAddress) {
      if (this.props.ProfileStore.billingAddress.hasOwnProperty(key)) {
        if (
          !'addressline2, useasshippingaddress, countrycode'.match(
            new RegExp(key, 'gi')
          )
        ) {
          const splitted = key.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1)
          let newKey = ''

          if (
            this.props.ProfileStore.billingAddress[key] &&
            this.props.ProfileStore.billingAddress[key].length < 2
          ) {
            for (let i = 0; i < splitted.length; i++) {
              newKey += ' ' + splitted[i]
            }
            errors.push(newKey)
          } else {
            const isEmail = new RegExp('email', 'gi').test(key)
            if (isEmail) {
              if (!validEmail(this.props.ProfileStore.billingAddress[key])) {
                for (let i = 0; i < splitted.length; i++) {
                  newKey += ' ' + splitted[i]
                }
                errors.push(newKey)
              } else {
                if (key.toLowerCase() === 'email') {
                  email = this.props.ProfileStore.billingAddress[key].trim()
                }
                if (key.toLowerCase() === 'confirmemail') {
                  confirmEmail = this.props.ProfileStore.billingAddress[
                    key
                  ].trim()
                }
              }
            }
          }
        }
      }
    }

    if (
      email &&
      confirmEmail &&
      email.toLowerCase() !== confirmEmail.toLowerCase()
    ) {
      errors.push('email does not match')
    }

    if (errors.length > 0) {
      this.props.error(errors)
      return
    } else {
      this.props.next('BillingDetails', 'PaymentDetails')
    }

    console.log('Billing Details:', this.props.ProfileStore.billingAddress)

    eventCapture('ADD_SHIPPING_INFO', this.props.ProfileStore.billingAddress)
  }

  initOptionEventListener(key, mode) {
    let funcCountry = async e => {
      if (!this.refCountry.contains(e.target)) {
        const _selected = await this.props.CommonStore.countries.filter(
          o =>
            o.name.toLowerCase() ===
            this.filterCountry.countryName.toLowerCase()
        )[0]
        if (_selected) {
          this.handleFilteredItem('country', _selected)
        } else {
          this.filterCountry.countryName = ''
          this.filterZone.zoneName = ''
          this.filterCity.cityName = ''
          this.props.ProfileStore.billingAddress.country = ''
        }
        window.removeEventListener('click', funcCountry)
        setTimeout(() => (this.filterCountry.isShow = false), 0)
      }
    }

    let funcState = async e => {
      if (!this.refState.contains(e.target)) {
        const _selected = await this.props.CommonStore.zones.filter(
          o => o.name.toLowerCase() === this.filterZone.zoneName.toLowerCase()
        )[0]
        if (_selected) {
          this.handleFilteredItem('state', _selected)
        } else {
          this.filterZone.zoneName = ''
          this.filterCity.cityName = ''
          this.props.ProfileStore.billingAddress.state = ''
        }
        window.removeEventListener('click', funcState)
        setTimeout(() => (this.filterZone.isShow = false), 0)
      }
    }

    let funcCity = async e => {
      if (!this.refCity.contains(e.target)) {
        const _selected = await this.props.CommonStore.cities.filter(
          o => o.name.toLowerCase() === this.filterCity.cityName.toLowerCase()
        )[0]
        if (_selected) {
          this.handleFilteredItem('city', _selected)
        } else {
          this.props.ProfileStore.billingAddress.city = this.filterCity.cityName
        }
        window.removeEventListener('click', funcCity)
        setTimeout(() => (this.filterCity.isShow = false), 0)
      }
    }

    if (mode) {
      if ('country' === key) {
        window.addEventListener('click', funcCountry)
      }
      if ('state' === key) {
        window.addEventListener('click', funcState)
      }
      if ('city' === key) {
        window.addEventListener('click', funcCity)
      }
    } else {
      if ('country' === key) {
        window.removeEventListener('click', funcCountry)
      }
      if ('state' === key) {
        window.removeEventListener('click', funcState)
      }
      if ('city' === key) {
        window.removeEventListener('click', funcCity)
      }
    }
  }

  componentDidMount() {
    if (
      this.props.ProfileStore.billingAddress &&
      this.props.ProfileStore.billingAddress.country
    ) {
      try {
        this.filterCountry.countryName = JSON.parse(
          this.props.ProfileStore.billingAddress.country
        ).name
        this.handleFilteredItem(
          'country',
          JSON.parse(this.props.ProfileStore.billingAddress.country),
          true
        )
      } catch (e) {}
    }
  }

  render() {
    let { ProfileStore, CommonStore } = this.props

    const ddWrapHeightCountry =
      this.filterCountry.countries.length * this.formInputAttr.heightRow < 49
        ? this.filterCountry.countries.length * this.formInputAttr.heightRow
        : 49
    const ddWrapHeightState =
      this.filterZone.zones.length * this.formInputAttr.heightRow < 42
        ? this.filterZone.zones.length * this.formInputAttr.heightRow
        : 42
    const ddWrapHeightCity =
      this.filterCity.cities.length * this.formInputAttr.heightRow < 35
        ? this.filterCity.cities.length * this.formInputAttr.heightRow
        : 35

    return (
      <Scrolling>
        <HeaderLabel attr={this.attr.headerLabel}>
          fill out your billing address
        </HeaderLabel>
        <Form
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <FormInput
            // onChange={this.handleEmailChange.bind(this)}
            // onKeyPress={this.handleEnterKey.bind(this)}
            // valid={this.valid}
            // value={this.props.AuthStore.values.email}
            id="firstName"
            name="firstName"
            type="text"
            placeholder="FIRST NAME*"
            // readOnly={this.isAuthenticating ? true : false}
            attr={this.formInputAttr}
            value={ProfileStore.billingAddress.firstName}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this, true)}
          />
          <FormInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="LAST NAME*"
            attr={this.formInputAttr}
            value={ProfileStore.billingAddress.lastName}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this, true)}
          />
          <PhoneWrap attr={this.formInputAttr}>
            <CountryCode
              countryCodeValue={ProfileStore.billingAddress.countryCode}
              countryCodeChange={this.handleCountryCodeChange.bind(this)}
            />
            <PhoneFormInput
              id="phone"
              name="phone"
              type="text"
              placeholder="PHONE*"
              maxLength="14"
              value={formatPhone(ProfileStore.billingAddress.phone)}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputBlur.bind(this, true)}
            />
          </PhoneWrap>
          <FormInput
            id="addressLine1"
            name="addressLine1"
            type="text"
            placeholder="ADDRESS LINE 1*"
            attr={this.formInputAttr}
            value={ProfileStore.billingAddress.addressLine1}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this, true)}
          />
          <FormInput
            id="addressLine2"
            name="addressLine2"
            type="text"
            placeholder="ADDRESS LINE 2"
            attr={this.formInputAttr}
            value={ProfileStore.billingAddress.addressLine2}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this, false)}
          />
          <InputFilterWrap
            attr={this.formInputAttr}
            showFilter={this.filterCountry.isShow}
            zIndex={100}
          >
            <FormInput
              id="country"
              name="country"
              innerRef={ref => (this.refCountry = ref)}
              attr={this.formInputAttr}
              widthInPct={'100'}
              value={this.filterCountry.countryName}
              noMarginBottom={this.filterCountry.isShow ? true : false}
              onKeyUp={this.handleFilterKeyUp.bind(this)}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputBlur.bind(this, true)}
              onFocus={this.initOptionEventListener.bind(this, 'country', 1)}
            />
            {this.filterCountry.isShow ? (
              <DDWrap attr={this.formInputAttr} height={ddWrapHeightCountry}>
                <DDWrapScrolling
                  isScroll={this.filterCountry.isShow ? true : false}
                >
                  <DDWrapContent>
                    {this.filterCountry.countries.map(country => (
                      <DDItem
                        key={`country-${country.code}`}
                        attr={this.formInputAttr}
                        text={country.name || ''}
                        onClick={this.handleFilteredItemClick.bind(
                          this,
                          'country',
                          country
                        )}
                      />
                    ))}
                  </DDWrapContent>
                </DDWrapScrolling>
              </DDWrap>
            ) : null}
          </InputFilterWrap>

          <InputFilterWrap
            attr={this.formInputAttr}
            showFilter={this.filterZone.isShow}
            zIndex={99}
          >
            <FormInput
              id="state"
              name="state"
              innerRef={ref => (this.refState = ref)}
              attr={this.formInputAttr}
              widthInPct={'100'}
              value={this.filterZone.zoneName}
              noMarginBottom={this.filterZone.isShow ? true : false}
              onKeyUp={
                this.props.ProfileStore.billingAddress &&
                this.props.ProfileStore.billingAddress.country
                  ? this.handleFilterKeyUp.bind(this)
                  : null
              }
              onChange={
                this.props.ProfileStore.billingAddress &&
                this.props.ProfileStore.billingAddress.country
                  ? this.handleInputChange.bind(this)
                  : null
              }
              onBlur={this.handleInputBlur.bind(this, true)}
              onFocus={this.initOptionEventListener.bind(this, 'state', 1)}
            />
            {this.filterZone.isShow ? (
              <DDWrap attr={this.formInputAttr} height={ddWrapHeightState}>
                <DDWrapScrolling
                  isScroll={this.filterZone.isShow ? true : false}
                >
                  <DDWrapContent>
                    {this.filterZone.zones.map(state => (
                      <DDItem
                        key={`state-${state.zoneId}`}
                        attr={this.formInputAttr}
                        text={state.name || ''}
                        onClick={this.handleFilteredItemClick.bind(
                          this,
                          'state',
                          state
                        )}
                      />
                    ))}
                  </DDWrapContent>
                </DDWrapScrolling>
              </DDWrap>
            ) : null}
          </InputFilterWrap>

          <InputFilterWrap
            attr={this.formInputAttr}
            showFilter={this.filterCity.isShow}
            zIndex={98}
          >
            <FormInput
              id="city"
              name="city"
              innerRef={ref => (this.refCity = ref)}
              attr={this.formInputAttr}
              widthInPct={'100'}
              value={this.filterCity.cityName}
              noMarginBottom={this.filterCity.isShow ? true : false}
              onKeyUp={
                this.props.ProfileStore.billingAddress &&
                this.props.ProfileStore.billingAddress.state
                  ? this.handleFilterKeyUp.bind(this)
                  : null
              }
              onChange={
                this.props.ProfileStore.billingAddress &&
                this.props.ProfileStore.billingAddress.state
                  ? this.handleInputChange.bind(this)
                  : null
              }
              onBlur={this.handleInputBlur.bind(this, true)}
              onFocus={this.initOptionEventListener.bind(this, 'city', 1)}
            />
            {this.filterCity.isShow ? (
              <DDWrap attr={this.formInputAttr} height={ddWrapHeightCity}>
                <DDWrapScrolling
                  isScroll={this.filterCity.isShow ? true : false}
                >
                  <DDWrapContent>
                    {this.filterCity.cities.map(city => (
                      <DDItem
                        key={`city-${city.cityId}`}
                        attr={this.formInputAttr}
                        text={city.name || ''}
                        onClick={this.handleFilteredItemClick.bind(
                          this,
                          'city',
                          city
                        )}
                      />
                    ))}
                  </DDWrapContent>
                </DDWrapScrolling>
              </DDWrap>
            ) : null}
          </InputFilterWrap>

          {/*
          {CommonStore.cities && CommonStore.cities.length > 0 ? (
            <DropDown
              id="city"
              name="city"
              attr={this.formInputAttr}
              value={ProfileStore.billingAddress.city}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputBlur.bind(this, true)}
            >
              <option value="" disabled defaultValue>
                CITY*
              </option>
              {CommonStore.cities.map(city => {
                return (
                  <option key={city.cityId} value={city.name}>
                    {(city.name || '').toUpperCase()}
                  </option>
                )
              })}
            </DropDown>
          ) : (
            <FormInput
              id="city"
              name="city"
              type="text"
              placeholder="CITY*"
              attr={this.formInputAttr}
              value={ProfileStore.billingAddress.city}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputBlur.bind(this, true)}
            />
          )}
*/}
          <FormInput
            id="zip"
            name="zip"
            type="text"
            placeholder="ZIP*"
            attr={this.formInputAttr}
            value={ProfileStore.billingAddress.zip}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputBlur.bind(this, true)}
            noMarginBottom
          />
          <EmailSection attr={this.formInputAttr}>
            <FormInput
              id="email"
              name="email"
              type="text"
              placeholder="EMAIL*"
              attr={this.formInputAttr}
              value={ProfileStore.billingAddress.email}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputBlur.bind(this, true)}
              isEmail
            />
            <FormInput
              id="confirmEmail"
              name="confirmEmail"
              type="text"
              placeholder="CONFIRM-EMAIL*"
              attr={this.formInputAttr}
              value={ProfileStore.billingAddress.confirmEmail}
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleInputBlur.bind(this, true)}
              isEmail
              noMarginBottom
            />
          </EmailSection>
          <Section>
            <UseShippingAddress attr={this.attr.useShippingAddress}>
              {ProfileStore.billingAddress.useAsShippingAddress ? (
                <CheckYes
                  id={`payment-button-billingdetails-use-shippingaddress`}
                  src={evalImage(`input_feld-verified-profile.svg`)}
                  onClick={this.handleUseAsShipAddr.bind(this, false)}
                  attr={this.attr.check}
                />
              ) : (
                <CheckNo
                  id={`payment-button-billingdetails-use-shippingaddress`}
                  onClick={this.handleUseAsShipAddr.bind(this, true)}
                  attr={this.attr.check}
                />
              )}
            </UseShippingAddress>
          </Section>
          <Section justifyContent="center" marginBottomInPct="7">
            <Button
              id={`payment-button-paymentdetails`}
              text="payment"
              color={'#ffffff'}
              borderColor="#ffffff"
              onClick={this.handlePaymentDetailsClick.bind(this)}
              attr={this.attr.paymentButton}
            >
              <ButtonArrow src={evalImage(`icon-arrow.svg`)} />
            </Button>
          </Section>
        </Form>
      </Scrolling>
    )
  }
}

const HeaderLabel = styled.div`
  width: 100%;
  height: ${props => props.attr.height};
  font-family: pamainlight;
  font-size: ${props => props.attr.fontSize};
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
  width: 100%;
  ${props => (props.heightInPct ? `height:${props.heightInPct}%` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props =>
    props.marginTopInPct ? `margin-top:${props.marginTopInPct}%` : ``};
  ${props =>
    props.marginBottomInPct ? `margin-bottom:${props.marginBottomInPct}%` : ``};
`

const Form = styled.form`
  position: relative;
  width: inherit;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const FormFieldSet = styled.fieldset`
  width: 70%;
  border-radius: ${props => props.attr.borderRadius};
  border: none;
  height: ${props => props.attr.height};
  position: relative;
`

const FormInput = styled.input`
  ${props =>
    props.valid === undefined
      ? 'color: black'
      : `color: ${props.valid ? '#2fc12f' : '#ed1c24'}`};
  font-family: pamainregular;
  width: ${props =>
    props.widthInPct ? props.widthInPct : props.isEmail ? 78 : 70}%;
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

const DropDown = styled.select`
  width: 70%;
  height: ${props => props.attr.height};
  border-radius: ${props => props.attr.borderRadius};
  outline: none;
  border: none;
  -webkit-appearance: none;
  margin-bottom: ${props => props.attr.marginBottom};
  background-color: #ffffff;
  font-family: pamainregular;
  font-size: ${props => props.attr.fontSize};
  color: #000000;
  padding-left: 5%;
  background-image: url(${evalImage(`icon-arrow-down-black.svg`)});
  background-repeat: no-repeat;
  background-position: 95%;
  background-size: 10%;
`

const EmailSection = styled.div`
  width: 90%
  background-color: #19c5ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.attr.emailSectionMarginTop};
  padding: ${props => props.attr.emailSectionPaddingTop} 0 ${props =>
  props.attr.emailSectionPaddingBottom} 0;
`

const UseShippingAddress = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    content: 'also use as a shipping address';
    font-family: pamainregular;
    font-size: ${props => props.attr.fontSize};
    color: #ffffff;
    text-transform: uppercase;
    padding-right: ${props => props.attr.paddingRight};
  }
  margin-top: ${props => props.attr.marginTop};
  margin-bottom: ${props => props.attr.marginBottom};
`

const CheckYes = styled.img`
  height: ${props => props.attr.height};
  &:hover {
    cursor: pointer;
  }
`

const CheckNo = styled.div`
  width: ${props => props.attr.width};
  height: ${props => props.attr.height};
  border-radius: 50%;
  background-color: #ffffff;
  &:hover {
    cursor: pointer;
  }
  position: relative;
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

const InputFilterWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${props => (props.isEmail ? 78 : 70)}%;
  background-color: ${props => (props.showFilter ? '#ffffff' : 'transparent')};
  z-index: ${props => props.zIndex};
`

const DDWrap = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => responsiveDimension(props.height)};
  background-color: #ffffff;
  margin-top: ${props => props.attr.height};
  box-shadow: 0px 20px 25px -6px rgba(0, 0, 0, 1);
`

const DDWrapScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  ${props => (props.isScroll ? `overflow-y: scroll;` : ``)};
  overflow-x: hidden;
`

const DDWrapContent = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const DDItem = styled.div`
  width: 100%;
  height: ${props => props.attr.height};
  display: flex;
  align-items: center;
  &:hover {
    background-color: #d3d3d3;
  }
  &:after {
    content: '${props => props.text}';
    color: #000000;
    font-family: pamainregular;
    font-size: ${props => props.attr.fontSize};
    text-transform: uppercase;
    padding-left: 5%;
    white-space: nowrap
  }
`

const PhoneWrap = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: ${props =>
    props.noMarginBottom ? 0 : props.attr.marginBottom};
`
