import './SignUp_dec.css';
import Header from '../Header_space/Header';
import React from 'react';


const SignUp: React.FC = () => {
    return (
      <>
      <Header></Header>
      <div id="sign-up">
        <div className="box">
          <span className="boxLine"></span>
          <form action="">
            <h2>Sign Up</h2>
            <div className="inputBox">
              <span>Username</span>
              <input type="text" required />
              <i></i>
            </div>
            <div className="inputBox">
              <span>Enter Password</span>
              <input type="password" required />
              <i></i>
            </div>
            <div className="inputBox">
              <span>Email Address</span>
              <input type="email" required />
              <i></i>
            </div>
            <div className="rBtn">
              <label htmlFor="" className="lbl">
                Gender :
              </label>
              <div className="radio-wrapper">
                <input type="radio" name="gender" id="male" value="male" defaultChecked />
                <label htmlFor="male">Male</label>
              </div>
              <div className="radio-wrapper">
                <input type="radio" name="gender" id="female" value="female" />
                <label htmlFor="female">Female</label>
              </div>
            </div>
            <input type="submit" value="Sign Up" />
            <div className="log-in"><p>Already have an account? <a href="">Log in</a></p></div>
          </form>
        </div>
      </div>
      </ >
    );
  };
  
  export default SignUp;
  