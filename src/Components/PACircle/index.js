import styled, { keyframes } from 'styled-components'
import timer_circle_full from '@/assets/images/timer-circle_full.svg'
import PA from '@/assets/images/pa-icon-white.svg'
import { vhToPx, responsiveDimension } from '@/utils'

const PACircle = styled.div`
  ${props =>
    props.value
      ? `display:flex;justify-content:center; align-items:center; font-size:${
          props.size
            ? responsiveDimension(props.size * 0.6)
            : responsiveDimension(4)
        };`
      : ''}
  width: ${props => responsiveDimension(props.size || 7)};
  height: ${props => responsiveDimension(props.size || 7)};
  color: #ffffff;
  font-family: 'pamainlight';
  position: relative;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  &:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    animation: ${props => timersecondsgo} 1s infinite
      cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background-image: url(${props => props.background || timer_circle_full});
    transform-origin: center;
  }
  &:after {
    content: '';
    ${props =>
      props.value ? `` : `background-image: url(${props.background || PA});`}
    background-repeat: no-repeat;
    background-position: center;
    background-size: 61%;
    width: inherit;
    height: inherit;
    display: block;
    position: absolute;
    top: 0;
  }
`
const timersecondsgo = keyframes`
  0% {}
  100% {
    transform:rotate(360deg);
  }
`

module.exports = {
  PACircle,
}
