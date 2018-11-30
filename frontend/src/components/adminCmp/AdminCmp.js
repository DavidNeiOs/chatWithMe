import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./AdminCmp.css";

const UserCmp = ({ user }) => (
  <div className="user-container">
    <p className="user-id">
      <span className="user-username">{user.username}</span> -{" "}
      <span>{user.firstName}</span>
    </p>
  </div>
);

class AdminCmp extends Component {
  state = {
    users: [],
    success: false
  };
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
        this.setState({ users: parsedRes.finalRes, success: parsedRes.status });
      });
  }

  render() {
    console.log(this.props.username);
    return (
      <main className="admin-main">
        <div className="all-users">
          {this.state.users.map((user, idx) => (
            <UserCmp user={user} key={idx} />
          ))}
        </div>
      </main>
    );
  }
}

export default withRouter(AdminCmp);
