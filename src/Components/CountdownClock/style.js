import styled, { keyframes } from 'styled-components'

const CountDownClock = styled.div`
  padding-top: 66px;
  width: 100%;
  height: 100%;
`

const AcitveDate = styled.div`
  font-family: pamainlight;
  font-size: 2em;
  color: #ffffff;
  @media screen and (max-width: 660px) {
    font-size: 4.2vw;
  }
`

const KickOff = styled.span`
  font-family: pamainlight;
  color: #ff0000;
`

const ActiveCountDown = styled.div`
  font-family: pamainregular;
  font-size: 2.4em;
  color: #ffffff;
  margin-top: -15px;
  @media screen and (max-width: 660px) {
    font-size: 5.1vw;
    margin-top: -2.5vw;
  }
`

module.exports = {
  CountDownClock,
  AcitveDate,
  KickOff,
  ActiveCountDown,
}
