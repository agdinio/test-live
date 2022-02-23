import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import Loadable from 'react-loadable'
import ActivityLoader from '@/Components/Common/ActivityLoader'
import { eventCapture } from '../Auth/GoogleAnalytics'
const friends = [
  {
    id: 1,
    name: 'u name',
    email: 'e-mail@offriend.com',
    joined: true,
    shared: false,
    win: 3,
    loss: 1,
  },
  {
    id: 2,
    name: 'u name',
    email: 'e-mail@offriend.com',
    joined: true,
    shared: false,
    win: 1,
    loss: 10,
  },
  {
    id: 3,
    name: 'name',
    email: 'e-mail@offriend.com',
    joined: false,
    shared: false,
    win: 0,
    loss: 0,
  },
  {
    id: 4,
    name: 'name',
    email: 'e-mail@offriend.com',
    joined: false,
    shared: true,
    win: 0,
    loss: 0,
  },
  {
    id: 5,
    name: 'u name',
    email: 'e-mail@offriend.com',
    joined: true,
    shared: false,
    win: 20,
    loss: 17,
  },
  {
    id: 6,
    name: 'u name',
    email: 'e-mail@offriend.com',
    joined: true,
    shared: false,
    win: 13,
    loss: 17,
  },
]

@inject('NavigationStore', 'AnalyticsStore')
@observer
export default class ShareStatus extends Component {
  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handleCancel(key) {
    this.props.NavigationStore.removeSubScreen(key)
  }

  handleShareKey() {
    let Comp = Loadable({
      loader: () => import('@/Components/ShareThrough'),
      loading: ActivityLoader,
    })

    const _analyticsPageName = 'ShareStatus-ShareThrough'
    this.props.NavigationStore.addSubScreen(
      <Comp
        cancel={this.handleCancel.bind(this, 'ShareThrough')}
        analyticsPageName={_analyticsPageName}
        //timeStart={this.handleTimeStart.bind(this, _analyticsPageName)}
        //timeStop={this.handleTimeStop.bind(this, _analyticsPageName)}
      />,
      'ShareThrough'
    )
    eventCapture('share_your_key', _analyticsPageName)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({
      page: 'ShareStatus',
      isMainPage: true,
    })
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({
      page: 'ShareStatus',
      isMainPage: true,
    })
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'ShareStatus',
      isMainPage: true,
      isUnload: true,
    })
  }

  render() {
    return (
      <Container>
        {!this.props.isSubScreen
          ? this.props.NavigationStore.subScreens.map(comp => comp)
          : null}
        <Section height={9} alignItems={'center'}>
          <FriendsCounterWrap>
            <FriendsCounter>
              <FriendsCounterValue>100</FriendsCounterValue>
              <FriendsCounterIcon />
            </FriendsCounter>
            <FriendsCounterOrdering />
          </FriendsCounterWrap>
        </Section>
        <Section
          height={5}
          justifyContent="space-between"
          alignItems="center"
          paddingLeftInPct="6"
          paddingRightInPct="6"
        >
          <Cell width="60" alignItems="center" justifyContent="flex-start">
            <Text font="pamainregular" size="2.2" color="#ffffff">
              USER
            </Text>
          </Cell>
          <Cell width="18" alignItems="center" justifyContent="flex-start">
            <Text font="pamainregular" size="2.2" color="#ffffff">
              JOINED
            </Text>
          </Cell>
          <Cell width="22" alignItems="center" justifyContent="flex-end">
            <Text font="pamainregular" size="2.2" color="#ffffff">
              WIN/LOSS
            </Text>
          </Cell>
        </Section>
        <Section height={51}>
          <Scrolling>
            <Content>
              {friends.map(friend => {
                return <FriendItem key={friend.id} item={friend} />
              })}
            </Content>
          </Scrolling>
        </Section>
        <Section
          height={28.5}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: '#231f20' }}
        >
          <Button
            borderColor={'#19d1be'}
            onClick={this.handleShareKey.bind(this)}
          >
            <ButtonTextWrap>
              <Text font="pamainregular" size="3.6" color="#ffffff" uppercase>
                share your&nbsp;
              </Text>
              <Text font="pamainextrabold" size="3.6" color="#19d1be" uppercase>
                key
              </Text>
            </ButtonTextWrap>
            <ButtonArrow src={evalImage(`icon-arrow.svg`)} />
          </Button>
          <ColumnSpacer />
          <Button backgroundColor={'#0b7ecc'} borderColor={'#0b7ecc'}>
            <ButtonTextWrap>
              <Text font="pamainregular" size="3.6" color="#ffffff" uppercase>
                search&nbsp;
              </Text>
              <Text font="pamainextrabold" size="3.6" color="#ffffff" uppercase>
                friends
              </Text>
            </ButtonTextWrap>
            <ButtonArrow src={evalImage(`icon-arrow.svg`)} />
          </Button>
        </Section>
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

const Section = styled.div`
  width: 100%;
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
  ${props =>
    props.paddingLeftInPct ? `padding-left:${props.paddingLeftInPct}%` : ``};
  ${props =>
    props.paddingRightInPct ? `padding-right:${props.paddingRightInPct}%` : ``};
`

const InnerSection = styled.div`
  text-align: center;
  display: flex;
  ${props => (props.widthInPct ? `width:${props.widthInPct}%` : ``)};
  ${props => (props.height ? `height:${vhToPx(props.height)}` : ``)};
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`

const FriendsCounterWrap = styled.div`
  width: 36%;
  height: ${props => vhToPx(4.5)};
  background-color: #0b7ecc;
  display: flex;
  justify-content: space-between;
`

const FriendsCounter = styled.div`
  width: 100%;
  height: ${props => vhToPx(4.5)};
  border-top-right-radius: ${props => vhToPx(4.5)};
  border-bottom-right-radius: ${props => vhToPx(4.5)};
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`

const FriendsCounterValue = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(4.5)};
  color: #0b7ecc;
  line-height: 1;
  height: ${props => responsiveDimension(4.5 * 0.9)};
`

const FriendsCounterIcon = styled.div`
  width: ${props => vhToPx(4)};
  height: ${props => vhToPx(4)};
  min-width: ${props => vhToPx(4)};
  min-height: ${props => vhToPx(4)};
  border-radius: 50%;
  background-color: #0b7ecc;
  margin-right: 1%;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    -webkit-mask-image: url(${evalImage(`menu-social-icon.svg`)});
    -webkit-mask-size: 75%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${evalImage(`menu-social-icon.svg`)});
    mask-size: 75%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const FriendsCounterOrdering = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: 'A - Z';
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(4.5 * 0.9)};
    color: #ffffff;
    line-height: 0.9;
    height: ${props => responsiveDimension(4.5 * 0.9 * 0.8)};
  }
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: 0.9;
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
`

const Cell = styled.div`
  width: ${props => props.width || 100}%;
  height: 100%;
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
`

const Scrolling = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Button = styled.div`
  width: ${props => responsiveDimension(35)};
  height: ${props => responsiveDimension(9)};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: space-between;
  // justify-content: center;
  //align-items: center;
  cursor: pointer;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ''};
`

const ButtonTextWrap = styled.div`
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonArrow = styled.div`
  width: 15%;
  height: 100%;
  &:after {
    content: '';
    width: 100%
    height: 100%
    display: inline-block;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
  }
  padding-right: 5%;
`

const ColumnSpacer = styled.div`
  width: 100%;
  height: ${props => vhToPx(3)};
`

const FriendItemContainer = styled.div`
  width: 100%;
  height: ${props => vhToPx(8.5)};
  border-bottom: ${props => vhToPx(0.15)} solid ${props => props.borderColor};
  padding-left: 6%;
  padding-right: 6%;
  display: flex;
  justify-content: space-between;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ``};
`

const FriendItemName = styled.span`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(8.5 * 0.37)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
`

const FriendItemEmail = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(8.5 * 0.24)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
`

const FriendScore = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 0.9;
  height: ${props => responsiveDimension(props.size * 0.8)};
`

const GeneralIcon = styled.div`
  width: ${props => responsiveDimension(props.width)};
  height: ${props => responsiveDimension(props.height)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  ${props => (props.marginLeft ? `margin-left:${props.marginLeft}%` : ``)};
`

const EmailIcon = styled.div`
  width: ${props => responsiveDimension(props.width)};
  height: ${props => responsiveDimension(props.height)};
  background-color: #000000;
  -webkit-mask-image: url(${evalImage(`playalongnow-icon-email.svg`)});
  -webkit-mask-size: 75%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: url(${evalImage(`playalongnow-icon-email.svg`)});
  mask-size: 100%;
  mask-repeat: no-repeat;
  mask-position: center;
  ${props => (props.marginLeft ? `margin-left:${props.marginLeft}%` : ``)};
`

const FriendItem = props => {
  const { item } = props

  return (
    <FriendItemContainer
      backgroundColor={item.joined ? '' : item.shared ? '#ffffff' : '#efdf17'}
      borderColor={item.joined ? 'rgba(255,255,255, 0.5)' : '#000000'}
    >
      <Cell width="60" direction="column" justifyContent="center">
        <FriendItemName color={item.joined ? '#ffffff' : '#000000'}>
          {item.name || ''}
        </FriendItemName>
        <FriendItemEmail color={item.joined ? '#ffffff' : '#000000'}>
          {item.email || ''}
        </FriendItemEmail>
      </Cell>
      <Cell
        width="18"
        direction="row"
        justifyContent="left-start"
        alignItems="center"
      >
        {item.joined ? (
          <GeneralIcon src={evalImage(`icon-check.svg`)} width="5" height="5" />
        ) : (
          <EmailIcon width="4.5" height="4.5" marginLeft="0.4" />
        )}
        {!item.joined && item.shared ? (
          <GeneralIcon
            src={evalImage(`friends-icon-arrow-right.svg`)}
            width="3.4"
            height="3.4"
            marginLeft="10"
          />
        ) : !item.joined && !item.shared ? (
          <GeneralIcon
            src={evalImage(`friends-icon-circle-questionmark.svg`)}
            width="3.4"
            height="3.4"
            marginLeft="10"
          />
        ) : null}
      </Cell>
      <Cell
        width="22"
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <FriendScore
          font={item.win > item.loss ? 'pamainbold' : 'pamainlight'}
          size="5"
          color="#ffffff"
        >
          {item.joined ? item.win : null}
        </FriendScore>
        <FriendScore font="pamainlight" size="5" color="#ffffff">
          {item.joined ? '/' : null}
        </FriendScore>
        <FriendScore
          font={item.loss > item.win ? 'pamainbold' : 'pamainlight'}
          size="5"
          color="#ffffff"
        >
          {item.joined ? item.loss : null}
        </FriendScore>
      </Cell>
    </FriendItemContainer>
  )
}
