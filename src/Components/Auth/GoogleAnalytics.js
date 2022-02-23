import { analytics } from '../../Firebase'
let visitorId = sessionStorage.getItem('visitor')
let loginEmail = sessionStorage.getItem('email')
/* LOGIN ACTIVITY  */
export const login = userDetails => {
  let userEmail = userDetails.profile.email.toString()
  sessionStorage.setItem('email', userEmail)
  // Log event
  analytics.logEvent('login', {
    username: JSON.stringify(userDetails),
    email: userEmail,
    fingerPrintId: visitorId,
    user_id: userEmail,
    user_id_type: 'email',
  })

  analytics.setUserId(userEmail)
}
/* SIGNUP ACTIVITY  */
export const signup = userDetails => {
  let userEmail = userDetails.profile.email.toString()
  sessionStorage.setItem('email', userEmail)
  analytics.logEvent('signup', {
    userdetails: JSON.stringify(userDetails),
    email: userEmail,
    fingerPrintId: visitorId,
    user_id: userEmail,
    user_id_type: 'email',
  })
  analytics.setUserId(userEmail)
}
/* Profile changes and updates */
export const updateUserDetails = async (userDetails, eventName) => {
  console.log('userDetails', userDetails)
  let data = {
    profile: JSON.stringify(userDetails),
    email: loginEmail,
    fingerPrintId: visitorId,
    user_id: loginEmail,
    user_id_type: 'email',
  }
  await eventCapture('profileDetails', data)
}

/* Purchase token */
export const getPurchaseToken = async (eventName, purchaseData) => {
  let user_type = sessionStorage.getItem('email') ? true : false
  let itemevent = {
    item_list_id: purchaseData.productId,
    item_list_name: purchaseData.name,
    bonusTokens: purchaseData.bonusTokens,
    currency: purchaseData.currency,
    height: purchaseData.height,
    image: purchaseData.image,
    model: purchaseData.model,
    name: purchaseData.name,
    points: purchaseData.points,
    price: purchaseData.price,
    productId: purchaseData.productId,
    tokens: purchaseData.tokens,
    email: loginEmail,
    fingerPrintId: visitorId,
    user_id: user_type ? loginEmail : visitorId,
    user_id_type: user_type ? 'email' : 'fingerprint',
  }
  await eventCapture(eventName, itemevent)
}
/* Get the billing Details */
export const billingDetails = async (eventName, data) => {
  await eventCapture(eventName, data)
}
/* Get the payment details */
export const getPaymentDetails = async (eventName, data) => {
  await eventCapture(eventName, data)
}

/* view Details for the starboard */
export const starboardView = async (eventName, data) => {
  let details = {
    boardOrder: data.boardOrder,
    boardTypeId: data.boardTypeId,
    claimInfo: data.claimInfo,
    claimType: data.claimType,
    currencyType: data.currencyType,
    discount: data.discount,
    image: data.image,
    prizeBoardId: data.prizeBoardId,
    prizeBoardPrizeId: data.prizeBoardPrizeId,
    qty: data.qty,
    page_path: data.subTitle,
    page_title: data.title,
    value: 18,
  }
  await eventCapture(eventName, details)
}

export const addStarForStarboard = async (eventName, details) => {
  await eventCapture(eventName, details)
}

/* PAGE VIEW AND DETAILS  */
export const pageViewDetails = async (
  pageLocation,
  pagePath,
  pageTitle,
  id
) => {
  let user_type = sessionStorage.getItem('email') ? true : false
  let details = {
    page_location: pageLocation,
    page_path: pagePath,
    page_title: pageTitle,
    email: loginEmail,
    fingerPrintId: visitorId,
    user_id: user_type ? loginEmail : visitorId,
    user_id_type: user_type ? 'email' : 'fingerprint',
  }
  analytics.setUserId(user_type ? loginEmail : visitorId)
  await eventCapture('page_view', details)
}
/* ***********************event capture ********************** */
export const eventCapture = async (eventName, gaData) => {
  new Promise(async (resolve, reject) => {
    try {
      let user_type = sessionStorage.getItem('email') ? true : false
      // gaData.email = loginEmail //-mod by aurelio on 08122021. reason: it bypasses the original value, and it should not be, as it affects billing details.
      gaData.email = gaData.email ? gaData.email : loginEmail
      gaData.fingerPrintId = visitorId
      // gaData.userId = user_type ? loginEmail : visitorId //-mod by aurelio on 08062021. reason: it bypasses the original value, and it should not be, as it affects the authentication.
      gaData.user_id = gaData.user_id
        ? gaData.user_id
        : user_type
        ? loginEmail
        : visitorId
      gaData.user_id_type = user_type ? 'email' : 'fingerprint'
      await analytics.logEvent(eventName, gaData)
    } catch (error) {
      //reject(error)
    }
  })
}
/* **************************************************************** */
