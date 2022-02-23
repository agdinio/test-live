import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable, intercept } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension, evalImage } from '@/utils'
import BillingDetails from '@/Components/Payment/BillingDetails'
import PaymentDetails from '@/Components/Payment/PaymentDetails'
import ActivityLoader from '@/Components/Common/ActivityLoader'

@inject('ProfileStore', 'NavigationStore', 'CommonStore')
@observer
export default class Payment extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    extendObservable(this, {
      popupMessage: null,
      breadCrumbObjects: [
        {
          name: 'BillingDetails',
          text: 'billing details',
          isActive: true,
          activeColor: '#ffffff',
          inActiveColor: '#bcbec0',
          activeBackgroundColor: '#19c5ff',
          inActiveBackgroundColor: '#414042',
          topRightRadius: true,
          bottomRightRadius: true,
          topLeftRadius: false,
          bottomLeftRadius: false,
        },
        {
          name: 'PaymentDetails',
          text: 'payment details',
          isActive: false,
          activeColor: '#ffffff',
          inActiveColor: '#bcbec0',
          activeBackgroundColor: '#19c5ff',
          inActiveBackgroundColor: '#f1f2f2',
          topRightRadius: false,
          bottomRightRadius: false,
          topLeftRadius: true,
          bottomLeftRadius: true,
        },
      ],
    })

    this.breadCrumbScreens = { BillingDetails, PaymentDetails }

    this.breadCrumbWrapBackgroundColor = '#f1f2f2'

    //this.props.CommonStore.readCountries()
    this.props.CommonStore.readPaymentInfo({
      userId: this.props.ProfileStore.profile.userId,
    })

    this.destroyZoneLoading = intercept(
      this.props.CommonStore,
      'isLoadingZone',
      change => {
        if (change.newValue) {
          this.popupMessage = (
            <ActivityLoader
              backgroundColor={'rgba(0,0,0, 0.9)'}
              message="loading state/zone/city..."
            />
          )
        } else {
          this.popupMessage = null
        }
        return change
      }
    )
  }

  componentWillUnmount() {
    this.destroyZoneLoading()
    if (this._isMounted) {
      if (this.props.timeStop) {
        this.props.timeStop()
      }
    }
  }

  handleGoBackToMain() {
    this.props.NavigationStore.resetSubScreens()
  }

  handleError(errors) {
    this.popupMessage = (
      <ErrorMessageComp
        items={errors}
        close={this.handleCloseErrorMessage.bind(this)}
      />
    )
  }

  handleCloseErrorMessage() {
    this.popupMessage = null
  }

  handleNext(prevScreen, nextScreen) {
    const breadCrumbScreen = this.breadCrumbScreens[nextScreen]
    const prevBreadCrumbObj = this.breadCrumbObjects.filter(
      o => o.name === prevScreen
    )[0]
    const nextBreadCrumbObj = this.breadCrumbObjects.filter(
      o => o.name === nextScreen
    )[0]

    if (breadCrumbScreen) {
      if (prevBreadCrumbObj) {
        prevBreadCrumbObj.isActive = false
        this.breadCrumbWrapBackgroundColor =
          prevBreadCrumbObj.inActiveBackgroundColor
      }

      if (nextBreadCrumbObj) {
        nextBreadCrumbObj.isActive = true
      }

      if (this.refBillingDetails) {
        this.refBillingDetails.style.zIndex = 0
      }
      if (this.refPaymentDetails) {
        this.refPaymentDetails.style.zIndex = 10
      }
    }
  }

  handlePurchaseClick(args) {
    this.popupMessage = (
      <ActivityLoader
        backgroundColor={'rgba(0,0,0, 0.9)'}
        message="processing request"
      />
    )

    this.props.ProfileStore.paymentToken(args)
      .then(async data => {
        // if (new RegExp('error', 'gi').test(data)) {
        // } else {
        // }
        if (data) {
          if ('success' === data) {
            this.popupMessage = null
            this.props.success(args)
            // const tokens = (await this.props.item.tokens)
            //   ? isNaN(this.props.item.tokens.toString())
            //     ? 0
            //     : parseInt(this.props.item.tokens)
            //   : 0
            // const bonusTokens = (await this.props.item.bonusTokens)
            //   ? isNaN(this.props.item.bonusTokens.toString())
            //     ? 0
            //     : parseInt(this.props.item.bonusTokens)
            //   : 0
            // this.props.ProfileStore.profile.currencies.tokens += await (tokens +
            //   bonusTokens)
            //
            // this.popupMessage = (
            //   <TokenPurchased
            //     item={this.props.item}
            //     profile={this.props.ProfileStore.profile}
            //     goBackToMain={this.handleGoBackToMain.bind(this)}
            //   />
            // )
          } else {
            this.popupMessage = (
              <CardDeniedMessageComp
                message={data}
                close={this.handleCloseErrorMessage.bind(this)}
              />
            )
          }
        }
      })
      .catch(err => {
        this.popupMessage = (
          <CardDeniedMessageComp
            message={err}
            close={this.handleCloseErrorMessage.bind(this)}
          />
        )
      })
  }

  handleBreadCrumbClick(name) {
    // const breadCrumbScreen = this.breadCrumbScreens[name]
    // const selectedObj = this.breadCrumbObjects.filter(o => o.name === name)[0]
    // const activeObj = this.breadCrumbObjects.filter(o => o.isActive)[0]
    //
    // if (breadCrumbScreen) {
    //   if (activeObj) {
    //     activeObj.isActive = false
    //   }
    //
    //   if (selectedObj) {
    //     selectedObj.isActive = true
    //   }
    //
    // }
  }

  componentDidMount() {
    this._isMounted = true
    if (this.refBillingDetails) {
      this.refBillingDetails.style.zIndex = 10
    }
    if (this.refPaymentDetails) {
      this.refPaymentDetails.style.zIndex = 0
    }

    //    this.popupMessage = (<TokenPurchased item={this.props.item} profile={this.props.ProfileStore.profile} close={this.handleCloseErrorMessage.bind(this)} />)

    // this.popupMessage = (
    //   <CardDeniedMessageComp close={this.handleCloseErrorMessage.bind(this)} />
    // )
    if (this._isMounted) {
      if (this.props.timeStart) {
        this.props.timeStart()
      }
    }
  }

  render() {
    let { item, CommonStore } = this.props

    if (CommonStore.isLoading) {
      return (
        <ActivityLoader
          backgroundColor={'#000'}
          message="loading required data..."
        />
      )
    }

    return (
      <Container>
        {this.popupMessage}

        <BreadCrumbWrap backgroundColor={this.breadCrumbWrapBackgroundColor}>
          {this.breadCrumbObjects.map(scr => {
            return (
              <BreadCrumb
                key={scr.text}
                text={scr.text}
                color={scr.isActive ? scr.activeColor : scr.inActiveColor}
                scale={scr.isActive ? 1 : 0.8}
                topRightRadius={scr.topRightRadius}
                bottomRightRadius={scr.bottomRightRadius}
                topLeftRadius={scr.topLeftRadius}
                bottomLeftRadius={scr.bottomLeftRadius}
                backgroundColor={
                  scr.isActive
                    ? scr.activeBackgroundColor
                    : scr.inActiveBackgroundColor
                }
                onClick={
                  scr.isActive
                    ? null
                    : this.handleBreadCrumbClick.bind(this, scr.name)
                }
              />
            )
          })}
        </BreadCrumbWrap>
        <Content>
          <DetailsWrapper
            key="billing"
            zIndex="10"
            innerRef={ref => (this.refBillingDetails = ref)}
          >
            <BillingDetails
              next={this.handleNext.bind(this)}
              error={this.handleError.bind(this)}
            />
          </DetailsWrapper>

          <DetailsWrapper
            key="payment"
            zIndex="5"
            innerRef={ref => (this.refPaymentDetails = ref)}
          >
            <PaymentDetails
              item={item}
              purchase={this.handlePurchaseClick.bind(this)}
              error={this.handleError.bind(this)}
            />
          </DetailsWrapper>
        </Content>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  //background-color: rgba(0,0,0, 0.95);
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  width: 100%;
  height: ${props => vhToPx(87)};
  display: flex;
  flex-direction: column;
  position: relative;
`

const DetailsWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000000;
  z-index: ${props => props.zIndex};
`

const BreadCrumbWrap = styled.div`
  width: 100%;
  height: ${props => vhToPx(7)};
  background-color: ${props => props.backgroundColor};
  display: flex;
  flex-direction: row;
`

const BreadCrumb = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  ${props =>
    props.topRightRadius
      ? `border-top-right-radius:${responsiveDimension(7)}`
      : ''};
  ${props =>
    props.bottomRightRadius
      ? `border-bottom-right-radius:${responsiveDimension(7)}`
      : ''};
  ${props =>
    props.topLeftRadius
      ? `border-top-left-radius:${responsiveDimension(7)}`
      : ''};
  ${props =>
    props.bottomLeftRadius
      ? `border-bottom-left-radius:${responsiveDimension(7)}`
      : ''};
  &:after {
    content: '${props => props.text}';
    font-family: pamainbold;
    font-size: ${props => responsiveDimension(7 * 0.4)};
    color: ${props => props.color};
    line-height: 0.9;
    height: ${props => responsiveDimension(7 * 0.4 * 0.8)};
    text-transform: uppercase;
    transform: scaleX(${props => props.scale || 1});
  }
`

const Section = styled.div`
  width: 100%;
  ${props => (props.heightInPct ? `height:${props.heightInPct}%` : ``)};
  background-color: ${props => props.backgroundColor || 'transparent'};
  display: flex;
  ${props => (props.direction ? `flex-direction:${props.direction}` : ``)};
  ${props =>
    props.justifyContent ? `justify-content:${props.justifyContent};` : ``};
  ${props => (props.alignItems ? `align-items:${props.alignItems};` : ``)};
  ${props => (props.marginTop ? `margin-top:${vhToPx(props.marginTop)}` : ``)};
  ${props =>
    props.marginBottom ? `margin-bottom:${vhToPx(props.marginBottom)}` : ``};
`

const TextWrapper = styled.div`
  text-align: center;
`

const Text = styled.span`
  font-family: ${props => props.font || 'pamainregular'};
  font-size: ${props => responsiveDimension(props.size || 3)};
  color: ${props => props.color || '#000000'};
  line-height: 1;
  ${props => (props.uppercase ? 'text-transform: uppercase;' : '')} ${props =>
    props.italic ? 'font-style: italic;' : ''};
  ${props =>
    props.nowrap
      ? `white-space: nowrap; backface-visibility: hidden; -webkit-backface-visibility: hidden;`
      : ''};
  letter-spacing: ${props => responsiveDimension(props.nospacing ? 0 : 0.1)};
`

const MessageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  position: absolute;
  z-index: 100;
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  width: 100%;
  height: ${props => vhToPx(props.height || 20)};
  display: flex;
  position: relative;
`

const Middle = styled.div`
  width: 100%;
  height: ${props => vhToPx(props.height)};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: center;
  position: relative;
`

const Bottom = styled.div`
  width: 100%;
  height: ${props => vhToPx(props.height)};
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: ${props => props.alignItems || 'center'};
  position: relative;
`

const Button = styled.div`
  width: ${props => responsiveDimension(28)};
  height: ${props => responsiveDimension(9)};
  ${props =>
    props.borderColor
      ? `border:${responsiveDimension(0.4)} solid ${props.borderColor}`
      : ''};
  border-radius: ${props => responsiveDimension(0.4)};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${props =>
    props.backgroundColor ? `background-color:${props.backgroundColor}` : ''};
  &:before {
    content: '${props => props.text}';
    text-transform: uppercase;
    font-family: pamainregular;
    font-size: ${props => responsiveDimension(10 * 0.4)};
    color: ${props => props.color || '#000000'};
    line-height: 0.9;
    height: ${props => responsiveDimension(10 * 0.4 * 0.8)};
    letter-spacing: ${props => responsiveDimension(0.1)};
  }
`

const TokenImage = styled.img`
  height: ${props => responsiveDimension(props.height || 0)};
  pointer-events: none;
`

const ErrorMessageComp = props => {
  return (
    <MessageContainer onClick={props.close}>
      <Top>
        <Section
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '40%' }}
        >
          <TextWrapper>
            <Text font={'pamainlight'} size={4.5} color={'#ffffff'} uppercase>
              there are&nbsp;
            </Text>
            <Text font={'pamainbold'} size={4.5} color={'#c61818'} uppercase>
              errors
            </Text>
          </TextWrapper>
        </Section>
        <Section
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '65%' }}
        >
          <TextWrapper>
            <Text font={'pamainregular'} size={4.5} color={'#ffffff'} uppercase>
              in your information
            </Text>
          </TextWrapper>
        </Section>
      </Top>
      <Middle height={55}>
        {(props.items || []).map(error => {
          return (
            <Text
              key={error}
              font="pamainregular"
              color={'#c61818'}
              size="3.5"
              uppercase
              style={{ marginBottom: vhToPx(1) }}
            >
              {error}
            </Text>
          )
        })}
      </Middle>
      <Bottom height={19}>
        <Text font="pamainlight" color={'#ffffff'} size="3.5" uppercase>
          tap anywhere to correct
        </Text>
      </Bottom>
    </MessageContainer>
  )
}

const CardDeniedMessageComp = props => {
  return (
    <MessageContainer>
      <Top>
        <Section
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '40%' }}
        >
          <TextWrapper>
            <Text font={'pamainbold'} size={4.5} color={'#c61818'} uppercase>
              payment denied
            </Text>
          </TextWrapper>
        </Section>
        <Section
          direction={'row'}
          justifyContent={'center'}
          style={{ position: 'absolute', top: '65%' }}
        >
          <TextWrapper>
            <Text font={'pamainlight'} size={4.5} color={'#ffffff'} uppercase>
              the card provided has errors
            </Text>
          </TextWrapper>
        </Section>
      </Top>
      <Middle height={30}>
        <Text font="pamainregular" color={'#ffffff'} size="4" uppercase italic>
          {props.message}
        </Text>
      </Middle>
      <Bottom justifyContent="flex-start" height={44}>
        <Section justifyContent="center" marginTop={2}>
          <Button
            text="update info"
            color="#ffffff"
            backgroundColor="#19c5ff"
            onClick={props.close}
          />
        </Section>
        <Section justifyContent="center" marginTop={1.5}>
          <Button text="add new card" color="#ffffff" borderColor="#ffffff" />
        </Section>
        <Section justifyContent="center" marginTop={10}>
          <Text
            font="pamainlight"
            color={'#ffffff'}
            size="3.5"
            uppercase
            onClick={props.close}
          >
            tap here to cancel
          </Text>
        </Section>
      </Bottom>
    </MessageContainer>
  )
}

const TokenPurchased = props => {
  const totalQty = props.item.bonusTokens + props.item.tokens
  return (
    <MessageContainer onClick={props.goBackToMain}>
      <Top height={55}>
        <Section direction="column" justifyContent="center">
          <Section justifyContent="center" marginBottom="2">
            <TokenImage
              src={evalImage(props.item.image)}
              height={props.item.height}
            />
          </Section>
          <Section justifyContent="center" marginBottom="1">
            <TextWrapper>
              <Text font="pamainextrabold" color={'#ffffff'} size="6" nospacing>
                {totalQty}
              </Text>
              <Text font="pamainlight" color={'#ffb600'} size="6" nospacing>
                &nbsp;TOKENS
              </Text>
            </TextWrapper>
          </Section>
          <Section justifyContent="center">
            <TextWrapper>
              <Text font="pamainlight" color={'#ffffff'} size="7.5" uppercase>
                PURCHASED
              </Text>
            </TextWrapper>
          </Section>
        </Section>
      </Top>
      <Middle height={18} justifyContent="flex-start">
        <Section justifyContent="center" marginTop="1">
          <TextWrapper>
            <Text font="pamainlight" color={'#ffffff'} size="4.3" uppercase>
              YOUR NEW
            </Text>
            <Text font="pamainlight" color={'#ffb600'} size="4.3" uppercase>
              &nbsp;TOKEN&nbsp;
            </Text>
            <Text font="pamainlight" color={'#ffffff'} size="4.3" uppercase>
              TOTAL
            </Text>
          </TextWrapper>
        </Section>
        <Section justifyContent="center" alignItems="center" direction="row">
          <Text
            font="pamainextrabold"
            color={'#ffb600'}
            size="8"
            uppercase
            nospacing
          >
            {props.profile.currencies.tokens}&nbsp;
          </Text>
          <TokenWrapper height="6">
            <Token
              src={evalImage(`playalong-token.svg`)}
              size={5.5}
              index={3}
            />
            <Faded index={2} size={5.5} color={'#6d6c71'} left={0.5} />
            <Faded index={1} size={5.5} color={'#33342f'} left={1} />
          </TokenWrapper>
        </Section>
      </Middle>
      <Bottom height="21">
        <Text font="pamainlight" color={'#ffffff'} size="3.5" uppercase>
          tap anywhere to return
        </Text>
      </Bottom>
    </MessageContainer>
  )
}

const TokenWrapper = styled.div`
  height: ${props => responsiveDimension(props.height)};
  margin-right: ${props => responsiveDimension(0.5)};
  margin-bottom: ${props => responsiveDimension(0.1)};
  display: flex;
  align-items: center;
  width: ${props => responsiveDimension(7)};
`

const Token = styled.div`
  position: absolute;
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
  position: absolute;
  width: ${props => responsiveDimension(props.size)};
  height: ${props => responsiveDimension(props.size)};
  border-radius: ${props => responsiveDimension(props.size)};
  background-color: ${props => props.color};
  margin-left: ${props => responsiveDimension(props.left || 0)};
  z-index: ${props => props.index};
`
