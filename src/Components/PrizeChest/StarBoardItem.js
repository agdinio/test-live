import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { evalImage, responsiveDimension } from '@/utils'
let mainHeight = 0

@inject('ProfileStore')
@observer
export default class StarBoardItem extends Component {
  constructor(props) {
    super(props)
    mainHeight = this.props.mainHeight
  }

  render() {
    let { item, ProfileStore } = this.props

    return (
      <PrizeImageStar color={item.styles.prizeImageColor}>
        <Star
          src={evalImage(item.starIcon)}
          color={
            item.claimed ? '#808285' : item.styles.secondaryBackgroundColor
          }
          font={
            ProfileStore.profile.currencies.stars.toString().length == 1
              ? 'pamainextrabold'
              : ProfileStore.profile.currencies.stars.toString().length == 2
              ? 'pamainbold'
              : ProfileStore.profile.currencies.stars.toString().length == 3
              ? 'pamainregular'
              : 'pamainlight'
          }
          fontSize={
            ProfileStore.profile.currencies.stars.toString().length == 1
              ? 3.5
              : ProfileStore.profile.currencies.stars.toString().length == 2
              ? 3.2
              : ProfileStore.profile.currencies.stars.toString().length == 3
              ? 3
              : 2
          }
        >
          {ProfileStore.profile.currencies.stars}
        </Star>
      </PrizeImageStar>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: ${props => mainHeight};
  background-color: ${props => props.backgroundColor};
  margin-top: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
  }
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const PrizeImageWrapper = styled.div`
  width: 30%;
  height: ${props => mainHeight};
  border-top-right-radius: ${props => mainHeight};
  border-bottom-right-radius: ${props => mainHeight};
  background-color: #231f20;
  display: flex;
  justify-content: flex-end;
`

const PrizeImageStar = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  min-width: ${props => mainHeight};
  min-height: ${props => mainHeight};
  border-radius: ${props => mainHeight};
  border: ${props => responsiveDimension(0.4)} solid ${props => props.color};
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-bottom: 5%;
`

const Star = styled.div`
  width: ${props => mainHeight};
  height: ${props => mainHeight};
  min-width: ${props => mainHeight};
  min-height: ${props => mainHeight};
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: ${props => props.font || 'pamainextrabold'};
  font-size: ${props => responsiveDimension(props.fontSize || 3.5)};
  color: ${props => props.color};
  padding-top: ${props => responsiveDimension(1)};

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 75%;
  background-position: center;
`
