import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx, evalImage, responsiveDimension } from '@/utils'

export default class Summary extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // .set(this.ScoreDetail, { opacity: 0 })
    // .to(this.ScoreDetail, 0.3, { opacity: 1, delay: 3 })

    /*
    new TimelineMax({ repeat: 0 })
      .to(this.ScoreDetail, 0.3, { opacity: 1 })
      .to(this.ScoreDetail, 0.3, { opacity: 0, delay: 2 })
      .to(this.FirstSequence, 0.3, { opacity: 1 })
      .to(this.FirstSequence, 0.3, { opacity: 0, delay: 8 })
      .to(this.SecondSequence, 0.3, { opacity: 1 })
      .to(this.SecondSequence, 0.3, { opacity: 0, delay: 3 })
      .to(this.ThirdSequence, 0.3, { opacity: 1 })
      .to(this.ThirdSequence, 0.3, { opacity: 0, delay: 3 })
      .to(this.FourthSequence, 0.3, { opacity: 1 })
      .to(this.FourthSequence, 0.3, {
        opacity: 0,
        delay: 3,
        onComplete: () => {
          this.timeIsUp()
        },
      })
*/

    let container = document.getElementById('sequence-container')
    TweenMax.to(container, 0.3, { opacity: 1 })
  }

  timeIsUp() {
    this.props.isTimeUp(true, { comp: 'SUMMARY' })
  }

  render() {
    return (
      <Container>
        {/*
        <SequenceContainer innerRef={ref => (this.FirstSequence = ref)}>
          <Section>
            <TextWrapper innerRef={ref => (this.ScoreHeader = ref)}>
              <Text font={'pamainbold'} size={9} color={'#ffffff'}>
                PATRIOTS WIN
              </Text>
            </TextWrapper>
            <TextWrapper innerRef={ref => (this.ScoreDetail = ref)}>
              <Text font={'pamainbold'} size={5} color={'#ffffff'}>
                JAGUARS 20&nbsp;&nbsp;
              </Text>
              <Text font={'pamainbold'} size={5} color={'#ffffff'}>
                PATRIOTS 24
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>
*/}

        {/*
        <SequenceContainer innerRef={ref => (this.ScoreDetail = ref)}>
          <Section>
            <TextWrapper>
              <Text font={'pamainextrabold'} size={5.5} color={'#ffffff'}>
                JAGUARS 20&nbsp;&nbsp;
              </Text>
              <Text font={'pamainextrabold'} size={5.5} color={'#ffffff'}>
                PATRIOTS 24
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>

        <SequenceContainer innerRef={ref => (this.FirstSequence = ref)}>
          <Section>
            <TextWrapper>
              <Text font={'pamainbold'} size={9} color={'#ffffff'}>
                PATRIOTS WIN
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>

        <SequenceContainer innerRef={ref => (this.SecondSequence = ref)}>
          <Section>
            <TextWrapper>
              <Text font={'pamainlight'} size={6} color={'#ffffff'}>
                GET YOUR KEY AND SEND IT TO
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainlight'} size={6} color={'#ed1c24'}>
                FAMILY&nbsp;
              </Text>
              <Text font={'pamainlight'} size={6} color={'#ffffff'}>
                &&nbsp;
              </Text>
              <Text font={'pamainlight'} size={6} color={'#ed1c24'}>
                FRIENDS
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>

        <SequenceContainer innerRef={ref => (this.ThirdSequence = ref)}>
          <Section>
            <TextWrapper>
              <Text font={'pamainlight'} size={5} color={'#ffffff'}>
                GET BONUS&nbsp;
              </Text>
              <Text font={'pamainbold'} size={5} color={'#ffb600'}>
                TOKENS&nbsp;
              </Text>
              <Text font={'pamainlight'} size={5} color={'#ffffff'}>
                AND&nbsp;
              </Text>
              <Text font={'pamainbold'} size={5} color={'#17c5ff'}>
                POINTS&nbsp;
              </Text>
              <Text font={'pamainlight'} size={5} color={'#ffffff'}>
                FOR
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainlight'} size={5} color={'#ffffff'}>
                EVERYONE THAT USES A KEY
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>

        <SequenceContainer innerRef={ref => (this.FourthSequence = ref)}>
          <Section>
            <TextWrapper>
              <Text font={'pamainbold'} size={4} color={'#ffffff'}>
                USE YOUR&nbsp;
              </Text>
              <Text font={'pamainbold'} size={4} color={'#ffb600'}>
                TOKENS&nbsp;
              </Text>
              <Text font={'pamainbold'} size={4} color={'#ffffff'}>
                AND&nbsp;
              </Text>
              <Text font={'pamainbold'} size={4} color={'#17c5ff'}>
                POINTS&nbsp;
              </Text>
              <Text font={'pamainbold'} size={4} color={'#ffffff'}>
                IN THE
              </Text>
            </TextWrapper>
            <TextWrapper>
              <Text font={'pamainbold'} size={6} color={'#ed1c24'}>
                LIVE&nbsp;
              </Text>
              <Text font={'pamainlight'} size={6} color={'#ffffff'}>
                EVENTS and&nbsp;
              </Text>
              <Text font={'pamainbold'} size={6} color={'#ffffff'}>
                WIN BIG
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>
*/}
        <SequenceContainer id={'sequence-container'}>
          <Section>
            <TextWrapper>
              <Text font={'pamainbold'} size={9} color={'#ffffff'}>
                GAME HAS ENDED
              </Text>
            </TextWrapper>
          </Section>
        </SequenceContainer>
      </Container>
    )
  }
}

const Container = styled.div`
  width: inherit;
  height: inherit;
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
`

const SequenceContainer = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;

  opacity: 0;
`

const Section = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 1.1;
`
const Text = styled.span`
  font-family: ${props => props.font || 'pamainbold'};
  font-size: ${props => responsiveDimension(props.size || 4)};
  color: ${props => props.color || '#ffffff'};
`
