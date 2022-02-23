import React, { Component } from 'react'
import axios from 'axios'
import config from '@/Agent/config'
export default class DeletePrize extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmed: false,
    }
  }
  componentDidMount() {
    this.reload()
  }

  async reload() {
    const API_URL = `${config.PROTOCOL}://${config.URL}:${config.PORT}`
    console.log('this.state', API_URL)
    var email = prompt('Enter your email : ', '')
    if (email) {
      var password = prompt('Enter your password [ ' + email + '] : ', '')
      var confirmation = window.confirm(
        'Are you sure , you want to reset the details ?'
      )
      if (confirmation) {
        await this.setState({
          email: email,
          password: password,
          confirmed: false,
        })
        let endPoint = API_URL + '/user/9a220f323e5ab77be9d925754a714c8a'
        let params = {
          email: this.state.email,
          password: this.state.password,
        }
        await axios
          .post(endPoint, params)
          .then(response => {
            alert(response.data.message)
            alert(
              'Please verify the details in your corresponding account . Thanks'
            )
          })
          .catch(err => {
            alert('Invalid username or password')
            this.reload()
          })
      } else {
      }
    } else {
    }
  }

  render() {
    return <div></div>
  }
}
