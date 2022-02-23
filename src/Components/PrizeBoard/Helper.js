import { TweenMax } from 'gsap'
import NavigationStore from '@/stores/NavigationStore'

export const attachSlidingPanelEvent = (el, key) => {
  let startX
  let isDown = false

  if (!el) {
    return
  }

  /**
   * Desktop Browser
   */
  el.addEventListener('mousedown', e => {
    e.stopPropagation()
    isDown = true
    startX = e.screenX + el.offsetLeft
  })

  el.addEventListener('mousemove', e => {
    e.stopPropagation()
    if (!isDown) {
      return false
    }

    // const swipeableScreenLocation = (startX / el.offsetWidth) * 100
    // if (swipeableScreenLocation > 20) {
    //   return
    // }

    let change = startX - e.screenX
    if (change > 0) {
      return
    }

    TweenMax.to(el, 0, { x: -change })
  })

  el.addEventListener('mouseup', e => {
    e.stopPropagation()
    isDown = false

    // const swipeableScreenLocation = (startX / el.offsetWidth) * 100
    // if (swipeableScreenLocation > 20) {
    //   return
    // }

    let x = el.offsetWidth
    let change = startX - e.screenX

    let threshold = 0
    let distX = x + (e.screenX - startX)
    if (distX < 0) {
      threshold = x + el.offsetWidth / 2
    } else {
      threshold = x - el.offsetWidth / 2
    }

    if (Math.abs(change) > threshold) {
      TweenMax.to(el, 0.3, {
        x: '100%',
        onComplete: () => {
          NavigationStore.removeSubScreen(key, true)
        },
      })
    } else {
      TweenMax.to(el, 0.3, { x: '0%' })
    }
  })

  el.addEventListener('mouseleave', e => {
    e.stopPropagation()
    if (!isDown) {
      return false
    }

    // const swipeableScreenLocation = (startX / el.offsetWidth) * 100
    // if (swipeableScreenLocation > 20) {
    //   return
    // }

    isDown = false

    let x = el.offsetWidth
    let change = startX - e.screenX

    let threshold = 0
    let distX = x + (e.screenX - startX)
    if (distX < 0) {
      threshold = x + el.offsetWidth / 2
    } else {
      threshold = x - el.offsetWidth / 2
    }

    if (Math.abs(change) > threshold) {
      TweenMax.to(el, 0.3, {
        x: '100%',
        onComplete: () => {
          NavigationStore.removeSubScreen(key, true)
        },
      })
    } else {
      TweenMax.to(el, 0.3, { x: '0%' })
    }
  })

  /**
   * Mobile Browser
   */
  el.addEventListener('touchstart', e => {
    e.stopPropagation()
    startX = e.touches[0].clientX + el.offsetLeft
  })

  el.addEventListener('touchmove', e => {
    e.stopPropagation()
    let change = startX - e.touches[0].clientX
    if (change > 0) {
      return
    }

    const swipeableScreenLocation = (startX / el.offsetWidth) * 100
    if (swipeableScreenLocation > 20) {
      return
    }

    TweenMax.to(el, 0, { x: -change })
  })

  el.addEventListener('touchend', e => {
    e.stopPropagation()

    const swipeableScreenLocation = (startX / el.offsetWidth) * 100
    if (swipeableScreenLocation > 20) {
      return
    }

    let x = el.offsetWidth
    let change = startX - e.changedTouches[0].clientX

    let threshold = 0
    let distX = x + (e.changedTouches[0].clientX - startX)
    if (distX < 0) {
      threshold = x + el.offsetWidth / 2
    } else {
      threshold = x - el.offsetWidth / 2
    }

    if (Math.abs(change) > threshold) {
      TweenMax.to(el, 0.3, {
        x: '100%',
        onComplete: () => {
          NavigationStore.removeSubScreen(key, true)
        },
      })
    } else {
      TweenMax.to(el, 0.3, { x: '0%' })
    }
  })
}
