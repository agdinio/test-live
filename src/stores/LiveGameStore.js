import { observable, action, computed } from 'mobx'
import profilePic from '@/assets/images/profile-image.jpg'
import Script from '@/stores/script'
import PrePickStore from '@/stores/PrePickStore'
import ResolveStore from '@/stores/ResolveStore'
import paScript from '@/stores/PlayalongScript'
import agent from '@/Agent'

class LiveGameStore {
  timesValuePerFee = 100
  @observable
  currentRoute = ''
  @observable
  history = []
  @observable
  statusPanel = {}
  @observable
  liveGameTime = new Date('11/19/2018 12:42:00')
  @observable
  isLoading = true

  PLAY_THEME = {
    PrePick: {backgroundColor: '#2fc12f', backgroundColorDark: '#146314', backgroundColorLight: '#ffffff', textColor: '#2fc12f'},
    LivePlay: {backgroundColor: '#c61818', backgroundColorDark: '#601313', backgroundColorLight: '#c61818', textColor: '#ffffff'},
    GameMaster: {backgroundColor: '#19d1bf', backgroundColorDark: '#118e82', backgroundColorLight: '#19d1bf', textColor: '#ffffff'},
    Sponsor: {backgroundColor: '#495bdb', backgroundColorDark: '#24245b', backgroundColorLight: '#495bdb', textColor: '#ffffff'},
    Prize: {backgroundColor: '#9368AA', backgroundColorDark: '#452d59', backgroundColorLight: '#9368AA', textColor: '#ffffff'},
    ExtraPoint: {backgroundColor: '#c61818', backgroundColorDark: '#601313', backgroundColorLight: '#c61818', textColor: '#ffffff'},
    Summary: {backgroundColor: '#c61818', backgroundColorDark: '#601313', backgroundColorLight: '#c61818', textColor: '#ffffff'},
    NextPlayAd: {backgroundColor: '#c61818', backgroundColorDark: '#601313', backgroundColorLight: '#c61818', textColor: '#ffffff'},
    Announce: {backgroundColor: '#c61818', backgroundColorDark: '#601313', backgroundColorLight: '#c61818', textColor: '#ffffff'},
  }

  @observable
  sponsorLogos = [
    {
      componentName: 'MultiplyPoints',
      image: 'logo-campari.svg',
    },
    {
      componentName: 'PlayInProgress',
      //image: 'logo-campari.svg',
      images: [
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      ],
    },
    {
      id: 1003,
      componentName: 'MultiplierQuestion',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 1008,
      componentName: 'GameMasterQuestion',
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-sklz.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-sklz.svg',
    },
    {
      id: 1012,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 1013,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 1015,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 10151,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 1016,
      componentName: 'AdvertisementQuestion',
      introImageBig: {
        img: 'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
        size: 12,
      },
      introImage: '',
      image:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video_square.svg',
      imageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
      inProgressImageBigSize: 10,
    },
    {
      id: 1017,
      multiplierLength: 3,
      multiplierImageBig:
        'sponsors/playalongnow-sponsors-woot_monkey_tagline.svg',
      multiplierImageBigSize: 10,
      inProgressImageVideo: 'sponsors/playalongnow-liveplay_progress-woot.jpg',
      inProgressTextBelow: [
        { value: 'uncover the world of woot!' },
        { value: 'check your prize chest', showIcon: true },
      ],
    },
    {
      id: 1018,
      multiplierLength: 3.5,
      multiplierImageBig:
        'sponsors/playalongnow-liveplay_multiplier_2-woot.png',
      multiplierImageBigIsPosBottom: true,
      multiplierImageBigSize: 16,
      inProgressImageVideo: 'sponsors/playalongnow-liveplay_progress-woot.jpg',
      inProgressTextBelow: [
        { value: 'uncover the world of woot!' },
        { value: 'check your prize chest', showIcon: true },
      ],
    },
    {
      id: 1019,
      inProgressImageVideo: 'sponsors/playalongnow-liveplay_progress-woot.jpg',
      inProgressTextBelow: [
        { value: 'uncover the world of woot!' },
        { value: 'check your prize chest', showIcon: true },
      ],
    },
    {
      id: 1020,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
      inProgressImageBigSize: 9,
    },
    {
      id: 2000,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBigSize: 9,
    },
    {
      id: 2001,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBigSize: 9,
    },
    {
      id: 2101,
      componentName: 'ExtraPointQuestion',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2002,
      introImageBig: {
        img: 'sponsors/playalongnow_v3/playalongnow-sponsors-amalfi_coast.svg',
        size: 10,
      },
      introImageText: 'italian vacation package',
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-amalfi_coast.svg',
      imageSize: 12,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-amalfi_coast.svg',
      inProgressImageBigSize: 7,
      inProgressImageVideo:
        'prizeboard/playalongnow-bigprizeboards-amalfi_coast.jpg',
      inProgressImageWithPlayCover: true,
      inProgressImageText: 'italian vacation package',
      inProgressTextBelow: [
        { value: 'big prize video' },
        { value: 'view in your prize chest', showIcon: true },
      ],
    },
    {
      id: 2003,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2004,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-ny_broadway.svg',
      inProgressImageBigSize: 9,
    },
    {
      id: 2005,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-ny_broadway.svg',
      inProgressImageBigSize: 9,
    },
    {
      id: 2006,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
      inProgressImageBigSize: 9,
    },
    {
      id: 2007,
      componentName: 'GameMasterQuestion',
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-sklz.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-sklz.svg',
    },
    {
      id: 2008,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
      inProgressImageBigSize: 10,
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2009,
      componentName: 'AdvertisementQuestion',
      introImageBig: {
        img: 'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
        size: 12,
      },
      introImage: '',
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-slh_icon.png',
      imageBig: 'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
      imageBigSize: 16,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
      inProgressImageBigSize: 9,
    },
    {
      id: 2010,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2011,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2012,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2013,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2014,
      multiplierImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      multiplierImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2015,
      introImageBig: {
        img: 'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
        size: 10,
      },
      introImageText: 'sandpiper st. james, barbados',
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-slh_icon.png',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-slh_full.png',
      inProgressImageBigSize: 5,
      inProgressImageVideo:
        'prizeboard/playalongnow-apass-prizes_desc-slh_01.jpg',
      inProgressImageVideoIsGradient: true,
      inProgressImageWithPlayCover: false,
      inProgressImageText: 'sandpiper st. james, barbados',
      inProgressTextBelow: [
        { value: 'big prize video' },
        { value: 'view in your prize chest', showIcon: true },
      ],
    },
    {
      id: 2016,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2017,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-amazon_prime.svg',
      inProgressImageBigSize: 10,
    },
    {
      id: 2018,
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-sklz.svg',
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-sklz.svg',
    },
    {
      id: 2019,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2020,
      componentName: 'AdvertisementQuestion',
      introImageBig: {
        img: 'sponsors/playalongnow_v3/playalongnow-sponsors-ny_broadway.svg',
        size: 12,
      },
      introImage: '',
      image: 'sponsors/playalongnow_v3/playalongnow-sponsors-ny_broadway.svg',
      imageSize: 3,
      imageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-ny_broadway.svg',
      imageBigSize: 14,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-ny_broadway.svg',
      inProgressImageBigSize: 9,
    },
    {
      id: 2021,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-prime_video.svg',
      inProgressImageBigSize: 9,
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    {
      id: 2022,
      inProgressImageBig:
        'sponsors/playalongnow_v3/playalongnow-sponsors-woot_monkey.svg',
      inProgressImageSmall:
        'sponsors/playalongnow_v2/playalongnow-sponsors-amazon_prime.svg',
    },
    // {
    //   componentName: 'SponsorQuestion',
    //   image: 'sponsors/logo-exos.svg',
    // },
  ]

  @observable
  otherRanks = [
    {
      id: 1,
      color: 'grey',
      standing: 20,
      profilePicture: profilePic,
    },
    {
      id: 2,
      standing: 30,
      color: 'yellow',
      rank: 10,
      profilePicture: profilePic,
    },
    {
      id: 3,
      color: 'grey',
      standing: 80,
      profilePicture: profilePic,
    },
    {
      id: 4,
      color: 'yellow',
      standing: 100,
      rank: 1,
      profilePicture: profilePic,
    },
    {
      id: 5,
      color: 'grey',
      standing: 20,
      profilePicture: profilePic,
    },
    {
      id: 6,
      color: 'grey',
      standing: 10,
      profilePicture: profilePic,
    },
    {
      id: 7,
      color: 'yellow',
      rank: 2,
      standing: 85,
      profilePicture: profilePic,
    },
    {
      id: 8,
      color: 'grey',
      standing: 35,
      profilePicture: profilePic,
    },
    {
      id: 9,
      color: 'grey',
      standing: 78,
      profilePicture: profilePic,
    },
    {
      id: 10,
      color: 'grey',
      standing: 76,
      profilePicture: profilePic,
    },
    {
      id: 11,
      color: 'grey',
      standing: 12,
      profilePicture: profilePic,
    },
  ]

  /*
  @observable
  sponsorAnswers = []
  @observable
  sponsorQuestions = [
    {
      id: 1,
      question: 'Player & Cameraman collide this half?',
      choiceType: 'MULTI',
      choices: [{ id: 1, value: 'NO' }, { id: 2, value: 'YES' }],
      // choiceType: 'AB',
      // choices: [
      //   {id:1, value:'Bengals'},
      //   {id:2, value:'Seahawks'}
      // ],
      points: 20,
      mainDesc: 'This Play',
      detailDesc: '',
      descImage: '',
      backgroundColor: '#495bdb',
      ringColor: '#000000',
      imageCircle: 'symbol-sponsor_white.svg',
      forTeam: {},
    },
  ]
*/

  /*
  @observable
  advertisementAnswers = []
  @observable
  advertisementQuestions = [
    {
      id: 1,
      question: 'Will Bengals pass again to A.J. Green this series?',
      choiceType: 'MULTI',
      choices: [{ id: 1, value: 'No' }, { id: 2, value: 'Yes' }],
      points: 0,
      mainDesc: 'Free Coffee',
      detailDesc: 'Prize Play',
      descImage: 'prize-icon-coffee.jpg',
      backgroundColor: '#9368aa',
      ringColor: '#000000',
      imageCircle: 'symbol-prize_white.svg',
      forTeam: {},
    },
  ]
*/

  @observable
  script = Script
  //@observable currentScriptItem = this.script
  @observable
  currentMainQuestion = {}
  @observable
  currentScriptItem = {}
  @observable
  previousScriptItem = {}

  @observable
  feeCounterValue = 0
  @action
  setFeeCounterValue(val) {
    this.feeCounterValue = val
  }

  @observable
  inProgress = false
  @observable
  livegameAnswers = []
  @action
  resetLivegameAnswers() {
    this.livegameAnswers = []
  }
  @observable
  resultsIndex = -1
  @observable
  nextPlayIndex = -1
  @observable
  postPlayTotalPoints = 0
  @observable
  postPlayTotalTokens = 0
  @observable
  winstreakTotalPoints = 0
  @observable
  winstreakTotalTokens = 0

  @observable
  resultsScript = [
    {
      result: 'TOUCHBACK',
      period: '',
      teamIndex: 1,
      scriptId: 1003,
    },
    {
      result: 'PASS',
      period: '2nd & 5',
      teamIndex: 1,
      scriptId: 1008,
    },
    {
      result: 'Gain 5 Yards',
      period: '1st & 10',
      teamIndex: 1,
      scriptId: 1009,
    },
    {
      result: 'Gain 31 Yards',
      period: '1st & 10',
      teamIndex: 1,
      scriptId: 1012,
    },
    {
      result: 'Gain 31 Yards',
      period: '1st & 10',
      teamIndex: 1,
      scriptId: 1015,
    },
    {
      result: 'TO',
      period: '4th & 2',
      teamIndex: 1,
      scriptId: 1016,
    },
    {
      result: 'Gain 19 Yards',
      period: '',
      teamIndex: 1,
      scriptId: 1017,
    },
    {
      result: 'Yes',
      period: '',
      teamIndex: 1,
      scriptId: 1020,
    },
    {
      result: 'PASS',
      period: '1st & Goal',
      teamIndex: 0,
      scriptId: 2000,
    },
    {
      result: 'TOUCHDOWN',
      period: '',
      teamIndex: 0,
      scriptId: 2001,
    },
    {
      result: 'YES',
      period: '',
      teamIndex: 0,
      scriptId: 2101,
    },
    {
      result: 'YES',
      period: '2nd & 13',
      teamIndex: 0,
      scriptId: 2002,
    },
    {
      result: 'RUN',
      period: '',
      teamIndex: 0,
      scriptId: 2003,
    },
    {
      result: 'RUN - Gain of 3',
      period: '',
      teamIndex: 0,
      scriptId: 2004,
    },
    {
      result: 'Yes',
      period: '',
      teamIndex: 0,
      scriptId: 2006,
    },
    {
      result: 'FLAG',
      period: '1st & 10',
      teamIndex: 1,
      scriptId: 2007,
    },
    {
      result: 'Gain',
      period: '1st & Goal',
      teamIndex: 1,
      scriptId: 2008,
    },
    {
      result: 'YES - TOUCHDOWN',
      period: '',
      teamIndex: 1,
      scriptId: 2009,
    },
    {
      result: 'TOUCHBACK',
      period: 'JAGS 1st & 10',
      teamIndex: 0,
      scriptId: 2010,
    },
    {
      result: 'YES',
      period: '',
      teamIndex: 0,
      scriptId: 2015,
    },
    {
      result: 'GAIN - 3 Yards',
      period: '',
      teamIndex: 0,
      scriptId: 2016,
    },
    {
      result: 'YES',
      period: '',
      teamIndex: 0,
      scriptId: 2017,
    },
    {
      result: 'RUN',
      period: '1st Down',
      teamIndex: 0,
      scriptId: 2018,
    },
    {
      result: 'YES',
      period: '',
      teamIndex: 0,
      scriptId: 2019,
    },
    {
      result: 'RUN',
      period: '',
      teamIndex: 1,
      scriptId: 2020,
    },
    {
      result: 'TOUCHDOWN',
      period: '',
      teamIndex: 1,
      scriptId: 2021,
    },
    {
      result: 'Yes',
      period: '',
      teamIndex: 1,
      scriptId: 2022,
    },
  ]

  @observable
  nextPlayScript = [
    {
      period: '1ST & 10 AT NE 25',
      teamIndex: 1,
    },
    {
      period: '4TH & 2 AT JAX 30',
      teamIndex: 1,
    },
    {
      period: '',
      teamIndex: 0,
    },
    {
      period: 'Flag - 1st and 10',
      teamIndex: 1,
    },
    {
      period: '',
      teamIndex: 1,
    },
    {
      period: '',
      teamIndex: 0,
    },
  ]

  @observable
  textCardScript = [
    {
      textCards: [
        {
          len: 3,
          messages: [{ value: '' }],
        },
      ],
    },
    {
      scriptId: 1012,
      textCards: [
        {
          len: 3,
          messages: [
            { value: 'FAST FORWARD TO', color: '#ffffff', font: 'pamainlight' },
            { break: true },
            { value: '4TH DOWN', color: '#ffffff', font: 'pamainextrabold' },
          ],
        },
      ],
    },
    {
      scriptId: 1020,
      textCards: [
        {
          len: 2,
          messages: [
            { value: 'USE YOUR', color: '#ffffff', font: 'pamainregular' },
            { value: 'Points', color: '#18c5ff', font: 'pamainbold' },
            { value: '&', color: '#ffffff', font: 'pamainregular' },
            { value: 'Tokens', color: '#ffb600', font: 'pamainbold' },
            { break: true },
            { value: 'in the', color: '#ffffff', font: 'pamainregular' },
            { value: 'LIVE', color: '#c61818', font: 'pamainextrabold' },
            { value: 'Events', color: '#ffffff', font: 'pamainregular' },
          ],
        },
        {
          len: 2,
          messages: [
            {
              value: 'Top Point Earners',
              color: '#ffffff',
              font: 'pamainregular',
            },
            { value: 'WIN', color: '#ffffff', font: 'pamainbold' },
            { break: true },
            {
              value: 'Travel - Tickets - Training - Gear',
              color: '#ffffff',
              font: 'pamainbold',
            },
          ],
        },
        {
          len: 2,
          messages: [
            {
              value: 'View the prizes in the Menu',
              color: '#ffffff',
              font: 'pamainregular',
            },
            { break: true },
            {
              value: "'BIG PRIZE BOARDS'",
              color: '#ffffff',
              font: 'pamainbold',
            },
          ],
        },
      ],
    },
    {
      scriptId: 2101,
      textCards: [
        {
          len: 2,
          messages: [
            {
              value: 'SCORE',
              color: '#ffffff',
              font: 'pamainbold',
            },
            { break: true },
            {
              value: 'JAGS 7 - PATS 3',
              color: '#ffffff',
              font: 'pamainbold',
            },
          ],
        },
      ],
    },
    {
      scriptId: 2004,
      textCards: [
        {
          len: 2,
          messages: [
            {
              value: 'JAGUARS MAKE A',
              color: '#ffffff',
              font: 'pamainbold',
              size: 5.5,
            },
            { break: true },
            {
              value: 'TOUCHDOWN',
              color: '#ffffff',
              font: 'pamainextrabold',
              size: 7,
            },
          ],
        },
      ],
    },
    {
      scriptId: 2009,
      textCards: [
        {
          len: 4,
          messages: [
            {
              value: 'HALFTIME',
              color: '#ffffff',
              font: 'pamainregular',
              size: 8,
            },
            { break: true },
            {
              value: 'Get Ready',
              color: '#ffffff',
              font: 'pamainlight',
              size: 6.5,
            },
            { break: true },
            {
              value: 'Play Continues',
              color: '#ffffff',
              font: 'pamainlight',
              size: 6.5,
            },
          ],
        },
        {
          len: 4,
          messages: [
            { value: 'SCORE', color: '#ffffff', font: 'pamainbold' },
            { break: true },
            { value: 'JAGS - 14 ', color: '#ffffff', font: 'pamainbold' },
            { value: 'PATS - 10', color: '#ffffff', font: 'pamainbold' },
          ],
        },
      ],
    },
    {
      scriptId: 2018,
      textCards: [
        {
          len: 3,
          messages: [
            { value: 'FAST FORWARD TO', color: '#ffffff', font: 'pamainlight' },
            { break: true },
            { value: '4TH DOWN', color: '#ffffff', font: 'pamainextrabold' },
          ],
        },
      ],
    },
  ]

  @action
  getTotals() {
    let livePlays = paScript.filter(
      o => o.type && o.type.toUpperCase() === 'LIVEPLAY'
    )
    if (livePlays && livePlays.length > 0) {
      ResolveStore.setTotalLivePlay(livePlays.length)
    }

    let gameMasters = paScript.filter(
      o => o.type && o.type.toUpperCase() === 'GAMEMASTER'
    )
    if (gameMasters && gameMasters.length > 0) {
      ResolveStore.setTotalGameMaster(gameMasters.length)
    }

    let sponsors = paScript.filter(
      o => o.type && o.type.toUpperCase() === 'SPONSOR'
    )
    if (sponsors && sponsors.length > 0) {
      ResolveStore.setTotalSponsor(sponsors.length)
    }

    let prize = paScript.filter(o => o.type && o.type.toUpperCase() === 'PRIZE')
    if (prize && prize.length > 0) {
      ResolveStore.setTotalPrize(prize.length)
    }
  }

  @action
  initScript() {
    this.getTotals()
    this.currentScriptItem = paScript[0]
  }

  @computed
  get scriptLength() {
    return paScript.length
  }

  @action
  getCurrentScriptItemIndex(curr) {
    let index = -1
    let filteredObj = paScript.find((item, i) => {
      if (item.id === curr.id) {
        index = i
        return i
      }
    })
    return index
  }

  @action
  getNextId(nId) {
    return paScript.filter(o => o.id === nId)[0].nextId
  }

  @action
  getNextType(nId) {
    try {
      return paScript.filter(o => o.id === nId)[0].type
    } catch (e) {
      return ''
    }
  }

  @action
  setCurrentMainQuestion(nextQuestionId, screen = null) {
    /**
     * commented out so the command host can use it
     */
    //this.currentMainQuestion = paScript.filter(o => o.id === nextQuestionId)[0]
    if (screen) {
      this.currentMainQuestion = screen
    }
  }

  @action
  setPreviousScript(curr) {
    this.previousScriptItem = curr
  }

  @action
  setNextScript(nextId = 0) {
    this.currentScriptItem = paScript.filter(o => o.id === nextId)[0]
  }

  @action
  getCurrentScriptItem(prev, nextId) {
    /**
     * commented out so the command host can use it
     */
    // if (prev) {
    //   this.setPreviousScript(prev)
    // }
    // if (nextId) {
    //   this.setNextScript(nextId)
    // }

    let screen = null
    if (this.currentMainQuestion) {
      screen = this.currentScriptItem
    }

    return screen
  }

  @action
  nextQuestion(index = 0) {
    if (this.currentScriptItem && this.currentScriptItem.next) {
      this.currentScriptItem =
        this.currentScriptItem.next[index] || this.currentScriptItem.next
    } else {
      this.currentScriptItem = null
    }
  }

  @action
  resetScript() {
    this.currentScriptItem = this.script
  }

  @action
  gameFetch() {
    this.isLoading = true
    setTimeout(() => {
      this.statusPanel = {
        inning: 'SUPERBOWL',
        gameStatus: 'Waiting...',
        playingStatus: 'Game Start',
        playingPeriod: 'DEMONSTRATION',
        playingTime: '15:00',
        teams: [
          {
            teamName: 'Bengals',
            iconTopColor: '#f24c20',
            iconBottomColor: '#000000',
            score: 0,
          },
          {
            teamName: 'Seahawks',
            iconTopColor: '#00133d',
            iconBottomColor: '#68bf10',
            score: 0,
          },
        ],
      }
      this.isLoading = false
    }, 1000)
  }

  @action
  gameStart() {
    this.statusPanel = {
      inning: 'SUPERBOWL',
      gameStatus: 'Live',
      playingStatus: 'PRIVATE ALPHA',
      playingPeriod: 'DEMONSTRATION',
      playingTime: '00:00',
      teams: [
        {
          teamName: 'Bengals',
          iconTopColor: '#f24c20',
          iconBottomColor: '#000000',
          score: 28,
        },
        {
          teamName: 'Seahawks',
          iconTopColor: '#00133d',
          iconBottomColor: '#68bf10',
          score: 24,
        },
      ],
    }
  }

  @action
  gameSocialRanking() {
    this.isLoading = true
    new Promise((resolve, reject) => {
      resolve({
        game: {
          inning: 'NFL',
          gameStatus: 'Post Game',
          playingStatus: 'Results',
          playingPeriod: 'Rankings',
          playingTime: '00:00',
          teams: [
            {
              teamName: 'Bengals',
              iconTopColor: '#f24c20',
              iconBottomColor: '#000000',
              score: 28,
            },
            {
              teamName: 'Seahawks',
              iconTopColor: '#00133d',
              iconBottomColor: '#68bf10',
              score: 24,
            },
          ],
        },
      })
    })
      .then(data => {
        this.statusPanel = data.game
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  @action
  gamePost() {
    this.isLoading = true
    new Promise((resolve, reject) => {
      resolve({
        game: {
          inning: 'SUPERBOWL',
          gameStatus: 'Post Game',
          playingStatus: 'Results',
          playingPeriod: 'Game Ended',
          playingTime: '00:00',
          teams: [
            {
              teamName: 'Bengals',
              iconTopColor: '#f24c20',
              iconBottomColor: '#000000',
              score: 28,
            },
            {
              teamName: 'Seahawks',
              iconTopColor: '#00133d',
              iconBottomColor: '#68bf10',
              score: 24,
            },
          ],
        },
      })
    })
      .then(data => {
        this.statusPanel = data.game
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  @action
  pushSponsorAnswer(response) {
    this.sponsorAnswers.push({
      id: response.id,
      value: response.value,
    })
  }

  @computed
  get getSponsorAnswers() {
    return this.sponsorAnswers
  }

  @action
  pushAdvertisementAnswer(response) {
    this.advertisementAnswers.push({
      id: response.id,
      value: response.value,
    })
  }

  @computed
  get getAdvertisementAnswers() {
    return this.advertisementAnswers
  }

  @action
  setInProgress(val) {
    this.inProgress = val
  }

  @observable
  isInitNextPage = false

  @action
  setIsInitNextPage(val) {
    this.isInitNextPage = val
  }

  @observable
  isNextPage = false

  @action
  setIsNextPage(val) {
    this.isNextPage = val
  }

  @observable
  currentPageId = 0
  @action
  setCurrentPageId(val) {
    this.currentPageId = val
  }

  @observable
  isMultiplierStarted = false

  @action
  setIsMultiplierStarted(val) {
    this.isMultiplierStarted = val
  }

  @observable
  isFeeCounterSpinned = false

  @action
  setIsFeeCounterSpinned(val) {
    this.isFeeCounterSpinned = val
  }

  @observable
  selectedTeam =
    PrePickStore && PrePickStore.teams ? PrePickStore.teams[1] : null

  @action
  setSelectedTeam(val) {
    this.selectedTeam = val
  }

  @observable
  isResultsShowing = false
  @action
  setIsResultsShowing(val) {
    this.isResultsShowing = val
  }

  @observable
  runningLength = 0

  @action
  setRunningLength(val) {
    this.runningLength = val
  }

  @observable
  animCountPerQuestion = 0
  @action
  setAnimCountPerQuestion(val) {
    this.animCountPerQuestion = this.animCountPerQuestion + val
  }
  @action
  resetAnimCountPerQuestion() {
    this.animCountPerQuestion = 0
  }

  @observable
  playVideo = false
  @action
  setPlayVideo(val) {
    this.playVideo = val
  }

  @observable
  proceedToVideoScreen = false
  @action
  setProceedToVideoScreen(val) {
    this.proceedToVideoScreen = val
  }

  @observable
  videoFootage = ''
  @action
  setVideoFootage(val) {
    this.videoFootage = val
  }

  @observable
  pageFootageLength = 0
  @action
  setPageFootageLength(val) {
    this.pageFootage = val
  }

  @observable
  getReadyDone = false
  @action
  setGetReadyDone(val) {
    this.getReadyDone = val
  }

  @observable
  currentLivePlayCount = 0
  @action
  setCurrentLivePlayCount(val) {
    this.currentLivePlayCount += val
  }
  @action
  resetCurrentLivePlayCount() {
    this.currentLivePlayCount = 0
  }

  @observable
  currentStarCount = 0
  @action
  setCurrentStarCount(val) {
    this.currentStarCount += val
  }
  @action
  resetCurrentStarCount() {
    this.currentStarCount = 0
  }

  @observable
  liveGamePlaythrough = 0
  @action
  setLiveGamePlaythrough(val) {
    this.liveGamePlaythrough = val
  }

  @action
  updateUserPlaythrough() {
    return agent.Server.updateUserPlaythrough()
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  @observable
  interceptedAnswer = false
  @action
  setInterceptedAnswer(val) {
    this.interceptedAnswer = val
  }

  @observable
  playCounter = 0
  @action
  incrementPlayCounter(callback) {
    this.playCounter = this.playCounter + 1
    callback(this.playCounter)
  }

  @action
  resetVars() {
    this.livegameAnswers = []
    this.isInitNextPage = false
    this.isNextPage = false
    this.currentPageId = 0
    this.isMultiplierStarted = false
    this.isFeeCounterSpinned = false
    this.isResultsShowing = false
    this.runningLength = 0
    this.animCountPerQuestion = 0
    this.playVideo = false
    this.proceedToVideoScreen = false
    this.videoFootage = ''
    this.getReadyDone = false
    this.currentLivePlayCount = 0
    this.currentStarCount = 0
    this.liveGamePlaythrough = 0
  }
}

export default new LiveGameStore()
