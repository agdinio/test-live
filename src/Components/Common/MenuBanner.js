import React, { Component } from 'react'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import styled, { keyframes } from 'styled-components'

export default class MenuBanner extends Component {
  render() {
    return (
      <DropDownBannerContainer>
        <BannerText text={this.props.text} color={this.props.textColor} />
        <Banner
          backgroundColor={this.props.backgroundColor}
          bannerReference={this.props.bannerReference}
          innerRef={this.props.bannerId}
        >
          <Icon
            src={evalImage(this.props.icon)}
            backgroundColor={this.props.iconBackgroundColor}
            borderColor={this.props.iconBorderColor}
            iconMaskColor={this.props.iconMaskColor}
            sizeInPct={this.props.sizeInPct}
            sizeContain={this.props.sizeContain}
            innerRef={this.props.iconId}
          />
        </Banner>
      </DropDownBannerContainer>
    )
  }
}

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
  /*color: #19d1bf;*/
  color: ${props => props.color || '#fff'};
  text-transform: uppercase;
  &:before {
    content: '${props => props.text}';
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
  z-index: 10;
`

const backBanner = keyframes`
  0%{height: ${vhToPx(1)};}
  50%{height: ${vhToPx(9.5)};}
  100%{height: ${props => vhToPx(8.5)};}
`

const Icon = styled.div`
  width: ${props => responsiveDimension(4.5)};
  height: ${props => responsiveDimension(4.5)};
  min-width: ${props => responsiveDimension(4.5)};
  min-height: ${props => responsiveDimension(4.5)};
  border-radius: 50%;
  margin-left: ${props => responsiveDimension(0.1)};
  margin-bottom: ${props => responsiveDimension(0.3)};
  background-color: ${props => props.backgroundColor};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ``};
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    ${props =>
      props.iconMaskColor
        ? `
        background-color: ${props.iconMaskColor};
        -webkit-mask-image: url(${props.src});
        -webkit-mask-size: ${props.sizeInPct};
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-image: url(${props => props.src});
        mask-size: ${props.sizeInPct};
        mask-repeat: no-repeat;
        mask-position: center;
      `
        : `
        background-image: url(${props.src});
        background-repeat: no-repeat;
        background-size: ${
          props.sizeContain
            ? props.sizeContain
            : props.sizeInPct
            ? `${props.sizeInPct}%`
            : '40%'
        };
        background-position: center;
      `};
  }
`
