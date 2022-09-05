"use strict";
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function getKeyString(x, y) {
    return `${x}x${y}`;
}
(function () {
    firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
            // you're logged in
        }
        else {
            // you're logged out
        }
    });
    firebase.auth().signInAnonymously().catch((err) => {
        var errCode = err.code;
        var errMessage = err.message;
        alert(`${errCode}\n${errMessage}`);
    });
})();
