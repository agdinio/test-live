import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import dateFormat from 'dateformat'
import { vhToPx, diffHours, responsiveDimension } from '@/utils'

@inject('LiveGameStore', 'NavigationStore')
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

      if (new Date() > this.props.LiveGameStore.liveGameTime) {
        clearInterval(this.check)
        setTimeout(() => {
          //this.props.NavigationStore.setCurrentView('/livegame')
        }, 1000)
      }
    }, 1000)
  }

  render() {
    return (
      <Container>
        <ActiveDate>{this.currentDate}</ActiveDate>
        <ActiveCountdown>
          <Kickoff>KICK-OFF IN</Kickoff> <span>{this.kickoffDate}</span>
        </ActiveCountdown>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`
const ActiveDate = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(3)};
  color: #ffffff;
`
const ActiveCountdown = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.8)};
  color: #ffffff;
  margin-top: ${props => vhToPx(-1.4)};
`
const Kickoff = styled.span`
  color: #c61818;
`
