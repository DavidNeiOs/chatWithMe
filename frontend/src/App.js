import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import HomepageComponent from "./components/homepageCmp/homepageCmp";
import SignupComponent from "./components/signupCmp/signupCmp";
import LoginCmp from "./components/loginCmp/loginCmp";
import AdminView from "./AdminView";
import UserView from "./UserView";

let renderUserComponent = function(routerData) {
  return <UserView username={routerData.match.params.username} />;
};

let renderAdminComponent = function(routerData) {
  return <AdminView username="davidneios" />;
};
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="routes">
          <Route path="/" component={HomepageComponent} exact />
          <Route path="/signup" component={SignupComponent} />
          <Route path="/login" component={LoginCmp} />
          <Route path="/davidneios" render={renderAdminComponent} />
          <Route path="/user/:username" render={renderUserComponent} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
