import React, { Component } from 'react'
import styled from 'styled-components'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import { Textfit } from 'react-textfit'
import ReactFitText from 'react-fittext'

export default class Circle extends Component {
  render() {
    let { src } = this.props

    return (
      <Container fullSized={this.props.fullSized} size={this.props.size}>
        <Content
          innerRef={this.props.reference}
          backgroundColor={this.props.backgroundColor}
          borderColor={this.props.borderColor}
          borderWidth={this.props.borderWidth}
          onClick={this.props.onClick}
        >
          {src.image ? (
            <SourceImage
              src={src.image}
              size={src.size}
              marginBottom={src.marginBottom}
              marginLeft={src.marginLeft}
            />
          ) : src.text ? (
            <Textfit mode="multi" style={this.styleTextfit(src)}>
              {src.text}
            </Textfit>
          ) : null}
        </Content>
      </Container>
    )
  }

  styleTextfit(src) {
    return {
      width: '100%',
      height: '100%',
      fontFamily: src.font,
      color: src.color,
      padding: '15%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    }
  }
}

const Container = styled.div`
  position: relative;
  width: ${props => (props.fullSized ? 100 : props.size)}%;
  min-width: ${props => (props.fullSized ? 100 : props.size)}%;
  height: 0;
  padding-bottom: ${props => (props.fullSized ? 100 : props.size)}%;
`

const Content = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  min-width: 100%;
  height: 100%;
  min-height: 100%;
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  ${props =>
    props.borderColor
      ? `border-width: ${responsiveDimension(
          props.borderWidth
        )}; border-color: ${props.borderColor}; border-style: solid;`
      : ''};
`

const SourceImage = styled.img`
  height: ${props => props.size};
  margin-bottom: ${props => props.marginBottom || 0};
  margin-left: ${props => props.marginLeft || 0};
`

const SourceText = styled.div`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size || 3.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  line-height: 1;
`
