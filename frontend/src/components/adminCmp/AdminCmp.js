import React, { Component } from "react";

class AdminCmp extends Component {
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
      });
  }
  render() {
    return (
      <div>
        <p>Hola</p>
      </div>
    );
  }
}

export default AdminCmp;
