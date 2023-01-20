// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, 
    collection, 
    getDocs,
    addDoc,
    updateDoc,
    doc,
    Timestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithRedirect,
    inMemoryPersistence,
    setPersistence,
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
const warningMessage = document.querySelector(".warning-message");
const warningMessageContainer = document.querySelector(".warning-message-container");
window.currentUser = null;

window.changeToSignIn = function changeToSignIn(b){
    const signInScreen = document.querySelector(".sign-in-screen");

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
        signInScreen.classList.add("fade");
        dNoneEls(signinEls, false);
        dNoneEls(loginEls, true);
        document.querySelector("title").innerHTML="Sign in";
        setTimeout( () => {
            signInScreen.classList.remove("fade");
        }, 200);
    } else {
        signInScreen.classList.add("fade");
        dNoneEls(signinEls, true);
        dNoneEls(loginEls, false);
        document.querySelector("title").innerHTML="Log in";
        setTimeout( () => {
            signInScreen.classList.remove("fade");
        }, 200);
    }
}

window.showWarningContainer = function showWarningContainer(){
    warningMessageContainer.classList.add("isVisible");
}

window.hideWarningContainer = function hideWarningContainer(){
    warningMessageContainer.classList.remove("isVisible");    
}

// Authenticating users with Email + Password
window.signInEmailAndPassword = function signInEmailAndPassword(){
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    //** Creating the user's account */
    createUserWithEmailAndPassword(auth, email, password)
        .then( (userCredential) => {  // returns a promise 
            if (notARobot === false){
                const recaptchaCol = document.querySelector(".recaptcha-col");
                recaptchaCol.classList.add("isRed");
                setTimeout( () => {
                    recaptchaCol.classList.remove("isRed");
                }, 400)
                return false;
            }                    
            // signed in
            const user = userCredential.user;
            window.currentUser = user;
            window.username = user.email.split("@")[0];
            window.showPortfolio(true);
            main();
            return false;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            warningMessage.innerHTML = errorCode;
            window.showWarningContainer();
            return false;
        });
}


window.logInEmailAndPassword = function logInEmailAndPassword(){
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;
    //**log in if the user already exists */
    signInWithEmailAndPassword(auth, email, password)
        .then( (userCredential) => {  // returns a promise 
            if (notARobot === false){
                const recaptchaCol = document.querySelector(".recaptcha-col");
                recaptchaCol.classList.add("isRed");
                setTimeout( () => {
                    recaptchaCol.classList.remove("isRed");
                }, 800)
                return false;
            }                        
            // signed in
            const user = userCredential.user;
            window.currentUser = user;
            window.username = user.email.split("@")[0];
            window.showPortfolio(true);
            main();
            return false;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            warningMessage.innerHTML = errorCode;
            window.showWarningContainer();
            return false;
        });
}


// Authenticating using Google service
window.signInGoogle = function signInGoogle(){
    signInWithRedirect(auth, providerGoogle)
        .then((result) => {
    
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
    
        window.currentUser = user;
        window.username = user.email.split("@")[0];
        window.showPortfolio(true);
        main();
        // ...
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    
        warningMessage.innerHTML = errorCode;
        window.showWarningContainer();
        // ...
        });
}


// Authenticating using Github service
window.signInGithub = function signInGithub(){
    signInWithRedirect(auth, providerGithub)
        .then((result) => {
    
        // This gives you a Github Access Token. You can use it to access the Google API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
    
        window.currentUser = user;
        window.username = user.email.split("@")[0];
        window.showPortfolio(true);
        main();
        // ...
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
            
        warningMessage.innerHTML = errorCode;
        window.showWarningContainer();
        // ...
        });
}

window.showPortfolio = function showPortfolio(b){
    if (b){
        document.querySelector("title").innerHTML = "Jad Elkarchi";
        signScreen.classList.add("d-none");
        Object.keys(signScreen.children).forEach( (key) => {
            signScreen.children[key].classList.add("d-none");
        });

        portfolioScreen.classList.remove("d-none");
        Object.keys(portfolioScreen.children).forEach( (key) => {
            portfolioScreen.children[key].classList.remove("d-none");
        });
        Object.keys(footerEls).forEach( (key) => {
            const footerEl = footerEls[key];
            footerEl.classList.remove("d-none");
        });
        document.querySelector(".gamejam-page").classList.add("d-none");
    } else {
        document.querySelector("title").innerHTML = "Log in";
        signScreen.classList.remove("d-none");
        Object.keys(signScreen.children).forEach( (key) => {
            signScreen.children[key].classList.remove("d-none");
        });
        portfolioScreen.classList.add("d-none");
        Object.keys(portfolioScreen.children).forEach( (key) => {
            portfolioScreen.children[key].classList.add("d-none");
        });
        Object.keys(footerEls).forEach( (key) => {
            const footerEl = footerEls[key];
            footerEl.classList.add("d-none");
        });
    }
    document.location.href = "#";
}

if (window.currentUser === null) {
    setPersistence(auth, inMemoryPersistence)
    .then(() => {
      const providerGoogle = new GoogleAuthProvider();
      // In memory persistence will be applied to the signed in Google user
      // even though the persistence was set to 'none' and a page redirect
      // occurred.
      return signInWithRedirect(auth, providerGoogle);
    })
    .then((result) => { // duplication of code to FIX !
      
      // This gives you a Github Access Token. You can use it to access the Google API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
  
      window.currentUser = user;
      window.username = user.email.split("@")[0];
      window.showPortfolio(true);
      main();
      // ...
      }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
  
      warningMessage.innerHTML = errorCode;
      // ...
      })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
  
      console.log(error.message);
    });
}


window.logOut = function logOut(){
    const password = document.querySelector(".password");
    password.value = ""; 
    signOut(auth).then(() => {
        window.showPortfolio(false);
    }).catch((error) => {
        // An error happened.
        console.log(error.message);
      });
}

window.sendComment = function sendComment(){
    const message = document.querySelector(".textarea-message");
    // send message to firestore
    const userDoc = getDocByEmail(window.users, window.currentUser.email);
    const userDocRef = doc(window.db, 'users', userDoc.id);
    console.log(userDocRef, message.value);

    updateDoc(userDocRef, { // uploading comment
        comment: message.value
    })
    .then(() => {
        const textareaContainer = document.querySelector(".textarea-container");
        const textareaSendSuccess = document.querySelector(".textarea-send-success");
    
        textareaContainer.classList.remove("isVisible");
        setTimeout( () => {
            textareaContainer.classList.add("d-none");
        }, 800);
    
        setTimeout( () => {
            textareaSendSuccess.classList.add("isVisible");
        }, 1000);
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });

    message.value = "";
}

function isInCollection(users, email){ // only used with firestore docs
    for (const user of Object.values(users)) {
        if (user.email === email) {
          return true;
        }
      }
    return false;
}

function getDocByEmail(users, email){
    for (const user of Object.values(users)) {
        if (user.email === email) {
          return user;
        }
      }
    return null;
}

function main(){
    window.users = [];
    const user = window.currentUser;
    const username = window.username;
    const currentDate = Timestamp.now();
    var userAlreadyExistsInDb = false;

    window.db = getFirestore();
    window.colRef = collection(window.db, "users");

    getDocs(window.colRef)
    .then( (snapshot) =>{
        // Inside snapshot promise
        snapshot.docs.forEach((doc) =>{
            window.users.push({ ...doc.data(), id : doc.id, doc: doc});
        })

        userAlreadyExistsInDb = isInCollection(window.users, user.email);

        if(!userAlreadyExistsInDb){
            addDoc(window.colRef, {
                email : window.currentUser.email,
                comment : "",
                date: currentDate,
                username : window.username,
            })
            .then( () => {
            })
            .catch( (err) => {
                console.log( err.message);
            })
        }

    })
    .catch((err) => {
        console.log(err.message);
    });

    document.querySelector(".username").innerHTML = username;
}


window.showPortfolio(false);