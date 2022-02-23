import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { vhToPx, hex2rgb, ordinalSuffix } from '@/utils'
import CelebProfileIcon from '@/assets/images/profile-icon-dark.svg'

export default class CelebEarner extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { item } = this.props

    return (
      <EarnerOuter>
        <EarnerInner>
          <RankTab>
            <Icon src={CelebProfileIcon} />
          </RankTab>
          <Username>{item.name}</Username>
          <Subtitle>{item.subtitle}</Subtitle>
        </EarnerInner>
      </EarnerOuter>
    )
  }
}

const EarnerOuter = styled.div`
  width: 100%;
  border-top: ${props => vhToPx(0.15)} solid #414042;
`

const EarnerInner = styled.div`
  width: 100%;
  height: ${props => vhToPx(5.3)};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const RankTab = styled.div`
  width: 23%;
  height: ${props => vhToPx(5.3)};
  border-top-right-radius: ${props => vhToPx(5.3)};
  border-bottom-right-radius: ${props => vhToPx(5.3)};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: linear-gradient(to right, #837a26, #e6d636);
`

const Icon = styled.div`
  width: ${props => vhToPx(4.4)};
  height: ${props => vhToPx(4.4)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  margin-right: 6%;
`

const Username = styled.div`
  width: inherit;
  height: 100%;
  font-family: pamainlight;
  font-size: ${props => vhToPx(2.5)};
  color: white;
  text-transform: uppercase;
  letter-spacing: ${props => props => vhToPx(0.1)};
  padding-left: 5%;
  display: flex;
  align-items: center;
`

const Subtitle = styled.div`
  width: inherit;
  font-family: pamainregular;
  font-size: ${props => vhToPx(1.8)};
  color: white;
  text-transform: uppercase;
  letter-spacing: ${props => vhToPx(0.1)};
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
`

const PointsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  line-height: 1;
  padding-right: 5%;
`
const Points = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => vhToPx(3)};
  color: white;

  &:after {
    content: 'PTS';
    font-family: pamainlight;
    font-size: ${props => vhToPx(2)};
    color: #17c5ff;
    margin-left: ${props => vhToPx(0.5)};
  }
`

const Ordinal = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 1;
`

const RankText = styled.div`
  font-family: pamainlight;
  font-size: ${props => (props.rank === 1 ? vhToPx(3.9) : vhToPx(2.8))};
  color: ${props => (props.celeb ? 'black' : 'white')};
  font-weight: bold;
`

const OrdinalText = styled.div`
  font-family: pamainregular;
  font-size: ${props => (props.rank === 1 ? vhToPx(2.5) : vhToPx(1.7))};
  color: ${props => (props.celeb ? 'black' : 'white')};
  text-transform: uppercase;
`
