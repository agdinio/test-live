import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'
import { pageViewDetails } from '../Auth/GoogleAnalytics'
@inject('NavigationStore')
@observer
export default class MenuItem extends Component {
  route(route) {
    if (route) {
      if (this.props.show) {
        this.props.close()
        setTimeout(() => {
          this.props.NavigationStore.setCurrentView(route, true)
        }, 500)
      }
    }
  }

  /* Get the menu click actions  */
  async getMenuDetails(data, item) {
    this.route.bind(data, item.route)
    console.log('itemDetails', item)
    //await pageViewDetails(item.label ,item.route , item.label)
  }
  /* ******************* */
  render() {
    let { item } = this.props
    return (
      <Container
        onClick={this.route.bind(this, item.route)}
        id={`menu-${item.label.toLowerCase().replace(/\s+/g, '')}`}
      >
        <Wrapper backgroundColor={item.backgroundColor}>
          <LeftWrapper>
            <IconWrapper
              show={true}
              backgroundColor={item.iconCircleBackgroundColor}
              borderColor={item.iconBorderColor}
            >
              <Icon
                src={require(`@/assets/images/${item.icon}`)}
                height={item.iconHeight}
              />
            </IconWrapper>
          </LeftWrapper>
          <RightWrapper
            bold={item.bold}
            color={item.labelColor}
            text={item.label}
          ></RightWrapper>
        </Wrapper>
      </Container>
    )
  }
}

const size = responsiveDimension(9)
const Container = styled.div`
  cursor: pointer;
  width: 100%;
  height: ${props => size};
  background-color: #909495;
  border-left: ${props => responsiveDimension(1.2)} solid
    rgba(255, 255, 255, 0.3);
  margin-bottom: ${props => vhToPx(0.5)};
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${props => props.backgroundColor};
`
const LeftWrapper = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  border-top-right-radius: calc(${props => size} / 2);
  border-bottom-right-radius: calc(${props => size} / 2);
  background-color: #909495;
`
const IconWrapper = styled.div`
  ${props =>
    props.show
      ? 'transform: scale(1);'
      : 'transform: scale(0);'} width: ${props => size};
  width: ${props => size};
  height: ${props => size};
  border-radius: ${props => size};
  background-color: ${props => props.backgroundColor};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.8)} solid ${props.borderColor}`
      : ``};
  display: flex;
  justify-content: center;
  align-items: center;
`
const Icon = styled.img`
  height: ${props => props.height};
  width: ${props => props.height};
`
const RightWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 5%;
  background-color: transparent;
  &:after {
    content: '${props => props.text}';
    font-family: ${props => (props.bold ? 'pamainbold' : 'pamainlight')};
    font-size: ${props => responsiveDimension(3.7)};
    color: ${props => props.color};
    height: ${props => responsiveDimension(3.7 * 0.9)};
    line-height: 1;
  }
`
