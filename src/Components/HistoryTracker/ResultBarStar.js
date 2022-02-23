import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { extendObservable, runInAction } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TimelineMax } from 'gsap'
import { hex2rgb, responsiveDimension } from '@/utils'
import Team from '@/Components/LiveGame/StatusPanel/StatusPanelTeamIcon'
import StarIcon from '@/assets/images/star-icon-gold.svg'
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

const IconsColor = {
  Empty: '#c1c1c1',
  PrePick: '#2fc12f',
  GameMaster: '#19d1bf',
  LivePlay: '#c61818',
  Sponsor: '#495bdb',
  Prize: '#9368AA',
  ExtraPoint: '#c61818',
  Summary: '#c61818',
  NextPlayAd: '#c61818',
  Announce: '#c61818',
}

@inject('CommandHostStore', 'PrePickStore', 'ProfileStore', 'LiveGameStore')
export default class ResultBarStar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sHand: '',
      concatenatedAnswers: '',
      item: null,
      team: null,
      _missed: false,
      _nopoints: false,
      starEarned: false,
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
    let tokens = 0
    let points = 0
    let allowResolvePopup = 0
    let creditCurrValues = 0
    //let team = null
    let multiplier = 0
    //let starEarned = false
    let answer = null
    let shortHand = ''
    let concatAns = ''
    const currencies = []

    const item = this.props.PrePickStore.answers.filter(
      o => o.questionId === questionId
    )[0]
    if (!item) {
      return
    }

    this.setState({ item: item })

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
              creditCurrValues += parseInt(
                tokens * this.props.LiveGameStore.timesValuePerFee
              )
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
        runInAction(() => (livegameAnswer.isCredited = true))
      }
    }

    this.setState({ concatenatedAnswers: concatAns })

    //*****************

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

    //*****************

    if (
      item.isPresetTeamChoice &&
      this.props.PrePickStore.teams &&
      this.props.PrePickStore.teams.length > 0
    ) {
      this.setState({
        team: this.props.PrePickStore.teams.filter(
          o => o.teamName.toLowerCase() === item.answer.toLowerCase()
        )[0],
      })
    }

    let starAnswer = item.livegameAnswers.filter(o => o.stars > 0)[0]
    if (starAnswer && starAnswer.stars > 0) {
      multiplier = starAnswer.multiplier || 1
      if (
        starAnswer.answer &&
        starAnswer.correctAnswer &&
        starAnswer.answer.trim().toLowerCase() ===
          starAnswer.correctAnswer.trim().toLowerCase()
      ) {
        this.setState({ starEarned: true })
        answer = starAnswer.answer
        this.setState({ _nopoints: false })
        this.setState({ sHand: `${starAnswer.stars} STAR` })
        shortHand = `${starAnswer.stars} STAR`
        if (!starAnswer.isStarCredited) {
          runInAction(() => (starAnswer.isStarCredited = true))
          if (!item.isLocked) {
            currencies.push({ currency: 'stars', amount: starAnswer.stars })
            this.props.ProfileStore.creditCurrencies(
              {
                currency: 'stars',
                amount: starAnswer.stars,
              },
              'UPDATE_INTERNAL'
            )
          }
        }
      } else {
        this.setState({ starEarned: false })
        answer = starAnswer.answer
        this.setState({ _nopoints: true })
        this.setState({ sHand: 'NO STAR' })
        shortHand = 'NO POINTS'
      }
    } else {
      if (
        item.livegameAnswers &&
        item.livegameAnswers.length > 0 &&
        item.livegameAnswers.length >= item.stars
      ) {
        this.setState({ starEarned: false })
        answer = 'no answer'
        multiplier = 1
        this.setState({ _missed: true })
        this.setState({ sHand: 'MISSED' })
        shortHand = 'NO POINTS'
      } else {
        let _correctAns = 0
        for (let j = 0; j < item.livegameAnswers.length; j++) {
          const lga = item.livegameAnswers[j]
          if (
            (lga.answer || 'wrong').toLowerCase() ===
            (lga.correctAnswer || 'correct').toLowerCase()
          ) {
            _correctAns += 1
          }
        }

        if (_correctAns > 0) {
          this.setState({ _nopoints: false })
          this.setState({ starEarned: false })
          this.setState({ sHand: 'NO STAR' })
        } else {
          this.setState({ _nopoints: true })
          this.setState({ starEarned: false })
          this.setState({ sHand: 'NO STAR' })
        }
      }
    }

    //setTimeout(() => {
    runInAction(() => (item.shortHand = shortHand))

    if (allowResolvePopup && allowResolvePopup > 0) {
      if (!item.isLocked) {
        this.props.CommandHostStore.setLatestResolvedPlay(item)
      }
      this.updatePendingCounter()
    } else {
      if (!item.isMissedPlayHasShown) {
        //setTimeout(() => {
        runInAction(() => (item.isMissedPlayHasShown = true))
        if (!item.isLocked) {
          this.props.CommandHostStore.setLatestResolvedPlay(item)
        }
        const pendingPlayCount = this.props.PrePickStore.answers.filter(
          o => !o.ended
        ).length
        this.props.CommandHostStore.setPendingPlayCount(pendingPlayCount)
        //}, 0)
      }
    }

    /**
     * update history play on redis - pending play
     */
    if (!item.isLocked) {
      item.isLocked = true
      this.props.CommandHostStore.updateHistoryPlayToServer(item, currencies)
    }

    //agent.Storage.updateAnswer(r)
    //}, 0)
  }

  render() {
    if (!this.state.sHand || !this.state.item) {
      return <HistoryBarToggle />
    }

    console.log('>>> RESULT BAR STAR <<<')
    let {
      item,
      team,
      sHand,
      _missed,
      concatenatedAnswers,
      _nopoints,
      starEarned,
    } = this.state

    return (
      <HistoryBarToggle missed={_missed}>
        <StarHistoryLivePlayWrapper
          missed={_missed}
          nopoints={_nopoints}
          starEarned={starEarned}
          onClick={
            _missed
              ? null
              : this.handleShowDetailClick.bind(this, item.questionId)
          }
        >
          <StarInnerPanel missed={_missed} nopoints={_nopoints}>
            <StarInnerPanelLeft backgroundColor={IconsColor[item.type]}>
              <StarPanelCircle
                color={IconsColor[item.type]}
                src={Icons[item.type]}
              >
                {/*{multiplier}X*/}
              </StarPanelCircle>
            </StarInnerPanelLeft>
            <StarInnerPanelRight
              nopoints={_nopoints}
              missed={_missed}
              color={IconsColor[item.type]}
            >
              {sHand}
            </StarInnerPanelRight>
          </StarInnerPanel>
          {_missed || _nopoints ? null : (
            <Star src={StarIcon} missed={_missed} />
          )}
        </StarHistoryLivePlayWrapper>
        <HistoryBarDetail
          style={{ zIndex: 10 }}
          backgroundColor={backgroundColorLight[item.type]}
          innerRef={ref => (this[`detail-${item.questionId}`] = ref)}
        >
          <HistoryBarDetailAnswersWrapper
            nopoints={!starEarned}
            innerRef={ref =>
              (this[`detail-answer-wrapper-${item.questionId}`] = ref)
            }
          >
            <HistoryBarDetailAnswers
              innerRef={ref => (this[`detail-answer-${item.questionId}`] = ref)}
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
    )
  }
}

const HistoryBarHeight = 5.8

const HistoryBarToggle = styled.div`
  position: relative;
  height: ${props => responsiveDimension(HistoryBarHeight)};
  -webkit-filter: ${props => (props.missed ? 'grayscale(1)' : 'grayscale(0)')};
  filter: ${props => (props.missed ? 'grayscale(1)' : 'grayscale(0)')};
`

const StarHistoryLivePlayWrapper = styled.div`
  position: absolute;
  height: 100%;
  background-color: ${props => (props.starEarned ? '#eede16' : '#666666')};
  display: flex;
  width: ${props =>
    props.missed || props.nopoints
      ? responsiveDimension(23)
      : responsiveDimension(29)};
  border-radius: 0 ${props => responsiveDimension(5.5)}
    ${props => responsiveDimension(5.5)} 0;
  flex-direction: row;
  align-items: center;
`

const StarInnerPanel = styled.div`
  width: ${props => responsiveDimension(23)};
  height: ${props => responsiveDimension(HistoryBarHeight)};
  border-top-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  background-color: ${props =>
    props.missed || props.nopoints ? '#666666' : 'white'};

  display: flex;
  flex-direction: row;
`

const StarInnerPanelLeft = styled.div`
  width: ${props => responsiveDimension(10)};
  height: ${props => responsiveDimension(HistoryBarHeight)};
  border-top-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(HistoryBarHeight)};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  //background: #177fa2;
  background: ${props => props.backgroundColor};
`

const StarPanelCircle = styled.div`
  width: ${props => responsiveDimension(5.5)};
  height: ${props => responsiveDimension(5.5)};
  border-radius: ${props => responsiveDimension(5.5)};
  border: ${props => responsiveDimension(0.4)} solid ${props => props.color};
  background-color: white;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(2)};
  color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${props => responsiveDimension(0.2)};

  &:after {
    content: '';
    width: ${props => responsiveDimension(5)};
    height: ${props => responsiveDimension(5)};
    display: inline-block;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 85%;
    background-position: center;
  }
`

const StarInnerPanelRight = styled.div`
  height: 100%;
  font-family: pamainregular;
  font-size: ${props =>
    props.nopoints || props.missed
      ? responsiveDimension(3)
      : responsiveDimension(3.6)};
  color: ${props => (props.nopoints || props.missed ? '#afafaf' : props.color)};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: ${props =>
    props.nopoints
      ? responsiveDimension(2.5)
      : props.missed
      ? responsiveDimension(3.5)
      : responsiveDimension(1)};
  padding-top: ${props => responsiveDimension(0.25)};
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

const TeamWrapper = styled.div`
  margin-right: ${props => responsiveDimension(0.5)};
`

const Star = styled.span`
  width: ${props => responsiveDimension(4)};
  height: ${props => responsiveDimension(4)};
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(4)};
    height: ${props => responsiveDimension(4)};
    background-color: #1f1d1e;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: 100%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: 70%
    mask-repeat: no-repeat;
    mask-position: center;
  }
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
