import React, { Component } from "react";
import socketIO from "socket.io-client";
import HeaderCmp from "./components/headerCmp/HeaderCmp";
import ChatCmp from "./components/chatCmp/chatCmp";

export default class UserView extends Component {
  render() {
    const socket = socketIO("http://localhost:4000");
    return (
      <div className="user-view">
        <HeaderCmp username={this.props.username} socket={socket} />
        <ChatCmp
          username={this.props.username}
          socket={socket}
          room={this.props.username}
        />
      </div>
    );
  }
}
