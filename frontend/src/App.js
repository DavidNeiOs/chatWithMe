import React, { Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import HomepageComponent from './components/homepageCmp/homepageCmp';
import SignupComponent from './components/signupCmp/signupCmp';
import LoginCmp from './components/loginCmp/loginCmp';
import ChatCmp from './components/chatCmp/chatCmp'


class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" component={HomepageComponent} exact></Route>
          <Route path="/signup" component={SignupComponent}></Route>
          <Route path="/login" component={LoginCmp}></Route>
          <Route path="/chat" component={ChatCmp}></Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
