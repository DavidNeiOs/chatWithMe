import React, { Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import HomepageComponent from './components/homepageCmp/homepageCmp';
import SignupComponent from './components/signupCmp/signupCmp';
import LoginCmp from './components/loginCmp/loginCmp';
import ChatCmp from './components/chatCmp/chatCmp'

let renderChatComponent = function(routerData) {
return (<ChatCmp username={routerData.match.params.username} />)
}

class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <div className="routes">
          <Route path="/" component={HomepageComponent} exact></Route>
          <Route path="/signup" component={SignupComponent}></Route>
          <Route path="/login" component={LoginCmp}></Route>
          <Route path="/chat" component={ChatCmp}></Route>
          <Route path="/user/:username" render={renderChatComponent}></Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
