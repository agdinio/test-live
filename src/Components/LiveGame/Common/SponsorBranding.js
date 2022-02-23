import React, { Component } from 'react'
import styled from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'

export default class SponsorBranding extends Component {
  render() {
    let { item } = this.props

    return (
      <Container backgroundColor={item.backgroundColor}>
        <SponsorName height={6} color={item.initialColor}>
          {item.name}
        </SponsorName>
        <CircleSponsorLetter
          borderColor={item.circleBorderColor}
          circleFill={item.circleFill}
          color={item.initialColor}
          text={item.initial}
          height={7}
        >
          <CircleSponsorLetterInner
            borderColor={item.circleBorderColor}
            circleFill={item.circleFill}
          >
            <SponsorLetter
              color={item.initialColor}
              text={item.initial}
              height={7}
            >
              {item.initial}
            </SponsorLetter>
          </CircleSponsorLetterInner>
        </CircleSponsorLetter>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.backgroundColor};
  border-radius: ${props => responsiveDimension(0.5)};
  padding: ${props => responsiveDimension(1)};
`

const SponsorName = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(0.6 * props.height)};
  color: ${props => props.color};
  text-transform: uppercase;
  margin-right: ${props => responsiveDimension(1)};
`

const CircleSponsorLetter = styled.div`
  width: ${props => responsiveDimension(props.height)};
  height: ${props => responsiveDimension(props.height)};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: ${props => responsiveDimension(0.5)};
`

const CircleSponsorLetterInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: ${props => responsiveDimension(0.5)} solid
    ${props => props.borderColor};
  background-color: ${props => props.circleFill};
  display: flex;
  justify-content: center;
  align-items: center;
`

const SponsorLetter = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(0.8 * props.height)};
  text-transform: uppercase;
  color: ${props => props.color};
  padding-top: ${props => vhToPx(0.6)};
`
