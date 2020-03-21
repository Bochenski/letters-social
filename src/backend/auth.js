import { firebase } from "./core";

const google = new firebase.auth.GoogleAuthProvider();
google.addScope("https://www.googleapis.com/auth/userinfo.email");

export function logUserOut() {
    return firebase.auth().signOut();
}

export function loginWithGoogle() {
    return firebase.auth().signInWithPopup(google);
}

export function getFirebaseUser() {
    return new Promise(resolve =>
        firebase.auth().onAuthStateChanged(user => resolve(user))
    );
}

export function getFirebaseToken() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
        return Promise.resolve(null);
    }
    return currentUser.getIdToken(true);
}
