import React, { Component } from "react";

import { history } from "../history";
import { loginWithGoogle } from "../backend/auth";
import Welcome from "../components/welcome/Welcome";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }
    login() {
        loginWithGoogle().then(() => {
            history.push("/");
        });
    }
    render() {
        return (
            <div className="login">
                <div className="welcome-container">
                    <Welcome />
                </div>
                <div className="providers">
                    <button onClick={this.login}>
                        <i className={`fa fa-google`} /> log in with Google
                    </button>
                </div>
            </div>
        );
    }
}

export default Login;
