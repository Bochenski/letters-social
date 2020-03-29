import * as types from "../constants/types";
import { history } from "../history";
import { createError } from "./error";
import * as API from "../shared/http";
import { loading, loaded } from "./loading";
import {
    getFirebaseUser,
    loginWithGoogle,
    logUserOut,
    getFirebaseToken
} from "../backend/auth";

export function loginSuccess(user, token) {
    return {
        type: types.auth.LOGIN_SUCCESS,
        user,
        token
    };
}

export function logoutSuccess() {
    return {
        type: types.auth.LOGOUT_SUCCESS
    };
}

export function logout() {
    return dispatch => {
        return logUserOut()
            .then(() => {
                history.push("./login");
                dispatch(logoutSuccess());
                window.Raven.setUserContext();
            })
            .catch(err => dispatch(createError(err)));
    };
}

export function login() {
    return dispatch => {
        return loginWithGoogle().then(async () => {
            try {
                dispatch(loading());
                const user = await getFirebaseUser();
                const token = await getFirebaseToken();
                const res = await API.loadUser(user.uid);
                if (res.status === 404) {
                    const userPayload = {
                        name: user.displayName,
                        profilePicture: user.photoURL,
                        id: user.uid
                    };
                    const newUser = await API.createUser(userPayload).then(
                        res => res.json()
                    );
                    dispatch(loginSuccess(newUser, token));
                    dispatch(loaded());
                    history.push("/");
                    return newUser;
                }
                const existingUser = await res.json();
                dispatch(loginSuccess(existingUser, token));
                dispatch(loaded());
                history.push("/");
                return existingUser;
            } catch (err) {
                dispatch(createError(err));
            }
        });
    };
}
