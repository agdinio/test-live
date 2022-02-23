import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, withRouter } from 'react-router-dom'
import { inject, Provider } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import bgDefault from '@/assets/images/playalong-default.jpg'
import ABSlider from '@/Components/Slider/ABSlider'
import MultiSelectSlider from '@/Components/Slider/MultiSelectSlider'
import PicksPointsTokens from '@/Components/PrePick/PicksPointsTokens'
import QuestionChoicesPanel from '@/Components/PrePick/QuestionChoicesPanel'
import PrePickMsg from '@/Components/PrePick/PrePickMsg'
import CountdownClock from '@/Components/CountdownClock/CountdownClock'
import HistoryTracker from '@/Components/HistoryTracker/HistoryTracker'
import { TweenMax, TimelineMax, Power1, Ease } from 'gsap'
import BezierEasing from '@/bezier-easing'
import AuthSequence from '@/Components/Auth'
import {
  vhToPx,
  isEqual,
  evalImage,
  loadImagesSelectedUponPageLoad,
  responsiveDimension,
  dateTimeZone,
} from '@/utils'
import AuthStore from '@/stores/AuthStore'
import ProfileStore from '@/stores/ProfileStore'
import GameStore from '@/stores/GameStore'

@inject(
  'PrePickStore',
  'NavigationStore',
  'ProfileStore',
  'LiveGameStore',
  'CommandHostStore',
  'GameStore'
)
@withRouter
export default class PrePick extends Component {
  constructor(props) {
    super(props)
    this.lastRow = null
    this.state = {
      question: null,
      message: null,
      notifyPicksPointsTokens: false,
      imageHasLoaded: false,
    }

    if (
      this.props.CommandHostStore.gameSubscriptionParams &&
      Object.keys(this.props.CommandHostStore.gameSubscriptionParams).length > 0
    ) {
      // this.props.GameStore.subscribeToGame(
      //   this.props.CommandHostStore.gameSubscriptionParams
      // )
      //todo: do nothing
    } else {
      this.props.NavigationStore.setCurrentView('/followedgames')
    }
  }

  handleUpdateBackground(response) {
    debugger
    switch (response) {
      case 0:
        break
      case 1:
        TweenMax.to(this.refBGContainer, 0, { filter: 'grayscale(0)' })
        break
      case 2:
        new TimelineMax({ repeat: 0 })
          .to(this.refFlashContainer, 0.2, {
            zIndex: 100,
            opacity: 0.8,
            ease: Power1.easeIn,
          })
          .to(this.refFlashContainer, 0.2, {
            delay: 0.1,
            zIndex: 100,
            opacity: 0,
            ease: Power1.easeOut,
          })
          .set(this.refFlashContainer, {
            zIndex: -100,
          })
        TweenMax.to(this.refPrePickMsg, 0, { opacity: 0 })
        break
      default:
    }
  }

  handlePicksPointsTokenNotification(evt) {
    this.lastRow = null
    this.setState({ notifyPicksPointsTokens: evt.isNotify })
  }

  toggleReadyForSelection() {
    debugger
    TweenMax.fromTo(
      this.refReadyContainer,
      0.5,
      { zIndex: 100 },
      { zIndex: -100 }
    )
  }

  handleIsLoggedIn(params, next) {
    params.userId = this.props.ProfileStore.profile.userId
    params.anonymousUserId = null
    if (next) {
      this.activityIndicator = null
      this.props.CommandHostStore.setGameSubscriptionParams(params)
      this.props.NavigationStore.setCurrentView('/livegame')
    }
  }

  handleMessageClose() {
    const params = {
      gameId: this.state.question.gameId,
      anonymousUserId: this.props.ProfileStore.profile.anonymousUserId,
      userId: this.props.ProfileStore.profile.userId,
    }

    if (params.userId) {
      if (this.refActivityIndicator) {
        ReactDOM.unmountComponentAtNode(this.refActivityIndicator)
      }
      this.props.CommandHostStore.setGameSubscriptionParams(params)
      this.props.NavigationStore.setCurrentView('/livegame')
    } else {
      if (this.refActivityIndicator) {
        const comp = (
          <Provider {...{ AuthStore, ProfileStore, GameStore }}>
            <AuthWrapper>
              <AuthSequence
                mainHandleLoggedIn={this.handleIsLoggedIn.bind(this, params)}
              />
            </AuthWrapper>
          </Provider>
        )
        ReactDOM.render(comp, this.refActivityIndicator)
      }
    }
  }

  picksPointsTokensCallback(evt) {
    if (evt) {
      if (
        this.props.PrePickStore.totalPrePicks >
        this.props.PrePickStore.currentPrePick
      ) {
        setTimeout(() => {
          this.setState({ notifyPicksPointsTokens: false })
          this.props.PrePickStore.incrementCurrentPrePick(1)
          this.props.PrePickStore.captureAnalyticPrePickStart()
          this.assembleQuestion()
        }, 300)
      } else {
        //this.props.PrePickStore.setPrePickPlaythrough(1)

        this.props.NavigationStore.setPlayThroughOnActiveMenu('/prepick')

        // setTimeout(() => {
        //   this.props.NavigationStore.setCurrentView('/starprize')
        // }, 1000)
        setTimeout(() => {
          if (this.refActivityIndicator) {
            let comp = (
              <MessageIndicator>
                <TextWrapper key={'pp-completed-1'} marginBottom={3}>
                  <Text
                    font={'pamainlight'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    YOU HAVE COMPLETED ALL PRE-PICKS..
                  </Text>
                </TextWrapper>
                <Button
                  key={'pp-completed-4'}
                  borderColor={'#ffffff'}
                  onClick={this.handleMessageClose.bind(this)}
                />
              </MessageIndicator>
            )
            ReactDOM.render(comp, this.refActivityIndicator)
          }
        }, 1000)
      }
    }
  }

  fadeInQuestion() {
    new TimelineMax({ repeat: 0 })
      .to(this.refBGContainer, 0, { filter: 'grayscale(1)' })
      .fromTo(
        this.refBGContainer,
        0.5,
        { opacity: 0 },
        {
          opacity: 1,
          ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
          //onComplete: this.toggleReadyForSelection.bind(this),
        }
      )
    TweenMax.fromTo(
      this.refQuestionPanelWrapper,
      0.3,
      { opacity: 1, y: '-100%' },
      {
        opacity: 1,
        y: '0%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      }
    )
    TweenMax.fromTo(
      this.refSliderWrapper,
      0.3,
      { opacity: 0, y: '-100%' },
      {
        opacity: 1,
        y: '0%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      }
    )
    TweenMax.fromTo(
      this.refPrePickMsg,
      0.3,
      { opacity: 0, y: '-100%' },
      {
        opacity: 1,
        y: '0%',
        ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
      }
    )
  }

  assembleQuestion() {
    let { PrePickStore } = this.props
    let question = PrePickStore.questions.filter(
      o => o.prepickSequence === PrePickStore.currentPrePick
    )[0]

    if (question) {
      question.eventTimeStart = dateTimeZone(new Date())
      question.labels.sort((a, b) => a.sequence > b.sequence)
    }

    let message = PrePickStore.messages.filter(
      o => o.prepickSequence === PrePickStore.currentPrePick
    )[0]
    if (message) {
      message.headers.sort((a, b) => a.sequence > b.sequence)
      message.details.sort((a, b) => a.sequence > b.sequence)
    }

    const prepickBackground = evalImage(question.background)
    loadImagesSelectedUponPageLoad([prepickBackground], next => {
      if (next) {
        this.setState({ question: question, message: message })
        if (this.refBGContainer) {
          this.refBGContainer.style.backgroundImage =
            'url(' + prepickBackground + ')'
        }
        this.fadeInQuestion()
      }
    })
  }

  answered(answer) {
    this.props.PrePickStore.captureAnalyticPrePickAnswered(
      JSON.stringify(answer)
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.state.question, nextState.question)) {
      return true
    }

    if (
      this.state.notifyPicksPointsTokens !== nextState.notifyPicksPointsTokens
    ) {
      return true
    }

    return false
  }

  componentWillUnmount() {
    this.props.PrePickStore.resetVars()
  }

  componentDidMount() {
    if (
      this.props.PrePickStore.questions &&
      this.props.PrePickStore.questions.length > 0
    ) {
      this.assembleQuestion()
    } else {
      /*
      /!**
       * if there are no prepicks coming from the server, then pull the default sample prepicks
       **!/
      this.props.PrePickStore.pullData().then(next => {
        if (next) {
          this.assembleQuestion()
        }
      })
*/

      this.props.NavigationStore.setCurrentView('/livegameschedule')
    }

    this.props.PrePickStore.captureAnalyticPrePickStart()
  }

  render() {
    let { totalPrePicks, currentPrePick, teams } = this.props.PrePickStore
    let { question, message } = this.state
    let SliderTag = question
      ? question.choiceType.toLowerCase() === 'ab'
        ? ABSlider
        : MultiSelectSlider
      : null

    return (
      <Container bg={bgDefault} key={currentPrePick}>
        <ActivityIndicatorWrapper
          innerRef={ref => (this.refActivityIndicator = ref)}
        />

        <BackgroundContainer
          innerRef={c => (this.refBGContainer = c)}
          bg={null}
        />

        <HistoryContainer>
          <HistoryTracker preText="Pre Pick" symbol="PrePick" />
        </HistoryContainer>

        <ContentContainer>
          <UpperPanel>
            {/*<LogoWrapper>*/}
            {/*<SportocoLogoWrapper>*/}
            {/*<SportocoLogo src={sportocoLogo} />*/}
            {/*</SportocoLogoWrapper>*/}
            {/*<PlayAlongLogoWrapper>*/}
            {/*<PlayAlongLogo src={playalongLogo} />*/}
            {/*</PlayAlongLogoWrapper>*/}
            {/*</LogoWrapper>*/}
            <CountdownClockWrapper>
              <CountdownClock />
            </CountdownClockWrapper>
            <QuestionPanelWrapper
              innerRef={c => (this.refQuestionPanelWrapper = c)}
            >
              {question ? (
                <QuestionChoicesPanel
                  currentPrePick={currentPrePick}
                  question={question}
                />
              ) : null}
            </QuestionPanelWrapper>

            <SliderWrapper innerRef={c => (this.refSliderWrapper = c)}>
              {question ? (
                <SliderTag
                  key={`slider-${currentPrePick}`}
                  currentPrePick={currentPrePick}
                  teams={teams}
                  question={question}
                  handlePicksPointsTokenNotification={this.handlePicksPointsTokenNotification.bind(
                    this
                  )}
                  handleUpdateBackground={this.handleUpdateBackground.bind(
                    this
                  )}
                  groupComponent="PREPICK"
                  answered={this.answered.bind(this)}
                />
              ) : null}
            </SliderWrapper>
          </UpperPanel>
          <LowerPanel>
            <MessageWrapper innerRef={c => (this.refPrePickMsg = c)}>
              {question && question.info ? (
                <PrePickMsg
                  reference={ref => {
                    if (!this.lastRow) {
                      this.lastRow = ref
                    }
                  }}
                  currentPrePick={currentPrePick}
                  info={question.info}
                />
              ) : null}
            </MessageWrapper>
            <PoinstTokensWrapper>
              <PicksPointsTokens
                question={question}
                totalPrePicks={totalPrePicks}
                currentPrePick={currentPrePick}
                isNotified={this.state.notifyPicksPointsTokens}
                picksPointsTokensCallback={this.picksPointsTokensCallback.bind(
                  this
                )}
              />
            </PoinstTokensWrapper>
          </LowerPanel>
        </ContentContainer>

        <FlashContainer innerRef={c => (this.refFlashContainer = c)} />
        <ReadyContainer innerRef={c => (this.refReadyContainer = c)} />
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  margin: 0 auto;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
`
const BackgroundContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-filter: grayscale(1);
  -webkit-animation: ${props => fadeInBackground} 0.5s ease-in;
  -moz-animation: ${props => fadeInBackground} 0.5s ease-in;
  -o-animation: ${props => fadeInBackground} 0.5s ease-in;
  animation: ${props => fadeInBackground} 0.5s ease-in;
`
const fadeInBackground = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`
const ContentContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 4.5% 4.5% 0 4.5%;
  width: 100%;
  height: 100%;
`
const FlashContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: -100;
  background-color: #2fc12f;
  opacity: 0.6;
`

const ReadyContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: -100;
  background-color: transparent;
`

const UpperPanel = styled.div`
  width: 100%;
`
const LowerPanel = styled.div`
  width: 100%;
  height: 100%;
  bottom: 0;
  position: relative;
  display: flex;
`
const LogoWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(12)};
  display: flex;
  flex-direction: row;
`
const SportocoLogoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 9%;
`
const SportocoLogo = styled.img`
  height: ${props => responsiveDimension(3.2)};
  align-self: center;
`
const PlayAlongLogoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 9%;
`
const PlayAlongLogo = styled.img`
  height: ${props => responsiveDimension(6)};
  align-self: center;
`
const CountdownClockWrapper = styled.div`
  content: '';
  text-align: center;
`
const QuestionPanelWrapper = styled.div`
  padding-top: ${props => responsiveDimension(2.9)};
  text-align: center;
`
const SliderWrapper = styled.div`
  padding-top: ${props => responsiveDimension(3)};
`
const MessageContainer = styled.div`
  width: 100%;
  height: 525px;
  position: relative;
  overflow: hidden;
  display: flex;
`
const MessageWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
`
const PoinstTokensWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`
const HistoryContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  top: 70%;
`

const NextPlayType = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 14%;
  height: ${responsiveDimension(4.6)};
  border-radius: 0 ${responsiveDimension(4.6)} ${responsiveDimension(4.6)} 0;
  background-color: #146314;
  border-top: ${responsiveDimension(0.3)} solid #2fc12f;
  border-right: ${responsiveDimension(0.3)} solid #2fc12f;
  border-bottom: ${responsiveDimension(0.3)} solid #2fc12f;
  padding-right: ${responsiveDimension(0.1)};
  overflow: hidden;
  animation: ${props => bgbar} infinite 1s linear alternate,
    ${props => borderbar} infinite 0.5s ease alternate,
    ${props => barin} forwards 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`

const PlayIcon = styled.div`
  position: absolute;
  width: ${responsiveDimension(3.8)};
  height: ${responsiveDimension(3.8)};
  overflow: hidden;
  border-radius: 100%;
  background-color: #2fc12f;
  &:before {
    content: '';
    background-image: url(${props => props.bg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: 90% auto;
    animation: ${props => symbolpulse} infinite 0.5s ease alternate;
    position: absolute;
    width: inherit;
    height: inherit;
    transform-origin: center;
    transform: scale(1);
    left: 1px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
`

const LoginFirst = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-family: pamainbold;
  text-transform: uppercase;
`

const bgbar = keyframes`
  0% {}
  100% {background-color: #000000;}
`
const borderbar = keyframes`
  0% {}
  100% {border-color:#000000;}
`
const barin = keyframes`
  0% {}
  100% {left:0;}
`
const symbolpulse = keyframes`
  0% {transform:scale(1);}
  100% {transform:scale(0.7);}
`

const Refresh = ({ path = '/' }) => (
  <Route
    path={path}
    component={({ history, location, match }) => {
      history.replace({
        ...location,
        pathname: location.pathname.substring(match.path.length),
      })
      return null
    }}
  />
)

const ActivityIndicatorWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const MessageIndicator = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 100;
`

const TextWrapper = styled.div`
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const Text = styled.div`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 0.9};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
  height: ${props => vhToPx(props.size * 0.8)};
`

const Button = styled.div`
  width: ${props => responsiveDimension(37)};
  height: ${props => responsiveDimension(9)};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ''};
  padding: 0 2% 0 4%;
  &:before {
    content: 'proceed to live game';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3.4)};
    color: #ffffff;
    text-transform: uppercase;
    white-space: nowrap;
  }
  &:after {
    content: '';
    display: inline-block;
    width: 20%;
    height: 100%;
    display: inline-block;
    background-image: url(${props => evalImage(`icon-arrow.svg`)});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
`

const AuthWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
`
