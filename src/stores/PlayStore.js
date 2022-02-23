import { observable, action, computed } from 'mobx'
import agent from '@/Agent'
import script from '@/stores/PlayScript'
import PrePickStore from '@/stores/PrePickStore'
import CommandHostStore from '@/stores/CommandHostStore'

class PlayStore {
  @observable
  playToStart = null

  @observable
  hasPlayUpdated = false

  @observable
  game = null

  @action
  setGame(val) {
    this.game = val
    //agent.Storage.setItem('gameid', val.id)
    agent.Storage.setGameId(val.id)
    //agent.Storage.setItem('gameserver', val)
    agent.Storage.setGameServer(val)

    //GAME HAS ENDED
    if (val.progress === 4) {
      console.log('GAME HAS ENDED')
    }
  }

  @observable
  anyTypes = 'liveplay1x, gamemaster, sponsorplay, prizeplay, announce'

  @observable
  resolvedTypes = 'liveplay1x, gamemaster, sponsorplay, prizeplay'

  @observable
  gameAppTypes = 'liveplay, gamemaster, sponsor, prize'

  @observable
  presetItems = []
  @action
  resetPresetItems() {
    this.presetItems = []
  }

  @observable
  baseOptions
  @action
  setBaseOptions(val) {
    this.baseOptions = val
  }

  @observable
  baseDefaults
  @action
  setBaseDefaults(val) {
    this.baseDefaults = val
  }

  @observable
  predetermined
  @action
  setPredetermined(val) {
    this.predetermined = val
  }

  @observable
  gamesEndPlayId = null
  @action
  setGamesEndPlayId(val) {
    this.gamesEndPlayId = val
    this.playsUpdateFunctionCount = 0
  }

  isReloaded = false
  @action
  setIsReloaded(val) {
    this.isReloaded = val
  }

  playsUpdateFunctionCount = 0

  get currentPlay() {
    return this.getMaxItem(PrePickStore.answers)
  }

  connectGameServer() {
    this.isReloaded = true
    agent.GameServer.activeGame('NFLFOOTBALL')
  }

  extractTeams() {
    if (
      this.game &&
      this.game.participants &&
      this.game.participants.length > 0
    ) {
      let teams = []
      this.game.participants.forEach((name, idx) => {
        teams.push({
          iconBottomColor: '#0e264b',
          iconTopColor: '#be0824',
          id: idx + 1,
          index: idx,
          initial: name.charAt(0),
          score: 0,
          teamName: name,
        })
      })

      PrePickStore.setTeams(teams)
    }
  }

  assignIdOnPredetermined() {
    this.resetPresetItems()

    let id = 0
    for (let i = 0; i < this.predetermined.length; i++) {
      this.predetermined[i].id = ++id
    }

    for (let j = 0; j < this.baseOptions.length; j++) {
      this.baseOptions[j].id = ++id
    }

    for (let k = 0; k < this.baseDefaults.length; k++) {
      this.baseDefaults[k].id = ++id
    }
  }

  extractPreDetermined() {
    if (this.predetermined && this.predetermined.length > 0) {
      this.predetermined.forEach(item => {
        let choices = []
        if (item.values && item.values.length > 0) {
          item.values.forEach(value => {
            let valueToFind = this.baseOptions.filter(
              o => o.choice.trim().toLowerCase() === value.trim().toLowerCase()
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
        this.presetItems.push(pre)
      })
    }
  }

  extractBaseOptions() {
    const _baseOptions = [...this.baseOptions]
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
        this.presetItems.push(pre)
      })
    }
  }

  addNonLivePlayOptions() {
    let id = this.presetItems.length
    const nonLivePlayAB = {
      id: ++id,
      preset: 'A-B (Y/N)',
      question: '',
      choices: [{ value: 'yes' }, { value: 'no' }],
      readOnly: true,
      type: 'GameMaster, Sponsor, Prize',
    }
    this.presetItems.push(nonLivePlayAB)

    const nonLivePlayABTeams = {
      id: ++id,
      preset: 'A-B (TEAMS)',
      question: '',
      choices: [],
      readOnly: true,
      type: 'GameMaster, Sponsor, Prize',
    }
    this.presetItems.push(nonLivePlayABTeams)
  }

  multipliersFromStackByPlayId(_groupPlays) {
    let predetermined = []

    if (_groupPlays && _groupPlays.length > 0) {
      _groupPlays.forEach(mulPlay => {
        let preset = {}
        let choices = extractMultiplierByPlay(_groupPlays, mulPlay)
        if (choices && choices.length > 0) {
          if (mulPlay.type.match(/liveplay1x/gi)) {
            preset = {
              choices: choices,
              id: mulPlay.id,
              locked: false,
              preset: mulPlay.predeterminedName || 'kick off',
              question: mulPlay.questionStatement,
              type: 'LivePlay',
            }
          } else {
            //value either liveplay2x or liveplay3x
            preset = {
              choices: choices,
              id: mulPlay.id,
              isMultiplier: true,
              locked: false,
              preset: 'multiplier',
              question: mulPlay.questionStatement,
              type: 'LivePlay',
            }
          }
          predetermined.push(preset)
        } else {
          //NO NEXT
          let choicesNoNext = []
          if (mulPlay.values && mulPlay.values.length > 0) {
            mulPlay.values.forEach(choice => {
              choicesNoNext.push({ value: choice })
            })
          }

          if (mulPlay.type.match(/liveplay/gi)) {
            preset = {
              choices: choicesNoNext,
              id: mulPlay.id,
              isMultiplier: true,
              locked: false,
              preset: 'multiplier',
              question: mulPlay.questionStatement,
              type: 'LivePlay',
            }
          } else {
            let exp = RegExp(
              mulPlay.predeterminedName
                ? mulPlay.predeterminedName.replace(/(?=[() ])/g, '\\')
                : 'a-b'.replace(/(?=[() ])/g, '\\'),
              'gi'
            )
            let presetName = this.presetItems.filter(o =>
              o.preset.match(exp)
            )[0]
            if (!presetName) {
              presetName = mulPlay.predeterminedName.match(/teams/gi)
                ? 'A-B (TEAMS)'
                : 'A-B (Y/N)'
            }
            preset = {
              id: mulPlay.id,
              preset: presetName.preset,
              question: mulPlay.questionStatement,
              choices: choicesNoNext,
              readOnly: true,
              type: 'GameMaster, Sponsor, Prize',
            }
          }
          predetermined.push(preset)
        }
      })
    }

    return predetermined

    function extractMultiplierByPlay(groupPlays, mulPlayBase) {
      let choices = []
      const multiplier = mulPlayBase.type.replace(/[^0-9]/g, '')
      const filteredGroupPlays = groupPlays.filter(
        o =>
          parseInt(o.type.replace(/[^0-9]/g, '')) === parseInt(multiplier) + 1
      )

      for (let i = 0; i < mulPlayBase.values.length; i++) {
        const baseValue = mulPlayBase.values[i]

        for (let j = 0; j < filteredGroupPlays.length; j++) {
          let groupPlayChoices = filteredGroupPlays[j]

          const found = groupPlayChoices.choice.filter(
            o => o.trim().toLowerCase() === baseValue.trim().toLowerCase()
          )[0]
          if (found) {
            const value = found.trim().toLowerCase()
            const nextId = filteredGroupPlays[j].id
            if (!choices.filter(o => o.value === value)[0]) {
              choices.push({ value: value, nextId: nextId })
            }
          }
        }

        const checkNoNextIdValue = choices.filter(
          o => o.value.trim().toLowerCase() === baseValue.trim().toLowerCase()
        )[0]
        if (!checkNoNextIdValue) {
          choices.push({ value: baseValue })
        }
      }

      return choices
    }
  }

  getBasePreset(play) {
    const predeterminedName = play.predeterminedName || ''
    let preset = this.presetItems.filter(
      o =>
        o.preset.trim().toLowerCase() === predeterminedName.trim().toLowerCase()
    )[0]
    if (!preset) {
      preset = this.presetItems.filter(
        o =>
          o.question.trim().toLowerCase() ===
          play.questionStatement.trim().toLowerCase()
      )[0]
    }
    return preset
  }

  formatAnnouncePlay(play) {
    const announces = []
    announces.push({ area: 'header', value: play.header || '' })
    announces.push({ area: 'middle', value: play.middle || '' })
    announces.push({ area: 'bottom', value: play.bottom || '' })

    return {
      id: play.id,
      index: play.id,
      announcements: announces,
      choices: [],
      playTitle: '',
      sponsor: play.sponsorBranding,
      sponsorExpanded: false,
      stars: 0,
      type: play.type,
      started: play.started,
    }
  }

  formatPlay(play, groupPlays) {
    try {
      const multiChoices = this.multipliersFromStackByPlayId(groupPlays)
      const preset = this.getBasePreset(play)
      const selectedTeam =
        play.participant > -1 ? PrePickStore.teams[play.participant] : null

      let playType = ''
      if (play.type.match(/liveplay/gi)) {
        playType = 'LivePlay'
      } else if (play.type.match(/sponsor/gi)) {
        playType = 'Sponsor'
      } else if (play.type.match(/prize/gi)) {
        playType = 'Prize'
      } else if (play.type.match(/gamemaster/gi)) {
        playType = 'GameMaster'
      } else {
        playType = play.type
      }

      let item = {
        id: play.id,
        award: '',
        choices: preset.choices || [],
        index: play.id,
        length: 0,
        lockedOut: play.lockedOut,
        lockedReuse: false,
        multiplierChoices: multiChoices || [],
        nextPlayType: null,
        playTitle: {
          id: preset.id,
          value: preset.question || play.questionStatement,
        },
        preset: {},
        showNextPlayAd: false,
        sponsor: play.sponsorBranding || null,
        stars: play.awardValues.stars || 0,
        points: play.awardValues.points || 0,
        tokens: play.awardValues.tokens || 0,
        team: selectedTeam,
        isPresetTeamChoice:
          play.predeterminedName &&
          play.predeterminedName.match(/teams/gi) &&
          play.predeterminedName.match(/teams/gi).length > 0
            ? true
            : false,
        type: playType,
        playInProcess: play.playInProcess,
        resultConfirmed: play.resultConfirmed,
        result: play.result,
        started: play.started,
      }

      return item
    } catch (err) {
      this.connectGameServer()
    }

    return null
  }

  getMaxItem(arr) {
    let max = null
    if (arr && arr.length > 0) {
      console.log('---------------.STARTED GREATER THAN')
      max = arr.reduce((prev, curr) => {
        return prev.started > curr.started ? prev : curr
      })
    }

    return max
  }

  broadcastPlay(val) {
    if (!val) {
      return
    }

    let screens = []
    let parentId = null

    let screen = script.filter(o => o.type === val.type)[0]
    if (!screen) {
      screen = script.filter(o => o.type === val.type)[0]
    }

    if ('announce' === screen.type.trim().toLowerCase()) {
      screen.type = val.type
      screen.id = val.id
      screen.index = val.index
      screen.nextPlayType = val.nextPlayType
      screen.announcements = val.announcements
      screen.sponsor = val.sponsor
      screen.started = val.started

      screens.push(screen)
    } else {
      val.multiplierChoices.forEach((obj, idx) => {
        let scr = { ...screen }

        if (idx === 0) {
          parentId = obj.id
        }

        //this.setChoiceNextId(val, obj, genId)
        //obj.id = genId
        scr.id = obj.id
        scr.length = parseInt(val.length)
        //scr.stars = idx + 1 === parseInt(val.stars) ? 1 : 0
        scr.stars = parseInt(val.stars)
        scr.points = val.points
        scr.tokens = val.tokens
        scr.playTitle = obj.question
        scr.correctAnswer = ''
        scr.forTeam = val.team
        scr.isPresetTeamChoice = val.isPresetTeamChoice
        scr.sponsor = val.sponsor
        scr.showNextPlayAd = val.showNextPlayAd
        scr.nextPlayType = val.nextPlayType
        scr.choices = obj.choices
        scr.parentId = parentId
        scr.started = val.started

        screens.push(scr)
      })
    }

    CommandHostStore.changePlay(screens)
  }

  broadcastStandby() {
    const scr = script.filter(o => o.componentName === 'Standby')[0]
    let screens = []
    if (scr) {
      scr.id = this.createUUID()
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
      screens.push(nextPlayAdScreen)
      CommandHostStore.changePlay(screens)
    }
  }

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

  /** ***************************************************************************************************************** **/

  getPredetermined(data) {
    this.baseOptions = data.baseoptions
    this.predetermined = data.predetermined
    this.baseDefaults = data.defaults

    this.extractTeams()
    this.assignIdOnPredetermined()
    this.extractPreDetermined()
    this.extractBaseOptions()
    this.addNonLivePlayOptions()
  }

  gamesStartPlay(data) {
    this.playsUpdateFunctionCount = 0

    /**
     * IF AN ANNOUNCE PLAY
     */
    const announcePlay = data.play.plays[data.play.head]
    if (announcePlay && 'announce' === announcePlay.type.toLowerCase()) {
      if (announcePlay.ended) {
        this.broadcastNextPlayAd()
        return
      }

      /** check localstorage for any changes **/
      CommandHostStore.evaluateLocalStorage(announcePlay)

      const latestHistoryAnswer = this.getMaxItem(PrePickStore.answers)
      if (latestHistoryAnswer) {
        console.log('---------------.STARTED GREATER THAN')
        if (latestHistoryAnswer.started > announcePlay.started) {
          this.broadcastNextPlayAd()
          return
        } else {
          this.playToStart = data
          if (!this.hasPlayUpdated) {
            if (
              CommandHostStore.currentPlay &&
              this.gameAppTypes.match(
                new RegExp(CommandHostStore.currentPlay.type, 'gi')
              )
            ) {
              /**
               * fallback in case there is no plays.update event
               * execute the supplyIfAnswerIsEmpty method if GO button is hit in the assembly area of the c-host
               */
              const existsAndNotPending = PrePickStore.answers.filter(
                o => o.questionId === CommandHostStore.currentPlay.id
              )[0]
              if (
                existsAndNotPending &&
                existsAndNotPending.length &&
                existsAndNotPending.length > 0
              ) {
                this.supplyIfAnswerIsEmpty(
                  CommandHostStore.currentPlay.id,
                  next => {
                    if (next) {
                      CommandHostStore.setIsPending(true)
                      CommandHostStore.setPendingPlay(
                        CommandHostStore.currentPlay
                      )
                      setTimeout(() => {
                        this.hasPlayUpdated = false
                        this.executeNewPlay()
                      }, 2000)
                    }
                  }
                )
              } else {
                //added 6/18/2019 8:41pm
                if (existsAndNotPending) {
                  if (existsAndNotPending.questionId === this.gamesEndPlayId) {
                    this.gamesEndPlayId = null
                    this.executeNewPlay()
                  } else {
                    CommandHostStore.setIsPending(true)
                    CommandHostStore.setPendingPlay(
                      CommandHostStore.currentPlay
                    )
                    setTimeout(() => {
                      this.executeNewPlay()
                    }, 2000)
                  }
                } else {
                  // not exists and not pending, then no answer(s) has been selected
                  console.error('ERROR 11111')
                  const idForEmptyPlay = CommandHostStore.currentPlay
                    ? CommandHostStore.currentPlay.id
                    : ''
                  CommandHostStore.setForcePushEmptyAnswer(idForEmptyPlay)
                  this.executeNewPlay()
                }
              }
            } else {
              console.error('ERROR 22222')
              this.executeNewPlay()
            }
          }
          return
        }
        return
      } else {
        //this.broadcastNextPlayAd()
        this.playToStart = data
        if (!this.hasPlayUpdated) {
          if (
            CommandHostStore.currentPlay &&
            this.gameAppTypes.match(
              new RegExp(CommandHostStore.currentPlay.type, 'gi')
            )
          ) {
            /**
             * fallback in case there is not plays.update event
             * execute the supply method if GO button is hit in the assembly area of the c-host
             */
            const existsAndNotPending = PrePickStore.answers.filter(
              o => o.questionId === CommandHostStore.currentPlay.id
            )[0]
            if (
              existsAndNotPending &&
              existsAndNotPending.length &&
              existsAndNotPending.length > 0
            ) {
              this.supplyIfAnswerIsEmpty(
                CommandHostStore.currentPlay.id,
                next => {
                  if (next) {
                    CommandHostStore.setIsPending(true)
                    CommandHostStore.setPendingPlay(
                      CommandHostStore.currentPlay
                    )
                    setTimeout(() => {
                      this.hasPlayUpdated = false
                      this.executeNewPlay()
                    }, 2000)
                  }
                }
              )
            } else {
              console.error('ERROR 1')
              //this.executeNewPlay()
              //added 7/20/2019 9:05pm
              if (existsAndNotPending) {
                if (existsAndNotPending.questionId === this.gamesEndPlayId) {
                  this.gamesEndPlayId = null
                  this.executeNewPlay()
                } else {
                  CommandHostStore.setIsPending(true)
                  CommandHostStore.setPendingPlay(CommandHostStore.currentPlay)
                  setTimeout(() => {
                    this.executeNewPlay()
                  }, 2000)
                }
              } else {
                // not exists and not pending, then no answer(s) has been selected
                console.error('ERROR 11111')
                const idForEmptyPlay = CommandHostStore.currentPlay
                  ? CommandHostStore.currentPlay.id
                  : ''
                CommandHostStore.setForcePushEmptyAnswer(idForEmptyPlay)
                this.executeNewPlay()
              }
            }
          } else {
            console.error('ERROR 1.1')
            this.executeNewPlay()
          }
        }
        return
      }

      //BEFORE THE GAMESERVER MODIFIED FOR ANNOUNCE PLAY
      // if (announcePlay.playInProcess && announcePlay.lockedOut) {
      //   this.broadcastNextPlayAd()
      //   return
      // }
    }

    /**
     * IF A PLAY HAS BEEN CONFIRMED
     */
    const isConfirmedPlay = data.play.plays[data.play.head]
    if (isConfirmedPlay.ended && isConfirmedPlay.resultConfirmed) {
      this.broadcastNextPlayAd()
      return
    }

    /**
     * when a page is reloaded.
     *
     * when the very last play is an announce play and becomes ended,
     * the play before it becomes the very last play.
     * and sometimes the latter's lockedOut value is still set to false
     * due to the announce play go button logic at the C-Host assembly area.
     * this has to be fixed in the backend.
     * for the meantime not cause an error,
     * lines of code has been added to fill the gap.
     */
    const isStartPlayInHistory = PrePickStore.answers.filter(
      o => o.questionId === data.play.head
    )[0]
    if (isStartPlayInHistory && isStartPlayInHistory.isHistory) {
      this.broadcastNextPlayAd()
      return
    }

    this.playToStart = data

    if (!this.hasPlayUpdated) {
      const playInProcessPlay = data.play.plays[data.play.head]
      if (playInProcessPlay.lockedOut && !playInProcessPlay.resultConfirmed) {
        this.broadcastNextPlayAd()
      } else {
        if (
          CommandHostStore.currentPlay &&
          this.gameAppTypes.match(
            new RegExp(CommandHostStore.currentPlay.type, 'gi')
          )
        ) {
          /**
           * fallback in case there is not plays.update event
           * execute the supply method if GO button is hit in the assembly area of the c-host
           */
          const existsAndNotPending = PrePickStore.answers.filter(
            o => o.questionId === CommandHostStore.currentPlay.id
          )[0]
          if (
            existsAndNotPending &&
            existsAndNotPending.length &&
            existsAndNotPending.length > 0
          ) {
            this.supplyIfAnswerIsEmpty(
              CommandHostStore.currentPlay.id,
              next => {
                if (next) {
                  if (this.isContinue) {
                    this.isReloaded = false
                    CommandHostStore.setIsPending(true)
                    CommandHostStore.setPendingPlay(
                      CommandHostStore.currentPlay
                    )
                    setTimeout(() => {
                      this.hasPlayUpdated = false
                      this.executeNewPlay()
                    }, 2000)
                  }
                }
              }
            )
          } else {
            console.error('ERROR 2')
            if (this.isContinue) {
              this.isReloaded = false
              this.executeNewPlay()
            }
          }
        } else {
          console.error('ERROR 2.2')
          if (this.isContinue) {
            this.isReloaded = false
            this.executeNewPlay()
          }
        }
      }
    }
  }

  @computed
  get isContinue() {
    /**
     * used to prevent unnecessary reloading of existing/current play
     * when this app is opened or reloaded from another browser.
     * @type {boolean}
     */
    let ret = true
    if (CommandHostStore.currentPlay && this.playToStart) {
      if (
        CommandHostStore.currentPlay.id === this.playToStart.play.head &&
        !this.isReloaded
      ) {
        ret = false
      }
    }

    return ret
  }

  playsUpdate(data) {
    /**
     * count the number that this function executed.
     * executing more than 1 consecutively means
     * the player did not start the game from
     * the beginning so there must be an
     * existing pending play in the gameserver
     * that does not exists in the gameapp.
     */
    if (this.playsUpdateFunctionCount > 0) {
      this.playsUpdateFunctionCount = 0
      return
    } else {
      this.playsUpdateFunctionCount++
    }

    /** SEPARATE TRANSACTION **/
    if (data.id && data.resultConfirmed && data.ended) {
      this.supplyIfAnswerIsEmpty(data.id, next => {
        if (next) {
          this.resolvePendingPlay(data)
        }
      })
      return
    }

    if (data.head && data.plays) {
      /** SEPARATE TRANSACTION **/
      const playExistsInHistory = PrePickStore.answers.filter(
        o => o.questionId === data.head
      )[0]

      if (playExistsInHistory && playExistsInHistory.isHistory) {
        console.log('IS IN HISTORY', playExistsInHistory.isHistory)
        return
      }

      this.hasPlayUpdated = true

      /** SEPARATE TRANSACTION **/
      const playToCheckResultConfirmed = data.plays[data.head]
      if (
        playToCheckResultConfirmed &&
        playToCheckResultConfirmed.resultConfirmed
      ) {
        setTimeout(() => {
          this.hasPlayUpdated = false
          this.executeNewPlay()
        }, 2000)
        return
      }

      /** SEPARATE TRANSACTION **/
      this.supplyIfAnswerIsEmpty(data.head, next => {
        if (next) {
          const currentPlay = data.plays[data.head]
          //*****************************************************************
          let condition = false
          if ('announce' === currentPlay.type.toLowerCase()) {
            condition =
              currentPlay &&
              currentPlay.playInProcess &&
              !currentPlay.resultConfirmed
          } else {
            condition =
              currentPlay &&
              currentPlay.lockedOut &&
              currentPlay.playInProcess &&
              !currentPlay.resultConfirmed
          }
          //*****************************************************************
          if (
            currentPlay &&
            currentPlay.lockedOut &&
            currentPlay.playInProcess &&
            !currentPlay.resultConfirmed
          ) {
            if ('announce' === currentPlay.type.toLowerCase()) {
              this.hasPlayUpdated = false
              this.executeNewPlay()
            } else {
              CommandHostStore.setIsPending(true)
              CommandHostStore.setPendingPlay(currentPlay)
              setTimeout(() => {
                this.hasPlayUpdated = false
                this.executeNewPlay()
              }, 2000)
            }
          }
        }
      })
    }
  }

  executeNewPlay() {
    const data = JSON.parse(JSON.stringify(this.playToStart))

    if (data && data.play && data.play.plays) {
      this.playToStart = null
      const playToFormat = data.play.plays[data.play.head]
      if (playToFormat) {
        let groupPlays = []
        for (let p in data.play.plays) {
          groupPlays.push(data.play.plays[p])
        }

        if (groupPlays && groupPlays.length > 0) {
          const formattedPlay =
            playToFormat.type.trim().toLowerCase() === 'announce'
              ? this.formatAnnouncePlay(playToFormat)
              : this.formatPlay(playToFormat, groupPlays)
          this.broadcastPlay(formattedPlay)
        }
      }
    }
  }

  resolvePendingPlay(pendingPlay) {
    debugger
    CommandHostStore.setIsPending(false)
    CommandHostStore.setPendingPlay(null)

    const isAnswerExists = PrePickStore.answers.filter(
      o => o.questionId === pendingPlay.id
    )[0]
    if (!isAnswerExists) {
      CommandHostStore.setForcePushEmptyAnswer(pendingPlay.id)
    }

    if (pendingPlay.result && pendingPlay.result.status === 'pending') {
      CommandHostStore.setResolve(pendingPlay.result)
    } else {
      if ('announce' === pendingPlay.type.toLowerCase()) {
        if (!pendingPlay.result.hasNextPlay) {
          this.broadcastNextPlayAd()
        }
        return
      }

      CommandHostStore.endPlayResult(pendingPlay.result)
      if (!pendingPlay.result.hasNextPlay) {
        setTimeout(() => {
          this.broadcastNextPlayAd()
        }, 2000)
      }
    }
  }

  supplyIfAnswerIsEmpty(playId, next) {
    const answerExists = PrePickStore.answers.filter(
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

  createUUID() {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 10; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }

    var uuid = s.join('')
    return uuid
  }

  databaseReset(isReset) {
    if (isReset) {
      CommandHostStore.resetDatabase(true)
      agent.Storage.clear()
      agent.Storage.removeProfileCurrencies()
      this.broadcastNextPlayAd()
      setTimeout(() => {
        window.location.reload(true)
        agent.GameServer.activeGame('NFLFOOTBALL')
      }, 2000)
    } else {
      CommandHostStore.resetDatabase(false)
    }
  }
}

export default new PlayStore()
