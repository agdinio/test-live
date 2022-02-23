import styled, { keyframes } from 'styled-components'

const fadeInTop = keyframes`
  0% { opacity:0;margin-bottom:700px; }
  100% {opacity:1; margin-bottom:0px;}
`
const PAWrapper = styled.span``

const PlayInProgressContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: inherit;
  font-size: 30px;
  background-color: ${props => props.color || '#c61818'};
`

const FadeIn = styled.div`
  animation: 0.75s ${fadeInTop} forwards;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: inherit;
  height: inherit;
  padding: 33px 0px 33px 0px;
  justify-content: ${props => (props.center ? 'center' : 'space-between')};
`

module.exports = {
  PlayInProgressContainer,
  FadeIn,
  PAWrapper,
}
