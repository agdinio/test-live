import React, { Component } from 'react'
import styled from 'styled-components'
import { vhToPx } from '@/utils'
import { PACircle } from '@/Components/PACircle'
import ActivityIndicator from '@/Components/Common/ActivityIndicator'

export default class ActivityComponent extends Component {
  render() {
    return (
      <Container backgroundColor={this.props.backgroundColor}>
        {/*<PACircle size={5}/>*/}
        <ActivityIndicator height={7} color={'#ffffff'} />
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.backgroundColor || 'rgba(0,0,0, 0.9)'};
  z-index: 100;
`
