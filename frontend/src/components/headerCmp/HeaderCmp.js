import React from "react";
import "./HeaderCmp.css";
import { withRouter } from "react-router-dom";

class HeaderCmp extends React.Component {
  constructor(props) {
    super(props);
    this.normalLogOut = this.normalLogOut.bind(this);
    this.adminLogOut = this.adminLogOut.bind(this);
  }
  normalLogOut() {
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
          this.props.socket.emit("leave", this.props.username);
          this.props.history.push("/");
        }
      });
  }
  adminLogOut() {
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
    return (
      <header className="chat-header">
        <div>
          <span className="chat-header__greeting">
            Hello {this.props.username} !
          </span>
          <button
            className="chat-header__button"
            onClick={this.props.admin ? this.adminLogOut : this.normalLogOut}
          >
            Log Out
          </button>
        </div>
      </header>
    );
  }
}

export default withRouter(HeaderCmp);
