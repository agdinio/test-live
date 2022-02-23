import React, { Component } from 'react'
import styled from 'styled-components'
import TokenIcon from '@/assets/images/playalong-token.svg'
import { vhToPx, numberFormat, responsiveDimension } from '@/utils'

export default class TokensIncluded extends Component {
  render() {
    let { menu, refOnClick } = this.props
    return (
      <Container
        primary={menu.primaryBackgroundColor}
        onClick={refOnClick}
        id={`prizeboard-${menu.prizeBoardId}`}
      >
        <Board secondary={menu.secondaryBackgroundColor}>
          <BoardDesc>
            <TextWrapper>
              <Text
                font={'pamainextrabold'}
                size={4.5}
                color={'#ffffff'}
                uppercase
              >
                {menu.boardName}
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text
                font={'pamainregular'}
                size={2.5}
                letterSpacing={0.1}
                color={'#ffffff'}
                uppercase
              >
                {menu.subTitle}
              </Text>
            </TextWrapper>
          </BoardDesc>
          <BoardCircle>
            <Circle color={menu.primaryBackgroundColor}>
              {numberFormat(menu.purchaseUpgrade, 0, '$')}
            </Circle>
          </BoardCircle>
        </Board>
        <TokenNumberWrapper>
          <Text font={'pamainregular'} size={3} color={'#ffffff'}>
            {numberFormat(menu.tokensUpgrade, 0, '')}
            &nbsp;
          </Text>
          <TokenWrapper>
            <Token src={TokenIcon} size={2.9} index={3} />
            <Faded index={2} size={2.9} color={'#6d6c71'} left={-2.6} />
            <Faded index={1} size={2.9} color={'#33342f'} left={-2.6} />
          </TokenWrapper>
        </TokenNumberWrapper>
      </Container>
    )
  }
}

const h = 14
const Container = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(h)};
  background-color: ${props => props.primary || '#fff'};
  margin-top: ${props => responsiveDimension(0.2)};
  display: flex;
  justify-content: space-between;
  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`

const Board = styled.div`
  width: 73%;
  height: inherit;
  border-top-right-radius: ${props => responsiveDimension(h)};
  border-bottom-right-radius: ${props => responsiveDimension(h)};
  display: flex;
  //flex-direction: row;
  justify-content: space-between;
  background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(59, 59, 60, 1));
`

const BoardDesc = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 6%;
`

const TextWrapper = styled.div`
  line-height: 1.1;
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

const BoardCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => responsiveDimension(-3)};
`

const Circle = styled.div`
  width: ${props => responsiveDimension(0.6 * h)};
  height: ${props => responsiveDimension(0.6 * h)};
  border-radius: 50%;
  border: ${props => responsiveDimension(0.6)} solid ${props => props.color};
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(0.3 * h)};
  color: ${props => props.color || '#fff'};
  padding-top: ${props => responsiveDimension(0.5)};
`

const TokenNumberWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 3%;
`

const TokenWrapper = styled.div`
  height: 100%;
  margin-right: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.4)};
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Token = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props =>
    props.adjustWidth
      ? responsiveDimension(props.size + 0.1)
      : responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  z-index: ${props => props.index};
`

const Faded = styled.div`
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left)};
  z-index: ${props => props.index};
`
