import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./homepageCmp.css";

class HomepageComponent extends Component {
  constructor() {
    super();
    this.state = {
      activeSession: 0
    };
  }
  componentDidMount() {
    // FETCH THE INFO FROM SERVER
    fetch("/session", {
      method: "GET",
      mode: "same-origin",
      credentials: "include"
    })
      .then(response => response.text())
      .then(responseBody => {
        console.log(responseBody);
        let ans = JSON.parse(responseBody);
        // IN RESPONSE SET THE STATE OF ACTIVESESSION
        if (ans.success) {
          this.props.history.push("/user/" + ans.result.username);
          console.log(ans);
        } else {
          this.setState({ activeSession: 1 });
        }
      })
      .catch(err => {
        alert("there was an error in server");
      });
  }
  render() {
    return !this.state.activeSession 
    ? (
        <div className="btns">
          <h2 className="loading">LOADING</h2>
        </div>
      ) 
    : (
        <div className="btns">
          <Link className="signup-btn" to="/signup">
            SIGN UP
          </Link>
          <Link className="login-btn" to="/login">
            LOG IN
          </Link>
        </div>
      );
  }
}


export default withRouter(HomepageComponent);
