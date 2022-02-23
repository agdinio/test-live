import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe } from 'mobx'
import ProfileMe from '@/assets/images/profiles/icon-profile.svg'
import styled, { keyframes } from 'styled-components'
import { hex2rgb, vhToPx, ordinalSuffix, evalImage } from '@/utils'

@observer
export default class Item extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { person, ctr, isGlobal } = this.props
    return (
      <Container isMe={person.isMe} ctr={ctr} innerRef={this.props.reference}>
        {person.isMe ? <ContainerBorder /> : ''}
        <InnerLeft isMe={person.isMe} isGlobal={isGlobal}>
          <Rank isMe={person.isMe}>
            {person.place}
            <RankOrdinal isMe={person.isMe}>
              {ordinalSuffix(person.place)}
            </RankOrdinal>
          </Rank>
        </InnerLeft>
        <InnerRight>
          <Name>{person.name}</Name>
          <PointsWrapper>
            <PointsInner>
              <Points>{person.points}</Points>
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
  height: ${props => (props.isMe ? vhToPx(8) : vhToPx(5.2))};
  margin-top: ${props => (props.isMe ? 0 : props.ctr === 2 ? 0 : vhToPx(0.2))};
  background-color: ${props => (props.isMe ? '#231f20' : '#414042')};
  display: flex;
  justify-content: space-between;
  position: relative;
`

const ContainerBorder = styled.div`
  width: 100%;
  height: ${props => vhToPx(8)};
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  position: absolute;
  border: ${props => vhToPx(0.4)} solid #18c5ff;
`

const InnerLeft = styled.div`
  width: ${props => (props.isMe ? '18%' : '15%')};
  height: 100%;
  border-top-right-radius: ${props => (props.isMe ? vhToPx(8) : vhToPx(5.2))};
  border-bottom-right-radius: ${props =>
    props.isMe ? vhToPx(8) : vhToPx(5.2)};
  background-color: ${props => (props.isMe ? '#18c5ff' : '#6d6e71')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: ${props => vhToPx(0.4)};
  ${props =>
    props.isGlobal ? `animation: ${adjustInnerLeftWidth} 2s forwards;` : ``};
`

const adjustInnerLeftWidth = keyframes`
  0%{
    width: 45%;
  }
  100%{
    width: 70%;
  }
`

const Rank = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  margin-left: ${props => (props.isMe ? '40%' : '50%')};
  font-family: pamainregular;
  font-size: ${props => (props.isMe ? vhToPx(4) : vhToPx(2.8))};
  text-transform: uppercase;
  color: ${props => (props.isMe ? '#000000' : '#ffffff')};
`
const RankOrdinal = styled.span`
  font-size: ${props => (props.isMe ? vhToPx(2.4) : vhToPx(1.7))};
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 60%;
`

const InnerRight = styled.div`
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  padding 0 4% 0 5%;
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
  font-size: ${props => vhToPx(2.8)};
  color: #ffffff;
  line-height: 1.1;
`

const PTS = styled.div`
  font-family: pamainlight;
  font-size: ${props => vhToPx(2)};
  color: #18c5ff;
  text-transform: uppercase;
  padding-left: ${props => vhToPx(0.4)};
`
