import ProfileStore from '@/stores/ProfileStore'

// export function setItem(key, val) {
//   switch (key) {
//     case 'answer':
//       setAnswer('gameapp', val)
//       break
//     case 'gameid':
//       setGameId('gameapp', val)
//       break
//     case 'gameserver':
//       setGameServer('gameserver', val)
//       break
//   }
// }

export function setAnswer(answer) {
  if (ProfileStore.profile && ProfileStore.profile.userId) {
    const key = ProfileStore.profile.userId
    let item = localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
      if (item.answers) {
        const exists = item.answers.filter(
          o => o.questionId === answer.questionId
        )[0]
        if (!exists) {
          item.answers.push(answer)
        }
      } else {
        item.answers = []
        item.answers.push(answer)
      }
      try {
        window.localStorage.setItem(key, JSON.stringify(item))
      } catch (e) {}
    } else {
      let newItem = { answers: [] }
      newItem.answers.push(answer)
      try {
        window.localStorage.setItem(key, JSON.stringify(newItem))
      } catch (e) {}
    }
  }
}

export function creditCurrencies(currencyType, val) {
  if (ProfileStore.profile && ProfileStore.profile.userId) {
    const key = ProfileStore.profile.userId
    let item = window.localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
      if (item.currencies) {
        item.currencies[currencyType] = item.currencies[currencyType] + val
        try {
          window.localStorage.setItem(key, JSON.stringify(item))
        } catch (e) {}
      } else {
        item.currencies = { points: 0, tokens: 0, stars: 0 }
        item.currencies[currencyType] = item.currencies[currencyType] + val
        try {
          window.localStorage.setItem(key, JSON.stringify(item))
        } catch (e) {}
      }
    } else {
      let newItem = { currencies: { points: 0, tokens: 0, stars: 0 } }
      newItem.currencies[currencyType] = newItem.currencies[currencyType] + val
      try {
        window.localStorage.setItem(key, JSON.stringify(newItem))
      } catch (e) {}
    }
  }
}

export function debitCurrencies(currencyType, val) {
  if (ProfileStore.profile && ProfileStore.profile.userId) {
    const key = ProfileStore.profile.userId
    let item = window.localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
      if (item.currencies) {
        if (item.currencies[currencyType]) {
          item.currencies[currencyType] =
            item.currencies[currencyType] - val < 1
              ? 0
              : item.currencies[currencyType] - val
          try {
            window.localStorage.setItem(key, JSON.stringify(item))
          } catch (e) {}
        }
      } else {
        item.currencies = { points: 0, tokens: 0, stars: 0 }
        item.currencies[currencyType] =
          item.currencies[currencyType] - val < 1
            ? 0
            : item.currencies[currencyType] - val
        try {
          window.localStorage.setItem(key, JSON.stringify(item))
        } catch (e) {}
      }
    } else {
      let newItem = { currencies: { points: 0, tokens: 0, stars: 0 } }
      newItem.currencies[currencyType] =
        newItem.currencies[currencyType] - val < 1
          ? 0
          : newItem.currencies[currencyType] - val
      try {
        window.localStorage.setItem(key, JSON.stringify(newItem))
      } catch (e) {}
    }
  }
}

export function getItem(key) {
  if (key) {
    let item = window.localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  }
  return null
}

// export function removeItem(key) {
//   window.localStorage.removeItem(key)
// }

export function removeProfileCurrencies() {
  if (ProfileStore.profile.userName) {
    ProfileStore.debitCurrenciesAtLaunch({
      currency: 'tokens',
      amount: ProfileStore.profile.currencies.tokens,
    })
    ProfileStore.creditCurrencies({
      currency: 'tokens',
      amount: 500,
    })
    ProfileStore.debitCurrenciesAtLaunch({
      currency: 'points',
      amount: ProfileStore.profile.currencies.points,
    })
    ProfileStore.debitCurrenciesAtLaunch({
      currency: 'stars',
      amount: ProfileStore.profile.currencies.stars,
    })
  }
}

// function removeAll() {
//   window.localStorage.removeItem('gameapp')
//   window.localStorage.removeItem('gameid')
//   window.localStorage.removeItem('gameserver')
// }

export function clear() {
  window.localStorage.clear()
}

export function setGameId(val) {
  if (ProfileStore.profile && ProfileStore.profile.userId) {
    const key = ProfileStore.profile.userId
    let item = window.localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
      if (val && val !== item.gameId) {
        item.gameId = val
        try {
          window.localStorage.setItem(key, JSON.stringify(item))
        } catch (e) {}
      }
    } else {
      let newItem = { gameId: val }
      try {
        window.localStorage.setItem(key, JSON.stringify(newItem))
      } catch (e) {}
    }
  }
}

export function setGameIdXX1(val) {
  if (ProfileStore.profile && ProfileStore.profile.userId) {
    const key = ProfileStore.profile.userId
    let item = window.localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
      if (val && val !== item.gameId) {
        let newItem = { gameId: val, answers: [] }
        try {
          window.localStorage.setItem(key, JSON.stringify(newItem))
        } catch (e) {}
      }
    } else {
      item = { gameId: val }
      try {
        window.localStorage.setItem(key, JSON.stringify(item))
      } catch (e) {}
    }
  }
}

export function setGameServer(val) {
  try {
    window.localStorage.setItem('gameserver', JSON.stringify(val))
  } catch (e) {}
}

// export function updateItem(attr, val) {
//   switch (attr) {
//     case 'answer':
//       updateAnswer(val)
//       break
//   }
// }

export function updateAnswer(val) {
  if (ProfileStore.profile && ProfileStore.profile.userId) {
    const key = ProfileStore.profile.userId
    let item = window.localStorage.getItem(key)
    if (item) {
      item = JSON.parse(item)
      if (item.answers) {
        const idxToUpdate = item.answers.findIndex(
          o => o.questionId === val.questionId
        )
        if (idxToUpdate > -1) {
          item.answers[idxToUpdate] = val
          try {
            window.localStorage.setItem(key, JSON.stringify(item))
          } catch (e) {}
        }
      }
    }
  }
}

export function removeAnswer(playId) {
  let item = window.localStorage.getItem('gameapp')
  if (item) {
    item = JSON.parse(item)
    if (item.answers) {
      const idxToRemove = item.answers.findIndex(o => o.questionId === playId)
      if (idxToRemove > -1) {
        item.answers.splice(idxToRemove, 1)
        try {
          window.localStorage.setItem('gameapp', JSON.stringify(item))
        } catch (e) {}
      }
    }
  }
}

export function setUser(key, val) {
  let item = window.localStorage.getItem(key)
  if (item) {
    item = JSON.parse(item)
    if (item.user) {
      item.user = val
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(item))
    } catch (e) {}
  } else {
    item.user = { id: '', email: '' }
    try {
      window.localStorage.setItem(key, JSON.stringify(item))
    } catch (e) {}
  }
}
