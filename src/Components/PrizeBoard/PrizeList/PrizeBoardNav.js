import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import TokenIcon from '@/assets/images/playalong-token.svg'
import PrizeBoardNavType from '@/Components/PrizeBoard/PrizeList/PrizeBoardNavType'
import icon_arrow_right from '@/assets/images/icon-arrow.svg'
import { isEqual, evalImage, numberFormat, responsiveDimension } from '@/utils'

@inject('PrizeBoardStore')
export default class PrizeBoardNav extends Component {
  constructor(props) {
    super(props)
    //this.props.PrizeBoardStore.getPrizes()
    this.state = {
      activityIndicator: null,
    }
  }

  animSubTitle() {
    const refSubTitle = this[`subtitle-${this.props.item.boardTypeId}`]
    const refSubTitleNoWrap = this[`subtitle-nw-${this.props.item.boardTypeId}`]
    if (refSubTitle && refSubTitleNoWrap) {
      if (refSubTitleNoWrap.offsetWidth > refSubTitle.offsetWidth) {
        const slideLimit =
          refSubTitleNoWrap.offsetWidth - refSubTitle.offsetWidth + 2
        new TimelineMax({ repeat: -1 })
          .to(refSubTitleNoWrap, 3, { x: -slideLimit, delay: 3 })
          .to(refSubTitleNoWrap, 0.5, { opacity: 0, delay: 1 })
          .set(refSubTitleNoWrap, { x: '100%', opacity: 1 })
      }
    }
  }

  handleClickNextTab(index) {
    this.props.handleClickNextTabFromPrizeBoard(index + 1, false)
  }

  handleView(entry) {
    this.props.refPrizeView(entry)
  }

  handleClaim(entry) {
    console.log(
      '/////////////////////////////////////////....................................',
      entry
    )
    this.props.refPrizeClaim(entry)
  }

  componentDidUpdate() {
    this.animSubTitle()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps.prizeboardPrizes, this.props.prizeboardPrizes)) {
      return true
    }

    if (this.state.activityIndicator !== nextState.activityIndicator) {
      return true
    }

    // if (_.differenceWith(nextProps.prizeboardPrizes, this.props.prizeboardPrizes, _.isEqual).length > 0) {
    //   return true
    // }

    return false
  }

  componentDidMount() {
    // if (this.refContent.offsetHeight < this.refContent.scrollHeight) {
    //   this.refContent.style.overflowY = 'scroll'
    // } else {
    //   this.refContent.style.overflow = 'hidden'
    // }

    this.animSubTitle()
  }

  render() {
    let { item, prizeboardPrizes } = this.props

    //prizeboardPrizes.sort((a, b) => a.value < b.value)
    prizeboardPrizes.sort((a, b) => b.value - a.value)

    let LogoTag = () => {
      return (
        <HeaderAbsolute>
          <HeaderTextWrapper>
            <HeaderTextBig color={item.nameColor}>
              {item.boardName}
            </HeaderTextBig>
            <HeaderTextSmall
              innerRef={ref => (this[`subtitle-${item.boardTypeId}`] = ref)}
            >
              <HeaderTextSmallNowrap
                innerRef={ref =>
                  (this[`subtitle-nw-${item.boardTypeId}`] = ref)
                }
              >
                {item.subTitle}
              </HeaderTextSmallNowrap>
            </HeaderTextSmall>
          </HeaderTextWrapper>
        </HeaderAbsolute>
      )
    }

    if (item.sponsor) {
      LogoTag = () => {
        return (
          <HeaderAbsolute>
            <HeaderLeft>
              <MenuMiddleIconWrapper>
                <Icon
                  src={
                    (item.sponsor || '').match(new RegExp('kcchiefs', 'gi'))
                      ? evalImage(
                          'prizeboard/teams-logos-kansas_city_chiefs.svg'
                        )
                      : null
                  }
                />
              </MenuMiddleIconWrapper>
            </HeaderLeft>
            <HeaderTextWrapper>
              <HeaderTextBig color={item.nameColor}>
                {item.boardName}
              </HeaderTextBig>
              <HeaderTextSmall>
                <HeaderTextSmallNowrap
                  innerRef={ref =>
                    (this[`subtitle-nw-${item.boardTypeId}`] = ref)
                  }
                >
                  {item.subTitle}
                </HeaderTextSmallNowrap>
              </HeaderTextSmall>
            </HeaderTextWrapper>
          </HeaderAbsolute>
        )
      }
    } else if (item.purchaseUpgrade > 0) {
      LogoTag = () => {
        return (
          <HeaderAbsolute>
            <HeaderLeft>
              <HeaderLeftLogo
                borderColor={item.primaryBackgroundColor}
                style={{ color: item.primaryBackgroundColor }}
              >
                {numberFormat(item.purchaseUpgrade, 0, '$')}
              </HeaderLeftLogo>
              <QtyTokensWrapper>
                <QtyTokens>
                  {item.tokensUpgrade
                    ? numberFormat(item.tokensUpgrade, 0, '')
                    : 0}
                </QtyTokens>
                <TokenWrapper>
                  <Token src={TokenIcon} size={1.8} index={3} />
                  <Faded index={2} size={1.8} color={'#6d6c71'} left={-1.6} />
                  <Faded index={1} size={1.8} color={'#33342f'} left={-1.6} />
                </TokenWrapper>
              </QtyTokensWrapper>
            </HeaderLeft>
            <HeaderTextWrapper>
              <HeaderTextBig color={item.primaryBackgroundColor}>
                {item.boardName}
              </HeaderTextBig>
              <HeaderTextSmall>
                <HeaderTextSmallNowrap
                  innerRef={ref =>
                    (this[`subtitle-nw-${item.boardTypeId}`] = ref)
                  }
                >
                  {item.subTitle}
                </HeaderTextSmallNowrap>
              </HeaderTextSmall>
            </HeaderTextWrapper>
          </HeaderAbsolute>
        )
      }
    } else if (item.inner) {
      LogoTag = () => {
        return (
          <HeaderAbsolute>
            <InnerImageWrapper>
              <InnerImage
                src={evalImage(
                  `prizeboard/${item.boardTypeId}-${item.inner.boardImage}`
                )}
              />
            </InnerImageWrapper>
            <HeaderTextWrapper>
              <HeaderTextBig color={item.nameColor}>
                {item.inner.boardName || item.boardName}
              </HeaderTextBig>
              <HeaderTextSmall
                innerRef={ref => (this[`subtitle-${item.boardTypeId}`] = ref)}
              >
                <HeaderTextSmallNowrap
                  innerRef={ref =>
                    (this[`subtitle-nw-${item.boardTypeId}`] = ref)
                  }
                >
                  {item.inner.subTitle || item.subTitle}
                </HeaderTextSmallNowrap>
              </HeaderTextSmall>
            </HeaderTextWrapper>
          </HeaderAbsolute>
        )
      }
    }

    return (
      <Container>
        {this.state.activityIndicator}

        <Header backgroundColor={item.colorContainer}>
          <LogoTag />
          <HeaderRight>
            <HeaderTop color={item.nameColor} />
            <HeaderBottom>
              <HeaderBottomLeft />
              <HeaderBottomRight>
                <HeaderLabelQty>QTY</HeaderLabelQty>
                <HeaderLabelPts>PTS</HeaderLabelPts>
              </HeaderBottomRight>
            </HeaderBottom>
          </HeaderRight>
        </Header>

        <Content innerRef={c => (this.refContent = c)}>
          <ContentType>
            {prizeboardPrizes.map((entry, key) => {
              return (
                <PrizeBoardNavType
                  entry={entry}
                  key={key}
                  refView={this.handleView.bind(this)}
                  refClaim={this.handleClaim.bind(this)}
                />
              )
            })}
          </ContentType>
        </Content>

        <Footer>
          <FooterLeft>
            <FooterLeftLink
              onClick={this.handleClickNextTab.bind(this, this.props.index)}
            >
              <FooterLeftLinkText>NEXT BOARD</FooterLeftLinkText>
              <FooterLeftLinkArrow src={icon_arrow_right} />
            </FooterLeftLink>
          </FooterLeft>
          <FooterRight>
            <PointsComponent />
            {/*<FooterRightPoints>*/}
            {/*{this.state.currencies && this.state.currencies.points || 0}*/}
            {/*</FooterRightPoints>*/}
            <FooterRightPointsLabel>&nbsp;PTS</FooterRightPointsLabel>
          </FooterRight>
        </Footer>
      </Container>
    )
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-display: column;
  flex-direction: column;
  width: 100%;
  //height: ${props => responsiveDimension(93.6)};
  height: 100%;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  //background-color: ${props => props.backgroundColor}
  background: linear-gradient(to right, rgba(0,0,0,1)40%, rgba(59,59,60, 1) );
  width: 100%;
  //height: ${props => responsiveDimension(16)};
  height: 13%;
  position: relative;
`
const HeaderAbsolute = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding-left: ${props => responsiveDimension(1.5)};
`
const HeaderTextWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
`

const HeaderLeft = styled.div`
  height: inherit;
  display: flex;
  margin-right: ${props => responsiveDimension(1)};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const MenuMiddleIconWrapper = styled.div`
  width: auto;
  height: inherit;
  display: flex;
  align-items: center;
`
const Icon = styled.img`
  height: 40%;
`
const QtyTokensWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const QtyTokens = styled.span`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(1.8)};
  color: #ffffff;
`
const HeaderLeftLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  border-radius: 50%;
  border: ${props => responsiveDimension(0.4)} solid
    ${props => props.borderColor || '#ffffff'};
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.5)};
  background-color: #ffffff;
`
const HeaderRight = styled.div`
  width: 100%;
  flex-direction: column;
`
const HeaderTop = styled.div`
  text-align: left;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(4.5)};
  color: ${props => props.color || '#ffffff'};
  padding-left: ${props => responsiveDimension(1.7)};
  height: ${props => responsiveDimension(6.9)};
  text-transform: uppercase;
  padding-top: ${props => responsiveDimension(1)};
`
const HeaderTextBig = styled.div`
  text-align: left;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(4.5)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: 1;
`

const HeaderBottom = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`
const HeaderBottomLeft = styled.div`
  width: 100%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.8)};
  color: #ffffff;
  text-align: left;
  padding-left: ${props => responsiveDimension(1.7)};
  text-transform: uppercase;
  padding-bottom: ${props => responsiveDimension(2)};
  line-height: 1;
`
const HeaderTextSmall = styled.div`
  width: 65%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.8)};
  color: #ffffff;
  text-align: left;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  overflow: hidden;
`
const HeaderTextSmallNowrap = styled.div`
  white-space: nowrap;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`
const HeaderBottomRight = styled.div`
  width: 45%;
  display: flex;
  flex-direction: row;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.4)};
  color: #ffffff;
  padding-top: ${props => responsiveDimension(2)};
`
const HeaderLabelQty = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`
const HeaderLabelPts = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: ${props => responsiveDimension(3)};
`

const Content = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 78%;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  &::-webkit-scrollbar {
    width: ${props => responsiveDimension(0.1)};
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
  }
`
const ContentType = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Footer = styled.div`
  display: flex;

  align-items: center;

  width: 100%;
  color: #ffffff;
  background-color: #000000;
  //height: ${props => responsiveDimension(11.8)};
  height: 10%;
  padding-left: ${props => responsiveDimension(1.7)};
  padding-right: ${props => responsiveDimension(1.7)};
`
const FooterLeft = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
`
const FooterLeftLink = styled.div`
  display: inline-flex;
  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`
const FooterLeftLinkText = styled.span`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(3.5)};
  padding-right: ${props => responsiveDimension(1)};
`
const FooterLeftLinkArrow = styled.img`
  width: ${props => responsiveDimension(2.4)};
`
const FooterRight = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
`
const FooterRightPoints = styled.span`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(5)};
  color: #ffffff;
`
const FooterRightPointsLabel = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.5)};
  color: #18c5ff;
  //padding-left: ${props => responsiveDimension(1.7)};
  //height: ${props => responsiveDimension(3.8)};
  padding-top: ${props => responsiveDimension(1.4)};
`

const TokenWrapper = styled.div`
  height: 100%;
  margin-left: ${props => responsiveDimension(0.4)};
  margin-top: ${props => responsiveDimension(0.2)};
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

const InnerImageWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 2%;
`
const InnerImage = styled.img`
  height: 60%;
`

/**
 * Points Component
 */
@inject('ProfileStore')
@observer
class PointsComponent extends Component {
  render() {
    let { profile } = this.props.ProfileStore

    return (
      <PointsCompContainer>
        <PointsLabel>{profile.currencies.points}</PointsLabel>
      </PointsCompContainer>
    )
  }
}

const PointsCompContainer = styled.div``

const PointsLabel = styled.span`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(5)};
  color: #ffffff;
`

PrizeBoardNav.propTypes = {
  item: PropTypes.shape({
    boardName: PropTypes.string.isRequired,
    boardTypeId: PropTypes.string.isRequired,
    seasonGroup: PropTypes.string.isRequired,
  }),
  itemCount: PropTypes.number.isRequired,
  handleClickNextTabFromPrizeBoard: PropTypes.func.isRequired,
}
