import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import dateFormat from 'dateformat'
import { diffHours, vhToPx } from '@/utils'
import styled from 'styled-components'

@inject('LiveGameStore')
@observer
export default class CountdownClock extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      currentDate: this.getFormattedDate(),
      kickoffDate: diffHours(this.props.LiveGameStore.liveGameTime, new Date()),
      check: null,
    })
  }

  getFormattedDate() {
    return dateFormat(new Date(), 'dddd, mmmm dS yyyy').toUpperCase()
  }

  componentDidMount() {
    this.check = setInterval(() => {
      this.currentDate = this.getFormattedDate()
      this.kickoffDate = diffHours(
        this.props.LiveGameStore.liveGameTime,
        new Date()
      )
    }, 1000)
  }

  render() {
    return (
      <CountDownClock>
        <AcitveDate>{this.currentDate}</AcitveDate>
        <ActiveCountDown>
          <KickOff>KICK-OFF IN</KickOff> <span>{this.kickoffDate}</span>
        </ActiveCountDown>
      </CountDownClock>
    )
  }
}

const CountDownClock = styled.div`
  width: 100%;
  height: 100%;
`
const AcitveDate = styled.div`
  font-family: pamainlight;
  font-size: ${props => vhToPx(3)};
  color: #ffffff;
`
const ActiveCountDown = styled.div`
  font-family: pamainregular;
  font-size: ${props => vhToPx(3.8)};
  color: #ffffff;
  margin-top: ${props => vhToPx(-1.4)};
`
const KickOff = styled.span`
  font-family: pamainlight;
  color: #ff0000;
`
