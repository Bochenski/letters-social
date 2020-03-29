import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
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

import configureStore from "./store/configureStore";
import initialReduxState from "./constants/initialState";

import "./shared/crash";
import "./shared/service-worker";
import "./shared/vendor";
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import "./styles/styles.scss";

import { createError } from "./actions/error";
import { loginSuccess } from "./actions/auth";
import { loaded, loading } from "./actions/loading";

import { getFirebaseToken, getFirebaseUser } from "./backend/auth";

const store = configureStore(initialReduxState);

export const renderApp = (state, callback = () => {}) => {
    render(
        <Provider store={store}>
            <Router {...state}>
                <Route path="" component={App}>
                    <Route path="/" component={Home} />
                    <Route path="/posts/:postId" component={SinglePost} />
                    <Route path="/login" component={Login} />
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById("app"),
        callback
    );
};

const initialState = {
    location: window.location.pathname
};

renderApp(initialState);

history.listen(location => {
    const user = firebase.auth().currentUser;
    const newState = Object.assign({}, initialState, {
        location: user ? location.pathname : "/login"
    });
    renderApp(newState);
});

getFirebaseUser()
    .then(async user => {
        if (!user) {
            return history.push("/login");
        }
        store.dispatch(loading());
        const token = await getFirebaseToken();
        const res = await API.loadUser(user.uid);
        if (res.status == 404) {
            const userPayload = {
                name: user.displayName,
                profilePicture: user.photoURL,
                id: user.uid
            };
            const newUser = await API.createUser(userPayload).then(res =>
                res.json()
            );
            store.dispatch(loginSuccess(newUser, token));
            store.dispatch(loaded());
            history.push("/");
            return newUser;
        }
        const existingUser = await res.json();
        store.dispatch(loginSuccess(existingUser, token));
        store.dispatch(loaded());
        history.push("/");
        return existingUser;
    })
    .catch(err => createError(err));
