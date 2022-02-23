import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import styled, { keyframes } from 'styled-components'
import Background from '@/assets/images/playalong-default.jpg'
import { vhToPx, evalImage, responsiveDimension, IsMobile } from '@/utils'
import { TweenMax, TimelineMax, Ease, SteppedEase } from 'gsap'
import BezierEasing from '@/bezier-easing'
import StarIconDarkGoldBorder from '@/assets/images/star-icon-dark-gold-border.svg'
import SmallStadiumIcon from '@/assets/images/starboard/stadium.svg'
import { StarCircle } from '@/Components/StarBoard/StarCategory'
import StarBucket from '@/Components/StarBoard/StarBucket'
import StarCategoryPrizeType, {
  Dummy,
} from '@/Components/StarBoard/StarCategoryPrizeType'

@inject('StarBoardStore', 'ProfileStore', 'PrizeBoardStore', 'AnalyticsStore')
export default class StarCategoryPrizeList extends Component {
  constructor(props) {
    super(props)
    this.item = this.props.item
    this.allCategories = []
    this._isMounted = false

    // this.props.StarBoardStore.resetLocalStar()
    // this.props.StarBoardStore.creditLocalStar(
    //   this.props.ProfileStore.profile.currencies.stars
    // )
  }

  handleRedeemClick(item) {
    console.log(item)
    this.props.StarBoardStore.debitQty(item)

    // let starPrizes = [...this.state.starPrizes]
    // let starPrize = {...starPrizes.filter(o => o.shortName === item.shortName && o.seasonId === item.seasonId && o.boardTypeId === item.boardTypeId)[0]}
    // if (starPrize) {
    //   starPrize.qty = starPrize.qty - 1
    //   this.setState({starPrizes})
    // }

    // let starPrize = {...this.state.starPrizes.filter(o => o.shortName === item.shortName && o.seasonId === item.seasonId && o.boardTypeId === item.boardTypeId)[0]}
    // if (starPrize) {
    //   starPrize.qty = starPrize.qty - 1
    // }
  }

  handleTimeStart(page) {
    this.props.AnalyticsStore.timeStart({ page: page })
  }

  handleTimeStop(page) {
    this.props.AnalyticsStore.timeStop({ page: page })
  }

  handleStarCounterPos(entry, callback) {
    if (this.refAnimatingStarBucketWrapper) {
      ReactDOM.unmountComponentAtNode(this.refAnimatingStarBucketWrapper)
      let comp = (
        <AnimatingStarBucket
          innerRef={ref => (this.refAnimStarBucket = ref)}
          font={'pamainextrabold'}
        />
      )
      ReactDOM.render(comp, this.refAnimatingStarBucketWrapper)
    }

    // const uid = `${entry.shortName}${entry.seasonId}${entry.boardTypeId}`
    const uid = `${entry.prizeBoardId}${entry.prizeBoardPrizeId}`

    //const elAddStarButton = document.getElementById(`prizetype-addstar-button-${uid}`)
    const elAddStarButton = document.getElementById(
      `button-starboard-prize-addstar-${entry.prizeBoardPrizeId}`
    )
    if (elAddStarButton) {
      elAddStarButton.style.pointerEvents = 'none'
    }

    const el = document.getElementById(`prizetype-starcounter-${uid}`)
    if (el) {
      let starbucket_w = el.getBoundingClientRect().width
      let starbucket_h = el.getBoundingClientRect().height

      let starbucket_pos_x =
        el.getBoundingClientRect().left -
        this.refAnimStarBucket.getBoundingClientRect().left
      starbucket_pos_x =
        starbucket_pos_x > 0
          ? starbucket_pos_x - el.getBoundingClientRect().width / 1.3
          : starbucket_pos_x

      let starbucket_pos_y =
        el.getBoundingClientRect().top -
        this.refAnimStarBucket.getBoundingClientRect().top
      starbucket_pos_y =
        starbucket_pos_y > 0
          ? starbucket_pos_y
          : starbucket_pos_y + -(el.getBoundingClientRect().height / 1.8)

      new TimelineMax({ repeat: 0 })
        //.set(this.refAnimStarBucket, { opacity: 1 })
        .to(this.refAnimStarBucket, 0.5, {
          x: starbucket_pos_x,
          y: starbucket_pos_y,
          width: starbucket_w,
          height: starbucket_h,
          fontSize: starbucket_h * 0.5,
          //zIndex: 151,
          ease: new Ease(BezierEasing(0.77, 0, 0.175, 1)),
          onComplete: () => {
            if (elAddStarButton) {
              elAddStarButton.style.pointerEvents = 'auto'
            }
            ReactDOM.unmountComponentAtNode(this.refAnimatingStarBucketWrapper)
            if (callback) {
              callback(true)
            }
          },
        })
      // .to(this.refAnimStarBucket, 0, {
      //   opacity: 0,
      //   onComplete: () => {
      //     //this.refAnimStarBucketToggle.progress(0).reverse()
      //     //this.refAnimStarBucket.style.opacity = 0
      //   },
      // })
    }
  }

  handleUnselectedClick(unselItem) {
    this.props.StarBoardStore.getStarPrizesByCategory(unselItem).then(
      response => {
        if (response) {
          this.item = unselItem
          this.selectedCat = (
            <StarCircle
              noText
              item={this.item}
              image={require(`@/assets/images/${this.props.StarBoardStore.url}${this.item.boardTypeId}-${this.item.boardImage}`)}
              borderColor={'#eede16'}
              fullSized
              refContainer={ref =>
                (this[
                  `selected-starcat-${this.item.boardTypeId}-${this.item.seasonGroup}`
                ] = ref)
              }
            />
          )
          if (this._isMounted) {
            this.forceUpdate()
          }
        }
      }
    )
  }

  rerenderThisCat(s) {
    const el = this[`unselected-starcat-${s.boardTypeId}-${s.seasonGroup}`]
    if (el && this.refCatsWrapper) {
      const pattern = this['line-1'].getBoundingClientRect()
      const line2 = this['line-2'].getBoundingClientRect()
      const posXV =
        pattern.left - (el.getBoundingClientRect().left + el.offsetHeight / 2.5)
      const posYV = pattern.top + el.offsetHeight / 5
      let stopper = pattern.right

      TweenMax.set(el, {
        opacity: 1,
        x:
          this.refCatsWrapper.offsetWidth -
          el.offsetLeft +
          el.offsetWidth * 1.5,
        y: '0%',
      })
      TweenMax.to(el, 5, {
        x: -line2.width,
        // onUpdate: () => {
        //   if ((el.getBoundingClientRect().left + (el.offsetHeight / 1.9)) <= stopper) {
        //     new TimelineMax({repeat: 0})
        //       .to(el, 1, {x:posXV, y: posYV})
        //       .to(el, 0.3, {opacity: 0, onComplete: () => {
        //
        //         this.rerenderThisCat(s)
        //
        //       } })
        //   }
        // }
      })
    }
  }

  insertNewUnselectedStarCat(lastCatInLine) {
    const pattern = this['line-1'].getBoundingClientRect()
    const line2 = this['line-2'].getBoundingClientRect()

    const el = this[
      `unselected-starcat-${this.item.boardTypeId}-${this.item.seasonGroup}`
    ]
    const elSelectedDiv = this[
      `unselected-starcat-div-${this.item.boardTypeId}-${this.item.seasonGroup}`
    ]
    if (el && elSelectedDiv) {
      new TimelineMax({ repeat: 0 })
        .set(el, { left: lastCatInLine.left - el.getBoundingClientRect().left })
        .to(elSelectedDiv, 0.3, { opacity: 1 })

      TweenMax.to(el, 8, {
        x: -line2.width,
      })
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return false
  // }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.props.StarBoardStore.getStarPrizesByCategory(this.item).then(
      response => {
        if (response) {
          if (this._isMounted) {
            this.forceUpdate()
          }
        }
      }
    )
  }

  handleUpdatePrizes(selectedStarCat) {
    this.props.StarBoardStore.getStarPrizesByCategory(selectedStarCat).then(
      response => {
        if (response) {
          if (this._isMounted) {
            this.forceUpdate()
          }
        }
      }
    )
  }

  render() {
    let { item } = this
    let { StarBoardStore, PrizeBoardStore } = this.props
    let { starPrizes, userPrize, starCategories, url } = StarBoardStore
    let { userPrizes } = PrizeBoardStore
    //let itemStadium = starCategories.filter(o => o.boardName.toLowerCase() === 'stadium')[0]

    // if (StarBoardStore.isLoading) {
    //   return <Container />
    // }
    return (
      <Container>
        <FadeIn>
          <Top>
            <Header
              key={`header-${item.prizeBoardId}-${item.seasonGroup}-${item.boardTypeId}`}
              item={item}
              updatePrizes={this.handleUpdatePrizes.bind(this)}
            />
            <SmallHeaderWrapper>
              <SmallHeader paddingRight={11}>promo</SmallHeader>
              <SmallHeader paddingRight={6}>req.</SmallHeader>
            </SmallHeaderWrapper>
          </Top>
          <ContentScrolling>
            <Content>
              {starPrizes && starPrizes.length > 0
                ? starPrizes.map(entry => {
                    let prize = null
                    if (userPrizes && userPrizes.length > 0) {
                      prize = userPrizes.filter(
                        o =>
                          o.prizeBoardId === entry.prizeBoardId &&
                          o.prizeBoardPrizeId === entry.prizeBoardPrizeId
                        //o.seasonId === entry.seasonId &&
                        //o.boardTypeId === entry.boardTypeId
                      )[0]
                    }
                    return (
                      <StarCategoryPrizeType
                        entry={entry}
                        userPrize={prize}
                        key={`${entry.prizeBoardPrizeId}-${entry.seasonId}${entry.boardTypeId}_starboard`}
                        //refRedeem={this.handleRedeemClick.bind(this, entry)}
                        refHideBanner={this.props.refHideBanner}
                        refHandleStarCounterPos={this.handleStarCounterPos.bind(
                          this
                        )}
                        timeStart={this.handleTimeStart.bind(
                          this,
                          `StarBoard-Category${this.item.boardName}-Prize${(
                            entry.title || ''
                          ).replace(/\s+/g, '')}`
                        )}
                        timeStop={this.handleTimeStop.bind(
                          this,
                          `StarBoard-Category${this.item.boardName}-PrizeList${(
                            entry.title || ''
                          ).replace(/\s+/g, '')}`
                        )}
                      />
                    )
                  })
                : null}
              <Dummy />
            </Content>
          </ContentScrolling>
          <Bottom>
            <StarBucket />
          </Bottom>
          <AnimatingStarBucketWrapper
            innerRef={ref => (this.refAnimatingStarBucketWrapper = ref)}
          >
            {/*
            <AnimatingStarBucket
              innerRef={ref => (this.refAnimStarBucket = ref)}
              font={'pamainextrabold'}
            >
              {1}
            </AnimatingStarBucket>
*/}
          </AnimatingStarBucketWrapper>
        </FadeIn>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-size: cover;
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  animation: ${props => fadeIn} 0.4s forwards;
  position: relative;
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Top = styled.div`
  position: relative;
  width: inherit;
  height: 30%;
  display: flex;
  flex-direction: column;
`

const StarCatUnselecteWrapper = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  align-items: center;
`

const CatsWrapper = styled.div`
  margin-left: 26%;
  width: 58%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
`

const StarCircleOuter = styled.div`
  width: 19%;
  margin-right: 10%;
`

const StarCatSelectedWrapper = styled.div`
  width: 100%;
  height: 52%;
  display: flex;
  flex-direction: row;
  padding: 0 5% 0 3%;
`

const ConnectingLine = styled.div`
  position: absolute;
  width: 1%;
  height: ${props => props.height}%;
  background-color: rgba(255, 255, 255, 0.4);
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  transform: rotate(${props => props.rotate}deg);
`

const ListConnectingLine = styled.div`
  position: absolute;
  width: ${props => props.width}%;
  height: ${props => props.height}%;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: rotate(${props => props.rotate}deg);
`

const DescWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 3%;
`

const SmallHeaderWrapper = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0.5% 0 1% 0;
  bottom: 0;
`

const SmallHeader = styled.span`
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(2.4)};
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: ${props => responsiveDimension(0.1)};
  //padding-left: ${props => responsiveDimension(props.paddingLeft || 0)};
  //padding-right: ${props => responsiveDimension(props.paddingRight || 0)};
  padding-left: ${props => props.paddingLeft || 0}%;
  padding-right: ${props => props.paddingRight || 0}%;
`

const ContentScrolling = styled.div`
  position: relative;
  width: inherit;
  height: 70%;
  display: flex;
  //margin-top: ${props => props.marginTop || '12%'};
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

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  height: 13%;
  display: flex;
  //background: linear-gradient(0deg, rgba(0,0,0,1) 35%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0) 100%);
  bottom: 0;
  z-index: 150;
`

const AnimatingStarBucketWrapper = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(11)};
  height: ${props => responsiveDimension(11)};
  display: flex;
  left: 50%;
  bottom: ${props => responsiveDimension(0)};
  transform: translateX(-50%);
`

const AnimatingStarBucket = styled.div`
  position: absolute;
  width: ${props => responsiveDimension(11)};
  height: ${props => responsiveDimension(11)};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${StarIconDarkGoldBorder});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 50%;
  bottom: ${props => responsiveDimension(0)};
  transform: translateX(-50%);
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(11 * 0.5)};
  color: #eede16;
  padding-top: 5%;
  z-index: 151;
  opacity: 1;
`

const SelectedCatWrapper = styled.div`
  width: 23%;
  min-width: 23%;
  height: 0;
  padding-bottom: 23%;
  border-radius: 50%;
  background-color: maroon;
`

const HeaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

@inject('StarBoardStore', 'AnalyticsStore')
class Header extends Component {
  constructor(props) {
    super(props)
    this.selectedCat = null
    this.item = this.props.item
    this._isMounted = false
    this.starCategories = this.props.StarBoardStore.starCategories
  }

  async handleUnselectedClick(selectedItem) {
    console.log('XXXXXXXXX', selectedItem.prizeBoardId, this.item)

    this.props.StarBoardStore.getStarPrizesByCategory(selectedItem)

    const _currentItem = JSON.parse(JSON.stringify(this.item))
    this.props.AnalyticsStore.timeStop({
      page: `StarBoard-CategoryPrizeList-${_currentItem.boardName.replace(
        /\s+/g,
        ''
      )}`,
    })

    this.props.AnalyticsStore.timeStart({
      page: `StarBoard-CategoryPrizeList-${selectedItem.boardName.replace(
        /\s+/g,
        ''
      )}`,
    })

    this.item = selectedItem
    let boardImage = null
    try {
      boardImage = evalImage(
        `${this.props.StarBoardStore.url}${this.item.boardTypeId}-${this.item
          .boardImage || 'featured.jpg'}`
      )
      if (!boardImage) {
        boardImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${this.item.boardImage}`
      }
    } catch (e) {
      boardImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${this.item.boardImage}`
    }
    this.selectedCat = (
      <StarCircle
        noText
        item={this.item}
        image={boardImage}
        borderColor={'#eede16'}
        fullSized
        refContainer={ref =>
          (this[
            `selected-starcat-${this.item.boardTypeId}-${this.item.seasonGroup}`
          ] = ref)
        }
      />
    )

    /**
     * category sequencing
     **/
    const tmpStarCat = []
    const len = this.props.StarBoardStore.starCategories.length
    let seq = selectedItem.sequence
    const active = await this.props.StarBoardStore.starCategories.filter(
      o => o.sequence === seq
    )[0]
    if (active) {
      await tmpStarCat.push(active)
    }
    for (let i = 0; i < len; i++) {
      if (seq > len) {
        seq = 1
        const a = await this.props.StarBoardStore.starCategories.filter(
          o => o.sequence === seq
        )[0]
        if (a) {
          await tmpStarCat.push(a)
        }
      } else {
        seq += 1
        const a = await this.props.StarBoardStore.starCategories.filter(
          o => o.sequence === seq
        )[0]
        if (a) {
          await tmpStarCat.push(a)
        }
      }
    }
    this.starCategories = tmpStarCat
    /**
     * end category sequencing
     **/

    if (this.props.updatePrizes) {
      this.props.updatePrizes(selectedItem)
    }

    if (this._isMounted) {
      this.forceUpdate()
    }
  }

  componentWillUnmount() {
    this.props.AnalyticsStore.timeStop({
      page: `StarBoard-CategoryPrizeList-${this.item.boardName.replace(
        /\s+/g,
        ''
      )}`,
    })
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    let { item } = this
    let { StarBoardStore, updatePrizes } = this.props

    this.props.AnalyticsStore.timeStart({
      page: `StarBoard-CategoryPrizeList-${item.boardName.replace(/\s+/g, '')}`,
    })

    let boardImage = null
    try {
      boardImage = require(`@/assets/images/${StarBoardStore.url}${
        item.boardTypeId
      }-${item.boardImage || 'featured.jpg'}`)
    } catch (e) {
      boardImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${item.boardImage}`
    }

    this.selectedCat = (
      <StarCircle
        noText
        item={item}
        image={boardImage}
        borderColor={'#eede16'}
        fullSized
        refContainer={ref =>
          (this[
            `selected-starcat-${item.boardTypeId}-${item.seasonGroup}`
          ] = ref)
        }
      />
    )

    if (this._isMounted) {
      this.forceUpdate()
    }
  }

  render() {
    let { item, starCategories } = this
    let { url } = this.props.StarBoardStore
    let itemStadium = starCategories.filter(
      o => (o.boardName || '').toLowerCase() === 'stadium'
    )[0]

    return (
      <HeaderContainer>
        <ListConnectingLine
          key={'line-1'}
          width={27}
          height={3}
          left={IsMobile ? 7 : 9}
          top={42}
          rotate={IsMobile ? -49 : -45}
          innerRef={ref => (this['line-1'] = ref)}
        />
        <StarCatUnselecteWrapper>
          {/*<StarCatUnselected sel={item} unsel={starCategories} url={url} />*/}
          <div
            id={'unselected-container'}
            style={{
              width: '100%',
              display: 'flex',
            }}
          >
            {/*
            <StarCircleStadium
              onClick={this.handleUnselectedClick.bind(this, itemStadium)}
            />
*/}
            <CatsWrapper innerRef={ref => (this.refCatsWrapper = ref)}>
              <ListConnectingLine
                key={'line-2'}
                width={(starCategories.length - 1) * 29 - 29}
                height={11}
                left={9}
                top={45}
                innerRef={ref => (this['line-2'] = ref)}
              />
              {starCategories.map(unselItem => {
                let boardImage = null
                try {
                  boardImage = require(`@/assets/images/${url}${
                    unselItem.boardTypeId
                  }-${unselItem.boardImage || 'featured.jpg'}`)
                } catch (e) {
                  boardImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${unselItem.boardImage}`
                }
                return unselItem.boardTypeId == item.boardTypeId ? null : (
                  <StarCircleOuter
                    key={`${unselItem.boardTypeId}-${unselItem.seasonGroup}`}
                  >
                    <StarCircle
                      noText
                      item={unselItem}
                      image={boardImage}
                      borderColor={'#ffffff'}
                      borderWidth={0.33}
                      hoverBorderColor={'#eede16'}
                      fullSized
                      refContainer={ref =>
                        (this[
                          `unselected-starcat-${unselItem.boardTypeId}-${unselItem.seasonGroup}`
                        ] = ref)
                      }
                      refClick={this.handleUnselectedClick.bind(
                        this,
                        unselItem
                      )}
                    />
                  </StarCircleOuter>
                )
              })}
            </CatsWrapper>
          </div>
        </StarCatUnselecteWrapper>
        <StarCatSelectedWrapper>
          <SelectedCatWrapper>{this.selectedCat}</SelectedCatWrapper>
          {/*
              <StarCircle
                item={item}
                image={require(`@/assets/images/${url}${item.boardTypeId}-${item.boardImage}`)}
                borderColor={'#eede16'}
                size={23}
                refContainer={ref =>
                  (this[
                    `selected-starcat-${item.boardTypeId}-${item.seasonGroup}`
                  ] = ref)
                }
              />
*/}
          <DescWrapper>
            <Text font={'pamainlight'} color={'#eede16'} size={6} uppercase>
              {item.boardName}
            </Text>
            <Text font={'pamainregular'} color={'#ffffff'} size={2.5} uppercase>
              {item.subTitle}
            </Text>
          </DescWrapper>
        </StarCatSelectedWrapper>
      </HeaderContainer>
    )
  }
}
