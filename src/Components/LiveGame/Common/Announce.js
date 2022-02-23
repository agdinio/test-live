import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'
import sportocoLogo from '@/assets/images/sportoco-logo.svg'
import SponsorBranding from '@/Components/LiveGame/Common/SponsorBranding'

@inject('CommandHostStore')
@observer
export default class Announce extends Component {
  constructor(props) {
    super(props)

    this.disposeCurrentPlay = intercept(
      this.props.CommandHostStore,
      'currentPlay',
      change => {
        debugger
        this.props.isTimeUp(true, { announceDone: true })
        return change
      }
    )
  }

  componentWillUnmount() {
    this.disposeCurrentPlay()
  }

  render() {
    debugger
    //let { announcements, sponsor } = this.props.CommandHostStore.currentPlay
    let { announcements, sponsor } = this.props.question

    // const regex = /(?:^<p[^>]*>)|(?:<\/p>$)/g
    // const header = announcements[0].value.replace(regex, '')
    // const middle = announcements[1].value.replace(regex, '')
    // const bottom = announcements[2].value.replace(regex, '')

    const headerText = announcements[0].value
      ? announcements[0].value.replace('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
      : ''
    const middleText = announcements[1].value
      ? announcements[1].value.replace('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
      : ''
    const bottomText = announcements[2].value
      ? announcements[2].value.replace('rgb(0, 0, 0)', 'rgb(255, 255, 255)')
      : ''

    return (
      <Container>
        <Wrapper>
          <FadeIn>
            {headerText ? (
              <Section>
                <Header dangerouslySetInnerHTML={{ __html: headerText }} />
              </Section>
            ) : null}

            {middleText ? (
              <Section middle>
                <Middle dangerouslySetInnerHTML={{ __html: middleText }} />
              </Section>
            ) : null}

            {sponsor && sponsor.id ? (
              <Section middle>
                <SponsorWrapper>
                  <PresentedBy />
                  {/*<SponsorLogo src={sportocoLogo} />*/}
                  <SponsorBranding item={sponsor} />
                </SponsorWrapper>
              </Section>
            ) : bottomText ? (
              <Section middle>
                <Bottom dangerouslySetInnerHTML={{ __html: bottomText }} />
              </Section>
            ) : null}
          </FadeIn>
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: inherit;
  height: inherit;
`

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);

  opacity: 1;
  position: absolute;
`

const FadeIn = styled.div`
  ${props =>
    props.fadeOut
      ? `animation: 0.4s ${fadeOutBottom} forwards;`
      : `animation: 0.4s ${fadeInTop} forwards;
      animation-delay: ${props.delay ? 0.4 : 0}s;
      `} padding: 5% 4.5% 5% 4.5%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 75%;
  height: 100%;
`

const fadeInTop = keyframes`
  0% {opacity:0;position: relative; top: ${responsiveDimension(-45)};}
  100% {opacity:1;position: relative; top: 0; height:inherit;}
`

const fadeOutBottom = keyframes`
  0% {opacity:1; }
  99% {opacity: 0; height: inherit;}
  100% {opacity:0;height: 0px;}
`

const Section = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  ${props => (props.middle ? 'align-items: center' : '')};
  padding-top: ${props => (props.middle ? vhToPx(1.5) : 0)};
`

const Header = styled.div`
  width: 100%;
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(5)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1;
  margin-left: -100%;
  margin-right: -100%;
  text-align: center;
  margin-top: ${props => vhToPx(0.5)};
`
const Middle = styled.div`
  width: 100%;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(5.3)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1;
  margin-left: -100%;
  margin-right: -100%;
  text-align: center;
`
const Bottom = styled.div`
  width: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(5.3)};
  color: #ffffff;
  text-transform: uppercase;
  line-height: 1;
  margin-left: -100%;
  margin-right: -100%;
  text-align: center;
`

const SponsorWrapper = styled.div`
  width: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SponsorLogo = styled.img`
  height: ${props => responsiveDimension(6)};
`

const PresentedBy = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(2.2)};
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: ${props => vhToPx(0.5)};
  &:after {
    content: 'PRESENTED BY';
  }
`
