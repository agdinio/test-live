import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx, evalImage } from '@/utils'
import IconStarSelected from '@/assets/images/star-icon-selected.svg'
import ContinueButton from '@/Components/Button'

@inject('NavigationStore', 'StarBoardStore')
@observer
export default class StarSelected extends Component {
  constructor(props) {
    super(props)
  }

  onClickContinue() {
    if (
      this.props.NavigationStore.location === '/prepick' ||
      this.props.NavigationStore.location === '/livegame'
    ) {
      this.props.toGameState()
    } else {
      if (this.props.selectedStar) {
        this.props.StarBoardStore.setSelectedStar(this.props.selectedStar)
        this.props.NavigationStore.setPlayThroughOnActiveMenu('/starprize')
      }

      setTimeout(() => {
        this.props.NavigationStore.setCurrentView('/livegame')
      }, 500)
    }
  }

  componentDidUpdate(nextProps) {
    debugger
    if (this.props.selectedStar) {
      TweenMax.to(this.refImage, 0.75, { y: '5%' })
      TweenMax.to(this.refSelectedStar, 0.75, { opacity: 1 })
    }
  }

  render() {
    let { selectedKey, selectedStar, stars } = this.props
    let selStar = selectedStar ? evalImage(selectedStar.icon) : null
    let starText = selectedStar ? selectedStar.text : ''
    return (
      <Container innerRef={this.props.reference}>
        <Section height={50}>
          <SubSection>
            <TextWrapper>
              <div style={{ textAlign: 'center' }}>
                <Text font={'pamainlight'} size={5.5} uppercase>
                  all&nbsp;
                </Text>
                <Text
                  font={'pamainextrabold'}
                  size={5.5}
                  color={'#eede16'}
                  uppercase
                >
                  stars
                </Text>
                <Text font={'pamainlight'} size={5.5} uppercase>
                  &nbsp;open
                </Text>
              </div>
            </TextWrapper>
            <TextWrapper>
              <div style={{ textAlign: 'center' }}>
                <Text font={'pamainextrabold'} size={4.7} uppercase>
                  my favorite category
                </Text>
              </div>
            </TextWrapper>
          </SubSection>
        </Section>

        <Section>
          <SubSection innerRef={ref => (this.refImage = ref)}>
            <ImageWrapper>
              <SelectedStar
                src={IconStarSelected}
                innerRef={ref => (this.refSelectedStar = ref)}
              />
              <SelectedIcon src={selStar} />
            </ImageWrapper>
            <Text
              font={'pamainlight'}
              size={8}
              color={'#eedf17'}
              uppercase
              lineheight={1.5}
            >
              {starText}
            </Text>
          </SubSection>
        </Section>

        <Section height={50}>
          <SubSection>
            <TextWrapper>
              <div style={{ textAlign: 'center' }}>
                <Text font={'pamainlight'} size={4} uppercase>
                  play the&nbsp;
                </Text>
                <Text font={'pamainbold'} size={4} uppercase>
                  experience&nbsp;
                </Text>
                <Text font={'pamainlight'} size={4} uppercase>
                  &&nbsp;
                </Text>
                <Text font={'pamainbold'} size={4} color={'#ec1c23'} uppercase>
                  share
                </Text>
              </div>
            </TextWrapper>
            <TextWrapper>
              <div style={{ textAlign: 'center' }}>
                <Text font={'pamainlight'} size={4} uppercase>
                  earn&nbsp;
                </Text>
                <Text font={'pamainbold'} size={4} color={'#eedf17'} uppercase>
                  stars
                </Text>
              </div>
            </TextWrapper>
            <TextWrapper>
              <div style={{ textAlign: 'center' }}>
                <Text font={'pamainlight'} size={4} uppercase>
                  in all&nbsp;
                </Text>
                <Text font={'pamainbold'} size={4} uppercase>
                  categories
                </Text>
              </div>
            </TextWrapper>
          </SubSection>
        </Section>

        <Section height={50}>
          <ContinueButton
            buttonText={'CONTINUE'}
            handleButtonClick={this.onClickContinue.bind(this)}
          />
        </Section>

        <Section height={33}>
          <Footer>Ambassador Demo 1.0v</Footer>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  opacity: 0;
  z-index: 0;
`

const ImageWrapper = styled.div`
  width: ${props => vhToPx(20)};
  height: ${props => vhToPx(20)};
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-5%);
  z-index: 11;
`

const SelectedIcon = styled.div`
  width: inherit;
  height: inherit;
  border-radius: 50%;
  border ${props => vhToPx(0.5)} solid #eedf17;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;  
  z-index: 12;
`

const SelectedStar = styled.div`
  width: inherit;
  height: inherit;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: absolute;
  opacity: 0;
  z-index: 13;
`

const Section = styled.div`
  width: 100%;
  height: ${props => props.height || `100`}%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SubSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  line-height: ${props => props.lineheight || 1};
  ${props => (props.uppercase ? `text-transform: uppercase;` : '')};
`

const Footer = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  bottom: 5%;
  font-size: ${props => vhToPx(1.5)};
  color: white;
  font-family: pamainregular;
`
