import { observable, action, reaction } from 'mobx'
import agent from '@/Agent'
import ProfileStore from '@/stores/ProfileStore'

class CommonStore {
  @observable
  appName = 'Conduit'
  @observable
  token = window.localStorage.getItem('jwt')
  @observable
  appLoaded = false

  @observable
  tags = []
  @observable
  isLoadingTags = false

  @observable
  location = ''
  @observable
  locationHistory = []
  @observable
  isLoading = false
  @observable
  leaderboard = []
  @observable
  keySharedCredits = {}

  @observable
  replayed = false
  @action
  setReplayed(val) {
    this.replayed = val
  }

  getAppVersion() {
    return 'Ambassador Demo 1.0v'
  }
  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          try {
            window.localStorage.setItem('jwt', token)
          } catch (e) {}
        } else {
          try {
            window.localStorage.removeItem('jwt')
          } catch (e) {}
        }
      }
    )
  }

  @action
  setToken(token) {
    this.token = token
  }

  @action
  clearToken() {
    this.token = undefined
    try {
      window.localStorage.removeItem('jwt')
    } catch (e) {}
  }

  @action
  setAppLoaded() {
    this.appLoaded = true
  }

  @action
  setLocation(location) {
    this.location = location
  }

  topEarners = []

  topCelebEarners = []

  @action
  getTopEarners() {
    return agent.GameServer.getTopEarners()
      .then(data => {
        if (data.topCelebEarners.length < 3) {
          const cnt = 3 - data.topCelebEarners.length
          for (let i = 0; i < cnt; i++) {
            data.topCelebEarners.push({
              userId: 0,
              name: '',
              email: '',
              tokens: 0,
              points: 0,
              stars: 0,
              isCelebrity: false,
            })
          }
        }

        if (data.topEarners.length < 10) {
          const cnt = 10 - data.topEarners.length
          for (let i = 0; i < cnt; i++) {
            data.topEarners.push({
              userId: 0,
              name: '',
              email: '',
              tokens: 0,
              points: 0,
              stars: 0,
              isCelebrity: false,
            })
          }
        }

        this.topCelebEarners = data.topCelebEarners
        this.topEarners = data.topEarners

        return Promise.resolve(true)
      })
      .catch(err => {
        for (let i = 0; i < 3; i++) {
          this.topCelebEarners.push({
            userId: 0,
            name: '',
            email: '',
            tokens: 0,
            points: 0,
            stars: 0,
            isCelebrity: false,
          })
        }
        for (let i = 0; i < 10; i++) {
          this.topEarners.push({
            userId: 0,
            name: '',
            email: '',
            tokens: 0,
            points: 0,
            stars: 0,
            isCelebrity: false,
          })
        }
        return Promise.resolve(true)
      })
  }

  @action
  getLeaderboard() {
    this.isLoading = true
    return agent.Server.getLeaderboard()
      .then(data => {
        this.leaderboard = data
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @action
  getKeySharedCredits() {
    this.isLoading = true
    return agent.Server.getKeySharedCredits()
      .then(data => {
        debugger
        this.keySharedCredits = data
      })
      .catch(err => {
        debugger
        console.log(err.message)
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @action
  getKeySharedCreditsORIG() {
    this.isLoading = true
    return agent.Server.getKeySharedCredits()
      .then(data => {
        debugger
        this.keySharedCredits = data
      })
      .catch(err => {
        debugger
        console.log(err.message)
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @observable
  isServerDisconnected = false
  @action
  setIsServerDisconnected(val) {
    this.isServerDisconnected = val
  }

  countries = []

  @action
  readCountries() {
    this.isLoading = true
    return agent.GameServer.readCountries()
      .then(data => {
        this.countries = data
      })
      .catch(err => {
        console.log(err)
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @action
  readPaymentInfo(args) {
    this.isLoading = true
    return agent.GameServer.readPaymentInfo(args)
      .then(async data => {
        this.countries = data.countries || []

        if (data.cardDetails && Object.keys(data.cardDetails).length > 0) {
          const _country = await data.countries.filter(
            o =>
              o.code.toLowerCase() ===
              (data.cardDetails.country || 'x').toLowerCase()
          )[0]
          ProfileStore.billingAddress.firstName =
            data.cardDetails.first_name || ''
          ProfileStore.billingAddress.lastName =
            data.cardDetails.last_name || ''
          ProfileStore.billingAddress.countryCode =
            data.cardDetails.country_code || '1'
          ProfileStore.billingAddress.phone = data.cardDetails.phone || ''
          ProfileStore.billingAddress.addressLine1 =
            data.cardDetails.address1 || ''
          ProfileStore.billingAddress.addressLine2 =
            data.cardDetails.address2 || ''
          ProfileStore.billingAddress.country = _country
            ? JSON.stringify(_country)
            : ''
          ProfileStore.billingAddress.state = data.cardDetails.state || ''
          ProfileStore.billingAddress.city = data.cardDetails.city || ''
          ProfileStore.billingAddress.zip = data.cardDetails.zip || ''
          ProfileStore.billingAddress.email = data.cardDetails.email || ''
          ProfileStore.billingAddress.confirmEmail =
            data.cardDetails.email || ''
          ProfileStore.billingAddress.useAsShippingAddress = data.cardDetails
            .use_as_shipping_address
            ? true
            : false

          ProfileStore.paymentDetails.cardName = data.cardDetails.cc_name || ''
          ProfileStore.paymentDetails.cardNumber =
            data.cardDetails.cc_number || ''
          ProfileStore.paymentDetails.csv =
            data.cardDetails.cc_security_code || ''
          ProfileStore.paymentDetails.expirationDate =
            data.cardDetails.expire_date
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @observable
  isLoadingZone = false

  zones = []

  @action
  readZonesByCountry(args) {
    this.isLoadingZone = true
    return agent.GameServer.readZonesByCountry(args)
      .then(data => {
        this.zones = data
        return Promise.resolve(true)
      })
      .catch(err => {
        console.log(err)
        return Promise.resolve(false)
      })
      .finally(_ => {
        this.isLoadingZone = false
      })
  }

  cities = []

  @action
  readCitiesByZone(args) {
    this.isLoadingZone = true
    return agent.GameServer.readCitiesByZone(args)
      .then(data => {
        this.cities = data || []
        return Promise.resolve(true)
      })
      .catch(err => {
        console.log(err)
        return Promise.resolve(false)
      })
      .finally(_ => {
        this.isLoadingZone = false
      })
  }
}

export default new CommonStore()
