import React, { Component } from 'react'
import styled from 'styled-components'
import { inject } from 'mobx-react'
import { responsiveDimension, evalImage } from '@/utils'

@inject('GameStore')
export default class LivePlayResolve extends Component {
  render() {
    let { GameStore } = this.props
    let totalStarsEarned = 0

    return (
      <Container>
        {GameStore.PlayTypes.map(playType => {
          let totalPlays = 0
          let totalCorrectAnswers = 0
          if (
            GameStore.gameHistory &&
            GameStore.gameHistory.livePlays &&
            Array.isArray(
              JSON.parse(JSON.stringify(GameStore.gameHistory.livePlays))
            )
          ) {
            const resolved = GameStore.gameHistory.livePlays.filter(
              o => o.type.toLowerCase() === playType.type.toLowerCase()
            )[0]
            if (resolved) {
              totalCorrectAnswers = resolved.total_correct_answers
              totalPlays = resolved.total_plays
              totalStarsEarned += resolved.total_stars_earned
            }
          }

          return (
            <PlayContainer key={`playbar-${playType.type}`}>
              <PlayBar backgroundColor={playType.backgroundColor}>
                <PlayText text={playType.text} color={playType.color} />
                <PlayIcon
                  src={evalImage(playType.icon)}
                  borderColor={playType.backgroundColor}
                  iconBG={playType.iconBG}
                />
              </PlayBar>
              {'stars'.match(new RegExp(playType.type, 'gi')) ? (
                <PlayStats>
                  <StarIcon text={totalStarsEarned} color={playType.color} />
                </PlayStats>
              ) : (
                <PlayStats>
                  <Text
                    font="pamainbold"
                    size="4.6"
                    color={
                      totalPlays < 1
                        ? 'rgba(255,255,255,0.5)'
                        : totalCorrectAnswers < totalPlays
                        ? 'rgba(255,255,255,0.5)'
                        : playType.backgroundColor
                    }
                  >
                    {totalCorrectAnswers}
                  </Text>
                  <Text
                    font="pamainlight"
                    size="4.6"
                    color={
                      totalPlays > 0 && totalCorrectAnswers === totalPlays
                        ? playType.backgroundColor
                        : '#ffffff'
                    }
                    style={{
                      marginLeft: '10%',
                      marginRight: '5%',
                      marginTop: responsiveDimension(0.2),
                    }}
                  >
                    /
                  </Text>
                  <Text
                    font="pamainbold"
                    size="4.6"
                    color={
                      totalPlays < 1
                        ? 'rgba(255,255,255,0.5)'
                        : totalCorrectAnswers < totalPlays
                        ? '#ffffff'
                        : playType.backgroundColor
                    }
                  >
                    {totalPlays}
                  </Text>
                </PlayStats>
              )}
            </PlayContainer>
          )
        })}
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
`

const barHeight = 6.7
const PlayContainer = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(barHeight)};
  margin: ${props => responsiveDimension(0.2)} 0
    ${props => responsiveDimension(0.2)} 0;

  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => responsiveDimension(0.5)};
`

const PlayBar = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(barHeight)};
  border-top-right-radius: ${props => responsiveDimension(barHeight)};
  border-bottom-right-radius: ${props => responsiveDimension(barHeight)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  align-items: center;
  position: relative;
`

const PlayText = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(barHeight)};
  display: flex;
  align-items: center;
  margin-left: 10%;
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(barHeight * 0.4)};
    color: ${props => props.color};
    height: ${props => responsiveDimension(barHeight * 0.4 * 0.8)};
    line-height: 0.9;
    text-transform: uppercase;
  }
`

const PlayIcon = styled.div`
  width: ${props => responsiveDimension(barHeight)};
  height: ${props => responsiveDimension(barHeight)};
  min-width: ${props => responsiveDimension(barHeight)};
  min-height: ${props => responsiveDimension(barHeight)};
  border-radius: 50%;
  border: ${props =>
    `${responsiveDimension(barHeight * 0.08)} solid ${props.borderColor}`};
  background-color: ${props => props.iconBG || '#ffffff'};
  &:after {
    content: '';
    width: 100%;
    height: 100%;
    display: inline-block;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
  }
`

const StarIcon = styled.div`
  width: ${props => responsiveDimension(barHeight)};
  height: ${props => responsiveDimension(barHeight)};
  min-width: ${props => responsiveDimension(barHeight)};
  min-height: ${props => responsiveDimension(barHeight)};
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: inline-block;
    background-image: url(${props => evalImage(`star-icon-gold.svg`)});
    background-repeat: no-repeat;
    background-size: 95%;
    background-position: center;
  }
  &:after {
    position: absolute;
    content:'${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(4.4)};
    color: ${props => props.color};
    margin-top: 1%;
  }
`

const PlayStats = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5%;
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
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
  height: ${props => responsiveDimension(props.size * 0.8)};
`
