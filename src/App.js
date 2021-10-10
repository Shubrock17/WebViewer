import React from "react";
import Header from "./Components/Header";
import Main from "./Components/Main";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Dashboard from "./Components/Dashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="app">
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/SignUp" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Router>
      </div>
      <div>
        <Header />
        <hr />
        <Main />
      </div>
    </>
  );
};

export default App;
