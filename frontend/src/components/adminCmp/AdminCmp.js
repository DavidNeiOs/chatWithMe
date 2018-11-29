import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import HeaderCmp from "../headerCmp/HeaderCmp";

class AdminCmp extends Component {
  state = {
    users: []
  };
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  componentDidMount() {
    fetch("/users", {
      method: "GET",
      mode: "same-origin",
      credentials: "include"
    })
      .then(response => response.text())
      .then(res => {
        const parsedRes = JSON.parse(res);
        console.log(parsedRes);
        this.setState({ users: parsedRes });
      });
  }

  handleLogOut() {
    fetch("/logout", {
      method: "POST",
      mode: "same-origin",
      credentials: "include",
      body: JSON.stringify({ username: this.props.username })
    })
      .then(binResponse => binResponse.text())
      .then(stringRes => {
        let res = JSON.parse(stringRes);
        console.log(res);
        if (res.success) {
          this.props.history.push("/");
        }
      });
  }

  render() {
    console.log(this.props.username);
    return (
      <div>
        <HeaderCmp
          username={this.props.username}
          handleLogOut={this.handleLogOut}
        />
        <main />
      </div>
    );
  }
}

export default withRouter(AdminCmp);
