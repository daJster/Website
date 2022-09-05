"use strict";
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function getKeyString(x, y) {
    return `${x}x${y}`;
}
(function () {
    firebase.auth().signInAnounymously();
})();
