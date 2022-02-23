import { observable, action, computed, reaction } from 'mobx'
import agent from '@/Agent'
import { dateTimeZone } from '@/utils'
import script from '@/stores/PlayScript'
import LiveGameStore from '@/stores/LiveGameStore'
import PlayStore from '@/stores/PlayStore'
import PrePickStore from '@/stores/PrePickStore'
import NavigationStore from '@/stores/NavigationStore'
import ProfileStore from '@/stores/ProfileStore'
import PrePick from '../Components/PrePick/PrePick'

class CommandHostStore {
  @observable
  COMMAND_MODE = true

  @observable
  currentPlay = null

  @observable
  currentMultiplierPlays = []
  @action
  pushCurrentMultiplierPlay(val) {
    this.currentMultiplierPlays.push(val)
  }

  @observable
  lockout = false
  @action
  setLockout(val) {
    this.lockout = val
  }

  @observable
  waitingResult = false
  @action
  setWaitingResult(val) {
    this.waitingResult = val
  }

  @observable
  result = null
  @action
  setResult(val) {
    this.result = val
  }

  @observable
  pendingPlay = null
  @action
  setPendingPlay(val) {
    this.pendingPlay = val
  }

  @observable
  isPending = false
  @action
  setIsPending(val) {
    this.isPending = val
  }

  @observable
  resolve = null
  @action
  setResolve(val) {
    this.resolve = val
  }

  @observable
  nextPlay = null
  @action
  setNextPlay(val) {
    this.nextPlay = val
  }

  @observable
  showNextPlayAd = false
  @action
  setShowNextPlayAd(val) {
    this.showNextPlayAd = val
  }

  @observable
  announcement = null
  @action
  setAnnouncement(val) {
    this.announcement = val
  }

  @observable
  lastPlayPriorToPageReload = null
  @action
  setLastPlayPriorToPageReload(val) {
    this.lastPlayPriorToPageReload = val
  }
  @action
  evaluateLocalStorage(play) {}

  @observable
  activePlay = {
    id: 0,
    type: '',
    multiplier: 1,
    length: 0,
    withStar: false,
  }
  @action
  setActivePlay(val) {
    //UNUSED - to be deleted
    if (val) {
      LiveGameStore.incrementPlayCounter(playCounter => {
        this.activePlay['id'] = playCounter
        this.activePlay['type'] = val.type
        this.activePlay['multiplier'] = val.multiplier
        this.activePlay['length'] = val.length
        this.activePlay['withStar'] = val.withStar
      })
    }
  }
  @action
  resetActivePlay() {
    this.activePlay.type = ''
    this.activePlay.multiplier = 1
    this.activePlay.length = 0
    this.activePlay.withStar = false
  }

  @action
  setCurrentPlay(val) {
    val.eventTimeStart = dateTimeZone(new Date())
    this.currentPlay = val
  }

  @action
  getCurrentMultiplierPlayById(id) {
    const item = this.currentMultiplierPlays.filter(o => o.id === id)[0]
    item.eventTimeStart = dateTimeZone(new Date())
    this.setCurrentMultiplierPlay(item)
    return item
  }

  @observable
  currentMultiplierPlay = null
  @action
  setCurrentMultiplierPlay(val) {
    this.currentMultiplierPlay = val
  }

  @observable
  currentMultiplierPlayReload = null
  @action
  setCurrentMultiplierPlayReload(val) {
    this.currentMultiplierPlayReload = val
  }

  /**
   * GET THE CHILDREN OF THE CURRENT PLAY.
   * IT IS APPLICABLE ON MULTIPLIER.
   */
  /*
  @observable
  multiplierPlay = []

  setPlayById(id) {
    let parent = script.filter(o => o.id === id)[0]
    if (parent) {
      this.multiplierPlay.push(parent)
      if (parent.choices && parent.choices.length >= 2) {
        for (let i = 0; i < parent.choices.length; i++) {
          let nextId = parent.choices[i].nextId
          if (nextId > 0) {
            this.setPlayByNextId(nextId)
          }
        }
      }
    }
  }

  setPlayByNextId(nextId) {
    let item = script.filter(o => o.id === nextId)[0]
    if (item) {
      this.setPlayById(item.id)
    }
  }
*/
  //-----------------------------------------------------------------------

  initCurrentPlayOnPageLoad() {
    return PlayStore.initCurrentPlayOnPageLoad()
  }

  broadcastPlay(type) {
    agent.GameServer.broadcastPlay(type).then(data => {
      console.log('Store', data)
    })
  }

  changePlay(data) {
    data.forEach(play => {
      this.pushCurrentMultiplierPlay(play)
    })
    this.setLockout(false)
    this.setCurrentPlay(data[0])
  }

  receivePlay(data) {
    this.setLockout(false)
    this.setActivePlay(data.activePlay)
    this.setCurrentPlay(data.activePlay)
  }

  broadcastLockout(val) {
    agent.GameServer.broadcastLockout(val)
  }

  receiveLockout(data) {
    this.setLockout(data)
  }

  endPlayResult(data) {
    let res = {
      ended: data.ended,
      type: data.result.type,
      id: data.result.id,
      stars: data.result.withStar,
      correctAnswer: data.result.correctAnswer,
      correctAnswers: data.result.correctAnswers,
      status: data.result.status,
      result: {
        result: data.result.resultTitle,
        team: data.result.selectedTeam,
        teamIndex: data.result.selectedTeam.index,
      },
    }
    this.setResult(res)
  }

  endPlaySummary() {
    let summaryInfo = {
      type: 'Summary',
      multiplier: 0,
      length: 0,
      withStar: false,
    }

    this.setLockout(false)
    this.setActivePlay(summaryInfo)
    this.setCurrentPlay(summaryInfo)
  }

  @observable
  forcePushEmptyAnswer = null
  @action
  setForcePushEmptyAnswer(val) {
    if (val) {
      this.forcePushEmptyAnswer = val
    }
  }

  @observable
  latestResolvedPlay = null
  @action
  setLatestResolvedPlay(val) {
    if (!this.isPageReloaded) {
      this.latestResolvedPlay = val
    }
  }

  @observable
  pendingPlayCount = 0
  @action
  setPendingPlayCount(val) {
    if (!this.isPageReloaded) {
      this.pendingPlayCount = val
    }
  }

  isPendingPanelHidden = true
  setIsPendingPanelHidden(val) {
    this.isPendingPanelHidden = val
  }

  gameSubscriptionParams = null
  @action
  setGameSubscriptionParams(val) {
    this.gameSubscriptionParams = val
  }

  @action
  resetObservables() {
    this.currentPlay = null
    this.currentMultiplierPlays = []
    this.lockout = false
    this.waitingResult = false
    this.result = null
    this.pendingPlay = null
    this.isPending = false
    this.resolve = null
    this.nextPlay = null
    this.showNextPlayAd = false
    this.announcement = null
    this.activePlay = {
      id: 0,
      type: '',
      multiplier: 1,
      length: 0,
      withStar: false,
    }
    this.forcePushEmptyAnswer = null
    this.latestResolvedPlay = null
    this.pendingPlayCount = 0
    this.isPendingPanelHidden = true
    this.gameId = null
    this.gameSubscriptionParams = null
  }

  @observable
  isResetDatabase = false
  @action
  resetDatabase(val) {
    this.isResetDatabase = val
  }
  resetDatabaseX1(val) {
    this.isResetDatabase = val
    if (val) {
      NavigationStore.setCurrentView('/resetdatabase')
    } else {
      LiveGameStore.resetLivegameAnswers()
      PrePickStore.resetAnswers()
      setTimeout(() => {
        NavigationStore.setCurrentView('/livegame')
      }, 0)
    }
  }

  presetItems = []
  resetPresetItems() {
    this.presetItems = []
  }

  @observable
  isAuthenticated = false
  @action
  setAuthenticated(val) {
    this.isAuthenticated = val
  }

  @action
  addHistoryPrePickToServer(val) {
    return agent.GameServer.addHistoryPrePick(val)
  }

  @action
  addHistoryPlayToServer(val) {
    if (this.gameId && ProfileStore.profile.userId) {
      const args = {
        userId: ProfileStore.profile.userId,
        gameId: this.gameId,
        historyPlay: val,
      }
      agent.GameServer.addHistoryPlay(args)
    }
  }

  @action
  updateHistoryPlayToServer(play, currencies) {
    //if (!this.isPageReloaded) {
    if (this.gameId) {
      console.log('UPDATE PLAY TO SERVER', play, currencies)
      agent.GameServer.updateHistoryPlay({
        userId: ProfileStore.profile.userId,
        gameId: this.gameId,
        historyPlay: play,
        awards: currencies,
      })
    }
    //}
  }

  @action
  updateHistoryPlayToServer_TO_DELETE(val) {
    if (!this.isPageReloaded) {
      if (this.gameId && ProfileStore.profile.userId) {
        agent.GameServer.updateHistoryPlay({
          userId: ProfileStore.profile.userId,
          gameId: this.gameId,
          historyPlay: val,
        })
      }
    }
  }

  @observable
  gameId = null
  @action
  setGameId(val) {
    this.gameId = val
  }

  @observable
  isSessionAvailable = true
  @action
  setSessionAvailable(val) {
    this.isSessionAvailable = val
  }

  setParticipants(val) {
    const teams = []
    for (let i = 0; i < val.length; i++) {
      teams.push({
        id: val[i].id,
        teamName: val[i].name,
        initial: val[i].initial,
        iconTopColor: val[i].topColor,
        iconBottomColor: val[i].bottomColor,
        index: i,
        score: val[i].score,
      })
    }

    PrePickStore.setTeams(teams)
  }

  isPageReloaded = false

  @action
  setPageReloaded(val) {
    this.isPageReloaded = val
  }

  @observable
  isLoading = false

  @observable
  sportTypes = []

  @observable
  sportGames = []
  @action
  setSportGames(val) {
    this.sportGames = val
  }

  @observable
  followedGames = []

  @action
  getSportTypes() {
    this.isLoading = true
    return agent.GameServer.getSportTypes({})
      .then(data => {
        this.sportTypes = data
        console.log('SPORT TYPES', data)
      })
      .catch(err => {
        throw err
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @action
  getGamesByCategory(sportType) {
    this.isLoading = true
    return agent.GameServer.getGamesByCategory(sportType)
      .then(data => {
        this.sportGames = data
      })
      .catch(err => {
        console.log(err)
      })
      .finally(_ => {
        this.isLoading = false
        return Promise.resolve(true)
      })
  }

  @action
  getFollowedGames() {
    //    return agent.GameServer.getFollowedGames({userId: ProfileStore.profile.userId})
    this.isLoading = true
    return agent.GameServer.getGamesByCategory('fb')
      .then(data => {
        this.followedGames = []
        return Promise.resolve(true)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(_ => {
        this.isLoading = false
        return Promise.resolve(true)
      })
  }

  @action
  getBackgroundColorByType(val) {
    if (val) {
      const item = script.filter(o => o.type === val)[0]
      if (item) {
        return item.backgroundColor
      } else {
        return null
      }
    } else {
      return null
    }
  }

  @action
  getUserPrePicks(params) {
    return agent.GameServer.getUserPrePicks(params).then(async data => {
      let totalPrePicksCount = 0
      const prePicks = []
      const teams = []
      const historyAnswers = []

      if (data.participants) {
        ;(data.participants || []).forEach(team => {
          teams.push({
            id: team.sequence,
            teamName: team.name,
            initial: team.initial,
            iconTopColor: team.top_color,
            iconBottomColor: team.bottom_color,
            score: team.score,
          })
        })

        PrePickStore.setTeams(teams)
      }

      if (data.gamePrePicks) {
        for (let i = 0; i < data.gamePrePicks.length; i++) {
          const raw = data.gamePrePicks[i]
          const questionHeader = JSON.parse(
            JSON.parse(JSON.stringify(raw.question_header.replace(/'/g, '"')))
          )
          const questionDetails = JSON.parse(
            JSON.parse(JSON.stringify(raw.question_detail.replace(/'/g, '"')))
          )
          const forParticipant = JSON.parse(
            JSON.parse(JSON.stringify(raw.for_participant.replace(/'/g, '"')))
          )
          const choices = JSON.parse(
            JSON.parse(JSON.stringify(raw.choices.replace(/'/g, '"')))
          )
          const _labels = []
          let _choices = []
          let _forTeam = {}
          totalPrePicksCount = raw.totalCount

          for (let j = 0; j < questionDetails.length; j++) {
            const lbl = questionDetails[j]
            _labels.push({
              sequence: lbl.sequence,
              value: lbl.value,
              color: lbl.color,
            })
          }

          if (forParticipant && Object.keys(forParticipant).length > 0) {
            const selTeam = await data.participants.filter(
              o => o.sequence === forParticipant.id
            )[0]
            if (selTeam) {
              _forTeam = { id: selTeam.sequence, teamName: selTeam.name }
            }

            _choices = choices
          } else {
            for (let l = 0; l < data.participants.length; l++) {
              const team = data.participants[l]
              await _choices.push(team.name)
            }
          }

          const pp = {
            gameId: raw.game_id,
            prepickSequence: raw.sequence,
            id: raw.prepick_id,
            title: questionHeader.value,
            titleColor: questionHeader.color,
            labels: _labels,
            choiceType: raw.choice_type,
            choices: _choices,
            background: raw.background_image,
            points: raw.points,
            tokens: raw.tokens,
            forTeam: _forTeam,
            shortHand: raw.shorthand,
            correctAnswer: '',
            type: raw.type,
            info: raw.info,
          }

          await prePicks.push(pp)
        }

        await PrePickStore.setQuestions(prePicks)
      }

      if (data.userPrePicks) {
        for (let m = 0; m < data.userPrePicks.length; m++) {
          const ans = data.userPrePicks[m]
          await historyAnswers.push({
            answer: ans.answer,
            prepickSequence: ans.sequence,
            questionId: ans.prepick_id,
            shortHand: ans.shorthand,
            type: ans.type,
          })
        }

        await PrePickStore.setAnswers(historyAnswers)
      }

      PrePickStore.setTotalPrePicks(totalPrePicksCount)
      PrePickStore.incrementCurrentPrePick(totalPrePicksCount - prePicks.length)

      let userPrePicksCompleted = false
      if (totalPrePicksCount > historyAnswers.length) {
        PrePickStore.setPrePickMode(true)
        userPrePicksCompleted = false
      } else {
        PrePickStore.setPrePickMode(false)
        userPrePicksCompleted = true
      }

      return Promise.resolve({
        isCompleted: userPrePicksCompleted,
        isAvailableForThisGame:
          totalPrePicksCount > 0 || historyAnswers.length > 0 ? true : false,
        timeStart: data.timeStart,
        dateStart: data.dateStart,
        userLivePlayCount: data.userLivePlayCount,
      })
    })
  }

  @action
  unsubscribeToGame() {
    agent.GameServer.unsubscribeToGame()
  }

  @action
  connectSC() {
    agent.GameServer.connectSC()
  }
}

export default new CommandHostStore()
