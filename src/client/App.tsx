import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import Header from './components/layout/Header/Connected'
import RouteSwitch from './RouteSwitch'
import PageTitle from './components/common/PageTitle'
import Wrapper from './components/layout/Wrapper/Connected'
import Overlays from './components/overlays/Connected'
import { RootState } from './state'
//import Footer from './components/layout/Footer'
import Notifications from './components/layout/Notifications/Connected'

const App = (props: PropsFromRedux) => (
  <div>
    <PageTitle title={'default'}/>
    <Notifications/>
    <Overlays/>

    <Wrapper>
      <Header session={props.session}/>

      <RouteSwitch session={props.session}/>

      {/*<Footer/>*/}
    </Wrapper>
  </div>
)

const mapStateToProps = (state: RootState) => ({ session: state.session })
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(App)