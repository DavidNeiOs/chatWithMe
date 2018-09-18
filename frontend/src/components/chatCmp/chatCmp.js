import React, { Component } from "react";
import './chatCmp.css';
import socketIO from "socket.io-client";

class ChatCmp extends Component {
  
  constructor(props) {
      super(props);
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
    let newMsgs = [];
    // MAKE CONNECTION TO THE SERVER AND JOIN THE ROOM
    this.socket = socketIO("http://localhost:4000");
    this.socket.emit('room', this.props.username);
    // CAPTURE CHAT MESSAGES AND ADDED TO PAGE
    this.socket.on('chat message', msg => {
      newMsgs.push(msg);
      this.setState({messages : newMsgs})
    }) 

    // WHEN CHAT IS LOADED IT WILL GO FIND ALL MESSAGES
    fetch('/getMessages', {
      method: 'POST',
      body: JSON.stringify({room: this.props.username})
    })
      .then(response => response.text())
      .then(responseBody => {
        let parsedResponse = JSON.parse(responseBody);
        newMsgs = parsedResponse.messages;
        this.setState({messages: newMsgs});
      })   
  }

  handleSubmit(evt) {

    evt.preventDefault();
    this.socket.emit('chat message', { message: this.state.form.message, 
      room: this.props.username, 
      user: this.props.username
    });
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
            {msg.user + ': ' + msg.message}
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
