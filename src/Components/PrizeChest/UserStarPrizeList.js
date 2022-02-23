import React, { Component } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { intercept } from 'mobx'
import { vhToPx, isEqual } from '@/utils'
import PrizeChestItem from '@/Components/PrizeChest/PrizeChestItem'
import PrizeClaimTerms from '@/Components/PrizeBoard/PrizeList/PrizeClaimTerms'

@inject('ProfileStore', 'StarBoardStore', 'NavigationStore', 'PrizeBoardStore')
export default class UserStarPrizeList extends Component {
  constructor(props) {
    super(props)
    this.userPrize = null
    this.userPrizes = []
    this._isMounted = false

    // intercept(this.props.StarBoardStore, 'userPrize', change => {
    //   if (change.newValue) {
    //     if (!isEqual(change.newValue, this.userPrize)) {
    //       if (change.newValue.prizes && change.newValue.prizes.length > 0) {
    //         this.userPrize = change.newValue
    //         this.userPrize.prizes = [
    //           ...this.props.StarBoardStore.userPrize.prizes.filter(
    //             o => o.forRedeem
    //           ),
    //         ]
    //         this.forceUpdate()
    //
    //         console.log('NOT EXQUAL DAW E', this.userPrize)
    //       }
    //     }
    //   }
    //   return change;
    // })

    // intercept(
    //   this.props.StarBoardStore,
    //   'currentSinglePrizeForRedeem',
    //   change => {
    //     if (change.newValue) {
    //       if (this.userPrize) {
    //         if (this.userPrize.prizes && this.userPrize.prizes.length > 0) {
    //           const exists = this.userPrize.prizes.filter(
    //             o =>
    //               o.shortName === change.newValue.shortName &&
    //               o.seasonId === change.newValue.seasonId &&
    //               o.boardTypeId === change.newValue.boardTypeId
    //           )[0]
    //           if (!exists) {
    //             this.userPrize.prizes.push(change.newValue)
    //             this.forceUpdate()
    //           }
    //         } else {
    //           this.userPrize.prizes.push(change.newValue)
    //           this.forceUpdate()
    //         }
    //       } else {
    //         this.query()
    //       }
    //     }
    //     return change
    //   }
    // )

    this.disposeCurrentSinglePrizeForRedeem = intercept(this.props.StarBoardStore, 'currentSinglePrizeForRedeem', change => {
      if (change.newValue) {
        if (this.userPrizes && this.userPrizes.length > 0) {
          const exists = this.userPrizes.filter(o =>
            o.prizeBoardId === change.newValue.prizeBoardId &&
            o.prizeBoardPrizeId === change.newValue.prizeBoardPrizeId
          )[0]
          if (!exists) {
            this.userPrizes.push(change.newValue)
            if (this._isMounted) {
              this.forceUpdate()
            }
          }
        } else {
          this.userPrizes.push(change.newValue)
          if (this._isMounted) {
            this.forceUpdate()
          }
        }
      }
      return change
    })

    this.disposePrizeBoardHasFetched = intercept(this.props.PrizeBoardStore, 'prizeBoardHasFetched', change => {
      if (change.newValue) {
        this.query()
      }
      return change
    })

  }

  handleShowPrizeClaimTerms(item) {
    let comp = (
      <PrizeClaimTerms item={item} refHideBanner={this.props.refHideBanner}/>
    )
    this.props.NavigationStore.addSubScreen(comp, 'PrizeClaimTerms')
  }

  query() {
    this.props.StarBoardStore.getUserStarPrizes().then(res => {
      this.userPrizes = res
      if (this._isMounted) {
        this.forceUpdate()
      }
    })
  }

  componentWillUnmount() {
    this.disposeCurrentSinglePrizeForRedeem()
    this.disposePrizeBoardHasFetched()
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.query()
  }

  render() {
    let {userPrizes} = this
    let {profile} = this.props.ProfileStore
    let {baseColor} = this.props.StarBoardStore

    if (!userPrizes) {
      return <Container/>
    }

    return (
      <Container>
        {/**
         * User Claim Prizes from PrizeBoard
         */
          userPrizes && userPrizes.length > 0
            ? userPrizes.map((item, index) => {
              // const uniqueId = `${item.shortName}-${item.seasonId}-${item.boardTypeId}`
            const uniqueId = `${item.prizeBoardId}-${item.prizeBoardPrizeId}`

              item.image = item.image && item.image && item.image.replace(/\s+/g, '%20');
              item.awardTitle = 'get it'
              item.awardIcon = 'star-icon-white.svg'
              item.styles = {
                backgroundColor: '#231f20',
                secondaryBackgroundColor: '#ffffff',
                tertiaryBackgroundColor: '#b9aa13',
                prizeImageColor: baseColor,
                titleColor: '#b9aa13',
                subTitleColor: '#000000',
                awardBackgroundColor: '#2fc12f',
              }
              return (
                <PrizeChestItem
                  key={`${uniqueId}-${index}`}
                  item={item}
                  profile={profile}
                  isPrizeBoard={true}
                  //handleClick={this.handleShowPrizeClaimTerms.bind(this, item)}
                  refHideBanner={this.props.refHideBanner}
                />
              )
            }) : null}
      </Container>
    )
  }
}

const Container = styled.div``
