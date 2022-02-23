import React, { Component } from 'react'
import styled from 'styled-components'
import CopyLayover from '@/Components/OutroScreen/Share/CopyLayover'
import ShareLayover from '@/Components/OutroScreen/Share/ShareLayover'
import iconMenu from '@/assets/images/icon-menu.svg'
import { observer, inject } from 'mobx-react'
import { TweenMax, TimelineMax } from 'gsap'
import { extendObservable } from 'mobx'
import iconProfile from '@/assets/images/icon-profile.svg'
import CopyIcon from '@/assets/images/copy-icon.svg'
import ShareIcon from '@/assets/images/share-icon.svg'
import { vhToPx, responsiveDimension } from '@/utils'
import { ProgressThermo } from '@/Components/Common/ProgressThermo'

@observer
export default class Share extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      height: null,
      keyUsedCount: 0,
      points: 0,
      tokens: 0,
      referralCode: '',
    })
  }

  switch() {
    new TimelineMax({ repeat: 0 })
      .to(this.progressContainer, 1, {
        delay: 3,
        opacity: 1,
      })
      .set(this.progressContainer, {
        position: 'relative',
        top: '',
      })
    new TimelineMax({ repeat: 0 })
      .to(this.infoTip, 1, {
        opacity: 0,
        delay: 3,
      })
      .set(this.infoTip, {
        position: 'absolute',
      })
  }

  componentDidUpdate(pp) {
    debugger
    if (this.props.started && !pp.started) {
      if (this.props.profile && this.props.profile.currencies) {
        //this.points = this.props.profile.currencies.points
        //this.tokens = this.props.profile.currencies.tokens
        //this.referralCode = this.props.profile.key
      }

      if (this.props.keySharedCredits) {
        this.keyUsedCount = this.props.keySharedCredits['keyUsedCount']
        this.points = this.props.keySharedCredits['points']
        this.tokens = this.props.keySharedCredits['tokens']
        this.referralCode = this.props.profile.key
      }

      this.switch()
    }
  }

  render() {
    return (
      <Container innerRef={this.props.reference}>
        <Section marginBottom={2}>
          <TextWrapper>
            <Text font={'pamainlight'} size={6} uppercase>
              here is your unique&nbsp;
            </Text>
            <Text font={'pamainlight'} size={6} color={'#19d1bf'} uppercase>
              key
            </Text>
          </TextWrapper>
          <TextWrapper>
            <div style={{ textAlign: 'center', paddingTop: vhToPx(1) }}>
              <Text font={'pamainlight'} size={4} uppercase>
                every&nbsp;
              </Text>
              <Text
                font={'pamainextrabold'}
                size={4}
                color={'#19d1bf'}
                uppercase
              >
                key&nbsp;
              </Text>
              <Text font={'pamainlight'} size={4} uppercase>
                used grants you & your
              </Text>
            </div>
          </TextWrapper>
          <TextWrapper>
            <div style={{ textAlign: 'center' }}>
              <Text font={'pamainlight'} size={4} uppercase>
                friend&nbsp;
              </Text>
              <Text font={'pamainextrabold'} size={4} uppercase>
                added&nbsp;
              </Text>
              <Text
                font={'pamainextrabold'}
                size={4}
                color={'#ffb600'}
                uppercase
              >
                tokens&nbsp;
              </Text>
              <Text font={'pamainlight'} size={4} uppercase>
                &&nbsp;
              </Text>
              <Text
                font={'pamainextrabold'}
                size={4}
                color={'#17c5ff'}
                uppercase
              >
                points
              </Text>
            </div>
          </TextWrapper>
        </Section>
        <Section marginTop={2} marginBottom={2}>
          <ReferralCodeWrapper>
            <ReferralCodeTextWrapper>
              <Text font={'pamainextrabold'} size={8}>
                {this.referralCode}
              </Text>
            </ReferralCodeTextWrapper>
            <ReferralCodeInputWrapper innerRef={this.props.refCodeWrapper} />
          </ReferralCodeWrapper>
          <Actions>
            <ActionContainer paddingLeft={30}>
              <Text
                font={'pamainregular'}
                size={2.7}
                color={'#18d1bd'}
                uppercase
              >
                copy
              </Text>
              <Icon
                src={CopyIcon}
                w={8}
                h={8.2}
                onClick={this.props.handleOpenCopyLayover}
              />
            </ActionContainer>
            <TextWrapper>
              <Text
                font={'pamainregular'}
                size={2.7}
                color={'#a7a9ac'}
                uppercase
              >
                or
              </Text>
            </TextWrapper>
            <ActionContainer paddingRight={30}>
              <Text
                font={'pamainregular'}
                size={2.7}
                color={'#ffb600'}
                uppercase
              >
                share
              </Text>
              <Icon
                src={ShareIcon}
                w={8}
                h={8}
                onClick={this.props.handleOpenShareLayover}
              />
            </ActionContainer>
          </Actions>
        </Section>

        <Section>
          <ChangeContainer>
            <InfoTip innerRef={ref => (this.infoTip = ref)}>
              <MenuContainer>
                <MenuIcon>
                  <img src={iconMenu} alt={'menu'} />
                </MenuIcon>
                <Line />
                <Circle />
              </MenuContainer>
              <RightInfoText>
                <TextWrapper>
                  <Text font={'pamainlight'} size={3.8} uppercase>
                    your&nbsp;
                  </Text>
                  <Text
                    font={'pamainlight'}
                    size={3.8}
                    color={'#19d1bf'}
                    uppercase
                  >
                    key&nbsp;
                  </Text>
                  <Text font={'pamainlight'} size={3.8} uppercase>
                    is always
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text font={'pamainlight'} size={3.8} uppercase>
                    located in the menu
                  </Text>
                </TextWrapper>
              </RightInfoText>
            </InfoTip>

            <ProgressContainer innerRef={ref => (this.progressContainer = ref)}>
              <ProgressTextContainer>
                <TextWrapper>
                  <Text
                    font={'pamainextrabold'}
                    size={4}
                    color={'#18d1bd'}
                    uppercase
                  >
                    {this.keyUsedCount}
                    &nbsp;
                  </Text>
                  <Text font={'pamainlight'} size={4} uppercase>
                    have used your&nbsp;
                  </Text>
                  <Text
                    font={'pamainextrabold'}
                    size={4}
                    color={'#18d1bd'}
                    uppercase
                  >
                    key
                  </Text>
                  <Text font={'pamainlight'} size={4} uppercase>
                    , you earned
                  </Text>
                </TextWrapper>
                <TextWrapper>
                  <Text
                    font={'pamainextrabold'}
                    size={4}
                    color={'#ffb700'}
                    uppercase
                  >
                    {this.tokens}
                    &nbsp;
                  </Text>
                  <Text
                    font={'pamainlight'}
                    size={4}
                    uppercase
                    color={'#ffb700'}
                  >
                    tokens&nbsp;
                  </Text>
                  <Text font={'pamainlight'} size={4} uppercase>
                    &&nbsp;
                  </Text>
                  <Text
                    font={'pamainextrabold'}
                    size={4}
                    color={'#17c5ff'}
                    uppercase
                  >
                    {this.points}
                    &nbsp;
                  </Text>
                  <Text
                    font={'pamainlight'}
                    size={4}
                    color={'#17c5ff'}
                    uppercase
                  >
                    points
                  </Text>
                </TextWrapper>
              </ProgressTextContainer>

              <ProgressBarWrapper>{/*<ProgressThermo />*/}</ProgressBarWrapper>
            </ProgressContainer>
          </ChangeContainer>
        </Section>

        <Section>
          <Disclaimer>
            <TextWrapper>
              <Text font={'pamainregular'} size={2.5} uppercase>
                your key expires on:&nbsp;
              </Text>
              <Text
                font={'pamainregular'}
                size={2.5}
                color={'#ec1c23'}
                uppercase
              >
                august 23, 2018
              </Text>
            </TextWrapper>
          </Disclaimer>
        </Section>
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`
const Section = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const TextWrapper = styled.div`
  text-align: center;
`
const Text = styled.span`
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.size)};
  color: ${props => props.color || '#ffffff'};
  ${props => (props.uppercase ? `text-transform: uppercase;` : ``)}
  line-height: ${props => props.lineHeight || 1};
`

const ReferralCodeWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(8)};
  margin-bottom: ${props => vhToPx(2.5)};
`

const ReferralCodeTextWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(8)};
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 1;
`

const ReferralCodeInputWrapper = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(8)};
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 0;
`

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-left: ${props => props.paddingLeft || 0}%;
  padding-right: ${props => props.paddingRight || 0}%;
`
const Icon = styled.img`
  cursor: pointer;
  width: ${props => responsiveDimension(props.w)};
  height: ${props => responsiveDimension(props.h)};
  ${props => (props.padding ? `margin-left:${responsiveDimension(2)};` : '')};
  margin-top: ${props => responsiveDimension(2.5)};
`
const Disclaimer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

/******************************************************************/
const ChangeContainer = styled.div`
  width: 100%;
  height: ${props => responsiveDimension(30)};
  display: flex;
  position: relative;
`
const InfoTip = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;

  display: flex;
  flex-direction: row;

  justify-content: center;
  align-items: center;
`
const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-right: ${props => responsiveDimension(1.5)};
`
const MenuIcon = styled.div`
  border: ${props => responsiveDimension(0.2)} solid white;
  width: ${props => responsiveDimension(7.5)};
  height: ${props => responsiveDimension(7.5)};
  border-radius: ${props => responsiveDimension(7.5)};
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Line = styled.div`
  width: ${props => responsiveDimension(5)};
  background-color: #ffffff;
  height: ${props => responsiveDimension(0.2)};
`
const Circle = styled.div`
  width: ${props => responsiveDimension(1.6)};
  height: ${props => responsiveDimension(1.6)};
  background-color: white;
  border-radius: ${props => responsiveDimension(1.6)};
`
const RightInfoText = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${props => responsiveDimension(0.5)};
`
const ProgressContainer = styled.div`
  position: relative;
  text-transform: uppercase;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
`
const ProgressBarWrapper = styled.div`
  width: 80%;
  margin-top: ${props => vhToPx(7)};
  display: flex;
  justify-content: center;
`
const ProgressTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`
