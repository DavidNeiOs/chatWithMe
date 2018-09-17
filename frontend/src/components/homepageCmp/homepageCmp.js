import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './homepageCmp.css';


class HomepageComponent extends Component {
    render() {
        return (
            <div className="btns">
                <Link className="signup-btn" to="/signup">
                    SIGN UP
                </Link> 
                <Link className="login-btn" to="/login">
                    LOG IN
                </Link>
            </div>
        )
    }
}

export default HomepageComponent;