import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import token from '@/assets/images/playalong-token.svg'
import TokenIcon from '@/assets/images/playalong-token.svg'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import PurchaseView from '@/Components/PurchaseTokens/PurchaseView'
import Footer from '@/Components/Common/Footer'
import ActivityLoader from '@/Components/Common/ActivityLoader'
import MenuBanner from '@/Components/Common/MenuBanner'
import AuthSequence from '@/Components/Auth'
import { getPurchaseToken } from '../Auth/GoogleAnalytics'
@inject(
  'ProfileStore',
  'NavigationStore',
  'StarBoardStore',
  'PurchaseTokensStore',
  'AnalyticsStore'
)
@observer
export default class PurchaseTokens extends Component {
  constructor(props) {
    super(props)
  }

  handleCancel(key) {
    this.props.NavigationStore.removeSubScreen(key)
  }

  handlePurchaseView(item) {
    getPurchaseToken('SELECT_ITEM', item) /// get token click GA
    let comp = <PurchaseView item={item} />
    this.props.NavigationStore.addSubScreen(comp, 'PurchaseTokens-PurchaseView')
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({
      page: 'PurchaseTokens',
      isMainPage: true,
    })
    this.props.NavigationStore.setActiveMenu(null)
    this.props.NavigationStore.resetSubScreens()
    if (this.props.toGameState) {
      this.props.toGameState()
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({
      page: 'PurchaseTokens',
      isMainPage: true,
    })
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )
    //if (this.props.ProfileStore.profile.userId && (!this.props.PurchaseTokensStore.values || (this.props.PurchaseTokensStore.values && this.props.PurchaseTokensStore.values.length < 1))) {
    this.props.PurchaseTokensStore.getData({
      userId: this.props.ProfileStore.profile.userId,
      groupId: this.props.ProfileStore.profile.groupId,
    })
    //}
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'PurchaseTokens',
      isMainPage: true,
      isUnload: true,
    })
  }

  handleIsLoggedIn(next) {
    if (next) {
      this.componentDidMount()
      this.forceUpdate()
    }
  }

  render() {
    let { ProfileStore, PurchaseTokensStore } = this.props

    if (!ProfileStore.profile.userId) {
      return (
        <Container>
          <AuthSequence mainHandleLoggedIn={this.handleIsLoggedIn.bind(this)} />
        </Container>
      )
    }

    // if (isPurchaseTokensLoading) {
    //   return (
    //     <ActivityLoader backgroundColor={'transparent'} message="loading required data..."/>
    //   )
    // }

    if (
      !PurchaseTokensStore.values ||
      (PurchaseTokensStore.values && PurchaseTokensStore.values.length < 1)
    ) {
      return (
        <Container>
          <Wrapper>
            <MenuBanner
              bannerReference={ref => (this.banner = ref)}
              backgroundColor={'#ffb600'}
              icon={`playalong-token.svg`}
              //iconBackgroundColor={'#000'}
              iconBorderColor={'#ffffff'}
              sizeContain="contain"
              text=""
            />
          </Wrapper>
        </Container>
      )
    }

    return (
      <Container>
        {this.props.NavigationStore.subScreens.map(comp => {
          return comp
        })}
        <Wrapper>
          <MenuBanner
            bannerReference={ref => (this.banner = ref)}
            backgroundColor={'#ffb600'}
            icon={`playalong-token.svg`}
            //iconBackgroundColor={'#000'}
            iconBorderColor={'#ffffff'}
            sizeContain="contain"
            text=""
          />
          <Contents>
            <TokenImageCircle src={TokenIcon} />

            <Section
              heightInPct="30"
              alignItems="center"
              style={{ position: 'relative' }}
            >
              <Section widthInPct="63">
                <Cell
                  widthInPct="60"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CellBottom paddingBottomInPct="15">
                    <CenterRow>
                      <TextWrapperRow marginBottom={-0.5}>
                        <Text
                          font="pamainextrabold"
                          color={'#ffffff'}
                          size="3.8"
                          nospacing
                        >
                          {PurchaseTokensStore.values[4].tokens}
                        </Text>
                        <Text
                          font="pamainlight"
                          color={'#ffb600'}
                          size="3.8"
                          nospacing
                        >
                          &nbsp;TOKENS
                        </Text>
                      </TextWrapperRow>
                      <TextWrapperRow>
                        <Text
                          font="pamainextrabold"
                          color={'#ffffff'}
                          size="2.6"
                          nospacing
                        >
                          +{PurchaseTokensStore.values[4].bonusTokens}
                        </Text>
                        <Text
                          font="pamainlight"
                          color={'#FFFFFF'}
                          size="2.6"
                          nospacing
                        >
                          &nbsp;BONUS TOKENS
                        </Text>
                      </TextWrapperRow>
                    </CenterRow>
                  </CellBottom>
                </Cell>
                <Cell
                  widthInPct="40"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CellBottom paddingBottomInPct="5">
                    <TokenImage
                      src={PurchaseTokensStore.values[4].image}
                      height={14}
                    />
                  </CellBottom>
                </Cell>
              </Section>
              <PurchaseButtonSection style={{ top: '50%' }}>
                <Cell widthInPct="100"></Cell>
                <Cell widthInPct="100" direction="column" alignItems="center">
                  <Text
                    font="pamainregular"
                    color={'#ffffff'}
                    size="4.2"
                    nospacing
                    style={{ marginBottom: responsiveDimension(0.5) }}
                  >
                    &nbsp;${PurchaseTokensStore.values[4].price}
                  </Text>
                  <PurchaseButton
                    id={`purchasetokens-button-${PurchaseTokensStore.values[4].model}`}
                    color="#ffffff"
                    onClick={this.handlePurchaseView.bind(
                      this,
                      PurchaseTokensStore.values[4]
                    )}
                  />
                </Cell>
              </PurchaseButtonSection>
            </Section>

            {/*
            <Section heightInPct="30" justifyContent="center">
              <Cell widthInPct="35" justifyContent="center" alignItems="center" id="first-tokens" style={{backgroundColor:'rgba(255,185,0,0.3)'}}>
                <CellBottom paddingBottomInPct="20">
                  <CenterRow>
                    <TextWrapperRow marginBottom={-0.5}>
                      <Text font="pamainextrabold" color={'#ffffff'} size="3.9" nospacing>{PurchaseTokensStore.values[4].tokens}</Text>
                      <Text font="pamainlight" color={'#ffb600'} size="3.9" nospacing>&nbsp;TOKENS</Text>
                    </TextWrapperRow>
                    <TextWrapperRow>
                      <Text font="pamainextrabold" color={'#ffffff'} size="2.7" nospacing>+{PurchaseTokensStore.values[4].bonusTokens}</Text>
                      <Text font="pamainlight" color={'#FFFFFF'} size="2.7" nospacing>&nbsp;BONUS TOKENS</Text>
                    </TextWrapperRow>
                  </CenterRow>
                </CellBottom>
              </Cell>
              <Cell widthInPct="25" justifyContent="center" alignItems="center" style={{backgroundColor:'rgba(255,185,0,0.2)'}}>
                <CellBottom paddingBottomInPct={10}>
                  <TokenImage src={evalImage(PurchaseTokensStore.values[4].image)} height={20}/>
                </CellBottom>
              </Cell>
              <Cell widthInPct="25" alignItems="center" style={{backgroundColor:'rgba(255,185,0,0.1)'}}>
                <CellBottom paddingBottomInPct="15">
                  <Text font="pamainregular" color={'#ffffff'} size="4.4" style={{marginBottom: responsiveDimension(0.5)}}>&nbsp;${PurchaseTokensStore.values[4].price}</Text>
                  <PurchaseButton color="#ffffff" onClick={this.handlePurchaseView.bind(this, PurchaseTokensStore.values[0])} />
                </CellBottom>
              </Cell>
            </Section>
*/}
            {/*
            <Section heightInPct="30" justifyContent="space-between">
              <Cell widthInPct="40" id="first-tokens">
                <CellBottom paddingBottomInPct="20">
                  <CenterRow>
                    <TextWrapperRow marginBottom={-0.5}>
                      <Text font="pamainextrabold" color={'#ffffff'} size="3.9" nospacing>{PurchaseTokensStore.values[4].tokens}</Text>
                      <Text font="pamainlight" color={'#ffb600'} size="3.9" nospacing>&nbsp;TOKENS</Text>
                    </TextWrapperRow>
                    <TextWrapperRow>
                      <Text font="pamainextrabold" color={'#ffffff'} size="2.7" nospacing>+{PurchaseTokensStore.values[4].bonusTokens}</Text>
                      <Text font="pamainlight" color={'#FFFFFF'} size="2.7" nospacing>&nbsp;BONUS TOKENS</Text>
                    </TextWrapperRow>
                  </CenterRow>
                </CellBottom>
              </Cell>
              <Cell widthInPct="30" justifyContent="center" alignItems="center">
                <CellBottom paddingBottomInPct={10}>
                  <TokenImage src={evalImage(PurchaseTokensStore.values[4].image)} height={20}/>
                </CellBottom>
              </Cell>
              <Cell widthInPct="30">
                <CellBottom paddingBottomInPct="15">
                  <Text font="pamainregular" color={'#ffffff'} size="4.4" style={{marginBottom: responsiveDimension(0.5)}}>${PurchaseTokensStore.values[4].price}</Text>
                  <PurchaseButton color="#ffffff" onClick={this.handlePurchaseView.bind(this, PurchaseTokensStore.values[4])} />
                </CellBottom>
              </Cell>
            </Section>
*/}

            <Section heightInPct="40" justifyContent="space-between">
              <Section backgroundColor={'#ffffff'}>
                <Cell id="second-tokens" widthInPct="100">
                  <CellBottom paddingBottomInPct="6">
                    <TokenImage
                      src={PurchaseTokensStore.values[3].image}
                      height={11}
                    />
                    <CenterRow>
                      <TextWrapperRow marginTop={1} marginBottom={-0.5}>
                        <Text
                          font="pamainextrabold"
                          color={'#000000'}
                          size="3.8"
                          nospacing
                        >
                          {PurchaseTokensStore.values[3].tokens}
                        </Text>
                        <Text
                          font="pamainlight"
                          color={'#ffb600'}
                          size="3.8"
                          nospacing
                        >
                          &nbsp;TOKENS
                        </Text>
                      </TextWrapperRow>
                      <TextWrapperRow>
                        <Text
                          font="pamainextrabold"
                          color={'#000000'}
                          size="2.6"
                          nospacing
                        >
                          +{PurchaseTokensStore.values[3].bonusTokens}
                        </Text>
                        <Text
                          font="pamainlight"
                          color={'#000000'}
                          size="2.6"
                          nospacing
                        >
                          &nbsp;BONUS TOKENS
                        </Text>
                      </TextWrapperRow>
                    </CenterRow>
                    <TextWrapperRow marginTop={1}>
                      <Text
                        font="pamainregular"
                        color={'#000000'}
                        size="4.2"
                        nospacing
                        style={{ marginBottom: responsiveDimension(0.5) }}
                      >
                        ${PurchaseTokensStore.values[3].price}
                      </Text>
                    </TextWrapperRow>
                    <TextWrapperRow marginTop={1}>
                      <PurchaseButton
                        id={`purchasetokens-button-${PurchaseTokensStore.values[3].model}`}
                        color="#000000"
                        onClick={this.handlePurchaseView.bind(
                          this,
                          PurchaseTokensStore.values[3]
                        )}
                      />
                    </TextWrapperRow>
                  </CellBottom>
                </Cell>
              </Section>
              <Section backgroundColor={'#808285'}>
                <Cell id="third-tokens" widthInPct="100">
                  <CellBottom paddingBottomInPct="6">
                    <TokenImage
                      src={PurchaseTokensStore.values[2].image}
                      height={8}
                    />
                    <CenterRow>
                      <TextWrapperRow marginTop={1} marginBottom={-0.5}>
                        <Text
                          font="pamainextrabold"
                          color={'#ffffff'}
                          size="3.8"
                          nospacing
                        >
                          {PurchaseTokensStore.values[2].tokens}
                        </Text>
                        <Text
                          font="pamainlight"
                          color={'#ffb600'}
                          size="3.8"
                          nospacing
                        >
                          &nbsp;TOKENS
                        </Text>
                      </TextWrapperRow>
                      <TextWrapperRow>
                        <Text
                          font="pamainextrabold"
                          color={'#ffffff'}
                          size="2.6"
                          nospacing
                        >
                          +{PurchaseTokensStore.values[2].bonusTokens}
                        </Text>
                        <Text
                          font="pamainlight"
                          color={'#ffffff'}
                          size="2.6"
                          nospacing
                        >
                          &nbsp;BONUS TOKENS
                        </Text>
                      </TextWrapperRow>
                    </CenterRow>
                    <TextWrapperRow marginTop={1}>
                      <Text
                        font="pamainregular"
                        color={'#ffffff'}
                        size="4.2"
                        nospacing
                        style={{ marginBottom: responsiveDimension(0.5) }}
                      >
                        ${PurchaseTokensStore.values[2].price}
                      </Text>
                    </TextWrapperRow>
                    <TextWrapperRow marginTop={1}>
                      <PurchaseButton
                        id={`purchasetokens-button-${PurchaseTokensStore.values[2].model}`}
                        color="#ffffff"
                        onClick={this.handlePurchaseView.bind(
                          this,
                          PurchaseTokensStore.values[2]
                        )}
                      />
                    </TextWrapperRow>
                  </CellBottom>
                </Cell>
              </Section>
            </Section>

            <Section
              heightInPct="15"
              alignItems="center"
              backgroundColor={'#414042'}
            >
              <Section widthInPct="63">
                <Cell
                  widthInPct="50"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CenterRow>
                    <TextWrapperRow marginBottom={-0.5}>
                      <Text
                        font="pamainextrabold"
                        color={'#ffffff'}
                        size="3.8"
                        nospacing
                      >
                        {PurchaseTokensStore.values[1].tokens}
                      </Text>
                      <Text
                        font="pamainlight"
                        color={'#ffb600'}
                        size="3.8"
                        nospacing
                      >
                        &nbsp;TOKENS
                      </Text>
                    </TextWrapperRow>
                    <TextWrapperRow>
                      <Text
                        font="pamainextrabold"
                        color={'#ffffff'}
                        size="2.6"
                        nospacing
                      >
                        +{PurchaseTokensStore.values[1].bonusTokens}
                      </Text>
                      <Text
                        font="pamainlight"
                        color={'#FFFFFF'}
                        size="2.6"
                        nospacing
                      >
                        &nbsp;BONUS TOKENS
                      </Text>
                    </TextWrapperRow>
                  </CenterRow>
                </Cell>
                <Cell
                  widthInPct="20"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TokenImage
                    src={PurchaseTokensStore.values[1].image}
                    height={8}
                  />
                </Cell>
                <Cell
                  widthInPct="30"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Text
                    font="pamainregular"
                    color={'#ffffff'}
                    size="4.2"
                    nospacing
                    style={{ marginBottom: responsiveDimension(0.5) }}
                  >
                    &nbsp;${PurchaseTokensStore.values[1].price}
                  </Text>
                </Cell>
              </Section>
              <PurchaseButtonSection>
                <Cell widthInPct="100"></Cell>
                <Cell widthInPct="100" justifyContent="center">
                  <PurchaseButton
                    id={`purchasetokens-button-${PurchaseTokensStore.values[1].model}`}
                    color="#ffffff"
                    onClick={this.handlePurchaseView.bind(
                      this,
                      PurchaseTokensStore.values[1]
                    )}
                  />
                </Cell>
              </PurchaseButtonSection>
            </Section>

            <Section
              heightInPct="15"
              alignItems="center"
              backgroundColor={'#191919'}
            >
              <Section widthInPct="63">
                <Cell
                  widthInPct="50"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CenterRow>
                    <TextWrapperRow marginBottom={-0.5}>
                      <Text
                        font="pamainextrabold"
                        color={'#ffffff'}
                        size="3.8"
                        nospacing
                      >
                        {PurchaseTokensStore.values[0].tokens}
                      </Text>
                      <Text
                        font="pamainlight"
                        color={'#ffb600'}
                        size="3.8"
                        nospacing
                      >
                        &nbsp;TOKENS
                      </Text>
                    </TextWrapperRow>
                    <TextWrapperRow>
                      <Text
                        font="pamainextrabold"
                        color={'#ffffff'}
                        size="2.6"
                        nospacing
                      >
                        +{PurchaseTokensStore.values[0].bonusTokens}
                      </Text>
                      <Text
                        font="pamainlight"
                        color={'#FFFFFF'}
                        size="2.6"
                        nospacing
                      >
                        &nbsp;BONUS TOKENS
                      </Text>
                    </TextWrapperRow>
                  </CenterRow>
                </Cell>
                <Cell
                  widthInPct="20"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TokenImage
                    src={PurchaseTokensStore.values[0].image}
                    height={6}
                  />
                </Cell>
                <Cell
                  widthInPct="30"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Text
                    font="pamainregular"
                    color={'#ffffff'}
                    size="4.2"
                    nospacing
                    style={{ marginBottom: responsiveDimension(0.5) }}
                  >
                    &nbsp;${PurchaseTokensStore.values[0].price}
                  </Text>
                </Cell>
              </Section>
              <PurchaseButtonSection>
                <Cell widthInPct="100"></Cell>
                <Cell widthInPct="100" justifyContent="center">
                  <PurchaseButton
                    id={`purchasetokens-button-${PurchaseTokensStore.values[0].model}`}
                    color="#ffffff"
                    onClick={this.handlePurchaseView.bind(
                      this,
                      PurchaseTokensStore.values[0]
                    )}
                  />
                </Cell>
              </PurchaseButtonSection>
            </Section>
          </Contents>
          <Bottom>
            <Footer />
          </Bottom>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
`

const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => responsiveDimension(1.4)};
  display: flex;
  flex-direction: row;
  z-index: 100;
`
const BannerText = styled.div`
  margin-top: ${props => vhToPx(1)};
  font-size: ${props => responsiveDimension(5)};
  font-family: pamainlight;
  color: #ffb600;
  text-transform: uppercase;
  &:before {
    content: '';
  }
`

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${props => responsiveDimension(5)};
  height: ${props => responsiveDimension(8.5)};
  background-color: ${props => props.backgroundColor};
  margin-left: ${props => responsiveDimension(1.5)};
  position: relative;
  border-bottom-left-radius: ${props => responsiveDimension(5)};
  border-bottom-right-radius: ${props => responsiveDimension(5)};
  animation: ${props => backBanner} 0.75s forwards;
`

const backBanner = keyframes`
  0%{height: ${responsiveDimension(1)};}
  50%{height: ${responsiveDimension(9.5)};}
  100%{height: ${props => responsiveDimension(8.5)};}
`

const Icon = styled.div`
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  border-radius: ${props => responsiveDimension(4.5)};
  background-color: ${props => props.backgroundColor};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;

  margin-left: ${props => responsiveDimension(0.1)};
  margin-bottom: ${props => responsiveDimension(0.3)};
  border: ${props => `${responsiveDimension(0.4)} solid #ffffff`};
`

const Contents = styled.div`
  width: inherit;
  height: 90%;
  display: flex;
  flex-direction: column;
`

const Section = styled.div`
  width: ${props => props.widthInPct || 100}%;
  height: ${props => props.heightInPct || 100}%;
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.paddingLeft ? `padding-left:${props.paddingLeft}%` : ``)};
  ${props =>
    props.paddingRight ? `padding-right:${props.paddingRight}%` : ``};
`

const Cell = styled.div`
  ${props => (props.widthInPct ? `width:${props.widthInPct}%` : ``)};
  height: 100%;
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginLeft ? `margin-left:${props.marginLeft}%` : ``)};
  ${props => (props.marginRight ? `margin-right:${props.marginRight}%` : ``)};
  position: relative;
`

const CellBottom = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: ${props => props.paddingBottomInPct || 0}%;
`

const CenterRow = styled.div`
  display: flex;
  flex-direction: column;
`

const TokenImage = styled.img`
  height: ${props => responsiveDimension(props.height)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom)};
  pointer-events: none;
`

const Bottom = styled.div`
  width: 100%;
  height: 10%;
`

const SummaryWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 3%;
  padding-right: 3%;

  position: relative;
`

const SummarySection = styled.div`
  display: flex;
  flex-direction: row;
`

const SummaryInner = styled.div`
  display: flex;
  flex-direction: row;
`

const PointLabelWrapper = styled.div`
  //padding-top: ${props => responsiveDimension(2)};
`

const TokensLabelWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-top: 7%;
`
const TokenWrapper = styled.div`
  height: 100%;
  margin-right: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.1)};
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

const ProfilePoints = styled.span`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(5)};
  color: #ffffff;
  line-height: 0.9;
  height: ${props => responsiveDimension(5 * 0.8)};
`
const ProfilePointsLabel = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  color: #17c5ff;
  margin-left: ${props => responsiveDimension(0.6)};
  line-height: 0.8;
  height: ${props => responsiveDimension(3 * 0.8)};
  align-self: flex-end;
`

const ProfileTokens = styled.span`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(3)};
  color: #edbf00;
  line-height: 0.9;
  height: ${props => responsiveDimension(3 * 0.8)};
`

const TextWrapperRow = styled.div`
  //text-align: center;
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
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
`

const PurchaseButton = styled.div`
  width: ${props => responsiveDimension(13)};
  height: ${props => responsiveDimension(5.5)};
  border: ${props => `${responsiveDimension(0.25)} solid ${props.color}`};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:after {
    content: 'PURCHASE';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(5.5 * 0.4)};
    color: ${props => props.color || '#000000'};
    text-transform: uppercase;
    letter-spacing: ${props => responsiveDimension(0.1)};
    line-height: 1;
  }
  ${props => (props.marginLeft ? `margin-left:${props.marginLeft}%` : ``)};
  ${props => (props.marginRight ? `margin-right:${props.marginRight}%` : ``)};
`

const TokenAmount = styled.span`
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
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
`

const TokenImageCircle = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(7)};
  height: ${props => responsiveDimension(7)};
  min-width: ${props => responsiveDimension(7)};
  min-height: ${props => responsiveDimension(7)};
  border-radius: 50%;
  background-color: #000000;
  left: 50%;
  top: 23.5%;
  transform: translateX(-50%);
  z-index: 50;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 94%;
    background-position: center;
  }
`

const PurchaseButtonSection = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const Star = styled.div`
  width: ${props => responsiveDimension(9)};
  height: ${props => responsiveDimension(9)};
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(4.3)};
  color: ${props => props.color};
  padding-top: ${props => responsiveDimension(1)};

  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 75%;
  background-position: center;

  margin-right: ${props => responsiveDimension(1)};
`

@inject('ProfileStore')
@observer
class StarCounter extends Component {
  render() {
    let { profile } = this.props.ProfileStore

    if (
      !profile.currencies ||
      (profile.currencies && profile.currencies.stars == 'undefined') ||
      (profile.currencies && profile.currencies.stars == null)
    ) {
      return (
        <Star src={StarIcon} font={'pamainextrabold'}>
          {0}
        </Star>
      )
    }

    return (
      <Star
        src={StarIcon}
        color={'#231f20'}
        font={
          profile.currencies.stars.toString().length == 1
            ? 'pamainextrabold'
            : profile.currencies.stars.toString().length == 2
            ? 'pamainbold'
            : profile.currencies.stars.toString().length == 3
            ? 'pamainregular'
            : 'pamainlight'
        }
      >
        {profile.currencies['stars']}
      </Star>
    )
  }
}
