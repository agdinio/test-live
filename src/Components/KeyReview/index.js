import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import * as util from '@/utils'

@inject('NavigationStore')
@observer
export default class KeyReview extends Component {
  render() {
    return <div>{this.props.NavigationStore.location}</div>
  }
}
