import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./chatCmp.css";

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
    this.getMessages = this.getMessages.bind(this);
  }

  getMessages(room) {
    let newMsgs = [];
    console.log(room);
    this.props.socket.emit("room", room);

    // When chat is loaded it will go and get the messages
    fetch("/getMessages", {
      method: "POST",
      mode: "same-origin",
      credentials: "include",
      body: JSON.stringify({ room: room })
    })
      .then(response => response.text())
      .then(responseBody => {
        let parsedResponse = JSON.parse(responseBody);
        newMsgs = parsedResponse.messages;
        this.setState({ messages: newMsgs.reverse() });
      });

    // Capture chat messages and add them to the page
    this.props.socket.on("chat message", msg => {
      newMsgs.unshift(msg);
      // console.log(newMsgs);
      this.setState({ messages: newMsgs });
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.props.socket.on("leave", this.props.room);
    this.getMessages(nextProps.room);
  }
  componentDidMount() {
    this.getMessages(this.props.room);
  }
  // *** When user presses enter or clicks on submit ***
  handleSubmit(evt) {
    evt.preventDefault();
    this.props.socket.emit("chat message", {
      message: this.state.form.message,
      room: this.props.room,
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
