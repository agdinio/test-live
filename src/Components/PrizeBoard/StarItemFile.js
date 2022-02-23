import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import {
  vhToPx,
  evalImage,
  ordinalSuffix,
  numberFormat,
  responsiveDimension,
} from '@/utils'
import StarIconGold from '@/assets/images/star-icon-gold.svg'
import LockIcon from '@/assets/images/icon-lock.svg'

@observer
export default class StarItemFile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { item, selStar } = this.props
    let isSelected = selStar.text === item.text

    return (
      <Container onClick={this.props.handleStarItemClick}>
        <Wrapper>
          <Top>
            <DarkWrapper>
              <StarCircle
                src={evalImage(item.icon)}
                borderColor={isSelected ? '#efdf18' : '#ffffff'}
              >
                {isSelected ? <StarCircleSmall src={StarIconGold} /> : null}
              </StarCircle>
              <StarTextWrapper>
                <Text
                  font={'pamainlight'}
                  size={6}
                  color={isSelected ? '#efdf18' : '#ffffff'}
                  uppercase
                >
                  {item.text}
                </Text>
              </StarTextWrapper>
            </DarkWrapper>
          </Top>
          <Middle>
            {item.eventList.map((evt, k) => {
              return (
                <TextWrapper key={k}>
                  <Text
                    font={'pamainbold'}
                    size={2.5}
                    color={'#212121'}
                    uppercase
                  >
                    {evt}
                  </Text>
                </TextWrapper>
              )
            })}
          </Middle>
          <Bottom>
            <LockCircleWrapper>
              <LockCircle src={LockIcon} />
            </LockCircleWrapper>
          </Bottom>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: ${props => responsiveDimension(20)};
  height: 100%;
  display: flex;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`

const Wrapper = styled.div`
  width: ${props => responsiveDimension(19)};
  height: inherit;
  background: #efdf18;
  display: flex;
  flex-direction: column;
  border-top-left-radius: ${props => responsiveDimension(19)};
  border-top-right-radius: ${props => responsiveDimension(19)};
`

const Top = styled.div`
  width: 100%;
  height: 46%;
`
const Middle = styled.div`
  width: 100%;
  height: 32%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Bottom = styled.div`
  width: 100%;
  height: 22%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DarkWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #212121;
  border-radius: ${props => responsiveDimension(19)};
`

const StarCircle = styled.div`
  width: ${props => responsiveDimension(19)};
  height: ${props => responsiveDimension(19)};
  border-radius: ${props => responsiveDimension(19)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  border ${props => responsiveDimension(0.5)} solid ${props =>
  props.borderColor || '#ffffff'};
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const StarTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 5%;
`

const StarCircleSmall = styled.div`
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(5)};
  border-radius: ${props => responsiveDimension(5)};
  background-color: #212121;
  border ${props => responsiveDimension(0.4)} solid #efdf18;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -6%;

  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(5)};
    height: ${props => responsiveDimension(5)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 75%;
    background-position: center;
  }
`

const TextWrapper = styled.div`
  line-height: 1.4;
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)};
`

const LockCircleWrapper = styled.div`
  width: ${props => responsiveDimension(8)};
  height: ${props => responsiveDimension(8)};
  border-radius: ${props => responsiveDimension(8)};
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LockCircle = styled.div`
  width: ${props => responsiveDimension(4.7)};
  height: ${props => responsiveDimension(4.7)};
  border-radius: ${props => responsiveDimension(4.7)};
  background-color: #ffffff;
  border ${props => responsiveDimension(0.4)} solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(4.4)};
    height: ${props => responsiveDimension(4.4)};
    background-color: #000000;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 70%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 70%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`
