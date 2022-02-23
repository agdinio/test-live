import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept, observe, action, runInAction } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TimelineMax, TweenMax, Back, Quad } from 'gsap'
import GSAP from 'react-gsap-enhancer'
import PrePick from '@/assets/images/symbol-prepick.svg'
import GameMaster from '@/assets/images/symbol-gm.svg'
import LivePlay from '@/assets/images/symbol-liveplay.svg'
import ExtraPoint from '@/assets/images/symbol-liveplay.svg'
import Summary from '@/assets/images/symbol-liveplay.svg'
import Sponsor from '@/assets/images/symbol-sponsor.svg'
import Prize from '@/assets/images/symbol-prize.svg'
import TokenIcon from '@/assets/images/playalong-token.svg'
import StarIconDark from '@/assets/images/star-icon-dark.svg'
import PendingBar from '@/Components/HistoryTracker/PendingBar'
import ResultBar from '@/Components/HistoryTracker/ResultBar'
import ResultBarStar from '@/Components/HistoryTracker/ResultBarStar'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'

const Icons = {
  PrePick,
  GameMaster,
  LivePlay,
  Sponsor,
  Prize,
  ExtraPoint,
  Summary,
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

const textColor = {
  LivePlay: '#ffffff',
  PrePick: '#2fc12f',
  GameMaster: '#ffffff',
  Sponsor: '#ffffff',
  Prize: '#ffffff',
  ExtraPoint: '#ffffff',
  Summary: '#ffffff',
  NextPlayAd: '#ffffff',
  Announce: '#ffffff',
}

const IconsColorDark = {
  Empty: '#888',
  PrePick: '#146314',
  GameMaster: '#118e82',
  LivePlay: '#601313',
  Sponsor: '#24245b',
  Prize: '#452d59',
  ExtraPoint: '#601313',
  Summary: '#601313',
  NextPlayAd: '#601313',
  Announce: '#601313',
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

@inject(
  'PrePickStore',
  'LiveGameStore',
  'ProfileStore',
  'CommandHostStore',
  'NavigationStore',
  'GameStore'
)
@observer
//@GSAP
class HistoryTracker extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false

    this.resetThisVars()

    this.reloadIntercepts()

    this.disposeIsResetDatabase = intercept(
      this.props.CommandHostStore,
      'isResetDatabase',
      change => {
        if (change.newValue) {
          this.props.CommandHostStore.resetObservables()
          this.props.PrePickStore.resetVars()
          this.props.LiveGameStore.resetVars()
          this.resetThisVars()
          this.reloadIntercepts()
        }
        return change
      }
    )
  }

  @action
  resetThisVars() {
    extendObservable(this, {
      chosen: false,
      shortHandText: '',
      preText: this.props.preText || 'Live Play',
      answers:
        this.props.PrePickStore.answers.length > 0
          ? [...this.props.PrePickStore.answers]
          : [],
      symbol: null,
      symbolIcon: this.props.symbol || 'LivePlay',
      refShortHandLabelWrapper: null,
      MasterWrapper: null,
      refSymbolWrapper: null,
      PlayImage: null,
      PlayIcon: null,
      animation: false,
      tmpAnswer: null,
      nextSymbolIcon: this.props.nextSymbol || 'LivePlay',
    })

    this.liveplayInProgress = false
    this.pageId = 0
    this.isAnsweredGameMaster = false
    this.isAnswered = false
    this.records = []
  }

  reloadIntercepts() {
    this.disposeAnswers = intercept(
      this.props.PrePickStore,
      'answers',
      change => {
        if (change.newValue) {
          this.answers = change.newValue
        }
        return change
      }
    )

    this.disposeAddedAnswer = intercept(
      this.props.PrePickStore,
      'addedAnswer',
      change => {
        if (change.newValue) {
          this.tmpAnswer = Object.assign({}, change.newValue)
          this.liveplayChangePreText(change.newValue)
          this.slideGreenShorthHand(change.newValue)
        }

        return change
      }
    )

    // this.disposeAnswers = intercept(this.props.PrePickStore.answers, change => {
    //   console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx')
    //   if (change.added[0]) {
    //     this.tmpAnswer = Object.assign({}, change.added[0])
    //     this.liveplayChangePreText(change.added[0])
    //     this.slideGreenShorthHand(change.added[0])
    //   }
    //
    //   return change
    // })

    this.disposeLockout = intercept(
      this.props.CommandHostStore,
      'lockout',
      change => {
        this.liveplayInProgress = change.newValue
        return change
      }
    )

    this.disposeResult = observe(
      this.props.CommandHostStore,
      'result',
      change => {
        if (change.newValue) {
          if (this.tmpAnswer) {
            let currentAnswer = this.props.PrePickStore.answers.filter(
              o =>
                o.questionId === this.tmpAnswer.questionId &&
                o.type === this.tmpAnswer.type
            )[0]
            if (currentAnswer) {
              currentAnswer.ended = change.newValue.ended
              this.tmpAnswer = currentAnswer
              this.tmpAnswer.correctAnswer = change.newValue.correctAnswer

              /**
               * update history play on redis - immediate result
               */
              this.props.CommandHostStore.updateHistoryPlayToServer(
                currentAnswer
              )
            }
          }
        }

        return change
      }
    )

    // intercept(this.props.CommandHostStore, 'pendingPlay', change => {
    //   if (change.newValue) {
    //     this.commandHostPending(change.newValue)
    //   }
    //   return change
    // })

    this.disposeResolve = intercept(
      this.props.CommandHostStore,
      'resolve',
      change => {
        if (change.newValue) {
          this.commandHostResolve(change.newValue)
        }
        return change
      }
    )

    this.disposeLastPlayPriorToPageReload = intercept(
      this.props.CommandHostStore,
      'lastPlayPriorToPageReload',
      change => {
        if (change.newValue) {
          const idxAnsToRemove = this.answers.findIndex(
            o => o.questionId === change.newValue.questionId
          )
          if (idxAnsToRemove > -1) {
            this.answers.splice(idxAnsToRemove, 1)
            this.tmpAnswer = JSON.parse(JSON.stringify(change.newValue))
            this.symbolIcon = change.newValue.type
          }
        }
        return change
      }
    )

    this.disposeNextPlay = observe(
      this.props.CommandHostStore,
      'nextPlay',
      change => {
        if (change.newValue) {
          this.nextSymbolIcon = change.newValue
        }
        return change
      }
    )

    this.disposeInProgress = intercept(
      this.props.LiveGameStore,
      'inProgress',
      change => {
        this.liveplayInProgress = change.newValue
        return change
      }
    )

    this.disposeIsResultShowing = intercept(
      this.props.LiveGameStore,
      'isResultsShowing',
      change => {
        /////////////////////////////this.liveplayChangeInProgress(change.newValue)
        if (!change.newValue) {
          this.props.PrePickStore.setMultiplier(0)
          this.props.PrePickStore.setIsStar(false)
        }
        return change
      }
    )

    this.disposeIsInitNextPage = intercept(
      this.props.LiveGameStore,
      'isInitNextPage',
      change => {
        if (change.newValue) {
          if (this.props.symbol !== 'PrePick') {
            //if (!this.liveplayInProgress) {
            if (!this.props.CommandHostStore.lockout) {
              if (this.pageId !== this.props.LiveGameStore.currentPageId) {
                this.pageId = this.props.LiveGameStore.currentPageId
                let refMasterWrapper = document.getElementById(
                  'historytracker-masterwrapper'
                )

                new TimelineMax({ repeat: 0 })
                  .to(refMasterWrapper, 0, {
                    opacity: 1,
                    onComplete: () => {
                      this.livegamePushAnswer()
                    },
                  })
                  .to(refMasterWrapper, 0.5, {
                    x: '-100%',
                    onComplete: () => {
                      setTimeout(() => {
                        setTimeout(() => {
                          this.props.LiveGameStore.setIsInitNextPage(false)
                        }, 0)
                        this.props.LiveGameStore.setIsNextPage(true)
                      }, 0)
                    },
                  })
                  .to(refMasterWrapper, 0.3, { x: '0%' })
              }
            }
          }
        }

        return change
      }
    )

    this.disposeIsNextPage = intercept(
      this.props.LiveGameStore,
      'isNextPage',
      change => {
        if (change.newValue) {
          if (this.props.symbol !== 'PrePick') {
            //if (!this.liveplayInProgress) {
            if (!this.props.CommandHostStore.lockout) {
              this.preText = this.props.preText || 'Live Play'
              this.symbolIcon = this.props.symbol || 'LivePlay'
              this.nextSymbolIcon = this.props.nextSymbol || 'LivePlay'
              this.isAnsweredGameMaster = false
              this.isAnswered = false
              this.props.LiveGameStore.setIsNextPage(false)
            }
          }
        }
        return change
      }
    )

    /**
     * Update [this.answers] to sync up with PrePickStore.answers
     */
    this.disposeLatestResolvedPlay = intercept(
      this.props.CommandHostStore,
      'latestResolvedPlay',
      change => {
        if (change.newValue) {
          if (this.answers && this.answers.length > 0) {
            const index = this.answers.findIndex(
              o => o.questionId === change.newValue.questionId
            )
            if (index > -1) {
              this.answers[index] = change.newValue
            }
          }
        }
        return change
      }
    )

    this.disposeResetPlayHistory = intercept(
      this.props.GameStore,
      'resetPlayHistory',
      change => {
        if (change.newValue) {
          this.chosen = false
          this.shortHandText = ''
          this.preText = 'Live Play'
          this.answers = []
          this.symbol = null
          this.symbolIcon = 'LivePlay'
          this.refShortHandLabelWrapper = null
          this.MasterWrapper = null
          this.refSymbolWrapper = null
          this.PlayImage = null
          this.PlayIcon = null
          this.animation = false
          this.tmpAnswer = null
          this.nextSymbolIcon = 'LivePlay'
        }
        return change
      }
    )
  }

  commandHostResolve(res) {
    if (!res.correctAnswers) {
      return
    }

    let currentAnswer = this.props.PrePickStore.answers.filter(
      o => o.questionId === res.id && o.type === res.type
    )[0]
    if (currentAnswer) {
      if (
        !currentAnswer.livegameAnswers ||
        currentAnswer.livegameAnswers.length < 1
      ) {
        //TODO
      }

      if (currentAnswer.isPending) {
        this.resolvePrePickStoreAnswer(res, currentAnswer).then(next => {
          if (next) {
            /**
             * modify local variable [this.answers] to reflect the changes in history
             */
            let modAnswer = this.answers.filter(
              o =>
                o.questionId === currentAnswer.questionId &&
                o.type === currentAnswer.type
            )[0]
            if (modAnswer) {
              modAnswer.ended = res.ended
              modAnswer.correctAnswer = currentAnswer.correctAnswer
              modAnswer.isPending = false
              modAnswer.length = 0
              modAnswer.shortHand = currentAnswer.shortHand

              for (let i = 0; i < modAnswer.livegameAnswers.length; i++) {
                let livegameAnswer = modAnswer.livegameAnswers[i]
                livegameAnswer.isCredited = false

                let commandHostAnswer = res.correctAnswers.filter(
                  o => o.id === livegameAnswer.id
                )[0]
                if (commandHostAnswer) {
                  livegameAnswer.correctAnswer =
                    commandHostAnswer.correctAnswer.value
                }
              }

              setTimeout(() => {
                if (this._isMounted) {
                  this.forceUpdate()
                }
              }, 0)

              // if (
              //   !modAnswer.livegameAnswers ||
              //   modAnswer.livegameAnswers.length < 1
              // ) {
              //   setTimeout(() => {
              //     if (this._isMounted) {
              //       this.forceUpdate()
              //     }
              //   }, 0)
              // } else {
              //   //agent.Storage.updateAnswer(currentAnswer)
              //   setTimeout(() => {
              //     if (this._isMounted) {
              //       this.forceUpdate()
              //     }
              //   }, 0)
              // }
            }
            /**
             * end modify local
             */
          }
        })
      }
    }
  }

  resolvePrePickStoreAnswer(res, currentAnswer) {
    return new Promise(resolve => {
      let starEarned = false

      currentAnswer.ended = res.ended
      currentAnswer.correctAnswer = res.correctAnswer
      currentAnswer.isPending = false
      currentAnswer.length = 0

      currentAnswer.livegameAnswers.forEach((livegameAnswer, idx) => {
        livegameAnswer.isCredited = false
        let commandHostAnswer = res.correctAnswers.filter(
          o => o.id === livegameAnswer.id
        )[0]
        if (commandHostAnswer) {
          livegameAnswer.correctAnswer = commandHostAnswer.correctAnswer.value

          if (idx === 0) {
            if (
              livegameAnswer.answer.trim().toLowerCase() ===
              livegameAnswer.correctAnswer.trim().toLowerCase()
            ) {
              starEarned = true
            } else {
              starEarned = false
            }
          }
        } else {
          starEarned = false
        }
      })

      return resolve(true)
    })
  }

  async livegamePushAnswer() {
    if (this.tmpAnswer) {
      //extra points
      if (
        this.tmpAnswer.type === 'ExtraPoint' &&
        this.tmpAnswer.answer === this.tmpAnswer.correctAnswer
      ) {
        this.props.ProfileStore.creditCurrencies({
          currency: 'points',
          amount: this.tmpAnswer.extraPoints,
        })
      }

      //stars
      /*
      if (this.tmpAnswer.stars && this.tmpAnswer.stars > 0) {
        for (let i = 0; i < this.tmpAnswer.livegameAnswers.length; i++) {
          let item = this.tmpAnswer.livegameAnswers[i]
          if (item.answer === item.correctAnswer) {
            this.props.ProfileStore.creditCurrencies({
              currency: 'stars',
              amount: item.stars,
            })
          }
        }
      }
*/

      if (!this.answerExists(this.tmpAnswer.questionId)) {
        if (this.props.CommandHostStore.pendingPlay) {
          this.tmpAnswer.length = await 999
          this.tmpAnswer.isPending = await true
        }

        this.tmpAnswer.isHistory = await true

        this.answers.push(Object.assign({}, this.tmpAnswer))
        this.updatePendingCounter()
        //agent.Storage.updateAnswer(this.tmpAnswer)
        this.scrollLatestHistoryBarToTop()

        setTimeout(() => {
          this.tmpAnswer = null
        }, 0)
      }
    }
  }

  scrollLatestHistoryBarToTop() {
    if (this.HWScrollingRef && this.HWRef) {
      setTimeout(() => {
        TweenMax.to(this.HWScrollingRef, 0.5, {
          scrollTop: this.HWRef.offsetTop,
        })
      }, 500)
    }
  }

  updatePendingCounter() {
    const pendingPlayCount = this.answers.filter(o => !o.ended).length
    this.props.CommandHostStore.setPendingPlayCount(pendingPlayCount)
  }

  answerExists(id) {
    return this.answers.filter(o => o.questionId === id)[0]
  }

  togglePreText = () => {
    setTimeout(() => {
      if (!this.liveplayInProgress) {
        if (this.props.preText) {
          this.preText = this.props.preText
        }
      }
      this.symbolIcon = this.props.symbol
      this.nextSymbolIcon = this.props.nextSymbol
    }, 1000)
  }

  liveplayChangePreText(answer) {
    if (this.props.symbol !== 'PrePick') {
      if (answer.multiplier <= 0) {
        //setTimeout(() => {
        if (this.props.CommandHostStore.isPending) {
          this.preText = 'PENDING'
        } else {
          this.preText = 'NO POINTS'
        }
        if (this.LivePlayText) {
          TweenMax.set(this.LivePlayText, {
            fontSize: responsiveDimension(3.5),
          })
        }
        //}, 0)
      } else {
        if (this.symbolIcon !== 'LivePlay') {
          this.isAnsweredGameMaster = true
          this.preText =
            answer.type === 'Prize' || answer.type === 'ExtraPoint'
              ? answer.shortHand
              : '+' + answer.shortHand
          if (this.ActiveWrapper) {
            TweenMax.to(this.ActiveWrapper, 0.3, { width: '60%' })
          }
        }
      }
    }
  }

  /*
  liveplayChangeInProgress(isResultsShowing) {
    debugger
    if (!isResultsShowing) {
      setTimeout(() => {
        this.answers.push(this.tmpAnswer)
        setTimeout(() => {
          this.tmpAnswer = null
          this.props.PrePickStore.setMultiplier(0)
        }, 0)
      }, 500)
    }

  }
*/

  slideGreenShorthHand(answer) {
    if (answer.type === 'PrePick') {
      if (this.refShortHandLabelWrapper) {
        this.animation = true
        TweenMax.to(this.refShortHandLabelWrapper, 0.5, {
          delay: 0.2,
          width: '65%',
          ease: Back.easeOut.config(2),
          onStart: this.updateActiveBarText.bind(this),
          onComplete: () => {
            this.renderActivePlayState(answer)
          },
        })
      } else {
        this.answers.push(answer)
      }
    } else if (
      answer.type === 'GameMaster' ||
      answer.type === 'Sponsor' ||
      answer.type === 'Prize' ||
      answer.type === 'ExtraPoint'
    ) {
      if (answer.livegameAnswers.length > 0) {
      } else {
        /*
        this.answers.push(answer)
        setTimeout(() => {
          this.tmpAnswer = null
          this.props.PrePickStore.multiplier = 0
        }, 0)
*/
      }
    }
  }

  updateActiveBarText() {
    const current = this.props.PrePickStore.answers.reverse()[0]
    this.shortHandText = current.shortHand
    this.preText = current.answer
  }

  /*
  resetActiveBarText() {
    this.shortHandText = ''
    this.preText = this.props.preText || 'PRE PICK'
    this.animation = false
    TweenMax.set(this.PlayImage, {
      attr: { src: IconsWhite[this.symbolIcon] },
    })
  }
*/

  renderActivePlayState(answer) {
    if (answer.type === 'PrePick') {
      // TweenMax.set(this.PlayImage, {
      //   animationPlayState: 'paused',
      //   attr: { src: Icons[this.symbolIcon] },
      // })

      TweenMax.to(this.refShortHandLabelWrapper, 0.5, {
        width: '65%',
      })

      // TweenMax.to(this.refNexPlayType, 0.5, {
      //   animationPlayState: 'paused',
      //   width: '20%',
      // })

      // TweenMax.to(this.PlayIcon, 0.5, {
      //   backgroundColor: 'white',
      //   //scale: 1.4,
      //   rotation: 390,
      //   //x: '-20%',
      //   //y: '20%',
      // })

      TweenMax.set(this.refSymbolWrapper, { display: 'none' })
      TweenMax.to(this.ActiveWrapper, 0.5, { width: '100%' })
      TweenMax.to(this.MasterWrapper, 0.5, {
        x: '-100%',
        borderTopRightRadius: responsiveDimension(5.5),
        borderBottomRightRadius: responsiveDimension(5.5),
        //height: responsiveDimension(5.5),
        opacity: 0.8,
        onComplete: () => {
          if (this.props.mode === 'live') {
            this.answers.push(answer)
          }
          //  this.resetActiveBarText()
        },
      })
    } else {
      TweenMax.set(this.refSymbolWrapper, { display: 'none' })
      TweenMax.to(this.ActiveWrapper, 0.5, { width: '100%' })
      TweenMax.to(this.MasterWrapper, 0.5, {
        x: '-100%',
        borderTopRightRadius: responsiveDimension(5.5),
        borderBottomRightRadius: responsiveDimension(5.5),
        //height: responsiveDimension(5.5),
        opacity: 0.8,
        onComplete: () => {
          if (this.props.mode === 'live') {
            this.answers.push(answer)
          }
        },
      })
    }
  }

  handleActivePlayTextClick() {
    if (this.ActiveWrapper && this.LivePlayText) {
      const w = this.ActiveWrapper.offsetWidth
      new TimelineMax({ repeat: 0 })
        .set(this.LivePlayText, { x: '110%' })
        .to(this.LivePlayText, 3, { x: '0%', delay: 0.3 })
    }
  }

  componentWillUnmount() {
    this.disposeIsResetDatabase()
    this.disposeAnswers()
    this.disposeAddedAnswer()
    this.disposeLockout()
    this.disposeResolve()
    this.disposeLastPlayPriorToPageReload()
    this.disposeInProgress()
    this.disposeIsResultShowing()
    this.disposeIsInitNextPage()
    this.disposeIsNextPage()
    this.disposeResult()
    this.disposeNextPlay()
    this.disposeLatestResolvedPlay()
    this.disposeResetPlayHistory()

    this._isMounted = false
  }

  componentDidMount() {
    if (this.symbol) {
      const symbolAnimation = () => {
        return new TimelineMax({ repeat: -1 }).to(this.symbol, 1.5, {
          rotation: 360,
          ease: Back.easeOut.config(1.75),
        })
      }
      this.addAnimation(symbolAnimation)
    }

    // if (this.props.PrePickStore.answers.length) {
    //   this.answers = [...this.props.PrePickStore.answers]
    // }

    if (this.refNexPlayType) {
      TweenMax.fromTo(
        this.refNexPlayType,
        0.5,
        {
          width: '0%',
          border: 'none',
          borderWidth: 0,
        },
        {
          ease: Back.easeOut.config(2),
          width: '25%',
          borderWidth: responsiveDimension(0.3),
        }
      )
    }

    if (this.MasterWrapper) {
      TweenMax.fromTo(
        this.MasterWrapper,
        0.5,
        {
          width: '50%',
        },
        {
          width: '100%',
          ease: Back.easeOut.config(1),
        }
      )
    }

    if (this[`recordwrapper-0`]) {
      TweenMax.fromTo(
        this[`recordwrapper-0`],
        0.3,
        {
          width: '0%',
        },
        {
          width: '100%',
        }
      )
    }

    this.updatePendingCounter()
    this._isMounted = true
  }

  renderAnsweredPrepickBar(r) {
    return (
      <PrepickResponseWrapper color={IconsColor[r.type]}>
        <PrepickShortHand color={IconsColor[r.type]}>
          {r.shortHand}
        </PrepickShortHand>
        <PrepickResponseText>{r.answer}</PrepickResponseText>
      </PrepickResponseWrapper>
    )
  }

  renderAnsweredBar(r) {
    if (r.length && r.length > 0) {
      return <PendingBar r={r} key={r.questionId} />
    }

    if (r.stars > 0 || r.isStar) {
      return <ResultBarStar questionId={r.questionId} key={r.questionId} />
      // if ((r.livegameAnswers && r.livegameAnswers.length > 0) && (r.livegameAnswers.length >= r.stars)) {
      //   return (<ResultBarStar questionId={r.questionId} key={r.questionId} />)
      // } else {
      //   return (<ResultBar questionId={r.questionId} key={r.questionId} />)
      // }
    } else {
      return <ResultBar questionId={r.questionId} key={r.questionId} />
    }
  }

  renderMultier() {
    const multiplier = []

    if (this.symbolIcon === 'LivePlay') {
      for (var i = 0; i < this.props.PrePickStore.multiplier; i++) {
        let isStar = false
        let ans = null
        if (this.tmpAnswer) {
          ans = this.tmpAnswer.livegameAnswers[i]
        } else {
          ans = this.props.LiveGameStore.livegameAnswers[i]
        }
        if (ans) {
          isStar = ans.stars && ans.stars > 0 ? true : false
        }

        multiplier.push(
          <MultiplierNumber
            i={i}
            length={this.props.PrePickStore.multiplier}
            key={`multiplier-${i}`}
            textColor={isStar ? '#eede16' : '#ffffff'}
            color={isStar ? '#eede16' : backgroundColorLight[this.symbolIcon]}
            innerRef={c => (this.refMultiplierNumber = c)}
          >
            {i + 1}X
          </MultiplierNumber>
        )
      }
    }

    return multiplier
  }

  renderMultierHistory(r) {
    const multiplier = []
    let amt = 0

    for (var i = 0; i < r.livegameAnswers.length; i++) {
      let isStar =
        r.livegameAnswers[i].stars && r.livegameAnswers[i].stars > 0
          ? true
          : false

      let livegameAnswer = r.livegameAnswers[i]
      let correctAnswer = livegameAnswer.correctAnswer
        ? livegameAnswer.correctAnswer.trim().toLowerCase()
        : ''
      let correct = livegameAnswer.answer.trim().toLowerCase() === correctAnswer
      multiplier.push(
        <MultiplierNumber
          i={i}
          length={r.multiplier}
          key={`multiplier-${r.questionId}-${i}`}
          //color={correct ? backgroundColorLight[r.type] : '#7d7d7d'}
          color={
            correct
              ? isStar
                ? '#eede16'
                : backgroundColorLight[r.type]
              : '#7d7d7d'
          }
          backgroundColor={
            correct ? (isStar ? '#000000' : '#000000') : '#4f4f4f'
          }
        >
          <div
            style={{
              color: correct ? (isStar ? '#eede16' : '#ffffff') : '#7d7d7d',
            }}
          >
            {i + 1}X
          </div>
        </MultiplierNumber>
      )
    }

    return multiplier
  }

  renderLivePlaySymbol() {
    let activeBarText = ''
    let activePoints = 0
    let activeTimes = 0
    let activeStar = 0

    if (this.tmpAnswer) {
      /** 1 **/
      for (let i = 0; i < this.tmpAnswer.livegameAnswers.length; i++) {
        activeBarText += this.tmpAnswer.livegameAnswers[i].answer + ', '
      }
      if (activeBarText) {
        this.isAnswered = true
        activeBarText = activeBarText.slice(0, -2)
      } else {
        this.isAnswered = false
        activeBarText = this.preText
        activeTimes = 0
      }

      if (this.tmpAnswer.type === 'Sponsor') {
        activePoints =
          this.tmpAnswer.livegameAnswers.length > 0
            ? this.tmpAnswer.livegameAnswers[0].tokens
            : 0
      } else if (this.tmpAnswer.type === 'Prize') {
        activeStar =
          this.tmpAnswer.livegameAnswers.length > 0 &&
          this.tmpAnswer.livegameAnswers[0].stars
            ? this.tmpAnswer.livegameAnswers[0].stars
            : 0
      } else {
        activePoints =
          this.props.PrePickStore.multiplier > 0
            ? this.props.PrePickStore.multiplier *
              (this.tmpAnswer.feeCounterValue *
                this.props.LiveGameStore.timesValuePerFee)
            : 0

        activeTimes = this.props.LiveGameStore.livegameAnswers.length || 0
      }

      this.updatePendingCounter()
      /** 1 **/
    } else {
      /** 2 **/
      /**
       * if play has a multiplier that has not yet been completely answered
       */
      if (
        this.props.LiveGameStore.livegameAnswers &&
        this.props.LiveGameStore.livegameAnswers.length > 0
      ) {
        for (
          let i = 0;
          i < this.props.LiveGameStore.livegameAnswers.length;
          i++
        ) {
          activePoints +=
            this.props.LiveGameStore.livegameAnswers[i].feeCounterValue *
            this.props.LiveGameStore.timesValuePerFee
          activeBarText +=
            this.props.LiveGameStore.livegameAnswers[i].answer + ', '
          activeTimes += 1
        }
        if (activeBarText) {
          this.isAnswered = true
          activeBarText = activeBarText.slice(0, -2)
        } else {
          this.isAnswered = false
          activeBarText = this.preText
          activeTimes = 0
        }
      } else {
        this.isAnswered = false
        activeBarText = this.preText
        activeTimes = 0
      }
      /** 2 **/
    }

    const symbolContainerBG =
      this.symbolIcon === 'Prize' && activeStar > 0 ? '#eedf17' : '#000000'

    return (
      <MasterWrapperOuter>
        <MasterWrapper
          maxWidth={!!this.props.PrePickStore.multiplier}
          innerRef={ref => (this.MasterWrapper = ref)}
          noPoint={this.preText}
          id="historytracker-masterwrapper"
        >
          <SymbolContainer
            dark={symbolContainerBG}
            color={IconsColor[this.symbolIcon]}
            innerRef={ref => (this.SymbolContainer = ref)}
          >
            <ActiveWrapper
              color={backgroundColorLight[this.symbolIcon]}
              innerRef={ref => (this.ActiveWrapper = ref)}
              isAnsweredGameMaster={this.isAnsweredGameMaster}
              isAnswered={this.isAnswered}
              onClick={
                activePoints || activeStar
                  ? this.handleActivePlayTextClick.bind(this)
                  : null
              }
            >
              <LivePlayText
                type={this.symbolIcon}
                color={textColor[this.symbolIcon]}
                innerRef={ref => (this.LivePlayText = ref)}
                isAnsweredGameMaster={this.isAnsweredGameMaster}
              >
                {activeBarText}
              </LivePlayText>
            </ActiveWrapper>
            {this.tmpAnswer && this.tmpAnswer.type === 'Sponsor' ? (
              <SponsorActiveTokensWrapper>
                <ActivePoints color={'#ffb600'}>
                  {activePoints || ''}
                </ActivePoints>
                <TokenWrapper>
                  <Token src={TokenIcon} size={2.5} index={3} />
                  <Faded index={2} size={2.5} color={'#6d6c71'} left={-2.2} />
                  <Faded index={1} size={2.5} color={'#33342f'} left={-2.2} />
                </TokenWrapper>
              </SponsorActiveTokensWrapper>
            ) : this.tmpAnswer && this.tmpAnswer.type === 'Prize' ? (
              <PrizeActiveWrapper>
                <PrizeActiveText>STAR</PrizeActiveText>
                <PrizeActiveStarImage src={StarIconDark} />
              </PrizeActiveWrapper>
            ) : (
              <ActivePoints>{activePoints || ''}</ActivePoints>
            )}
            <SymbolWrapper innerRef={ref => (this.refSymbolWrapper = ref)}>
              {activeTimes > 1 ? (
                <ActivePlayTimes color={IconsColor[this.symbolIcon]}>
                  {activeTimes}x
                </ActivePlayTimes>
              ) : (
                <ActivePlaySymbolImg
                  //innerRef={ref => (this.symbol = ref)}
                  src={Icons[this.symbolIcon]}
                />
              )}
            </SymbolWrapper>
          </SymbolContainer>
        </MasterWrapper>
      </MasterWrapperOuter>
    )
  }

  renderPrePickSymbol() {
    return (
      <MasterWrapperOuter prepick>
        <MasterWrapper
          maxWidth={!!this.props.PrePickStore.multiplier}
          innerRef={ref => (this.MasterWrapper = ref)}
          id="historytracker-masterwrapper"
        >
          <SymbolContainer
            dark={IconsColorDark[this.symbolIcon]}
            color={IconsColor[this.symbolIcon]}
            innerRef={ref => (this.SymbolContainer = ref)}
          >
            <PrepickActiveWrapper
              backgroundColor={backgroundColorLight[this.symbolIcon]}
              innerRef={ref => (this.ActiveWrapper = ref)}
            >
              <ShortHandWrapper
                color={IconsColor[this.symbolIcon]}
                innerRef={ref => (this.refShortHandLabelWrapper = ref)}
              >
                <ShortHandLabel>{this.shortHandText}</ShortHandLabel>
              </ShortHandWrapper>
              <PrePickNumberWrapper>
                <PrePickNumber color={IconsColor[this.symbolIcon]}>
                  {this.props.PrePickStore.currentPrePick}
                </PrePickNumber>
              </PrePickNumberWrapper>
              <PrePickText color={textColor[this.symbolIcon]}>
                {this.preText}
              </PrePickText>
            </PrepickActiveWrapper>
            {/*
            <ActiveWrapper
              color={backgroundColorLight[this.symbolIcon]}
              innerRef={ref => (this.ActiveWrapper = ref)}
            >
            </ActiveWrapper>
*/}
            <SymbolWrapper innerRef={ref => (this.refSymbolWrapper = ref)}>
              <ActivePlaySymbolImg
                //innerRef={ref => (this.symbol = ref)}
                src={Icons[this.symbolIcon]}
              />
            </SymbolWrapper>
          </SymbolContainer>
        </MasterWrapper>
      </MasterWrapperOuter>
    )
  }

  render() {
    /*
    if (!this.props.ProfileStore.profile.userName) {
      return (
        <HistoryContainer ref={ref => {this.body = ref}} />
      )
    }
*/

    let historyAnswers = []
    if (this.props.filter === 'pending') {
      //historyAnswers = [...this.answers.filter(o => o.length > 0 || o.isPending)]
      historyAnswers = this.answers.filter(o => !o.ended)
      //historyAnswers = this.props.pendingPlays
    } else {
      //historyAnswers = [...this.answers]
      //historyAnswers = JSON.parse(JSON.stringify(this.answers))
      //historyAnswers = this.props.PrePickStore.answers
      historyAnswers = this.answers
    }

    return (
      <HistoryContainer
        ref={ref => {
          this.body = ref
        }}
      >
        {this.props.mode === 'live'
          ? this.props.filter === 'pending'
            ? null
            : this.renderLivePlaySymbol()
          : this.renderPrePickSymbol()}

        <HWScrolling innerRef={ref => (this.HWScrollingRef = ref)}>
          <HW innerRef={ref => (this.HWRef = ref)}>
            {historyAnswers.reverse().map((r, i) => {
              return (
                <RecordWrapper
                  key={`answer-${r.questionId}`}
                  innerRef={ref => (this[`recordwrapper-${i}`] = ref)}
                >
                  {'prepick' === r.type.toLowerCase()
                    ? this.renderAnsweredPrepickBar(r)
                    : this.renderAnsweredBar(r)}
                </RecordWrapper>
              )
            })}
          </HW>

          {/*
          <HW >
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r, i) => {
                return (<RecordWrapper style={{backgroundColor:'green'}} key={i} innerRef={ref => (this[`recordwrapper-${i}`] = ref)}>{r}</RecordWrapper>)
              })
            }
          </HW>
*/}
        </HWScrolling>
      </HistoryContainer>
    )
  }
}

let MultiplierNumber = styled.div`
  position: absolute;
  height: 100%;
  width: ${props => responsiveDimension((props.i + 1) * 5)};
  z-index: ${props => props.length - props.i};
  background-color: ${props => props.backgroundColor || 'black'};
  border-bottom-right-radius: ${props => responsiveDimension(6)};
  border-top-right-radius: ${props => responsiveDimension(6)};
  color: ${props => props.textColor};
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
  animation: 0.45s ${keyframes`0%{left:-100%}100%{left:0;}`} forwards
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  align-items: center;
  border-right: ${props => responsiveDimension(0.3)} solid
    ${props => props.color || 'white'};
  border-top: ${props => responsiveDimension(0.3)} solid
    ${props => props.color || 'white'};
  border-bottom: ${props => responsiveDimension(0.3)} solid
    ${props => props.color || 'white'};
`

let HistoryContainer = styled.ul`
  padding: 0;
  width: 58%;
  font-family: pamainregular;
  z-index: 0;
`

const ActivePlayHeight = 7

let MasterWrapperOuter = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(ActivePlayHeight)};
  margin-top: ${props => vhToPx(props.prepick ? 4 : 2)};
  margin-bottom: ${props => vhToPx(1.3)};
`
let MasterWrapper = styled.li`
  width: 100%;
  height: ${props => responsiveDimension(ActivePlayHeight)};
  overflow: hidden;
  opacity: 1;
  display: flex;

  filter: ${props =>
    props.noPoint === 'NO POINTS' ? `grayscale(1)` : `grayscale(0)`};
`

let PrePickNumberWrapper = styled.div`
  margin-left: 7%;
`

let PrePickNumber = styled.div`
  background-color: ${props => props.color};
  width: ${props => responsiveDimension(3)};
  height: ${props => responsiveDimension(3)};
  border-radius: 50%;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(2)};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4%;
`

let PrePickText = styled.div`
  color: ${props => props.color};
  font-size: ${props => responsiveDimension(2.2)};
  text-transform: uppercase;
  margin-right: ${props => responsiveDimension(2.5)};
`

let LivePlayText = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.7)};
  color: ${props => props.color};
  text-transform: uppercase;
  letter-spacing: ${props => responsiveDimension(0.1)};
  margin-right: ${props => responsiveDimension(2.5)};
  padding-top: ${props => responsiveDimension(0.25)};
  white-space: nowrap;
`

let SymbolContainer = styled.div`
  width: 100%;
  background-color: ${props => props.dark};
  border-radius: 0 ${props => responsiveDimension(ActivePlayHeight)}
    ${props => responsiveDimension(ActivePlayHeight)} 0;
  border-top: ${props => responsiveDimension(0.3)} solid ${props => props.color};
  border-right: ${props => responsiveDimension(0.3)} solid
    ${props => props.color};
  border-bottom: ${props => responsiveDimension(0.3)} solid
    ${props => props.color};
  display: flex;
  z-index: 3;
  opacity: 1;
  justify-content: space-between;
  align-items: center;
`

let SymbolWrapper = styled.div`
  background-color: white;
  border-radius: 50%;
  height: ${props => responsiveDimension(ActivePlayHeight * 0.85)};
  width: ${props => responsiveDimension(ActivePlayHeight * 0.85)};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => responsiveDimension(0.1)};
`

const ActivePlaySymbolImg = styled.img`
  height: 80%;
  ${props => (props.isEmpty ? 'width:80%;' : '')};
  animation: ${props => rotateSymbol} 1.5s infinite forwards ease-out;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
`

const rotateSymbol = keyframes`
  0%{transform: rotate(0deg);}
  45%{transform: rotate(420deg);}
  100%{transform: rotate(360deg);}
`

const ActivePlayTimes = styled.div`
  width: ${props => responsiveDimension(ActivePlayHeight * 0.85)};
  height: ${props => responsiveDimension(ActivePlayHeight * 0.85)};
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.color || '#c61818'};
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(ActivePlayHeight * 0.5)};
  text-transform: uppercase;
  margin-right: ${props => responsiveDimension(0.5)};
`

const PrepickActiveWrapper = styled.div`
  position: relative;
  display: flex;
  width: 81%;
  height: ${props => responsiveDimension(ActivePlayHeight)};
  opacity: 1;
  z-index: 5;
  border-radius: 0 ${props => responsiveDimension(ActivePlayHeight)}
    ${props => responsiveDimension(ActivePlayHeight)} 0;
  background-color: ${props => props.backgroundColor || '#ffffff'};
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
`

let ActiveWrapper = styled.div`
  position: relative;
  display: flex;
  width: ${props => (props.isAnswered ? 58 : 81)}%;
  height: ${props => responsiveDimension(ActivePlayHeight)};
  opacity: 1;
  z-index: 5;
  border-radius: 0 ${props => responsiveDimension(ActivePlayHeight)}
    ${props => responsiveDimension(ActivePlayHeight)} 0;
  background-color: ${props => props.color || '#ffffff'};
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
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
      : responsiveDimension(props.size)}
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
`

const PrizeActiveWrapper = styled.div`
  height: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PrizeActiveText = styled.div`
  height: ${props => responsiveDimension(ActivePlayHeight)};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.3)};
  color: #231f20;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${props => responsiveDimension(0.4)};
  padding-right: ${props => responsiveDimension(0.5)};
`

const PrizeActiveStarImage = styled.img`
  height: ${props => responsiveDimension(ActivePlayHeight * 0.4)};
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
let ShortHandWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 0;
  height: inherit;
  border-radius: 0 ${props => responsiveDimension(ActivePlayHeight)}
    ${props => responsiveDimension(ActivePlayHeight)} 0;
  background: ${props => props.color};
`
let ShortHandLabel = styled.span`
  display: flex;
  margin-right: ${props => responsiveDimension(2.5)};
  color: #ffffff;
  font-size: ${props => responsiveDimension(2.2)};
  text-transform: uppercase;
`
let HWScrolling = styled.div`
  position: relative;
  height: ${props => vhToPx(25)};
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 1;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 ${props => responsiveDimension(0)}
      rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar {
    width: 0;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ff0000;
  }
`
const HW = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const HistoryBarHeight = 5.8
let RecordWrapper = styled.div`
  height: ${props => responsiveDimension(HistoryBarHeight)};
  margin-bottom: ${props => vhToPx(0.4)};
  display: flex;
  text-align: right;
  //overflow-y:hidden;
`

const PlayImage = styled.img`
  animation: ${props => symbolpulse} infinite 0.5s ease alternate;
  position: absolute;
  animation-play-state: running;
  width: inherit;
  height: inherit;
  transform-origin: center;
  transform: scale(1);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  margin-left: ${props => responsiveDimension(0.02)};
  padding: ${props => responsiveDimension(0.4)};
`

const PlayIcon = styled.div`
  //----position: absolute;
  width: ${props => responsiveDimension(3.8)};
  height: ${props => responsiveDimension(3.8)};
  overflow: hidden;
  border-radius: 50%;
  background-color: ${props => props.backgroundColor};
`

const symbolpulse = keyframes`
  0% {transform:scale(1);}
  100% {transform:scale(0.7);}
`
const bgbar = keyframes`
  0% {}
  100% {background-color: #000000;}
`
const borderbar = keyframes`
  0% {}
  100% {border-color:#000000;}
`
const barin = keyframes`
  0% {}
  100% {left:0;}
`

const PrepickResponseWrapper = styled.div`
  height: 100%;
  background-color: ${props =>
    props.isEmpty
      ? '#c1c1c1; filter: grayscale(100%);'
      : props.backgroundColor || '#ffffff'};
  color: ${props => props.color};
  width: ${props => (props.isEmpty ? 55 : 80)}%;
  border-radius: 0 ${props => responsiveDimension(6)}
    ${props => responsiveDimension(6)} 0;
  display: flex;
  justify-content: space-between;
  opacity: 0.6;
  ${props =>
    props.isEmpty
      ? `border-top: ${responsiveDimension(0.2)} solid #888888;
            border-right: ${responsiveDimension(0.2)} solid #888888;
            border-bottom: ${responsiveDimension(0.2)} solid #888888;`
      : props.gms
      ? `border-top: ${responsiveDimension(0.2)} solid ${props.color};
          border-right: ${responsiveDimension(0.2)} solid ${props.color};
          border-bottom: ${responsiveDimension(0.2)} solid ${props.color};`
      : ''};
`

const PrepickResponseText = styled.div`
  font-size: ${props => responsiveDimension(1.9)};
  align-items: center;
  width: 40%;
  justify-content: flex-end;
  display: flex;
  text-transform: uppercase;
  padding-right: ${props => responsiveDimension(2)};
`

const PrepickShortHand = styled.div`
  font-size: ${props => (props.isEmpty ? responsiveDimension(3) : 1.9)};
  background-color: ${props => props.color};
  ${props =>
    props.isEmpty
      ? `margin-right:0.8vh;text-transform:uppercase; width: 75%;`
      : `width: 65%;`} height: 100%;
  border-radius: 0 ${props => responsiveDimension(6)}
    ${props => responsiveDimension(6)} 0;
  color: white;
  display: flex;
  align-items: center;
  padding-top: ${props => responsiveDimension(0.25)};
  ${props =>
    props.isEmpty
      ? `justify-content:center;`
      : props.isGameMaster
      ? `justify-content: space-between; padding-right:${props =>
          responsiveDimension(0.2)};`
      : `justify-content:flex-end; padding-right:${props =>
          responsiveDimension(2)};`};
`

export default GSAP()(HistoryTracker)
