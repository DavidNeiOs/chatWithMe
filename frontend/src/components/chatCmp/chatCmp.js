import React, { Component } from "react";
import './chatCmp.css';
import socketIO from "socket.io-client";

class ChatCmp extends Component {
  
  constructor() {
      super();
      this.state = {
          form: {
              message: ''
          },
          messages: []
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.renderMessages = this.renderMessages.bind(this);
  }
  
  componentDidMount() {

    this.socket = socketIO("http://localhost:4000");
    this.socket.on('chat message', msg => {
        let newMsgs = this.state.messages.slice();
        newMsgs.push(msg);
        this.setState({messages: newMsgs});
    })

  }

  handleSubmit(evt) {

    evt.preventDefault();
    this.socket.emit('chat message', this.state.form.message);
    let change = Object.assign(this.state.form, {message : ""});
    this.setState({form: change});

  }

  handleChange(evt) {

      let change = Object.assign(this.state.form, {[evt.target.name]: evt.target.value});
      this.setState({form: change});

  }

  renderMessages(msg) {
    return (
        <li>
            {msg}
        </li>
    )
  }
  render() {
    return (
      <div className="chat-container">
        <ul id="messages">
            {this.state.messages.map(msg => {
                return this.renderMessages(msg);
            })}
        </ul>
        <form onSubmit={this.handleSubmit} className="chat-form">
          <input 
            id="m"
            autoComplete="off"
            className="chat-form__input"
            name="message"
            onChange={this.handleChange}
            value={this.state.form.message}
          />
          <input type="submit" className="chat-form__button" />
          
        </form>
        
      </div>
    );
  }
}

export default ChatCmp;
