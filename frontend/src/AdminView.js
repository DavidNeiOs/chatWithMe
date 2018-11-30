import React, { Component } from "react";
import socketIO from "socket.io-client";
import HeaderCmp from "./components/headerCmp/HeaderCmp";
import AdminCmp from "./components/adminCmp/AdminCmp";

export default class AdminView extends Component {
  render() {
    const socket = socketIO("http://localhost:4000");
    return (
      <div className="user-view">
        <HeaderCmp username={this.props.username} socket={socket} admin />
        <AdminCmp username={this.props.username} socket={socket} />
      </div>
    );
  }
}
