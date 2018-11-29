import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import HomepageComponent from "./components/homepageCmp/homepageCmp";
import SignupComponent from "./components/signupCmp/signupCmp";
import LoginCmp from "./components/loginCmp/loginCmp";
import ChatCmp from "./components/chatCmp/chatCmp";
import AdminCmp from "./components/adminCmp/AdminCmp";

let renderChatComponent = function(routerData) {
  return <ChatCmp username={routerData.match.params.username} />;
};

let renderAdminComponent = function(routerData) {
  return <AdminCmp username="davidneios" />;
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
          <Route path="/user/:username" render={renderChatComponent} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
