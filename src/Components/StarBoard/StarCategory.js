import React, { Component } from 'react'
import styled from 'styled-components'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'

export default class StarCategory extends Component {
  render() {
    let {
      item,
      refStarClick,
      borderColor,
      hoverBorderColor,
      size,
      reference,
      refMouseOver,
      refMouseOut,
    } = this.props

    return (
      <Container size={size} index={item.order}>
        <StarCircle
          reference={reference}
          item={item}
          borderColor={borderColor}
          hoverBorderColor={hoverBorderColor}
          onClick={refStarClick}
          size={size}
          fullSized
          onMouseOver={refMouseOver}
          onMouseOut={refMouseOut}
        />
        <StarLabel>{item.text}</StarLabel>
      </Container>
    )
  }
}

const Container = styled.div`
  width: ${props => props.size}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${props => responsiveDimension(props.index > 3 ? 3 : 1)};
  margin-right: ${props => responsiveDimension(props.index > 3 ? 3 : 1)};
  margin-bottom: ${props => responsiveDimension(props.index > 3 ? 0 : 4)};
`

const StarLabel = styled.span`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(6)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: 1;
  margin-top: ${props => responsiveDimension(2)};
`

const StarCircleContainer = styled.div`
  position: relative;
  width: ${props => (props.fullSized ? 100 : props.size)}%;
  min-width: ${props => (props.fullSized ? 100 : props.size)}%;
  height: 0;
  padding-bottom: ${props => (props.fullSized ? 100 : props.size)}%;
  border-radius: 50%;
  background-color: #000000;
`

const StarCircleWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  min-height: 100%;
  height: 100%;
  min-width: 100%;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  cursor: ${props => (props.hoverBorderColor ? 'pointer' : 'default')};
  overflow: hidden;

  &:hover {

      border-width: ${props => responsiveDimension(props.borderWidth || 0.5)};
      border-color: ${props => props.hoverBorderColor};
      border-style: solid;

  }
  &:before {
    position: absolute;
    content: '${props => (props.noText ? `` : props.boardName)}';
    width: 100%;
    background-color: ${props =>
      props.noText ? 'transparent' : 'rgba(0,0,0, 0.6);'};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(2.8)};
    color: #ffffff;
    text-transform: uppercase;
    line-height: 1;
    display: flex;
    justify-content: center;
    padding: 1% 0 1% 0;
    margin-top: 1%;
    text-align: center;
  }
  &:after {
    position: absolute;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    border-radius: 50%;
    content: '';
    ${props =>
      props.srcAlpha ? `background: rgba(0,0,0, ${props.srcAlpha})` : ''};
    border-width: ${props => responsiveDimension(props.borderWidth || 0.5)};
    border-color: ${props => props.borderColor};
    border-style: solid;
 }
 &:hover:after {
    border-width: 0;
    border-color: transparent;
    border-style: solid;
 }
`

export const StarCircle = props => {
  return (
    <StarCircleContainer
      fullSized={props.fullSized}
      size={props.size}
      innerRef={props.refContainer}
    >
      <StarCircleWrapper
        noText={props.noText}
        innerRef={props.reference}
        src={props.image}
        srcAlpha={props.imageAlpha}
        borderColor={props.borderColor}
        borderWidth={props.borderWidth}
        hoverBorderColor={props.hoverBorderColor}
        onClick={props.refClick}
        onMouseOver={props.refMouseOver}
        onMouseOut={props.refMouseOut}
        boardName={props.item.boardName}
      />
    </StarCircleContainer>
  )
}
