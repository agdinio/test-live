import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'
import StarIconDarkGoldBorder from '@/assets/images/star-icon-dark-gold-border.svg'

@inject('StarBoardStore', 'ProfileStore')
@observer
export default class StarBucket extends Component {
  constructor(props) {
    super(props)
    // this.props.StarBoardStore.resetLocalStar()
    // this.props.StarBoardStore.creditLocalStar(
    //   this.props.ProfileStore.profile.currencies.stars
    // )
  }

  render() {
    let { profile } = this.props.ProfileStore
    let { stars } = profile.currencies

    return (
      <Container>
        <HalfCircle />
        <BottomStar
          innerRef={this.props.reference}
          font={
            stars.toString().length == 1
              ? 'pamainextrabold'
              : stars.toString().length == 2
              ? 'pamainbold'
              : stars.toString().length == 3
              ? 'pamainregular'
              : 'pamainlight'
          }
          fontSize={
            stars.toString().length == 1
              ? 11
              : stars.toString().length == 2
              ? 10
              : stars.toString().length == 3
              ? 9
              : 8
          }
        >
          {stars}
        </BottomStar>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const HalfCircle = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  &:after {
    content: '';
    position: absolute;
    width: ${props => responsiveDimension(20)};
    height: ${props => responsiveDimension(10)};
    border-top-left-radius: ${props => responsiveDimension(10)};
    border-top-right-radius: ${props => responsiveDimension(10)};
    background-color: #eede16;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -10%);
    -webkit-appearance: none;
    -webkit-box-shadow: 0 0 ${responsiveDimension(4)} ${responsiveDimension(4)}
      rgba(0, 0, 0, 1);
    -moz-box-shadow: 0 0 ${responsiveDimension(4)} ${responsiveDimension(4)}
      rgba(0, 0, 0, 1);
    box-shadow: 0 0 ${responsiveDimension(4)} ${responsiveDimension(4)}
      rgba(0, 0, 0, 1);
  }
`

const BottomStar = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(11)};
  height: ${props => responsiveDimension(11)};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${StarIconDarkGoldBorder});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.fontSize * 0.5)};
  color: #eede16;
  padding-top: ${props => responsiveDimension(1.5)};
`
