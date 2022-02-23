import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { extendObservable, runInAction } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TimelineMax } from 'gsap'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import TokenIcon from '@/assets/images/playalong-token.svg'
import PrePick from '@/assets/images/symbol-prepick.svg'
import GameMaster from '@/assets/images/symbol-gm.svg'
import LivePlay from '@/assets/images/symbol-liveplay.svg'
import Sponsor from '@/assets/images/symbol-sponsor.svg'
import Prize from '@/assets/images/symbol-prize.svg'
import ExtraPoint from '@/assets/images/symbol-liveplay.svg'
import Summary from '@/assets/images/symbol-liveplay.svg'
import agent from '@/Agent'

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

@inject('CommandHostStore', 'LiveGameStore', 'PrePickStore', 'ProfileStore')
export default class ResultBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sHand: '',
      concatenatedAnswers: '',
      item: null,
    }
  }
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

  updatePendingCounter() {
    const pendingPlayCount = this.props.PrePickStore.answers.filter(
      o => !o.ended
    ).length
    this.props.CommandHostStore.setPendingPlayCount(pendingPlayCount)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.sHand !== this.state.sHand) {
      return true
    }
    return false
  }

  componentDidMount() {
    let { questionId } = this.props
    let { sHand, concatenatedAnswers } = this.state
    let creditCurrValues = 0
    let allowResolvePopup = 0
    let team = null
    let tokens = 0
    let points = 0
    let concatAns = ''
    const currencies = []

    const item = this.props.PrePickStore.answers.filter(
      o => o.questionId === questionId
    )[0]
    if (!item) {
      return
    }

    this.setState({ item: item })

    if (
      item.isPresetTeamChoice &&
      this.props.PrePickStore.teams &&
      this.props.PrePickStore.teams.length > 0
    ) {
      team = this.props.PrePickStore.teams.filter(
        o => o.teamName.toLowerCase() === item.answer.toLowerCase()
      )[0]
    }

    for (let i = 0; i < item.livegameAnswers.length; i++) {
      let livegameAnswer = item.livegameAnswers[i]
      if (livegameAnswer.answer) {
        concatAns += livegameAnswer.answer.trim() + ', '
      }

      tokens += livegameAnswer.tokens
      points += livegameAnswer.points

      if (item.stars && item.stars === i + 1) {
        runInAction(() => (livegameAnswer.stars = 1))
      } else {
        runInAction(() => (livegameAnswer.stars = 0))
      }

      let correctAnswer =
        livegameAnswer && livegameAnswer.correctAnswer
          ? livegameAnswer.correctAnswer.trim().toLowerCase()
          : ''
      let correct =
        (livegameAnswer.answer
          ? livegameAnswer.answer.trim().toLowerCase()
          : '') === correctAnswer

      if (!livegameAnswer.isCredited) {
        allowResolvePopup += 1
        if (correct) {
          if ('Sponsor' === item.type) {
            //sponsor type
            /*
                        if (tokens > 0) {
                          creditCurrValues += parseInt(tokens * this.props.LiveGameStore.timesValuePerFee)
                          runInAction(() => {
                            item.shortHand = tokens
                          })
                        }
            */
            if (points > 0) {
              creditCurrValues = points
            }
          } else {
            //any type
            creditCurrValues += parseInt(
              item.feeCounterValue * this.props.LiveGameStore.timesValuePerFee
            )
          }
        } else {
          if ('Sponsor' === item.type) {
            //sponsor type
            if (item.stars <= 0) {
              if (tokens > 0) {
                runInAction(() => (item.shortHand = '0'))
              } else {
                runInAction(() => {
                  item.shortHand =
                    item.shortHand -
                    item.feeCounterValue *
                      this.props.LiveGameStore.timesValuePerFee
                })
              }
            }
          } else {
            //any type
            runInAction(() => {
              item.shortHand =
                item.shortHand -
                item.feeCounterValue * this.props.LiveGameStore.timesValuePerFee
            })
          }
        }
        runInAction(() => {
          livegameAnswer.isCredited = true
        })
      }
    }

    this.setState({ concatenatedAnswers: concatAns })

    if (!item.isLocked) {
      if (creditCurrValues > 0) {
        currencies.push({ currency: 'points', amount: creditCurrValues })
        this.props.ProfileStore.creditCurrencies(
          {
            currency: 'points',
            amount: creditCurrValues,
          },
          'UPDATE_INTERNAL'
        )
      }
    }

    if (allowResolvePopup > 0) {
      if (!item.isLocked) {
        this.props.CommandHostStore.setLatestResolvedPlay(item)
      }
      this.updatePendingCounter()
    } else {
      if (!item.isMissedPlayHasShown) {
        setTimeout(() => {
          item.isMissedPlayHasShown = true
          if (!item.isLocked) {
            this.props.CommandHostStore.setLatestResolvedPlay(item)
          }
          this.updatePendingCounter()
        }, 0)
      }
    }

    /**
     * update history play on redis - pending play
     */
    if (!item.isLocked) {
      item.isLocked = true
      this.props.CommandHostStore.updateHistoryPlayToServer(item, currencies)
    }

    if ('Sponsor' === item.type) {
      debugger
      if (item.livegameAnswers.length > 0) {
        if (
          item.livegameAnswers[0].answer ===
          item.livegameAnswers[0].correctAnswer
        ) {
          this.setState({ sHand: `+${tokens}` })
        } else {
          this.setState({ sHand: 'NO POINTS' })
        }
      } else {
        this.setState({ sHand: 'MISSED' })
      }
    } else {
      if (item.livegameAnswers.length > 0) {
        this.setState({
          sHand: item.shortHand <= 0 ? 'NO POINTS' : `+${item.shortHand}`,
        })
      } else {
        this.setState({ sHand: 'MISSED' })
      }
    }
  }

  render() {
    if (!this.state.sHand || !this.state.item) {
      return <HistoryBarToggleRelative />
    }

    console.log('>>> RESULT BAR <<<')
    let { sHand, concatenatedAnswers, item } = this.state
    let creditCurrValues = 0
    let allowResolvePopup = 0
    let team = null
    let tokens = 0

    const _nopoints = sHand === 'NO POINTS' || sHand === 'MISSED' ? true : false
    const _missed = sHand === 'MISSED' ? true : false

    if ('Sponsor' === item.type) {
      return (
        <HistoryBarToggleRelative>
          <HistoryBarToggle missed={_missed}>
            <ResponseWrapperSponsor
              onClick={
                _missed
                  ? null
                  : this.handleShowDetailClick.bind(this, item.questionId)
              }
            >
              <ResponseWrapperSponsorInner
                sponsor
                nopoints={_nopoints}
                missed={_missed}
                color={_nopoints ? '#666666' : '#ffb600'}
              >
                {_nopoints || _missed ? (
                  <ResponseText sponsor nopoints={_nopoints} color={'#afafaf'}>
                    {sHand}
                  </ResponseText>
                ) : (
                  <SponsorActiveTokensWrapper>
                    <ActivePoints color={'#ffb600'}>{sHand}</ActivePoints>
                    <TokenWrapper>
                      <Token src={TokenIcon} size={2.5} index={3} />
                      <Faded
                        index={2}
                        size={2.5}
                        color={'#6d6c71'}
                        left={-2.2}
                      />
                      <Faded
                        index={1}
                        size={2.5}
                        color={'#33342f'}
                        left={-2.2}
                      />
                    </TokenWrapper>
                  </SponsorActiveTokensWrapper>
                )}
              </ResponseWrapperSponsorInner>
              <ResponseWrapperSponsorShortHand
                color={backgroundColorLight[item.type]}
              >
                <CommonSymbol>
                  <SymbolImg src={Icons[item.type]} />
                </CommonSymbol>
              </ResponseWrapperSponsorShortHand>
            </ResponseWrapperSponsor>
            <HistoryBarDetail
              style={{ zIndex: 10 }}
              backgroundColor={backgroundColorLight[item.type]}
              innerRef={ref => (this[`detail-${item.questionId}`] = ref)}
            >
              <HistoryBarDetailAnswersWrapper
                nopoints={_nopoints}
                innerRef={ref =>
                  (this[`detail-answer-wrapper-${item.questionId}`] = ref)
                }
              >
                <HistoryBarDetailAnswers
                  innerRef={ref =>
                    (this[`detail-answer-${item.questionId}`] = ref)
                  }
                >
                  {concatenatedAnswers ? concatenatedAnswers.slice(0, -2) : ''}
                </HistoryBarDetailAnswers>
              </HistoryBarDetailAnswersWrapper>
              {item.isPresetTeamChoice && team ? (
                <TeamWrapper>
                  <Team
                    teamInfo={team}
                    size={HistoryBarHeight * 0.85}
                    abbrSize={4}
                    outsideBorderColor={'#000000'}
                    subCircleSize={90}
                  />
                </TeamWrapper>
              ) : (
                <CommonSymbol>
                  <SymbolImg src={Icons[item.type]} />
                </CommonSymbol>
              )}
            </HistoryBarDetail>
          </HistoryBarToggle>
        </HistoryBarToggleRelative>
      )
    } else {
      return (
        <HistoryBarToggleRelative>
          <HistoryBarToggle missed={_missed}>
            <ResponseWrapper
              nopoints={_nopoints}
              backgroundColor={'#ffffff'}
              onClick={
                _missed
                  ? null
                  : this.handleShowDetailClick.bind(this, item.questionId)
              }
            >
              <CommonShortHand
                backgroundColor={backgroundColorLight[item.type]}
              >
                <CommonSymbol>
                  <SymbolImg src={Icons[item.type]} />
                </CommonSymbol>
              </CommonShortHand>
              <ResponseText
                nopoints={_nopoints}
                color={backgroundColorLight[item.type]}
              >
                {sHand}
              </ResponseText>
            </ResponseWrapper>
            <HistoryBarDetail
              backgroundColor={backgroundColorLight[item.type]}
              innerRef={ref => (this[`detail-${item.questionId}`] = ref)}
            >
              <HistoryBarDetailAnswersWrapper
                backgroundColor={_nopoints ? '#666666' : 'transparent'}
                innerRef={ref =>
                  (this[`detail-answer-wrapper-${item.questionId}`] = ref)
                }
              >
                <HistoryBarDetailAnswers
                  color={_nopoints ? '#afafaf' : '#ffffff'}
                  innerRef={ref =>
                    (this[`detail-answer-${item.questionId}`] = ref)
                  }
                >
                  {concatenatedAnswers
                    ? concatenatedAnswers.slice(0, -2)
                    : 'MISSED'}
                </HistoryBarDetailAnswers>
              </HistoryBarDetailAnswersWrapper>
              {item.type === 'LivePlay' ? (
                item.livegameAnswers.length > 1 ? (
                  <HistoryBarDetailTimes>
                    {concatenatedAnswers
                      ? concatenatedAnswers.slice(0, -2).split(',').length
                      : 0}
                    x
                  </HistoryBarDetailTimes>
                ) : (
                  <CommonSymbol>
                    <SymbolImg src={Icons[item.type]} />
                  </CommonSymbol>
                )
              ) : item.isPresetTeamChoice && team ? (
                <TeamWrapper>
                  <Team
                    teamInfo={team}
                    size={HistoryBarHeight * 0.85}
                    abbrSize={4}
                    outsideBorderColor={'#000000'}
                    subCircleSize={90}
                  />
                </TeamWrapper>
              ) : (
                <CommonSymbol>
                  <SymbolImg src={Icons[item.type]} />
                </CommonSymbol>
              )}
            </HistoryBarDetail>
          </HistoryBarToggle>
        </HistoryBarToggleRelative>
      )
    }
  }
}

let ResponseWrapperX = styled.div`
  //position: absolute;
  height: inherit;
  background-color: #ffffff;
  //display: flex;
  //justify-content: space-between;
  //color: ${props => props.color};
`

const HistoryBarHeight = 5.8
const ActivePlayHeight = 7

const HistoryBarToggleRelative = styled.div`
  width: 100%;
  height: 100%;
`

const HistoryBarToggle = styled.div`
  position: relative;
  height: ${props => responsiveDimension(HistoryBarHeight)};
  -webkit-filter: ${props => (props.missed ? 'grayscale(1)' : 'grayscale(0)')};
  filter: ${props => (props.missed ? 'grayscale(1)' : 'grayscale(0)')};
`

let ResponseWrapper = styled.div`
  position: absolute;
  height: inherit;
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
            border-right: ${responsiveDimension(0.2)} solid #888888;
            border-bottom: ${responsiveDimension(0.2)} solid #888888;`
      : props.sponsor
      ? `border-top: ${responsiveDimension(0.2)} solid ${props.color};
          border-right: ${responsiveDimension(0.2)} solid ${props.color};
          border-bottom: ${responsiveDimension(0.2)} solid ${props.color};`
      : ''};
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
  color: ${props => (props.nopoints ? '#afafaf' : props.color)};
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

const HistoryBarDetailTimes = styled.div`
  width: ${props => responsiveDimension(HistoryBarHeight * 0.85)};
  height: ${props => responsiveDimension(HistoryBarHeight * 0.85)};
  border-radius: 50%;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(HistoryBarHeight * 0.5)};
  text-transform: uppercase;
  margin-right: ${props => responsiveDimension(0.5)};
`

const TeamWrapper = styled.div`
  margin-right: ${props => responsiveDimension(0.5)};
`

/**
 * SPONSOR UI
 **/

const ResponseWrapperSponsor = styled.div`
  height: inherit;
  display: flex;
  position: absolute;
`
const ResponseWrapperSponsorShortHand = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(1.9)};
  background-color: ${props => props.color};
  text-transform: uppercase;
  width: ${props => responsiveDimension(10)};
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  flex-direction: row;
  position: absolute;
`
const ResponseWrapperSponsorInner = styled.div`
  position: absolute;
  height: inherit;
/*
  background-color: ${props =>
    props.isEmpty
      ? '#c1c1c1; filter: grayscale(100%);'
      : props.sponsor
      ? '#000000'
      : props.backgroundColor || '#ffffff'};
*/
  background-color: ${props =>
    props.missed || props.nopoints
      ? '#666666'
      : props.sponsor
      ? '#000000'
      : props.backgroundColor || '#ffffff'};
  color: ${props => props.color};
  width: ${props =>
    props.isEmpty
      ? responsiveDimension(21)
      : props.pending
      ? responsiveDimension(29)
      : responsiveDimension(23)};
  border-radius: 0 ${props => responsiveDimension(HistoryBarHeight)} ${props =>
  responsiveDimension(HistoryBarHeight)} 0;
  display: flex;
  justify-content: flex-end;
  padding-right: ${props => responsiveDimension(2)};
  opacity: 1;
  ${props =>
    props.isEmpty
      ? `border-top: ${responsiveDimension(0.2)} solid #888888;
            border-right: ${responsiveDimension(0.2)} solid #888888;
            border-bottom: ${responsiveDimension(0.2)} solid #888888;`
      : props.sponsor
      ? `border-top: ${responsiveDimension(0.2)} solid ${props.color};
          border-right: ${responsiveDimension(0.2)} solid ${props.color};
          border-bottom: ${responsiveDimension(0.2)} solid ${props.color};`
      : ''};
`

const SponsorActiveTokensWrapper = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const TokenWrapper = styled.div`
  height: 100%;
  margin-left: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.4)};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Token = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props =>
    props.adjustWidth
      ? responsiveDimension(props.size + 0.1)
      : responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
`

const Faded = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left)};
  z-index: ${props => props.index};
`

const ActivePoints = styled.div`
  height: ${props => responsiveDimension(ActivePlayHeight)};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.7)};
  color: ${props => props.color || '#ffffff'};
  display: flex;
  justify-content: center;
  align-items: center;
`
