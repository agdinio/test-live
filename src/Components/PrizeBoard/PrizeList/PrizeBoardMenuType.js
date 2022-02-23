import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as util from '@/utils'
import { numberFormat, responsiveDimension } from '@/utils'
import icon_token from '@/assets/images/playalong-token.svg'

export default class PrizeBoardMenuType extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { item, prizeBoardMenuTypeOnClick } = this.props
    let Tag = item.points > 0 ? ItemPrize : ItemFree

    return (
      <Tag item={item} prizeBoardMenuTypeOnClick={prizeBoardMenuTypeOnClick} />
    )
  }
}

const ItemPrize = props => {
  return (
    <PrizeContainer
      backgroundColor={props.item.colorContainer}
      onClick={props.prizeBoardMenuTypeOnClick.bind(this, props.item)}
    >
      <ItemPrizeInnerCenter>
        <ItemPrizeInnerCenterAmt
          color={props.item.colorContainer}
          backgroundColor={props.item.colorSubContainer}
        >
          {numberFormat(props.item.amount, 0, '$')}
        </ItemPrizeInnerCenterAmt>
      </ItemPrizeInnerCenter>

      <PrizeInnerLeft backgroundColor={props.item.colorSubContainer}>
        <CommonItemInnerLeft>
          <CommonItemName color={props.item.colorName}>
            {props.item.name.toUpperCase()}
          </CommonItemName>
          <CommonItemDesc color={props.item.colorName}>
            {props.item.desc.toUpperCase()}
          </CommonItemDesc>
        </CommonItemInnerLeft>
      </PrizeInnerLeft>

      <ItemPrizeInnerRight>
        <ItemPrizePoints color={props.item.colorPoints}>
          {numberFormat(props.item.points, 0, '')}
        </ItemPrizePoints>
        <ItemPrizeToken src={icon_token} />
      </ItemPrizeInnerRight>
    </PrizeContainer>
  )
}

const ItemFree = props => {
  return (
    <FreeContainer
      backgroundColor={props.item.colorContainer}
      onClick={props.prizeBoardMenuTypeOnClick.bind(this, props.item)}
    >
      <FreeInnerLeft backgroundColor={props.item.colorSubContainer}>
        <CommonItemInnerLeft>
          <CommonItemName color={props.item.colorName}>
            {props.item.name.toUpperCase()}
          </CommonItemName>
          <CommonItemDesc color={props.item.colorName}>
            {props.item.desc.toUpperCase()}
          </CommonItemDesc>
        </CommonItemInnerLeft>
      </FreeInnerLeft>
      <FreeInnerRight>
        <FreeInnerRightLabel color={props.item.colorPoints}>
          {'FREE'}
        </FreeInnerRightLabel>
      </FreeInnerRight>
    </FreeContainer>
  )
}

const PrizeContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${props => responsiveDimension(15)};
  margin: ${props => responsiveDimension(0.3)} 0 0 0;
  position: relative;
  background-color: ${props => props.backgroundColor};
  &:hover {
    opacity: 0.7;
  }
`
const PrizeInnerLeft = styled.div`
  width: 55%;
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(15)};
  border-bottom-right-radius: ${props => responsiveDimension(15)};
  display: flex;
  align-items: center;
  background-color: ${props => props.backgroundColor};
`
const ItemPrizeInnerRight = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: ${props => responsiveDimension(2.1)};
`
const ItemPrizePoints = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.1)};
  padding-right: ${props => responsiveDimension(1.3)};
  color: ${props => props.color};
`
const ItemPrizeToken = styled.img`
  width: ${props => responsiveDimension(2)};
`
const ItemPrizeInnerCenter = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-left: ${props => responsiveDimension(4)};
`
const ItemPrizeInnerCenterAmt = styled.div`
  width: ${props => responsiveDimension(6.3)};
  height: ${props => responsiveDimension(6.3)};
  border-radius: ${props => responsiveDimension(6.3)};
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${props => responsiveDimension(0.3)} solid ${props => props.color};
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
`

const FreeContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${props => responsiveDimension(10.5)};
  background-color: #ffffff;
  margin: ${props => responsiveDimension(0.3)} 0 0 0;
  background-color: ${props => props.backgroundColor};

  &:hover {
    opacity: 0.7;
  }
`
const FreeInnerLeft = styled.div`
  width: 55%;
  height: 100%;
  border-top-right-radius: ${props => responsiveDimension(15)};
  border-bottom-right-radius: ${props => responsiveDimension(15)};
  display: flex;
  align-items: center;
  background-color: ${props => props.backgroundColor};
`
const FreeInnerRight = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(4)};
  padding-right: ${props => responsiveDimension(1.7)};
`
const FreeInnerRightLabel = styled.span`
  color: ${props => props.color};
`

const CommonItemInnerLeft = styled.div`
  text-align: left;
  padding-left: ${props => responsiveDimension(2)};
`
const CommonItemName = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3.2)};
  height: ${props => responsiveDimension(3.6)};
  color: ${props => props.color};
`
const CommonItemDesc = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.7)};
  color: ${props => props.color};
`
PrizeBoardMenuType.propTypes = {
  item: PropTypes.shape({
    sequence: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
  }),
  prizeBoardMenuTypeOnClick: PropTypes.func.isRequired,
}
