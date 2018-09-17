import React, { Component } from "react";
import './signupcmp.css';
class SignupComponent extends Component {
  constructor() {
    super();
    this.state = {
        form: {
          username: "",
          firstName: "",
          lastName: "",
          password: "",
          repeatPassword: ""    
        },
        formCompleted: false,
      
    };
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isCompleted = this.isCompleted.bind(this);
  }
  isCompleted(){
    for(let field in this.state.form){
      if(this.state.form[field] === ""){
        return false;
      }
    }
    return true;
  }

  submitForm(evt) {
      // PREVENT DEFAULT BEHAIVOUR
      evt.preventDefault();

      // CHECK IF PASSWORDS ARE THE SAME
      if (this.state.form.password !== this.state.form.repeatPassword) {
        let correctForm = Object.assign({}, this.state.form, {password: '', repeatPassword: ''});
        this.setState({form : correctForm});
        alert('passwords do not match');
        return;
      }

      // MAKE A COPY OF THE FORM TO SEND
      const currentState = Object.assign({}, this.state.form);
      delete currentState['repeatPassword'];
      
      // SEND INFORMATION TO SERVER
      fetch('/signup', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        body: JSON.stringify(currentState)
      })
        .then(response => response.text())
        .then(responseBody => {
          let result = JSON.parse(responseBody);
          console.log(result);
        })
        .catch(err => {
          console.log(err);
          alert('there was en error, try again.');
        })
  }

  handleChange(evt) {
    //console.log(evt);
    let change = Object.assign({}, this.state.form, {[evt.target.name]: evt.target.value});
    this.setState({form: change, formCompleted: this.isCompleted()});
  }

  render() {
    return (
      <div className="signup-Cmp">
        <h1 className="signup-title">SIGN UP</h1>
        <form onSubmit={this.submitForm} className="signup__form">
          <div className="signup__form__field">
            <label className="signup__form__labels">Username:</label>
            <input
              type="text"
              className="signup__form__input"
              name="username"
              onChange={this.handleChange}
              value={this.state.form.username}
              required
            />
          </div>
          <div className="signup__form__field">
            <label className="signup__form__labels">First Name:</label>
            <input
              type="text"
              name="firstName"
              className="signup__form__input"
              onChange={this.handleChange}
              value={this.state.form.firstName}
              required
            />
          </div>
          <div className="signup__form__field">
            <label className="signup__form__labels">Last Name:</label>
            <input
              type="text"
              name="lastName"
              className="signup__form__input"
              onChange={this.handleChange}
              value={this.state.form.lastName}
              required
            />
          </div>
          <div className="signup__form__field">
            <label className="signup__form__labels">Password:</label>
            <input
              type="password"
              name="password"
              className="signup__form__input"
              onChange={this.handleChange}
              value={this.state.form.password}
              required
            />
          </div>
          <div className="signup__form__field">
            <label className="signup__form__labels">Repeat Password:</label>
            <input
              type="password"
              name="repeatPassword"
              className="signup__form__input"
              onChange={this.handleChange}
              value={this.state.form.repeatPassword}
              required
            />
          </div>
          <div className="signup__form__field">
            <input type="submit" onClick={this.submitForm} className="signup__form__submit" disabled={!this.state.formCompleted} />
          </div>
        </form>
      </div>
    );
  }
}

export default SignupComponent;
