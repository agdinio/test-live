import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled, { keyframes } from 'styled-components'
import { TweenMax, TimelineMax } from 'gsap'
import { vhToPx, hex2rgb, responsiveDimension } from '@/utils'

@observer
export default class TextCard extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      timer: 5,
      check: undefined,
    })
  }

  componentDidMount() {
    //this.countdown()
  }

  countdown() {
    /*
    if (this.timer) {
      this.check = setInterval(() => {
        this.timer = this.timer - 1

        if (!this.timer) {
          clearInterval(this.check)
          this.timeIsUp()
        }
      }, 1000)
    }
*/
  }

  timeIsUp() {
    this.props.handleTimeIsUp()
  }

  showTextCardMessages() {
    let ctr = this.props.msg.textCards.length

    let handler = count => {
      if (count < ctr) {
        let len = this.props.msg.textCards[count].len

        new TimelineMax({ repeat: 0 })
          .to(this[`TextCardBlock-${count}`], 0.5, { opacity: 1 })
          .to(this[`TextCardBlock-${count}`], len, {
            opacity: 1,
            onComplete: () => {
              TweenMax.to(this[`TextCardBlock-${count}`], 0.5, { opacity: 0 })
              handler(count + 1)
            },
          })
      } else {
        this.timeIsUp()
      }
    }

    handler(0)
  }

  showTextCardMessages2() {
    let ctr = this.props.msg.textCards.length

    let handler = count => {
      if (count < ctr) {
        let len = this.props.msg.textCards[count].len

        this.caller = setInterval(() => {
          TweenMax.to(this[`TextCardBlock-${count}`], 0.3, { opacity: 1 })

          len = len - 1
          if (!len) {
            clearInterval(this.caller)
            TweenMax.to(this[`TextCardBlock-${count}`], 0.3, { opacity: 0 })
            handler(count + 1)
          }
        }, 1000)
      } else {
        this.timeIsUp()
      }
    }

    handler(0)
  }

  showTextCardMessages________() {
    let ctr = this.props.msg.textCards.length

    let len = -1
    let handler = count => {
      if (count < ctr) {
        len = this.props.msg.textCards[count].len
        this.caller = setTimeout(() => {
          if (count - 1 >= 0) {
            TweenMax.to(this[`TextCardBlock-${count - 1}`], 0.3, { opacity: 0 })
          }
          TweenMax.to(this[`TextCardBlock-${count}`], 0.3, { opacity: 1 })
          handler(count + 1)
        }, len * 1000)
      } else {
        debugger
        clearTimeout(this.caller)
        len = this.props.msg.textCards[ctr - 1].len
        TweenMax.to(this[`TextCardBlock-${ctr - 1}`], 0.3, {
          opacity: 0,
          delay: len,
          onComplete: () => {
            this.timeIsUp()
          },
        })
        return
      }
    }

    TweenMax.to(this[`TextCardBlock-0`], 0.3, { opacity: 1 })
    handler(1)
  }

  componentDidUpdate(nextProps) {
    debugger
    if (this.props.show) {
      this.showTextCardMessages()
    }
  }

  render() {
    debugger
    let { msg } = this.props
    return (
      <Container innerRef={ref => (this.Container = ref)}>
        {msg.textCards.map((main, i) => {
          return (
            <TextCardBlock
              key={i}
              innerRef={ref => (this[`TextCardBlock-${i}`] = ref)}
            >
              {main.messages.map((item, j) => {
                return item.break ? (
                  <br key={j} />
                ) : (
                  <TextCardText
                    font={item.font}
                    color={item.color}
                    size={item.size}
                    key={j}
                  >
                    {item.value}
                    &nbsp;
                  </TextCardText>
                )
              })}
            </TextCardBlock>
          )
        })}
      </Container>
    )
  }
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: ${props => responsiveDimension(0.5)} solid
    rgba(255, 255, 255, 0.2);
`
const TextCardBlock = styled.div`
  width: 100%;
  position: absolute;
  display: inline-block;
  text-align: center;
  opacity: 0;
`

const TextCardText = styled.span`
  font-family: ${props => props.font || 'pamainbold'};
  font-size: ${props => responsiveDimension(props.size || 6)};
  color: ${props => props.color || '#ffffff'};
  line-height: 1;
`
