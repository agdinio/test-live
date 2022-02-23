import { observable, action } from 'mobx'
import CryptoJS from 'crypto-js'
import agent from '@/Agent'
import CommonStore from './CommonStore'
import UserStore from './UserStore'
import ProfileStore from './ProfileStore'
import CommandHostStore from '@/stores/CommandHostStore'
import GameStore from '@/stores/GameStore'
import { StoreJWTToken } from '@/utils'
import { login, signup } from '../Components/Auth/GoogleAnalytics'
class AuthStore {
  @observable
  inProgress = false
  @observable
  errors = undefined
  @observable
  validKey = false
  @observable
  userDisplayName = undefined
  @observable
  userId = localStorage.getItem('userID')
    ? CryptoJS.AES.decrypt(
        localStorage.getItem('userID').toString(),
        'userID'
      ).toString(CryptoJS.enc.Utf8)
    : undefined

  @observable
  values = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    token: '',
  }
  @observable
  forgotdetails = {
    forgotemail: '',
    forgotphone: '',
    verificationCode: '',
    verificationEmail: '',
    verificationPassword: '',
    serviceSid: '',
    countryCode: '',
    mobile: '',
  }

  @observable
  resetpassword = {
    email: '',
    password: '',
  }

  @action
  resetValues() {
    this.values = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      token: '',
    }
  }

  @action
  setFirstName(firstName) {
    this.values.firstName = firstName
  }
  @action
  setLastName(lastName) {
    this.values.lastName = lastName
  }
  @action
  setName(name) {
    this.values.name = name
  }

  @action
  setEmail(email) {
    this.values.email = email
  }

  @action
  setForgotPasswordEmail(email) {
    this.forgotdetails.forgotemail = email
  }
  setForgotPasswordphoneverification(code) {
    this.forgotdetails.verificationCode = code
  }

  setForgotverificationpassword(password) {
    this.forgotdetails.verificationPassword = password
  }

  @action
  setForgotPasswordphone(phone) {
    this.forgotdetails.forgotphone = phone
  }
  @action
  setPassword(password) {
    this.values.password = password
  }
  @action
  setResetPassword(password) {
    this.resetpassword.password = password
  }
  @action
  setResetEmail(email) {
    this.resetpassword.email = email
  }

  @action
  setPhone(phone) {
    this.values.phone = phone
  }

  @action
  setToken(token) {
    this.values.token = token
  }

  @action
  validateKey__(key) {
    this.inProgress = true
    return agent.Server.validateKey(key)
      .then(
        action(response => {
          debugger
          return response === 'valid' ? true : false
        })
      )
      .catch(err => {
        return false
      })
      .finally(_ => {
        this.inProgress = false
      })
  }

  @action
  validateKey_(key) {
    this.inProgress = true
    return agent.Server.validateKey(key)
      .then(response => {
        this.validKey = response === 'valid' ? true : false
      })
      .catch(err => {
        this.validKey = false
      })
      .finally(_ => {
        this.inProgress = false
      })
  }

  @action
  validateKey(key) {
    this.inProgress = true
    return new Promise((resolve, reject) => {
      return agent.Server.validateKey(key)
        .then(response => {
          debugger
          this.validKey = response === 'valid' ? true : false
          return agent.Server.getUserDisplayNameByKey(key)
        })
        .then(profile => {
          debugger
          this.userDisplayName = profile.displayName
        })
        .catch(err => {
          this.validKey = false
          reject(this.validKey)
        })
        .finally(_ => {
          resolve({
            valid: this.validKey,
            userDisplayName: this.userDisplayName,
          })
          this.inProgress = false
        })
    })
  }

  @action
  reset() {
    this.values.email = ''
    this.values.password = ''
    this.values.phone = ''
    this.values.name = ''
    this.values.token = ''
    this.errors = undefined
  }

  @action
  login(args) {
    return agent.GameServer.login(args).then(data => {
      console.log('login data', data)
      login(data) // pass to the analystics and get the user details
      this.extractData(data)
      return Promise.resolve(true)
    })
  }

  forgotPassword(args) {
    return agent.GameServer.forgotPassword(args).then(data => {
      if (data.profile.verification) {
        this.forgotdetails.serviceSid = data.profile.verification.serviceSid
      }
      return Promise.resolve(true)
    })
  }

  codeVerification(args) {
    return agent.GameServer.codeVerification(args).then(data => {
      return Promise.resolve(true)
    })
  }

  @action
  resetPassword(args) {
    return agent.GameServer.resetPassword(args).then(data => {
      if (args.phone) {
        console.log('args.phone', data)
        this.extractData(data)
      }
      return Promise.resolve(true)
    })
  }
  @action
  signup() {
    this.values.anonymousUserId = ProfileStore.profile.anonymousUserId
    this.values.email = (this.values.email || '').toLowerCase()
    delete this.values.confirmPassword
    delete this.values.token
    return agent.GameServer.signup(this.values).then(data => {
      signup(data) // signup details
      this.extractData(data)
      return Promise.resolve(true)
    })
  }

  extractData(data) {
    GameStore.setUserProfile(data.profile)
    CommandHostStore.setAuthenticated(true)
    if (data.token) {
      StoreJWTToken(data.token)
    }
  }

  @action
  loginGameSparks() {
    if (this.inProgress) {
      return Promise.resolve()
    }

    this.inProgress = true

    return agent.Server.login(this.values.email)
      .then(profile => {
        // TODO: Store local credentials in localstorage
        return Promise.resolve(profile)
      })
      .catch(err => {
        return Promise.reject(err)
      })
      .finally(action(_ => (this.inProgress = false)))

    // return new Promise((resolve, reject) => {
    //   login(this.values.email)
    //     .then(res => {
    //       this.userId = res.playfabId
    //       localStorage.setItem(
    //         'userID',
    //         CryptoJS.AES.encrypt(res.playfabId, 'userID')
    //       )
    //       resolve(this.userId)
    //     })
    //     .catch(e => {
    //       reject(e.errorMessage)
    //     })
    //     .finally(action(_ => (this.inProgress = false)))
    // })
  }

  @action
  register() {
    this.inProgress = true
    this.errors = undefined

    let values = this.values
    values.phone.replace(/-/g, '')
    values.password = 'AmbassadorPass.v1'

    return agent.Server.registerUser(this.values)
      .then(profile => {
        // TODO: Store the user ID in local storage for auto login?
        return Promise.resolve(profile)
      })
      .catch(err => {
        return Promise.reject(err)
      })
      .finally(action(_ => (this.inProgress = false)))

    // return new Promise((resolve, reject) => {
    //   const values = this.values
    //   values.phone.replace(/-/g, '')

    //   registerUser(values)
    //     .then(res => {
    //       this.userId = res.playfabId
    //       localStorage.setItem(
    //         'userID',
    //         CryptoJS.AES.encrypt(res.playfabId, 'userID')
    //       )
    //       resolve(this.userId)
    //     })
    //     .catch(e => {
    //       reject(
    //         e.errorMessage
    //           ? {
    //               Name: [
    //                 e.errorMessage
    //                   .replace('The display name', 'Name')
    //                   .replace('identifier', 'phone number'),
    //               ],
    //             }
    //           : e.errorDetails
    //       )
    //     })
    //     .finally(action(_ => (this.inProgress = false)))
    // })
  }

  @action
  logout() {
    CommonStore.clearToken()
    UserStore.forgetUser()
  }
}

export default new AuthStore()
