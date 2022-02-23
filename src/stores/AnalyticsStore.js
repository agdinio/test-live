import { observable, action } from 'mobx'
import agent from '@/Agent'
import ProfileStore from '@/stores/ProfileStore'
import NavigationStore from '@/stores/NavigationStore'
import CommandHostStore from '@/stores/CommandHostStore'

class AnalyticsStore {
  pages = []

  timeStart(args) {
    if (ProfileStore.profile.userId) {
      args.userId = ProfileStore.profile.userId
    }

    console.log(
      'WHILE ON GAME STATE DAW',
      args.page,
      NavigationStore.location,
      NavigationStore.locationWhileOnGameState
    )

    // GAME PLAY INTERRUPTION
    if (args.isMainPage) {
      if (NavigationStore.locationWhileOnGameState) {
        const pageInterrupted = this.pages.filter(
          o =>
            (o.page || '').toLowerCase() ===
            (NavigationStore.location.replace('/', '') || '').toLowerCase()
        )[0]
        if (pageInterrupted) {
          args.interactionUuid = pageInterrupted.uuid
        }
      }
    }

    // SUBPAGE
    if (!args.isMainPage) {
      const subPageKey = args.page.split('-')[0]
      const mainPage = this.pages.filter(
        o =>
          o.isMainPage && o.page.includes(subPageKey, new RegExp(o.page, 'gi'))
      )[0]
      if (mainPage) {
        args.uuid = mainPage.uuid
      }
    }

    agent.GameServer.analyticsTimeStart(args).then(data => {
      if (data) {
        console.log('ANALYTIC TIME START RESPONSE', data)
        this.pages.push(data)
      }
    })
  }

  timeStop(args) {
    if (ProfileStore.profile.userId) {
      args.userId = ProfileStore.profile.userId
    }

    const page = this.pages.filter(
      o => (o.page || '').toLowerCase() === (args.page || '').toLowerCase()
    )[0]
    if (page) {
      args.uuid = page.uuid
      args.interactionUuid = page.interactionUuid
    }

    const idx = this.pages.findIndex(
      o => (o.page || '').toLowerCase() === (args.page || '').toLowerCase()
    )
    if (idx > -1) {
      this.pages.splice(idx, 1)
    }

    if (args.isUnload) {
      agent.GameServer.sendBeaconEventTimeStop(args)
    } else {
      console.log('ANALYTIC TIME STOP')
      agent.GameServer.analyticsTimeStop(args)
    }
  }

  addFlag(args) {
    const page = this.pages.filter(o => o.isMainPage && !o.interactionUuid)[0]
    if (page) {
      args.userId = page.userId
      args.ip = page.ip
      args.uuid = page.uuid
    }
    agent.GameServer.addFlag(args)
  }

  setPendingGamePlay(args) {
    if ('/livegame' === args.location) {
      if (args.isUnload) {
        args.userId = ProfileStore.profile.userId
        args.gameId = CommandHostStore.gameId
        agent.GameServer.sendBeaconEventPendingGamePlay(args)
      } else {
        agent.GameServer.setPendingGamePlay({
          userId: ProfileStore.profile.userId,
          gameId: CommandHostStore.gameId,
          isSet: args.isSet,
        })
      }
    }
  }
}

export default new AnalyticsStore()
