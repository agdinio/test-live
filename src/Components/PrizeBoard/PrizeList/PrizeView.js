import React, { Component } from 'react'
import styled from 'styled-components'
import { inject } from 'mobx-react'
import { TweenMax, TimelineMax } from 'gsap'
import ArrowIcon from '@/assets/images/icon-arrow-black.svg'
import SwipingLineAnimation from '@/Components/Common/SwipingLineAnimation'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import { vhToPx, hex2rgb, numberFormat, responsiveDimension } from '@/utils'
import AuthSequence from '@/Components/Auth'

@inject('ProfileStore')
export default class PrizeView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activityIndicator: null,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.activityIndicator !== this.state.activityIndicator) {
      return true
    }
    return false
  }
  handleClaimItNowClick() {
    if (this.refFirstBlock && this.refSecondBlock) {
      TweenMax.to(this.refFirstBlock, 0.3, { y: '50%', opacity: 0, zIndex: 1 })
      TweenMax.to(this.refSecondBlock, 0.3, { opacity: 1, zIndex: 2, y: '0%' })
    }
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.setState({ activityIndicator: null })
    }
  }

  handleUsePointsClick(item) {
    if (this.props.ProfileStore.profile.userId) {
      if (this.refUsePointsButton) {
        if (item.qty > 0) {
          this.setState({ activityIndicator: <ActivityComponent size={4} /> })
          this.props.refUsePoints(item)
        } else {
          const changeColor = TweenMax.to(this.refUsePointsButton, 0.3, {
            background: '#c61818',
            innerHTML: 'not enough points',
            pointerEvents: 'none',
          })
          setTimeout(() => changeColor.reverse(), 2000)
        }
      }
    } else {
      /**
       * UNAUTHENTICATED
       **/
      this.setState({
        activityIndicator: (
          <AuthWrapper>
            <AuthSequence
              mainHandleLoggedIn={this.handleIsLoggedIn.bind(this)}
            />
          </AuthWrapper>
        ),
      })
    }
  }

  componentWillUnmount() {
    if (this.props.timeStop) {
      this.props.timeStop()
    }
  }

  componentDidMount() {
    if (this.props.timeStart) {
      this.props.timeStart()
    }
  }

  render() {
    let { item } = this.props
    const uniqueIdentifier = `${item.shortName}-${item.seasonId}${item.boardTypeId}`

    return (
      <Container>
        <ContentScrolling>
          <Content>
            <Section>
              <TextMarquee>
                <Text
                  font={'pamainbold'}
                  size={7}
                  color={'#000000'}
                  uppercase
                  innerRef={ref => (this[`title-${uniqueIdentifier}`] = ref)}
                >
                  {item.title}
                </Text>
              </TextMarquee>
              <Text
                font={'pamainregular'}
                size={4.5}
                color={'#000000'}
                uppercase
              >
                {item.subTitle}
              </Text>
            </Section>
            <Section
              marginTop={3}
              marginBottom={3}
              style={{ padding: '0 10% 0 10%' }}
            >
              <Text
                font={'pamainlight'}
                size={3}
                color={'#000'}
                lineHeight={1.3}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Felis eget velit aliquet sagittis id consectetur purus ut
                faucibus. Venenatis a condimentum vitae sapien pellentesque
                habitant. Egestas pretium aenean pharetra magna ac. Ipsum dolor
                sit amet consectetur adipiscing elit ut aliquam purus. Viverra
                tellus in hac habitasse.
              </Text>
            </Section>
            <Section
              marginTop={3}
              marginBottom={3}
              style={{ padding: '0 10% 0 10%' }}
            >
              <Text
                font={'pamainlight'}
                size={3}
                color={'#000'}
                lineHeight={1.3}
              >
                Urna nunc id cursus metus aliquam. Arcu risus quis varius quam.
                Accumsan tortor posuere ac ut consequat semper viverra. Libero
                enim sed faucibus turpis in eu.
              </Text>
            </Section>
            <Section>
              <PointValueWrapper>
                <TextWrapper>
                  <Text font={'pamainregular'} size={8} color={'#000000'}>
                    {numberFormat(item.value, 0, '')}
                  </Text>
                  <PointLabel />
                </TextWrapper>
                <TextWrapper marginTop={1}>
                  <Text
                    font={'pamainlight'}
                    size={7}
                    color={'#000000'}
                    uppercase
                  >
                    {'claim it now'}
                  </Text>
                </TextWrapper>
              </PointValueWrapper>
            </Section>
            <Section>
              <ButtonGroup>
                <ViewOrClaimButton
                  id={`button-prizeboard-prize-usepoints`}
                  backgroundColor={item.qty > 0 ? '#17c5ff' : '#bbbfc2'}
                  color={'#ffffff'}
                  numBtn={2}
                  onClick={this.handleUsePointsClick.bind(this, item)}
                  innerRef={ref => (this.refUsePointsButton = ref)}
                >
                  use points
                </ViewOrClaimButton>
                <ViewOrClaimButton
                  id={`button-prizeboard-prize-buyatdiscount`}
                  text={'buy at discount'}
                  backgroundColor={'#ffffff'}
                  color={'#000000'}
                  borderColor={'#000000'}
                  numBtn={2}
                />
              </ButtonGroup>
            </Section>
          </Content>
        </ContentScrolling>
        <Bottom>
          {/*
          <ViewOrClaimButtonWrapper>

            <FirstBlock innerRef={ref => (this.refFirstBlock = ref)}>
              <ViewOrClaimButton
                text={'claim it now'}
                backgroundColor={'#000000'}
                color={'#ffffff'}
                onClick={this.handleClaimItNowClick.bind(this)}
              />
              <ArrowDownIcon onClick={this.handleClaimItNowClick.bind(this)} />
            </FirstBlock>

            <SecondBlock innerRef={ref => (this.refSecondBlock = ref)}>
              <ViewOrClaimButton
                backgroundColor={item.qty > 0 ? '#17c5ff' : '#bbbfc2'}
                color={'#ffffff'}
                numBtn={2}
                onClick={this.handleUsePointsClick.bind(this, item)}
                innerRef={ref => (this.refUsePointsButton = ref)}
              >
                use points
              </ViewOrClaimButton>
              <ViewOrClaimButton
                text={'buy at discount'}
                backgroundColor={'#ffffff'}
                color={'#000000'}
                borderColor={'#000000'}
                numBtn={2}
              />
            </SecondBlock>
          </ViewOrClaimButtonWrapper>
*/}
          <TapToReturnWrapper
            backgroundColor={this.props.footerBackgroundColor || '#7635dc'}
          >
            <TapToReturn>
              <Text
                font={'pamainlight'}
                size={3.7}
                color={'#ffffff'}
                onClick={this.props.refClosePanel.bind(this)}
                nowrap
              >
                TAP TO RETURN OR SWIPE RIGHT
              </Text>
              <SwipeRightAnim>
                <SwipingLineAnimation />
              </SwipeRightAnim>
            </TapToReturn>
          </TapToReturnWrapper>
        </Bottom>
        {this.state.activityIndicator}
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`

const ContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
  display: flex;
  margin-top: 12%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.3vh rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0.1)};
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ff0000;
  }
`

const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 5vh;
`

const Bottom = styled.div`
  width: 100%;
  height: 11%;
  display: flex;
  flex-direction: column;
`

const ViewOrClaimButtonWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to top, rgba(239, 239, 239, 1), #ffffff);
`

const ButtonGroup = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(15)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10% 0 10%;
`

const FirstBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  top: -20%;
  padding: 0 10% 0 10%;
`

const SecondBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10% 0 10%;
  z-index: 1;
  opacity: 0;
  transform: translateY(-30%);
`

const ArrowDownIcon = styled.div`
  width: ${props => responsiveDimension(2.7)};
  height: ${props => responsiveDimension(2.7)};
  background-image: url(${props => ArrowIcon});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  transform: rotate(90deg);
  margin-top: 2%;
  cursor: pointer;
`

const ViewOrClaimButton = styled.div`
  width: calc(95% / 2);
  height: 60%;
  background: linear-gradient(to right, ${props =>
    props.backgroundColor}, ${props => hex2rgb(props.backgroundColor, 0.9)});
  border: ${props =>
    props.borderColor
      ? `${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ``};
  color: ${props => props.color};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  letter-spacing: ${props => responsiveDimension(0.1)};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:after {
    content: '${props => props.text}';
  }
`

const TapToReturnWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#7635dc'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  z-index: 10;
`

const TapToReturn = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SwipeRightAnim = styled.div`
  width: 36%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 3%;
  padding-right: 3%;
`

const SwipeLineRightBall = styled.div`
  width: ${props => responsiveDimension(3)};
  height: ${props => responsiveDimension(3)};
  border-radius: ${props => responsiveDimension(3)};
  background-color: #ffffff;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`

const SwipeLineRightAnim = styled.div`
  width: 0;
  height: ${props => responsiveDimension(1)};
  background: linear-gradient(to right, transparent, white);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const TextMarquee = styled.div`
  width: 80%;
  text-align: center;
`

const TextWrapper = styled.div`
  display: flex;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const PointValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PointLabel = styled.div`
  display: flex;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  &:after {
    position: absolute;
    content: 'PTS';
    color: #17c5ff;
    margin-left: 1%;
    margin-top: 4.5%;
  }
`

const AuthWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
`
