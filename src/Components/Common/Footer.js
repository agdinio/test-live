import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import TokenIcon from '@/assets/images/playalong-token.svg'
import StarIcon from '@/assets/images/star-icon-gold.svg'
import { responsiveDimension } from '@/utils'

@inject('ProfileStore')
export default class Footer extends Component {
  render() {
    let { ProfileStore } = this.props

    return (
      <Container>
        <SummaryWrapper>
          <SummarySection>
            <StarCounter />
          </SummarySection>
          <SummarySection>
            <SummaryInner>
              <ProfilePoints>
                {ProfileStore.profile.currencies['points']}
              </ProfilePoints>
              <ProfilePointsLabel>PTS</ProfilePointsLabel>
            </SummaryInner>
            <SummaryInner style={{ marginLeft: responsiveDimension(5) }}>
              <TokensLabelWrapper>
                <ProfileTokens>
                  {ProfileStore.profile.currencies['tokens']}&nbsp;
                </ProfileTokens>
                <TokenWrapper>
                  <Token src={TokenIcon} size={2.9} index={3} />
                  <Faded index={2} size={2.9} color={'#6d6c71'} left={-2.6} />
                  <Faded index={1} size={2.9} color={'#33342f'} left={-2.6} />
                </TokenWrapper>
              </TokensLabelWrapper>
            </SummaryInner>
          </SummarySection>
        </SummaryWrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
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
