import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { extendObservable } from 'mobx'
import { TweenMax } from 'gsap'
import Key from '@/Components/Signup/KeyCode/Key'
import Email from '@/Components/Signup/KeyCode/Email'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import { vhToPx, maxHeight } from '@/utils'

@inject('NavigationStore', 'AuthStore')
@withRouter
@observer
class KeyCode extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      valid: undefined,
    })
  }

  handleValidKey(valid) {
    if (valid) {
      setTimeout(() => {
        TweenMax.to(this.refKey, 0.5, { x: -this.refContainer.offsetWidth })
        TweenMax.to(this.refEmail, 0.5, { x: 0 })
      }, 1000)
    }
  }

  handleValidEmail(valid) {
    if (valid) {
      setTimeout(() => {
        this.props.NavigationStore.setCurrentView('/prebegin')
      }, 1000)
    }
  }

  componentDidMount() {
    TweenMax.set(this.refEmail, { x: this.refContainer.offsetWidth })
  }

  render() {
    return (
      <Container innerRef={ref => (this.refContainer = ref)}>
        <LogoWrapper top={7}>
          <LogoImg src={sportocoLogo} width={25} alt="sportoco logo" top={7} />
          <LogoImg
            src={playalongLogo}
            width={45}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>

        <Key
          reference={ref => (this.refKey = ref)}
          isValid={this.handleValidKey.bind(this)}
        />
        <Email
          reference={ref => (this.refEmail = ref)}
          isValid={this.handleValidEmail.bind(this)}
        />

        <Footer>Ambassador Demo 1.0v</Footer>
      </Container>
    )
  }
}
export default withRouter(KeyCode)

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10;
  position: relative;
`

const LogoWrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => props.top}%;
`

const LogoImg = styled.img`
  width: ${props => props.width}%;
  margin-bottom: 2vh;
  max-width: ${props => props.width / 0.2}px;
`

const Footer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  position: absolute;
  bottom: 5%;
  font-size: ${props => vhToPx(1.5)};
  color: white;
  font-family: pamainregular;
`
