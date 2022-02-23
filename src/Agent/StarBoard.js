const starCategories = [
  {
    order: 1,
    id: 'SRTi',
    text: 'tickets',
    icon: 'star-category-shows.jpg',
    iconSelected: 'star-icon-gold.svg',
    eventList: ['sports', 'concerts', 'festivals', 'theatre', 'movies'],
    desc: '',
    top: -20,
    left: -47,
  },
  {
    order: 2,
    id: 'SRGr',
    text: 'gear',
    icon: 'star-category-gear.jpg',
    iconSelected: 'star-icon-gold.svg',
    eventList: ['sports', 'equipment', 'accessories', 'devices', 'gadgets'],
    desc: 'equipment and accessories from your favorite sports',
    top: -57,
    left: 0,
  },
  {
    order: 3,
    id: 'SRTr',
    text: 'training',
    icon: 'star-category-training.jpg',
    iconSelected: 'star-icon-gold.svg',
    eventList: ['caribbean', 'europe', 'asia', 'ski resorts', 'events'],
    desc: '',
    top: -20,
    left: 47,
  },
  {
    order: 4,
    id: 'SRTv',
    text: 'travel',
    icon: 'star-category-travel.jpg',
    iconSelected: 'star-icon-gold.svg',
    eventList: ['caribbean', 'europe', 'asia', 'ski resorts', 'events'],
    desc: '',
    top: 53,
    left: -30,
  },
  {
    order: 5,
    id: 'SRAv',
    text: 'adventure',
    icon: 'star-category-adventure.jpg',
    iconSelected: 'star-icon-gold.svg',
    eventList: ['sports', 'equipment', 'accessories', 'devices', 'gadgets'],
    desc: '',
    top: 53,
    left: 30,
  },
]

const starPrizes = []

const starDetailListX = [
  {
    title: 'Golf Balls',
    subTitle: 'Set of 3',
    preTitle: '',
    shortName: 'golfballs',
    qty: 1,
    currencyType: 'Placement',
    value: 1,
    seasonId: 'LB01',
    boardTypeId: 'BB',
    prizeBoardId: 'LB01BB',
    boardOrder: 1,
    images: ['golf-balls-set-of-3.jpg'],
    sponsorId: '',
    claimType: 'E-Mail',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: 0,
    needed: 3,
  },
  {
    title: 'Tennis Balls',
    subTitle: 'Wilson 2 - Pack of 3',
    preTitle: '',
    shortName: 'tennisballs',
    qty: 1,
    currencyType: 'Placement',
    value: 2,
    seasonId: 'LB01',
    boardTypeId: 'BB',
    prizeBoardId: 'LB01BB',
    boardOrder: 2,
    images: ['tennis-balls-set-of-3.jpg', 'prizeboard.jpg'],
    sponsorId: '',
    claimType: 'E-Mail',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: '',
    needed: 3,
  },
  {
    title: 'football',
    subTitle: 'training edition',
    preTitle: '',
    shortName: 'ux200',
    qty: 3,
    currencyType: 'Placement',
    value: 1,
    seasonId: 'LB01',
    boardTypeId: 'BB',
    prizeBoardId: 'LB01BB',
    boardOrder: 1,
    images: ['football.jpg'],
    sponsorId: '',
    claimType: 'E-Mail',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: 0,
    needed: 3,
  },
  {
    title: 'soccer ball',
    subTitle: 'training edition',
    preTitle: '',
    shortName: 'vegas2',
    qty: 4,
    currencyType: 'Placement',
    value: 2,
    seasonId: 'LB01',
    boardTypeId: 'BB',
    prizeBoardId: 'LB01BB',
    boardOrder: 2,
    images: ['prize-front.jpg', 'prizeboard.jpg'],
    sponsorId: '',
    claimType: 'E-Mail',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: '',
    needed: 5,
  },
  {
    title: 'shin guards',
    subTitle: 'soccer',
    preTitle: '',
    shortName: 'sxsw',
    qty: 5,
    currencyType: 'Placement',
    value: 3,
    seasonId: 'LB01',
    boardTypeId: 'BB',
    prizeBoardId: 'LB01BB',
    boardOrder: 3,
    images: ['prizeboard.jpg'],
    sponsorId: '',
    claimType: 'E-Mail',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: '',
    needed: 5,
  },
  {
    title: 'golf club covers',
    subTitle: 'premium',
    preTitle: 'To the Next Game',
    shortName: 'kcchiefs_01',
    qty: 6,
    currencyType: 'Points',
    value: 60000,
    seasonId: 'SE001',
    boardTypeId: 'IST',
    prizeBoardId: 'SE001IST',
    boardOrder: 1,
    images: ['prizeboard.jpg'],
    sponsorId: 'kcchiefs-001-pl-sta-na-nfl',
    claimType: 'Pick-Up',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: '',
    needed: 5,
  },
  {
    title: 'climbing gloves',
    subTitle: 'black diamond',
    preTitle: '',
    shortName: 'kcchiefs_02',
    qty: 7,
    currencyType: 'Points',
    value: 55000,
    seasonId: 'SE001',
    boardTypeId: 'IST',
    prizeBoardId: 'SE001IST',
    boardOrder: 2,
    images: ['prizeboard.jpg'],
    sponsorId: 'kcchiefs-001-pl-sta-na-nfl',
    claimType: 'Pick-Up',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: '',
    needed: 10,
  },
  {
    title: 'level 5 product',
    subTitle: 'description',
    preTitle: '',
    shortName: 'kcchiefs_03',
    qty: 8,
    currencyType: 'Points',
    value: 50000,
    seasonId: 'SE001',
    boardTypeId: 'IST',
    prizeBoardId: 'SE001IST',
    boardOrder: 3,
    images: ['prizeboard.jpg'],
    sponsorId: 'kcchiefs-001-pl-sta-na-nfl',
    claimType: 'Pick-Up',
    claimInfo: 'instructions',
    videoName: '',
    rewardCurrency: '',
    rewardValue: '',
    needed: 10,
  },
]

const getStarCategories = () => {
  return new Promise(resolve => {
    resolve(starCategories)
  })
}

const getStarPrizes = () => {
  return new Promise(resolve => {
    resolve(starPrizes)
  })
}

const debitPrizeX = item => {
  return new Promise((resolve, reject) => {
    let prize = starDetailListX.filter(
      o =>
        o.shortName === item.shortName &&
        o.seasonId === item.seasonId &&
        o.boardTypeId === item.boardTypeId
    )[0]
    if (prize) {
      if (prize.qty > 0) {
        prize.qty = prize.qty - 1
        resolve(prize)
      } else {
        reject('Prize quantity not enough')
      }
    } else {
      reject('Prize not found')
    }
  })
}

const userPrizes = []

const getStarPrizesByUser = userId => {
  return new Promise(resolve => {
    let res = userPrizes.filter(o => o.userId === userId)[0]
    resolve(res)
  })
}

const addStar = (userId, p, amt) => {
  return new Promise(resolve => {
    let item = { ...p }
    let userPrize = userPrizes.filter(o => o.userId === userId)[0]
    if (userPrize) {
      if (userPrize.prizes) {
        let existingPrize = userPrize.prizes.filter(
          o =>
            o.shortName === item.shortName &&
            o.seasonId === item.seasonId &&
            o.boardTypeId === item.boardTypeId
        )[0]
        if (existingPrize) {
          existingPrize.used = existingPrize.used + amt
        } else {
          item.forRedeem = false
          item.agreed = false
          item.claimed = false
          item.used = amt

          userPrize.prizes.push(item)
        }
      } else {
        item.forRedeem = false
        item.agreed = false
        item.claimed = false
        item.used = amt

        userPrize.prizes = []
        userPrize.prizes.push(item)
      }
    } else {
      item.forRedeem = false
      item.agreed = false
      item.claimed = false
      item.used = amt

      userPrize = { userId: '', prizes: [] }
      userPrize.userId = userId
      userPrize.prizes.push(item)
      userPrizes.push(userPrize)
    }

    resolve(userPrize)
  })
}

const setForRedeem = (userId, item) => {
  return new Promise(resolve => {
    let userPrize = userPrizes.filter(o => o.userId === userId)[0]
    if (userPrize) {
      let prize = userPrize.prizes.filter(
        o =>
          o.shortName === item.shortName &&
          o.seasonId === item.seasonId &&
          o.boardTypeId === item.boardTypeId
      )[0]
      if (prize) {
        prize.forRedeem = true
        resolve(userPrize)
      }
    }

    resolve(null)
  })
}

const agreeUserPrize = (userId, item, isAgree) => {
  return new Promise(resolve => {
    let userPrize = userPrizes.filter(o => o.userId === userId)[0]
    if (userPrize) {
      let prize = userPrize.prizes.filter(
        o =>
          o.shortName === item.shortName &&
          o.seasonId === item.seasonId &&
          o.boardTypeId === item.boardTypeId
      )[0]
      if (prize) {
        prize.agreed = isAgree
        resolve(userPrize)
      }
    }
  })
}

const claimUserPrize = (userId, item, isClaimInFull) => {
  return new Promise(resolve => {
    let userPrize = userPrizes.filter(o => o.userId === userId)[0]
    if (userPrize) {
      let prize = userPrize.prizes.filter(
        o =>
          o.shortName === item.shortName &&
          o.seasonId === item.seasonId &&
          o.boardTypeId === item.boardTypeId
      )[0]
      if (prize) {
        prize.claimed = isClaimInFull
        resolve(userPrize)
      }
    }
  })
}

const changeUserIdOnUserPrize = userId => {
  return new Promise(resolve => {
    let userPrize = userPrizes.filter(o => o.userId === 'sportoco')[0]
    if (userPrize) {
      userPrize.userId = userId
      resolve(userPrize)
    }
  })
}

module.exports = {
  getStarPrizes,
  getStarPrizesByUser,
  addStar,
  setForRedeem,
  agreeUserPrize,
  claimUserPrize,
  changeUserIdOnUserPrize,
}
