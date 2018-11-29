import React, { Component } from "react";
import socketIO from "socket.io-client";
import { withRouter } from "react-router-dom";
import "./chatCmp.css";
import HeaderCmp from "../headerCmp/HeaderCmp";

class ChatCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        message: ""
      },
      messages: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    let newMsgs = [];
    // Make a connection to server and join the room
    this.socket = socketIO("http://localhost:4000");
    this.socket.emit("room", this.props.username);

    // When chat is loaded it will go and get the messages
    fetch("/getMessages", {
      method: "POST",
      mode: "same-origin",
      credentials: "include",
      body: JSON.stringify({ room: this.props.username })
    })
      .then(response => response.text())
      .then(responseBody => {
        let parsedResponse = JSON.parse(responseBody);
        newMsgs = parsedResponse.messages;
        this.setState({ messages: newMsgs.reverse() });
      });

    // Capture chat messages and add them to the page
    this.socket.on("chat message", msg => {
      newMsgs.unshift(msg);
      // console.log(newMsgs);
      this.setState({ messages: newMsgs });
    });
  }
  // *** When user presses enter or clicks on submit ***
  handleSubmit(evt) {
    evt.preventDefault();
    this.socket.emit("chat message", {
      message: this.state.form.message,
      room: this.props.username,
      user: this.props.username
    });
    let change = Object.assign(this.state.form, { message: "" });
    this.setState({ form: change });
  }
  // *** evrytime the users type on the form ***
  handleChange(evt) {
    let change = Object.assign(this.state.form, {
      [evt.target.name]: evt.target.value
    });
    this.setState({ form: change });
  }
  // *** When user clicks on the logout button ***
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
          this.socket.emit("leave", this.props.username);
          this.props.history.push("/");
        }
      });
  }

  // *** this is how we render messages ***
  renderMessages(msg, index) {
    return (
      <div
        className={msg.user === this.props.username ? "green" : "yellow"}
        key={index}
      >
        <span>{msg.message}</span>
      </div>
    );
  }

  render() {
    return (
      <main className="chat-cmp">
        <HeaderCmp
          username={this.props.username}
          handleLogOut={this.handleLogOut}
        />
        <section className="chat-background">
          <div className="chat-container">
            <div id="chat-messages">
              {this.state.messages.map((msg, idx) => {
                return this.renderMessages(msg, idx);
              })}
            </div>
            <form onSubmit={this.handleSubmit} className="chat-form">
              <input
                id="m"
                autoComplete="off"
                className="chat-form__input"
                name="message"
                onChange={this.handleChange}
                value={this.state.form.message}
              />
              <input type="submit" className="chat-form__button" value="send" />
            </form>
          </div>
        </section>
      </main>
    );
  }
}

export default withRouter(ChatCmp);
