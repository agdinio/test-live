import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject, Provider } from 'mobx-react'
import { extendObservable, intercept, observe, runInAction } from 'mobx'
import styled from 'styled-components'
import CommandHostStore from '@/stores/CommandHostStore'
import NextPlay from '@/Components/LiveGame/NextPlay'
import ExplainationScreen from '@/Components/LiveGame/ExplainationScreen'
import PlayInProgress from '@/Components/LiveGame/Common/PlayInProgress'
import NextPlayAd from '@/Components/LiveGame/Common/NextPlayAd'
import GetReady from '@/Components/LiveGame/GetReady'
import GameMasterQuestion from '@/Components/LiveGame/GameMaster'
import MultiplierQuestion from '@/Components/LiveGame/MultiplierQuestion'
import Lockout from '@/Components/LiveGame/Common/Lockout'
import GameEnded from '@/Components/LiveGame/Common/GameEnded'
import SponsorQuestion from '@/Components/LiveGame/Sponsor'
import AdvertisementQuestion from '@/Components/LiveGame/Advertisement'
import Kickoff from '@/Components/LiveGame/Kickoff'
import MultiplyPoints from '@/Components/LiveGame/Common/MultiplyPoints'
import Results from '@/Components/LiveGame/Results/index'
import Waiting from '@/Components/LiveGame/Results/Waiting'
import ExtraPointQuestion from '@/Components/LiveGame/ExtraPoint'
import Summary from '@/Components/LiveGame/Summary'
import Announce from '@/Components/LiveGame/Common/Announce'
import Pending from '@/Components/LiveGame/Common/Pending'
import Standby from '@/Components/LiveGame/Common/Standby'
import PostGame from '@/Components/LiveGame/Common/PostGame'
import { evalImage, dateTimeZone } from '@/utils'
import agent from '@/Agent'

@inject(
  'ProfileStore',
  'PrePickStore',
  'LiveGameStore',
  'NavigationStore',
  'CommandHostStore',
  'PlayStore'
)
@observer
export default class LiveGameQuestions extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      action: true,
      Lockout: false,
      lockoutHeaderText: '',
      lockoutDetailText: '',
      currentScreen: undefined,
      LockoutPlayInProgress: false,
      LockoutMultiply: false,
      answerNextId: 0,
      isNextPlay: false,
      isRunningLengthZero: false,
    })

    this.lockRunningLengthCountdown = false
    this.pageId = 0
    this.pageIdAnalytic = 0
    this.answers = []

    this.screens = {
      ExplainationScreen,
      NextPlay,
      GetReady,
      GameMasterQuestion,
      SponsorQuestion,
      AdvertisementQuestion,
      MultiplierQuestion,
      Kickoff,
      ExtraPointQuestion,
      GameEnded,
      Summary,
      NextPlayAd,
      Announce,
      Standby,
      PostGame,
    }

    /*
    intercept(this.props.LiveGameStore, 'inProgress', change => {
      this.MonitorPlayInProgress(change.newValue)
      return change
    })
*/

    /*
    intercept(this.props.CommandHostStore, 'lockout', change => {
      if (change.newValue) {
        this.commandHostLockout()
      } else {
        this.commandHostActivePlay()
      }
      return change
    })
*/

    /*
    observe(this.props.CommandHostStore.activePlay, 'id', change => {
      debugger
      if (change.newValue) {
        setTimeout(() => {
          this.commandHostActivePlay()
        }, 0)
      }
      return change
    })
*/

    this.disposeCurrentPlay = observe(
      this.props.CommandHostStore,
      'currentPlay',
      change => {
        if (change.newValue) {
          if (!this.answerStillExistsAfterPageReload(change.newValue.id)) {
            setTimeout(() => {
              this.commandHostActivePlay()
            }, 0)
          }
        }
        return change
      }
    )

    this.disposeWaitingResult = observe(
      this.props.CommandHostStore,
      'waitingResult',
      change => {
        if (change.newValue) {
          this.commandHostWaitingResult()
        }
        return change
      }
    )

    this.disposeResult = intercept(
      this.props.CommandHostStore,
      'result',
      change => {
        if (change.newValue) {
          this.commandHostResult(change.newValue)
          // setTimeout(() => {
          //   this.commandHostResult(change.newValue)
          // }, 0)
        }
        return change
      }
    )

    this.disposeIsPending = intercept(
      this.props.CommandHostStore,
      'isPending',
      change => {
        if (change.newValue) {
          this.renderPending(null)
        }
        return change
      }
    )

    this.disposeCurrentMultiplierPlayReload = intercept(
      this.props.CommandHostStore,
      'currentMultiplierPlayReload',
      change => {
        if (change.newValue) {
          this.currentScreen = change.newValue
        }
        return change
      }
    )
  }

  getType(cur) {
    if (!cur) {
      return 'LivePlay'
    }
    switch (cur.componentName) {
      case 'GameMasterQuestion':
        return 'GameMaster'
      default:
        return 'LivePlay'
    }
  }

  answerStillExistsAfterPageReload(newPlayId) {
    let ppAnswerExists = this.props.PrePickStore.answers.filter(
      o => o.questionId === newPlayId
    )[0]
    if (ppAnswerExists) {
      /**
       * if current play in the host command is available, and
       * current play in the game app is answered and in-progress
       */
      ppAnswerExists.isPending = true
      ppAnswerExists.length = 999
      const bgColor = this.props.CommandHostStore.getBackgroundColorByType(
        ppAnswerExists.type
      )
      setTimeout(() => {
        this.currentScreen = null
      }, 0)
      this.renderPlayInProgress(null, null, bgColor, null, null)
      this.props.PrePickStore.setMultiplier(
        ppAnswerExists.livegameAnswers.length
      )
      this.props.LiveGameStore.setFeeCounterValue(
        ppAnswerExists.feeCounterValue
      )
      this.props.CommandHostStore.setLastPlayPriorToPageReload(ppAnswerExists)

      return true
    } else {
      /*
    // COMMENTED BY: AURELIO
    // COMMENTED ON: 06-17-2021
      if (
        this.props.PrePickStore.answers &&
        this.props.PrePickStore.answers.length > 0
      ) {
        // ppAnswerExists = this.props.PrePickStore.answers.reduce(
        //   (prev, current) => (prev.started > current.started ? prev : current)
        // )
        ppAnswerExists = this.props.PrePickStore.answers.reduce(
          (prev, current) => {
            const prevStarted = new Date(dateTimeZone(prev.started) || null)
            const currStarted = new Date(dateTimeZone(current.started) || null)
            return prevStarted.getTime() > currStarted.getTime()
              ? prev
              : current
          }
        )

        if (ppAnswerExists) {
          this.props.CommandHostStore.setLastPlayPriorToPageReload(
            ppAnswerExists
          )

          return false
        } else {
          return false
        }
      } else {
        return false
      }
*/
      this.props.CommandHostStore.setLastPlayPriorToPageReload(null)
    }
  }

  commandHostActivePlay() {
    this.props.LiveGameStore.resetLivegameAnswers()
    this.props.CommandHostStore.setWaitingResult(false)
    this.props.PrePickStore.setMultiplier(0)
    this.props.CommandHostStore.setCurrentMultiplierPlay(null)
    this.props.CommandHostStore.setCurrentMultiplierPlayReload(null)
    runInAction(() => (this.LockoutPlayInProgress = false))
    this.removeCommonContainer()

    this.props.LiveGameStore.setCurrentMainQuestion(
      0,
      this.props.CommandHostStore.currentPlay
    )

    this.currentScreen = this.props.CommandHostStore.currentPlay
  }

  commandHostWaitingResult() {
    this.LockoutPlayInProgress = false
    this.currentScreen = null
    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)
      ReactDOM.render(<Waiting />, this.refCommonContainer)
    }
  }

  commandHostResult(res) {
    this.LockoutPlayInProgress = false
    this.currentScreen = null
    this.renderCommandHostResults(res)
  }

  MonitorPlayInProgress(inProgress) {
    debugger
    if (this.LockoutPlayInProgress && !inProgress) {
      setTimeout(() => {
        if (this.LockoutPlayInProgress) {
          let stars = this.props.LiveGameStore.currentScriptItem.stars
          let correctAnswer = this.props.LiveGameStore.currentScriptItem
            .correctAnswer
          let sFootage = this.props.LiveGameStore.currentScriptItem.footage
          let progressFootage = this.props.LiveGameStore.currentScriptItem
            .inProgressFootage
          let nextId = this.props.LiveGameStore.currentMainQuestion.nextId || 0
          if (nextId) {
            this.currentScreen = undefined
            this.LockoutPlayInProgress = false
            this.removeCommonContainer()
            this.renderResults(
              nextId,
              sFootage,
              progressFootage,
              correctAnswer,
              stars
            )
          } else {
            // this.timeout = setTimeout(() => {
            //   this.props.NavigationStore.setCurrentView('/globalranking')
            // }, 1500)
          }
        }
      }, 0)
    } else {
      /*
      if (this.props.LiveGameStore.currentScriptItem) {
        if (
          this.props.LiveGameStore.currentScriptItem.type === 'XGameMasterX' ||
          this.props.LiveGameStore.currentScriptItem.type === 'XSponsorX' ||
          this.props.LiveGameStore.currentScriptItem.type === 'XPrizeX'
        ) {
          let correctAnswer = this.props.LiveGameStore.currentScriptItem
            .correctAnswer
          let currId = this.props.LiveGameStore.currentScriptItem.id
          let sFootage = this.props.LiveGameStore.currentScriptItem.footage
          let progressFootage = this.props.LiveGameStore.currentScriptItem
            .inProgressFootage
          let nextId = this.props.LiveGameStore.currentMainQuestion.nextId || 0
          if (nextId) {
            let showResult = this.props.LiveGameStore.currentScriptItem
              .showResult
            this.currentScreen = undefined
            this.LockoutPlayInProgress = false
            this.removeCommonContainer()
            if (showResult) {
              this.renderResults(
                nextId,
                sFootage,
                progressFootage,
                correctAnswer
              )
            } else {
              this.renderNextPlay(currId, nextId, sFootage, progressFootage)
            }
          }
        }
      }
*/
    }
  }

  getTextCardMessage(currentId) {
    return this.props.LiveGameStore.textCardScript.filter(
      o => o.scriptId === currentId
    )[0]
  }

  handleSetPlayHasStarted(response) {
    this.props.LiveGameStore.inProgress = response
  }

  renderNextPlay(currId, nextId, sFootage, inProgressFootage) {
    debugger
    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let nextPlay = this.props.LiveGameStore.nextPlayScript[
        ++this.props.LiveGameStore.nextPlayIndex
      ]
      let comp = (
        <NextPlay
          script={nextPlay}
          teams={this.props.PrePickStore.teams}
          timer={nextPlay && nextPlay.period ? 2 : 0}
          nextId={nextId}
          isTimeUp={this.handleTimeIsUp.bind(this)}
          inProgressFootage={inProgressFootage}
          videoFootage={this.props.LiveGameStore.videoFootage}
          msg={this.getTextCardMessage(currId)}
        />
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderCommandHostResults(res) {
    if (!res.correctAnswers) {
      return
    }

    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let starEarned = false
      let currentAnswer = this.props.PrePickStore.answers.filter(
        o => o.questionId === res.id && o.type === res.type
      )[0]
      if (currentAnswer) {
        if (!currentAnswer.livegameAnswers) {
          return
        }

        runInAction(() => {
          currentAnswer.length = 0
          currentAnswer.isPending = false
        })
        currentAnswer.livegameAnswers.forEach((livegameAnswer, idx) => {
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

        agent.Storage.updateAnswer(currentAnswer)
      }

      let comp = (
        <Results
          script={res.result}
          timer={0}
          currentId={res.id}
          nextId={0}
          isTextCard={false}
          msg={null}
          stars={res.stars}
          starEarned={starEarned}
          isTimeUp={this.handleTimeIsUp.bind(this)}
        />
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderCommandHostResults___(res) {
    debugger

    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let starEarned = false
      let currentAnswer = this.props.PrePickStore.answers.filter(
        o => o.questionId === res.id
      )[0]
      if (currentAnswer) {
        let answered = currentAnswer.livegameAnswers.filter(
          o => o.id === res.id
        )[0]

        if (answered) {
          currentAnswer.correctAnswer = res.correctAnswer
          answered.correctAnswer = res.correctAnswer
          if (
            answered.correctAnswer.trim().toLowerCase() ===
            answered.answer.trim().toLowerCase()
          ) {
            starEarned = true
          } else {
            starEarned = false
          }
        }
      } else {
        starEarned = false
      }

      let comp = (
        <Results
          script={res.result}
          timer={0}
          currentId={res.id}
          nextId={0}
          isTextCard={false}
          msg={null}
          stars={res.stars}
          starEarned={starEarned}
          isTimeUp={this.handleTimeIsUp.bind(this)}
        />
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderResults(nextId, sFootage, progressFootage, correctAnswer, stars) {
    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let curr = this.props.LiveGameStore.currentMainQuestion

      let currentId = 0
      let result = null
      let isTextCard = false
      let msg = null

      if (curr) {
        currentId = curr.id
        result = this.props.LiveGameStore.resultsScript.filter(
          o => o.scriptId === currentId
        )[0]
        isTextCard = curr.isTextCard || false
        msg = this.props.LiveGameStore.textCardScript.filter(
          o => o.scriptId === currentId
        )[0]
      } else {
        currentId = this.props.LiveGameStore.currentPageId
        result = this.props.LiveGameStore.resultsScript.filter(
          o => o.scriptId === currentId
        )[0]
        isTextCard = false
      }

      let starEarned = false
      let currentAnswer = this.props.PrePickStore.answers.filter(
        o => o.questionId === currentId
      )[0]
      if (currentAnswer) {
        let answered = currentAnswer.livegameAnswers.filter(
          o => o.id === currentId
        )[0]
        if (
          answered &&
          answered.correctAnswer.trim().toLowerCase() ===
            answered.answer.trim().toLowerCase()
        ) {
          starEarned = true
        } else {
          starEarned = false
        }
      } else {
        starEarned = false
      }

      this.props.LiveGameStore.setIsResultsShowing(true)
      let comp = (
        <Results
          script={result}
          teams={this.props.PrePickStore.teams}
          timer={3}
          currentId={currentId}
          nextId={nextId}
          isTextCard={isTextCard}
          msg={msg}
          stars={stars}
          starEarned={starEarned}
          isTimeUp={this.handleTimeIsUp.bind(this)}
        />
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderPending(_sponsor) {
    this.LockoutPlayInProgress = true
    this.Lockout = false
    this.lockoutDetailText = ''
    this.currentScreen = null

    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let comp = (
        <Provider {...{ CommandHostStore }}>
          <Pending
            sponsor={_sponsor}
            isTimeUp={this.handleTimeIsUp.bind(this)}
          />
        </Provider>
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderStandBy(_sponsor) {
    this.LockoutPlayInProgress = true
    this.Lockout = false
    this.lockoutDetailText = ''
    this.currentScreen = null

    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let comp = (
        <Provider {...{ CommandHostStore }}>
          <Standby
            sponsor={_sponsor}
            isTimeUp={this.handleTimeIsUp.bind(this)}
          />
        </Provider>
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderNextPlayAd(_sponsor) {
    this.LockoutPlayInProgress = true
    this.Lockout = false
    this.lockoutDetailText = ''
    this.currentScreen = null

    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let comp = (
        <Provider {...{ CommandHostStore }}>
          <NextPlayAd
            sponsor={_sponsor}
            isTimeUp={this.handleTimeIsUp.bind(this)}
          />
        </Provider>
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  renderPlayInProgress(inProgressLength, inProgressFootage, bgColor, type, q) {
    let sLogo = this.props.LiveGameStore.sponsorLogos.filter(
      o => o.id === this.props.LiveGameStore.currentScriptItem.id
    )[0]

    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)

      let comp = (
        <PlayInProgress
          question={q}
          timer={inProgressLength}
          setPlayHasStarted={this.handleSetPlayHasStarted.bind(this)}
          sponsorLogo={sLogo}
          bgColor={bgColor || '#c61818'}
          inProgressFootage={inProgressFootage}
          videoFootage={this.props.LiveGameStore.videoFootage}
        />
      )

      ReactDOM.render(comp, this.refCommonContainer)
    }
  }

  removeCommonContainer() {
    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)
    }
  }

  clearResults() {
    this.props.LiveGameStore.setIsResultsShowing(false)
    if (this.refCommonContainer) {
      ReactDOM.unmountComponentAtNode(this.refCommonContainer)
    }
  }

  renderMultiplyPoints(id, nextId) {
    if (!this.props.CommandHostStore.lockout) {
      let sLogo = this.props.LiveGameStore.sponsorLogos.filter(
        o => o.id === id
      )[0]

      if (this.refCommonContainer) {
        ReactDOM.unmountComponentAtNode(this.refCommonContainer)
        let comp = (
          <MultiplyPoints
            nextId={nextId}
            isTimeUp={this.handleTimeIsUp.bind(this)}
            sponsorLogo={sLogo}
          />
        )
        ReactDOM.render(comp, this.refCommonContainer)
      }
    }
  }

  handleTimeIsUp(isTimeUp, response) {
    if (isTimeUp) {
      let tmpCurrentQuestion = { ...this.currentScreen }
      let sFootage = '',
        inProgressFootage = '',
        bgColor = 'transparent',
        type = ''
      if (this.currentScreen) {
        bgColor = this.currentScreen.backgroundColor
        type = this.currentScreen.type
      }

      let inProgressLength = 0

      /**
       * End of Game State
       */
      if (response && response.comp === 'SUMMARY') {
        this.props.LiveGameStore.setLiveGamePlaythrough(1)

        /*
        let currLoc = this.props.NavigationStore.bypassActiveMenu.filter(
          o => o.route === '/livegame'
        )[0]
        currLoc.through = true
*/
        let currLoc = this.props.NavigationStore.routes.filter(
          o => o.route === '/livegame' && o.canBeBypassed
        )[0]
        if (currLoc && currLoc.through) {
          currLoc.through = true
        }

        this.props.LiveGameStore.updateUserPlaythrough()
        //RE
        this.props.ProfileStore.setSessionCurrencies()
        setTimeout(() => {
          this.props.NavigationStore.setCurrentView('/resolve')
        }, 0)
        return
      }

      /**
       * NextPlay Ad Done
       */
      if (response && response.playAdDone) {
        this.removeCommonContainer()
        return
      }

      /**
       * Announcement Done
       */
      if (response && response.announceDone) {
        this.currentScreen = null
        return
      }

      /**
       * Executes this line if the current screen is not a question such as GetReady, Explanation, Kickoff, etc.
       */
      if (this.currentScreen && !this.currentScreen.isQuestion) {
        this.currentScreen = this.props.LiveGameStore.getCurrentScriptItem(
          this.currentScreen.id,
          this.currentScreen.nextId
        )
        this.props.isLockout(
          this.currentScreen &&
            this.currentScreen.componentName === 'ExplainationScreen'
            ? true
            : false
        )
      }

      if (response && response.nextId) {
        if (response.comp) {
          switch (response.comp) {
            case 'RESULTS':
              this.currentScreen = this.props.LiveGameStore.getCurrentScriptItem(
                null,
                response.nextId
              )
              this.clearResults()
              break
            default:
              this.currentScreen = this.props.LiveGameStore.getCurrentScriptItem(
                null,
                response.nextId
              )
              this.removeCommonContainer()
              break
          }
        }

        this.currentScreen = this.props.CommandHostStore.getCurrentMultiplierPlayById(
          response.nextId
        )
        this.removeCommonContainer()
        return
      }

      /**
       * Executes this line if play has started
       */
      if (this.props.CommandHostStore.lockout && !this.LockoutPlayInProgress) {
        if (response && response.hideTimeout) {
          this.LockoutPlayInProgress = true
          this.renderPlayInProgress(
            inProgressLength,
            inProgressFootage,
            bgColor,
            type,
            tmpCurrentQuestion
          )
          return
        }

        this.props.isLockout(true)
        this.Lockout = true
        this.lockoutHeaderText = 'lockedout'
        this.lockoutDetailText = 'play has started'

        if (this.currentScreen && this.currentScreen.showNextPlayAd) {
          setTimeout(() => {
            this.renderNextPlayAd(this.currentScreen.sponsor)
          }, 1500)
        } else {
          if (this.currentScreen) {
            setTimeout(() => {
              this.LockoutPlayInProgress = true
              this.Lockout = false
              this.lockoutDetailText = ''
              this.currentScreen = null
              this.renderPlayInProgress(
                inProgressLength,
                inProgressFootage,
                bgColor,
                type,
                tmpCurrentQuestion
              )
            }, 1500)
          } else {
            setTimeout(() => {
              this.LockoutPlayInProgress = true
              this.Lockout = false
              this.lockoutDetailText = ''
              this.currentScreen = null
              this.renderPlayInProgress(null, null, null, null, null)
            }, 1500)
          }
        }

        return
      }

      /**
       * Executes this line if the main multiplier-question screen timer is expired.
       */
      if (
        this.props.LiveGameStore.runningLength <= 0 &&
        this.isRunningLengthZero
      ) {
        if (response && response.hideTimeout) {
          this.LockoutPlayInProgress = true
          this.renderPlayInProgress(
            inProgressLength,
            inProgressFootage,
            bgColor,
            type,
            tmpCurrentQuestion
          )
          return
        }

        this.isRunningLengthZero = false
        this.props.isLockout(true)
        this.Lockout = true
        this.lockoutHeaderText = 'lockedout'
        this.lockoutDetailText = 'play has started'
        setTimeout(() => {
          this.LockoutPlayInProgress = true
          this.Lockout = false
          this.lockoutDetailText = ''
          this.renderPlayInProgress(
            inProgressLength,
            inProgressFootage,
            bgColor,
            type,
            tmpCurrentQuestion
          )
        }, 1500)

        return
      }

      /**
       * Executes this line for GameMaster Next Play
       */
      if (
        response &&
        response.isTimerExpired &&
        !this.props.LiveGameStore.inProgress
      ) {
        if (response.hideTimeout) {
          let nId = this.props.LiveGameStore.currentScriptItem.nextId
          this.currentScreen = this.props.LiveGameStore.getCurrentScriptItem(
            null,
            nId
          )
          return
        }

        this.props.isLockout(true)
        this.Lockout = true
        this.lockoutHeaderText = response.lockoutText
          ? response.lockoutText.header
          : 'lockedout'
        this.lockoutDetailText = response.lockoutText
          ? response.lockoutText.detail
          : 'time expired'

        if (response.nextPlay) {
          /**
           * GameMaster, Sponsor
           */
          setTimeout(() => {
            this.props.isLockout(false)
            this.Lockout = false
            this.lockoutHeaderText = ''
            this.lockoutDetailText = ''
            this.props.PrePickStore.multiplier = 0
            this.currentScreen = undefined
            this.renderPlayInProgress(
              inProgressLength,
              inProgressFootage,
              bgColor,
              type,
              tmpCurrentQuestion
            )
          }, 1500)

          /*
          /!**
           * Sponsor Screen
           *!/
          setTimeout(() => {
            this.props.isLockout(false)
            this.Lockout = false
            this.lockoutHeaderText = ''
            this.lockoutDetailText = ''
            let nextId =
              this.props.LiveGameStore.currentMainQuestion.nextId ||
              this.currentScreen.nextId
            this.props.PrePickStore.multiplier = 0
            this.currentScreen = undefined
            this.renderNextPlay(nextId, sFootage, inProgressFootage)
          }, 1500)
*/
        } else {
          this.timeout = setTimeout(() => {
            this.props.isLockout(false)
            this.Lockout = false
            this.lockoutHeaderText = ''
            this.lockoutDetailText = ''
            this.currentScreen = this.props.LiveGameStore.getCurrentScriptItem(
              null,
              this.currentScreen.nextId
            )
          }, 1500)
        }
        return
      }
    }
  }

  handleSplash() {
    this.props.splash()
  }

  answered(answer) {
    let tmpCurrentQuestion = { ...this.currentScreen }
    let currId = 0
    let sFootage = ''
    let inProgressFootage = ''
    let bgColor = 'transparent'
    let type = ''
    if (this.currentScreen) {
      currId = this.currentScreen.id
      sFootage = this.currentScreen.footage
      inProgressFootage = this.currentScreen.inProgressFootage
      bgColor = this.currentScreen.backgroundColor
      type = this.currentScreen.type
    }

    /**
     * RunningLength setup
     */
    /*
    if (
      answer &&
      ('LIVEPLAY' === answer.type.trim().toUpperCase() ||
        'EXTRAPOINT' === answer.type.trim().toUpperCase() ||
        'GAMEMASTER' === answer.type.trim().toUpperCase() ||
        'PRIZE' === answer.type.trim().toUpperCase() ||
        'SPONSOR' === answer.type.trim().toUpperCase()) &&
      this.props.LiveGameStore.runningLength <= 0
    ) {
      this.isRunningLengthZero = true
      this.handleTimeIsUp(true, { hideTimeout: answer.hideTimeout })
      return
    }
*/

    let inProgressLength = 0
    if (this.currentScreen) {
      this.answers.push(answer.answer)
    }

    /**
     * Executes this line if the current screen is not a question such as GetReady, Explanation, Kickoff, etc.
     */
    if (answer === undefined) {
      this.currentScreen = this.props.LiveGameStore.getCurrentScriptItem(
        null,
        this.currentScreen.nextId
      )
      return
    }

    /**
     * Executes this if Next Play
     */
    if (answer && answer.nextPlay) {
      //put half a second timeout to wait for the lock icon to appear
      setTimeout(() => {
        let nextId = this.props.LiveGameStore.currentMainQuestion.nextId || 0
        this.currentScreen = undefined
        this.props.PrePickStore.multiplier = 0
        //original setup => this.renderNextPlay(currId, nextId, sFootage, inProgressFootage)
        this.renderPlayInProgress(
          inProgressLength,
          inProgressFootage,
          bgColor,
          type,
          tmpCurrentQuestion
        )
      }, 500)
      return
    }

    /**
     * Executes this line if question has no follow-up question(s)
     */
    if (answer && (!answer.nextId || answer.nextId <= 0)) {
      //put half a second timeout to wait for the lock icon to appear

      if (this.currentScreen && this.currentScreen.showNextPlayAd) {
        setTimeout(() => {
          this.renderNextPlayAd(this.currentScreen.sponsor)
        }, 500)
      } else {
        setTimeout(() => {
          this.currentScreen = null
          this.LockoutPlayInProgress = true
          this.renderPlayInProgress(
            inProgressLength,
            inProgressFootage,
            bgColor,
            type,
            tmpCurrentQuestion
          )
        }, 500)
      }

      return
    }

    /**
     * Executes this line if question has a follow-up question(s) and needs multiply points
     */
    if (answer && answer.nextId) {
      if (this.props.CommandHostStore.lockout) {
        this.handleTimeIsUp(true, { isTimerExpired: false, hideTimeout: false })
      } else {
        this.renderMultiplyPoints(answer.questionId, answer.nextId)
        this.currentScreen = undefined
      }
      return
    }
  }

  componentWillUnmount() {
    //clearInterval(this.c)
    this.disposeResult()
    this.disposeIsPending()
    this.disposeCurrentMultiplierPlayReload()
    this.disposeCurrentPlay()
    this.disposeWaitingResult()
  }

  componentWillMount() {
    this.currentScreen = this.props.LiveGameStore.currentScriptItem
  }

  componentDidMount() {
    // const localStorageItem = agent.Storage.getItem('gameapp')
    // if (localStorageItem.answers) {
    //   this.props.PrePickStore.setAnswers(localStorageItem.answers)
    // }
  }

  LiveQuestionOption() {
    const current = Object.assign({}, this.currentScreen || {})
    const Comp = this.screens[current.componentName]

    if (current && Comp) {
      if (this.LockoutPlayInProgress) {
        return null
      }

      if (
        current.choices &&
        current.choices.length > 1 &&
        this.props.PrePickStore.multiplier <= 0
      ) {
        this.props.LiveGameStore.setCurrentPageId(current.id)
        this.props.LiveGameStore.setIsInitNextPage(true)
        if (this.pageId !== this.props.LiveGameStore.currentPageId) {
          this.pageId = this.props.LiveGameStore.currentPageId
        }
        if (current.stars > 0) {
          this.props.PrePickStore.setIsStar(true)
        }
      } else {
        if (current.componentName === 'Summary') {
          this.props.LiveGameStore.setCurrentPageId(current.id)
          this.props.LiveGameStore.setIsInitNextPage(true)
          if (this.pageId !== this.props.LiveGameStore.currentPageId) {
            this.pageId = this.props.LiveGameStore.currentPageId
          }
        } else if (current.componentName === 'NextPlayAd') {
          this.props.LiveGameStore.setCurrentPageId(current.id)
          this.props.LiveGameStore.setIsInitNextPage(true)
        } else if (current.componentName === 'Announce') {
          this.props.LiveGameStore.setCurrentPageId(current.id)
          this.props.LiveGameStore.setIsInitNextPage(true)
        } else if (current.componentName === 'PostGame') {
          this.props.LiveGameStore.setCurrentPageId(current.id)
          this.props.LiveGameStore.setIsInitNextPage(true)
        }
      }

      let sLogo = this.props.LiveGameStore.sponsorLogos.filter(
        o => o.id === current.id
      )[0]

      this.props.isLockout(
        current.componentName === 'ExplainationScreen' ? true : false
      )

      /**
       * analytic
       */
      if (
        current.choices &&
        current.choices.length > 1 &&
        this.pageIdAnalytic !== this.props.LiveGameStore.currentPageId
      ) {
        this.pageIdAnalytic = this.props.LiveGameStore.currentPageId
        runInAction(() => {
          this.props.LiveGameStore.setCurrentLivePlayCount(1)
          this.props.PrePickStore.captureAnalyticLivePlayStart()
        })

        if (current.stars > 0) {
          runInAction(() => {
            this.props.LiveGameStore.setCurrentStarCount(1)
            this.props.PrePickStore.captureAnalyticStarsStart()
          })
        }
      }

      this.props.questionBackground(current.backgroundImage)
      return (
        <Comp
          key={`questionComp-${current.id}`}
          teams={this.props.PrePickStore.teams}
          question={current}
          timer={current.length}
          isTimeUp={this.handleTimeIsUp.bind(this)}
          answered={this.answered.bind(this)}
          splash={this.handleSplash.bind(this)}
          sponsorLogo={sLogo}
          proceedToVideoScreen={this.props.proceedToVideoScreen}
          isTextCard={current.isTextCard}
          msg={this.getTextCardMessage(current.id)}
        />
      )
    }

    // this.timeout = setTimeout(() => {
    //   this.props.NavigationStore.setCurrentView('/socialranking')
    // }, 1500)

    /*
    if (current.isEnd) {
      this.timeout = setTimeout(() => {
        this.props.NavigationStore.setCurrentView('/globalranking')
      }, 1000)
    }
*/

    return null
  }

  render() {
    return (
      <LiveQuestionContainer>
        {this.Lockout ? (
          <Lockout
            reference={ref => (this.lockoutRef = ref)}
            header={this.lockoutHeaderText}
            detail={this.lockoutDetailText}
          />
        ) : null}
        <CommonContainer innerRef={c => (this.refCommonContainer = c)} />
        {this.LiveQuestionOption()}
      </LiveQuestionContainer>
    )
  }
}

const LiveQuestionContainer = styled.div`
  width: inherit;
  height: inherit;
  font-family: pamainlight;
  position: absolute;
`
const CommonContainer = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
`
