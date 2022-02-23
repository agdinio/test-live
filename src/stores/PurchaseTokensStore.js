import { observable, action } from 'mobx'
import agent from '@/Agent'

class PurchaseTokensStore {
  @observable
  isLoading = false

  purchaseTokenImages = [
    {
      image:
        'https://www.sportocotoday.com/image/data/products/playalongnow-icon-tokens_v1.svg',
      //heightInPct: 35
      height: 11,
    },
    {
      image:
        'https://www.sportocotoday.com/image/data/products/playalongnow-icon-tokens_v2.svg',
      //heightInPct: 50
      height: 16,
    },
    {
      image:
        'https://www.sportocotoday.com/image/data/products/playalongnow-icon-tokens_v3.svg',
      //heightInPct: 50
      height: 16,
    },
    {
      image:
        'https://www.sportocotoday.com/image/data/products/playalongnow-icon-tokens_v4.svg',
      //heightInPct: 70
      height: 22,
    },
    {
      image:
        'https://www.sportocotoday.com/image/data/products/playalongnow-icon-tokens_v5.svg',
      //heightInPct: 90
      height: 20,
    },
  ]

  @observable
  values = []

  valuesxx = [
    {
      qty: 100,
      bonus: 10,
      amount: 0.99,
    },
    {
      qty: 500,
      bonus: 20,
      amount: 1.99,
    },
    {
      qty: 2000,
      bonus: 100,
      amount: 5.99,
    },
    {
      qty: 6000,
      bonus: 300,
      amount: 10.99,
    },
    {
      qty: 10000,
      bonus: 800,
      amount: 45.99,
    },
  ]

  @action
  getData(args) {
    this.isLoading = true
    return agent.GameServer.readTokenProducts(args)
      .then(data => {
        console.log(JSON.parse(JSON.stringify(data)), args)
        data.sort((a, b) => a.tokens - b.tokens)
        for (let i = 0; i < data.length; i++) {
          data[i].image = this.purchaseTokenImages[i].image
          data[i].height = this.purchaseTokenImages[i].height
        }

        this.values = data
        //return Promise.resolve(data)
      })
      .finally(_ => {
        this.isLoading = false
      })
  }
}

export default new PurchaseTokensStore()
