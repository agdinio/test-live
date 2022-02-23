import styled from 'styled-components'
import * as util from '@/utils'

export const BaseContainer = styled.div`
  width: 100%;
  height: ${props => util.maxHeight};
  //z-index: 1;
`
