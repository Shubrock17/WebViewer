import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import MyFiles from './MyFiles';
import Upload from './Upload';
import SignOut from './SignOut';


const Main = () => (
  <div>
    <Switch>
      <Route path='/Home' component={Home} />
      <Route path='/MyFiles' component={MyFiles} />
      <Route path='/Upload' component={Upload} />
      <Route path='/SignOut' component={SignOut} />
    </Switch>
  </div>
)

export default Main;