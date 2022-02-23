import { observable, action, computed } from 'mobx'
import agent from '@/Agent'

class ResolveStore {
  /**
   * Total Choices
   */

  @observable
  totalPrePick = 0
  @action
  setTotalPrePick(val) {
    if (this.totalPrePick < 1) {
      this.totalPrePick = val
    }
  }

  @observable
  totalLivePlay = 0
  @action
  setTotalLivePlay(val) {
    if (this.totalLivePlay < 1) {
      this.totalLivePlay = val
    }
  }

  @observable
  totalGameMaster = 0
  @action
  setTotalGameMaster(val) {
    if (this.totalGameMaster < 1) {
      this.totalGameMaster = val
    }
  }

  @observable
  totalSponsor = 0
  @action
  setTotalSponsor(val) {
    if (this.totalSponsor < 1) {
      this.totalSponsor = val
    }
  }

  @observable
  totalPrize = 0
  @action
  setTotalPrize(val) {
    if (this.totalPrize < 1) {
      this.totalPrize = val
    }
  }

  /**
   * Total Correct Choices
   */
  @observable
  correctPrePick = 0
  @action
  setCorrectPrePick(val) {
    this.correctPrePick += val
  }

  @observable
  correctLivePlay = 0
  @action
  setCorrectLivePlay(val) {
    this.correctLivePlay += val
  }

  @observable
  correctGameMaster = 0
  @action
  setCorrectGameMaster(val) {
    this.correctGameMaster += val
  }

  @observable
  correctSponsor = 0
  @action
  setCorrectSponsor(val) {
    this.correctSponsor += val
  }

  @observable
  correctPrize = 0
  @action
  setCorrectPrize(val) {
    this.correctPrize += val
  }

  @observable
  resolveThrough = 0
  @action
  setResolveThrough(val) {
    this.resolveThrough = val
  }

  @observable
  quadraFectas = [
    {
      sequence: 0,
      text: 'prepicks',
      percentage: 0,
      color: '#10bc1c',
      x: -50,
      y: -95,
      innerMarginTop: -15,
      innerMarginLeft: 0,
      innerX: -50,
      innerY: -121,
      keyword: 'prepicks',
    },
    {
      sequence: 1,
      text: 'sponsors',
      percentage: 70,
      color: '#3632ab',
      x: -108,
      y: -43,
      innerMarginTop: 2,
      innerMarginLeft: -18,
      innerX: -135,
      innerY: -50,
      keyword: 'sponsor',
    },
    {
      sequence: 2,
      text: 'gamemaster',
      percentage: 50,
      color: '#02a9d6',
      x: 8,
      y: -43, //-55
      innerMarginTop: 2,
      innerMarginLeft: 18,
      keyword: 'gamemaster',
    },
    {
      sequence: 3,
      text: 'live play',
      percentage: 60,
      color: '#c61819',
      x: -50,
      y: 11, //5
      innerMarginTop: 19,
      innerMarginLeft: 0,
      keyword: 'liveplay',
    },
  ]

  @observable
  fectas = [
    {
      sequence: 0,
      text: 'prepicks',
      percentage: 0,
      color: '#10bc1c',
      x: -50,
      y: -120,
      innerMarginTop: -15,
      innerMarginLeft: 0,
      innerX: -50,
      innerY: -152,
      keyword: 'prepicks',
    },
    {
      sequence: 1,
      text: 'sponsors',
      percentage: 0,
      color: '#3632ab',
      x: -120,
      y: -70,
      innerMarginTop: 2,
      innerMarginLeft: -18,
      innerX: -150,
      innerY: -80,
      keyword: 'sponsor',
    },
    {
      sequence: 2,
      text: 'gamemaster',
      percentage: 0,
      color: '#02a9d6',
      x: 20,
      y: -70,
      innerMarginTop: 2,
      innerMarginLeft: 18,
      innerX: 52,
      innerY: -82,
      keyword: 'gamemaster',
    },
    {
      sequence: 3,
      text: 'live play',
      percentage: 0,
      color: '#c61819',
      x: -90,
      y: 10,
      innerMarginTop: 19,
      innerMarginLeft: 0,
      innerX: -107,
      innerY: 37,
      keyword: 'liveplay',
    },
    {
      sequence: 4,
      text: 'prize',
      percentage: 0,
      color: '#9368AA',
      x: -5,
      y: 10,
      innerMarginTop: 19,
      innerMarginLeft: 0,
      innerX: 15,
      innerY: 38,
      keyword: 'prize',
    },
  ]

  @observable
  lockMenu = false
  @action
  setLockMenu(val) {
    this.lockMenu = val
  }
}

export default new ResolveStore()
