import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import { extendObservable } from 'mobx'
import { TweenMax, TimelineMax, Quad } from 'gsap'
import { vhToPx, hex2rgb, evalImage } from '@/utils'
import StarIcon from '@/assets/images/star-icon-grey.svg'
import StarIconGold from '@/assets/images/star-icon-gold.svg'

@observer
export default class StarSelection extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      borderColor: '#59585b',
      stars: this.props.stars,
      timeout: null,
    })
  }

  onClickStar(key, selectedStar) {
    //--TweenMax.set(this.refLock, { display: 'block' })

    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    for (let i = 0; i < this.stars.length; i++) {
      if (key === i) {
        TweenMax.to(this[`star-${key}`], 0.3, { scale: 1.2 })
        TweenMax.to(this[`starcircle-${key}`], 0.3, {
          border: `${vhToPx(0.5)} solid #eedf17`,
        })
        TweenMax.set(this[`starsmall-${key}`], {
          attr: { src: StarIconGold },
          onComplete: () => {
            this.timeout = setTimeout(() => {
              this.handleFlash(key, selectedStar)
            }, 1500)
          },
        })
      } else {
        TweenMax.to(this[`star-${i}`], 0.3, { scale: 1 })
        TweenMax.to(this[`starcircle-${i}`], 0.3, {
          border: `${vhToPx(0.5)} solid #59585b`,
        })
        TweenMax.to(this[`starsmall-${i}`], 0.3, { attr: { src: StarIcon } })
      }
    }
    /*
    TweenMax.set(this[`starsmall-${key}`], {
      backgroundColor: '#eedf17',
      onComplete: () => {
        this.handleFlash(key)
      },
    })
*/
  }

  handleFlash(key, selectedStar) {
    new TimelineMax({ repeat: 0 })
      .set(this.refFlash, { opacity: 0.9, zIndex: 100 })
      .to(this.refFlash, 0.75, {
        opacity: 0,
        zIndex: -100,
        onStart: () => {
          setTimeout(() => {
            this.props.handleCallback({
              completed: true,
              key: key,
              star: selectedStar,
            })
          }, 100)
        },
      })
  }

  render() {
    return (
      <Container innerRef={this.props.reference}>
        <Flash innerRef={ref => (this.refFlash = ref)} />

        <Section height={45}>
          <SubSection style={{ marginTop: vhToPx(4) }}>
            <TextWrapper>
              <Text font={'pamainlight'} size={5.5} lineheight={1.1} uppercase>
                select your favorite
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text
                font={'pamainextrabold'}
                size={4.5}
                color={'#eedf17'}
                uppercase
              >
                star category
              </Text>
            </TextWrapper>
          </SubSection>
        </Section>

        <Section>
          <SubSection>
            <StarsSection>
              {this.stars.map((i, k) => {
                return (
                  <StarWrapper
                    key={k}
                    innerRef={ref => (this[`star-${k}`] = ref)}
                  >
                    <StarInnerWrapper
                      onClick={this.onClickStar.bind(this, k, i)}
                    >
                      <StarCircleWrapper>
                        <StarCircle
                          src={evalImage(i.icon)}
                          innerRef={ref => (this[`starcircle-${k}`] = ref)}
                        />
                      </StarCircleWrapper>
                      <StarsmallWrapper>
                        <Starsmall
                          src={StarIcon}
                          innerRef={ref => (this[`starsmall-${k}`] = ref)}
                        />
                      </StarsmallWrapper>
                    </StarInnerWrapper>
                    <StarText text={i.text} />
                  </StarWrapper>
                )
              })}
            </StarsSection>
          </SubSection>
        </Section>

        <Section height={40}>
          <SubSection>
            <SubSectionInner>
              <TextWrapper>
                <Text font={'pamainregular'} size={4.5} uppercase>
                  play for&nbsp;
                </Text>
                <Text
                  font={'pamainextrabold'}
                  size={4.5}
                  color={'#eedf17'}
                  uppercase
                >
                  stars
                </Text>
              </TextWrapper>
              <TextWrapper>
                <Text font={'pamainregular'} size={4.5} uppercase>
                  in all categories
                </Text>
              </TextWrapper>
            </SubSectionInner>
          </SubSection>
        </Section>

        <Section height={40}>
          <SubSection>
            <TextWrapper>
              <div style={{ textAlign: 'center' }}>
                <Text font={'pamainregular'} size={4.3} uppercase>
                  view&nbsp;
                </Text>
                <Text
                  font={'pamainextrabold'}
                  size={4.3}
                  color={'#eedf17'}
                  uppercase
                >
                  stars&nbsp;
                </Text>
                <Text font={'pamainregular'} size={4.3} uppercase>
                  in your prize chest
                </Text>
              </div>
            </TextWrapper>
            <TextWrapper>
              <Text
                font={'pamainregular'}
                size={3.2}
                color={'#16c5ff'}
                uppercase
              >
                awarded at the end of the live events
              </Text>
            </TextWrapper>
          </SubSection>
        </Section>

        <Section height={30}>
          <Footer>Ambassador Demo 1.0v</Footer>
        </Section>

        <Lock innerRef={ref => (this.refLock = ref)} />
      </Container>
    )
  }
}

const slideLeft = keyframes`
  0%{transform: translateX(100%);}
  100%{transform: translateX(0);}
`
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 1;
  transform: translateX(100%);
  animation: ${slideLeft} 0.75s forwards;
`

const Section = styled.div`
  width: 100%;
  height: ${props => props.height || `100`}%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`

const SubSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SubSectionInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => vhToPx(2)};
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

const StarsSection = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-between;
  padding-left: ${props => vhToPx(7)};
  padding-right: ${props => vhToPx(7)};
`

const StarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StarInnerWrapper = styled.div`
  width: 100%;
`

const StarCircleWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
`

const StarCircle = styled.div`
  cursor: pointer;
  width: ${props => vhToPx(16)};
  height: ${props => vhToPx(16)};
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  border ${props => vhToPx(0.5)} solid #59585b;
`

const StarCircle__ = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  cursor: pointer;
  &:after {
    content: '';
    width: ${props => vhToPx(16)};
    height: ${props => vhToPx(16)};
    border-radius: 50%;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    border ${props => vhToPx(0.5)} solid ${props => props.borderColor};
    display: block;
    //59585b
  }
`

const StarsmallWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${props => vhToPx(0.2)};
`

const StarsmallNEW = styled.div`
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(5)};
  -webkit-mask-image: url(${props => props.src});
  -webkit-mask-size: ${props => `${vhToPx(5)}, ${vhToPx(5)}`};
  -webkit-mask-repeat: no-repeat;
  mask-image: url(${props => props.src});
  mask-size: ${props => `${vhToPx(5)}, ${vhToPx(5)}`};
  mask-repeat: no-repeat;
  background-color: #58595b;
`

const Starsmall = styled.img`
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(5)};
`
const StarsmallORIG = styled.div`
  width: ${props => vhToPx(5)};
  height: ${props => vhToPx(5)};
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
`

const Starsmall__ = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${props => vhToPx(0.2)};
  &:after {
    content: '';
    width: ${props => vhToPx(5)};
    height: ${props => vhToPx(5)};
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    display: block;
  }
`

const StarText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  &:after {
    content: '${props => props.text}';
    font-family: pamainlight;
    font-size: ${props => vhToPx(6.5)};
    text-transform: uppercase;
  }
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

const Lock = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: none;
`

const Flash = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: -100;
  background-color: #ffffff;
  opacity: 0;
`
