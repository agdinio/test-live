import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import CopyIcon from '@/assets/images/copy-icon.svg'
import { vhToPx, responsiveDimension } from '@/utils'

export default class CopyLayover extends PureComponent {
  render() {
    return (
      <Container innerRef={this.props.reference} onClick={this.props.return}>
        <Section>
          <div style={{ marginBottom: vhToPx(1) }}>
            <Icon src={CopyIcon} />
          </div>
          <TextWrapper>
            <Text font={'pamainlight'} size={3.6} lineHeight={1.3}>
              your key
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text
              font={'pamainextrabold'}
              size={5.5}
              color="#19d1bf"
              lineHeight={1.3}
            >
              {this.props.referralCode}
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainlight'} size={3.6} lineHeight={1.3}>
              has been&nbsp;
            </Text>
            <Text
              font={'pamainlight'}
              size={3.6}
              color="#19d1bf"
              lineHeight={1.3}
            >
              copied&nbsp;
            </Text>
            <Text font={'pamainlight'} size={3.6} lineHeight={1.3}>
              on this device
            </Text>
          </TextWrapper>
        </Section>
        <Section center marginTop={10}>
          <TextWrapper>
            <Text font={'pamainregular'} size={3.6} lineHeight={1.3}>
              choose your favorite platform
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainregular'} size={3.6} lineHeight={1.3}>
              by simply pasting it in your
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainregular'} size={3.6} lineHeight={1.3}>
              posts - &nbsp;
            </Text>
            <Text
              font={'pamainregular'}
              size={3.6}
              lineHeight={1.3}
              color={'#5684d6'}
            >
              facebook, twitter,
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text
              font={'pamainregular'}
              size={3.6}
              lineHeight={1.3}
              color={'#5684d6'}
            >
              instragram, e-mail, etc...
            </Text>
          </TextWrapper>
        </Section>
        <Section center>
          <TextWrapper>
            <Text font={'pamainlight'} size={4} lineHeight={1.3}>
              tap anywhere to return
            </Text>
          </TextWrapper>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  text-align: center;
  text-transform: uppercase;
  background-color: rgba(0, 0, 0, 0.9);
  position: absolute;
  opacity: 0;
  z-index: -1;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: white;
  font-family: pamainlight;
  padding-top: ${props => vhToPx(10)};
`

const Icon = styled.img`
  width: ${props => responsiveDimension(8)};
  height: ${props => responsiveDimension(8.2)};
  margin-bottom: 20px;
`

const Text__ = styled.span`
  line-height: ${props => props.space || 1};
  color: ${props => props.color || 'white'};
  font-size: ${props => props.size || 3.5}vh;
  font-family: ${props =>
    props.bold
      ? 'pamainbold'
      : props.regular
      ? 'pamainregular'
      : 'pamainlight'};
`

const Section_ = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Section = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${props => (props.center ? `justify-content: center` : '')};
  ${props =>
    props.marginTop ? `padding-top: ${vhToPx(props.marginTop)};` : ''};
`

const TextWrapper = styled.div`
  display: flex;
  ${props => (props.center ? `justify-content: center;` : ``)};
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
`
