import styled from 'styled-components'

let ParentPanel = styled.div`
  position: relative;
  bottom: 0;
  height: auto;
  width: auto;
  border-top: 5px solid;
  border-top-color: #474748;
`
let FirstPanel = styled.div`
  height: 371.25px;
  min-width: 660px;
  width: 100%;
  position: absolute;
  opacity: 0;
`
let SecondPanel = styled.div`
  width: 100%;
  height: 371.25px;
  position: absolute;
  opacity: 1;
`

let ThirdPanel = styled.div`
  min-width: 660px;
  width: 100%;
  height: 371.25px;
  position: absolute;
  opacity: 0;
`

let PanelGrid = styled.ul`
  z-index: 10;
  color: white;
  min-width: 660px;
  width: 100%;
  list-style-type: none;
  position: absolute;
  margin-top: -8px;
  padding: 0;
`
let ActiveSelector = styled.li`
  float: right;
  display: inline-block;
  margin: 0px 2%;
  padding: 0;
  cursor: pointer;
  background-color: white;
  height: 20px;
  width: 20px;
  border-radius: 50%;
`
let PanelSelector = styled.li`
  float: right;
  display: inline-block;
  margin: 0px 2%;
  padding: 0;
  cursor: pointer;
  background-color: grey;
  height: 20px;
  width: 20px;
  border-radius: 50%;
`

module.exports = {
  ParentPanel,
  FirstPanel,
  SecondPanel,
  ThirdPanel,
  PanelGrid,
  ActiveSelector,
  PanelSelector,
}
