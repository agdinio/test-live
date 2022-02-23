import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { vhToPx } from '@/utils'
import PrizeChestItem from '@/Components/PrizeChest/PrizeChestItem'
import PrizeClaimTerms from '@/Components/PrizeBoard/PrizeList/PrizeClaimTerms'
import { intercept } from 'mobx'

@inject('ProfileStore', 'PrizeBoardStore', 'NavigationStore')
export default class UserPrizeList extends Component {
  constructor(props) {
    super(props)
    this.userPrizes = []
    this._isMounted = false

    this.disposePrizeBoardHasFetched = intercept(
      this.props.PrizeBoardStore,
      'prizeBoardHasFetched',
      change => {
        if (change.newValue) {
          this.query()
        }
        return change
      }
    )
  }

  handleShowPrizeClaimTerms(item) {
    let comp = (
      <PrizeClaimTerms item={item} refHideBanner={this.props.refHideBanner} />
    )
    this.props.NavigationStore.addSubScreen(comp, 'PrizeClaimTerms')
  }

  query() {
    this.props.PrizeBoardStore.getUserPrizes().then(res => {
      this.userPrizes = res
      if (this._isMounted) {
        this.forceUpdate()
      }
    })
  }

  componentWillUnmount() {
    this.disposePrizeBoardHasFetched()
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.query()
  }

  render() {
    let { userPrizes } = this
    let { profile } = this.props.ProfileStore

    // if (!userPrizes) {
    //   return <Container />
    // }

    return (
      <Container>
        {/**
         * User Claim Prizes from PrizeBoard
         */
        userPrizes && userPrizes.length > 0
          ? userPrizes.map((item, index) => {
              const uniqueId = `${item.prizeBoardPrizeId}-${item.seasonId}-${item.boardTypeId}`

              item.awardTitle = 'get it'
              item.awardIcon = 'symbol-prize_white.svg'
              item.styles = {
                backgroundColor: '#231f20',
                tertiaryBackgroundColor: '#574263',
                prizeImageColor: '#9368aa',
                titleColor: '#9368aa',
                subTitleColor: '#000000',
                awardTitle: [{ value: 'get it' }],
                awardIcon: 'symbol-prize_white.svg',
                awardIconColor: '#ffffff',
                awardBackgroundColor: '#2fc12f',
              }
              return (
                <PrizeChestItem
                  key={`${uniqueId}-${index}`}
                  item={item}
                  index={index}
                  profile={profile}
                  isPrizeBoard={true}
                  //handleClick={this.handleShowPrizeClaimTerms.bind(this, item)}
                  refHideBanner={this.props.refHideBanner}
                />
              )
            })
          : null}
      </Container>
    )
  }
}

const Container = styled.div``
