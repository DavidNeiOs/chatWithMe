import React from "react";
import "./HeaderCmp.css";

const HeaderCmp = props => {
  return (
    <header className="chat-header">
      <div>
        <span className="chat-header__greeting">Hello {props.username} !</span>
        <button className="chat-header__button" onClick={props.handleLogOut}>
          Log Out
        </button>
      </div>
    </header>
  );
};

export default HeaderCmp;
