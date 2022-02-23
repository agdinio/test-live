import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import token from '@/assets/images/playalong-token.svg'
import key from '@/assets/images/menu-key-icon.svg'
import { TimelineMax, Back } from 'gsap'
import Background from '@/assets/images/playalong-default.jpg'
import iconProfile from '@/assets/images/icon-profile.svg'
import iconVerifiedViewed from '@/assets/images/input_feld-verified-viewed.svg'
import { vhToPx } from '@/utils'
import { ProgressThermo } from '@/Components/Common/ProgressThermo'
import LoginFirst from '@/Components/Common/LoginFirst'

@inject('ShareStatusStore', 'ProfileStore', 'CommonStore', 'NavigationStore')
@observer
export default class Wallet extends Component {
  constructor(props) {
    super(props)
    //this.props.ShareStatusStore.pullInvitees()
    //this.props.CommonStore.getKeySharedCredits()

    // if (!this.props.ProfileStore.profile.userName) {
    //   this.props.ProfileStore.getProfile()
    // }
  }

  handleIsLoggedIn(response) {
    if (response) {
      setTimeout(() => {
        this.props.ShareStatusStore.pullInvitees()
        this.props.CommonStore.getKeySharedCredits()
        this.props.ProfileStore.getProfile()
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.props.NavigationStore.setActiveMenu(null)
    if (this.props.toGameState) {
      this.props.toGameState()
    }
  }

  componentDidMount() {
    this.props.NavigationStore.setActiveMenu(
      this.props.NavigationStore.location
    )
  }

  render() {
    let { invitees } = this.props.ShareStatusStore
    let { profile, err } = this.props.ProfileStore
    let { keySharedCredits } = this.props.CommonStore

    if (err) {
      return (
        <Container>
          <LoginFirst handleIsLoggedIn={this.handleIsLoggedIn.bind(this)} />
        </Container>
      )
    }

    if (
      (this.props.ProfileStore.isLoading && !err) ||
      this.props.CommonStore.isLoading ||
      this.props.ShareStatusStore.isLoading
    ) {
      return (
        <Container>
          <Wrapper>
            <DropDownBannerContainer>
              <BannerText />
              <Banner innerRef={ref => (this.banner = ref)}>
                <Icon src={token} />
              </Banner>
            </DropDownBannerContainer>
          </Wrapper>
        </Container>
      )
    }

    debugger
    //let sharedKeyPoints = invitees.length * 5000
    //let sharedKeyTokens = invitees.length * 50
    let keySharedCreditKeyUsedCount = keySharedCredits['keyUsedCount']
    let keySharedCreditPoints = keySharedCredits['points']
    let keySharedCreditTokens = keySharedCredits['tokens']

    let totalPoints = profile.currencies['points'] + keySharedCreditPoints
    let totalTokens = profile.currencies['tokens'] + keySharedCreditTokens

    return (
      <Container>
        <Wrapper>
          <DropDownBannerContainer>
            <BannerText />
            <Banner innerRef={ref => (this.banner = ref)}>
              <Icon src={token} />
            </Banner>
          </DropDownBannerContainer>
          <Contents>
            <Top>
              <TopContent>
                <TopLeft>
                  <ViewedIcon src={iconVerifiedViewed} />
                </TopLeft>
                <TopRight>
                  <Text
                    font={'pamainlight'}
                    size={3.5}
                    color={'#ffffff'}
                    style={{ paddingBottom: '5%' }}
                  >
                    viewed
                  </Text>
                  <PrivatePointsTokens
                    tokens={profile.currencies['tokens']}
                    points={profile.currencies['points']}
                  />
                </TopRight>
              </TopContent>
              <Divider />
            </Top>
            <Middle>
              <MiddleContent>
                <MiddleContentLeft>
                  <KeyIcon src={key} />
                </MiddleContentLeft>
                <MiddleContentRight>
                  <TextWrapper>
                    <AlignWrapper style={{ paddingBottom: '5%' }}>
                      <Text font={'pamainextrabold'} size={3.5}>
                        {keySharedCreditKeyUsedCount}
                        &nbsp;
                      </Text>
                      <Text font={'pamainlight'} size={3.5}>
                        shared&nbsp;
                      </Text>
                      <Text
                        font={'pamainextrabold'}
                        size={3.5}
                        color={'#19d1be'}
                      >
                        keys&nbsp;
                      </Text>
                      <Text font={'pamainlight'} size={3.5}>
                        used
                      </Text>
                    </AlignWrapper>
                  </TextWrapper>
                  <PrivatePointsTokens
                    points={keySharedCreditPoints}
                    tokens={keySharedCreditTokens}
                  />
                </MiddleContentRight>
              </MiddleContent>
              <Divider />
            </Middle>
            <Bottom>
              <BottomHeader>
                <TextWrapper>
                  <Text font={'pamainregular'} size={3.3}>
                    use your&nbsp;
                  </Text>
                  <Text font={'pamainregular'} size={3.3} color={'#16c5ff'}>
                    points&nbsp;
                  </Text>
                  <Text font={'pamainregular'} size={3.3}>
                    &&nbsp;
                  </Text>
                  <Text font={'pamainregular'} size={3.3} color={'#ffb600'}>
                    tokens
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainregular'} size={3.3}>
                    at the&nbsp;
                  </Text>
                  <Text
                    font={'pamainextrabold'}
                    size={3.3}
                    color={'#ec1c23'}
                    letterSpacing={0}
                  >
                    live events
                  </Text>
                </TextWrapper>
              </BottomHeader>
              <BottomContent>
                <BottomContentLeft>
                  <Text font={'pamainextrabold'} size={3.5}>
                    total:
                  </Text>
                </BottomContentLeft>
                <BottomContentRight>
                  <TextWrapper>
                    <Text
                      font={'pamainlight'}
                      size={3.5}
                      color={'#929497'}
                      style={{ paddingBottom: vhToPx(0.5) }}
                    >
                      view + key bonuses
                    </Text>
                  </TextWrapper>
                  <PrivatePointsTokensWrapper>
                    <PrivatePointsTokens
                      points={totalPoints}
                      tokens={totalTokens}
                    />
                  </PrivatePointsTokensWrapper>
                </BottomContentRight>
              </BottomContent>
            </Bottom>
          </Contents>
        </Wrapper>
      </Container>
    )

    /*
    if (
      this.props.ShareStatusStore.isLoading ||
      this.props.CommonStore.isLoading
    ) {
      return <Container>
        <Wrapper>
          <DropDownBannerContainer>
            <BannerText />
            <Banner innerRef={ref => (this.banner = ref)}>
              <Icon src={token} />
            </Banner>
          </DropDownBannerContainer>
        </Wrapper>
      </Container>
    } else {
    }
*/
  }
}

const backBanner = keyframes`
  0%{height: ${vhToPx(1)};}
  50%{height: ${vhToPx(9.5)};}
  100%{height: ${props => vhToPx(8.5)};}
`
const fadeincontents = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Container = styled.div`
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`

const Wrapper = styled.div`
  width: inherit;
  height: inherit;
  padding-top: ${props => vhToPx(10)};
  display: flex;
  flex-direction: column;
  position: absolute;
`

const DropDownBannerContainer = styled.div`
  position: absolute;
  top: 0;
  right: ${props => vhToPx(1.4)};
  display: flex;
  flex-direction: row;
`
const BannerText = styled.div`
  margin-top: ${props => vhToPx(1)};
  font-size: ${props => vhToPx(5)};
  font-family: pamainlight;
  color: #ffb600;
  text-transform: uppercase;
  &:before {
    content: 'tokens & points';
  }
`

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(8.5)};
  background-color: #ffb600;
  margin-left: ${props => vhToPx(1.5)};
  position: relative;
  border-bottom-left-radius: ${props => vhToPx(5)};
  border-bottom-right-radius: ${props => vhToPx(5)};
  animation: ${props => backBanner} 0.75s forwards;
`

const Icon = styled.div`
  width: ${props => vhToPx(4.5)};
  height: ${props => vhToPx(4.5)};
  border-radius: ${props => vhToPx(4.5)};
  background-color: #ffffff;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 80%;
  background-position: center;

  margin-left: ${props => vhToPx(0.1)};
  margin-bottom: ${props => vhToPx(0.3)};
`

const KeyIcon = styled.div`
  width: ${props => vhToPx(7)};
  height: ${props => vhToPx(7)};
  border-radius: ${props => vhToPx(7)};
  border: ${props => vhToPx(0.2)} solid #19d1be;
  background-color: #000000;
  margin-left: ${props => vhToPx(0.2)};
  &:after {
    content: '';
    width: ${props => vhToPx(7)};
    height: ${props => vhToPx(7)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    display: block;
    margin-top: -5%;
    margin-left: -6%;
  }
`

const ViewedIcon = styled.div`
  width: ${props => vhToPx(7)};
  height: ${props => vhToPx(7)};
  margin-right: ${props => vhToPx(0.5)};
  &:after {
    content: '';
    width: ${props => vhToPx(7)};
    height: ${props => vhToPx(7)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    display: block;
  }
`

const Contents = styled.div`
  opacity: 0;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-self: center;
  animation: ${props => fadeincontents} forwards 0.75s;
`

const Top = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: ${props => vhToPx(7)};
`
const TopContent = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-between;
`
const TopLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`

const Middle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  margin-top: ${props => vhToPx(1)};
`
const MiddleContent = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-between;
`
const MiddleContentLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`
const MiddleContentRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`
const ProgressBarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${props => vhToPx(7)};
`

const Bottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: ${props => vhToPx(1)};
`
const BottomHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 ${props => vhToPx(5)} 0;
`
const BottomContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const BottomContentLeft = styled.div`
  display: flex;
`
const BottomContentRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`

const PrivatePointsTokensWrapper = styled.div`
  transform: scale(1.2);
  transform-origin: right;
  margin-top: 4%;
`
const Divider = styled.div`
  width: 100%;
  height: ${props => vhToPx(0.3)};
  background-color: grey;
  margin-top: ${props => vhToPx(4)};
  margin-bottom: ${props => vhToPx(4)};
  display: flex;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  //line-height: 0.9;
  ${props => (props.paddingTop ? `padding-top: ${props.paddingTop}%;` : ``)};
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => vhToPx(props.size)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  letter-spacing: ${props => vhToPx(props.letterSpacing || 0.1)};
`

const TokensPointsWrapperSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`

const TokensPointsNum = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height 0.9;
`

const TokensPointsText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 5%;
`

const AlignWrapper = styled.div`
  text-align: center;
  line-height: 1;
`
const TokenWrapper = styled.div`
  margin-right: ${props => vhToPx(0.5)};
  margin-bottom: ${props => vhToPx(0.4)};
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Token = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props =>
    props.adjustWidth ? vhToPx(props.size + 0.1) : vhToPx(props.size)};
  height: ${props => vhToPx(props.size)};
  z-index: ${props => props.index};
`
const Faded = styled.div`
  width: ${props => vhToPx(props.size)};
  height: ${props => vhToPx(props.size)};
  border-radius: ${props => vhToPx(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => vhToPx(props.left)};
  z-index: ${props => props.index};
`

const PrivatePointsTokens = props => {
  return (
    <TokensPointsWrapperSpaceBetween>
      <TokensPointsNum>
        <TextWrapper>
          <TokenWrapper>
            <Token src={token} size={2.9} index={3} />
            <Faded index={2} size={2.9} color={'#6d6c71'} left={-2.6} />
            <Faded index={1} size={2.9} color={'#33342f'} left={-2.6} />
          </TokenWrapper>
          <Text font={'pamainextrabold'} size={4} color={'#ffb600'}>
            {props.tokens || 0}
          </Text>
        </TextWrapper>
        <TextWrapper>
          <Text font={'pamainextrabold'} size={4} color={'#16c5ff'}>
            {props.points || 0}
          </Text>
        </TextWrapper>
      </TokensPointsNum>

      <TokensPointsText>
        <TextWrapper paddingTop={9}>
          <Text font={'pamainlight'} size={2.4} paddingTop={10}>
            &nbsp;tokens
          </Text>
        </TextWrapper>
        <TextWrapper paddingTop={4}>
          <Text font={'pamainlight'} size={2.4}>
            &nbsp;points
          </Text>
        </TextWrapper>
      </TokensPointsText>
    </TokensPointsWrapperSpaceBetween>
  )
}
