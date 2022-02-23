import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled from 'styled-components'
import { mobileScale, evalImage } from '@/utils'
// import enableInlineVideo from 'iphone-inline-video'

@inject('PrePickStore', 'LiveGameStore', 'NavigationStore', 'GameStore')
@observer
export default class ThirdTab extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      muted: false,
      timer: 0,
      playText: 'PAUSE',
      check: null,
      touched: false,
    })

    this.disposePlayVideo = intercept(
      this.props.GameStore,
      'playing',
      change => {
        if (change.newValue) {
          console.log('>>>>>>>>>>>>>>', this.props.GameStore.leapType)
          if (this.videoPlayer) {
            this.videoPlayer.currentTime = 1
            this.videoPlayer.play()
          }
        } else {
          if (this.videoPlayer) {
            this.videoPlayer.pause()
            this.videoPlayer.currentTime = 0
          }
        }

        return change
      }
    )

    this.disposeLocationWhileOnGameState = intercept(
      this.props.NavigationStore,
      'locationWhileOnGameState',
      change => {
        if (!isMobile.any()) {
          this.interceptedMuteDesktop(change.newValue)
        }

        return change
      }
    )

    this.disposeAutomationGameState = intercept(
      this.props.GameStore,
      'automationGameState',
      change => {
        this.toggleAutomationGame(change.newValue)
        return change
      }
    )

    // this.disposeAutomationGameStatex = intercept(this.props.GameStore, 'automationGameState', change => {
    //   if (change.newValue && 'paused' === change.newValue.state) {
    //     this.videoPlayer.pause()
    //   } else {
    //     this.videoPlayer.play()
    //   }
    //   return change
    // })
  }

  interceptedMuteMobile(newValue) {
    if (this.touched) {
      if (newValue) {
        if (
          this.props.NavigationStore.location &&
          '/livegame' ===
            this.props.NavigationStore.location.toLocaleLowerCase()
        ) {
          this.muted = true
        } else {
          this.muted = false
        }
      } else {
        this.muted = false
      }
    }
  }

  interceptedMuteDesktop(newValue) {
    if (newValue) {
      if (
        this.props.NavigationStore.location &&
        '/livegame' === this.props.NavigationStore.location.toLocaleLowerCase()
      ) {
        this.muted = true
      } else {
        this.muted = false
      }
    } else {
      this.muted = false
    }
  }

  togglePlay() {
    if (this.playText === 'PLAY') {
      this.videoPlayer.play()
      this.playText = 'PAUSE'
    } else {
      this.videoPlayer.pause()
      this.playText = 'PLAY'
      clearInterval(this.check)
    }
  }

  toggleVolume() {
    if (isMobile.any()) {
      this.touched = true
    }
    this.muted = !this.muted
  }

  countdown() {
    this.check = setInterval(() => {
      this.props.LiveGameStore.setVideoFootage(Footage(++this.timer))
      if (this.timer >= 446) {
        clearInterval(this.check)
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.check)
    this.disposePlayVideo()
    this.disposeLocationWhileOnGameState()
    this.disposeAutomationGameState()
  }

  toggleAutomationGame(params) {
    if (params) {
      if (params.footageCurrentTime) {
        this.videoPlayer.currentTime = params.footageCurrentTime + 1
        if ('paused' === params.state) {
          this.videoPlayer.pause()
        } else {
          this.videoPlayer.play()
        }
      }
    }
  }

  componentDidMount() {
    this.toggleAutomationGame(this.props.GameStore.automationGameState)

    if (isMobile.any()) {
      this.muted = false
      this.toggleVolume()
    }

    //enableInlineVideo(this.videoPlayer)
  }

  render() {
    return (
      <Container bg={require('@/assets/images/playalong-bg-demo_start.jpg')}>
        <VideoWrapper>
          {/*<video*/}
          {/*  playsInline*/}
          {/*  muted={this.muted}*/}
          {/*  ref={ref => (this.videoPlayer = ref)}*/}
          {/*  style={{ width: '100%' }}*/}
          {/*  id="livegame-thirdtabvideo"*/}
          {/*>*/}
          {/*  <source src={Video} />*/}
          {/*  Your browser does not support HTML5 video.*/}
          {/*</video>*/}

          {/*<ReactPlayer*/}
          {/*  width='100%'*/}
          {/*  height='100%'*/}
          {/*  playsinline*/}
          {/*  controls={false}*/}
          {/*  playing={this.playing}*/}
          {/*  muted={this.muted}*/}
          {/*  url="https://www.sportocotoday.com/image/data/videos/Texans_Patriots-10mins-Q1.mp4"*/}
          {/*/>*/}

          {'recording' === this.props.GameStore.leapType ? (
            <video
              controls={false}
              playsInline
              muted={this.muted}
              ref={ref => (this.videoPlayer = ref)}
              style={{ width: '100%' }}
              id="livegame-thirdtabvideo"
            >
              <source
                src={`https://www.sportocotoday.com/image/${this.props.GameStore.videoPath}`}
              />
              Your browser does not support HTML5 video.
            </video>
          ) : null}

          <MuteButton onClick={this.toggleVolume.bind(this)}>
            <img
              src={
                this.muted
                  ? evalImage('icon-volume_off.svg')
                  : evalImage('icon-volume_on.svg')
              }
            />
          </MuteButton>
        </VideoWrapper>

        {/*
        <FootageWrapper>
          <FootageMode>
            <div
              style={{ cursor: 'pointer' }}
              onClick={this.togglePlay.bind(this)}
            >
              {this.timer ? this.playText : ''}
            </div>
          </FootageMode>
          <FootageTimer>{this.props.LiveGameStore.videoFootage}</FootageTimer>
        </FootageWrapper>
*/}
      </Container>
    )
  }
}

let Footage = t => {
  let mins = t / 60
  let mods = t % 60

  if (Math.floor(mins) > 0) {
    return Math.floor(mins) + ':' + mods
  } else {
    return '0:' + mods
  }
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  background-color:black;
  // background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
`
const MuteButton = styled.span`
  position: absolute;
  top: 10%;
  right: 10%;
  z-index: 5;
  color: white;
  cursor: pointer;
`

const FootageWrapper = styled.div`
  position: absolute;
  bottom: 5%;
  //right: 10%;
  z-index: 5;
  font-size: ${props => mobileScale(4)};
  color: white;

  width: inherit;
  display: flex;
  flex-direction: row;
`

const FootageMode = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-left: 5%;
`
const FootageTimer = styled.div`
  width: inherit;
  display: flex;
  justify-content: flex-end;
  margin-right: 5%;
`

const VideoWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

const VideoArea = styled.video`
  width: 100%;
  pointer-events: none;
  &::-webkit-media-controls-play-button {
    opacity: 0;
    pointer-events: none;
  }
  &::-webkit-media-controls-start-playback-button {
    opacity: 0;
    pointer-events: none;
  }
`

const VideoArea_ = styled.video`
  &::-webkit-media-controls-fullscreen-button {
    display: none;
  }
  &::-webkit-media-controls-play-button {
    display: none;
  }
  &::-webkit-media-controls-volume-slider {
    display: none;
  }

  &::-webkit-media-controls-timeline {
    display: none;
  }

  &::-webkit-media-controls-current-time-display {
    display: none;
  }
`

let isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any: function() {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    )
  },
}
