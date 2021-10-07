import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import MyView from './MyView';
import Upload from './Upload';
import App from '../App';
import PdftronView from './PdftronView';


const Main = () => (
  <div>
    <Switch>
      <Route exact path='/Home' component={Home} />
      <Route exact path='/My View' component={MyView} />
      <Route path='/Pdftron View' component={PdftronView}/>
      <Route exact path='/Upload' component={Upload} />
      <Route exact path='/myhome' component={App} />
    </Switch>
  </div>
);

export default Main;
