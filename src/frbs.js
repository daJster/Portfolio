// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHpnQrFGKDX4yKShmBQKUyM71rVpF0XSk",
    authDomain: "jelkarchi-portfolio.firebaseapp.com",
    projectId: "jelkarchi-portfolio",
    storageBucket: "jelkarchi-portfolio.appspot.com",
    messagingSenderId: "835686109594",
    appId: "1:835686109594:web:ea5294128e256f67daaa23",
    measurementId: "G-J6FX8XRLRG"
};

// Initialize Firebase
window.app = initializeApp(firebaseConfig);
window.analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
window.auth = getAuth(app);
window.providerGoogle = new GoogleAuthProvider();
window.providerGithub = new GithubAuthProvider();

const signinEls = document.querySelectorAll(".signin-mode");
const loginEls = document.querySelectorAll(".login-mode");

window.changeToSignIn = function changeToSignIn(b){
    function dNoneEls(els, t){
        Object.keys(els).forEach( (key) => {
            const el = els[key];
            if(t){
                el.classList.add("d-none");
            } else {
                el.classList.remove("d-none");
            }
        });
    }
    if (b){
        dNoneEls(signinEls, false);
        dNoneEls(loginEls, true);
        document.querySelector("title").innerHTML="Sign in"
    } else {
        dNoneEls(signinEls, true);
        dNoneEls(loginEls, false);
        document.querySelector("title").innerHTML="Log in"
    }
}


// Authenticating users with Email + Password
window.signInEmailAndPassword = function signInEmailAndPassword(){
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    //** Creating the user's account */
    createUserWithEmailAndPassword(auth, email, password)
        .then( (userCredential) => {  // returns a promise 

            // signed in
            const user = userCredential.user;
            console.log(user);
            document.location.href = "portfolio.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode + "\n errMsg :\t" + errorMessage);
        });
}


window.logInEmailAndPassword = function logInEmailAndPassword(){
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    //**log in if the user already exists */
    signInWithEmailAndPassword(auth, email, password)
        .then( (userCredential) => {  // returns a promise 

            // signed in
            const user = userCredential.user;
            console.log(user);
            document.location.href = "portfolio.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode + "\n errMsg :\t" + errorMessage);
        });
}


// Authenticating using Google service
window.signInGoogle = function signInGoogle(){
    signInWithPopup(auth, providerGoogle)
        .then((result) => {
    
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
    
        console.log(user);
        document.location.href = "portfolio.html";

        // ...
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    
        console.log(errorCode + "\n errMsg :\t" + errorMessage + "\n credentialERR :\t" + credential);
        // ...
        });
}


// Authenticating using Github service
window.signInGithub = function signInGithub(){
    signInWithPopup(auth, providerGithub)
        .then((result) => {
    
        // This gives you a Github Access Token. You can use it to access the Google API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
    
        console.log(user);
        document.location.href = "portfolio.html";

        // ...
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
    
        console.log(errorCode + "\n errMsg :\t" + errorMessage + "\n credentialERR :\t" + credential);
        // ...
        });
}

window.logOut = function logOut(){
    signOut(auth).then(() => {
        document.location.href = "signIn.html";
    }).catch((error) => {
        // An error happened.
        console.log(error.message);
      });
}
