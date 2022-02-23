import React, { Component } from 'react'
import styled from 'styled-components'
import ArrowIcon from '@/assets/images/icon-arrow.svg'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'

export default class Simple extends Component {
  render() {
    let { menu, refOnClick } = this.props

    const isStar = 'sr' === menu.boardTypeId.toLowerCase()

    return (
      <Container
        primary={menu.primaryBackgroundColor}
        onClick={refOnClick}
        id={`prizeboard-${menu.prizeBoardId}`}
      >
        <Board secondary={menu.secondaryBackgroundColor}>
          <BoardDesc>
            <TextWrapper>
              <Text font={'pamainextrabold'} size={4.5} uppercase>
                {menu.boardName}
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text
                font={'pamainregular'}
                size={2.5}
                letterSpacing={0.1}
                color={'#212121'}
                uppercase
              >
                {menu.subTitle}
              </Text>
            </TextWrapper>
          </BoardDesc>
          <BoardDescImage
            src={evalImage(`prizeboard/${menu.boardTypeId}-${menu.boardImage}`)}
          >
            <BoardDescImageMiddleIcon
              src={
                (menu.sponsor || '').match(new RegExp('kcchiefs', 'gi'))
                  ? evalImage('prizeboard/teams-logos-kansas_city_chiefs.svg')
                  : null
              }
            />
          </BoardDescImage>
        </Board>
        <BoardCircle>
          <Circle
            color={isStar ? '#eede17' : '#ffffff'}
            src={isStar ? StarIcon : ArrowIcon}
            srcSize={isStar ? 70 : 36}
            marginLeft={isStar ? 0 : 0.5}
          />
        </BoardCircle>
      </Container>
    )
  }
}

const h = 10.5
const Container = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(h)};
  background-color: ${props => props.primary || '#212121'};
  margin-top: ${props => responsiveDimension(0.2)};
  display: flex;
  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`

const Board = styled.div`
  width: 90%;
  height: inherit;
  border-top-right-radius: ${props => responsiveDimension(h)};
  border-bottom-right-radius: ${props => responsiveDimension(h)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.secondary || '#ffffff'};
  position: absolute;
`

const BoardDesc = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 6%;
`

const BoardDescImage = styled.div`
  width: ${props => responsiveDimension(h)};
  height: ${props => responsiveDimension(h)};
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(h)};
    height: ${props => responsiveDimension(h)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
`

const BoardDescImageMiddleIcon = styled.img`
  position: absolute;
  height: 40%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const BoardCircle = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: inherit;
  margin-left: 86%;
`
const Circle = styled.div`
  width: ${props => responsiveDimension(0.6 * h)};
  height: ${props => responsiveDimension(0.6 * h)};
  border-radius: 50%;
  border: ${props => responsiveDimension(0.5)} solid ${props => props.color};
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: '';
    width: inherit;
    height: inherit;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: ${props => props.srcSize || 90}%;
    background-position: center;
    margin-left: ${props => responsiveDimension(props.marginLeft) || 0};
  }
`

const TextWrapper = styled.div`
  line-height: 1;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.letterSpacing
      ? `letter-spacing:${responsiveDimension(props.letterSpacing)}`
      : ``};
`
