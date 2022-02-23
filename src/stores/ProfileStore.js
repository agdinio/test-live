import { observable, action } from 'mobx'
import { PlayFab } from '@/Agent'
import agent from '@/Agent'
import PrePickStore from '@/stores/PrePickStore'

import CommandHostStore from '@/stores/CommandHostStore'
import { updateUserDetails } from '../Components/Auth/GoogleAnalytics'
class ProfileStore {
  @observable
  isLoading = false
  @observable
  isUpdating = false
  @observable
  profile = {
    anonymousUserId: '',
    currencies: { points: 0, tokens: 0, stars: 0 },
  }
  @observable
  inviteesLength = 0
  @observable
  isLoadingProfile = false
  @observable
  err = undefined

  @action
  setProfile(profile) {
    this.profile = profile
  }

  @action
  resetProfile() {
    this.profile = {
      anonymousUserId: '',
      currencies: { points: 0, tokens: 0, stars: 0 },
    }
  }

  @observable
  resolvePoints = 0
  @action
  setResolvePoints(val) {
    this.resolvePoints = val
  }

  @observable
  resolveWinStreak = []
  @action
  setResolveWinStreak(val) {
    this.resolveWinStreak = val
  }

  @observable
  invitationKey = ''
  @action
  setInvitationKey(val) {
    this.invitationKey = val
  }

  shareKey = 'AMB000X2'

  @action
  getProfile__() {
    if (this.profile.username) {
      return
    }

    this.isLoading = true
    return new Promise((resolve, reject) => {
      resolve({
        channels: [],
        username: 'ambassador1@sharklasers.com',
        displayName: 'ambassador1',
        key: 'PSO017',
        password: 'AmbassadorPass.v1',
        userName: 'ambassador1@sharklasers.com',
        currencies: { tokens: 500, stars: 0, points: 0 },
        externalIds: {},
        location: {
          country: 'US',
          latitide: 33.82049560546875,
          city: 'Cathedral City',
          longditute: -116.45860290527344,
        },
        requestId: '1543983812546_2240',
        reservedCurrencies: { points: {}, stars: {}, tokens: {} },
        userId: '5c0178adc2614c05265db7df',
        virtualGoods: {},
        label: 'Ambassador',
        flags: { 'ambassador-playthrough': 1 },
        notifications: { email: false, phone: false },
        starCategory: null,
      })
    })
      .then(data => {
        debugger
        this.err = null
        this.profile = data
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @action
  getProfile() {
    this.isLoading = true
    return agent.GameServer.getProfile()
      .then(
        action(data => {
          this.err = null
          this.profile = data
        })
      )
      .catch(err => {
        this.err = err
        console.log('PLAYALONG ERROR getProfile() =>', err)
      })
      .finally(
        action(() => {
          this.isLoading = false
        })
      )
  }

  @action
  getsignout() {
    localStorage.clear()
    return agent.GameServer.signout()
  }

  @action
  getInviteesLength() {
    this.isLoading = true
    agent.Server.getInvitees()
      .then(
        action(data => {
          this.inviteesLength = data.length
        })
      )
      .catch(err => {
        console.log('PLAYALONG ERROR getInviteesLength() =>', err)
      })
      .finally(
        action(() => {
          this.isLoading = false
        })
      )
  }

  @action
  updateProfile(params) {
    this.isUpdating = true
    return agent.GameServer.updateProfile(params)
      .then(response => {
        if (response.affectedRows === 1) {
          //updateUserDetails(response) // update UserDetails
          this.profile.userName = params.userName
          this.profile.firstName = params.firstName
          this.profile.lastName = params.lastName
          this.profile.countryCode = params.countryCode
          this.profile.mobile = params.mobile
          this.profile.notifyEmail = params.notifyEmail
          this.profile.notifyMobile = params.notifyMobile
          return true
        }
        return false
      })
      .finally(_ => {
        this.isUpdating = false
      })
  }

  @action
  updateDisplayName(name) {
    this.isUpdating = true
    return agent.Server.updateDisplayName(name)
      .then(
        action(response => {
          console.log(response)
        })
      )
      .finally(
        action(() => {
          this.isUpdating = false
        })
      )
  }

  @action
  updatePhone(phone) {
    this.isUpdating = true
    return agent.Server.updatePhone(phone)
      .then(
        action(response => {
          console.log(response)
        })
      )
      .finally(
        action(() => {
          this.isUpdating = false
        })
      )
  }

  @action
  updateNotifications(notifications) {
    this.isUpdating = true
    return agent.Server.updateNotifications(notifications)
      .then(
        action(response => {
          console.log(response)
        })
      )
      .finally(
        action(() => {
          this.isUpdating = false
        })
      )
  }

  @action
  creditCurrencies(creditInfo, updateTo = '') {
    if (PrePickStore.prePickMode) {
      return
    }

    if (updateTo === 'UPDATE_INTERNAL') {
      this.profile.currencies[creditInfo.currency] += creditInfo.amount
    } else {
      this.isUpdating = true
      return agent.GameServer.creditCurrencies(creditInfo)
        .then(updatedCurrency => {
          this.profile.currencies[creditInfo.currency] = updatedCurrency
        })
        .catch(err => {
          console.log('ERROR FETCHING PROFILE CURRENCY. RELOADING...')
          //document.location.reload(true)
          //this.creditCurrencies(creditInfo)
        })
        .finally(
          action(() => {
            this.isUpdating = false
          })
        )
    }
  }

  @action
  debitCurrenciesAtLaunch(debitInfo) {
    if (
      this.profile &&
      this.profile.currencies &&
      debitInfo &&
      debitInfo.currency
    ) {
      this.isUpdating = true
      return agent.GameServer.debitCurrencies(debitInfo)
        .then(updatedCurrency => {
          this.profile.currencies[debitInfo.currency] = updatedCurrency
        })
        .catch(err => {
          console.log('ERROR FETCHING PROFILE CURRENCY. RELOADING...')
          //document.location.reload(true)
          //this.debitCurrenciesAtLaunch(debitInfo)
        })
        .finally(() => {
          this.isUpdating = false
        })
    }
  }

  @action
  debitCurrencies(debitInfo, isLocal) {
    if (isLocal) {
      this.profile.currencies[debitInfo.currency] -= debitInfo.amount
    } else {
      this.isUpdating = true
      return agent.GameServer.debitCurrencies(debitInfo)
        .then(updatedCurrency => {
          // let check = setInterval(() => {
          //   this.profile.currencies[debitInfo.currency]--
          //   if (
          //     parseInt(this.profile.currencies[debitInfo.currency]) <=
          //     parseInt(updatedCurrency)
          //   ) {
          //     clearInterval(check)
          //   }
          // }, 0)
          this.profile.currencies[debitInfo.currency] = updatedCurrency
        })
        .catch(err => {
          console.log('ERROR FETCHING PROFILE CURRENCY. RELOADING...')
          //this.debitCurrencies(debitInfo)
        })
        .finally(() => {
          this.isUpdating = false
        })
    }
  }

  @action
  claimPrize(prize) {
    prize.agreed = false
    prize.claimed = false
    if (this.profile.prizesClaimed) {
      this.profile.prizesClaimed.push(prize)
    } else {
      this.profile.prizesClaimed = []
      this.profile.prizesClaimed.push(prize)
    }
  }

  @action
  resetCurrencies() {
    let points = this.profile.currencies['points']
    let tokens = this.profile.currencies['tokens']
    let stars = this.profile.currencies['stars']

    this.debitCurrenciesAtLaunch({
      currency: 'points',
      amount: points,
    })
    this.debitCurrenciesAtLaunch({
      currency: 'tokens',
      amount: tokens,
    })
    this.debitCurrenciesAtLaunch({
      currency: 'stars',
      amount: stars,
    })
  }

  @action
  login(email, password) {
    return PlayFab.login(email, password)
      .then(
        action(profile => {
          this.profile = profile
        })
      )
      .finally(
        action(() => {
          this.isLoadingProfile = false
        })
      )
  }

  @action
  loadProfile(username) {
    this.isLoadingProfile = true
    //return agent.Profile.get(username)
    return Promise.resolve({ profile: '1234567' })
      .then(
        action(({ profile }) => {
          this.profile = profile
        })
      )
      .finally(
        action(() => {
          this.isLoadingProfile = false
        })
      )
  }

  //RELLY
  @action
  setSessionCurrencies() {
    debugger
    let points = this.profile.currencies['points']
    let tokens = this.profile.currencies['tokens']
    let stars = this.profile.currencies['stars']
    let obj = { points: points, tokens: tokens, stars: stars }
    try {
      sessionStorage.setItem('CURRENCIES', JSON.stringify(obj))
    } catch (e) {}
  }

  @observable
  tempProfile = {
    userId: 0,
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '',
    mobile: '',
    isUserNameEditing: false,
    isFirstNameEditing: false,
    isLastNameEditing: false,
    isEmailEditing: false,
    isPhoneEditing: false,
    notifyByEmail: true,
    notifyByPhone: false,
  }

  @observable
  billingAddress = {
    firstName: '',
    lastName: '',
    countryCode: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    email: '',
    confirmEmail: '',
    useAsShippingAddress: false,
  }

  @observable
  paymentDetails = {
    cardName: '',
    cardNumber: '',
    expirationDate: '',
    csv: '',
    keepCardDetailsOnFile: true,
  }

  copyProfileToTemp() {
    this.tempProfile.userId = this.profile.userId
    this.tempProfile.userName = this.profile.userName
    this.tempProfile.firstName = this.profile.firstName
    this.tempProfile.lastName = this.profile.lastName
    this.tempProfile.email = this.profile.email
    this.tempProfile.countryCode = this.profile.countryCode
      ? this.profile.countryCode
      : 1
    this.tempProfile.mobile = this.profile.mobile
    this.tempProfile.notifyByPhone = this.profile.notifyMobile
  }

  @action
  paymentToken(args) {
    return agent.GameServer.paymentToken(args)
  }
}

export default new ProfileStore()
