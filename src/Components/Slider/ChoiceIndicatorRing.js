import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { TweenMax } from 'gsap'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import _ from 'lodash'

const StarColor = '#eede16'

export default class ChoiceIndicatorRing extends PureComponent {
  render() {
    let { teams, question, groupComponent, isShowStar } = this.props
    let team = teams.find(o => question.forTeam && o.id === question.forTeam.id)

    return (
      <Thumb>
        <CircleWrapper>
          {/*
          {team ? (
            <TeamCircle team={team} showStar={isShowStar} />
          ) : (
            <BlankCircle
              backgroundColor={question.ringColor}
              showStar={isShowStar}
            >
              {'PREPICK' === groupComponent.toUpperCase() ? (
                ''
              ) : (
                <ImageCircleWrapper backgroundColor={question.backgroundColor}>
                  <ImageCircle src={evalImage(question.ringImage)} />
                </ImageCircleWrapper>
              )}
            </BlankCircle>
          )}
*/}
          {question.isPresetTeamChoice ? (
            <BlankCircle
              backgroundColor={question.ringColor}
              showStar={isShowStar}
            >
              {'PREPICK' === groupComponent.toUpperCase() ? (
                ''
              ) : (
                <ImageCircleWrapper backgroundColor={question.backgroundColor}>
                  <ImageCircle src={evalImage(question.ringImage)} />
                </ImageCircleWrapper>
              )}
            </BlankCircle>
          ) : team ? (
            <TeamCircle team={team} showStar={isShowStar} />
          ) : (
            <BlankCircle
              backgroundColor={question.ringColor}
              showStar={isShowStar}
            >
              {'PREPICK' === groupComponent.toUpperCase() ? (
                ''
              ) : (
                <ImageCircleWrapper backgroundColor={question.backgroundColor}>
                  <ImageCircle src={evalImage(question.ringImage)} />
                </ImageCircleWrapper>
              )}
            </BlankCircle>
          )}
        </CircleWrapper>
        <RingWrapper
          showStar={isShowStar}
          backgroundColor={isShowStar ? StarColor : question.ringColor}
        >
          <Ring backgroundColor={isShowStar ? StarColor : question.ringColor} />
        </RingWrapper>
      </Thumb>
    )
  }
}

const TeamCircle = props => {
  return (
    <TContainer showStar={props.showStar}>
      <TWrapper>
        <TTop color={props.team.iconTopColor} />
        <TBottom color={props.team.iconBottomColor} />
      </TWrapper>
      <TAbbrevWrapper>
        <TAbbrev>
          {props.team && props.team.teamName
            ? props.team.teamName.charAt(0).toUpperCase()
            : null}
        </TAbbrev>
      </TAbbrevWrapper>
    </TContainer>
  )
}

const TContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  position: absolute;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: ${props => responsiveDimension(0.4)} solid
    ${props => (props.showStar ? StarColor : '#000000')};
  background-color: #000000;
  overflow: hidden;
`
const TWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  position: absolute;
  overflow: hidden;
`
const TTop = styled.div`
  width: 100%;
  height: 100%;
  border-top-left-radius: ${props => responsiveDimension(5.4)};
  border-top-right-radius: ${props => responsiveDimension(5.4)};
  background-color: ${props => props.color};
`

const TBottom = styled.div`
  width: 100%;
  height: 100%;
  border-bottom-left-radius: ${props => responsiveDimension(5.4)};
  border-bottom-right-radius: ${props => responsiveDimension(5.4)};
  background-color: ${props => props.color};
`

const TAbbrevWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`
const TAbbrev = styled.div`
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.7)};
  color: #ffffff;
`

const Thumb = styled.div`
  width: ${props => responsiveDimension(10)};
  height: ${props => responsiveDimension(10)};
  border-radius: ${props => responsiveDimension(10)};
  z-index: 1;
  position: relative;
  overflow: hidden;
`
const BlankCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: ${props =>
    props.showStar ? StarColor : props.backgroundColor || '#2fc12f'}
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`
const RingWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  overflow: hidden;

  &:before {
    content: '';
    display: block;
    left: 2.5%;
    width: 95%;
    height: ${props => responsiveDimension(3.1)};
    position: absolute;
    opacity: 0.5;
    bottom: ${props => (props.showStar ? 31 : 30)}%;
    background-color: ${props => props.backgroundColor || '#2fc12f'};
    transform: perspective(${props => responsiveDimension(50)}) rotateX(-75deg);
  }

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 50%;
    position: absolute;
    opacity: 0.3;
    bottom: 0;
    background-color: ${props => props.backgroundColor || '#2fc12f'};
    z-index: 0;
  }

  position: absolute;
`
const Ring = styled.div`
  width: 100%;
  height: 50%;
  position: absolute;
  border-radius: 0 0 100% 100%;
  top: 50%;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;

  &:before {
    content: '';
    width: ${props => responsiveDimension(3)};
    height: ${props => responsiveDimension(3)};
    border: ${props => responsiveDimension(0.3)} solid;
    border-color: ${props => props.backgroundColor || '#2fc12f'};
    position: absolute;
    border-radius: 100%;
    transform-origin: center;
    display: block;
    transform: scale(1);
    /*
    left: 34.5%;
    top: -30%;
*/
    left: 35%;
    top: -29%;
    animation: ${props => ringpulse} 1s infinite 1s linear;
  }
  &:after {
    content: '';
    width: ${props => responsiveDimension(3)};
    height: ${props => responsiveDimension(3)};
    border: ${props => responsiveDimension(0.3)} solid;
    border-color: ${props => props.backgroundColor || '#2fc12f'};
    position: absolute;
    border-radius: 100%;
    transform-origin: center;
    display: block;
    transform: scale(1);
    /*
    left: 34.5%;
    top: -30%;
*/
    left: 35%;
    top: -29%;
    animation: ${props => ringpulse} 2s infinite linear;
  }
`
const ringpulse = keyframes`
  0% {}100% {transform:scale(4);}
`
const CircleWrapper = styled.div`
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(5)};
  border-radius: ${props => responsiveDimension(5)};
  position: absolute;
  top: 25%;
  left: 25%;
  z-index: 1;
`
const ImageCircleWrapper = styled.div`
  width: 85%;
  height: 85%;
  border-radius: 85%;
  background-color: ${props => props.backgroundColor};
`
const ImageCircle = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 85%;
  background-position: center;
`
