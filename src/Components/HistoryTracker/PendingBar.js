import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'
import { TimelineMax } from 'gsap'
import PrePick from '@/assets/images/symbol-prepick.svg'
import GameMaster from '@/assets/images/symbol-gm.svg'
import LivePlay from '@/assets/images/symbol-liveplay.svg'
import Sponsor from '@/assets/images/symbol-sponsor.svg'
import Prize from '@/assets/images/symbol-prize.svg'
import ExtraPoint from '@/assets/images/symbol-liveplay.svg'
import Summary from '@/assets/images/symbol-liveplay.svg'
import PendingOuterIcon from '@/assets/images/pending-outer.svg'
import PendingInnerIcon from '@/assets/images/pending-inner.svg'

const Icons = {
  PrePick,
  GameMaster,
  LivePlay,
  Sponsor,
  Prize,
  ExtraPoint,
  Summary,
}

const backgroundColorLight = {
  LivePlay: '#c61818',
  PrePick: '#ffffff',
  GameMaster: '#19d1bf',
  Sponsor: '#495bdb',
  Prize: '#9368AA',
  ExtraPoint: '#c61818',
  Summary: '#c61818',
  NextPlayAd: '#c61818',
  Announce: '#c61818',
}

export default class PendingBar extends Component {
  handleShowDetailClick(questionId) {
    const detail = this[`detail-${questionId}`]
    const detailAnswerWrapper = this[`detail-answer-wrapper-${questionId}`]
    const detailAnswer = this[`detail-answer-${questionId}`]
    if (detail && detailAnswerWrapper && detailAnswer) {
      if (detailAnswerWrapper.offsetWidth > detailAnswer.offsetWidth) {
        new TimelineMax({ repeat: 0 })
          .to(detail, 0.3, { x: '0%' })
          .to(detail, 0.3, { x: '-100%', delay: 4 })
      } else {
        new TimelineMax({ repeat: 0 })
          .to(detail, 0.3, { x: '0%' })
          .set(detailAnswer, { x: '110%', delay: 1 })
          .to(detailAnswer, 3, { x: '0%' })
          .to(detail, 0.3, { x: '-100%', delay: 1 })
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
    console.log('>>> PENDING BAR <<<')
    let { r } = this.props
    let concatenatedAnswers = ''
    const sHand = 'pending'

    for (let j = 0; j < r.livegameAnswers.length; j++) {
      if (r.livegameAnswers[j].answer) {
        concatenatedAnswers += r.livegameAnswers[j].answer.trim() + ', '
      }
    }

    return (
      <HistoryBarToggle>
        <ResponseWrapper
          pending
          backgroundColor={'#666666'}
          onClick={this.handleShowDetailClick.bind(this, r.questionId)}
        >
          <DualRowWrapper backgroundColor={'#afafaf'}>
            <CommonShortHand backgroundColor={backgroundColorLight[r.type]}>
              {/*{this.renderMultierHistory(r)}*/}
              <CommonSymbol>
                <SymbolImg src={Icons[r.type]} />
              </CommonSymbol>
            </CommonShortHand>
            <ResponseText pending color={'#ffffff'}>
              {sHand}
            </ResponseText>
          </DualRowWrapper>
          <PendingIndicator size={HistoryBarHeight} />
        </ResponseWrapper>
        <HistoryBarDetail
          width={23}
          backgroundColor={backgroundColorLight[r.type]}
          innerRef={ref => (this[`detail-${r.questionId}`] = ref)}
        >
          <HistoryBarDetailAnswersWrapper
            backgroundColor={'#afafaf'}
            innerRef={ref =>
              (this[`detail-answer-wrapper-${r.questionId}`] = ref)
            }
          >
            <HistoryBarDetailAnswers
              innerRef={ref => (this[`detail-answer-${r.questionId}`] = ref)}
            >
              {concatenatedAnswers
                ? concatenatedAnswers.slice(0, -2)
                : 'missed'}
            </HistoryBarDetailAnswers>
          </HistoryBarDetailAnswersWrapper>
        </HistoryBarDetail>
      </HistoryBarToggle>
    )
  }
}

const HistoryBarHeight = 5.8

const HistoryBarToggle = styled.div`
  position: relative;
  height: ${props => HistoryBarHeight};
  -webkit-filter: ${props => (props.missed ? 'grayscale(1)' : 'grayscale(0)')};
  filter: ${props => (props.missed ? 'grayscale(1)' : 'grayscale(0)')};
`

let ResponseWrapper = styled.div`
  position: absolute;
  height: 100%; //+re
  background-color: ${props =>
    props.nopoints ? '#666666' : props.backgroundColor || '#ffffff'};
  display: flex;
  justify-content: space-between;
  color: ${props => props.color};
  width: ${props =>
    props.isEmpty
      ? responsiveDimension(21)
      : props.pending
      ? responsiveDimension(29)
      : responsiveDimension(23)};
  border-radius: 0 ${props => responsiveDimension(HistoryBarHeight)}
    ${props => responsiveDimension(HistoryBarHeight)} 0;
  opacity: 1;
  ${props =>
    props.isEmpty
      ? `border-top: ${responsiveDimension(0.2)} solid #888888;
            border-right: ${0.2} solid #888888;
            border-bottom: ${responsiveDimension(0.2)} solid #888888;`
      : props.sponsor
      ? `border-top: ${responsiveDimension(0.2)} solid ${props.color};
          border-right: ${responsiveDimension(0.2)} solid ${props.color};
          border-bottom: ${responsiveDimension(0.2)} solid ${props.color};`
      : ''};
`

let DualRowWrapper = styled.div`
  width: ${props => responsiveDimension(23)};
  height: 100%;
  border-radius: 0 ${props => responsiveDimension(6)}
    ${props => responsiveDimension(6)} 0;
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.backgroundColor || '#ffffff'};
`

let CommonShortHand = styled.div`
  background-color: ${props => props.backgroundColor};
  width: ${props => responsiveDimension(10)};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  border-top-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
`

let CommonSymbol = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => responsiveDimension(HistoryBarHeight * 0.85)};
  height: ${props => responsiveDimension(HistoryBarHeight * 0.85)};
  border-radius: 50%;
  margin-right: ${props => responsiveDimension(0.5)};
`

let SymbolImg = styled.img`
  height: 80%;
  ${props => (props.isEmpty ? 'width:80%;' : '')};
`

let ResponseText = styled.div`
  font-family: ${props => (props.pending ? 'pamainlight' : 'pamainregular')};
  font-size: ${props =>
    props.nopoints ? responsiveDimension(3) : responsiveDimension(3.6)};
  color: ${props => props.color};
  align-items: center;
  justify-content: flex-end;
  display: flex;
  text-transform: uppercase;
  padding-right: ${props =>
    props.nopoints
      ? props.sponsor
        ? 0
        : responsiveDimension(2)
      : responsiveDimension(3)};
  padding-top: ${props => responsiveDimension(0.2)};
`

const HistoryBarDetail = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(props.width || 29)};
  height: ${props => responsiveDimension(HistoryBarHeight)};
  border-radius: 0 ${props => responsiveDimension(HistoryBarHeight)} ${props =>
  responsiveDimension(HistoryBarHeight)} 0;
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateX(-100%);
  //padding-left: ${props => responsiveDimension(1)};
  //padding-right: ${props => responsiveDimension(0.5)};
  overflow: hidden;
`

const HistoryBarDetailAnswersWrapper = styled.div`
  //position: relative;
  width: ${props => responsiveDimension(23)};
  height: ${props => responsiveDimension(HistoryBarHeight)};
  border-top-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  overflow: hidden;
  background-color: ${props =>
    props.nopoints ? '#666666' : props.backgroundColor || 'transparent'};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const HistoryBarDetailAnswers = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(3.5)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: 0.9;
  white-space: nowrap;
  padding-top: ${props => responsiveDimension(0.4)};
  padding-right: ${props => responsiveDimension(1)};
`

const PendingIndicator = styled.div`
  width: ${props => responsiveDimension(props.size || 4)};
  height: ${props => responsiveDimension(props.size || 4)};
  position: relative;
  display: flex;
  align-items: center;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    background-size: 82%;
    background-repeat: no-repeat;
    background-image: url(${PendingOuterIcon});
    background-position: center;
    transform-origin: center;
    animation: ${props => rotateme} 2s infinite cubic-bezier(0.77, 0, 0.175, 1);
  }
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    width: inherit;
    height: inherit;
    background-size: 82%;
    background-repeat: no-repeat;
    background-image: url(${PendingInnerIcon});
    background-position: center;
    transform-origin: center;
    animation: ${props => rotateme} 1.5s infinite linear,
      ${props => flash} 2s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045);
  }
`

const rotateme = keyframes`
  0%{transform:rotate(0deg);}
  100%{transform:rotate(360deg);}
`

const flash = keyframes`
  0%{opacity:1;}
  50%{opacity:.3;}
  100%{opacity:1;}
`
