import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'
import Background from '@/assets/images/playalong-default.jpg'
import StarRedeemEmailIcon from '@/assets/images/starboard/email-icon-dark.svg'
import StarRedeemEmailIconGold from '@/assets/images/starboard/email-icon-gold.svg'
import StarRedeemEmailArrowRightIcon from '@/assets/images/starboard/email-arrow-right-icon-gold.svg'
import StarRedeemSMSIcon from '@/assets/images/starboard/sms-icon-dark.svg'
import StarRedeemSMSIconGold from '@/assets/images/starboard/sms-icon-gold.svg'

import PrizeClaimCloseIcon from '@/assets/images/prizeboard/prizeclaim-lightbox-close.svg'
import AgreedIcon from '@/assets/images/prizeboard/prizeclaim-checked.svg'

@inject('PrizeBoardStore', 'StarBoardStore', 'ProfileStore')
@observer
export default class StarRedeemTerms extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      agreed: false,
      claimed: false,
      lightboxScreen: null,
      scrollingMargin: '12%',
    })
  }

  handleShowTermsClick(item) {
    this.lightboxScreen = (
      <TermsAndConditionsComp
        refAgreeClick={this.handleAgreeClick.bind(this, item, true)}
        refCloseClick={this.handleAgreeCancelClick.bind(this)}
        isClaimed={this.claimed}
      />
    )
    this.toggleLightboxScreen('open')
  }

  handleReadTermsClick(item) {
    this.lightboxScreen = (
      <TermsAndConditionsComp
        refAgreeClick={this.handleAgreeClick.bind(this, item, true)}
        refCloseClick={this.handleAgreeCancelClick.bind(this)}
        isClaimed={this.agreed || this.claimed}
      />
    )
    this.toggleLightboxScreen('open')
  }

  handleAgreeCancelClick() {
    this.toggleLightboxScreen('close')
  }

  handleAgreeClick(item, isAgree) {
    if (isAgree) {
      this.toggleLightboxScreen('close')
      this.props.StarBoardStore.agreeUserPrize(item, true).then(
        updatedPrize => {
          this.refAgreedFalsePanel.style.opacity = 0
          this.refAgreedFalsePanel.style.zIndex = -99
          this.agreed = true
          if (this.props.refUpdatedAgree) {
            this.props.refUpdatedAgree(true)
          }
        }
      )
    } else {
      this.props.StarBoardStore.agreeUserPrize(item, false).then(
        updatedPrize => {
          this.refAgreedFalsePanel.style.opacity = 1
          this.refAgreedFalsePanel.style.zIndex = 99
          this.agreed = false
          if (this.props.refUpdatedAgree) {
            this.props.refUpdatedAgree(false)
          }
        }
      )
    }
  }

  handleAgreeClickXXX(item, res) {
    if (res) {
      this.toggleLightboxScreen('close')
      this.props.StarBoardStore.agreeUserPrize(item, true)
      this.refAgreedFalsePanel.style.opacity = 0
      this.refAgreedFalsePanel.style.zIndex = -99
      this.agreed = true
      if (this.props.refUpdatedAgree) {
        this.props.refUpdatedAgree(true)
      }
    } else {
      if (this.refAgreedFalsePanel) {
        this.props.StarBoardStore.agreeUserPrize(item, false)
        this.refAgreedFalsePanel.style.opacity = 1
        this.refAgreedFalsePanel.style.zIndex = 99
        this.agreed = false
        if (this.props.refUpdatedAgree) {
          this.props.refUpdatedAgree(false)
        }
      }
    }
  }

  handleSendClick(sendType, item) {
    if (sendType === 'e-mail') {
      this.props.StarBoardStore.claimUserPrize(item).then(updatedPrize => {
        if (updatedPrize) {
          if (this.props.refUpdatedUserPrize) {
            this.props.refUpdatedUserPrize(updatedPrize)
          }
        }
      })
      this.claimed = true

      this.lightboxScreen = (
        <SendEmailPopup
          profile={this.props.ProfileStore.profile}
          color={this.props.StarBoardStore.baseColor}
          refPopupClick={this.handlePopupClick.bind(this)}
        />
      )
      this.toggleLightboxScreen('open')
    } else if (sendType === 'sms') {
      console.log('Not yet supported')
    }
  }

  handlePopupClick() {
    this.toggleLightboxScreen('close')
  }

  toggleLightboxScreen(val) {
    if (val === 'open') {
      if (this.refLightboxWrapper) {
        new TimelineMax({ repeat: 0 })
          .set(this.refLightboxWrapper, { zIndex: 100 })
          .to(this.refLightboxWrapper, 0.2, { opacity: 1 })
      }
    } else {
      if (this.refLightboxWrapper) {
        new TimelineMax({ repeat: 0 })
          .set(this.refLightboxWrapper, { zIndex: -100 })
          .to(this.refLightboxWrapper, 0.2, {
            opacity: 0,
            onComplete: () => {
              this.lightboxScreen = null
            },
          })
      }
    }
  }

  toggleFalsePanel(isAgree) {
    if (isAgree) {
      if (this.refAgreedFalsePanel) {
        this.refAgreedFalsePanel.style.opacity = 0
        this.refAgreedFalsePanel.style.zIndex = -99
      }
    } else {
      if (this.refAgreedFalsePanel) {
        this.refAgreedFalsePanel.style.opacity = 1
        this.refAgreedFalsePanel.style.zIndex = 99
      }
    }
  }

  adjustMarginOnScrolling() {
    if (this.refContentScrolling && this.refContent) {
      if (
        this.refContent.offsetHeight > this.refContentScrolling.offsetHeight
      ) {
        this.scrollingMargin = '8%'
      }
    }
  }

  componentDidUpdate(nextProps, nextState) {
    this.adjustMarginOnScrolling()
  }

  componentWillUnmount() {
    if (this.props.refHideBanner) {
      this.props.refHideBanner(false)
    }
  }

  componentDidMount() {
    if (this.props.refHideBanner) {
      this.props.refHideBanner(true)
    }

    this.agreed = this.props.item.agreed
    this.claimed = this.props.item.claimed
    this.toggleFalsePanel(this.agreed)
    this.adjustMarginOnScrolling()
  }

  render() {
    let { profile } = this.props.ProfileStore
    let { item } = this.props
    let { baseColor } = this.props.StarBoardStore

    const uniqueIdentifier = `${item.shortName}-${item.seasonId}${item.boardTypeId}`
    let icon = ''
    try {
      //const imageName = `${this.props.StarBoardStore.url}${item.shortName}-${item.seasonId}${item.boardTypeId}_${item.images[0]}`
      icon = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${item.image}`
    } catch (e) {
      icon = ''
    }

    return (
      <Container claimed={this.claimed} backgroundColor={baseColor}>
        <FadeIn>
          <LightboxWrapper innerRef={ref => (this.refLightboxWrapper = ref)}>
            {this.lightboxScreen}
          </LightboxWrapper>
          <ContentScrolling
            innerRef={ref => (this.refContentScrolling = ref)}
            marginTop={this.scrollingMargin}
          >
            <Content innerRef={ref => (this.refContent = ref)}>
              <Section>
                <ItemImageAndQtyWrapper>
                  <ItemImage
                    src={icon}
                    borderColor={this.claimed ? '#ffffff' : '#000000'}
                  />
                </ItemImageAndQtyWrapper>
              </Section>
              <Section marginTop={4} marginBottom={5}>
                <TextMarquee>
                  <Text
                    font={'pamainbold'}
                    size={7}
                    color={this.claimed ? '#ffffff' : '#000000'}
                    uppercase
                    innerRef={ref => (this[`title-${uniqueIdentifier}`] = ref)}
                  >
                    {item.title}
                  </Text>
                </TextMarquee>
                <Text
                  font={'pamainregular'}
                  size={4.5}
                  color={this.claimed ? '#ffffff' : '#000000'}
                  uppercase
                >
                  {item.subTitle}
                </Text>
              </Section>
              <Section>
                {this.claimed ? (
                  <ClaimedInFullComponent
                    profile={profile}
                    color={baseColor}
                    refReadTermsClick={this.handleReadTermsClick.bind(
                      this,
                      item
                    )}
                  />
                ) : (
                  <ButtonPanel>
                    <AgreedFalsePanel
                      id={`button-starboard-prizeclaimterms-termsandconditions`}
                      innerRef={ref => (this.refAgreedFalsePanel = ref)}
                      onClick={this.handleReadTermsClick.bind(this, item)}
                    />
                    <AgreedTruePanel>
                      <TextWrapper marginBottom={2}>
                        <Text
                          font={'pamainlight'}
                          size={4.5}
                          color={'#000000'}
                          uppercase
                        >
                          send my prize
                        </Text>
                      </TextWrapper>
                      <Buttons>
                        <Button
                          id={`starboard-redeem-button-send-email`}
                          opacity={this.agreed ? 1 : 0.3}
                          text={'e-mail'}
                          borderColor={'#231F20'}
                          color={'#231F20'}
                          hoverColor={baseColor}
                          icon={StarRedeemEmailIcon}
                          hoverIcon={StarRedeemEmailIconGold}
                          onClick={this.handleSendClick.bind(
                            this,
                            'e-mail',
                            item
                          )}
                        />
                        <Button
                          id={`starboard-redeem-button-send-sms`}
                          opacity={this.agreed ? 1 : 0.3}
                          text={'phone'}
                          borderColor={'#231F20'}
                          color={'#231F20'}
                          hoverColor={baseColor}
                          icon={StarRedeemSMSIcon}
                          hoverIcon={StarRedeemSMSIconGold}
                          onClick={this.handleSendClick.bind(this, 'sms', item)}
                        />
                      </Buttons>

                      <TextWrapper marginTop={2}>
                        <AlignWrapper>
                          <Text
                            font={'pamainregular'}
                            size={3.5}
                            color={'#000000'}
                            uppercase
                            nowrap
                          >
                            i agree to the&nbsp;
                          </Text>
                          <UnderlineWrapper
                            onClick={this.handleReadTermsClick.bind(this, item)}
                          >
                            <Text
                              font={'pamainregular'}
                              size={3.5}
                              color={'#000000'}
                              uppercase
                              nowrap
                            >
                              terms & conditions
                            </Text>
                            <Underline backgroundColor={'#000000'} />
                          </UnderlineWrapper>
                          {this.agreed ? (
                            <AgreedTrueIcon
                              src={AgreedIcon}
                              onClick={this.handleAgreeClick.bind(
                                this,
                                item,
                                false
                              )}
                            />
                          ) : (
                            <AgreedFalseIcon />
                          )}
                        </AlignWrapper>
                      </TextWrapper>
                    </AgreedTruePanel>
                  </ButtonPanel>
                )}
              </Section>
            </Content>
          </ContentScrolling>
          <Bottom>
            <Text
              font={'pamainregular'}
              size={3.5}
              color={this.claimed ? baseColor : '#000000'}
              uppercase
            >
              prize expires 0.0.'00
            </Text>
          </Bottom>
        </FadeIn>
      </Container>
    )
  }
}

const containerBackgroundColor = '#9368aa'

const Container = styled.div`
  width: 100%;
  height: 100%;
  ${props =>
    props.claimed
      ? `
    background-image: url(${Background});
    background-repeat: no-repeat;
    background-size: cover;
  `
      : `background-color: ${props.backgroundColor};`};
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  animation: ${props => fadeIn} 0.4s forwards;
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1}
`

const ContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
  display: flex;
  margin-top: ${props => props.marginTop || '12%'};
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
  justify-content: center;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const Bottom = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  overflow: hidden;
  &:before {
    position: absolute;
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  &:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: ${props => responsiveDimension(1)} solid ${props =>
  props.borderColor};
  }
`

const TextMarquee = styled.div`
  width: 80%;
  text-align: center;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const AlignWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')};
  ${props => (props.italic ? 'font-style: italic;' : '')};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const ButtonPanel = styled.div`
  position: relative;
  width: 100%;
  padding: 0 10% 0 10%;
`

const AgreedFalsePanel = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  padding: inherit;
  left: 0;
  right: 0;
  cursor: pointer;
  z-index: 99;
  &:after {
    content: '';
    width: 100%;
  }
`

const AgreedTruePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
`

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled.div`
  width: calc(95% / 2);
  height: ${props => responsiveDimension(10)};
  border-radius: ${props => responsiveDimension(0.5)};
  ${props =>
    props.backgroundColor ? `background-color: ${props.backgroundColor}` : ''};
  border: ${props =>
    props.borderColor
      ? `${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  color: ${props => props.color};
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(5)};
  letter-spacing: ${props => responsiveDimension(0.1)};
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${props => props.opacity};
  &:before {
    content: '${props => props.text}';
    margin-top: 2%;
  }
  &:after {
    width: ${props => responsiveDimension(7)};
    height: ${props => responsiveDimension(7)};
    content: '';
    display: inline-block;
    background-image: url(${props => props.icon});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-left: 5%;
  }
  &:hover {
    background-color: ${props => props.color};
    color: ${props => props.hoverColor};
  }
  &:hover:after {
    background-image: url(${props => props.hoverIcon});
  }
`

const AgreedFalseIcon = styled.div`
  width: ${props => responsiveDimension(5.3)};
  height: ${props => responsiveDimension(5.3)};
  border-radius: 50%;
  background-color: #ffffff;
  margin-left: ${props => responsiveDimension(0.5)};
`

const AgreedTrueIcon = styled.img`
  height: ${props => responsiveDimension(5.3)};
  margin-left: ${props => responsiveDimension(0.5)};
  cursor: pointer;
`

/**
 * Terms And Conditions
 * @param props
 * @constructor
 */

const TermsAndConditionsContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  // opacity: 0;
  // z-index: -100;
`

const TACWrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10% 0 10%;
`

const TACSection = styled.div`
  display: flex;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
`

const TACContentScrolling = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
  display: flex;
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
    background-color: transparent;
  }
`

const TACContent = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const AgreeButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AgreeButton = styled.div`
  width: 100%
  height: ${props => responsiveDimension(8)};
  border: ${props => responsiveDimension(0.4)} solid #ffffff;
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(3.4)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: ${props => responsiveDimension(0.1)};
  white-space: nowrap;
  cursor: pointer;
`

const CloseIcon = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin: 2% 0 0 -3%;
  &:after {
    content: '';
    display: inline-block;
    width: ${props => responsiveDimension(3)};
    height: ${props => responsiveDimension(3)};
    background-image: url(${props => PrizeClaimCloseIcon});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    cursor: pointer;
    opacity: 0.4;
  }
  &:hover::after {
    opacity: 1;
  }
`

const TermsAndConditionsComp = props => {
  return (
    <TermsAndConditionsContainer>
      <CloseIcon onClick={props.refCloseClick} />
      <TACWrapper>
        <TACContentScrolling>
          <TACContent>
            <Section>
              <Text font={'pamainlight'} size={4} color={'#ffffff'} uppercase>
                terms & conditions
              </Text>
            </Section>
            <TACSection marginTop={3}>
              <Text
                font={'pamainlight'}
                size={2.5}
                color={'#ffffff'}
                lineHeight={1.3}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Vehicula ipsum a arcu cursus vitae congue mauris rhoncus.
                Consectetur a erat nam at lectus. Orci eu lobortis elementum
                nibh tellus. Lobortis feugiat vivamus at augue eget arcu dictum
                varius duis. Vel facilisis volutpat est velit egestas dui id
                ornare. Urna nunc id cursus metus aliquam. Arcu risus quis
                varius quam. Accumsan tortor posuere ac ut consequat semper
                viverra. Libero enim sed faucibus turpis in eu.
              </Text>
            </TACSection>
            <TACSection marginTop={3}>
              <Text
                font={'pamainregular'}
                size={2.5}
                color={'#ffffff'}
                lineHeight={1.3}
              >
                Title Sample
              </Text>
            </TACSection>
            <TACSection>
              <Text
                font={'pamainlight'}
                size={2.5}
                color={'#ffffff'}
                lineHeight={1.3}
              >
                Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                Amet aliquam id diam maecenas ultricies mi eget. Nibh nisl
                condimentum id venenatis. Vel quam elementum pulvinar etiam non
                quam lacus. Habitant morbi tristique senectus et netus et. Nulla
                pharetra diam sit amet nisl suscipit adipiscing bibendum est.
                Sed euismod nisi porta lorem mollis aliquam ut porttitor.
                Sodales ut eu sem integer vitae justo eget magna fermentum. In
                arcu cursus euismod quis viverra nibh cras pulvinar mattis.
                Scelerisque felis imperdiet proin fermentum leo. Faucibus in
                ornare quam viverra orci sagittis.
              </Text>
            </TACSection>
            <TACSection marginTop={3}>
              <Text
                font={'pamainregular'}
                size={2.5}
                color={'#ffffff'}
                lineHeight={1.3}
              >
                Title Sample
              </Text>
            </TACSection>
            <TACSection>
              <Text
                font={'pamainlight'}
                size={2.5}
                color={'#ffffff'}
                lineHeight={1.3}
              >
                Sit amet commodo nulla facilisi nullam vehicula ipsum. Aliquam
                sem et tortor consequat id porta nibh venenatis. Nam aliquam sem
                et tortor consequat id porta. Vel fringilla est ullamcorper eget
                nulla. Nulla porttitor massa id neque aliquam vestibulum morbi
                blandit cursus. Mi proin sed libero enim sed faucibus. Quis
                blandit turpis cursus in hac habitasse platea dictumst. Duis
                ultricies lacus sed turpis. Massa placerat duis ultricies lacus
                sed turpis tincidunt. Aenean et tortor at risus. Volutpat ac
                tincidunt vitae semper quis lectus nulla at. Faucibus turpis in
                eu mi bibendum neque egestas congue quisque. In pellentesque
                massa placerat duis ultricies lacus sed turpis. Nibh praesent
                tristique magna sit amet. Nec sagittis aliquam malesuada
                bibendum arcu. Eu tincidunt tortor aliquam nulla. Vitae congue
                mauris rhoncus aenean vel elit scelerisque mauris pellentesque.
                Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa
                eget.{' '}
              </Text>
            </TACSection>
            <TACSection marginTop={3}>
              {props.isClaimed ? null : (
                <AgreeButtonWrapper>
                  <AgreeButton
                    onClick={props.refAgreeClick}
                    id={`button-starboard-prizeclaimterms-agree`}
                  >
                    i agree to the terms and conditions
                  </AgreeButton>
                </AgreeButtonWrapper>
              )}
            </TACSection>
          </TACContent>
        </TACContentScrolling>
      </TACWrapper>
    </TermsAndConditionsContainer>
  )
}

const LightboxWrapper = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  opacity: 0;
  z-index: -100;
`

/**
 * E-mail Send Type
 * @param props
 * @constructor
 */

const SendContainer = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  background-color: rgba(0, 0, 0, 0.9);
`
const SendWrapper = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const SendImageWrapper = styled.div`
  width: ${props => responsiveDimension(8)};
  height: ${props => responsiveDimension(8)};
  position: relative;
  display: flex;
`

const SendImage = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(props.size || 8)};
  height: ${props => responsiveDimension(props.size || 8)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  ${props => (props.left ? `left: ${props.left}` : '')};
`

const SendEmailPopup = props => {
  return (
    <SendContainer onClick={props.refPopupClick}>
      <SendWrapper>
        <Section marginBottom={2}>
          <SendImageWrapper>
            <SendImage src={StarRedeemEmailIconGold} size={8} />
            <SendImage
              pos={'absolute'}
              src={StarRedeemEmailArrowRightIcon}
              size={5}
              left={'150%'}
            />
          </SendImageWrapper>
        </Section>
        <Section marginBottom={2}>
          <Text font={'pamainlight'} size={4.7} color={'#ffffff'} uppercase>
            {'prize details sent!'}
          </Text>
        </Section>
        <Section>
          <Text font={'pamainbold'} size={3.5} color={props.color} uppercase>
            {props.profile.userName}
          </Text>
        </Section>
        <Section style={{ position: 'absolute', width: '100%', bottom: '10%' }}>
          <Text font={'pamainlight'} size={4} color={'#ffffff'} uppercase>
            tap anywhere to return
          </Text>
        </Section>
      </SendWrapper>
    </SendContainer>
  )
}

/**
 * Claimed In Full panel
 * @param props
 * @constructor
 */
const ClaimedInFullContainer = styled.div`
  position: relative;
  width: 100%;
`

const UnderlineWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
`

const Underline = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  left: 0;
  right: 0;
  top: 10%;
  &:after {
    content: '';
    width: 100%;
    height: ${props => responsiveDimension(0.2)};
    background-color: ${props => props.backgroundColor};
  }
`

const ClaimedInFullComponent = props => {
  return (
    <ClaimedInFullContainer>
      <Section marginBottom={2}>
        <Text font={'pamainlight'} size={9} color={props.color} uppercase>
          redeemed
        </Text>
      </Section>
      <Section marginBottom={1.3}>
        <Text font={'pamainlight'} size={4} color={'#ffffff'} uppercase>
          check your e-mail
        </Text>
      </Section>
      <Section marginBottom={4}>
        <Text font={'pamainbold'} size={3.5} color={props.color} uppercase>
          {props.profile.userName}
        </Text>
      </Section>
      <Section>
        <TextWrapper>
          <Text
            font={'pamainregular'}
            size={3.5}
            color={'#ffffff'}
            uppercase
            nowrap
          >
            read&nbsp;
          </Text>
          <UnderlineWrapper onClick={props.refReadTermsClick}>
            <Text
              font={'pamainregular'}
              size={3.5}
              color={'#ffffff'}
              uppercase
              nowrap
            >
              terms & conditions
            </Text>
            <Underline backgroundColor={'#ffffff'} />
          </UnderlineWrapper>
        </TextWrapper>
      </Section>
    </ClaimedInFullContainer>
  )
}
