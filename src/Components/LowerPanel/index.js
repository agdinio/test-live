import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import GSAP from 'react-gsap-enhancer'
import {
  ParentPanel,
  FirstPanel,
  SecondPanel,
  ThirdPanel,
  PanelGrid,
  ActiveSelector,
  PanelSelector,
} from './style'
import PropTypes from 'prop-types'

@inject('LowerPanelStore')
@observer
@GSAP
class LowerPanel extends Component {
  constructor(props) {
    super(props)
    this.props.LowerPanelStore.setRef(this)
  }

  render() {
    const { PanelOne, PanelTwo, PanelThree, LowerPanelStore } = this.props
    return (
      <div>
        <PanelGrid>
          <PanelSelector
            name={LowerPanelStore.Selector.first}
            onClick={LowerPanelStore.handleClick.bind(
              this,
              LowerPanelStore.Panel.first
            )}
          />
          <ActiveSelector
            name={LowerPanelStore.Selector.second}
            onClick={LowerPanelStore.handleClick.bind(
              this,
              LowerPanelStore.Panel.second
            )}
          />
          <PanelSelector
            name={LowerPanelStore.Selector.third}
            onClick={LowerPanelStore.handleClick.bind(
              this,
              LowerPanelStore.Panel.third
            )}
          />
        </PanelGrid>
        <ParentPanel>
          <FirstPanel name={LowerPanelStore.Panel.first}>{PanelOne}</FirstPanel>
          <SecondPanel name={LowerPanelStore.Panel.second}>
            {PanelTwo}
          </SecondPanel>
          <ThirdPanel name={LowerPanelStore.Panel.third}>
            {PanelThree}
          </ThirdPanel>
        </ParentPanel>
      </div>
    )
  }
}

LowerPanel.propTypes = {
  PanelOne: PropTypes.element.isRequired,
  PanelTwo: PropTypes.element.isRequired,
  PanelThree: PropTypes.element.isRequired,
}

export default GSAP()(LowerPanel)
