import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { PACircle } from '@/Components/PACircle'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'

export default class Waiting extends Component {
  render() {
    return (
      <Container>
        <ResultContainer>
          <FadeIn>
            <Section>
              <CircleWrapper>
                <PACircle />
              </CircleWrapper>
            </Section>
            <Section>
              <TextWrapper>
                <Text font={'pamainregular'} size={5} spacing={0.1} uppercase>
                  waiting for results
                </Text>
              </TextWrapper>
            </Section>
            <Section>
              <TextWrapper>
                <Text font={'pamainlight'} size={5.5} uppercase>
                  play has ended
                </Text>
              </TextWrapper>
            </Section>
          </FadeIn>
        </ResultContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  width: inherit;
  height: inherit;
`

const ResultContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  background-color: ${props => props.color || hex2rgb('#19a3d2', 0.8)};
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);

  opacity: 1;
  position: absolute;
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
  justify-content: center;
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

const Section = styled.div`
  display: flex;
  margin-top: ${props => vhToPx(0.5)};
  margin-bottom: ${props => vhToPx(0.5)};
`

const TextWrapper = styled.div`
  line-height: 1;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: white;
  letter-spacing: ${props => props.spacing || 0};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)};
`

const CircleWrapper = styled.div`
  margin: ${props => responsiveDimension(1)};
`
