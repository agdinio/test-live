import { observable, action, computed } from 'mobx'
import PrePickStore from '@/stores/PrePickStore'
import CommandHostStore from '@/stores/CommandHostStore'
import ProfileStore from '@/stores/ProfileStore'
import SponsorStore from '@/stores/SponsorStore'
import script from '@/stores/PlayScript'
import agent from '@/Agent'
import { uniqueId, StoreJWTToken, ClearJWTToken } from '@/utils'
import parsePhoneNumber from 'libphonenumber-js'
import Profile from '../Components/Profile'
import AnalyticsStore from '@/stores/AnalyticsStore'
import NavigationStore from '@/stores/NavigationStore'
import ResolveStore from '@/stores/ResolveStore'

const BGC = {
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

class GameStore {
  PlayTypes = [
    // {
    //   text: 'pre-picks',
    //   multiplier: 0,
    //   backgroundColor: '#0fbc1c',
    //   innerBackgroundColor: '#ffffff',
    //   prePoints: 1000,
    //   isMultiplier: true,
    //   keyword: 'prepicks',
    // },
    {
      text: 'live plays',
      multiplier: 0,
      backgroundColor: '#c61818',
      innerBackgroundColor: '#ffffff',
      color: '#ffffff',
      prePoints: 1000,
      isMultiplier: true,
      icon: 'symbol-liveplay.svg',
      type: 'liveplay',
    },
    {
      text: 'gamemaster',
      multiplier: 0,
      backgroundColor: '#19d1bf',
      innerBackgroundColor: '#ffffff',
      color: '#ffffff',
      prePoints: 1000,
      isMultiplier: true,
      icon: 'symbol-gm.svg',
      type: 'gamemaster',
    },
    {
      text: 'sponsor plays',
      multiplier: 0,
      backgroundColor: '#3533a8',
      innerBackgroundColor: '#ffffff',
      color: '#ffffff',
      prePoints: 1000,
      isMultiplier: true,
      icon: 'symbol-sponsor.svg',
      type: 'sponsor',
    },
    {
      text: 'prize plays',
      multiplier: 0,
      backgroundColor: '#9368AA',
      innerBackgroundColor: '#ffffff',
      color: '#ffffff',
      prePoints: 1000,
      isMultiplier: true,
      icon: 'symbol-prize.svg',
      type: 'prize',
    },
    {
      text: 'stars',
      multiplier: 0,
      backgroundColor: '#efdf18',
      innerBackgroundColor: '#ffffff',
      color: '#231F20',
      prePoints: 1000,
      isMultiplier: true,
      icon: 'star-icon-dark.svg',
      iconBG: 'transparent',
      type: 'stars',
    },
  ]

  gameStatus = {
    active: {
      bg: '#ffffff',
      text: 'active',
      color: '#000000',
      invertedColor: '#ffffff',
      prePicksEditable: true,
      slidingButton: { text: 'details', color: '#000000', bg: '#E5E5E5' },
    },
    public: {
      bg: '#e6e7e8',
      text: '',
      color: '#000000',
      invertedColor: '#ffffff',
      prePicksEditable: true,
      slidingButton: { text: 'edit prepicks', color: '#ffffff', bg: '#22ba2c' },
    },
    pregame: {
      bg: '#22ba2c',
      text: 'PRE-GAME',
      color: '#ffffff',
      invertedColor: '#22ba2c',
      prePicksEditable: false,
      slidingButton: { text: 'access h-comm', color: '#ffffff', bg: '#18c5ff' },
    },
    pending: {
      bg: '#efdf17',
      text: 'PENDING',
      color: '#000000',
      invertedColor: '#efdf17',
      prePicksEditable: false,
      slidingButton: { text: 'access h-comm', color: '#ffffff', bg: '#18c5ff' },
    },
    live: {
      bg: '#c61818',
      text: 'LIVE',
      color: '#ffffff',
      invertedColor: '#c61818',
      prePicksEditable: false,
      slidingButton: { text: 'join h-comm', color: '#ffffff', bg: '#c61818' },
    },
    postgame: {
      bg: '#4d92ad',
      text: 'POST-GAME',
      color: '#ffffff',
      invertedColor: '#ffffff',
      prePicksEditable: false,
      slidingButton: { text: 'access stats', color: '#ffffff', bg: '#808285' },
    },
    end: {
      bg: '#3d3d3d',
      text: 'END',
      color: '#ffffff',
      invertedColor: '#ffffff',
      prePicksEditable: false,
      slidingButton: { text: 'access stats', color: '#ffffff', bg: '#808285' },
    },
  }

  Thresholds = [
    {
      name: 'sponsor papa',
      initial: 'p',
      //baseColor: '#7c4724',
      baseColor: '#AF643F',
      baseColorInactive: '#bcbec0',
      minutesRequired: 15,
      initialColor: '#383644',
      backgroundColor: '#b2cbce',
      circleBorderColor: '#91a5c1',
      id: 1,
    },
    {
      name: 'sponsor bravo',
      initial: 'b',
      baseColor: '#f2a227',
      baseColorInactive: '#bcbec0',
      minutesRequired: 30,
      initialColor: '#3f2919',
      backgroundColor: '#e2a069',
      circleBorderColor: '#7c4724',
      id: 2,
    },
    {
      name: 'sponsor sierra',
      initial: 's',
      baseColor: '#37c385',
      baseColorInactive: '#bcbec0',
      minutesRequired: 60,
      initialColor: '#4c4c4c',
      backgroundColor: '#bababa',
      circleBorderColor: '#999999',
      id: 3,
    },
    {
      name: 'sponsor golf',
      initial: 'g',
      baseColor: '#2bc6fc',
      baseColorInactive: '#bcbec0',
      minutesRequired: 90,
      initialColor: '#754b00',
      backgroundColor: '#ffde9c',
      circleBorderColor: '#f4a300',
      id: 4,
    },
    {
      name: 'sponsor golf',
      initial: 'g',
      baseColor: '#ff00ff',
      baseColorInactive: '#bcbec0',
      minutesRequired: 120,
      initialColor: '#754b00',
      backgroundColor: '#ffde9c',
      circleBorderColor: '#f4a300',
      id: 5,
    },
    {
      name: 'sponsor golf',
      initial: 'g',
      baseColor: '#000000',
      baseColorInactive: '#000000',
      minutesRequired: 'END',
      initialColor: '#754b00',
      backgroundColor: '#ffde9c',
      circleBorderColor: '#f4a300',
      id: 6,
    },
  ]

  sportTypes = {
    fb: { icon: 'football.svg' },
    bb: { icon: 'basketball.svg' },
  }

  gameEvents = ['fbnfl', 'bbnba']

  @observable
  progress = 'active'

  participants = []
  preset = []
  baseOptions = []
  baseDefaults = []
  leapType = null
  videoName = null
  videoPath = null

  @observable
  automationGameState = null
  setAutomationGameState(val) {
    this.automationGameState = val
  }

  @observable
  resetPlayHistory = false

  @observable
  playing = false

  connectSC() {
    agent.GameServer.connectSC()
  }

  login(args) {
    return agent.GameServer.login(args)
      .then(data => {
        this.setUserProfile(data.profile)
        ////////////////////////////////////////////////=>this.setHistoryPlays(data.profile.historyPlays)

        CommandHostStore.setAuthenticated(true)

        StoreJWTToken(data.token)
        ////////////////////////////////////////////////=>this.subscribeToGame()
        return Promise.resolve()
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  setInfo(data) {
    if (!data) {
      CommandHostStore.setAuthenticated(false)
      CommandHostStore.setGameId(null)
      return
    }

    CommandHostStore.setPageReloaded(true)
    CommandHostStore.setAuthenticated(true)

    this.setUserProfile(data.profile)
    this.setHistoryPlays(data.historyPlays)

    if (data.info) {
      CommandHostStore.setParticipants(data.info.participants)

      CommandHostStore.setGameId(data.info.gameId)
      this.progress = data.info.progress
      this.participants = data.info.participants
      this.preset = data.info.preset
      this.baseOptions = data.info.baseOptions
      this.baseDefaults = data.info.defaults
      this.leapType = data.info.leapType
      this.videoName = data.info.videoName
      this.videoPath = data.info.videoPath
      this.automationGameState = data.info.automationGameState

      this.playUpdate(data.plays)
      CommandHostStore.setSessionAvailable(true)
      AnalyticsStore.setPendingGamePlay({ location: '/livegame', isSet: false })
    } else {
      CommandHostStore.setSessionAvailable(false)
    }

    //////////////////////////////////////this.extractPresets()

    // let prevFromHistory = null
    // if (data.historyPlays && data.historyPlays.length > 0) {
    //   prevFromHistory = JSON.parse(JSON.stringify(data.historyPlays.reduce((prev, current) => (prev.started > current.started) ? prev : current)))
    //   if (!data.plays.previous) {
    //     data.plays.previous = prevFromHistory
    //     const idx = data.historyPlays.findIndex(o => o.questionId === prevFromHistory.questionId)
    //     if (idx > -1) {
    //       data.historyPlays.splice(idx, 1)
    //     }
    //   }
    // }

    setTimeout(async () => {
      CommandHostStore.setPageReloaded(false)
      const lastPlayId = (await CommandHostStore.lastPlayPriorToPageReload)
        ? CommandHostStore.lastPlayPriorToPageReload.questionId
        : ''
      const pendingPlayCount = await PrePickStore.answers.filter(
        o => !o.ended && o.questionId !== lastPlayId
      ).length
      CommandHostStore.setPendingPlayCount(pendingPlayCount)
    }, 1000)
  }

  setAnonymousUserProfile(data) {
    console.log('RAW ANONYMOUS PROFILE', JSON.parse(JSON.stringify(data)))
    if (data && data.anonymousUserId) {
      data.displayName = 'Anonymous User'

      ProfileStore.setProfile(data)
    }
  }

  setUserProfile(profile) {
    // let mobile = profile.mobile.replace(/[^0-9]/g, '')
    // if (/[0-9]*/.test(mobile) && mobile.length <= 10) {
    //   if (mobile.length >= 4) {
    //     mobile = `${mobile.slice(0, 3)}-${mobile.slice(3)}`
    //   }
    //   if (mobile.length >= 8) {
    //     mobile = `${mobile.slice(0, 7)}-${mobile.slice(7)}`
    //   }
    //   console.log(mobile)
    // }

    //console.log('NUMBER FORMAT', this.formatPhoneNumber("+639212221704"))

    console.log('RAW PROFILE', JSON.parse(JSON.stringify(profile)))
    if (profile && profile.userId) {
      profile.displayName = profile.firstName + ' ' + profile.lastName
      profile.notifyEmail = profile.notifyEmail ? true : false
      profile.notifyMobile = profile.notifyMobile ? true : false
      profile.isCelebrity = profile.isCelebrity ? true : false
      profile.currencies = {
        points: profile.points,
        tokens: profile.tokens,
        stars: profile.stars,
      }

      ProfileStore.setProfile(profile)
    } else {
      CommandHostStore.setAuthenticated(false)
      ClearJWTToken()
    }
  }

  setUserProfileXXX(profile) {
    console.log(profile)
    if (profile) {
      const val = {
        userId: profile.user_id,
        username: profile.email,
        currencies: {
          points: profile.points,
          tokens: profile.tokens,
          stars: profile.stars,
        },
        displayName: profile.firstname + profile.lastname,
      }

      ProfileStore.setProfile(val)
    }
  }

  setHistoryPlays(historyPlays) {
    if (historyPlays) {
      PrePickStore.setAnswers(JSON.parse(JSON.stringify(historyPlays)))
    } else {
      PrePickStore.setAnswers([])
    }
  }

  gameUpdate(data, hasReset) {
    this.progress = data.progress

    if (hasReset) {
      CommandHostStore.resetDatabase(true)
      setTimeout(() => window.location.reload(true), 2000)
    }

    if (data.resetPlayHistory) {
      this.setHistoryPlays([])
      this.resetPlayHistory = true
    }

    if (data.progress === 'live') {
      this.playing = true
      this.broadcastNextPlayAd()
    } else if (data.progress === 'postgame') {
      this.playing = false
      this.playUpdate({ previous: data.previous, current: data.current })
    }
  }

  subscribeToGame(params) {
    // if (ProfileStore.profile.userId) {
    //   const params = {event: 'fbnfl', userId: 8}
    //   agent.GameServer.subscribeToGame(params, this.gameEvents)
    // }
    const args = {
      event: params.gameId,
      userId: params.userId,
      anonymousUserId: params.anonymousUserId,
    }
    console.log('SUBSCRIBE TO GAME ARGS:', args)
    agent.GameServer.subscribeToGame(args, [])
  }

  extractPresets() {
    this.extractTeams()
      .then(next => {
        if (next) {
          return this.assignIdOnPredetermined()
        }
      })
      .then(next => {
        if (next) {
          return this.extractPreDetermined()
        }
      })
      .then(next => {
        if (next) {
          return this.extractBaseOptions()
        }
      })
      .then(next => {
        if (next) {
          return this.addNonLivePlayOptions()
        }
      })
  }

  extractTeams() {
    return new Promise(resolve => {
      if (this.participants && this.participants.length > 0) {
        let teams = []
        this.participants.forEach((team, idx) => {
          teams.push({
            id: idx + 1,
            teamName: team.name,
            initial: team.initial,
            iconTopColor: team.topColor,
            iconBottomColor: team.bottomColor,
            index: idx,
            score: 0,
          })
        })

        PrePickStore.setTeams(teams)
      }

      resolve(true)
    })
  }

  assignIdOnPredetermined() {
    CommandHostStore.resetPresetItems()

    return new Promise(resolve => {
      let id = 0
      for (let i = 0; i < this.preset.length; i++) {
        this.preset[i].id = ++id
      }

      for (let j = 0; j < this.baseOptions.length; j++) {
        this.baseOptions[j].id = ++id
      }

      for (let k = 0; k < this.baseDefaults.length; k++) {
        this.baseDefaults[k].id = ++id
      }

      resolve(true)
    })
  }

  extractPreDetermined() {
    return new Promise(resolve => {
      if (this.preset && this.preset.length > 0) {
        this.preset.forEach(item => {
          let choices = []
          if (item.values && item.values.length > 0) {
            item.values.forEach(value => {
              let valueToFind = this.baseOptions.filter(
                o =>
                  o.choice.trim().toLowerCase() === value.trim().toLowerCase()
              )[0]
              if (valueToFind) {
                choices.push({ value: value, nextId: valueToFind.id })
              } else {
                choices.push({ value: value })
              }
            })
          }

          let pre = {
            id: item.id,
            preset: item.name,
            question: item.question,
            choices: choices,
            type: 'LivePlay',
          }
          CommandHostStore.presetItems.push(pre)
        })
      }

      resolve(true)
    })
  }

  extractBaseOptions() {
    return new Promise(resolve => {
      const _baseOptions = JSON.parse(JSON.stringify(this.baseOptions))
      if (_baseOptions && _baseOptions.length > 0) {
        _baseOptions.forEach(item => {
          let choices = []
          if (item.values && item.values.length > 0) {
            try {
              item.values.forEach(value => {
                let valueToFind = this.baseOptions.filter(
                  o =>
                    o.choice.trim().toLowerCase() === value.trim().toLowerCase()
                )[0]
                if (valueToFind) {
                  choices.push({ value: value, nextId: valueToFind.id })
                } else {
                  choices.push({ value: value })
                }
              })
            } catch (err) {
              let defaultsToFind = this.baseDefaults.filter(
                o => o.name.trim().toLowerCase() === item.values
              )[0]
              if (defaultsToFind) {
                if (defaultsToFind.values && defaultsToFind.values.length > 0) {
                  defaultsToFind.values.forEach(value => {
                    choices.push({ value: value })
                  })
                }
              }
            }
          }

          let pre = {
            id: item.id,
            preset: 'multiplier',
            isMultiplier: true,
            question: item.question,
            choices: choices,
            type: 'LivePlay',
          }
          CommandHostStore.presetItems.push(pre)
        })
      }

      resolve(true)
    })
  }

  addNonLivePlayOptions() {
    return new Promise(resolve => {
      let id = CommandHostStore.presetItems.length
      const nonLivePlayAB = {
        id: ++id,
        preset: 'A-B (Y/N)',
        question: '',
        choices: [{ value: 'yes' }, { value: 'no' }],
        readOnly: true,
        type: 'GameMaster, Sponsor, Prize',
      }
      CommandHostStore.presetItems.push(nonLivePlayAB)

      const nonLivePlayABTeams = {
        id: ++id,
        preset: 'A-B (TEAMS)',
        question: '',
        choices: [],
        readOnly: true,
        type: 'GameMaster, Sponsor, Prize',
      }
      CommandHostStore.presetItems.push(nonLivePlayABTeams)

      resolve(true)
    })
  }

  playUpdate(data) {
    let ExecuteNextPlay = async current => {
      if (current) {
        if ('postgame' === this.progress) {
          this.broadcastPostGame()
          return
        }

        let screens = []

        let screen = script.filter(o => o.type === current.type)[0]
        if (!screen) {
          screen = script.filter(o => o.type === current.type)[0]
        }

        let parentId = current.id

        if ('announce' === screen.type.trim().toLowerCase()) {
          const _sponsor = await SponsorStore.sponsors.filter(
            o =>
              o.id ===
              (current.sponsor && current.sponsor.id ? current.sponsor.id : 0)
          )[0]
          screen.type = current.type
          screen.id = current.id
          screen.index = current.index
          screen.nextPlayType = current.nextPlayType
          screen.announcements = current.announcements
          screen.sponsor = _sponsor
          screen.started = current.started

          screens.push(screen)
        } else {
          if (
            current.multiplierChoices &&
            current.multiplierChoices.length > 0
          ) {
            current.multiplierChoices.forEach(obj => {
              let scr = { ...screen }

              scr.id = obj.id
              scr.stars = parseInt(current.stars)
              scr.points = parseInt(current.points)
              scr.tokens = parseInt(current.tokens)
              scr.playTitle = obj.question
              scr.correctAnswer = ''
              //scr.forTeam = current.forParticipant
              scr.forTeam = PrePickStore.teams.filter(
                o => o.id === current.participantId
              )[0]
              scr.isPresetTeamChoice = obj.isPresetTeamChoice
              scr.sponsor = SponsorStore.sponsors.filter(
                o => o.id === current.sponsorId
              )[0]
              scr.showNextPlayAd = obj.showNextPlayAd
              scr.nextPlayType = obj.nextPlayType
              scr.choices = obj.choices
                ? obj.choices.sort((a, b) => a.sequence - b.sequence)
                : []
              scr.parentId = parentId
              scr.started = current.started

              screens.push(scr)
            })
          } else {
            let scr = { ...screen }
            scr.id = current.id
            scr.stars = parseInt(current.stars)
            scr.points = current.points || 0
            scr.tokens = current.tokens
            scr.playTitle = current.playTitle
            scr.correctAnswer = ''
            //scr.forTeam = current.forParticipant
            scr.forTeam = PrePickStore.teams.filter(
              o => o.id === current.participantId
            )[0]
            scr.isPresetTeamChoice = current.isPresetTeamChoice
            scr.sponsor = SponsorStore.sponsors.filter(
              o => o.id === current.sponsorId
            )[0]
            scr.showNextPlayAd = current.showNextPlayAd
            scr.nextPlayType = current.nextPlayType
            scr.choices = current.choices
              ? current.choices.sort((a, b) => a.sequence - b.sequence)
              : []
            scr.parentId = parentId
            scr.started = current.started

            screens.push(scr)
          }
        }

        screens.sort((a, b) =>
          a.id === current.id ? -1 : b.id === current.id ? 1 : 0
        )

        CommandHostStore.changePlay(screens)
      } else {
        if (
          !this.progress ||
          this.progress === 'active' ||
          this.progress === 'public' ||
          this.progress === 'pregame' ||
          this.progress === 'pending'
        ) {
          this.broadcastStandby()
        } else if (this.progress === 'postgame') {
          this.broadcastPostGame()
        } else {
          this.broadcastNextPlayAd()
        }
      }
    }

    if (data.previous) {
      if ('announce' === data.previous.type.toLowerCase()) {
        ExecuteNextPlay(data.current)
        return
      }

      if (data.previous.inProcess && !data.previous.resultConfirmed) {
        this.supplyIfAnswerIsEmpty(data.previous.id, next => {
          if (next) {
            CommandHostStore.setIsPending(true)
            CommandHostStore.setPendingPlay(CommandHostStore.currentPlay)
            /** 2secs timeout to let the pending page shows **/
            setTimeout(() => ExecuteNextPlay(data.current), 2000)
          }
        })
      } else if (!data.previous.inProcess && data.previous.resultConfirmed) {
        this.supplyIfAnswerIsEmpty(data.previous.id, next => {
          if (next) {
            CommandHostStore.setIsPending(false)
            CommandHostStore.setPendingPlay(null)
            CommandHostStore.endPlayResult(data.previous)
            /** 2secs timeout to let the result page shows **/
            setTimeout(() => ExecuteNextPlay(data.current), 2000)
          }
        })
      }
    } else {
      ExecuteNextPlay(data.current)
    }
  }

  playResolve(data) {
    CommandHostStore.setIsPending(false)
    CommandHostStore.setPendingPlay(null)
    data.result.ended = data.ended
    CommandHostStore.setResolve(data.result)
  }

  async supplyIfAnswerIsEmpty(playId, next) {
    const answerExists = await PrePickStore.answers.filter(
      o => o.questionId === playId
    )[0]
    if (answerExists) {
      if (!answerExists.isHistory) {
        console.log('answer exists but not yet in history')
        answerExists.isHistory = true
        if (next) {
          next(true)
        }
      } else {
        console.log('answer exists and already in history')
        if (next) {
          next(true)
        }
      }
    } else {
      console.log('answer not exists')
      CommandHostStore.setForcePushEmptyAnswer(playId)
      if (next) {
        next(true)
      }
    }
  }

  broadcastStandby() {
    const scr = script.filter(o => o.componentName === 'Standby')[0]
    let screens = []
    if (scr) {
      scr.id = uniqueId()
      screens.push(scr)
      CommandHostStore.changePlay(screens)
    }
  }

  broadcastNextPlayAd() {
    const nextPlayAdScreen = script.filter(
      o => o.componentName === 'NextPlayAd'
    )[0]
    let screens = []
    if (nextPlayAdScreen) {
      nextPlayAdScreen.id = uniqueId()
      screens.push(nextPlayAdScreen)
      CommandHostStore.changePlay(screens)
    }
  }

  broadcastPostGame() {
    const screen = script.filter(o => o.componentName === 'PostGame')[0]
    let screens = []
    if (screen) {
      screen.id = uniqueId()
      screens.push(screen)
      CommandHostStore.changePlay(screens)
    }
  }

  @observable
  activeSlidingFollowedGame = null
  @action
  setActiveSlidingFollowedGame(val) {
    this.activeSlidingFollowedGame = val
  }

  @observable
  isLoading = false

  gameHistories = []

  @action
  getGameHistory() {
    this.isLoading = true
    return agent.GameServer.getGameHistory({
      userId: ProfileStore.profile.userId,
    })
      .then(data => {
        for (let i = 0; i < data.gameHistory.length; i++) {
          for (let j = 0; j < data.gameHistory[i].participants.length; j++) {
            const _participant = data.gameHistory[i].participants[j]
            delete Object.assign(_participant, {
              ['gameId']: _participant['game_id'],
            })['game_id']
            delete Object.assign(_participant, {
              ['participantId']: _participant['participant_id'],
            })['participant_id']
            delete Object.assign(_participant, {
              ['bottomColor']: _participant['bottom_color'],
            })['bottom_color']
            delete Object.assign(_participant, {
              ['topColor']: _participant['top_color'],
            })['top_color']
            _participant.backgroundColor = '#bcbec0'
            _participant.scoreBackgroundColor = '#939598'
            _participant.teamNameColor = '#000000'
            _participant.scoreColor = '#ffffff'
          }

          const maxScoreParticipant = data.gameHistory[i].participants.reduce(
            (a, b) => {
              return a.score > b.score ? a : a.score < b.score ? b : null
            }
          )

          if (maxScoreParticipant) {
            const maxParticipant = data.gameHistory[i].participants.filter(
              o => o.participantId === maxScoreParticipant.participantId
            )[0]
            if (maxParticipant) {
              maxParticipant.backgroundColor = '#16c5ff'
              maxParticipant.scoreBackgroundColor = '#ffffff'
              maxParticipant.teamNameColor = '#ffffff'
              maxParticipant.scoreColor = '#000000'
            }
          }
        }

        this.gameHistories = data.gameHistory
        console.log('GAME HISTORY', data.gameHistory)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(_ => {
        this.isLoading = false
      })
  }

  @observable
  isLoadingHistoryById = false

  gameHistory = []

  @action
  getGameHistoryById(gameId) {
    this.isLoadingHistoryById = true
    const args = {
      gameId: gameId,
      userId: ProfileStore.profile.userId,
    }
    return agent.GameServer.getGameHistoryById(args)
      .then(async data => {
        console.log('GAME HISTORY BY ID', data)

        let _pp_total_count = data.prePicks.length
        let _pp_correct_answers = 0
        let _total_winning_avg = 0
        let _total_active_plays = 0
        let _winstreak_active_count = 0
        let _total_points_earned = 0

        /**
         * PrePicks
         */
        for (let a = 0; a < data.prePicks.length; a++) {
          const _pp = data.prePicks[a]
          if (_pp.correct_choice) {
            const _parsedCorrectChoice = JSON.parse(
              JSON.parse(JSON.stringify(_pp.correct_choice.replace(/'/g, '"')))
            )
            if (
              _parsedCorrectChoice &&
              Object.keys(_parsedCorrectChoice).length > 0
            ) {
              if (_parsedCorrectChoice.value) {
                if (
                  new RegExp(_pp.answer, 'gi').test(_parsedCorrectChoice.value)
                ) {
                  _pp_correct_answers += 1
                }
              }
            }
          }
        }

        const prepickFecta = await ResolveStore.fectas.filter(o =>
          new RegExp(o.keyword, 'gi').test('prepicks')
        )[0]
        if (prepickFecta) {
          const _pct = (_pp_correct_answers / _pp_total_count) * 100
          prepickFecta.percentage = isNaN(_pct) ? 0 : _pct
          _total_winning_avg += isNaN(_pct) ? 0 : _pct
          _total_active_plays += isNaN(_pct) ? 0 : 1
          _winstreak_active_count += isNaN(_pct) ? 0 : _pct >= 50 ? 1 : 0
        }

        /**
         * LivePlays
         */
        for (let j = 0; j < data.livePlays.length; j++) {
          const _playType = data.livePlays[j]
          _total_points_earned += _playType.total_points_earned
          const liveFecta = await ResolveStore.fectas.filter(o =>
            new RegExp(o.keyword, 'gi').test(_playType.type)
          )[0]
          if (liveFecta) {
            const _pct =
              (_playType.total_correct_answers / _playType.total_plays) * 100
            liveFecta.percentage = isNaN(_pct) ? 0 : _pct
            _total_winning_avg += isNaN(_pct) ? 0 : _pct
            _total_active_plays += isNaN(_pct) ? 0 : 1
            _winstreak_active_count += isNaN(_pct) ? 0 : _pct >= 50 ? 1 : 0
          }
        }

        /////////////////////////////////////////////////////////////////////////////////////

        /*
        for (let i=0; i<ResolveStore.fectas.length; i++) {
          const _fecta = ResolveStore.fectas[i]
          if (new RegExp(_fecta.keyword, 'gi').test('prepicks')) {

            for (let a=0; a<data.prePicks.length; a++) {
              const _pp = data.prePicks[a];
              if (_pp.correct_choice) {
                const _parsedCorrectChoice = JSON.parse(JSON.parse(JSON.stringify(_pp.correct_choice.replace(/'/g, '"'))));
                if (_parsedCorrectChoice && Object.keys(_parsedCorrectChoice).length > 0) {
                  if (_parsedCorrectChoice.value) {
                    if (new RegExp(_pp.answer, 'gi').test(_parsedCorrectChoice.value)) {
                      _pp_correct_answers += 1;
                    }
                  }
                }
              }
            }
            const _pct = (_pp_correct_answers / _pp_total_count) * 100;
            _fecta.percentage = isNaN(_pct) ? 0 : _pct;
            _total_winning_avg += isNaN(_pct) ? 0 : _pct;
            _total_active_plays += isNaN(_pct) ? 0 : 1;
            _winstreak_active_count += isNaN(_pct) ? 0 : (_pct >= 50 ? 1 : 0)

          } else {
            for (let j=0; j<data.livePlays.length; j++) {
              const _playType = data.livePlays[j]
              _total_points_earned += _playType.total_points_earned;
              if (new RegExp(_playType.type, 'gi').test(_fecta.keyword)) {
                const _pct = (_playType.total_correct_answers / _playType.total_plays) * 100;
                _fecta.percentage = isNaN(_pct) ? 0 : _pct;
                _total_winning_avg += isNaN(_pct) ? 0 : _pct;
                _total_active_plays += isNaN(_pct) ? 0 : 1;
                _winstreak_active_count += isNaN(_pct) ? 0 : (_pct >= 50 ? 1 : 0)
              }
            }
          }
        }
*/

        /////////////////////////////////////////////////////////////////////////////////////

        data.winstreakActiveCount = _winstreak_active_count
        data.winningAvg = Math.round(_total_winning_avg / _total_active_plays)
        data.pointsEarned = _total_points_earned

        this.gameHistory = data
      })
      .finally(_ => {
        this.isLoadingHistoryById = false
      })
  }
}

export default new GameStore()
