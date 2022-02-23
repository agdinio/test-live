import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import iconArrow from '@/assets/images/icon-arrow.svg'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('PrePickStore')
@observer
export default class PrePickMsg extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {})
  }

  render() {
    let { info, currentPrePick } = this.props

    let infoValue = info
      .replace(/rgb\(0, 0, 0\)/g, 'rgb(255, 255, 255)')
      .replace(/rgb\(1, 1, 1\)/g, 'rgb(255, 255, 255)')

    return (
      <Container>
        <ArrowUp src={iconArrow} />
        {/*
        {message.headers.length > 0 ? (
          <Header>
            {message.headers.map((item, key) => {
              return (
                <HeaderItem color={item.color} key={key}>
                  {item.value}
                  &nbsp;
                </HeaderItem>
              )
            })}
          </Header>
        ) : (
          <div />
        )}
*/}
        <Section justifyContent={'center'}>
          {currentPrePick === 1 ? <InfoHeader /> : null}
        </Section>
        <Section marginTop={1.5} justifyContent={'center'}>
          <InfoWrapper>
            <Info dangerouslySetInnerHTML={{ __html: infoValue }} />
          </InfoWrapper>
        </Section>

        {/*
        {message.details.length > 0 ? (
          <Detail innerRef={this.props.reference}>
            {message.details.map((item, key) => {
              return item.break ? (
                <br key={key} />
              ) : (
                <DetailItem color={item.color} key={key}>
                  {item.value}
                  &nbsp;
                </DetailItem>
              )
            })}
          </Detail>
        ) : (
          <div />
        )}
*/}
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding-top: ${props => responsiveDimension(6.2)};
`
const ArrowUp = styled.img`
  transform: rotate(-90deg);
  width: ${props => responsiveDimension(2.8)};
`
const Header = styled.div`
  display: inline-block;
  flex-direction: row;
  width: 100%;
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(7.6)};
  overflow-wrap: break-word;
  height: ${props => responsiveDimension(6.5)};
  line-height: ${props => responsiveDimension(7.5)};
  padding-left: ${props => responsiveDimension(1)};
`
const HeaderItem = styled.span`
  text-transform: uppercase;
  color: ${props => props.color};
`
const Detail = styled.div`
  display: inline-block;
  width: 74%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.7)};
  justify-content: center;
  align-items: center;
  line-height: ${props => responsiveDimension(3.7)};
  padding-top: ${props => responsiveDimension(1)};
`
const DetailItem = styled.span`
  color: ${props => props.color};
  padding-right: ${props => responsiveDimension(0.5)};
`

const Section = styled.div`
  width: 100%;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
`

const InfoHeader = styled.div`
  display: flex;
  flex-direction: row;
  &:before {
    content: 'begin';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(7.5)};
    color: #ffffff;
    line-height: 1;
    height: ${props => responsiveDimension(7.5 * 0.8)};
    text-transform: uppercase;
    margin-right: ${props => responsiveDimension(1.7)};
  }
  &:after {
    content: 'pre-picks';
    font-family: pamainlight;
    font-size: ${props => responsiveDimension(7.5)};
    color: #0fbc1c;
    line-height: 1;
    height: ${props => responsiveDimension(7.5 * 0.8)};
    text-transform: uppercase;
  }
`

const InfoWrapper = styled.div`
  width: 74%;
  display: flex;
  flex-direction: column;
`

const Info = styled.div`
  text-align: center;
  font-size: ${props => responsiveDimension(3.7)};
  line-height: 0.7;
`

PrePickMsg.propTypes = {
  currentPrePick: PropTypes.number.isRequired,
  info: PropTypes.string.isRequired,
}
