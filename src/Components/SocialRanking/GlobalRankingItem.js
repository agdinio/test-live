import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import ProfileImage from '@/assets/images/profiles/icon-profile.svg'
import styled, { keyframes } from 'styled-components'
import { hex2rgb, vhToPx, ordinalSuffix, evalImage } from '@/utils'

export default class GlobalRankingItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { rank } = this.props
    return (
      <Container innerRef={this.props.reference}>
        <InnerLeft innerRef={this.props.refInnerLeft}>
          <Rank />
          <ProfileIcon src={ProfileImage} />
        </InnerLeft>
        <InnerRight>
          <Name />
          <PointsWrapper>
            <PointsInner>
              <Points>{rank.points}</Points>
              <PTS>PTS</PTS>
            </PointsInner>
          </PointsWrapper>
        </InnerRight>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: ${props => vhToPx(5.5)};
  margin-top: ${props => vhToPx(0.3)};
  //background-color: #231f20;
  background-color: #414042;
  display: flex;
  justify-content: space-between;
  position: relative;
`
const InnerLeft = styled.div`
  width: 45%;
  height: 100%;
  border-top-right-radius: ${props => vhToPx(6.2)};
  border-bottom-right-radius: ${props => vhToPx(6.2)};
  background-color: ${props => (props.isMe ? '#18c5ff' : '#6d6e71')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: ${props => vhToPx(1.4)};
`
const Rank = styled.div`
  height: 100%;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: pamainregular;
  font-size: ${props => vhToPx(3.1)};
  text-transform: uppercase;
  color: ${props => (props.isMe ? '#000000' : '#ffffff')};
`
const ProfileIcon = styled.img`
  height: 75%;
`
const InnerRight = styled.div`
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  padding 0 3% 0 5%;
`
const Name = styled.div`
  font-family: pamainregular;
  font-size: ${props => vhToPx(2.3)};
  text-transform: uppercase;
  color: #ffffff;
  display: flex;
  align-items: center;
`
const PointsWrapper = styled.div`
  display: flex;
  align-items: center;
`
const PointsInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`
const Points = styled.div`
  flex-direction: row;
  font-family: pamainextrabold;
  font-size: ${props => vhToPx(3.1)};
  color: #ffffff;
  line-height: 1.1;
`

const PTS = styled.div`
  font-family: pamainregular;
  font-size: ${props => vhToPx(2)};
  color: #18c5ff;
  text-transform: uppercase;
`
