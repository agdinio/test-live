import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { extendObservable, autorun } from 'mobx'

@inject('PrePickStore')
@observer(['PrePickStore'])
class PrePicksRemaining extends PureComponent {
  constructor(props) {
    super(props)
    autorun(() => {
      extendObservable(this, {
        PicksRemaining: 11 - this.props.PrePickStore.currentPrePick,
      })
    })
  }

  render() {
    return (
      <Container>
        <Count id="picks">{this.PicksRemaining}</Count> Picks Left
      </Container>
    )
  }
}
const Container = styled.div`
  font-family: pamainlight;
  color: #60bd48;
  font-size: 30px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  flex-direction: row;
  line-height: 2em;
  text-transform: uppercase;
`
const Count = styled.div`
  font-family: pamainextrabold;
  font-size: 35px;
  color: #60bd48;
  margin-right: 5px;
`
export default PrePicksRemaining
