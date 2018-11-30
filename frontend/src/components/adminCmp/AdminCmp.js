import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./AdminCmp.css";
import ChatCmp from "../chatCmp/chatCmp";

const UserCmp = ({ user, onClick }) => (
  <div className="user-container" onClick={onClick}>
    <p className="user-id">
      <span className="user-username">{user.username}</span> -{" "}
      <span>{user.firstName}</span>
    </p>
  </div>
);

class AdminCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      chatOfUser: "",
      success: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
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
        this.setState({ users: parsedRes.finalRes, success: parsedRes.status });
      });
  }
  handleClick = username => {
    this.setState({ chatOfUser: username });
  };
  render() {
    console.log(this.state.chatOfUser);
    return (
      <main className="admin-main">
        <div className="all-users">
          {this.state.users.map((user, idx) => (
            <UserCmp
              user={user}
              key={idx}
              onClick={() => this.handleClick(user.username)}
            />
          ))}
        </div>
        {!this.state.chatOfUser ? (
          <div>
            <p>choose an user to chat</p>
          </div>
        ) : (
          <ChatCmp
            username={this.props.username}
            socket={this.props.socket}
            room={
              this.state.chatOfUser
                ? this.state.chatOfUser
                : this.props.username
            }
          />
        )}
      </main>
    );
  }
}

export default withRouter(AdminCmp);
