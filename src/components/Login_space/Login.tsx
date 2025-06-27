import './Login_dec.css';
import Header from '../Header_space/Header';

const Login = () => {
    return ( 
        <>
        <Header />
            <body id="login">
                <div className="box">
                <form action="">
                    <h2>Sign In</h2>
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
                    <input type="submit" value="Login" />
                    <div className="links">
                        <a href="#">Forgot Password?</a>
                        <a href="#">Sign Up</a>
                    </div>
                </form>
                </div>
            </body>
        </>
     );
}
 
export default Login;