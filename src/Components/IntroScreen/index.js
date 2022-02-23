import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { withRouter } from 'react-router-dom'
import ServerSideRender from '@/Components/IntroScreen/ServerSideRender'
import playalongLogo from '@/assets/images/PlayAlongNow-Logo_Invert.svg'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import ContinueButton from '@/Components/Button'
import background from '@/assets/images/sportoco-bg-ambassadors-basic.jpg'
import timer_circle_full from '@/assets/images/timer-circle_full.svg'
import SponsorIconExos from '@/assets/images/sponsors/logo-exos.svg'
import SponsorIconSklz from '@/assets/images/sponsors/logo-sklz.svg'
import PrizeAmalfi from '@/assets/images/sponsors/amalfi_coast-prize-banner.jpg'
import PrizeSmallHotel from '@/assets/images/sponsors/small_luxury_hotel-prize-banner.jpg'
import PrizeNYVacation from '@/assets/images/sponsors/ny_vacarion_broadway-prize-banner.jpg'

import PA from '@/assets/images/pa-icon-white.svg'
import { TweenMax, Power4 } from 'gsap'
import { BaseContainer } from '@/Containers/Placeholder'
import { vhToPx, maxHeight, loadImagesUponPageLoad } from '@/utils'

@inject(
  'ProfileStore',
  'UserStore',
  'IntroScreenStore',
  'AuthStore',
  'NavigationStore'
)
@withRouter
@observer
class IntroScreen extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      sportocoLogo,
      playalongLogo,
      showNext: false,
      clicked: false,
      sLogo: null,
      pLogo: null,
      sectionOne: null,
      contentDom: null,
      show: false,
    })
    this.forcedWaitTime = 8000
    this.prizeImages = [PrizeAmalfi, PrizeSmallHotel, PrizeNYVacation]
  }

  handleButtonClick() {
    if (!this.clicked) {
      this.clicked = true
      this.exit = setTimeout(() => {
        if (this.props.AuthStore.userId) {
          TweenMax.to(this.contentDom, 0.25, {
            opacity: 0,
            onComplete: () => {
              this.props.NavigationStore.setCurrentView('/prebegin')
            },
          })
        } else {
          TweenMax.to(this.contentDom, 0.25, {
            opacity: 0,
            onComplete: () => {
              this.props.NavigationStore.setCurrentView('/signup')
            },
          })
        }
      }, 250)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.exit)
  }

  changeBackgroundPosition(pos) {
    TweenMax.to(this.backgroundRef, 1, {
      backgroundPositionX: `${pos}%`,
    })
  }

  componentDidMount() {
    loadImagesUponPageLoad(this.RefMainContainer, next => {
      if (next) {
        this.executeAnim()
      }
    })
  }

  executeAnim() {
    this.props.NavigationStore.setCurrentView('init')
    if (!this.refLogos || !this.sLogo || !this.pLogo) {
      return
    }

    TweenMax.set(this.refLogos, { y: '40%' })
    TweenMax.to(this.sLogo, 1.5, {
      opacity: 1,
      delay: 0.25,
    })
    TweenMax.to(this.pLogo, 1.5, {
      opacity: 1,
      delay: 0.5,
      onComplete: () => {
        this.props.IntroScreenStore.loadData()
          .then(d => {
            TweenMax.to(this.SectionHeader, 0.9, { opacity: 1 })
            TweenMax.to(this.SectionSubHeader, 0.9, { opacity: 1 })
            TweenMax.to(this.SponsorWrapper, 0.9, { opacity: 1 })
            const start = new Date().getTime()
            TweenMax.to(this.refLogos, 0.9, {
              //y: '6.9%',
              y: '4.8%',
              ease: Power4.easeOut,
              onComplete: () => {
                if (this.refShortcuts) {
                  TweenMax.set(this.refShortcuts, { opacity: 1 })
                }
                this.props.NavigationStore.setCurrentView('init2')
                this.show = true
                // this.changeBackgroundPosition(60)
                const total = new Date().getTime() - start
                const waitTime =
                  this.forcedWaitTime - total > 0
                    ? this.forcedWaitTime - total
                    : 0
                this.exit = setTimeout(() => {
                  TweenMax.to(this.sectionOne, 0.5, {
                    right: '50%',
                    opacity: 0,
                    onComplete: () => {
                      this.showNext = true
                      TweenMax.to(this.contentDom, 1, { opacity: 1 })
                      // this.changeBackgroundPosition(30)
                    },
                  })
                }, waitTime)
              },
            })
          })
          .catch(e => {
            console.error(e)
          })
      },
    })
  }

  redirect(view) {
    this.props.AuthStore.values.email = 'ambassador1@sharklasers.com'
    this.props.AuthStore.values.password = 'AmbassadorPass.v1'
    this.props.AuthStore.login()
      .then(d => {
        debugger
        this.props.ProfileStore.profile = d
        this.props.ProfileStore.debitCurrenciesAtLaunch({
          currency: 'points',
          amount: d.currencies.points,
        })
        this.props.ProfileStore.debitCurrenciesAtLaunch({
          currency: 'stars',
          amount: d.currencies.stars,
        })
        this.props.ProfileStore.debitCurrenciesAtLaunch({
          currency: 'tokens',
          amount: d.currencies.tokens,
        })
        this.props.NavigationStore.setCurrentView(view)
      })
      .catch(e => {
        this.error = 'Invalid email'
      })
  }

  render() {
    const { IntroScreenStore } = this.props
    const { introScreenIsLoading, content, secondaryContent } = IntroScreenStore
    return (
      <IntroScreenView innerRef={ref => (this.RefMainContainer = ref)}>
        <Content
          show={this.show}
          innerRef={ref => (this.backgroundRef = ref)}
        />
        <LogoWrapper top={7} innerRef={ref => (this.refLogos = ref)}>
          <LogoImg
            innerRef={ref => (this.sLogo = ref)}
            src={this.sportocoLogo}
            width={25}
            alt="sportoco logo"
            top={7}
          />
          <LogoImg
            innerRef={ref => (this.pLogo = ref)}
            src={this.playalongLogo}
            width={45}
            alt="playalong logo"
            top={12}
          />
        </LogoWrapper>
        <ContentSection>
          {!introScreenIsLoading ? (
            <AnimateSection
              innerRef={ref => (this.sectionOne = ref)}
              animate={this.showNext}
            >
              <Section
                innerRef={ref => (this.SectionHeader = ref)}
                style={{ opacity: 0 }}
              >
                <TextWrapper>
                  <Text font={'pamainlight'} size={6}>
                    welcome
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainextrabold'} size={7.8} color={'#efdf18'}>
                    ambassador
                  </Text>
                </TextWrapper>
              </Section>
              <Section
                marginTop={4}
                innerRef={ref => (this.SectionSubHeader = ref)}
                style={{ opacity: 0 }}
              >
                <TextWrapper>
                  <Text
                    font={'pamainbold'}
                    size={4}
                    color={'#ed1c24'}
                    spacing={0.2}
                  >
                    view&nbsp;
                  </Text>
                  <Text font={'pamainregular'} size={4} spacing={0.2}>
                    and&nbsp;
                  </Text>
                  <Text
                    font={'pamainbold'}
                    size={4}
                    color={'#ed1c24'}
                    spacing={0.2}
                  >
                    share&nbsp;
                  </Text>
                  <Text font={'pamainregular'} size={4} spacing={0.2}>
                    this
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainbold'} size={4.3} spacing={0.2}>
                    football&nbsp;
                  </Text>
                  <Text font={'pamainbold'} size={4.3} spacing={0.2}>
                    experience
                  </Text>
                </TextWrapper>
              </Section>
              <SponsorWrapper innerRef={ref => (this.SponsorWrapper = ref)}>
                <TextWrapper>
                  <Text font={'pamainbold'} size={4.2} lineHeight={1.1}>
                    participate to win -&nbsp;
                  </Text>
                  <Text font={'pamainlight'} size={4.2} lineHeight={1.1}>
                    travel
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainlight'} size={4.3} lineHeight={1.1}>
                    tickets&nbsp;
                  </Text>
                  <SponsorImage src={SponsorIconExos} size={3.3} />
                  <Text font={'pamainlight'} size={4.3} lineHeight={1.1}>
                    &nbsp;training&nbsp;
                  </Text>
                  <SponsorImage src={SponsorIconSklz} size={3.3} />
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainlight'} size={4.3} lineHeight={1.1}>
                    gear - and more...
                  </Text>
                </TextWrapper>
              </SponsorWrapper>
              <CircleWrapper>
                {content.MainHeader ? <PaCircle delay={1.5} /> : null}
              </CircleWrapper>
              <FooterWrapper>
                {content.MainHeader ? (
                  <Footer delay={1.5}>Ambassador Demo 1.0v</Footer>
                ) : null}
              </FooterWrapper>
              <ServerSideRender delay={1.5} data={content.SectionEvents} />
            </AnimateSection>
          ) : null}
        </ContentSection>
        <SecondaryContent innerRef={ref => (this.contentDom = ref)}>
          <Section>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainlight'} size={5.3}>
                  earn&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={5.3} color={'#ffb600'}>
                  tokens&nbsp;
                </Text>
                <Text font={'pamainlight'} size={5.3}>
                  &&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={5.3} color={'#17c5ff'}>
                  points
                </Text>
              </TextAlign>
            </TextWrapper>
            <TextWrapper>
              <TextAlign>
                <Text font={'pamainlight'} size={5.3}>
                  and&nbsp;
                </Text>
                <Text font={'pamainextrabold'} size={5.3}>
                  win&nbsp;
                </Text>
                <Text font={'pamainlight'} size={5.3}>
                  featured prizes
                </Text>
              </TextAlign>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainbold'} size={7.5} color={'#926aa8'}>
                ‘big prize boards’
              </Text>
            </TextWrapper>
          </Section>
          <Section marginTop={1}>
            <PrizeImageWrapper>
              <TextWrapper>
                <Text font={'pamainlight'} size={2.4}>
                  wine tour vacations to italy
                </Text>
              </TextWrapper>
              <TextWrapper>
                <SponsorImage src={this.prizeImages[0]} size={9.5} />
              </TextWrapper>
            </PrizeImageWrapper>
            <PrizeImageWrapper>
              <TextWrapper>
                <Text font={'pamainlight'} size={2.4}>
                  small hotels of the world vacations
                </Text>
              </TextWrapper>
              <TextWrapper>
                <SponsorImage src={this.prizeImages[1]} size={9.5} />
              </TextWrapper>
            </PrizeImageWrapper>
            <PrizeImageWrapper>
              <TextWrapper>
                <Text font={'pamainlight'} size={2.4}>
                  ny vacation - broadway show week
                </Text>
              </TextWrapper>
              <TextWrapper>
                <SponsorImage src={this.prizeImages[2]} size={9.5} />
              </TextWrapper>
            </PrizeImageWrapper>
          </Section>
          <Section>
            <ButtonWrapper>
              <ContinueButton
                handleButtonClick={this.handleButtonClick.bind(this)}
                padding={{ left: 2, right: 2 }}
              />
            </ButtonWrapper>
          </Section>
          <Section>
            <FooterNext>Ambassador Demo 1.0v</FooterNext>
          </Section>
        </SecondaryContent>

        <ShortcutWrapper innerRef={c => (this.refShortcuts = c)}>
          <ShortcutRow>
            <LivePlayShortcut onClick={this.redirect.bind(this, '/livegame')} />
            <SocialRankingShortcut
              onClick={this.redirect.bind(this, '/socialranking')}
            />
            {/*<GlobalRankingShortcut*/}
            {/*onClick={this.redirect.bind(this, '/globalranking')}*/}
            {/*/>*/}
            <ResolveShortcut onClick={this.redirect.bind(this, '/resolve')} />
            <StarPrizeShortcut
              onClick={this.redirect.bind(this, '/starprize')}
            />
          </ShortcutRow>
        </ShortcutWrapper>
        {/*
        {window.location.hostname.toString().includes('review') ||
        window.location.hostname.toString().includes('localhost') ||
        window.location.hostname.toString().includes('192.168') ? (
        ) : null}
*/}
      </IntroScreenView>
    )
  }
}

const fadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity:1;
  }
`

const ButtonWrapper = styled.div`
  width: 100%;
  //transform: scale(0.9);
`

const LogoWrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`

const LogoImg = styled.img`
  opacity: 0;
  width: ${props => props.width}%;
  margin-bottom: ${props => vhToPx(2)};
  max-width: ${props => props.width / 0.2}px;
`

const Content = styled.div`
  ${props =>
    props.show
      ? ''
      : `background-image: url(${props.background ||
          background});background-size: cover;background-position-x: 100%;`}
  animation: 1.5s ${fadeIn} forwards;
  animation-delay: 2s;
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width: inherit;
  z-index: 1;
  height: inherit;
`

const AnimateSection = styled.div`
  align-items: center;
  width: inherit;
  flex-direction: column;
  display: flex;
  justify-content: center;
  //--position: absolute;
`
const CircleWrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: center;
`
const FooterWrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: center;
`

const ContentSection = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  z-index: 1;
  align-items: center;
  flex-direction: column;
  display: flex;
  justify-content: center;
  margin-top: 10%;
`

const Footer = styled.div`
  width: 100%;
  text-align: center;
  animation: 1.5s ${fadeIn} forwards;
  opacity: 0;
  animation-delay: ${props => props.delay}s;
  font-size: ${props => vhToPx(1.5)};
  ${props => `position: ${props.pos}` || ''};
  ${props => `bottom: ${props.bottom}%` || ''};
`

const FooterNext = styled.div`
  width: 100%;
  //justify-content: center;
  //display: flex;
  //position: absolute;
  //bottom: 5%;
  font-size: ${props => vhToPx(1.5)};
  color: white;
`

const timersecondsgo = keyframes`
  0% {}
  100% {
    transform:rotate(360deg);
  }
`

export const PaCircle = styled.div`
  ${props =>
    props.value
      ? 'display: flex;justify-content: center;align-items: center;font-size: ' +
        vhToPx(8.7) +
        ';'
      : ''} 
  margin-top: ${props => vhToPx(2.9)};
  margin-bottom: ${props => vhToPx(1)};
  width: ${props => vhToPx(9)};
  height: ${props => vhToPx(9)};
  color: white;
  font-family: 'pamainlight';
  position: relative;
  &:before {
    content: '';
    width: ${props => vhToPx(9)};
    height: ${props => vhToPx(9)};
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    animation: ${props => timersecondsgo} 1s infinite
      cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background-image: url(${props => props.background || timer_circle_full});
    transform-origin: center;
  }
  &:after {
    content: '';
    ${props =>
      props.value
        ? ``
        : `background: url(${props.background ||
            PA}) no-repeat center;`} background-size: 90%;
    background-size: 60%;
    width: inherit;
    height: inherit;
    display: block;
    position: absolute;
    top: 0;
  }
  animation: 1.5s ${fadeIn} forwards;
  opacity: 0;
  animation-delay: ${props => props.delay}s;
`

const SecondaryContent = styled.div`
  justify-content: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25% 5% 0 5%;
  text-align: center;
  position: absolute;
  width: inherit;
  height: inherit;
  z-index: 1;
  opacity: 0;
`
const IntroScreenView = styled.div`
  width: 100%;
  height: ${props => maxHeight};
  // width: inherit;
  // height: inherit;
  color: white;
  font-family: 'pamainlight', sans-serif;
  background-color: black;
`

const SponsorWrapper = styled.div`
  width: inherit;
  display: flex;
  align-items: center;
  opacity: 0;
  flex-direction: column;

  margin-top: ${props => vhToPx(4)};
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainlight'};
  font-size: ${props => vhToPx(props.size || 4)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: ${props => props.lineHeight || 1};
  ${props =>
    props.spacing ? `letter-spacing: ${vhToPx(props.spacing)};` : ``};
`

const TextAlign = styled.div`
  text-align: center;
  line-height: ${props => props.lineHeight || 1};
`

const PrizeImageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => vhToPx(props.marginBottom || 1.1)};
`

const SponsorImage = styled.img`
  height: ${props => vhToPx(props.size || 4)};
  margin-bottom: ${props => vhToPx(0.75)};
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  ${props =>
    props.marginTop ? `margin-top: ${vhToPx(props.marginTop)};` : ``};
`

const ShortcutRow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`
const ShortcutWrapper = styled.div`
  width: 100%;
  height: 6%;
  bottom: 0;
  position: absolute;
  z-index: 100;
  display: flex;
  flex-direction: column;
  opacity: 0;

  &:hover {
    background-color: rgba(0, 114, 17, 0.5);

    ${props => LivePlayShortcut}:after {
      content: 'LIVEPLAY';
    }

    ${props => SocialRankingShortcut}:after {
      content: 'LIVEPLAY - SOCIAL RANKING';
    }

    ${props => ResolveShortcut}:after {
      content: 'RESOLVE';
    }

    ${props => StarPrizeShortcut}:after {
      content: 'STAR PRIZE';
    }

    ${props => GlobalRankingShortcut}:after {
      content: 'GLOBAL RANKING';
    }
  }
`
const LivePlayShortcut = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 114, 17, 1);
    &:after {
      content: 'LIVEPLAY';
    }
  }
`

const SocialRankingShortcut = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 114, 17, 1);
    &:after {
      content: 'LIVEPLAY - SOCIAL RANKING';
    }
  }
`

const ResolveShortcut = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 114, 17, 1);
    &:after {
      content: 'RESOLVE';
    }
  }
`

const StarPrizeShortcut = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 114, 17, 1);
    &:after {
      content: 'STAR PRIZE';
    }
  }
`

const GlobalRankingShortcut = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 114, 17, 1);
    &:after {
      content: 'GLOBAL RANKING';
    }
  }
`

export default withRouter(IntroScreen)
