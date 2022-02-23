import React, { Component } from 'react'
import { observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import { vhToPx, responsiveDimension } from '@/utils'
import { TweenMax } from 'gsap'

@observer
export default class Lockout extends Component {
  render() {
    return (
      <Container innerRef={this.props.reference}>
        <FadeIn>
          <Content innerRef={c => (this.refContent = c)}>
            <ContentTop>{this.props.header}</ContentTop>
            <ContentBottom>{this.props.detail}</ContentBottom>
          </Content>
        </FadeIn>
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(#000000 55%, rgba(135, 25, 10, 0));
  //background: linear-gradient(rgba(0, 0, 0, 1) 55%, rgba(0, 0, 0, 0.9));
  z-index: 98;
`
const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ContentTop = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(15.5)};
  color: #ffffff;
  line-height: ${props => responsiveDimension(13)};
  text-transform: uppercase;
`
const ContentBottom = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(5.7)};
  color: #ffffff;
  text-transform: uppercase;
`
const ContentPA = styled.div`
  margin-top: ${props => vhToPx(2.7)};
  margin-bottom: ${props => vhToPx(2.7)};
`
const FadeIn = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.4s ${fadeOutBottom} forwards;`
      : `animation: 0.4s ${fadeInTop} forwards;
      animation-delay: ${props.delay ? 0.4 : 0}s;
      `} padding: 5% 4.5% 5% 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
`

const fadeInTop = keyframes`
  0% {opacity:0;position: relative; top: ${vhToPx(-45)};}
  100% {opacity:1;position: relative; top: 0; height:inherit;}
`

const fadeOutBottom = keyframes`
  0% {opacity:1; }
  99% {opacity: 0; height: inherit;}
  100% {opacity:0;height: 0px;}
`

Lockout.propTypes = {
  header: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
}
