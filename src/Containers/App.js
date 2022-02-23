import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { vhToPx, maxHeight } from '@/utils'
import { inject } from 'mobx-react'
import Main from '@/Components/Main'
import ReactGa from 'react-ga'
import DeletePrize from '@/Components/DeletePrize'
//@inject('CommandHostStore')
class App extends PureComponent {
  // componentWillMount() {
  //   this.props.CommandHostStore.connectGameServer()
  // }
  constructor(props) {
    super(props)

    //ReactGa.initialize('UA-184770175-1')
    //ReactGa.pageview('/')
  }

  render() {
    return (
      <AppContainer>
        <Switch>
          <Route exact path="/" component={Main} />
          {/* <Redirect to="/" /> */}
          <Route
            exact
            path="/user/9a220f323e5ab77be9d925754a714c8a"
            component={DeletePrize}
          />
        </Switch>
      </AppContainer>
    )
  }
}

export default App

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  user-select: none;
`

const ViewWrapper = styled.div`
  width: auto;
  height: 100%;
  display: flex;
`

const HostCommandWrapper = styled.div`
  width: 100%;
  height: ${props => maxHeight};
  display: flex;
  background: #e1e1e1;
  border-left: ${props => vhToPx(1)} solid #222222;
  padding: 2% 3% 2% 3%;
`
