import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import Background from '@/assets/images/BGs-Ambassador_Pass-outro01.jpg'
import { vhToPx, responsiveDimension } from '@/utils'
import keyIcon from '@/assets/images/menu-key-icon.svg'
import Summary from './Summary'
import Share from '@/Components/OutroScreen/Share'
import CopyLayover from '@/Components/OutroScreen/Share/CopyLayover'
import ShareLayover from '@/Components/OutroScreen/Share/ShareLayover'
import LoginFirst from '@/Components/Common/LoginFirst'

@inject(
  'ShareStatusStore',
  'NavigationStore',
  'ShareStatusStore',
  'ProfileStore',
  'CommonStore'
)
@observer
export default class OutroScreen extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      started: false,
    })

    //this.props.ProfileStore.getProfile()
    //this.props.ProfileStore.getInviteesLength()
    //this.props.CommonStore.getKeySharedCredits()
  }

  componentDidUpdate(n) {
    if (!this.props.ProfileStore.isLoading && !this.started) {
      if (this.share) {
        TweenMax.set(this.share, {
          opacity: 0,
          zIndex: -1,
        })
      }

      if (this.props.NavigationStore.isShareKeyScreen) {
        this.props.NavigationStore.setIsShareKeyScreen(false)
        this.handleToMyKey()
      }
    }
  }

  handleIsLoggedIn(response) {
    if (response) {
      setTimeout(() => {
        this.props.ProfileStore.getProfile()
        this.props.ProfileStore.getInviteesLength()
        this.props.CommonStore.getKeySharedCredits()
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.props.NavigationStore.setActiveMenu(null)
    if (this.props.toGameState) {
      this.props.toGameState()
    }
  }

  componentDidMount() {
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )
  }

  componentDidMount_() {
    TweenMax.set(this.share, {
      opacity: 0,
      zIndex: -1,
    })
    /*
    if (this.props.isFromMenu) {
      new TimelineMax({ repeat: 0 })
        .set(this.summary, {
          opacity: 0,
          zIndex: -1,
        })
        .set(this.share, {
          zIndex: 0,
          opacity: 1,
          onComplete: () => {
            this.started = true
          },
        })
    } else {
      TweenMax.set(this.share, {
        opacity: 0,
        zIndex: -1,
      })
    }
*/
  }

  handleToMyKey() {
    if (this.summary && this.share) {
      new TimelineMax({ repeat: 0 })
        .to(this.summary, 0.35, {
          opacity: 0,
        })
        .to(this.summary, 0, {
          zIndex: -1,
        })
        .to(this.share, 0, {
          zIndex: 0,
        })
        .to(this.share, 0.35, {
          opacity: 1,
          onComplete: () => {
            this.started = true
          },
        })
    }
  }

  openCopyLayover(key) {
    if (this.copyLayover) {
      ReactDOM.unmountComponentAtNode(this.refCodeWrapper)
      let input = (
        <ReferralCodeInput value={key} id="referralCodeInput" readOnly />
      )
      ReactDOM.render(input, this.refCodeWrapper, () => {
        var ref = document.getElementById('referralCodeInput')
        ref.focus()
        ref.setSelectionRange(0, 99999)
        document.execCommand('copy')
        ReactDOM.unmountComponentAtNode(this.refCodeWrapper)
      })

      new TimelineMax({ repeat: 0 })
        .set(this.copyLayover, {
          zIndex: 5,
        })
        .to(this.copyLayover, 0.5, {
          opacity: 1,
        })
    }
  }

  closeCopyLayover() {
    /*
    let currLoc = this.props.NavigationStore.bypassActiveMenu.filter(
      o => o.route === '/livegame'
    )[0]
*/
    let currLoc = this.props.NavigationStore.routes.filter(
      o => o.route === '/livegame' && o.canBeBypassed
    )[0]
    if (currLoc && currLoc.through) {
      if (!this.props.CommonStore.replayed) {
        this.props.NavigationStore.setCurrentView('/replay')
        this.props.CommonStore.setReplayed(true)
        return
      }
    }

    new TimelineMax({ repeat: 0 })
      .to(this.copyLayover, 0.5, {
        opacity: 0,
      })
      .set(this.copyLayover, {
        zIndex: -1,
      })
  }

  openShareLayover() {
    new TimelineMax({ repeat: 0 })
      .set(this.shareLayover, {
        zIndex: 5,
      })
      .to(this.shareLayover, 0.5, {
        opacity: 1,
      })
  }

  closeShareLayover(cb) {
    /*
    let currLoc = this.props.NavigationStore.bypassActiveMenu.filter(
      o => o.route === '/livegame'
    )[0]
*/
    let currLoc = this.props.NavigationStore.routes.filter(
      o => o.route === '/livegame' && o.canBeBypassed
    )[0]
    if (currLoc && currLoc.through) {
      if (!this.props.CommonStore.replayed) {
        this.props.NavigationStore.setCurrentView('/replay')
        this.props.CommonStore.setReplayed(true)
        return
      }
    }

    new TimelineMax({ repeat: 0 })
      .to(this.shareLayover, 0.5, {
        opacity: 0,
      })
      .set(this.shareLayover, {
        zIndex: -1,
        onComplete: cb,
      })
  }

  render() {
    let { isLoading, profile, inviteesLength, err } = this.props.ProfileStore
    let { keySharedCredits } = this.props.CommonStore

    if (err) {
      return (
        <Container>
          <LoginFirst handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
        </Container>
      )
    }

    if (this.props.CommonStore.isLoading || (isLoading && !err)) {
      return <Container />
    }

    return (
      <Container>
        <CopyLayover
          reference={ref => (this.copyLayover = ref)}
          referralCode={profile.key}
          return={this.closeCopyLayover.bind(this)}
        />
        <ShareLayover
          reference={ref => (this.shareLayover = ref)}
          referralCode={profile.key}
          return={this.closeShareLayover.bind(this)}
        />
        {/*
          {
            !this.isLoggedIn ? (
              <LoginFirst handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
            ) : null
          }
*/}
        <Wrapper>
          <DropDownBannerContainer>
            <BannerText />
            <Banner>
              <Icon src={keyIcon} />
            </Banner>
          </DropDownBannerContainer>
          <Contents>
            <Summary
              profile={profile}
              reference={ref => (this.summary = ref)}
              handleToMyKey={this.handleToMyKey.bind(this)}
            />
            {/*
      INCLUDED - COMMENTED OUT BECAUSE OF THE ERROR IN PROFILE
            <Share
              keySharedCredits={keySharedCredits}
              profile={profile}
              usedKeys={inviteesLength}
              started={this.started}
              reference={ref => (this.share = ref)}
              handleOpenCopyLayover={this.openCopyLayover.bind(
                this,
                profile.key
              )}
              handleOpenShareLayover={this.openShareLayover.bind(this)}
              refCode={c => (this.refCode = c)}
              refCodeWrapper={c => (this.refCodeWrapper = c)}
            />
*/}

            {/*
      <Top marginTop={10}>

      </Top>
      <Bottom></Bottom>
*/}
          </Contents>
        </Wrapper>
      </Container>
    )
  }
}

const ReferralCodeInput = styled.input`
  background-color: transparent;
  border: none;
  text-align: center;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(8)};

  height: ${props => responsiveDimension(8)};
  color: transparent;
`

const Container = styled.div`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-top: ${props => vhToPx(10)};
`
const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => responsiveDimension(1.4)};
  display: flex;
  flex-direction: row;
`
const BannerText = styled.div`
  margin-top: ${props => vhToPx(1)};
  font-size: ${props => responsiveDimension(5)};
  font-family: pamainlight;
  color: #19d1bf;
  text-transform: uppercase;
  &:before {
    content: 'Your Key';
  }
`

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(8.5)};
  background-color: #19d1bf;
  margin-left: ${props => responsiveDimension(1.5)};
  position: relative;
  border-bottom-left-radius: ${props => responsiveDimension(5)};
  border-bottom-right-radius: ${props => responsiveDimension(5)};
  animation: ${props => backBanner} 0.75s forwards;
`

const Icon = styled.div`
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  border-radius: ${props => responsiveDimension(4.5)};
  background-color: #000000;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;

  margin-left: ${props => responsiveDimension(0.1)};
  margin-bottom: ${props => responsiveDimension(0.3)};
`

const backBanner = keyframes`
  0%{height: ${responsiveDimension(1)};}
  50%{height: ${responsiveDimension(9.5)};}
  100%{height: ${props => responsiveDimension(8.5)};}
`

const Contents = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
`
