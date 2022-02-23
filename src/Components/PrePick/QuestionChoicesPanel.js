import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { extendObservable } from 'mobx'
import styled from 'styled-components'
import { vhToPx, responsiveDimension } from '@/utils'

@inject('PrePickStore')
@observer
export default class QuestionChoicesPanel extends Component {
  constructor(props) {
    super(props)

    extendObservable(this, {})
  }

  render() {
    let { currentPrePick, question } = this.props
    return (
      <Container>
        <Top>
          <TopLeft>
            <CurrentPrePickNum>{currentPrePick}</CurrentPrePickNum>
          </TopLeft>
          <QuestionHeader>{question.title}</QuestionHeader>
        </Top>

        <Bottom>
          {question.labels.map((item, key) => {
            return (
              <QuestionItem color={item.color} key={key}>
                {item.value === '?' ? item.value : ` ${item.value}`}
              </QuestionItem>
            )
          })}
        </Bottom>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`
const Top = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`
const TopLeft = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${responsiveDimension(1)};
`

const CurrentPrePickNum = styled.div`
  background-color: #2fc12f;
  width: ${props => responsiveDimension(3.3)};
  height: ${props => responsiveDimension(3.3)};
  border-radius: 50%;
  font-family: pamainextrabold;
  font-size: ${props => responsiveDimension(2.5)};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 3%;
  margin-right: ${responsiveDimension(0.5)};
`

const CurrentPrePickNumWrapper = styled.div`
  width: ${responsiveDimension(3.3)};
  height: ${responsiveDimension(3.3)};
  border-radius: 50%;
  //display: flex;
  //justify-content: center;
  //align-items: center;
  background-color: #2fc12f;
  margin-right: ${responsiveDimension(0.5)};
  position: relative;
/*
  font-family: pamainextrabold;
  font-size: ${responsiveDimension(2.4)};
  color: #ffffff;
*/
`
const CurrentPrePickNum_ = styled.div`
  font-family: pamainextrabold;
  font-size: ${responsiveDimension(2.4)};
  color: #ffffff;
  //line-height: 1;
  //width: 100%;
  //height: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding-bottom: ${props => responsiveDimension(0.02)};
  //padding-bottom: 0.4%;
  margin-top: ${responsiveDimension(0.2)};

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  //background: red;
  position: absolute;
`
const QuestionHeader = styled.div`
  font-family: pamainlight;
  font-size: ${props => responsiveDimension(7.6)};
  color: #ffffff;
  text-transform: uppercase;
  display: inline-block;
  height: ${props => responsiveDimension(5.7)};
  line-height: ${props => responsiveDimension(7)};
`
const Bottom = styled.div`
  display: inline-block;
  flex-direction: row;
  width: 74%;
  justify-content: center;
  overflow-wrap: break-word;
  font-family: pamainregular;
  font-size: ${props => responsiveDimension(4.1)};
  line-height: ${props => responsiveDimension(4)};
  padding-top: ${props => responsiveDimension(1.5)};
`
const QuestionItem = styled.span`
  text-transform: uppercase;
  color: ${props => props.color};
`
