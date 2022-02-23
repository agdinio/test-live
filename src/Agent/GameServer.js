import util from 'util'
import socketCluster from 'socketcluster-client'
import PlayStore from '@/stores/PlayStore'
import ProfileStore from '@/stores/ProfileStore'
import CommonStore from '@/stores/CommonStore'
import CommandHostStore from '@/stores/CommandHostStore'
import GameStore from '@/stores/GameStore'
import config from '@/Agent/config'
import { anonymousToken } from '@/utils'

let socket = null
let gameSubscriptionChannel = null
let gameChannelName = null
let userId = null
const API_URL = `${config.PROTOCOL}://${config.URL}:${config.PORT}`

//let gameId = null //+mod by yp
// Used to establish connection with Ambassador Server
// hostname will need to be changed when the Server is
//    running somewhere else besides localhost
// TODO: Hardcode live connection string
const connectOptions = {
  //hostname: 'ec2-54-202-177-20.us-west-2.compute.amazonaws.com',
  hostname: config.URL,
  //hostname: 'ec2-35-164-175-253.us-west-2.compute.amazonaws.com',
  //update1 hostname: 'ec2-54-188-137-103.us-west-2.compute.amazonaws.com',
  port: config.PORT,
  path: '/socketcluster',
  multiplex: false,
  // autoReconnectOptions: {
  //   initialDelay: 6000,
  //   randomness: 10000,
  //   multiplier: 1.5,
  //   maxDelay: 60000,
  // },
}

//------------------------------------------------------------------------
const debug = obj => {
  return console.log(util.inspect(obj, { depth: null }))
}

//------------------------------------------------------------------------

const connect = () => {
  if (socket == null) {
    socket = socketCluster.create(connectOptions)

    socket.on('subscribeFail', function(channelname) {
      console.log(
        '[Server Socket] Failed to Subscibe to Channel:' + channelname
      )
      if (channelname === 401) {
      }
    })

    socket.on('connect', (status, processSubscriptions) => {
      console.log('Game Socket is connected')
      // Add code here to check if authenticated
      if (status.isAuthenticated) {
        console.log('connection status:')
        debug(status)
        CommandHostStore.setAuthenticated(true)
        /////////////////////////////////////////////////////=>GameStore.subscribeToGame()
        //ProfileStore.getProfile()
      } else {
        console.log('client not authenticated:')
        debug(status)
        CommandHostStore.setAuthenticated(false)
        anonymousLogin()
      }

      socket.on('game.info', data => {
        console.log('GAME.INFO', data)
        GameStore.setInfo(data)
        //if(data.info && data.info.gameId) {gameId = data.info.gameId;} //+mod by yp
      })

      socket.on('user.login.respond', data => {
        console.log('USER.LOGIN.RESPOND', data)
        GameStore.setUserProfile(data)
      })

      socket.on('user.anonymous.login.respond', data => {
        console.log('USER.ANONYMOUS.LOGIN.RESPOND')
        populateAnonymous(data)
      })
    })

    socket.on('close', res => {
      console.log(`[Server Socket] Socket has closed`, res)
    })

    socket.on('error', res => {
      console.log('Game Server Error', res)
      // CommonStore.setIsServerDisconnected(true)
      window.location.reload(true)
    })

    socket.on('disconnect', res => {
      console.log(`[Server Socket] Socket has disconnected`, res)
      socket.destroy()
    })
  }
}

export function send(channel, data) {
  //if(!data.game_id && gameId) {data.game_id = gameId;} //+mod by yp
  return new Promise((resolve, reject) => {
    connect()
    console.log(`[Server Send : ${channel}]`)
    socket.emit(channel, data, response => {
      if (response) {
        if (response.success) {
          return resolve(response.response)
        } else {
          if (response.error) {
            return reject(response.error)
          }
        }
      }
    })
  })
}

export const activeGame = gameType => {
  send('games.active', [gameType]).then(response => {
    if (response && response.length > 0) {
      console.log('GAMES.ACTIVE', response)
      initGameServer(response[0])
    } else {
      pendingGame()
    }
  })
}

const pendingGame = () => {
  send('games.pending', { progress: 'Pending' }).then(response => {
    console.log('GAMES.PENDING', response)
    if (response && response.length > 0) {
      initGameServer(response[0])
    }
  })
}

const initGameServer = data => {
  PlayStore.setGame(data)

  if (data.playStack && !data.playStack.currentPlay) {
    PlayStore.broadcastStandby()
  }

  const gameChannelName = data.id + '.game'
  socket.destroyChannel(gameChannelName)

  const socketSubscriptions = socket.subscriptions(true)
  let gameSubscriptionChannel
  if (socketSubscriptions.indexOf(gameChannelName) >= 0) {
    gameSubscriptionChannel = socket.channel(gameChannelName)
  } else {
    gameSubscriptionChannel = socket.subscribe(gameChannelName)
  }

  if (gameSubscriptionChannel.watchers().length <= 0) {
    gameSubscriptionChannel.watch(data => {
      switch (data.event) {
        case 'games.start':
          console.log('GAMES.START', data)
          break
        case 'games.startplay':
          console.log('GAMES.STARTPLAY', data.data)
          PlayStore.gamesStartPlay(data.data)
          break
        case 'games.endplay':
          console.log('GAMES.ENDPLAY', data.data)
          PlayStore.setGamesEndPlayId(data.data)
          break
        case 'plays.update':
          console.log('PLAYS.UPDATE', data.data)
          PlayStore.playsUpdate(data.data)
          break
        case 'games.update':
          console.log('GAMES.UPDATE', data.data)
          PlayStore.setGame(data.data)
          break
        case 'database.reset':
          console.log('DATABASE.RESET', data.data)
          PlayStore.databaseReset(true)
          break
      }
    })
  }

  send('games.subscribe', {
    playerId: ProfileStore.profile.userId,
    games: data.id,
  }).then(res => {
    console.log('GAMES SUBSCRIBED')
    console.log('USERID', ProfileStore.profile.userId)
  })

  send('games.read', {
    entityType: 'GameType',
    id: data.type.toLowerCase(),
  }).then(response => {
    PlayStore.getPredetermined(response)
  })

  PlayStore.databaseReset(false)
}

///////////////////////////////////////////MY OWN CONFIG////////////////////////////////////////////////////////////////
export const sendBeaconEventTimeStop = args => {
  navigator.sendBeacon(`${API_URL}/analytics/time_stop`, JSON.stringify(args))
}

export const sendBeaconEventPendingGamePlay = args => {
  navigator.sendBeacon(
    `${API_URL}/analytics/set_pending_gameplay`,
    JSON.stringify(args)
  )
}

export const sendBeaconUserCreatePrize = args => {
  navigator.sendBeacon(
    `${API_URL}/user/user_create_prize`,
    JSON.stringify(args)
  )
}

const anonymousLogin = () => {
  let _user = localStorage.getItem('ANONYMOUS_USER')
  if (_user) {
    _user = JSON.parse(_user)
    send('user.anonymous.login', {
      anonymousUserId: _user.anonymousUserId,
    }).then(data => {
      console.log('ANONYMOUS LOGIN')
      populateAnonymous(data)
    })
  } else {
    send('user.anonymous.signup', {}).then(data => {
      console.log('ANONYMOUS SIGNUP')
      populateAnonymous(data)
    })
  }
}

function populateAnonymous(data) {
  GameStore.setAnonymousUserProfile(data)
  CommandHostStore.setAuthenticated(true)
  if (data && data.anonymousUserId) {
    localStorage.setItem(
      'ANONYMOUS_USER',
      JSON.stringify({ anonymousUserId: data.anonymousUserId })
    )
  }
}

export const connectSC = () => {
  connect()
}

export const signup = args => {
  return send('user.signup', args)
}

export const signout = args => {
  console.log('args', args)
  return anonymousLogin()
}

export const login = args => {
  console.log('login response', args)
  return send('user.login', args)
}

export const forgotPassword = args => {
  return send('user.forgotpassword', args)
}

export const codeVerification = args => {
  return send('user.codeverification', args)
}

export const resetPassword = args => {
  return send('user.resetpassword', args)
}

export const debitCurrencies = args => {
  return send('user.award.debit', args)
}

export const creditCurrencies = args => {
  return send('user.award.credit', args)
}

export const addHistoryPrePick = args => {
  return send('user.create.prepick', args)
}

export const addHistoryPlay = args => {
  return send('user.add.historyplay', args)
}

export const updateHistoryPlay = args => {
  return send('user.update.historyplay', args)
}

export const getSportTypes = args => {
  return send('app.read.sporttype', args)
}

export const getGamesByCategory = args => {
  return send('app.read.games', args)
}

export const getUserPrePicks = args => {
  return send('user.read.prepicks', args)
}

export const getPrizeBoards = args => {
  return send('app.read.prizeboard', args)
}

export const userCreatePrize = args => {
  return send('user.create.prize', args)
}

export const getTopEarners = args => {
  return send('app.read.topearners', args)
}

export const getPrizeChest = args => {
  return send('app.read.prizechest', args)
}

export const updateProfile = args => {
  return send('user.update.profile', args)
}

export const readCountries = args => {
  return send('app.read.countries', args)
}

export const readPaymentInfo = args => {
  return send('user.read.payment.info', args)
}

export const readZonesByCountry = args => {
  return send('app.read.zones.by.country', args)
}

export const readCitiesByZone = args => {
  return send('app.read.cities.by.zone', args)
}

export const paymentToken = args => {
  return send('user.billing.payment', args)
}

export const readTokenProducts = args => {
  return send('app.read.token.products', args)
}

export const getFollowedGames = args => {
  return send('user.followed.games', args)
}

export const getGameHistory = args => {
  return send('user.read.game.history', args)
}

export const getGameHistoryById = args => {
  return send('user.read.game.history.by.id', args)
}

export const getStarPrizesByCategory = args => {
  return send('app.read.starprize.by.category', args)
}

export const analyticsTimeStart = args => {
  // if (!args.userId) {
  //   fetch('https://api.ipify.org/?format=json')
  //     .then(results => results.json())
  //     .then(data => {
  //       args.userId = data.ip;
  //
  //       console.log('IP XXX', args)
  //       return send('analytics.time.start', args)
  //     })
  // } else {
  //   return send('analytics.time.start', args)
  // }
  return send('analytics.time.start', args)
}

export const analyticsTimeStop = args => {
  return send('analytics.time.stop', args)
}

export const addFlag = args => {
  return send('analytics.flag.add', args)
}

export const setPendingGamePlay = args => {
  return send('user.set.pending.gameplay', args)
}

export const subscribeToGame = (args, gameEvents) => {
  connect()

  userId = args.userId
  gameChannelName = `${args.event}.game`

  if (gameEvents && gameEvents.length > 0) {
    gameEvents.forEach(gEvent => {
      if (args.event !== gEvent) {
        const existingSubscription = socket.subscriptions(true)
        const gameToUnsubs = `${gEvent}.game`
        if (existingSubscription.indexOf(gameToUnsubs) >= 0) {
          socket.unsubscribe(gameToUnsubs)
        }
      }
    })
  }

  const socketSubscriptions = socket.subscriptions(true)
  if (socketSubscriptions.indexOf(gameChannelName) >= 0) {
    socket.unsubscribe(gameChannelName)
  }

  gameSubscriptionChannel = socket.subscribe(gameChannelName)

  /*
  const socketSubscriptions = socket.subscriptions(true)
  let gameSubscriptionChannel
  if (socketSubscriptions.indexOf(gameChannelName) >= 0) {
    gameSubscriptionChannel = socket.channel(gameChannelName)
  } else {
    gameSubscriptionChannel = socket.subscribe(gameChannelName)
  }
*/

  if (gameSubscriptionChannel.watchers().length <= 0) {
    gameSubscriptionChannel.watch(data => {
      switch (data.event) {
        case 'game.game.update':
          console.log('GAME UPDATE', data)
          GameStore.gameUpdate(data.data, data.hasReset)
          break
        case 'game.play.update':
          console.log('PLAY UPDATE\n', data.data)
          GameStore.playUpdate(data.data)
          break
        case 'game.play.resolved':
          console.log('PLAY RESOLVED', data.data)
          GameStore.playResolve(data.data)
          break
        case 'automation.host.update':
          console.log('AUTOMATION.HOST.UPDATE', data.data)
          break
        case 'automation.game.state':
          console.log('AUTOMATION.GAME.STATE', data.data)
          GameStore.setAutomationGameState(data.data)
          break
      }
    })
  }
}

export const unsubscribeToGame = args => {
  const socketSubscriptions = socket.subscriptions(true)
  if (socketSubscriptions.indexOf(gameChannelName) >= 0) {
    socket.unsubscribe(gameChannelName)
  }
}
