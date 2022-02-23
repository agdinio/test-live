import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import dateFormat from 'dateformat'
import moment from 'moment-timezone'
import GameList from '@/Components/LiveGameSchedule/GameList'
import OwnLogin from '@/Components/Common/OwnLogin'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import { eventCapture } from '../Auth/GoogleAnalytics'
@inject('CommandHostStore', 'NavigationStore')
@observer
export default class LiveGameSchedule extends Component {
  constructor(props) {
    super(props)
    //    this.props.CommandHostStore.getSports()
  }

  handleSportItemClick(item) {
    this.refContent.style.pointerEvents = 'none'
    setTimeout(() => {
      if (this.refContent) {
        this.refContent.style.pointerEvents = 'auto'
      }
    }, 1000)

    setTimeout(() => {
      let comp = <GameList item={item} />
      this.props.NavigationStore.addSubScreen(
        comp,
        'FollowedGames-GameList',
        false,
        true
      )
    }, 500)

    eventCapture('select_sport', item) // GA details
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.props.CommandHostStore.getSportTypes()
    }
  }

  componentWillUnmount() {
    if (this.props.timeStop) {
      this.props.timeStop()
    }
    this.props.NavigationStore.setActiveMenu(null)
    this.props.NavigationStore.resetSubScreens()
  }

  componentDidMount() {
    //console.log( dateFormat(new Date(), 'mm/dd hh:MMTT').toUpperCase() )
    //console.log(new Date().toLocaleString([], {hours12: true}))

    //var offset = new Date().getTimezoneOffset();
    //console.log(offset / -60);

    //console.log(   this.calcTime('Cebu', offset)   )

    // var now = moment(new Date())
    // console.log( now.tz('America/Los_Angeles').format('MM/DD/YYYY HH:mm')   )

    //var now = moment(new Date('02/11/2020 13:45'))
    //console.log(  now.tz('Asia/Tokyo').format('MM/DD/YYYY HH:mm')  )

    // var arr1 = [{id: 1, name:'uno'}, {id: 2, name:'dos'}, {id: 3, name:'tres'}, {id: 4, name:'quatro'}, {id: 5, name:'singko'}]
    // var answered = [{id: 2, name:'dos'}, {id: 4, name:'quatro'}]
    //
    // const res = arr1.filter(base => {
    //   return answered.filter(item => {
    //     return base.id === item.id
    //   }).length === 0
    // })
    // console.log('XXXXXXXXXXX',res)

    /*
    this.props.NavigationStore.setActiveMenu(this.props.NavigationStore.location)

*/
    if (this.props.timeStart) {
      this.props.timeStart()
    }
    this.props.CommandHostStore.getSportTypes()
  }

  render() {
    let { CommandHostStore } = this.props

    // if (!CommandHostStore.isAuthenticated) {
    //   return (
    //     <Container>
    //       <OwnLogin handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
    //     </Container>
    //   )
    // }

    return (
      <Container>
        {/*{this.props.NavigationStore.subScreens.map(comp => {*/}
        {/*  return comp*/}
        {/*})}*/}

        <FadeIn>
          <Header>
            <Text font={'pamainbold'} size={4} color={'#ffffff'} uppercase>
              select your sport
            </Text>
          </Header>
          <ContentScrolling>
            <Content innerRef={ref => (this.refContent = ref)}>
              {CommandHostStore.sportTypes &&
              CommandHostStore.sportTypes.length > 0
                ? CommandHostStore.sportTypes.map((sport, idx) => {
                    return (
                      <SportItem
                        key={sport.name}
                        item={sport}
                        index={idx}
                        length={CommandHostStore.sportTypes.length}
                        onClick={this.handleSportItemClick.bind(this, sport)}
                        refBar={ref => (this[`refBar-${sport.name}`] = ref)}
                      />
                    )
                  })
                : null}
            </Content>
            {CommandHostStore.isLoading ? (
              <ActivityComponent size={4} backgroundColor={'transparent'} />
            ) : null}
          </ContentScrolling>
          <Bottom>
            <TextWrapper lineHeight={2}>
              <Text font={'pamainregular'} size={3.5} color={'#fff'} uppercase>
                the more&nbsp;
              </Text>
              <Text
                font={'pamainregular'}
                size={3.5}
                color={'#0fbc1c'}
                uppercase
              >
                picks&nbsp;
              </Text>
              <Text font={'pamainregular'} size={3.5} color={'#fff'} uppercase>
                you make
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainregular'} size={3.5} color={'#fff'} uppercase>
                the more&nbsp;
              </Text>
              <Text
                font={'pamainregular'}
                size={3.5}
                color={'#18c5ff'}
                uppercase
              >
                points&nbsp;
              </Text>
              <Text font={'pamainregular'} size={3.5} color={'#fff'} uppercase>
                you earn
              </Text>
            </TextWrapper>
            <TextWrapper marginTop={3} lineHeight={2}>
              <Text font={'pamainregular'} size={3.5} color={'#fff'} uppercase>
                more points
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainlight'} size={5.6} color={'#fff'} uppercase>
                the bigger the prize
              </Text>
            </TextWrapper>
          </Bottom>
        </FadeIn>
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

const FadeIn = styled.div`
  with: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Header = styled.div`
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 62%;
  display: flex;
  //margin-top: ${props => props.marginTop || '12%'};
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.3vh rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar {
    width: ${props => vhToPx(0.1)};
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ff0000;
  }
`

const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Bottom = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const TextWrapper = styled.div`
  text-align: center;
  line-height: ${props => props.lineHeight || 1};
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => vhToPx(0.1)};
`

/**
 * SportItem element
 * @param props
 * @constructor
 */

const SIHeight = 8.3
const SIBarHeight = 7.8

const SIContainer = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(SIHeight)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 4%;
`

const SIBar = styled.div`
  width: 60%;
  height: ${props => responsiveDimension(SIBarHeight)};
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  border-top-right-radius: ${props => responsiveDimension(SIBarHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(SIBarHeight)};
  transition: 0.3s ease;
  cursor: pointer;
  &:hover {
    width: 75%;
    background-color: #18c5ff;
    border: ${props => responsiveDimension(0.2)} solid;
    border-top-color: #ffffff;
    border-bottom-color: #ffffff;
    border-right-color: #ffffff;
    border-left-color: transparent;
    ${props => SIIcon} {
      background-color: #ffffff;
      border: ${props => responsiveDimension(0.2)} solid #ffffff;
      margin-right: -1%;
    }
    ${props => SIIcon}:after {
      // background-image: url(${props => props.srcHover});
      background-color: #18c5ff;
    }
    + ${props => SILine}:after {
      background-color: #18c5ff;
      width: ${props => responsiveDimension(2.7)};
      height: ${props => responsiveDimension(2.7)};
      min-width: ${props => responsiveDimension(2.7)};
      min-height: ${props => responsiveDimension(2.7)};
      border-radius: 50%;
    }
  }
`

const SILabel = styled.div`
  width: 100%;
  height: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(SIBarHeight * 0.4)};
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: ${props => vhToPx(0.1)};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 15%;
`

const SIIcon = styled.div`
  width: ${props => responsiveDimension(SIBarHeight)};
  height: ${props => responsiveDimension(SIBarHeight)};
  min-width: ${props => responsiveDimension(SIBarHeight)};
  min-height: ${props => responsiveDimension(SIBarHeight)};
  border-radius: 50%;
  background-color: #18c5ff;
  border: ${props => responsiveDimension(0.2)} solid #000000;
/*
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: center;
  }
*/
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    -webkit-mask-image: url(${props => props.src});
    -webkit-mask-size: ${props => props.sizeInPct || 60}%;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url(${props => props.src});
    mask-size: ${props => props.sizeInPct || 60}%;
    mask-repeat: no-repeat;
    mask-position: center;
  }
`

const SILine = styled.div`
  width: ${props => responsiveDimension(0.4)};
  height: 100%;
  position: relative;
  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    width: ${props => responsiveDimension(0.4)};
    height: ${props => props.height};
    background-color: #fff;
    ${props => (props.pos === 'bottom' ? 'bottom: 0;' : 'top: 0;')};
  }
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    width: ${props => responsiveDimension(1.4)};
    height: ${props => responsiveDimension(1.4)};
    min-width: ${props => responsiveDimension(1.4)};
    min-height: ${props => responsiveDimension(1.4)};
    border-radius: 50%;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.3s ease;
  }
`

const SportItem = props => {
  const fullLine =
    props.index > 0 && props.index < props.length - 1 ? true : false
  const pos = props.index < props.length - 1 ? 'bottom' : 'top'

  let _sizeInPct = 60
  switch (props.item.name) {
    case 'nascar':
      _sizeInPct = 90
      break
    case 'x-games':
      _sizeInPct = 50
      break
    default:
      _sizeInPct = 60
      break
  }

  return (
    <SIContainer>
      <SIBar
        srcHover={evalImage(`livegameschedule/${props.item.iconHover}`)}
        innerRef={props.refBar}
        onClick={props.onClick}
      >
        <SILabel>{props.item.name}</SILabel>
        <SIIcon
          src={evalImage(`livegameschedule/${props.item.icon}`)}
          sizeInPct={_sizeInPct}
        />
      </SIBar>
      <SILine height={fullLine ? '100%' : '50%'} pos={pos} />
    </SIContainer>
  )
}
