import React, { Component } from "react";
import "./chatCmp.css";
import socketIO from "socket.io-client";

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
  }

  componentDidMount() {
    let newMsgs = [];
    // MAKE CONNECTION TO THE SERVER AND JOIN THE ROOM
    this.socket = socketIO("http://localhost:4000");
    this.socket.emit("room", this.props.username);

    // WHEN CHAT IS LOADED IT WILL GO FIND ALL MESSAGES
    fetch("/getMessages", {
      method: "POST",
      body: JSON.stringify({ room: this.props.username })
    })
      .then(response => response.text())
      .then(responseBody => {
        let parsedResponse = JSON.parse(responseBody);
        newMsgs = parsedResponse.messages;
        this.setState({ messages: newMsgs.reverse() });
      });

    // CAPTURE CHAT MESSAGES AND ADDED TO PAGE
    this.socket.on("chat message", msg => {
      newMsgs.unshift(msg);
      // console.log(newMsgs);
      this.setState({ messages: newMsgs });
    });
  }

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

  handleChange(evt) {
    let change = Object.assign(this.state.form, {
      [evt.target.name]: evt.target.value
    });
    this.setState({ form: change });
  }

  renderMessages(msg, index) {
    return (
      <div 
        className={msg.user === this.props.username ? 'green' : 'yellow'} 
        key={index}
      >
        <span>{msg.message}</span>
      </div>
    );
  }
  render() {
    return (
      <div className="background">
        <div className="chat-container">
          <div id="messages">
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
      </div>
    );
  }
}

export default ChatCmp;
