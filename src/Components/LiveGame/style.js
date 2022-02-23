import styled, { keyframes } from 'styled-components'
import background from '@/assets/images/playalong-default.jpg'

const VideoContainer = styled.div`
  text-align: center;
`

const fadeInAdmiation = keyframes`
  0% { opacity:0; }
  100% { opacity:1; }
`
const maxWidth = '69vh'
const maxDeviceWidth = '1125px'
const LiveGameContainer = styled.div`
  animation: 0.25s ${fadeInAdmiation} forwards;
  width: 69vh;
  height: 100vh;
  position: relative;
  display: flex;
  max-width: 660px;
  margin: 0 auto;
  overflow: hidden;

  @media screen and (max-width: ${props => maxWidth}) {
    width: 100vw;
    height: 100%;
  }
  @media only screen and (max-device-width: ${props =>
      maxDeviceWidth}) and (orientation: portrait) {
    min-height: 100vh;
  }
`

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-transform: uppercase;
  font-size: 36px;
`

const FriendRankingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
`
const FriendRankingHeader = styled.div`
  display: flex;
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
  top: -6px;
  margin-left: 20px;
  width: 65px;
  background-color: #9368aa;
  height: 65px;
  border-radius: 35px;
  position: absolute;
`

const Arrow = styled.div`
  z-index: 1;
  padding-right: 40px;
  width: 20%;
  background-color: #58595b;
  border-bottom-right-radius: 25px;
  border-top-right-radius: 25px;
`

const RankingHeader = styled.div`
  margin-right: 50px;
  text-transform: uppercase;
  color: white;
  align-items: flex-end;
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
`

const GlobeImg = styled.img`
  position: absolute;
  top: 2px;
  width: 50px;
  left: 28px;
`

const ArrowImg = styled.img`
  position: absolute;
  top: 12px;
  left: 100px;
`

const LeftColumn = styled.div`
  background-color: #4b4b4c;
  width: 105px;
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

const MuteButton = styled.span`
  position: absolute;
  top: 30px;
  right: 50px;
  z-index: 5;
  color: white;
  cursor: pointer;
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

module.exports = {
  OtherRankNumber,
  PanelWrapper,
  FriendRankingWrapper,
  FriendRankingHeader,
  FriendRankingBodyWrapper,
  Globe,
  Arrow,
  RankingHeader,
  GlobeImg,
  ArrowImg,
  LeftColumn,
  RightColumn,
  MyRank,
  MyRankImg,
  OtherRank,
  OtherRankColumn,
  OtherRankImg,
  LiveGameContainer,
  MuteButton,
  VideoContainer,
}
