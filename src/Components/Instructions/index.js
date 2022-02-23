import React, { Component } from 'react'
import styled from 'styled-components'
import Background from '@/assets/images/playalong-default.jpg'

export default class Instructions extends Component {
  render() {
    return <Container></Container>
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
`
