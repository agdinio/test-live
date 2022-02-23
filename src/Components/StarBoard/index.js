import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import Background from '@/assets/images/playalong-default.jpg'
import { extendObservable, runInAction, intercept } from 'mobx'
import { inject, observer } from 'mobx-react'
import { TweenMax, TimelineMax, Linear } from 'gsap'
import {
  vhToPx,
  isEqual,
  evalImage,
  loadImagesSelectedUponPageLoad,
  responsiveDimension,
} from '@/utils'
import StarIconDarkGoldBorder from '@/assets/images/star-icon-dark-gold-border.svg'
import StarIconSelected from '@/assets/images/star-icon-selected.svg'
import SmallStadiumIcon from '@/assets/images/starboard/stadium.svg'
import PolygonIcon from '@/assets/images/star-category-diamond.svg'
import { StarCircle } from '@/Components//StarBoard/StarCategory'
import { PACircle } from '@/Components/PACircle'
import StarCategoryPrizeList from '@/Components/StarBoard/StarCategoryPrizeList'
import AuthSequence from '@/Components/PrizeBoard/PrizeList/Auth'
import { eventCapture } from '../Auth/GoogleAnalytics'

const itemPos = {
  1: [
    {
      top: -58,
      left: 0,
    },
  ],
  2: [
    {
      top: -58,
      left: 0,
    },
    {
      top: 58,
      left: 0,
    },
  ],
  3: [
    {
      top: -58,
      left: 0,
    },
    {
      top: 0,
      left: 0,
    },
    {
      top: 58,
      left: 0,
    },
  ],
  4: [
    {
      top: -58,
      left: 0,
    },
    {
      top: 0,
      left: -49,
    },
    {
      top: 58,
      left: 0,
    },
    {
      top: 0,
      left: 49,
    },
  ],
}

@inject(
  'StarBoardStore',
  'PrizeBoardStore',
  'ProfileStore',
  'NavigationStore',
  'AnalyticsStore'
)
@observer
export default class StarBoard extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      initialSelect: false,
      finalSelect: false,
    })
    //this.props.StarBoardStore.getStarCategories()
    //this.props.StarBoardStore.getStarPrizesByUser()
    //this.props.ProfileStore.getProfile()

    // this.props.StarBoardStore.resetLocalStar()
    // this.props.StarBoardStore.creditLocalStar(
    //   this.props.ProfileStore.profile.currencies.stars
    // )

    this._isMounted = false
    this.timeout = null
    this.timeoutStarOpacity = []
    this.state = {
      starCategories: null,
      isSelected: false,
    }

    this.destroySubScreensIntercept = null
    if (!this.props.isSubScreen) {
      this.destroySubScreensIntercept = intercept(
        this.props.NavigationStore,
        'subScreens',
        change => {
          if (this._isMounted) {
            this.forceUpdate()
          }
          return change
        }
      )
    }
  }

  clearTimeoutStarOpacity() {
    if (this.timeoutStarOpacity) {
      for (let x = 0; x < this.timeoutStarOpacity.length; x++) {
        clearTimeout(this.timeoutStarOpacity[x])
      }
      this.timeoutStarOpacity = []
    }
  }

  handleStarCatClick(item) {
    this.clearTimeoutStarOpacity()
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    const polygon = document.getElementById('polygon')
    if (!polygon) {
      return
    }

    let { starCategories } = this.props.StarBoardStore
    const duration = 1500
    this.initialSelect = true

    for (let i = 0; i < starCategories.length; i++) {
      const uid = `${starCategories[i].boardTypeId}-${starCategories[i].seasonGroup}`
      const el = document.getElementById(`starcat-${uid}`)
      if (el) {
        if (`${item.boardTypeId}-${item.seasonGroup}` === uid) {
          this.setState({ isSelected: true })
          if (this[`starlabel-${uid}`]) {
            this[`starlabel-${uid}`].style.color = '#eede16'
          }

          el.style.zIndex = 10
          el.style.transition = 'all 0.4s linear'
          el.style.transform = 'scale(2.5) translate(-50%, -50%)'
          polygon.style.transition = 'all 0.4s linear'
          polygon.style.transform = 'scale(0.5)'

          let refStarBucketToggle = null
          if (this.refStarBucket) {
            refStarBucketToggle = TweenMax.to(this.refStarBucket, 0.4, {
              top: '52%',
            })
          }

          setTimeout(() => {
            let comp = (
              <StarCategoryPrizeList
                key={`${item.boardTypeId}-${item.seasonGroup}`}
                item={item}
                refHideBanner={this.props.refHideBanner}
              />
            )
            this.props.NavigationStore.addSubScreen(
              comp,
              'StarBoard-CategoryPrizeList'
            )

            /**
             * start - put all animations to default
             */
            if (this[`starcircle-selected-${uid}`]) {
              TweenMax.set(this[`starcircle-selected-${uid}`], { opacity: 0 })
            }

            refStarBucketToggle.reverse()
            this.handleStarCatUnHover()
            this.setState({ isSelected: false })
            /**
             *  end - put all animations to default
             */
          }, duration)
        } else {
          el.style.zIndex = 9
          if (this[`starcircle-${uid}`]) {
            this[`starcircle-${uid}`].style.opacity = 0.5
          }

          if (this[`starlabel-${uid}`]) {
            this[`starlabel-${uid}`].style.opacity = 0
          }
          this.timeoutStarOpacity[
            this.timeoutStarOpacity.length++
          ] = setTimeout(() => {}, duration)
        }
      }
    }

    eventCapture('starboard', item) // select the starboard
  }

  handleStarCatHover(order) {
    if (!this.initialSelect) {
      this.clearTimeoutStarOpacity()
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    }

    if (this.initialSelect) {
      this.handleStarCatUnHover(order)
    }

    const polygon = document.getElementById('polygon')
    if (!polygon) {
      return
    }

    let { starCategories } = this.props.StarBoardStore

    for (let i = 0; i < starCategories.length; i++) {
      const uid = `${starCategories[i].boardTypeId}-${starCategories[i].seasonGroup}`

      if (order === uid) {
        const el = document.getElementById(`starcat-${uid}`)

        if (this[`starcircle-${uid}`]) {
          this[`starcircle-${uid}`].style.opacity = 1
        }
        if (this[`starlabel-${uid}`]) {
          this[`starlabel-${uid}`].style.color = '#eede16'
        }

        if (el) {
          el.style.transition = 'all 0.2s linear'
          el.style.transform = 'scale(1.2) translate(-50%, -50%)'
          polygon.style.transition = 'all 0.2s linear'
          polygon.style.transform = 'scale(0.9)'
        }

        if (this[`starcircle-selected-${uid}`]) {
          TweenMax.to(this[`starcircle-selected-${uid}`], 0.2, { opacity: 1 })
        }
      }
    }
  }

  handleStarCatUnHover(order) {
    if (!this.initialSelect) {
      this.clearTimeoutStarOpacity()
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    }

    const polygon = document.getElementById('polygon')
    if (!polygon) {
      return
    }
    polygon.style.transition = 'all 0.2s linear'
    polygon.style.transform = 'scale(1)'

    let { starCategories } = this.props.StarBoardStore

    for (let i = 0; i < starCategories.length; i++) {
      const uid = `${starCategories[i].boardTypeId}-${starCategories[i].seasonGroup}`
      const el = document.getElementById(`starcat-${uid}`)
      if (el) {
        if (!this.initialSelect) {
          el.style.zIndex = 9
        }
        el.style.transition = 'all 0.2s linear'
        el.style.transform = 'scale(1) translate(-50%, -50%)'
        if (this[`starcircle-${uid}`]) {
          this[`starcircle-${uid}`].style.opacity = 1
        }
        if (this[`starlabel-${uid}`]) {
          this[`starlabel-${uid}`].style.color = '#ffffff'
        }
      }

      if (this[`starcircle-selected-${uid}`]) {
        TweenMax.to(this[`starcircle-selected-${uid}`], 0.3, { opacity: 0 })
      }
    }
  }

  loginFirst() {
    let comp = (
      <AuthSequence refGotoPrizeTermClaims={this.handleLoggedIn.bind(this)} />
    )
    this.props.NavigationStore.addSubScreen(comp, 'AuthSequence', true)
  }

  handleLoggedIn() {
    this.props.NavigationStore.removeSubScreen('AuthSequence')
    this.props.StarBoardStore.getStarPrizes()
    //this.props.StarBoardStore.getStarPrizesByUser()

    //TEMPORARY - CODE_SERVER.JS
    // if (
    //   !this.props.StarBoardStore.userPrize &&
    //   this.props.ProfileStore.profile.currencies &&
    //   this.props.ProfileStore.profile.currencies.stars <= 0
    // ) {
    //   runInAction(() => (this.props.ProfileStore.profile.currencies.stars = 20))
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.state.starCategories, nextState.starCategories)) {
      return true
    }

    if (this.state.isSelected != nextState.isSelected) {
      return true
    }

    return false
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload, true)
    this.props.AnalyticsStore.timeStop({ page: 'StarBoard', isMainPage: true })

    if (!this.props.isSubScreen) {
      this.props.NavigationStore.setActiveMenu(null)
      this.props.NavigationStore.resetSubScreens()
    }
    if (this.destroySubScreensIntercept) {
      this.destroySubScreensIntercept()
    }
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true

    window.addEventListener('beforeunload', this.handleUnload.bind(this), true)
    this.props.AnalyticsStore.timeStart({ page: 'StarBoard', isMainPage: true })

    if (!this.props.isSubScreen) {
      this.props.NavigationStore.setActiveMenu(
        this.props.NavigationStore.location
      )
    }
    this.props.StarBoardStore.getStarCategories().then(res => {
      if (res) {
        let images = []
        res.forEach((star, idx) => {
          let img = null
          try {
            img = evalImage(
              `${this.props.StarBoardStore.url}${
                star.boardTypeId
              }-${star.boardImage || 'featured.jpg'}`
            )
            if (!img) {
              img = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${star.boardImage}`
            }
            images.push(img)
          } catch (e) {
            img = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${star.boardImage}`
            images.push(img)
          }

          star.sequence = idx + 1
        })

        loadImagesSelectedUponPageLoad(images, next => {
          if (next) {
            if (this.refLoader) {
              this.refLoader.style.zIndex = -100
            }
            this.setState({ starCategories: res })
            //this.props.StarBoardStore.getStarPrizesByUser()
          }
        })
      }
    })
  }

  handleUnload(e) {
    e.preventDefault()
    this.props.AnalyticsStore.timeStop({
      page: 'StarBoard',
      isMainPage: true,
      isUnload: true,
    })
  }

  render() {
    let { ProfileStore, StarBoardStore } = this.props
    let { profile } = ProfileStore
    let { url } = StarBoardStore
    let { starCategories } = this.state
    /*
    if (ProfileStore.isLoading) {
      return (
        <Container />
      )
    }
*/

    /*
    if (StarBoardStore.isLoading) {
      return (
        <Container />
      )
    }
*/

    /*
        if (!profile.userId) {
          this.loginFirst()
          return (
            <Container />
          )
        }
    */

    if (!this.state.starCategories) {
      return (
        <Container>
          <Loader innerRef={ref => (this.refLoader = ref)}>
            <PACircle size={8} />
          </Loader>
        </Container>
      )
    }

    return (
      <Container>
        <FadeIn>
          <Content>
            <Section>
              <Text font={'pamainbold'} size={5.5} color={'#ffffff'} uppercase>
                star board
              </Text>
            </Section>
            <Section>
              <Text font={'pamainlight'} size={4.7} color={'#eede16'} uppercase>
                choose any category
              </Text>
            </Section>
            <Section
              marginTop={5}
              style={{ width: '100%', alignItems: 'center' }}
            >
              <PolygonWrapper id={'polygon'}>
                {starCategories.map((star, idx) => {
                  const uid = `${star.boardTypeId}-${star.seasonGroup}`
                  const len = starCategories.length
                  let boardImage = null
                  try {
                    boardImage = evalImage(
                      `${url}${star.boardTypeId}-${star.boardImage ||
                        'featured.jpg'}`
                    )
                    if (!boardImage) {
                      boardImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${star.boardImage}`
                    }
                  } catch (e) {
                    boardImage = `${process.env.REACT_APP_SERVER_URL}/${process.env.REACT_APP_SERVER_IMAGE_FOLDER}/${star.boardImage}`
                  }
                  return (
                    <StarCircleWrapOuter
                      key={uid}
                      top={itemPos[len][idx].top}
                      left={itemPos[len][idx].left}
                      id={`starcat-${uid}`}
                    >
                      <StarCircleWrap>
                        <StarCircle
                          reference={ref => (this[`starcircle-${uid}`] = ref)}
                          item={star}
                          image={boardImage}
                          borderColor={
                            star.boardName.match(new RegExp('ambassador', 'gi'))
                              ? '#000000'
                              : '#a6aaad'
                          }
                          hoverBorderColor={'#eede16'}
                          fullSized
                        />
                        <StarCircleSelected
                          innerRef={ref =>
                            (this[`starcircle-selected-${uid}`] = ref)
                          }
                          onClick={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatClick.bind(this, star)
                          }
                          onMouseOver={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatHover.bind(this, uid)
                          }
                          onMouseOut={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatUnHover.bind(this, uid)
                          }
                        />
                      </StarCircleWrap>
                    </StarCircleWrapOuter>
                  )
                })}
              </PolygonWrapper>
              {/*
              <PolygonWrapper id={'polygon'}>
                {starCategories.map((star, idx) => {
                  const uid = `${star.boardTypeId}-${star.seasonGroup}`
                  return idx <= 2 ? (
                    <StarWrapper
                      key={`${uid}`}
                      top={star.top}
                      left={star.left}
                      id={`starcat-${uid}`}
                    >
                      <StarLabel
                        marginBottom={0.2}
                        innerRef={ref => (this[`starlabel-${uid}`] = ref)}
                      >
                        {star.boardName}
                      </StarLabel>
                      <StarCircleWrap>
                        <StarCircle
                          reference={ref => (this[`starcircle-${uid}`] = ref)}
                          item={star}
                          image={require(`@/assets/images/${url}${star.boardTypeId}-${
                            star.boardImage
                          }`)}
                          borderColor={'#a6aaad'}
                          hoverBorderColor={'#eede16'}
                          fullSized
                        />
                        <StarCircleSelected
                          innerRef={ref =>
                            (this[`starcircle-selected-${uid}`] = ref)
                          }
                          onClick={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatClick.bind(this, star)
                          }
                          onMouseOver={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatHover.bind(this, uid)
                          }
                          onMouseOut={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatUnHover.bind(this, uid)
                          }
                        />
                      </StarCircleWrap>
                    </StarWrapper>
                  ) : idx <= 4 ? (
                    <StarWrapper
                      key={`${uid}`}
                      top={star.top}
                      left={star.left}
                      id={`starcat-${uid}`}
                    >
                      <StarCircleWrap>
                        <StarCircle
                          reference={ref => (this[`starcircle-${uid}`] = ref)}
                          item={star}
                          image={require(`@/assets/images/${url}${star.boardTypeId}-${
                            star.boardImage
                          }`)}
                          borderColor={'#a6aaad'}
                          hoverBorderColor={'#eede16'}
                          fullSized
                        />
                        <StarCircleSelected
                          innerRef={ref =>
                            (this[`starcircle-selected-${uid}`] = ref)
                          }
                          onClick={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatClick.bind(this, star)
                          }
                          onMouseOver={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatHover.bind(this, uid)
                          }
                          onMouseOut={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatUnHover.bind(this, uid)
                          }
                        />
                      </StarCircleWrap>
                      <StarLabel
                        marginTop={0.8}
                        innerRef={ref => (this[`starlabel-${uid}`] = ref)}
                      >
                        {star.boardName}
                      </StarLabel>
                    </StarWrapper>
                  ) : star.isGeo ? (
                    <StarWrapper
                      key={`${uid}`}
                      top={star.top}
                      left={star.left}
                      id={`starcat-${uid}`}
                    >
                      <StarCircleWrap>
                        <StarCircle
                          reference={ref => (this[`starcircle-${uid}`] = ref)}
                          item={star}
                          image={require(`@/assets/images/${url}${star.boardTypeId}-${
                            star.boardImage
                          }`)}
                          borderColor={'#ffffff'}
                          hoverBorderColor={'#eede16'}
                          fullSized
                          imageAlpha={0.5}
                        />
                        <StadiumWrapper
                          onClick={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatClick.bind(this, star)
                          }
                          onMouseOver={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatHover.bind(this, uid)
                          }
                          onMouseOut={
                            this.state.isSelected
                              ? null
                              : this.handleStarCatUnHover.bind(this, uid)
                          }
                        >
                          <StadiumIconAndLabel>
                            <SIALInnerWrapper
                              alignItems={'flex-end'}
                              paddingBottom={1.5}
                            >
                              <StadiumIcon />
                            </SIALInnerWrapper>
                            <SIALInnerWrapper
                              alignItems={'flex-start'}
                              paddingTop={1.5}
                            >
                              <StarLabel
                                // style={{
                                //   position: 'absolute',
                                //   left: '50%',
                                //   top: '50%',
                                //   transform: 'translate(-50%,-50%)',
                                // }}
                                innerRef={ref =>
                                  (this[`starlabel-${uid}`] = ref)
                                }
                              >
                                {star.boardName}
                              </StarLabel>
                            </SIALInnerWrapper>
                          </StadiumIconAndLabel>
                          <StarCircleSelected
                            innerRef={ref =>
                              (this[`starcircle-selected-${uid}`] = ref)
                            }
                          />
                        </StadiumWrapper>
                      </StarCircleWrap>
                    </StarWrapper>
                  ) : null
                })}
              </PolygonWrapper>
*/}
            </Section>
          </Content>
          <Bottom>
            <StarBucketLocal reference={ref => (this.refStarBucket = ref)} />
          </Bottom>
        </FadeIn>
        {!this.props.isSubScreen
          ? this.props.NavigationStore.subScreens.map(comp => {
              return comp
            })
          : null}
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
  display: flex;
`

const FadeIn = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  animation: ${props => fadeIn} 0.4s forwards;
`

const fadeIn = keyframes`
  0%{opacity: 0;}
  100%{opacity: 1;}
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${props => vhToPx(props.marginTop || 0)};
  margin-bottom: ${props => vhToPx(props.marginBottom || 0)};
`

const StarWrapper = styled.div`
  position: absolute;
  width: 48%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: ${props => props.top || 0}%;
  margin-left: ${props => props.left || 0}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
  transition: all 0.2s linear;
  transform-origin: left top;
  z-index: 9;
`

const StarCircleWrapOuter = styled.div`
  position: absolute;
  width: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: ${props => props.top || 0}%;
  margin-left: ${props => props.left || 0}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
  transition: all 0.2s linear;
  transform-origin: left top;
  z-index: 9;
`

const StarCircleWrap = styled.div`
  position: relative;
  width: 100%;
  min-width: 100%;
  height: 0;
  padding-bottom: 100%;
  display: flex;
`

const StadiumWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const StarCircleSelected = styled.div`
  position: absolute;
  width: 107%;
  height: 107%;
  background-image: url(${StarIconSelected});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1};
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(0.1)};
`

const Content = styled.div`
  width: 100%;
  height: 80%
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20%;
`

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  height: 20%;
  display: flex;
  bottom: 0;
`

const PolygonWrapper = styled.div`
  width: 50%;
  padding-bottom: 60%;
  background-image: url(${PolygonIcon});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: relative;
  margin-top: 10%;
  margin-bottom: 20%;
  transform-style: preserve-3d;
  transition: all 0.2s linear;
`

const StadiumIconAndLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const SIALInnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: ${props => props.alignItems};
  padding-top: ${props => props.paddingTop || 0}%;
  padding-bottom: ${props => props.paddingBottom || 0}%;
`

const StadiumIcon = styled.div`
  width: 25%;
  height: 0;
  padding-bottom: 25%;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    border-radius: 50%;
    border: ${props => responsiveDimension(0.2)} solid #ffffff;
  }
  &:after {
    position: absolute;
    content: '';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${SmallStadiumIcon});
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: center;
  }
`

const StarLabel = styled.span`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(4)};
  color: ${props => props.color || '#ffffff'};
  text-transform: uppercase;
  line-height: 1;
  margin-top: ${props => responsiveDimension(props.marginTop || 0)};
  margin-bottom: ${props => responsiveDimension(props.marginBottom || 0)};
  transform-style: preserve-3d;
  transition: all 0.4s linear;
`

const Loader = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`

const BottomStar = styled.div`
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
  top: 50%;
  transform: translate(-50%, -25%);
  font-family: ${props => props.font};
  font-size: ${props => responsiveDimension(props.fontSize * 0.5)};
  color: #eede16;
  padding-top: ${props => responsiveDimension(1)};
`

const SBContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 30%;
`

const HalfCircle = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    width: ${props => responsiveDimension(20)};
    height: ${props => responsiveDimension(20)};
    border-radius: 50%;
    background-color: #eede16;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 10%);
    -webkit-appearance: none;
    -webkit-box-shadow: 0 0 ${responsiveDimension(4)} ${responsiveDimension(4)}
      rgba(0, 0, 0, 1);
    -moz-box-shadow: 0 0 ${responsiveDimension(4)} ${responsiveDimension(4)}
      rgba(0, 0, 0, 1);
    box-shadow: 0 0 ${responsiveDimension(4)} ${responsiveDimension(4)}
      rgba(0, 0, 0, 1);
  }
`

const Caption = styled.div`
  position: absolute;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(3)};
  color: #231f20;
  text-transform: uppercase;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 190%);
`

@inject('ProfileStore')
@observer
class StarBucketLocal extends Component {
  render() {
    let { ProfileStore, reference } = this.props
    let { profile } = ProfileStore

    return (
      <SBContainer innerRef={reference}>
        <HalfCircle>
          <Caption>use your stars</Caption>
        </HalfCircle>
        <BottomStar
          innerRef={this.props.reference}
          font={
            profile.currencies.stars.toString().length == 1
              ? 'pamainextrabold'
              : profile.currencies.stars.toString().length == 2
              ? 'pamainbold'
              : profile.currencies.stars.toString().length == 3
              ? 'pamainregular'
              : 'pamainlight'
          }
          fontSize={
            profile.currencies.stars.toString().length == 1
              ? 11
              : profile.currencies.stars.toString().length == 2
              ? 10
              : profile.currencies.stars.toString().length == 3
              ? 9
              : 8
          }
        >
          {profile.currencies.stars}
        </BottomStar>
      </SBContainer>
    )
  }
}
