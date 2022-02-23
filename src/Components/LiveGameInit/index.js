import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import AuthSequence from '@/Components/Auth'
import dateFormat from 'dateformat'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import { eventCapture } from '../Auth/GoogleAnalytics'

@inject('ProfileStore', 'CommandHostStore', 'NavigationStore')
@observer
export default class LiveGameInit extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      activityIndicator: null,
    })

    this.params = {
      stage: '',
      gameId: '',
      isLeap: false,
    }
  }

  async handleIsLoggedIn(goto, next) {
    if (next) {
      this.toggleLoadingIndicator(1)

      if (
        this.props.ProfileStore.profile &&
        this.props.ProfileStore.profile.userId
      ) {
        this.props.NavigationStore.queryString.userId = await this.props
          .ProfileStore.profile.userId
        this.gotoPrePicks(this.props.NavigationStore.queryString)
      }
    }
  }

  handleMessageClose() {
    const params = this.props.NavigationStore.queryString
    if (params.isPrePickCompleted) {
      if (params.userId) {
        this.activityIndicator = null
        this.props.CommandHostStore.setGameSubscriptionParams(params)
        this.props.NavigationStore.setCurrentView('/livegame')
      } else {
        this.activityIndicator = (
          <AuthWrapper>
            <AuthSequence
              mainHandleLoggedIn={this.handleIsLoggedIn.bind(
                this,
                params,
                'livegame'
              )}
            />
          </AuthWrapper>
        )
      }
    } else {
      this.activityIndicator = null
    }
    // eventCapture('proceed_to_live_play', params) // GA details
  }

  toggleLoadingIndicator(mode) {
    if (mode === 1) {
      if (this.refLoading) {
        this.refLoading.style.zIndex = 100
        ReactDOM.render(<ActivityComponent size={4} />, this.refLoading)
      }
    } else {
      if (this.refLoading) {
        this.refLoading.style.zIndex = -100
        ReactDOM.unmountComponentAtNode(this.refLoading)
      }
    }
  }

  gotoPrePicks(params) {
    this.props.CommandHostStore.getUserPrePicks({
      gameId: params.gameId,
      userId: params.userId,
      anonymousUserId: params.anonymousUserId,
    })
      .then(async response => {
        if (response.isCompleted) {
          params.isPrePickCompleted = true
          if (params.userId && response.userLivePlayCount > 0) {
            //bypass prepicks message when the user has started playing.
            this.gotoLiveGame(params)
          } else {
            this.activityIndicator = (
              <MessageIndicator>
                <TextWrapper key={'pp-completed-1'} marginBottom={3}>
                  <Text
                    font={'pamainlight'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    {response.isAvailableForThisGame
                      ? 'you have completed all pre-picks.'
                      : 'no available pre-pick for this game.'}
                  </Text>
                </TextWrapper>
                <TextWrapper key={'pp-completed-2'} marginBottom={1}>
                  <Text
                    font={'pamainlight'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    live game session will start on
                  </Text>
                </TextWrapper>
                <TextWrapper key={'pp-completed-3'} marginBottom={4}>
                  <Text
                    font={'pamainregular'}
                    size={3.5}
                    color={'#ffffff'}
                    uppercase
                  >
                    {dateFormat(
                      response.dateStart,
                      'dddd, mmmm dS yyyy'
                    ).toUpperCase()}
                  </Text>
                </TextWrapper>
                <Button
                  key={'pp-completed-4'}
                  borderColor={'#ffffff'}
                  text="proceed to live game"
                  onClick={this.handleMessageClose.bind(this)}
                />
              </MessageIndicator>
            )
          }
        } else {
          await this.props.CommandHostStore.setGameSubscriptionParams(params)
          await this.props.NavigationStore.setFreeRoute('/prepick')
          this.props.NavigationStore.setCurrentView('/prepick')
        }
      })
      .finally(_ => {
        this.toggleLoadingIndicator(0)
      })
  }

  componentDidMount() {
    if (
      this.props.NavigationStore.queryString &&
      this.props.NavigationStore.queryString.userId
    ) {
      this.params.userId = this.props.ProfileStore.profile.userId
      this.gotoPrePicks(this.params)
    } else {
      this.activityIndicator = (
        <AuthWrapper>
          <AuthSequence
            mainHandleLoggedIn={this.handleIsLoggedIn.bind(this, 'prepick')}
          />
        </AuthWrapper>
      )
    }
  }

  render() {
    return (
      <Container>
        {this.activityIndicator}
        <Loading innerRef={ref => (this.refLoading = ref)} />
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`

const AuthWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
`

const MessageIndicator = styled.div`
  position: absolute;
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
  width: auto;
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
  ${props => (props.noarrow ? `padding: 0 10% 0 10%;` : `padding: 0 2% 0 4%;`)};
  &:before {
    content: '${props => props.text || `close`}';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(3.4)};
    color: #ffffff;
    text-transform: uppercase;
    white-space: nowrap;
  }
  &:after {
    content: '';
    display: inline-block;
    width: ${props => (props.noarrow ? 0 : responsiveDimension(5))};
    height: 100%;
    display: inline-block;
    background-image: url(${props =>
      props.noarrow ? null : evalImage(`icon-arrow.svg`)});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
`
