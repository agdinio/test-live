import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import GlobeImgage from '@/assets/images/icon-globe.svg'
import icon_arrow_right from '@/assets/images/icon-arrow.svg'
import profilePic from '@/assets/images/profile-image.jpg'
import styled, { keyframes } from 'styled-components'

@inject('ProfileStore', 'UserStore', 'LiveGameStore')
@observer
export default class LiveGameComponent extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {})
  }

  render() {
    return (
      <FriendRankingWrapper>
        <FriendRankingHeader>
          <Arrow>
            <Globe />
            <GlobeImg src={GlobeImgage} /> <ArrowImg src={icon_arrow_right} />
          </Arrow>
          <RankingHeader />
        </FriendRankingHeader>
        <FriendRankingBodyWrapper>
          <LeftColumn>
            <Purple />
            <Gray />
          </LeftColumn>
          <RightColumn>
            <MyRank>
              <MyRankImg src={profilePic} />
              <MyRankNumber number={6} />
            </MyRank>
            <OtherContainer>
              {this.props.LiveGameStore.otherRanks.map(rank => {
                return (
                  <OtherRank key={`other-rank-${rank.id}`}>
                    {rank.rank ? (
                      <OtherRankNumber rank={rank.rank}>
                        {rank.rank}
                      </OtherRankNumber>
                    ) : null}
                    <OtherRankColumn color={rank.color} height={rank.standing}>
                      <OtherRankImg src={rank.profilePicture} />
                    </OtherRankColumn>
                  </OtherRank>
                )
              })}
            </OtherContainer>
          </RightColumn>
        </FriendRankingBodyWrapper>
      </FriendRankingWrapper>
    )
  }
}

const MyRankNumber = styled.span`
  position: absolute;
  top: 50%;
  color: white;
  font-size: 26px;
  font-weight: bold;
  &:before{
    content:'${props => props.number}'
  }
`

const OtherContainer = styled.div`
  display: flex;
  height: 100%;
`

const Purple = styled.div`
  width: 5px;
  height: 260px;
  background-color: rgb(147, 104, 170);
`

const Gray = styled.div`
  width: 5px;
  height: 75px;
  background-color: rgb(207, 210, 208);
`

const FriendRankingWrapper = styled.div`
  font-family: pamainbold;
  background-color: black;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  width: 100%;
`
const FriendRankingHeader = styled.div`
  display: flex;
  margin-top: 3px;
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
`

const FriendRankingBodyWrapper = styled.div`
  height: 326px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
`

const Globe = styled.div`
  top: 0;
  left: 0px;
  width: 65px;
  background-color: #9368aa;
  height: 65px;
  border-radius: 35px;
  position: absolute;
`

const Arrow = styled.div`
  z-index: 1;
  width: 105px;
  height: 50px;
  background-color: #58595b;
  border-bottom-right-radius: 25px;
  border-top-right-radius: 25px;
`

const RankingHeader = styled.div`
  letter-spacing: 2;
  margin-right: 20px;
  text-transform: uppercase;
  color: white;
  align-items: flex-end;
  margin-bottom: 7.5px;
  display: flex;
  flex-direction: row;

  &:before {
    content: 'Friends Ranking';
  }
`

const GlobeImg = styled.img`
  position: absolute;
  top: 7px;
  width: 50px;
  left: 7px;
`

const ArrowImg = styled.img`
  position: absolute;
  top: 15px;
  left: 75px;
`

const LeftColumn = styled.div`
  background-color: #4b4b4c;
  width: 65px;
  overflow: hidden;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const RightColumn = styled.div`
  display: flex;
  align-items: flex-end;
`

const MyRank = styled.div`
  background-color: #18c5ff;
  width: 30px;
  justify-content: center;
  display: flex;
  margin-left: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-right: 7px;
  height: 80%;
`

const MyRankImg = styled.img`
  width: 60px;
  height: 60px;
  border: 6px solid #18c5ff;
  border-radius: 30px;
`

const OtherRank = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  max-width: 17px;
`

const OtherRankColumn = styled.div`
  height: ${props => props.height}%;
  background-color: ${props => props.color};
  margin-right: 3.5px;
  margin-left: 3.5px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const OtherRankImg = styled.img`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin-top: -12px;
  padding: 1px;
`

const OtherRankNumber = styled.span`
  color: white;
  ${props =>
    props.rank >= 10
      ? 'margin-left: -7px;'
      : 'margin-right: 2.5px;'} text-align: center;
  font-size: 23px;
  font-weight: bold;
`
