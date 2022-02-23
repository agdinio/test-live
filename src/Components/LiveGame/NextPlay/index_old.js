import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import { PlayInProgressContainer, FadeIn } from './style'
import TeamIcon from '@/Components/LiveGame/StatusPanel/StatusPanel'

@inject('ProfileStore', 'UserStore', 'LiveGameStore')
@observer
export default class NextPlay extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      playSummary: '1ST & 10',
      possession: {
        id: 1,
        teamName: 'Bengals',
        iconTopColor: '#f24c20',
        iconBottomColor: '#000000',
        score: 0,
      },
    })
  }

  render() {
    return (
      <PlayInProgressContainer color={'transparent'}>
        <FadeIn center>
          <span
            style={{
              color: '#c61818',
              fontFamily: 'pamainextrabold',
              fontSize: '4em',
              lineHeight: 1,
            }}
          >
            NEXT PLAY
          </span>
          <span
            style={{
              color: 'white',
              fontFamily: "'pamainregular', sans-serif",
              fontSize: '2.3em',
              lineHeight: 1,
            }}
          >
            {this.playSummary}
          </span>
          <span
            style={{
              transform: 'scale(2.6)',
              fontSize: 13,
              marginTop: 25,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TeamIcon teamInfo={this.possession} />
            <span
              style={{
                color: 'white',
                marginLeft: 8,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '1.3em',
              }}
            >
              {this.possession.teamName} possession
            </span>
          </span>
        </FadeIn>
      </PlayInProgressContainer>
    )
  }
}
