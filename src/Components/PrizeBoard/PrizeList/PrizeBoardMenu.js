import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import TweenMax from 'gsap/TweenMax'
import icon_prize from '@/assets/images/symbol-prize.svg'
import icon_token from '@/assets/images/playalong-token.svg'
import PrizeBoardMenuType from './PrizeBoardMenuType'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('PrizeBoardStore')
@observer
export default class PrizeBoardMenu extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {
      //MOBX
      tokenBank: this.props.PrizeBoardStore.getTokenBank(),
      menuTypes: this.props.PrizeBoardStore.getPrizeBoardMenuTypes(),
    })
  }

  prizeBoardMenuTypeOnClick(item) {
    this.props.prizeBoardMenuOnClick(item)
    console.log('prize board menu', item)
  }

  anim() {
    TweenMax.set(this.refContainer, { y: 190 })
    TweenMax.set(this.refTypes, { opacity: 0 })
    TweenMax.fromTo(
      this.refHeaderBottom,
      1,
      { opacity: 0 },
      {
        opacity: 1,
        delay: 1,
        onComplete: () => {
          TweenMax.to(this.refTypes, 0.1, {
            opacity: 1,
            onComplete: () => {
              TweenMax.to(this.refContainer, 0.5, { y: 0 })
            },
          })
        },
      }
    )
  }

  componentDidMount() {
    if (this.refTypes.offsetHeight < this.refTypes.scrollHeight) {
      this.refTypes.style.overflowY = 'scroll'
      //--Draggable.create(this.refTypes, {type: 'scroll', cursor: 'drag'});
    } else {
      this.refTypes.style.overflow = 'hidden'
      this.refEntriesItems.style.bottom = 0
    }

    this.anim()
  }

  render() {
    return (
      <Container innerRef={c => (this.refContainer = c)}>
        <Header>
          <HeaderTop>
            <HeaderTopLeft>
              <HeaderTopLeftIconWrapper>
                <HeaderTopLeftIcon src={icon_prize} />
              </HeaderTopLeftIconWrapper>
            </HeaderTopLeft>
            <HeaderTopRight>
              <HeaderTopRightTopLabel>PRIZE BOARDS</HeaderTopRightTopLabel>
              <HeaderTopRightBottomLabel>
                FIRST TO CLAIM
              </HeaderTopRightBottomLabel>
            </HeaderTopRight>
          </HeaderTop>
          <HeaderBottom innerRef={c => (this.refHeaderBottom = c)}>
            <TextCenter>first with the most points, grab your prize</TextCenter>
          </HeaderBottom>
        </Header>

        <Type innerRef={c => (this.refTypes = c)}>
          <TypeItems innerRef={c => (this.refEntriesItems = c)}>
            {this.menuTypes.map((item, key) => {
              return (
                <PrizeBoardMenuType
                  item={item}
                  key={key}
                  prizeBoardMenuTypeOnClick={this.prizeBoardMenuTypeOnClick.bind(
                    this
                  )}
                />
              )
            })}
          </TypeItems>
        </Type>

        <TokenBankWrapper>
          <TokenBankLabel>YOUR TOKEN BANK</TokenBankLabel>
          <TokenBankTextWrapper>
            <TokenBankText>{this.tokenBank}</TokenBankText>
            <TokenBankIcon src={icon_token} />
          </TokenBankTextWrapper>
        </TokenBankWrapper>
      </Container>
    )
  }
}
const TextCenter = styled.div`
  text-align: center;
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-display: column;
  flex-direction: column;
  width: 100%;
  height: ${props => responsiveDimension(93.6)};
`
const Header = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${props => responsiveDimension(55)};

  justify-content: center;
`
const HeaderTop = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`
const HeaderTopLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => responsiveDimension(1.5)};
`
const HeaderTopLeftIconWrapper = styled.div`
  display: flex;
  width: ${props => responsiveDimension(8.2)};
  height: ${props => responsiveDimension(8.2)};
  border-radius: 50%;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
`
const HeaderTopLeftIcon = styled.img`
  width: 75%;
`

const HeaderTopRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`
const HeaderTopRightTopLabel = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(7.3)};
  color: #946faa;
  height: ${props => responsiveDimension(7.4)};
`
const HeaderTopRightBottomLabel = styled.div`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(6)};
  color: #ffffff;
`

const HeaderBottom = styled.div`
  width: 100%;
  font-family: pamainbold;
  font-size: ${props => responsiveDimension(3.1)};
  color: #ffffff;
  line-height: ${props => responsiveDimension(6)};
`

const Type = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.3vh rgba(0, 0, 0, 0.3);
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
const TypeItems = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TokenBankWrapper = styled.div`
  display: flex;
  flex-display: row;
  flex-direction: row;

  width: 100%;
  background-color: #171a16;
  height: ${props => responsiveDimension(18)};
`
const TokenBankLabel = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3.3)};
  color: #ffb600;
  padding-left: ${props => responsiveDimension(1.7)};
`
const TokenBankTextWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-right: ${props => responsiveDimension(1.7)};
`
const TokenBankText = styled.div`
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(4)};
  color: #ffb600;
  padding-right: ${props => responsiveDimension(1.4)};
`
const TokenBankIcon = styled.img`
  width: ${props => responsiveDimension(3)};
`

PrizeBoardMenu.propTypes = {
  prizeBoardMenuOnClick: PropTypes.func.isRequired,
}
