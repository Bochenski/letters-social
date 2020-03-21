import React from "react";
import { render } from "react-dom";
import firebase from "firebase";

import * as API from "./shared/http";
import App from "./app";
import Home from "./pages/Home";
import SinglePost from "./pages/post";
import NotFound from "./pages/404";
import Login from "./pages/Login";
import Router from "./components/router/Router";
import Route from "./components/router/Route";
import { history } from "./history";

import "./shared/crash";
import "./shared/service-worker";
import "./shared/vendor";
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import "./styles/styles.scss";
import { getFirebaseToken } from "./backend/auth";

export const renderApp = (state, callback = () => {}) => {
    render(
        <Router {...state}>
            <Route path="" component={App}>
                <Route path="/" component={Home} />
                <Route path="/posts/:postId" component={SinglePost} />
                <Route path="/login" component={Login} />
                <Route path="*" component={NotFound} />
            </Route>
        </Router>,
        document.getElementById("app"),
        callback
    );
};

let state = {
    location: window.location.pathname,
    user: {
        authenticated: false,
        profilePicture: null,
        id: null,
        name: null,
        token: null
    }
};

renderApp(state);

history.listen(location => {
    const user = firebase.auth().currentUser;
    state = Object.assign({}, state, {
        location: user ? location.pathname : "/login"
    });
    renderApp(state);
});

history.listen(location => {
    const user = firebase.auth().currentUser;
    state = Object.assign({}, state, {
        location: user ? location.pathname : "/login"
    });
    renderApp(state);
});

firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
        state = {
            location: state.locadtion,
            user: {
                authenticated: false
            }
        };
        return renderApp(state, () => {
            history.push("/login");
        });
    }
    const token = await getFirebaseToken();
    const res = await API.loadUser(user.uid);
    let renderUser;
    if (res.status === 404) {
        const userPayload = {
            name: user.displayName,
            profilePicture: user.photoURL,
            id: user.uid
        };
        renderUser = await API.createUser(userPayload).then(res => res.json());
    } else {
        renderUser = await res.json();
    }
    history.push("/");
    state = Object.assign({}, state, {
        user: {
            name: renderUser.name,
            id: renderUser.id,
            profilePicture: renderUser.porfilePiocture,
            authenticate: true
        },
        token
    });
    renderApp(state);
});
