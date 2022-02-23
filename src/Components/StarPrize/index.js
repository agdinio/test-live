import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Quad } from 'gsap'
import { vhToPx, hex2rgb, evalImage } from '@/utils'
import bgDefault from '@/assets/images/playalong-default.jpg'
import StarSelection from './StarSelection'
import StarSelected from './StarSelected'

@inject('StarBoardStore')
@observer
export default class StarPrize extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      borderColor: '#59585b',
      selectedKey: -1,
      selectedStar: null,
      /*
      stars: [
        {
          text: 'shows',
          icon: 'star-category-shows.jpg',
          iconSelected: 'star-icon-gold.svg',
        },
        {
          text: 'gear',
          icon: 'star-category-gear.jpg',
          iconSelected: 'star-icon-gold.svg',
        },
        {
          text: 'travel',
          icon: 'star-category-travel.jpg',
          iconSelected: 'star-icon-gold.svg',
        },
      ],
*/
    })
  }

  componentDidMount() {
    if (this.props.StarBoardStore.selectedStar) {
      this.selectedStar = this.props.StarBoardStore.selectedStar
      TweenMax.set(this.refStarSelection, { opacity: 0, zIndex: 0 })
      TweenMax.set(this.refStarSelected, { opacity: 1, zIndex: 1 })
    }
  }

  handleSelectionCallback(response) {
    if (response.completed) {
      this.selectedKey = response.key
      this.selectedStar = response.star
      TweenMax.set(this.refStarSelection, { opacity: 0, zIndex: 0 })
      TweenMax.set(this.refStarSelected, { opacity: 1, zIndex: 1 })
    }
  }

  render() {
    let { stars } = this.props.StarBoardStore
    return (
      <Container bg={bgDefault}>
        <StarSelection
          reference={ref => (this.refStarSelection = ref)}
          stars={stars}
          handleCallback={this.handleSelectionCallback.bind(this)}
        />
        <StarSelected
          reference={ref => (this.refStarSelected = ref)}
          stars={stars}
          selectedKey={this.selectedKey}
          selectedStar={this.selectedStar}
          toGameState={this.props.toGameState}
        />
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  width: 100%;
  height: ${props => props.height || `100`}%;
  display: flex;
  justify-content: center;
  align-items: center;
`
