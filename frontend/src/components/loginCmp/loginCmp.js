import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './loginCmp.css';

class LoginCmp extends Component {
    constructor(){
        super();
        this.state = {
            form: {
                username: "",
                password: ""
            },
            formCompleted: false,
        }
        this.isCompleted = this.isCompleted.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    isCompleted() {
        for(let field in this.state.form){
            if(this.state.form[field] === ""){
              return false;
            }
          }
          return true;
    }
    handleChange(evt) {
        let change = Object.assign({}, this.state.form, {[evt.target.name]: evt.target.value});
        this.setState({form: change, formCompleted: this.isCompleted()});
    }
    handleSubmit(evt) {
        evt.preventDefault();
        console.log(this.state);
        if(this.state.formCompleted){
            const form = Object.assign({}, this.state.form);

            fetch('/login', {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'include',
                body: JSON.stringify(form)
            })
              .then(response => response.text())
              .then(responseBody => {
                  const result = JSON.parse(responseBody);
                  if(result.success && result.username !== 'davidneios') {
                    this.props.history.push('/user/' + result.username);
                    console.log(result);
                  } else if (result.success && result.username === 'davidneios') {
                    this.props.history.push('/' + result.username);
                  }
              })
        }
    }
    render () {
        return (
            <div className="login-cmp">
                <h1 className="login-title">LOG IN</h1>
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="login-form__field">
                        <label className="login-form__label">Username:</label>
                        <input 
                            type="text"
                            className="login-form__input"
                            name="username"
                            onChange={this.handleChange}
                            value={this.state.form.username}
                        />
                    </div>
                    <div className="login-form__field">
                        <label className="login-form__label">Password:</label>
                        <input 
                            type="password"
                            className="login-form__input"
                            name="password"
                            onChange={this.handleChange}
                            value={this.state.form.password}
                        />
                    </div>
                    <div className="login-form__field">
                        <input 
                            type="submit"
                            className="login-form__submit"
                            disabled={!this.state.formCompleted}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(LoginCmp);