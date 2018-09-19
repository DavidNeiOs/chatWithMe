import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './homepageCmp.css';


class HomepageComponent extends Component {
    constructor() {
        super();
        this.state = {
            activeSession: undefined,
        }
    }
    loadChat(){
        // PUSH THE USERNAME TO THE URL SO CHAT IS RENDERED
    }
    componentDidMount() {
        // FETCH THE INFO FROM SERVER
        fetch('/session', {
            method: 'GET',
            mode: 'same-origin',
            credentials: 'include'
        })
          .then(response => response.text())
          .then(responseBody => {
              console.log(responseBody);
              let ans = JSON.parse(responseBody);
              // IN RESPONSE SET THE STATE OF ACTIVESESSION
              if(ans.success) {
                this.props.history.push('/user/' + ans.result.username);
                console.log(ans);
              } else {
                  this.setState({activeSession: false})
              }
              
          })
       
    }
    render() {
        if(this.state.activeSession === undefined) {
            return(
                // before checking the cookie
                <div className="btns">
                    <h2 className="loading">LOADING</h2>
                </div>
            )
        } else if (!this.state.activeSession) {
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
}

let homepageComponentWithRouter = withRouter(HomepageComponent)
export default homepageComponentWithRouter;