import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import token from '@/assets/images/playalong-token.svg'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { vhToPx, hex2rgb, responsiveDimension } from '../../utils'

@observer
export default class Summary extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      points: 0,
      tokens: 0,
    })
  }

  componentDidUpdate(nextProps) {
    if (this.props.profile && this.props.profile.currencies) {
      this.points = this.props.profile.currencies['points']
      this.tokens = this.props.profile.currencies['tokens']
    }
  }

  componentWillReceiveProps__(nextProps) {
    if (nextProps.profile && nextProps.profile.currencies) {
      this.points = nextProps.profile.currencies.points
      this.tokens = nextProps.profile.currencies.tokens
    }
  }

  render() {
    const { handleToMyKey } = this.props
    return (
      <Container innerRef={this.props.reference}>
        <Section>
          <TextWrapper>
            <Text font={'pamainlight'} size={5}>
              you've earned
            </Text>
          </TextWrapper>
        </Section>

        <Section>
          <TextWrapper>
            <TokenContainer>
              <Text font={'pamainextrabold'} size={6.5} color={'#ffb600'}>
                {this.tokens}
              </Text>
              <TokenWrapper>
                <Token src={token} index={3} />
                <Faded index={2} color={'#6d6c71'} left={0.4} />
                <Faded index={1} color={'#33342f'} left={1} />
              </TokenWrapper>
              <Text font={'pamainlight'} size={6.4} color={'#ffb600'}>
                tokens&nbsp;
              </Text>
              <Text font={'pamainlight'} size={6.5}>
                &
              </Text>
            </TokenContainer>
          </TextWrapper>

          <TextWrapper>
            <Text font={'pamainextrabold'} size={6.5} color={'#17c5ff'}>
              {this.points}
              &nbsp;
            </Text>
            <Text font={'pamainlight'} size={6.4} color={'#17c5ff'}>
              points
            </Text>
          </TextWrapper>
        </Section>

        <Section>
          <TextWrapper>
            <Text font={'pamainlight'} size={5}>
              as an
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text font={'pamainextrabold'} size={6.5} color={'#efdf18'}>
              ambassador
            </Text>
          </TextWrapper>
        </Section>

        <Section>
          <TextWrapper lineHeight={1.1}>
            <Text font={'pamainextrabold'} size={4.8} color={'#ed1c24'}>
              share&nbsp;
            </Text>
            <Text font={'pamainlight'} size={4.8}>
              your&nbsp;
            </Text>
            <Text font={'pamainextrabold'} size={4.8} color={'#19d1be'}>
              key
            </Text>
          </TextWrapper>
          <TextWrapper lineHeight={1.1}>
            <Text font={'pamainlight'} size={4}>
              for&nbsp;
            </Text>
            <Text font={'pamainbold'} size={4}>
              bonus&nbsp;
            </Text>
            <Text font={'pamainextrabold'} size={4} color={'#ffb600'}>
              tokens&nbsp;
            </Text>
            <Text font={'pamainlight'} size={4}>
              &&nbsp;
            </Text>
            <Text font={'pamainextrabold'} size={4} color={'#17c5ff'}>
              points
            </Text>
          </TextWrapper>
          <TextWrapper lineHeight={1.1}>
            <Text font={'pamainextrabold'} size={4}>
              to use in the coming
            </Text>
          </TextWrapper>
          <TextWrapper lineHeight={1.1}>
            <Text font={'pamainextrabold'} size={4} color={'#ed1c24'}>
              live&nbsp;
            </Text>
            <Text font={'pamainextrabold'} size={4}>
              events
            </Text>
          </TextWrapper>
        </Section>

        <Section>
          <ToKeyButton onClick={handleToMyKey}>
            <TextWrapper>
              <Text font={'pamainregular'} size={3.7}>
                to my&nbsp;
              </Text>
              <Text font={'pamainextrabold'} size={3.7}>
                key
              </Text>
            </TextWrapper>
            <Arrow src={ArrowIcon} />
          </ToKeyButton>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  position: absolute;
`
const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => vhToPx(5)};
`
const TextWrapper = styled.div`
  line-height: ${props => props.lineHeight || 1};
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
`
const TokenContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const TokenWrapper = styled.div`
  margin-left: ${props => responsiveDimension(1)};
  margin-right: ${props => responsiveDimension(6.5)};
  margin-top: ${props => responsiveDimension(0.5)};
`
const Token = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(5)};
  z-index: ${props => props.index};
  position: absolute;
`
const Faded = styled.div`
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(5)};
  border-radius: ${props => responsiveDimension(5)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left)};
  z-index: ${props => props.index};
  position: absolute;
`

const ToKeyButton = styled.div`
  width: 40%;
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(0.5)};
  background-color: #19d1be;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Arrow = styled.img`
  height: ${props => responsiveDimension(3.3)};
  margin-left: ${props => responsiveDimension(2)};
`
