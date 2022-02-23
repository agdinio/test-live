import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import SwipingLineAnimation from '@/Components/Common/SwipingLineAnimation'
import ActivityComponent from '@/Components/Common/ActivityComponent'
import AuthSequence from '@/Components/Auth'
import {
  vhToPx,
  hex2rgb,
  evalImage,
  numberFormat,
  responsiveDimension,
} from '@/utils'

@inject('PrizeBoardStore', 'ProfileStore')
export default class PrizeClaim extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activityIndicator: null,
    }
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.props.PrizeBoardStore.getPrizeBoards({
        userId: this.props.ProfileStore.profile.userId,
      }).then(next2 => {
        if (next2) {
          this.setState({ activityIndicator: null })
        }
      })
    }
  }

  handleUsePointsClick(item) {
    if (this.props.ProfileStore.profile.userId) {
      this.setState({ activityIndicator: <ActivityComponent size={4} /> })
      this.props.refUsePoints(item)
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.activityIndicator !== this.state.activityIndicator) {
      return true
    }
    return false
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
    let { item, refPrizeViewOrClaimContainer } = this.props
    const uniqueIdentifier = `${item.shortName}-${item.seasonId}${item.boardTypeId}`
    let icon = ''
    try {
      //const imageName = `${this.props.PrizeBoardStore.url}${item.shortName}-${item.seasonId}${item.boardTypeId}_${item.images[0]}`
      icon = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${item.image}`
    } catch (e) {
      icon = ''
    }

    const available = item.qty > 0 ? true : false

    return (
      <Container innerRef={refPrizeViewOrClaimContainer}>
        {this.state.activityIndicator}

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
            <Section marginTop={4} marginBottom={4}>
              <ItemImageAndQtyWrapper>
                <ItemImage src={icon} />
                <ItemQty backgroundColor={available ? '#000000' : '#c61818'}>
                  {item.qty}
                </ItemQty>
              </ItemImageAndQtyWrapper>
            </Section>
            <Section>
              {available ? (
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
              ) : (
                <PointValueWrapper>
                  <TextWrapper>
                    <Text font={'pamainbold'} size={8.5} color={'#c61818'}>
                      SOLDOUT
                    </Text>
                  </TextWrapper>
                  <TextWrapper marginTop={1}>
                    <Text
                      font={'pamainlight'}
                      size={4.5}
                      color={'#000000'}
                      uppercase
                    >
                      100 available for purchase
                    </Text>
                  </TextWrapper>
                </PointValueWrapper>
              )}
            </Section>
          </Content>
        </ContentScrolling>
        <Bottom>
          <ViewOrClaimButtonWrapper>
            {available ? (
              <ButtonBlock>
                <ViewOrClaimButton
                  id={`button-prizeboard-prize-usepoints`}
                  text={'use points'}
                  backgroundColor={'#17c5ff'}
                  color={'#ffffff'}
                  numBtn={2}
                  onClick={this.handleUsePointsClick.bind(this, item)}
                />
                <ViewOrClaimButton
                  id={`button-prizeboard-prize-buyatdiscount`}
                  text={'buy at discount'}
                  backgroundColor={'#ffffff'}
                  color={'#000000'}
                  borderColor={'#000000'}
                  numBtn={2}
                />
              </ButtonBlock>
            ) : (
              <BuyOnlyButtonWrapper>
                <ViewOrClaimButton
                  id={`button-prizeboard-prize-buyatdiscount`}
                  text={'buy at discount'}
                  backgroundColor={'#ffffff'}
                  color={'#000000'}
                  borderColor={'#000000'}
                />
              </BuyOnlyButtonWrapper>
            )}
          </ViewOrClaimButtonWrapper>
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
  height: 75%;
  display: flex;
  margin-top: 12%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.3vh rgba(0, 0, 0, 0.3);
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
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Bottom = styled.div`
  width: 100%;
  height: 25%;
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

const ButtonBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10% 0 10%;
`

const BuyOnlyButtonWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

const ViewOrClaimButton = styled.div`
  width: calc(95% / ${props => props.numBtn || 2.5});
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
  height: 40%;
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
  line-height: 1;
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
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

const itemImageHeight = 24
const ItemImageAndQtyWrapper = styled.div`
  position: relative;
  width: ${props => responsiveDimension(itemImageHeight)};
  height: ${props => responsiveDimension(itemImageHeight)};
`

const ItemImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%
  border-radius: 50%;
  border: ${props => responsiveDimension(1)} solid #000000;
  overflow: hidden;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
`

const ItemQty = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(itemImageHeight * 0.2)};
  height: ${props => responsiveDimension(itemImageHeight * 0.2)};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(itemImageHeight * 0.12)};
  color: #ffffff;
  background-color: ${props => props.backgroundColor};
  top: 6%;
  left: 50%;
  transform: translate(-50%, -50%);
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
