import React, { Component } from 'react'
import styled from 'styled-components'
import { responsiveDimension } from '@/utils'
import { PACircle } from '@/Components/PACircle'
import ActivityIndicator from '@/Components/Common/ActivityIndicator'

export default class PaActivityComponent extends Component {
  render() {
    return (
      <Container backgroundColor={this.props.backgroundColor}>
        <PACircle size={this.props.size} />
        {/*<ActivityIndicator height={this.props.size} color={this.props.color} />*/}
        {this.props.withText ? (
          <WithTextWrapper>
            <TextWrapper marginTop={2}>
              <Text font={'pamainbold'} size={2.5} color={'#ffffff'} uppercase>
                loading...
              </Text>
            </TextWrapper>
            <TextWrapper marginTop={1}>
              <Text font={'pamainbold'} size={2.5} color={'#ffffff'} uppercase>
                please wait
              </Text>
            </TextWrapper>
          </WithTextWrapper>
        ) : null}
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

const WithTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TextWrapper = styled.div`
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const Text = styled.div`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 0.9};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
  height: ${props => responsiveDimension(props.size * 0.8)};
`
