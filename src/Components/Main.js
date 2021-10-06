import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import MyFiles from './MyFiles';
import Upload from './Upload';
import SignOut from './SignOut';
import Login from './Login';
import App from '../App';
import AllFiles from './AllFiles';


const Main = () => (
  <div>
    <Switch>
      <Route path='/Home' component={Home} />
      <Route path='/My Files' component={MyFiles} />
      <Route path='/Upload' component={Upload} />
      <Route path='/SignOut' component={SignOut} />
      <Route path='/myhome' component={App} />
      <Route path='/All Files' component={AllFiles}/>
    </Switch>
  </div>
);

export default Main;
