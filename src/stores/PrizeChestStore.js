import { observable, action } from 'mobx'
import agent from '@/Agent'

class PrizeChestStore {
  @observable
  isLoading = false

  prizeChestList = [
    {
      images: ['prizeboard/star-category-shows.jpg'],
      title: 'stars earned',
      subTitle: 'are used for prizes',
      starIcon: 'star-icon-dark.svg',
      // score: 2,
      awardTitle: 'go to\n star board',
      awardIcon: 'prizeboard-icon-prizechest.svg',
      type: 'starboard',
      keyword: 'starboard',
      styles: {
        backgroundColor: '#231f20',
        secondaryBackgroundColor: '#efdf18',
        tertiaryBackgroundColor: '#221e1f',
        prizeImageColor: '#221e1f',
        titleColor: '#221e1f',
        subTitleColor: '#221e1f',
        awardTitleColor: '#efdf18',
        awardIconColor: '#221e1f',
        awardBackgroundColor: '#efdf18',
        awardIconSize: 70,
      },
    },
    {
      images: ['prizeboard/playalongnow-prizechest-woot.jpg'],
      title: 'uncover woot!',
      subTitle: 'delivered by amazon prime',
      //starIcon: 'star-icon-dark.svg',
      //score: 1,
      awardTitle: 'read',
      awardIcon: 'read-btn-icon.svg',
      keyword: 'woot',
      prizeChest: {
        rank: 1,
        topSmallHeaders: [{ value: 'UNCOVER' }],
        headers: [{ value: 'THE WORLD OF WOOT!' }],
        details: [{ value: 'TECH, GEAR & MORE - DELIVERED BY AMAZON PRIME' }],
        images: ['sponsors/playalongnow-liveplay_progress-woot.jpg'],
      },
      styles: {
        backgroundColor: '#231f20',
        secondaryBackgroundColor: '#ffffff',
        tertiaryBackgroundColor: '#574263',
        prizeImageColor: '#9368aa',
        titleColor: '#9368aa',
        subTitleColor: '#000000',
        awardIconColor: '#ffffff',
        awardBackgroundColor: '#9368aa',
      },
    },
    {
      images: ['prizeboard/playalongnow-bigprizeboards-amalfi_coast.jpg'],
      title: 'amalfi coast',
      subTitle: 'italian vacation package',
      // starIcon: 'star-icon-dark.svg',
      // score: 1,
      awardTitle: 'watch',
      awardIcon: 'play-btn-icon.svg',
      keyword: 'amalfi',
      styles: {
        backgroundColor: '#231f20',
        secondaryBackgroundColor: '#ffffff',
        tertiaryBackgroundColor: '#30397a',
        prizeImageColor: '#495bdb',
        titleColor: '#495bdb',
        subTitleColor: '#000000',
        awardIconColor: '#ffffff',
        awardBackgroundColor: '#495bdb',
      },
    },
    {
      images: [
        'prizeboard/playalongnow-bigprizeboards-small_luxury_hotels.jpg',
      ],
      title: 'small luxury hotels',
      subTitle: 'of the world - vacation package',
      // starIcon: 'star-icon-dark.svg',
      // score: 1,
      awardTitle: 'watch',
      awardIcon: 'play-btn-icon.svg',
      keyword: 'hotel',
      styles: {
        backgroundColor: '#231f20',
        secondaryBackgroundColor: '#ffffff',
        tertiaryBackgroundColor: '#30397a',
        prizeImageColor: '#495bdb',
        titleColor: '#495bdb',
        subTitleColor: '#000000',
        awardIconColor: '#ffffff',
        awardBackgroundColor: '#495bdb',
      },
    },
    {
      images: ['prizeboard/playalongnow-bigprizeboards-ny_broadway.jpg'],
      title: 'new york broadway',
      subTitle: 'vacation package',
      // starIcon: 'star-icon-dark.svg',
      // score: 1,
      awardTitle: 'read',
      awardIcon: 'read-btn-icon.svg',
      keyword: 'broadway',
      styles: {
        backgroundColor: '#231f20',
        secondaryBackgroundColor: '#ffffff',
        tertiaryBackgroundColor: '#574263',
        prizeImageColor: '#9368aa',
        titleColor: '#9368aa',
        subTitleColor: '#000000',
        awardIconColor: '#ffffff',
        awardBackgroundColor: '#9368aa',
      },
    },
    {
      images: ['prizeboard/playalongnow-bigprizeboards-other_prizes.jpg'],
      title: 'training & gear',
      subTitle: 'SKLZ® EXOS®',
      // starIcon: 'star-icon-dark.svg',
      // score: 1,
      awardTitle: 'read',
      awardIcon: 'read-btn-icon.svg',
      keyword: 'gear',
      styles: {
        backgroundColor: '#231f20',
        secondaryBackgroundColor: '#ffffff',
        tertiaryBackgroundColor: '#574263',
        prizeImageColor: '#9368aa',
        titleColor: '#9368aa',
        subTitleColor: '#000000',
        awardIconColor: '#ffffff',
        awardBackgroundColor: '#9368aa',
      },
    },
    // {
    //   backgroundColor: '#231f20',
    //   secondaryBackgroundColor: '#808285',
    //   tertiaryBackgroundColor: '#3f3f3f',
    //   prizeImage: 'playalongnow-bigprizeboards-ny_broadway.jpg',
    //   prizeImageColor: '#221e1f',
    //   title: 'ny - broadway',
    //   subTitle: 'vacation package',
    //   titleColor: 'rgba(255,255,255, 0.8)',
    //   subTitleColor: 'rgba(255,255,255, 0.8)',
    //   starIcon: 'star-icon-dark.svg',
    //   score: 4,
    //   awardTitle: 'read',
    //   awardIcon: 'menu-prizes_open-icon-white.svg',
    //   awardIconColor: '#ffffff',
    //   awardBackgroundColor: '#c61818',
    //   awardIconSize: 70,
    //   isUsed: false,
    //   keyword: 'broadway',
    // },
  ]

  @action
  getPrizeChest() {
    return agent.GameServer.getPrizeChest().then(data => {
      console.log(data)
      for (let i=0; i<data.prizeChest.length; i++) {
        const raw = data.prizeChest[i]
        this.prizeChestList.push({
          images: ['prizeboard/star-category-shows.jpg'],
          title: raw.title,
          subTitle: raw.subTitle,
          starIcon: 'star-icon-dark.svg',
          awardTitle: raw.mode,
          awardIcon: 'prizeboard-icon-prizechest.svg',
          keyword: raw.keyword,
        })
      }
    })
  }
}

export default new PrizeChestStore()
