import React, { PureComponent } from 'react'
import styled from 'styled-components'
import GSAP from 'react-gsap-enhancer'
import PropTypes from 'prop-types'

// Styled Component Declarations

const maxWidth = '69vh'
const QuestionNumberContainer = styled.div`
  border-radius: 50%;
  background-color: #2fc12f;
  width: 3vh;
  height: 3vh;
  font-family: pamainextrabold;
  font-size: 2.1vh;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: ${props => maxWidth}) {
    width: 4wv;
    height: 4vw;
    font-size: 2vh;
  }
`

class PrePickNumber extends PureComponent {
  render() {
    return (
      <QuestionNumberContainer id="number">
        {this.props.questionNumber}
      </QuestionNumberContainer>
    )
  }
}

PrePickNumber.propTypes = {
  questionNumber: PropTypes.number,
}

export default GSAP()(PrePickNumber)
